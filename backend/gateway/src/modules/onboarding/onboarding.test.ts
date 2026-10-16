import { describe, it, expect } from 'vitest';
import { 
  evaluate12thStandard, 
  evaluateEarlyCollege, 
  evaluateFinalCollege, 
  checkReliability 
} from '../../../../../packages/ai/src/modules/onboardingEngine';
import { 
  BRANCH_CATALOG, 
  DOMAIN_CATALOG, 
  COMPANY_TYPE_TEMPLATES 
} from '../../../../../packages/ai/src/modules/onboardingRules';

describe('Phase 5: Recommendation Engine (Pure & Deterministic)', () => {
  
  describe('Screen 2: 12th Standard (Branch Discovery)', () => {
    it('recommends CSE or AI/DS for math & computer science lovers who like building apps', () => {
      const answers: Record<string, any> = {
        q1_subjects: ['Maths', 'Computer Science'],
        q2_languages: ['Python'],
        q3_comfort: 'comfortable',
        q4_enjoyment: ['building apps', 'solving puzzles'],
        q5_fields: ['AI and data', 'software'],
        q6_work_env: 'computers',
        q7_priority: 'high-paying jobs'
      };

      const result = evaluate12thStandard(answers, 45);

      expect(result.stage).toBe('school');
      expect(result.primarySuggestion).toBeDefined();
      expect(result.secondarySuggestion).toBeDefined();
      expect(result.confidence).toBe('High');
      
      const topBranchName = result.primarySuggestion.title;
      expect(['Computer Science & Engineering (CSE)', 'Artificial Intelligence & Data Science (AI & DS)']).toContain(topBranchName);
      expect(result.primarySuggestion.reasons.length).toBeGreaterThanOrEqual(1);
      
      // Verify no invented statistics: demand trend has verified citation or Source pending
      expect(result.primarySuggestion.insight).toBeDefined();
      expect(result.primarySuggestion.insight?.source).toBeTruthy();
      expect(result.primarySuggestion.insight?.demandOutlook).toBeTruthy();
      expect(result.workPath.length).toBeGreaterThan(0);
    });

    it('recommends Mechanical or ECE for hands-on, circuit & machine enthusiasts', () => {
      const answers: Record<string, any> = {
        q1_subjects: ['Physics', 'Maths'],
        q2_languages: ['none'],
        q3_comfort: 'never tried',
        q4_enjoyment: ['working with machines or circuits'],
        q5_fields: ['mechanical', 'electronics'],
        q6_work_env: 'hands-on equipment',
        q7_priority: 'research'
      };

      const result = evaluate12thStandard(answers, 35);
      const title = result.primarySuggestion.title;
      expect(title.includes('Mechanical') || title.includes('Electronics') || title.includes('Electrical')).toBe(true);
      expect(result.primarySuggestion.subtitle).toMatch(/suggested for you/i);
    });
  });

  describe('Screen 3: 1st & 2nd Year (Domain Fixing)', () => {
    it('fixes primary domain to Software Development and gives an alternate domain with reasons', () => {
      const answers: Record<string, any> = {
        q1_branch: 'CSE',
        q2_interests: ['software_development', 'cloud_devops'],
        q3_enjoy_coding: 'love_it',
        q4_languages: ['JavaScript / TypeScript', 'Python'],
        q5_goal: 'campus_placement',
        q6_hours: '6_to_10'
      };

      const result = evaluateEarlyCollege(answers, 40);

      expect(result.stage).toBe('early');
      expect(result.primarySuggestion).toBeDefined();
      expect(result.primarySuggestion.title).toBe('Full-Stack Software Development');
      expect(result.primarySuggestion.reasons.length).toBeGreaterThanOrEqual(2);
      expect(result.secondarySuggestion).toBeDefined();
      expect(result.secondarySuggestion.title).not.toBe(result.primarySuggestion.title);
      expect(result.assignedRoadmapId).toBeTruthy();
    });
  });

  describe('Screen 4: 3rd & 4th Year (Placement Focused)', () => {
    it('builds a backwards time-boxed placement plan working backwards from placement month', () => {
      const answers: Record<string, any> = {
        q1_domain: 'Full-Stack Web Development',
        q2_track: 'coding',
        q3_company_types: ['Product Companies (Tier 1 & 2)', 'Early & Growth Stage Startups'],
        q3_specific_companies: 'Google, Atlassian',
        q4_target_role: 'Software Development Engineer',
        q5_placement_month: '2026-11',
        q6_readiness_aptitude: 4,
        q6_readiness_coding: 4,
        q6_readiness_communication: 3,
        q6_readiness_resume: 3,
        q7_help: ['mock_interviews', 'coding_practice'],
        q8_hours: '10_plus'
      };

      const result = evaluateFinalCollege(answers, 50);

      expect(result.stage).toBe('final');
      expect(result.placementPlan).toBeDefined();
      expect(result.placementPlan.length).toBeGreaterThanOrEqual(3);
      expect(result.assignedRoadmapId).toBe('roadmap-placement-sde');

      // Verify backwards structured timeline
      expect(result.placementPlan[0].weekRange).toMatch(/Weeks 1–4/);
      expect(result.placementPlan[1].weekRange).toMatch(/Weeks 5–8/);
      expect(result.placementPlan[2].weekRange).toMatch(/Weeks 9–12/);
    });
  });

  describe('Reliability Signals', () => {
    it('flags too-fast completion (< 4 seconds)', () => {
      const answers = { q1: 'A', q2: 'B', q3: 'C' };
      const reliability = checkReliability(answers, 2, 'school');
      expect(reliability.isReliable).toBe(false);
      expect(reliability.status).toBe('SUSPICIOUS_SPEED');
      expect(reliability.reviewReason).toMatch(/under 4 seconds/i);
    });

    it('flags contradiction in 12th standard between comfortable with coding and none', () => {
      const answers = {
        q3_comfort: 'comfortable',
        q2_languages: ['none']
      };
      const reliability = checkReliability(answers, 30, 'school');
      expect(reliability.isReliable).toBe(false);
      expect(reliability.status).toBe('CONTRADICTORY');
      expect(reliability.reviewReason).toMatch(/Comfortable with coding/i);
    });

    it('flags contradiction in early college between love coding and none for languages', () => {
      const answers = {
        q3_enjoy_coding: 'love_it',
        q4_languages: ['none']
      };
      const reliability = checkReliability(answers, 45, 'early');
      expect(reliability.isReliable).toBe(false);
      expect(reliability.status).toBe('CONTRADICTORY');
      expect(reliability.reviewReason).toMatch(/Love coding/i);
    });

    it('approves legitimate thoughtful responses', () => {
      const answers = {
        q1_subjects: ['Maths', 'Physics'],
        q2_languages: ['Python'],
        q3_comfort: 'comfortable',
        q4_enjoyment: ['solving puzzles'],
        q7_priority: 'high-paying jobs'
      };
      const reliability = checkReliability(answers, 45, 'school');
      expect(reliability.isReliable).toBe(true);
      expect(reliability.status).toBe('RELIABLE');
    });
  });
});
