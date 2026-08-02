import { CareerRecommendation } from '@career-bridge/types';

export type Recommendation = CareerRecommendation;


type ScoreMap = Record<string, number>;

// ── Weighted rule matcher ──────────────────────────────────────────────────────
function applyRules(
  answers: Record<number, string>,
  rules: Array<{ qId: number; partial: string; category: string; weight: number }>,
  scores: ScoreMap
) {
  for (const { qId, partial, category, weight } of rules) {
    if ((answers[qId] || '').includes(partial)) {
      scores[category] = (scores[category] || 0) + weight;
    }
  }
}

// ── STUDENT ───────────────────────────────────────────────────────────────────
function scoreStudent(answers: Record<number, string>): ScoreMap {
  const s: ScoreMap = { tech: 0, creative: 0, business: 0, analytical: 0, leadership: 0 };
  applyRules(answers, [
    // Q1 – first app impression
    { qId: 1, partial: 'beautiful', category: 'creative', weight: 2 },
    { qId: 1, partial: 'fast and smooth', category: 'tech', weight: 2 },
    { qId: 1, partial: 'logic behind', category: 'tech', weight: 2 },
    { qId: 1, partial: 'helps people', category: 'business', weight: 2 },
    // Q3 – weekend project
    { qId: 3, partial: 'Designing a logo', category: 'creative', weight: 3 },
    { qId: 3, partial: 'script to automate', category: 'tech', weight: 3 },
    { qId: 3, partial: 'community event', category: 'leadership', weight: 3 },
    { qId: 3, partial: 'Analyzing data', category: 'analytical', weight: 3 },
    // Q5 – group role
    { qId: 5, partial: 'vision', category: 'leadership', weight: 2 },
    { qId: 5, partial: 'Gets the actual work', category: 'tech', weight: 2 },
    { qId: 5, partial: 'organized and on track', category: 'leadership', weight: 2 },
    { qId: 5, partial: 'Resolves conflicts', category: 'business', weight: 2 },
    // Q6 – school subject (highest weight)
    { qId: 6, partial: 'Math', category: 'tech', weight: 5 },
    { qId: 6, partial: 'Physics', category: 'tech', weight: 5 },
    { qId: 6, partial: 'Arts', category: 'creative', weight: 5 },
    { qId: 6, partial: 'Literature', category: 'creative', weight: 5 },
    { qId: 6, partial: 'Computers', category: 'tech', weight: 5 },
    { qId: 6, partial: 'Technology', category: 'tech', weight: 5 },
    { qId: 6, partial: 'Economics', category: 'business', weight: 5 },
    { qId: 6, partial: 'Business', category: 'business', weight: 5 },
    // Q7 – global problem
    { qId: 7, partial: 'Simplifying complex', category: 'tech', weight: 2 },
    { qId: 7, partial: 'sustainable technology', category: 'tech', weight: 2 },
    { qId: 7, partial: 'communicate', category: 'creative', weight: 2 },
    { qId: 7, partial: 'Optimizing business', category: 'business', weight: 2 },
    // Q9 – design/layout preference
    { qId: 9, partial: 'visual harmony', category: 'creative', weight: 3 },
    { qId: 9, partial: 'prefer the logic', category: 'tech', weight: 3 },
    { qId: 9, partial: 'working with numbers', category: 'analytical', weight: 3 },
    { qId: 9, partial: 'talking to people', category: 'leadership', weight: 3 },
    // Q10 – motivation
    { qId: 10, partial: 'Creating something original', category: 'creative', weight: 3 },
    { qId: 10, partial: 'difficult puzzle', category: 'analytical', weight: 3 },
    { qId: 10, partial: 'Leading a team', category: 'leadership', weight: 3 },
    { qId: 10, partial: 'impact on society', category: 'business', weight: 3 },
    // Q11 – AI attitude
    { qId: 11, partial: 'how it works internally', category: 'tech', weight: 4 },
    { qId: 11, partial: 'create cool things', category: 'creative', weight: 4 },
    { qId: 11, partial: 'impact on business', category: 'business', weight: 4 },
    { qId: 11, partial: 'ethical', category: 'leadership', weight: 3 },
    // Q14 – free time
    { qId: 14, partial: 'tutorials or tech', category: 'tech', weight: 2 },
    { qId: 14, partial: 'design inspiration', category: 'creative', weight: 2 },
    { qId: 14, partial: 'business and startups', category: 'business', weight: 2 },
    // Q15 – YouTube channel
    { qId: 15, partial: 'Coding and technology', category: 'tech', weight: 2 },
    { qId: 15, partial: 'Product reviews and business', category: 'business', weight: 2 },
    { qId: 15, partial: 'Creative arts and design', category: 'creative', weight: 2 },
    { qId: 15, partial: 'Self-improvement and leadership', category: 'leadership', weight: 2 },
  ], s);
  return s;
}

