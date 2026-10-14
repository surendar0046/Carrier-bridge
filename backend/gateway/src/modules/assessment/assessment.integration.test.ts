import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { validateQuestionDataset } from './validation';
import { calculateAssessmentScores, QuestionScoringData, DomainMeta } from './scoring';
import { defaultScoringConfig } from '../../config/scoringConfig';

describe('Assessment System End-to-End Logic Integration', () => {
  const datasetPath = path.resolve(__dirname, '../../../../../data/assessment_questions.json');

  it('loads and validates all questions from /data/assessment_questions.json', () => {
    expect(fs.existsSync(datasetPath)).toBe(true);
    const content = fs.readFileSync(datasetPath, 'utf-8');
    const rawQuestions = JSON.parse(content);

    const { valid, report } = validateQuestionDataset(rawQuestions);
    expect(report.invalidCount).toBe(0);
    expect(valid.length).toBeGreaterThanOrEqual(10);
  });

  it('runs a complete assessment attempt simulation and produces valid recommendation', () => {
    const content = fs.readFileSync(datasetPath, 'utf-8');
    const rawQuestions = JSON.parse(content);
    const { valid } = validateQuestionDataset(rawQuestions);

    const domains: DomainMeta[] = [
      { id: 'dom_software', name: 'Software Engineering', slug: 'software_development' },
      { id: 'dom_data_ai', name: 'Data Science & AI', slug: 'data_science' },
      { id: 'dom_cybersecurity', name: 'Cybersecurity', slug: 'cybersecurity' },
      { id: 'dom_ui_ux', name: 'UI/UX & Product Design', slug: 'ui_ux_design' },
      { id: 'dom_product', name: 'Product & Tech Management', slug: 'product_management' },
    ];

    const questions: QuestionScoringData[] = valid.map((q) => ({
      id: q.id,
      section: q.section,
      correct_answer: q.correct_answer,
      domain_weights: q.domain_weights,
    }));

    // Simulate student answering: choose 'B' for technical, 'A' for scenario, 'B' for aptitude
    const responses = questions.map((q) => {
      let selectedOption: 'A' | 'B' | 'C' | 'D' = 'B';
      if (q.section === 'technical') selectedOption = 'B';
      if (q.section === 'aptitude') selectedOption = q.correct_answer || 'B';
      if (q.section === 'interest') selectedOption = 'A';
      return {
        question_id: q.id,
        selected_option: selectedOption,
        time_spent_seconds: 15,
      };
    });

    const result = calculateAssessmentScores(questions, responses, domains, defaultScoringConfig);

    // Assertions on result integrity
    expect(result.top_domains).toHaveLength(3);
    expect(result.aptitude_percent).toBeGreaterThan(0);
    expect(result.section_scores.technical.answered).toBeGreaterThan(0);

    result.all_domain_scores.forEach((dom) => {
      expect(dom.final_match_percent).toBeGreaterThanOrEqual(0);
      expect(dom.final_match_percent).toBeLessThanOrEqual(100);
      expect(dom.domain_fit_percent).toBeGreaterThanOrEqual(0);
      expect(dom.domain_fit_percent).toBeLessThanOrEqual(100);
    });

    // Check top domain has the highest score
    expect(result.top_domains[0].match_percent).toBeGreaterThanOrEqual(
      result.top_domains[1].match_percent
    );
  });
});
