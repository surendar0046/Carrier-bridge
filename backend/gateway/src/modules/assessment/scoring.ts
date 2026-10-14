import { ScoringEngineConfig, defaultScoringConfig } from '../../config/scoringConfig';
import { OptionKey, Section } from './validation';

export interface QuestionScoringData {
  id: string;
  section: Section;
  correct_answer?: OptionKey | null;
  domain_weights: {
    A?: Record<string, number>;
    B?: Record<string, number>;
    C?: Record<string, number>;
    D?: Record<string, number>;
  };
}

export interface StudentResponseInput {
  question_id: string;
  selected_option: OptionKey;
  time_spent_seconds?: number;
}

export interface DomainMeta {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface DomainFitScore {
  domain_id: string;
  domain_name: string;
  domain_slug: string;
  raw_score: number;
  max_possible: number;
  domain_fit_percent: number;
  interest_scenario_fit_percent: number;
  skill_technical_fit_percent: number;
  final_match_percent: number;
}

export interface SkillGapItem {
  domain_id: string;
  domain_name: string;
  skill_or_section: string;
  score_percent: number;
  threshold_percent: number;
  gap_severity: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface ScoringResult {
  section_scores: Record<Section, { answered: number; total: number; score_percent: number }>;
  aptitude_percent: number;
  top_domains: Array<{
    domain_id: string;
    domain_name: string;
    domain_slug: string;
    match_percent: number;
    domain_fit_percent: number;
  }>;
  all_domain_scores: DomainFitScore[];
  skill_gaps: SkillGapItem[];
  evaluated_at: string;
}

/**
 * Pure, deterministic function to score an assessment attempt
 */
export function calculateAssessmentScores(
  questions: QuestionScoringData[],
  responses: StudentResponseInput[],
  domains: DomainMeta[],
  config: ScoringEngineConfig = defaultScoringConfig
): ScoringResult {
  const questionMap = new Map<string, QuestionScoringData>();
  questions.forEach((q) => questionMap.set(q.id, q));

  const responseMap = new Map<string, StudentResponseInput>();
  responses.forEach((r) => responseMap.set(r.question_id, r));

  // 1. Calculate Section Scores (Aptitude & Technical accuracy, plus section breakdowns)
  const sections: Section[] = ['interest', 'aptitude', 'scenario', 'skill', 'technical'];
  const sectionStats: Record<Section, { answered: number; total: number; correct: number }> = {
    interest: { answered: 0, total: 0, correct: 0 },
    aptitude: { answered: 0, total: 0, correct: 0 },
    scenario: { answered: 0, total: 0, correct: 0 },
    skill: { answered: 0, total: 0, correct: 0 },
    technical: { answered: 0, total: 0, correct: 0 },
  };

  questions.forEach((q) => {
    sectionStats[q.section].total += 1;
    const resp = responseMap.get(q.id);
    if (resp) {
      sectionStats[q.section].answered += 1;
      if (q.correct_answer && resp.selected_option === q.correct_answer) {
        sectionStats[q.section].correct += 1;
      }
    }
  });

  const section_scores: Record<Section, { answered: number; total: number; score_percent: number }> = {
    interest: { answered: 0, total: 0, score_percent: 0 },
    aptitude: { answered: 0, total: 0, score_percent: 0 },
    scenario: { answered: 0, total: 0, score_percent: 0 },
    skill: { answered: 0, total: 0, score_percent: 0 },
    technical: { answered: 0, total: 0, score_percent: 0 },
  };

  sections.forEach((sec) => {
    const stat = sectionStats[sec];
    let scorePct = 0;
    if (sec === 'aptitude' || sec === 'technical') {
      scorePct = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 1000) / 10 : 0;
    } else {
      scorePct = stat.total > 0 ? Math.round((stat.answered / stat.total) * 1000) / 10 : 0;
    }
    section_scores[sec] = {
      answered: stat.answered,
      total: stat.total,
      score_percent: scorePct,
    };
  });

  const aptitude_percent = section_scores.aptitude.score_percent;

  // 2. Domain Fit Calculation:
  // For each domain: sum weights of selected options / max possible weights for that domain
  const domainFitMap = new Map<
    string,
    {
      rawScore: number;
      maxPossible: number;
      interestScenarioRaw: number;
      interestScenarioMax: number;
      skillTechRaw: number;
      skillTechMax: number;
    }
  >();

  domains.forEach((d) => {
    domainFitMap.set(d.slug, {
      rawScore: 0,
      maxPossible: 0,
      interestScenarioRaw: 0,
      interestScenarioMax: 0,
      skillTechRaw: 0,
      skillTechMax: 0,
    });
  });

