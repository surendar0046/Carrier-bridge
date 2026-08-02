export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionType?: string;
  metadata?: Record<string, unknown>;
}

export interface CareerAnalysis {
  currentLevel: string;
  targetRole: string;
  skillGaps: string[];
  recommendedPaths: CareerPath[];
  estimatedTimeline: string;
  confidence: number;
}

export interface CareerPath {
  role: string;
  probability: number;
  timeframe: string;
  requiredSkills: string[];
  averageSalary: number;
}

export interface SkillGapResult {
  currentSkills: string[];
  requiredSkills: string[];
  gaps: SkillGap[];
  priorityOrder: string[];
}

export interface SkillGap {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  resources: string[];
  estimatedLearningTime: number;
}