function pickStudentRole(s: ScoreMap): Recommendation {
  const sorted = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [first, firstScore] = sorted[0] ?? ['tech', 0];
  const [second] = sorted[1] ?? ['business', 0];
  const total = Object.values(s).reduce((a, b) => a + b, 0) || 1;
  const conf = Math.min(97, Math.round(62 + (firstScore / total) * 100));

  if (first === 'tech' && second === 'creative')
    return { role: 'Full Stack Developer', confidence: conf, reasoning: 'Your blend of logical thinking and visual creativity is perfect for building end-to-end applications.', strengths: ['React & Node.js', 'UI/UX Awareness', 'API Design', 'Problem Solving'], weaknesses: ['Deep Algorithm Optimization', 'Project Management'], salaryRange: '₹6L–₹18L / $80k–$140k', futureScope: 'Excellent – High demand for versatile developers.', aiImpact: 15, demandScore: 98 };

  if (first === 'tech' && (second === 'analytical' || s.analytical >= 4))
    return { role: 'AI / ML Engineer', confidence: conf, reasoning: 'Your technical aptitude and love for analysis point directly to AI/ML engineering—the hottest field in tech.', strengths: ['Data Analysis', 'Algorithm Design', 'Mathematics', 'Pattern Recognition'], weaknesses: ['Communication', 'Visual Design'], salaryRange: '₹10L–₹30L / $100k–$180k', futureScope: 'Hyper-growth – AI is shaping every industry.', aiImpact: 5, demandScore: 99 };

  if (first === 'creative' && s.creative >= 5)
    return { role: 'Product Designer (UI/UX)', confidence: conf, reasoning: 'Your focus on beauty, empathy, and visual harmony makes you a natural product designer.', strengths: ['User Empathy', 'Figma & Prototyping', 'Visual Communication', 'Design Systems'], weaknesses: ['Hard Coding', 'Financial Analysis'], salaryRange: '₹5L–₹16L / $70k–$130k', futureScope: 'Stable – Human-centric design remains critical even as AI scales.', aiImpact: 25, demandScore: 90 };

  if (first === 'analytical' || s.analytical >= 6)
    return { role: 'Data Scientist', confidence: conf, reasoning: 'Your affinity for numbers, patterns, and critical thinking is the core DNA of a Data Scientist.', strengths: ['Statistical Analysis', 'Python/R', 'Data Visualization', 'ML Modelling'], weaknesses: ['Product Thinking', 'Visual Design'], salaryRange: '₹8L–₹25L / $90k–$160k', futureScope: 'Very Strong – Data is the fuel of every AI-driven business.', aiImpact: 10, demandScore: 96 };

  if (first === 'business' || first === 'leadership')
    return { role: 'Product Manager', confidence: conf, reasoning: 'Your interest in vision, strategy, and user impact makes you an ideal product leader.', strengths: ['Roadmap Planning', 'Stakeholder Management', 'Strategic Thinking', 'User Research'], weaknesses: ['Technical Implementation', 'Visual Design'], salaryRange: '₹12L–₹35L / $90k–$150k', futureScope: 'Strong – Every digital product needs a PM to lead AI integration.', aiImpact: 10, demandScore: 92 };

  // default tech
  return { role: 'Backend Developer', confidence: conf, reasoning: 'Your love for systems and logic positions you for server-side engineering.', strengths: ['System Design', 'API Development', 'Databases', 'Performance Optimization'], weaknesses: ['Frontend UI', 'Marketing'], salaryRange: '₹6L–₹20L / $85k–$145k', futureScope: 'Excellent – Backend powers every app, service, and AI model.', aiImpact: 12, demandScore: 95 };
}

