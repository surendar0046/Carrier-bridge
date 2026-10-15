"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const scoring_1 = require("./scoring");
const scoringConfig_1 = require("../../config/scoringConfig");
const validation_1 = require("./validation");
(0, vitest_1.describe)('Assessment Scoring Engine (Pure Functions)', () => {
    const domains = [
        { id: 'dom-1', name: 'Software Development', slug: 'software_development' },
        { id: 'dom-2', name: 'Data Science & AI', slug: 'data_science' },
        { id: 'dom-3', name: 'Cybersecurity', slug: 'cybersecurity' },
        { id: 'dom-4', name: 'UI/UX Design', slug: 'ui_ux_design' },
    ];
    const questions = [
        {
            id: 'q1',
            section: 'interest',
            domain_weights: {
                A: { software_development: 3, data_science: 1 },
                B: { data_science: 3, software_development: 0 },
                C: { cybersecurity: 3 },
                D: { ui_ux_design: 3 },
            },
        },
        {
            id: 'q2',
            section: 'scenario',
            domain_weights: {
                A: { software_development: 3 },
                B: { data_science: 3 },
                C: { cybersecurity: 2 },
                D: { ui_ux_design: 1 },
            },
        },
        {
            id: 'q3',
            section: 'aptitude',
            correct_answer: 'B',
            domain_weights: {
                A: { software_development: 1 },
                B: { software_development: 2, data_science: 2 },
                C: {},
                D: {},
            },
        },
        {
            id: 'q4',
            section: 'technical',
            correct_answer: 'A',
            domain_weights: {
                A: { software_development: 3 },
                B: {},
                C: {},
                D: {},
            },
        },
    ];
    (0, vitest_1.it)('calculates deterministic scores given identical responses', () => {
        const responses = [
            { question_id: 'q1', selected_option: 'A' },
            { question_id: 'q2', selected_option: 'A' },
            { question_id: 'q3', selected_option: 'B' }, // Correct aptitude
            { question_id: 'q4', selected_option: 'A' }, // Correct technical
        ];
        const run1 = (0, scoring_1.calculateAssessmentScores)(questions, responses, domains, scoringConfig_1.defaultScoringConfig);
        const run2 = (0, scoring_1.calculateAssessmentScores)(questions, responses, domains, scoringConfig_1.defaultScoringConfig);
        const { evaluated_at: _t1, ...scores1 } = run1;
        const { evaluated_at: _t2, ...scores2 } = run2;
        (0, vitest_1.expect)(scores1).toEqual(scores2);
        (0, vitest_1.expect)(run1.aptitude_percent).toBe(100);
        (0, vitest_1.expect)(run1.top_domains.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(run1.top_domains[0].domain_slug).toBe('software_development');
        (0, vitest_1.expect)(run1.top_domains[0].match_percent).toBeGreaterThan(80);
    });
    (0, vitest_1.it)('identifies skill gaps when technical or aptitude score falls below threshold', () => {
        const responses = [
            { question_id: 'q1', selected_option: 'A' },
            { question_id: 'q2', selected_option: 'A' },
            { question_id: 'q3', selected_option: 'C' }, // Wrong aptitude -> 0%
            { question_id: 'q4', selected_option: 'B' }, // Wrong technical -> 0%
        ];
        const result = (0, scoring_1.calculateAssessmentScores)(questions, responses, domains, scoringConfig_1.defaultScoringConfig);
        (0, vitest_1.expect)(result.aptitude_percent).toBe(0);
        (0, vitest_1.expect)(result.skill_gaps.length).toBeGreaterThan(0);
        (0, vitest_1.expect)(result.skill_gaps.some((g) => g.skill_or_section.includes('Aptitude'))).toBe(true);
    });
    (0, vitest_1.it)('keeps all match percentages between 0 and 100', () => {
        const responses = [
            { question_id: 'q1', selected_option: 'D' },
            { question_id: 'q2', selected_option: 'D' },
            { question_id: 'q3', selected_option: 'A' },
            { question_id: 'q4', selected_option: 'D' },
        ];
        const result = (0, scoring_1.calculateAssessmentScores)(questions, responses, domains, scoringConfig_1.defaultScoringConfig);
        result.all_domain_scores.forEach((d) => {
            (0, vitest_1.expect)(d.final_match_percent).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(d.final_match_percent).toBeLessThanOrEqual(100);
            (0, vitest_1.expect)(d.domain_fit_percent).toBeGreaterThanOrEqual(0);
            (0, vitest_1.expect)(d.domain_fit_percent).toBeLessThanOrEqual(100);
        });
    });
});
(0, vitest_1.describe)('Assessment Dataset Zod Validation', () => {
    (0, vitest_1.it)('validates correct rows and flags errors for invalid rows', () => {
        const mockData = [
            {
                id: 'q_valid_001',
                audience: 'engineering',
                section: 'technical',
                question: 'What is the time complexity of QuickSort average case?',
                options: [
                    { key: 'A', text: 'O(n)' },
                    { key: 'B', text: 'O(n log n)' },
                    { key: 'C', text: 'O(n^2)' },
                    { key: 'D', text: 'O(1)' },
                ],
                correct_answer: 'B',
                difficulty: 'medium',
                explanation: 'QuickSort divides problem in half on average.',
                domain_weights: {
                    A: { software_development: 0 },
                    B: { software_development: 3 },
                    C: { software_development: 0 },
                    D: { software_development: 0 },
                },
            },
            {
                id: 'q_invalid_missing_correct_answer',
                audience: 'engineering',
                section: 'technical',
                question: 'Technical question without correct answer',
                options: [
                    { key: 'A', text: 'Opt A' },
                    { key: 'B', text: 'Opt B' },
                    { key: 'C', text: 'Opt C' },
                    { key: 'D', text: 'Opt D' },
                ],
                // missing correct_answer for technical section!
                difficulty: 'easy',
                domain_weights: {},
            },
        ];
        const { valid, report } = (0, validation_1.validateQuestionDataset)(mockData);
        (0, vitest_1.expect)(valid.length).toBe(1);
        (0, vitest_1.expect)(report.invalidCount).toBe(1);
        (0, vitest_1.expect)(report.errors[0].id).toBe('q_invalid_missing_correct_answer');
        (0, vitest_1.expect)(report.errors[0].errors.some((e) => e.includes('correct_answer'))).toBe(true);
    });
});
