"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAssessmentMigrations = runAssessmentMigrations;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../../config/db");
async function runAssessmentMigrations(direction = 'up') {
    const fileName = direction === 'up' ? '001_assessment_tables.up.sql' : '001_assessment_tables.down.sql';
    const candidatePaths = [
        path_1.default.join(__dirname, 'migrations', fileName),
        path_1.default.join(process.cwd(), 'src/modules/assessment/migrations', fileName),
        path_1.default.join(process.cwd(), 'backend/gateway/src/modules/assessment/migrations', fileName),
        path_1.default.resolve(__dirname, '../../src/modules/assessment/migrations', fileName),
    ];
    const filePath = candidatePaths.find((p) => fs_1.default.existsSync(p));
    if (!filePath) {
        throw new Error(`Migration file ${fileName} not found. Checked: ${candidatePaths.join(', ')}`);
    }
    const sql = fs_1.default.readFileSync(filePath, 'utf-8');
    const client = await db_1.pool.connect();
    try {
        console.log(`[Migration] Executing assessment migration (${direction})...`);
        await client.query(sql);
        console.log(`[Migration] Assessment migration (${direction}) completed successfully.`);
    }
    catch (err) {
        console.error(`[Migration] Migration (${direction}) failed:`, err.message);
        throw err;
    }
    finally {
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
