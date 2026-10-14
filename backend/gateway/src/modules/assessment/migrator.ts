import fs from 'fs';
import path from 'path';
import { pool } from '../../config/db';

export async function runAssessmentMigrations(direction: 'up' | 'down' = 'up'): Promise<void> {
  const fileName = direction === 'up' ? '001_assessment_tables.up.sql' : '001_assessment_tables.down.sql';
  const candidatePaths = [
    path.join(__dirname, 'migrations', fileName),
    path.join(process.cwd(), 'src/modules/assessment/migrations', fileName),
    path.join(process.cwd(), 'backend/gateway/src/modules/assessment/migrations', fileName),
    path.resolve(__dirname, '../../src/modules/assessment/migrations', fileName),
  ];
  const filePath = candidatePaths.find((p) => fs.existsSync(p));

  if (!filePath) {
    throw new Error(`Migration file ${fileName} not found. Checked: ${candidatePaths.join(', ')}`);
  }

  const sql = fs.readFileSync(filePath, 'utf-8');
  const client = await pool.connect();

  try {
    console.log(`[Migration] Executing assessment migration (${direction})...`);
    await client.query(sql);
    console.log(`[Migration] Assessment migration (${direction}) completed successfully.`);
  } catch (err: any) {
    console.error(`[Migration] Migration (${direction}) failed:`, err.message);
    throw err;
  } finally {
    client.release();
  }
}

// Allow direct execution via CLI
if (require.main === module) {
  const direction = process.argv.includes('--down') ? 'down' : 'up';
  runAssessmentMigrations(direction)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