  questions.forEach((q) => {
    const isInterestScenario = q.section === 'interest' || q.section === 'scenario';
    const isSkillTech = q.section === 'skill' || q.section === 'technical';
    const resp = responseMap.get(q.id);

    domains.forEach((dom) => {
      const stats = domainFitMap.get(dom.slug)!;

      // Max possible weight for this domain in question q across options A, B, C, D
      const optionWeights = ['A', 'B', 'C', 'D'].map((optKey) => {
        const weights = (q.domain_weights as any)?.[optKey] || {};
        return typeof weights[dom.slug] === 'number' ? weights[dom.slug] : 0;
      });
      const maxQWeight = Math.max(0, ...optionWeights);

      if (maxQWeight > 0) {
        stats.maxPossible += maxQWeight;
        if (isInterestScenario) stats.interestScenarioMax += maxQWeight;
        if (isSkillTech) stats.skillTechMax += maxQWeight;

        if (resp) {
          const selectedWeights = (q.domain_weights as any)?.[resp.selected_option] || {};
          const selectedWeight = typeof selectedWeights[dom.slug] === 'number' ? selectedWeights[dom.slug] : 0;
          stats.rawScore += selectedWeight;
          if (isInterestScenario) stats.interestScenarioRaw += selectedWeight;
          if (isSkillTech) stats.skillTechRaw += selectedWeight;
        }
      }
    });
  });

  // 3. Compute Final Match % per Domain using Configurable Blends
  const all_domain_scores: DomainFitScore[] = domains.map((dom) => {
    const stats = domainFitMap.get(dom.slug)!;

    const domain_fit_percent =
      stats.maxPossible > 0 ? Math.round((stats.rawScore / stats.maxPossible) * 1000) / 10 : 0;

    const interest_scenario_fit_percent =
      stats.interestScenarioMax > 0
        ? Math.round((stats.interestScenarioRaw / stats.interestScenarioMax) * 1000) / 10
        : domain_fit_percent;

    const skill_technical_fit_percent =
      stats.skillTechMax > 0
        ? Math.round((stats.skillTechRaw / stats.skillTechMax) * 1000) / 10
        : section_scores.technical.total > 0
        ? section_scores.technical.score_percent
        : domain_fit_percent;

    // Configurable blend: e.g. 60% Interest/Scenario, 25% Aptitude, 15% Skills/Tech
    const w = config.weights;
    let blendedScore =
      interest_scenario_fit_percent * w.interestScenarioWeight +
      aptitude_percent * w.aptitudeWeight +
      skill_technical_fit_percent * w.skillsTechnicalWeight;

    // Constrain strictly between 0 and 100
    const final_match_percent = Math.min(100, Math.max(0, Math.round(blendedScore * 10) / 10));

    return {
      domain_id: dom.id,
      domain_name: dom.name,
      domain_slug: dom.slug,
      raw_score: stats.rawScore,
      max_possible: stats.maxPossible,
      domain_fit_percent,
      interest_scenario_fit_percent,
      skill_technical_fit_percent,
      final_match_percent,
    };
  });

  // Deterministic sort: descending by final_match_percent, then domain_fit_percent, then alphabetical slug
  all_domain_scores.sort((a, b) => {
    if (b.final_match_percent !== a.final_match_percent) {
      return b.final_match_percent - a.final_match_percent;
    }
    if (b.domain_fit_percent !== a.domain_fit_percent) {
      return b.domain_fit_percent - a.domain_fit_percent;
    }
    return a.domain_slug.localeCompare(b.domain_slug);
  });

  // Top domains (default top 3)
  const top_domains = all_domain_scores.slice(0, config.topDomainsCount).map((d) => ({
    domain_id: d.domain_id,
    domain_name: d.domain_name,
    domain_slug: d.domain_slug,
    match_percent: d.final_match_percent,
    domain_fit_percent: d.domain_fit_percent,
  }));

  // 4. Identify Skill Gaps for Top Domains
  const skill_gaps: SkillGapItem[] = [];
  top_domains.forEach((top) => {
    const fullDomain = all_domain_scores.find((d) => d.domain_id === top.domain_id);
    if (!fullDomain) return;

    // Check Skills/Technical component
    if (fullDomain.skill_technical_fit_percent < config.skillGapThresholdPercent) {
      const diff = config.skillGapThresholdPercent - fullDomain.skill_technical_fit_percent;
      skill_gaps.push({
        domain_id: top.domain_id,
        domain_name: top.domain_name,
        skill_or_section: 'Core Technical Competency',
        score_percent: fullDomain.skill_technical_fit_percent,
        threshold_percent: config.skillGapThresholdPercent,
        gap_severity: diff > 25 ? 'high' : 'medium',
        recommendation: `Recommended focused practice on fundamentals and practical coding challenges in ${top.domain_name}.`,
      });
    }

    // Check Aptitude component if below threshold
    if (aptitude_percent < config.skillGapThresholdPercent) {
      const diff = config.skillGapThresholdPercent - aptitude_percent;
      skill_gaps.push({
        domain_id: top.domain_id,
        domain_name: top.domain_name,
        skill_or_section: 'Analytical & Quantitative Aptitude',
        score_percent: aptitude_percent,
        threshold_percent: config.skillGapThresholdPercent,
        gap_severity: diff > 20 ? 'high' : 'low',
        recommendation: `Strengthen algorithmic problem solving and logical reasoning modules to improve readiness for ${top.domain_name} screening rounds.`,
      });
    }
  });

  return {
    section_scores,
    aptitude_percent,
    top_domains,
    all_domain_scores,
    skill_gaps,
    evaluated_at: new Date().toISOString(),
  };
}
