export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: ResumeTemplate;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
  projects: ResumeProject[];
  atsScore?: ATSScore;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  grade?: string;
}

export interface ResumeSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
}

export interface ATSScore {
  overall: number;
  keyword: number;
  formatting: number;
  readability: number;
  suggestions: string[];
  missingKeywords: string[];
  lastScored: string;
}

export type ResumeTemplate = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive';