// ── PROFESSIONAL ──────────────────────────────────────────────────────────────
function scoreProfessional(answers: Record<number, string>): ScoreMap {
  const s: ScoreMap = { tech: 0, management: 0, design: 0, data: 0, product: 0, strategy: 0 };
  applyRules(answers, [
    // Q1 – domain
    { qId: 1, partial: 'Software Development', category: 'tech', weight: 5 },
    { qId: 1, partial: 'Design', category: 'design', weight: 5 },
    { qId: 1, partial: 'Management', category: 'management', weight: 5 },
    { qId: 1, partial: 'Data', category: 'data', weight: 5 },
    // Q2 – project approach
    { qId: 2, partial: 'architecture first', category: 'tech', weight: 3 },
    { qId: 2, partial: 'small, manageable', category: 'management', weight: 3 },
    { qId: 2, partial: 'business goals', category: 'strategy', weight: 3 },
    { qId: 2, partial: 'user experience', category: 'design', weight: 3 },
    // Q3 – management style
    { qId: 3, partial: 'Lead by example', category: 'tech', weight: 2 },
    { qId: 3, partial: 'Empower and delegate', category: 'management', weight: 3 },
    { qId: 3, partial: 'Data-driven', category: 'data', weight: 3 },
    { qId: 3, partial: 'Strategic', category: 'strategy', weight: 3 },
    // Q5 – tech stack interest
    { qId: 5, partial: 'Scalability', category: 'tech', weight: 3 },
    { qId: 5, partial: 'Developer experience', category: 'tech', weight: 3 },
    { qId: 5, partial: 'Visual possibilities', category: 'design', weight: 3 },
    { qId: 5, partial: 'Business integration', category: 'strategy', weight: 3 },
    // Q7 – product success metric
    { qId: 7, partial: 'Code quality', category: 'tech', weight: 2 },
    { qId: 7, partial: 'User engagement', category: 'product', weight: 3 },
    { qId: 7, partial: 'Revenue', category: 'strategy', weight: 3 },
    { qId: 7, partial: 'Innovation', category: 'data', weight: 2 },
    // Q9 – 3-year vision (highest weight)
    { qId: 9, partial: 'CTO', category: 'tech', weight: 5 },
    { qId: 9, partial: 'Technical Lead', category: 'tech', weight: 5 },
    { qId: 9, partial: 'Product Head', category: 'product', weight: 5 },
    { qId: 9, partial: 'Founder', category: 'strategy', weight: 5 },
    { qId: 9, partial: 'Design Director', category: 'design', weight: 5 },
    { qId: 9, partial: 'Strategic Consultant', category: 'strategy', weight: 5 },
    // Q11 – meeting strength
    { qId: 11, partial: 'Critical thinking', category: 'tech', weight: 2 },
    { qId: 11, partial: 'Creative ideas', category: 'design', weight: 2 },
    { qId: 11, partial: 'Facilitation', category: 'management', weight: 2 },
    { qId: 11, partial: 'Decision making', category: 'strategy', weight: 2 },
    // Q15 – startup spending
    { qId: 15, partial: 'best engineers', category: 'tech', weight: 2 },
    { qId: 15, partial: 'marketing', category: 'strategy', weight: 2 },
    { qId: 15, partial: 'UI/UX', category: 'design', weight: 2 },
    { qId: 15, partial: 'deep R', category: 'data', weight: 2 },
  ], s);
  return s;
}

