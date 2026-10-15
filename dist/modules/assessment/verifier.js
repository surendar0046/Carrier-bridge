"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAssessmentSystem = verifyAssessmentSystem;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../../config/db");
async function verifyAssessmentSystem() {
    const checks = [];
    // 1. Locate dataset file
    const defaultPaths = [
        path_1.default.resolve(__dirname, '../../../../../data/assessment_questions.json'),
        path_1.default.resolve(process.cwd(), 'data/assessment_questions.json'),
        path_1.default.resolve(process.cwd(), '../../data/assessment_questions.json'),
    ];
    const targetFile = defaultPaths.find((p) => fs_1.default.existsSync(p));
    if (!targetFile) {
        checks.push({
            name: 'Dataset File Exists',
            passed: false,
            details: 'Could not find data/assessment_questions.json',
        });
        return { passed: false, checks };
    }
    const fileContent = fs_1.default.readFileSync(targetFile, 'utf-8');
    const fileJson = JSON.parse(fileContent);
    const expectedCount = Array.isArray(fileJson) ? fileJson.length : 0;
    const client = await db_1.pool.connect();
    try {
        // Check 1: Active question count matches file
        const qCountRes = await client.query('SELECT COUNT(*) as count FROM assessment_questions WHERE is_active = true');
        const dbActiveCount = Number(qCountRes.rows[0]?.count || 0);
        const countMatches = dbActiveCount === expectedCount;
        checks.push({
            name: 'Question Count Matches Dataset File',
            passed: countMatches,
            details: `Active in DB: ${dbActiveCount}, In file: ${expectedCount}`,
        });
        // Check 2: No orphan foreign keys in question_domain_weights
        const orphanWeightsRes = await client.query(`SELECT COUNT(*) as count
       FROM question_domain_weights w
       LEFT JOIN assessment_questions q ON w.question_id = q.id
       WHERE q.id IS NULL`);
        const orphanWeights = Number(orphanWeightsRes.rows[0]?.count || 0);
        checks.push({
            name: 'No Orphan Foreign Keys in Domain Weights',
            passed: orphanWeights === 0,
            details: `Orphan weight records: ${orphanWeights}`,
        });
        // Check 3: Every active question has at least one domain weight assigned
        const unweightedQRes = await client.query(`SELECT q.id
       FROM assessment_questions q
       LEFT JOIN question_domain_weights w ON q.id = w.question_id
       WHERE q.is_active = true
       GROUP BY q.id
       HAVING COUNT(w.id) = 0`);
        const unweightedCount = unweightedQRes.rowCount || 0;
        checks.push({
            name: 'Every Active Question Has Domain Weights',
            passed: unweightedCount === 0,
            details: `Unweighted active questions: ${unweightedCount} ${unweightedCount > 0 ? `(IDs: ${unweightedQRes.rows.map((r) => r.id).join(', ')})` : ''}`,
        });
        // Check 4: No orphan foreign keys in responses or results
        const orphanRespRes = await client.query(`SELECT COUNT(*) as count
       FROM assessment_responses r
       LEFT JOIN assessment_attempts a ON r.attempt_id = a.id
       WHERE a.id IS NULL`);
        const orphanResponses = Number(orphanRespRes.rows[0]?.count || 0);
        checks.push({
            name: 'No Orphan Responses',
            passed: orphanResponses === 0,
            details: `Orphan responses: ${orphanResponses}`,
        });
        // Check 5: No score outside 0-100 in assessment_results
        const resultsRes = await client.query('SELECT id, section_scores, top_domains FROM assessment_results');
        let outOfBoundsCount = 0;
        resultsRes.rows.forEach((row) => {
            // check top_domains
            if (Array.isArray(row.top_domains)) {
                row.top_domains.forEach((d) => {
                    if (d.match_percent < 0 || d.match_percent > 100) {
                        outOfBoundsCount += 1;
                    }
                });
            }
            // check section_scores
            if (row.section_scores && typeof row.section_scores === 'object') {
                Object.values(row.section_scores).forEach((sec) => {
                    if (sec && typeof sec.score_percent === 'number') {
                        if (sec.score_percent < 0 || sec.score_percent > 100) {
                            outOfBoundsCount += 1;
                        }
                    }
                });
            }
        });
        checks.push({
            name: 'No Scores Outside Range 0-100',
            passed: outOfBoundsCount === 0,
            details: `Out of bounds score instances: ${outOfBoundsCount}`,
        });
        const allPassed = checks.every((c) => c.passed);
        return { passed: allPassed, checks };
    }
    finally {
        client.release();
    }
}
// Allow CLI execution: tsx src/modules/assessment/verifier.ts
if (require.main === module) {
    verifyAssessmentSystem()
        .then((result) => {
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('         ASSESSMENT VERIFICATION REPORT');
        console.log('═══════════════════════════════════════════════════════════════');
        result.checks.forEach((c) => {
            const mark = c.passed ? '✓ PASS' : '✗ FAIL';
            console.log(`[${mark}] ${c.name}`);
            console.log(`       Details: ${c.details}`);
        });
        console.log('═══════════════════════════════════════════════════════════════');
        if (result.passed) {
            console.log(' OVERALL RESULT: >>> PASS <<<');
            console.log('═══════════════════════════════════════════════════════════════\n');
            process.exit(0);
        }
        else {
            console.error(' OVERALL RESULT: >>> FAIL <<<');
            console.log('═══════════════════════════════════════════════════════════════\n');
            process.exit(1);
        }
    })
        .catch((err) => {
        console.error('\nVerification encountered error:', err.message);
        console.error(' OVERALL RESULT: >>> FAIL <<<\n');
        process.exit(1);
    });
}
