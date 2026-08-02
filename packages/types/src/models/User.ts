import { UserRole } from '../common/enums';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  education: Education[];
  experience: WorkExperience[];
  certifications: Certification[];
  languages: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  current: boolean;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  skills: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}
