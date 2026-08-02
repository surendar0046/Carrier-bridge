export interface CareerRecommendation {
  role: string;
  confidence: number;
  reasoning: string;
  strengths: string[];
  weaknesses: string[];
  salaryRange: string;
  futureScope: string;
  aiImpact: number;
  demandScore: number;
}

export interface RoadmapPhase {
  id: number;
  title: string;
  duration: string;
  accent: string;
  skills: string[];
  projects: string[];
  tools: string[];
  milestone: string;
}

export interface RoleRoadmap {
  emoji: string;
  duration: string;
  salary: string;
  demand: number;
  phases: RoadmapPhase[];
}
