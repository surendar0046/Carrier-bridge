import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pool } from '../../config/db';
import { cache } from '../../config/redis';
import { validateQuestionDataset, DatasetQuestion } from './validation';

export interface ImportOptions {
  filePath?: string;
  dryRun?: boolean;
  force?: boolean;
}

export interface ImportResult {
  sha256: string;
  totalInFile: number;
  validCount: number;
  invalidCount: number;
  insertedCount: number;
  updatedCount: number;
  skippedCount: number;
  deactivatedCount: number;
  dryRun: boolean;
}

export async function importAssessmentQuestions(options: ImportOptions = {}): Promise<ImportResult> {
  // Determine file path
  let targetFile = options.filePath;
  if (!targetFile) {
    const defaultPaths = [
      path.resolve(__dirname, '../../../../../data/assessment_questions.json'),
      path.resolve(process.cwd(), 'data/assessment_questions.json'),
      path.resolve(process.cwd(), '../../data/assessment_questions.json'),
      path.resolve(__dirname, '../../../data/assessment_questions.json'),
    ];
    targetFile = defaultPaths.find((p) => fs.existsSync(p));
  }

  if (!targetFile || !fs.existsSync(targetFile)) {
    throw new Error(`Assessment questions file not found. Checked: ${targetFile}`);
  }

  console.log(`[Import] Reading assessment dataset from: ${targetFile}`);
  const fileContent = fs.readFileSync(targetFile, 'utf-8');

  // Compute SHA256 Hash
  const hash = crypto.createHash('sha256').update(fileContent).digest('hex');
  console.log(`[Import] Dataset SHA256: ${hash}`);

  // Parse JSON
  let rawData: unknown[];
  try {
    rawData = JSON.parse(fileContent);
    if (!Array.isArray(rawData)) {
      throw new Error('Dataset root must be an array of question objects.');
    }
  } catch (err: any) {
    console.error('[Import] Failed to parse JSON dataset:', err.message);
    throw err;
  }

  // Validate with Zod
  const { valid, report } = validateQuestionDataset(rawData);

  if (report.invalidCount > 0) {
    console.warn('\n═══════════════════════════════════════════════════════════════');
    console.warn(`[Import Report] ⚠️ Found ${report.invalidCount} invalid row(s) out of ${report.totalRows}:`);
    report.errors.forEach((err) => {
      console.warn(`  • Row ${err.rowNumber} (ID: ${err.id || 'N/A'}):`);
      err.errors.forEach((msg) => console.warn(`      - ${msg}`));
    });
    console.warn('═══════════════════════════════════════════════════════════════\n');
  }

  if (options.dryRun) {
    console.log('[Import] DRY RUN requested. No changes written to database.');
    return {
      sha256: hash,
      totalInFile: rawData.length,
      validCount: valid.length,
      invalidCount: report.invalidCount,
      insertedCount: 0,
      updatedCount: 0,
      skippedCount: valid.length,
      deactivatedCount: 0,
      dryRun: true,
    };
  }

  const client = await pool.connect();

  try {
    // Check if this hash is already imported
    const versionCheck = await client.query(
      'SELECT id, imported_at FROM dataset_versions WHERE sha256 = $1',
      [hash]
    );

    if (versionCheck.rowCount && versionCheck.rowCount > 0 && !options.force) {
      console.log(
        `[Import] Dataset with SHA256 ${hash.substring(0, 12)} was already imported on ${versionCheck.rows[0].imported_at}. Skipping.`
      );
      return {
        sha256: hash,
        totalInFile: rawData.length,
        validCount: valid.length,
        invalidCount: report.invalidCount,
        insertedCount: 0,
        updatedCount: 0,
        skippedCount: valid.length,
        deactivatedCount: 0,
        dryRun: false,
      };
    }

    await client.query('BEGIN');

    // 1. Fetch domain slugs -> domain ids
    const domainRes = await client.query('SELECT id, slug FROM domains');
    const domainMap = new Map<string, string>();
    domainRes.rows.forEach((r) => domainMap.set(r.slug, r.id));

    // If any domain used in weights is missing from domains table, insert it dynamically
    const slugsInDataset = new Set<string>();
    valid.forEach((q) => {
      ['A', 'B', 'C', 'D'].forEach((key) => {
        const weights = (q.domain_weights as any)?.[key] || {};
        Object.keys(weights).forEach((s) => slugsInDataset.add(s));
      });
    });

    for (const slug of slugsInDataset) {
      if (!domainMap.has(slug)) {
        const name = slug
          .split('_')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        const id = `dom_${slug}`;
        await client.query(
          'INSERT INTO domains (id, name, slug, description) VALUES ($1, $2, $3, $4) ON CONFLICT (slug) DO NOTHING',
          [id, name, slug, `Domain track for ${name}`]
        );
        domainMap.set(slug, id);
      }
    }

    // 2. Fetch existing question IDs
    const existingQRes = await client.query('SELECT id FROM assessment_questions');
    const existingQIds = new Set(existingQRes.rows.map((r) => r.id));

    let insertedCount = 0;
    let updatedCount = 0;
    const currentValidIds = valid.map((q) => q.id);

    // 3. Upsert valid questions
    for (const q of valid) {
      const isExisting = existingQIds.has(q.id);

      await client.query(
        `INSERT INTO assessment_questions (
          id, audience, section, question, options, correct_answer, difficulty, explanation, is_active, dataset_version, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, $9, NOW())
        ON CONFLICT (id) DO UPDATE SET
          audience = EXCLUDED.audience,
          section = EXCLUDED.section,
          question = EXCLUDED.question,
          options = EXCLUDED.options,
          correct_answer = EXCLUDED.correct_answer,
          difficulty = EXCLUDED.difficulty,
          explanation = EXCLUDED.explanation,
          is_active = true,
          dataset_version = EXCLUDED.dataset_version,
          updated_at = NOW()`,
        [
          q.id,
          q.audience,
          q.section,
          q.question,
          JSON.stringify(q.options),
          q.correct_answer || null,
          q.difficulty,
          q.explanation || '',
          hash.substring(0, 12),
        ]
      );

      if (isExisting) {
        updatedCount += 1;
      } else {
        insertedCount += 1;
      }

      // Re-seed weights for this question
      await client.query('DELETE FROM question_domain_weights WHERE question_id = $1', [q.id]);

      const optKeys: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];
      for (const optKey of optKeys) {
        const weights = (q.domain_weights as any)?.[optKey] || {};
        for (const [slug, weight] of Object.entries(weights)) {
          const domainId = domainMap.get(slug);
          if (domainId && typeof weight === 'number' && weight >= 0 && weight <= 3) {
            await client.query(
              `INSERT INTO question_domain_weights (question_id, option_key, domain_id, weight)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (question_id, option_key, domain_id) DO UPDATE SET weight = EXCLUDED.weight`,
              [q.id, optKey, domainId, weight]
            );
          }
        }
      }
    }

    // 4. Soft-deactivate questions that were removed from file (Never delete!)
    let deactivatedCount = 0;
    if (currentValidIds.length > 0) {
      const deactRes = await client.query(
        `UPDATE assessment_questions
         SET is_active = false, updated_at = NOW()
         WHERE is_active = true AND NOT (id = ANY($1::text[]))`,
        [currentValidIds]
      );
      deactivatedCount = deactRes.rowCount || 0;
    }

    // 5. Record dataset version
    await client.query(
      `INSERT INTO dataset_versions (version, sha256, filename, row_count)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (sha256) DO NOTHING`,
      [
        hash.substring(0, 12),
        hash,
        path.basename(targetFile),
        valid.length,
      ]
    );

    await client.query('COMMIT');

    // Invalidate Redis cache
    await cache.del('assessment_questions_');

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('[Import Finished Successfully]');
    console.log(`  • Total in file : ${rawData.length}`);
    console.log(`  • Valid rows    : ${valid.length}`);
    console.log(`  • Invalid rows  : ${report.invalidCount}`);
    console.log(`  • Inserted      : ${insertedCount}`);
    console.log(`  • Updated       : ${updatedCount}`);
    console.log(`  • Deactivated   : ${deactivatedCount}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

    return {
      sha256: hash,
      totalInFile: rawData.length,
      validCount: valid.length,
      invalidCount: report.invalidCount,
      insertedCount,
      updatedCount,
      skippedCount: 0,
      deactivatedCount,
      dryRun: false,
    };
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('[Import] Failed to import assessment questions:', err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Allow CLI execution: tsx src/modules/assessment/importer.ts [--dry-run] [--file <path>] [--force]
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const fileArgIndex = args.indexOf('--file');
  const filePath = fileArgIndex !== -1 && args[fileArgIndex + 1] ? args[fileArgIndex + 1] : undefined;

  importAssessmentQuestions({ dryRun, force, filePath })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
