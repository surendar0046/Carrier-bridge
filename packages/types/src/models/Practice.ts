export type PracticeType = 'aptitude' | 'verbal' | 'coding' | 'debugging';

export interface PracticeQuestion {
  id: string;
  type: PracticeType;
  question: string;
  options?: string[]; // For aptitude and verbal
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  codeSnippet?: string; // For coding and debugging
  testCases?: { input: string; output: string }[]; // For coding
  language?: string; // For coding and debugging
}

export interface UserPracticeSession {
  id: string;
  userId: string;
  type: PracticeType;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  isWeeklyAssessment: boolean;
}
