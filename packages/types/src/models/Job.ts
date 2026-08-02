import { JobType, ApplicationStatus } from '../common/enums';

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type?: JobType | string;
  salary?: SalaryRange;
  salaryRange?: string;
  description: string;
  requirements?: string[];
  skills?: string[];
  benefits?: string[];
  postedAt?: string;
  deadline?: string;
  applicants?: number;
  matchScore?: number;
  matchPercentage?: number;
  isRemote?: boolean;
  isFeatured?: boolean;
  applyUrl?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'monthly' | 'yearly' | 'hourly';
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus | string;
  coverLetter?: string;
  resumeUrl?: string;
  resumeId?: string;
  appliedAt?: string;
  updatedAt?: string;
  notes?: string;
}

export interface JobFilter {
  keyword?: string;
  location?: string;
  type?: JobType[] | string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  isRemote?: boolean;
  page?: number;
  limit?: number;
}

export interface JobSimulation {
  id: string;
  jobId: string;
  title: string;
  description: string;
  tasks: SimulationTask[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  aiEvaluation?: SimulationEvaluation;
}

export interface SimulationTask {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'design' | 'writing' | 'analysis';
  timeLimit: number;
}

export interface SimulationEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
}
