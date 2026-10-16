export type OnboardingStage = 'school' | 'early' | 'final';

export type QuestionType = 'single' | 'multi' | 'rating' | 'month_picker' | 'text' | 'dropdown';

export interface OnboardingOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
}

export interface OnboardingQuestion {
  id: string;
  stage: OnboardingStage;
  stepNumber: number;
  questionText: string;
  description?: string;
  type: QuestionType;
  options?: OnboardingOption[];
  placeholder?: string;
  isRequired: boolean;
  minRating?: number;
  maxRating?: number;
}

export interface Under18Consent {
  isUnder18: boolean;
  studentConsent: boolean;
  parentConsent: boolean;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export interface BranchInsight {
  branchName: string;
  typicalRoles: string[];
  keySkills: string[];
  demandOutlook: string;
  source: string;
  sourceDate: string;
  isPlaceholder?: boolean;
}

export interface WorkPathStep {
  title: string;
  period: string;
  focus: string;
  items: string[];
}

export interface OnboardingSuggestion {
  title: string;
  subtitle: string;
  reasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
  insight?: BranchInsight;
  isPrimary?: boolean;
}

export interface PlacementPlanModule {
  weekRange: string;
  focusArea: string;
  targetCompanyTypes: string[];
  modules: string[];
  assessmentsNeeded: string[];
  mockInterviewSlotSuggested: boolean;
}

export interface OnboardingResultPayload {
  stage: OnboardingStage;
  primarySuggestion: OnboardingSuggestion;
  secondarySuggestion?: OnboardingSuggestion;
  workPath?: WorkPathStep[];
  placementPlan?: PlacementPlanModule[];
  assignedRoadmapId: string;
  assignedDomain: string;
  assignedRole: string;
  reasons: string[];
  confidence: 'High' | 'Medium' | 'Low';
  reliabilityStatus: 'RELIABLE' | 'SUSPICIOUS_SPEED' | 'CONTRADICTORY' | 'NEEDS_REVIEW';
  reviewReason?: string;
  completedAt: string;
}

export interface OnboardingProgressState {
  stage: OnboardingStage;
  currentStep: number;
  answers: Record<string, any>;
  under18Consent?: Under18Consent;
  startedAt: number;
  lastSavedAt: number;
  isCompleted: boolean;
}
