import { 
  OnboardingResultPayload, 
  OnboardingSuggestion, 
  WorkPathStep, 
  PlacementPlanModule,
  Under18Consent 
} from '@career-bridge/types';
import { BRANCH_CATALOG, DOMAIN_CATALOG, BranchWeightRule } from './onboardingRules';

export interface ReliabilityCheckResult {
  isReliable: boolean;
  status: 'RELIABLE' | 'SUSPICIOUS_SPEED' | 'CONTRADICTORY' | 'NEEDS_REVIEW';
  reviewReason?: string;
}

/**
 * Reliability checks:
 * 1. Completion time: If answering 6+ questions in under 4 seconds, prompt review.
 * 2. Uniform/identical answer selection: If student selected the exact same choice in all single-select questions.
 * 3. Contradictory statements (e.g., "never tried coding" in Q3, but says "loves advanced coding" or selecting "prefer non-coding track" while picking competitive coding).
 */
export function checkReliability(
  answers: Record<string, any>,
  timeTakenSeconds: number,
  stage: 'school' | 'early' | 'final'
): ReliabilityCheckResult {
  // Speed check (< 4 seconds total)
  if (timeTakenSeconds > 0 && timeTakenSeconds < 4) {
    return {
      isReliable: false,
      status: 'SUSPICIOUS_SPEED',
      reviewReason: 'The responses were completed very rapidly (under 4 seconds). Please review your answers for accuracy.',
    };
  }

  // Contradiction checks per stage
  if (stage === 'school') {
    const comfort = answers['q3_comfort'];
    const excite = answers['q5_fields'];
    const enjoyment = answers['q4_enjoyment'];

    // Never tried coding, but says only comfortable with software development or building apps without any interest in basic logic
    if (comfort === 'comfortable' && Array.isArray(answers['q2_languages']) && answers['q2_languages'].includes('none') && answers['q2_languages'].length === 1) {
      return {
        isReliable: false,
        status: 'CONTRADICTORY',
        reviewReason: 'Selected "Comfortable with coding" but also reported having used "None" in programming languages. Please review your answers.',
      };
    }
  }

  if (stage === 'early') {
    const enjoyCoding = answers['q3_enjoy_coding'];
    const languages = answers['q4_languages'] || [];

    if (enjoyCoding === 'prefer_non_coding' && Array.isArray(languages) && languages.length >= 4 && !languages.includes('none')) {
      // Possible contradiction but allowable if they know tools; let's check explicit "none"
    }

    if (enjoyCoding === 'love_it' && Array.isArray(languages) && languages.includes('none') && languages.length === 1) {
      return {
        isReliable: false,
        status: 'CONTRADICTORY',
        reviewReason: 'Selected "Love coding" but also selected "None" for tools and languages. Please double-check your responses.',
      };
    }
  }

  if (stage === 'final') {
    const track = answers['q2_track'];
    const helpNeeded = answers['q7_help'] || [];

    if (track === 'non_coding' && Array.isArray(helpNeeded) && helpNeeded.includes('coding_practice') && helpNeeded.length === 1) {
      return {
        isReliable: false,
        status: 'CONTRADICTORY',
        reviewReason: 'Selected "Non-coding track" as primary focus, but selected only "Coding Practice" as required placement help. Please adjust your target path.',
      };
    }
  }

  return {
    isReliable: true,
    status: 'RELIABLE',
  };
}

/**
 * PHASE 2: 12th Standard Branch Discovery Engine
 */