function pickProfessionalRole(s: ScoreMap): Recommendation {
  const sorted = Object.entries(s).sort((a, b) => b[1] - a[1]);
  const [first, firstScore] = sorted[0] ?? ['management', 0];
  const [second] = sorted[1] ?? ['tech', 0];
  const total = Object.values(s).reduce((a, b) => a + b, 0) || 1;
  const conf = Math.min(97, Math.round(68 + (firstScore / total) * 100));

  if (first === 'tech' && (second === 'management' || second === 'strategy'))
    return { role: 'CTO / Technical Lead', confidence: conf, reasoning: 'You possess the rare blend of deep technical mastery and leadership vision that defines great CTOs.', strengths: ['System Architecture', 'Strategic Vision', 'Team Leadership', 'Tech Evangelism'], weaknesses: ['Fine-grained Resource Management', 'Detailed Implementation'], salaryRange: '₹40L–₹1Cr+ / $150k–$300k+', futureScope: 'Top Tier – Tech leadership is irreplaceable in the AI era.', aiImpact: 5, demandScore: 96 };

  if (first === 'tech')
    return { role: 'Cloud / Solutions Architect', confidence: conf, reasoning: 'Your obsession with scalability, system design, and performance is the blueprint for a world-class architect.', strengths: ['System Design', 'Cloud Infrastructure (AWS/GCP/Azure)', 'Performance Optimization', 'Microservices'], weaknesses: ['Frontend Aesthetics', 'Marketing'], salaryRange: '₹25L–₹60L / $140k–$220k', futureScope: 'Very Strong – AI and cloud go hand-in-hand.', aiImpact: 10, demandScore: 94 };

  if (first === 'product' || (first === 'strategy' && second === 'product'))
    return { role: 'Head of Product', confidence: conf, reasoning: 'Your product-first thinking, user empathy, and business acumen make you an exceptional product leader.', strengths: ['Product Vision', 'Roadmapping', 'Stakeholder Alignment', 'Market Intuition'], weaknesses: ['Deep Technical Coding', 'Design Execution'], salaryRange: '₹25L–₹80L / $120k–$200k', futureScope: 'Strong – AI tools need great PMs to humanize and direct them.', aiImpact: 10, demandScore: 93 };

  if (first === 'design')
    return { role: 'Design Director / UX Lead', confidence: conf, reasoning: 'Your creative depth and leadership instinct put you on the path to leading entire design organizations.', strengths: ['Design Systems', 'Brand Vision', 'User Research', 'Cross-team Collaboration'], weaknesses: ['Hard Engineering', 'Data Analysis'], salaryRange: '₹20L–₹50L / $120k–$180k', futureScope: 'Stable – Human-centered design becomes critical as AI automates logic.', aiImpact: 20, demandScore: 88 };

  if (first === 'data')
    return { role: 'AI / Data Architect', confidence: conf, reasoning: 'Your deep expertise in data and analytics positions you for high-value AI strategy and architecture roles.', strengths: ['Data Modelling', 'AI Strategy', 'Analytics Pipelines', 'Research & Experimentation'], weaknesses: ['People Management', 'Brand Marketing'], salaryRange: '₹25L–₹70L / $140k–$220k', futureScope: 'Excellent – Every enterprise is building AI infrastructure and needs architects.', aiImpact: 5, demandScore: 97 };

  if (first === 'strategy')
    return { role: 'VP Engineering / GM', confidence: conf, reasoning: 'Your strategic mindset and executive presence put you in line for VP and GM roles.', strengths: ['Business Strategy', 'OKRs & Metrics', 'Executive Communication', 'Org Building'], weaknesses: ['Technical Depth', 'Hands-on Design'], salaryRange: '₹30L–₹80L / $130k–$220k', futureScope: 'Strong – Business-tech hybrid leaders are critical in AI-transformation.', aiImpact: 8, demandScore: 92 };

  // management default
  return { role: 'Engineering Manager', confidence: conf, reasoning: 'Your ability to handle teams, process, and delivery makes you ideal for engineering leadership.', strengths: ['People Management', 'Process Optimization', 'Delivery Excellence', 'Mentorship'], weaknesses: ['Deep R&D', 'Visual Design'], salaryRange: '₹20L–₹55L / $130k–$190k', futureScope: 'Strong – Management skills are transferable and AI needs human leadership.', aiImpact: 15, demandScore: 93 };
}

// ── Public API ────────────────────────────────────────────────────────────────
export const getCareerRecommendation = (
  roleType: 'student' | 'professional',
  answers: Record<number, string>
): Recommendation => {
  if (roleType === 'student') {
    return pickStudentRole(scoreStudent(answers));
  }
  return pickProfessionalRole(scoreProfessional(answers));
};

export const careerEngine = { getCareerRecommendation };
