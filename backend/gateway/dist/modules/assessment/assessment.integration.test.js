"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const validation_1 = require("./validation");
const scoring_1 = require("./scoring");
const scoringConfig_1 = require("../../config/scoringConfig");
(0, vitest_1.describe)('Assessment System End-to-End Logic Integration', () => {
    const datasetPath = path_1.default.resolve(__dirname, '../../../../../data/assessment_questions.json');
    (0, vitest_1.it)('loads and validates all questions from /data/assessment_questions.json', () => {
        (0, vitest_1.expect)(fs_1.default.existsSync(datasetPath)).toBe(true);
        const content = fs_1.default.readFileSync(datasetPath, 'utf-8');
        const rawQuestions = JSON.parse(content);
        const { valid, report } = (0, validation_1.validateQuestionDataset)(rawQuestions);
        (0, vitest_1.expect)(report.invalidCount).toBe(0);
        (0, vitest_1.expect)(valid.length).toBeGreaterThanOrEqual(10);
    });
    (0, vitest_1.it)('runs a complete assessment attempt simulation and produces valid recommendation', () => {
        const content = fs_1.default.readFileSync(datasetPath, 'utf-8');
        const rawQuestions = JSON.parse(content);
        const { valid } = (0, validation_1.validateQuestionDataset)(rawQuestions);
        const domains = [
            { id: 'dom_software', name: 'Software Engineering', slug: 'software_development' },
            { id: 'dom_data_ai', name: 'Data Science & AI', slug: 'data_science' },
            { id: 'dom_cybersecurity', name: 'Cybersecurity', slug: 'cybersecurity' },
            { id: 'dom_ui_ux', name: 'UI/UX & Product Design', slug: 'ui_ux_design' },
            { id: 'dom_product', name: 'Product & Tech Management', slug: 'product_management' },
        ];
        const questions = valid.map((q) => ({
            id: q.id,
            section: q.section,
            correct_answer: q.correct_answer,
            domain_weights: q.domain_weights,
        }));
        // Simulate student answering: choose 'B' for technical, 'A' for scenario, 'B' for aptitude
        const responses = questions.map((q) => {
            let selectedOption = 'B';
            if (q.section === 'technical')
                selectedOption = 'B';
            if (q.section === 'aptitude')
                selectedOption = q.correct_answer || 'B';
            if (q.section === 'interest')
                selectedOption = 'A';
            return {
                question_id: q.id,
                selected_option: selectedOption,
                time_spent_seconds: 15,
            };
        });
        const result = (0, scoring_1.calculateAssessmentScores)(questions, responses, domains, scoringConfig_1.defaultScoringConfig);
        // Assertions on result integrity
        (0, vitest_1.expect)(result.top_domains).toHaveLength(3);
        (0, vitest_1.expect)(result.aptitude_percent).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.section_scores.technical.answered).toBeGreaterThan(0);
        result.all_domain_scores.forEach((dom) => {
            (0, vitest_1.expect)(dom.final_match_percent).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(dom.final_match_percent).toBeLessThanOrEqual(100);
            (0, vitest_1.expect)(dom.domain_fit_percent).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(dom.domain_fit_percent).toBeLessThanOrEqual(100);
        });
        // Check top domain has the highest score
        (0, vitest_1.expect)(result.top_domains[0].match_percent).toBeGreaterThanOrEqual(result.top_domains[1].match_percent);
    });
});