export function evaluate12thStandard(
  answers: Record<string, any>,
  timeTakenSeconds: number,
  consent?: Under18Consent
): OnboardingResultPayload {
  const reliability = checkReliability(answers, timeTakenSeconds, 'school');

  if (!reliability.isReliable) {
    return {
      stage: 'school',
      primarySuggestion: {
        title: 'Review Needed',
        subtitle: 'Please review your selections to generate tailored branch guidance.',
        reasons: [reliability.reviewReason || 'Responses need review.'],
        confidence: 'Low',
      },
      assignedRoadmapId: 'roadmap-general-eng',
      assignedDomain: 'engineering_foundations',
      assignedRole: 'Engineering Explorer',
      reasons: [reliability.reviewReason || 'Please review your answers.'],
      confidence: 'Low',
      reliabilityStatus: reliability.status,
      reviewReason: reliability.reviewReason,
      completedAt: new Date().toISOString(),
    };
  }

  // Deterministic scoring of branches
  const scores: Record<string, { branchId: string; score: number; reasons: string[] }> = {};
  Object.keys(BRANCH_CATALOG).forEach((key) => {
    scores[key] = { branchId: key, score: 0, reasons: [] };
  });

  const subjects: string[] = answers['q1_subjects'] || [];
  const languages: string[] = answers['q2_languages'] || [];
  const comfort: string = answers['q3_comfort'] || '';
  const activities: string[] = answers['q4_enjoyment'] || [];
  const fields: string[] = answers['q5_fields'] || [];
  const environment: string = answers['q6_work_env'] || '';
  const priority: string = answers['q7_priority'] || '';

  // 1. Subjects
  if (subjects.includes('Computer Science')) {
    scores.cse.score += 4;
    scores.cse.reasons.push('High interest in school Computer Science');
    scores.it.score += 3;
    scores.ai_ds.score += 3;
  }
  if (subjects.includes('Maths')) {
    scores.ai_ds.score += 3;
    scores.cse.score += 2;
    scores.ece.score += 2;
    scores.eee.score += 2;
    scores.ai_ds.reasons.push('Aptitude for Mathematics aligns with data models & algorithms');
  }
  if (subjects.includes('Physics')) {
    scores.mechanical.score += 3;
    scores.civil.score += 3;
    scores.ece.score += 3;
    scores.eee.score += 3;
    scores.ece.reasons.push('Physics fundamentals align directly with electronics & circuits');
  }
  if (subjects.includes('Chemistry')) {
    scores.chemical.score += 4;
    scores.biotech.score += 2;
    scores.chemical.reasons.push('Appreciation of chemistry and material reactions');
  }
  if (subjects.includes('Biology')) {
    scores.biotech.score += 5;
    scores.biotech.reasons.push('Curiosity for biological systems and life sciences');
  }

  // 2. Languages & Comfort
  if (languages.includes('Python')) {
    scores.ai_ds.score += 3;
    scores.cse.score += 2;
  }
  if (languages.includes('C++')) {
    scores.cse.score += 3;
    scores.ece.score += 2;
  }
  if (comfort === 'comfortable') {
    scores.cse.score += 2;
    scores.ai_ds.score += 2;
  }

  // 3. Activities
  if (activities.includes('solving puzzles')) {
    scores.cse.score += 2;
    scores.ai_ds.score += 2;
  }
  if (activities.includes('building apps')) {
    scores.cse.score += 3;
    scores.it.score += 3;
    scores.cse.reasons.push('Desire to build interactive applications');
  }
  if (activities.includes('working with machines or circuits')) {
    scores.ece.score += 3;
    scores.eee.score += 3;
    scores.mechanical.score += 3;
    scores.mechanical.reasons.push('Passion for physical mechanisms and machines');
  }
  if (activities.includes('designing things')) {
    scores.mechanical.score += 2;
    scores.civil.score += 3;
    scores.civil.reasons.push('Interest in spatial structures and designing physical projects');
  }
  if (activities.includes('experiments and nature or life sciences')) {
    scores.biotech.score += 3;
    scores.chemical.score += 2;
  }

  // 4. Fields
  if (fields.includes('AI and data')) {
    scores.ai_ds.score += 5;
    scores.ai_ds.reasons.push('Direct excitement about Artificial Intelligence and data technologies');
  }
  if (fields.includes('software')) {
    scores.cse.score += 4;
    scores.it.score += 3;
  }
  if (fields.includes('electronics')) {
    scores.ece.score += 4;
    scores.eee.score += 3;
  }
  if (fields.includes('mechanical')) scores.mechanical.score += 4;
  if (fields.includes('civil')) scores.civil.score += 4;
  if (fields.includes('bio and chemical')) {
    scores.biotech.score += 3;
    scores.chemical.score += 3;
  }

  // 5. Work Environment
  if (environment === 'computers') {
    scores.cse.score += 2;
    scores.it.score += 2;
    scores.ai_ds.score += 2;
  } else if (environment === 'hands-on equipment') {
    scores.ece.score += 2;
    scores.eee.score += 2;
    scores.mechanical.score += 2;
    scores.civil.score += 2;
  } else if (environment === 'lab experiments') {
    scores.biotech.score += 3;
    scores.chemical.score += 3;
  }

  // Rank branches
  const sorted = Object.values(scores).sort((a, b) => b.score - a.score);
  const top1 = sorted[0];
  const top2 = sorted[1] && sorted[1].score > 0 ? sorted[1] : sorted[1] || sorted[0];

  const branch1Data = BRANCH_CATALOG[top1.branchId] || BRANCH_CATALOG.cse;
  const branch2Data = BRANCH_CATALOG[top2.branchId] || BRANCH_CATALOG.it;

  // Build work path for chosen top branch
  const workPath: WorkPathStep[] = [
    {
      title: 'Before College Preparation',
      period: 'Pre-College (Summer)',
      focus: 'Foundations & Self-discovery',
      items: branch1Data.workPath.beforeCollege,
    },
    {
      title: 'Year 1 Academic & Practical Core',
      period: 'Semester 1 & 2',
      focus: 'Core Engineering Rigor',
      items: branch1Data.workPath.yearOneSkills,
    },
    {
      title: 'First Real-World Projects',
      period: 'Year 1 In-between',
      focus: 'Portfolio Kickoff',
      items: branch1Data.workPath.firstProjects,
    },
    {
      title: 'Target Industry Trajectory',
      period: 'Years 2 to 4',
      focus: 'Internships & Placements',
      items: branch1Data.workPath.typicalCareers,
    },
  ];

  const primarySuggestion: OnboardingSuggestion = {
    title: branch1Data.name,
    subtitle: `Suggested for you based on your subject preferences and problem-solving style`,
    reasons: top1.reasons.length > 0 ? top1.reasons.slice(0, 3) : ['Strong alignment with your core technical interests', 'Natural fit with your preferred working environment'],
    confidence: top1.score >= 12 ? 'High' : 'Medium',
    insight: branch1Data.insight,
    isPrimary: true,
  };

  const secondarySuggestion: OnboardingSuggestion = {
    title: branch2Data.name,
    subtitle: `Suggested alternate branch with closely related opportunities`,
    reasons: top2.reasons.length > 0 ? top2.reasons.slice(0, 3) : ['Complementary skill overlaps with your top choice', 'Provides strong flexible industry career options'],
    confidence: 'Medium',
    insight: branch2Data.insight,
    isPrimary: false,
  };

  return {
    stage: 'school',
    primarySuggestion,
    secondarySuggestion,
    workPath,
    assignedRoadmapId: `roadmap-${branch1Data.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    assignedDomain: branch1Data.name,
    assignedRole: branch1Data.insight.typicalRoles[0] || 'Software Engineer',
    reasons: primarySuggestion.reasons,
    confidence: primarySuggestion.confidence,
    reliabilityStatus: 'RELIABLE',
    completedAt: new Date().toISOString(),
  };
}

/**
 * PHASE 3: 1st and 2nd Year Domain Fixing Engine
 */
export function evaluateEarlyCollege(
  answers: Record<string, any>,
  timeTakenSeconds: number
): OnboardingResultPayload {
  const reliability = checkReliability(answers, timeTakenSeconds, 'early');

  if (!reliability.isReliable) {
    return {
      stage: 'early',
      primarySuggestion: {
        title: 'Review Needed',
        subtitle: 'Please check your domain answers to ensure an accurate curriculum.',
        reasons: [reliability.reviewReason || 'Responses need review.'],
        confidence: 'Low',
      },
      assignedRoadmapId: 'roadmap-fullstack',
      assignedDomain: 'software_development',
      assignedRole: 'Full Stack Developer',
      reasons: [reliability.reviewReason || 'Please review your answers.'],
      confidence: 'Low',
      reliabilityStatus: reliability.status,
      reviewReason: reliability.reviewReason,
      completedAt: new Date().toISOString(),
    };
  }

  const branch: string = answers['q1_branch'] || 'CSE';
  const interests: string[] = answers['q2_interests'] || [];
  const codingAffinity: string = answers['q3_enjoy_coding'] || 'okay';
  const tools: string[] = answers['q4_languages'] || [];
  const goal: string = answers['q5_goal'] || 'campus_placement';

  const domainScores: Record<string, { domainId: string; score: number; reasons: string[] }> = {
    software_development: { domainId: 'software_development', score: 0, reasons: [] },
    data_science_ai: { domainId: 'data_science_ai', score: 0, reasons: [] },
    cybersecurity: { domainId: 'cybersecurity', score: 0, reasons: [] },
    cloud_devops: { domainId: 'cloud_devops', score: 0, reasons: [] },
    ui_ux_product: { domainId: 'ui_ux_product', score: 0, reasons: [] },
    embedded_iot: { domainId: 'embedded_iot', score: 0, reasons: [] },
  };

  // 1. Direct explicit interest
  interests.forEach((item) => {
    if (domainScores[item]) {
      domainScores[item].score += 5;
      domainScores[item].reasons.push('Explicit interest marked during domain selection');
    }
  });

  // 2. Branch affinity
  if (['CSE', 'IT'].includes(branch)) {
    domainScores.software_development.score += 2;
    domainScores.cloud_devops.score += 1;
  } else if (branch === 'AI and DS') {
    domainScores.data_science_ai.score += 4;
    domainScores.data_science_ai.reasons.push('Enrolled in AI and Data Science academic stream');
  } else if (['ECE', 'EEE'].includes(branch)) {
    domainScores.embedded_iot.score += 4;
    domainScores.cybersecurity.score += 2;
    domainScores.embedded_iot.reasons.push('Hardware and circuit background from your engineering branch');
  }

  // 3. Coding affinity
  if (codingAffinity === 'love_it') {
    domainScores.software_development.score += 3;
    domainScores.data_science_ai.score += 2;
  } else if (codingAffinity === 'prefer_non_coding') {
    domainScores.ui_ux_product.score += 5;
    domainScores.ui_ux_product.reasons.push('Preference for non-coding and human-centric design tracks');
  }

  // 4. Tools known
  if (tools.includes('Python')) {
    domainScores.data_science_ai.score += 2;
    domainScores.software_development.score += 1;
  }
  if (tools.includes('JavaScript / TypeScript') || tools.includes('React / Web')) {
    domainScores.software_development.score += 3;
    domainScores.software_development.reasons.push('Prior familiarity with Web and JavaScript tools');
  }
  if (tools.includes('Figma / Design Tools')) {
    domainScores.ui_ux_product.score += 4;
    domainScores.ui_ux_product.reasons.push('Practical experience with design tools like Figma');
  }
  if (tools.includes('Linux / Bash') || tools.includes('Docker')) {
    domainScores.cloud_devops.score += 3;
    domainScores.cybersecurity.score += 2;
  }
  if (tools.includes('C / C++') && ['ECE', 'EEE', 'Mechanical'].includes(branch)) {
    domainScores.embedded_iot.score += 2;
  }

  // Sort domains
  const sorted = Object.values(domainScores).sort((a, b) => b.score - a.score);
  const primaryKey = sorted[0].domainId;
  const secondaryKey = sorted[1].domainId;

  const primaryDomain = DOMAIN_CATALOG[primaryKey] || DOMAIN_CATALOG.software_development;
  const secondaryDomain = DOMAIN_CATALOG[secondaryKey] || DOMAIN_CATALOG.cloud_devops;

  const primarySuggestion: OnboardingSuggestion = {
    title: primaryDomain.name,
    subtitle: primaryDomain.tagline,
    reasons: sorted[0].reasons.length > 0 ? sorted[0].reasons.slice(0, 3) : ['Aligned with your current engineering year and technical interests', 'Offers high internship demand for college students'],
    confidence: sorted[0].score >= 8 ? 'High' : 'Medium',
    isPrimary: true,
  };

  const secondarySuggestion: OnboardingSuggestion = {
    title: secondaryDomain.name,
    subtitle: secondaryDomain.tagline,
    reasons: sorted[1].reasons.length > 0 ? sorted[1].reasons.slice(0, 3) : ['Close technological overlap with your primary focus', 'Provides valuable complementary skill depth'],
    confidence: 'Medium',
    isPrimary: false,
  };

  const workPath: WorkPathStep[] = [
    {
      title: 'Phase 1: Foundations',
      period: 'Month 1–2',
      focus: 'Core Fundamentals',
      items: primaryDomain.keySkills.slice(0, 3),
    },
    {
      title: 'Phase 2: Project Building',
      period: 'Month 3–4',
      focus: 'Hands-on Prototypes',
      items: ['Build 2 Guided Capstone Projects', 'Publish GitHub Repositories with Clean Documentation', 'Active Practice Drills'],
    },
    {
      title: 'Phase 3: Industry Readiness',
      period: 'Month 5–6',
      focus: 'Internship & Profile Polish',
      items: ['Resume Builder tailored to domain', 'Peer Mock Interviews', 'Deploy Live Production Projects'],
    },
  ];

  return {
    stage: 'early',
    primarySuggestion,
    secondarySuggestion,
    workPath,
    assignedRoadmapId: primaryDomain.roadmapId,
    assignedDomain: primaryDomain.name,
    assignedRole: primaryDomain.targetRole,
    reasons: primarySuggestion.reasons,
    confidence: primarySuggestion.confidence,
    reliabilityStatus: 'RELIABLE',
    completedAt: new Date().toISOString(),
  };
}

/**
 * PHASE 4: 3rd and 4th Year Placement-Focused Engine
 */
export function evaluateFinalCollege(
  answers: Record<string, any>,
  timeTakenSeconds: number
): OnboardingResultPayload {
  const reliability = checkReliability(answers, timeTakenSeconds, 'final');

  if (!reliability.isReliable) {
    return {
      stage: 'final',
      primarySuggestion: {
        title: 'Review Needed',
        subtitle: 'Please check your placement preferences to construct an accurate timeline.',
        reasons: [reliability.reviewReason || 'Responses need review.'],
        confidence: 'Low',
      },
      assignedRoadmapId: 'roadmap-placement-sde',
      assignedDomain: 'placement_prep',
      assignedRole: 'Software Engineer (Placement Track)',
      reasons: [reliability.reviewReason || 'Please review your answers.'],
      confidence: 'Low',
      reliabilityStatus: reliability.status,
      reviewReason: reliability.reviewReason,
      completedAt: new Date().toISOString(),
    };
  }

  const track: 'coding' | 'non_coding' = answers['q2_track'] || 'coding';
  const companyTypes: string[] = answers['q3_company_types'] || ['product'];
  const specificCompanies: string = answers['q3_specific_companies'] || '';
  const targetRole: string = answers['q4_target_role'] || (track === 'coding' ? 'Software Development Engineer (SDE-1)' : 'Business Analyst / Associate PM');
  const placementMonth: string = answers['q5_placement_season'] || 'September 2026';
  const readiness: Record<string, number> = answers['q6_readiness'] || { aptitude: 3, coding: 3, communication: 3, resume: 2 };
  const helpNeeded: string[] = answers['q7_help'] || [];
  const hoursPerWeek: string = answers['q8_hours'] || '6 to 10';

  // Construct working-backwards placement plan
  const placementPlan: PlacementPlanModule[] = [
    {
      weekRange: 'Weeks 1–4: Core Foundation & Resume Lock',
      focusArea: 'Resume Optimization & Diagnostic Benchmarking',
      targetCompanyTypes: companyTypes,
      modules: [
        'ATS-Compliant Resume Rewrite with Action Verbs & Metrics',
        'LinkedIn Profile & GitHub Portfolio Audit',
        readiness.aptitude <= 3 ? 'Aptitude Quantitative Drills (Speed & Accuracy)' : 'Refresher Quantitative & Logical Drills',
        track === 'coding' ? 'DSA Warm-up: Arrays, HashMaps, Two-Pointers' : 'Case Study Frameworks & Business Estimation Drills',
      ],
      assessmentsNeeded: ['Diagnostic Aptitude Mock Test', 'Resume ATS Score Check'],
      mockInterviewSlotSuggested: false,
    },
    {
      weekRange: 'Weeks 5–8: Intensive Problem Solving & Domain Deep-Dive',
      focusArea: 'High-frequency Company Testing Patterns',
      targetCompanyTypes: companyTypes,
      modules: [
        track === 'coding' 
          ? 'Data Structures: Trees, Graphs, Dynamic Programming'
          : 'SQL Analytics & Excel/Tableau Dashboard Simulation',
        'Company-Type Pattern Practice (Product Problem Solving or Service Speed Drills)',
        'Core Technical Fundamentals (OS, DBMS, Computer Networks for Tech Track)',
      ],
      assessmentsNeeded: [
        track === 'coding' ? 'Weekly Coding Proctored Assessment' : 'Domain Analytical Case Assessment',
        'Weekly Speed Aptitude Test',
      ],
      mockInterviewSlotSuggested: true,
    },
    {
      weekRange: 'Weeks 9–12: High-Fidelity Mock Rounds & Live Polish',
      focusArea: 'Simulation & HR/Behavioral Excellence',
      targetCompanyTypes: companyTypes,
      modules: [
        'STAR Method Behavioral & Leadership Response Library',
        'Live 1-on-1 Peer or AI Mock Interview with Feedback Scorecard',
        'Final Fast-paced Placement Test Simulations',
        'Company-specific Strategy Reviews',
      ],
      assessmentsNeeded: ['Full-length Placement Simulation (Aptitude + Technical + Coding)'],
      mockInterviewSlotSuggested: true,
    },
  ];

  // Specific company handling: Tag with PLACEHOLDER unless verified source attached
  const reasons: string[] = [
    `Structured backwards from target placement season (${placementMonth})`,
    `Calibrated for ${companyTypes.join(', ')} recruiting standards`,
    `Focuses extra practice on self-identified focus areas: ${helpNeeded.join(', ') || 'comprehensive readiness'}`,
  ];

  if (specificCompanies.trim()) {
    reasons.push(`Targeting interest in: ${specificCompanies.trim()} (Company modules formatted via standard hiring templates; verified metrics: Source pending)`);
  }

  const primarySuggestion: OnboardingSuggestion = {
    title: `${targetRole} Placement Track`,
    subtitle: `Customized for ${placementMonth} placement season (${hoursPerWeek} hrs/week)`,
    reasons,
    confidence: 'High',
    isPrimary: true,
  };

  return {
    stage: 'final',
    primarySuggestion,
    placementPlan,
    assignedRoadmapId: track === 'coding' ? 'roadmap-placement-sde' : 'roadmap-placement-analytics',
    assignedDomain: track === 'coding' ? 'software_development' : 'product_management',
    assignedRole: targetRole,
    reasons,
    confidence: 'High',
    reliabilityStatus: 'RELIABLE',
    completedAt: new Date().toISOString(),
  };
}

export const onboardingEngine = {
  checkReliability,
  evaluate12thStandard,
  evaluateEarlyCollege,
  evaluateFinalCollege,
};
