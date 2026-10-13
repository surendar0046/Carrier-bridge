import { SessionStatus } from '../common/enums';

export interface Mentor {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  title: string;
  company: string;
  expertise: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  totalSessions: number;
  hourlyRate: number;
  currency: string;
  availability: Availability[];
  languages: string[];
  linkedinUrl?: string;
  isVerified: boolean;
  responseTime: string;
}

export interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface MentorSession {
  id: string;
  mentorId: string;
  userId: string;
  status: SessionStatus;
  scheduledAt: string;
  duration: number;
  topic: string;
  notes?: string;
  meetingUrl?: string;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  whatsappNotified?: boolean;
  emailNotified?: boolean;
  feedback?: SessionFeedback;
}

export interface SessionFeedback {
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface MentorFilter {
  expertise?: string[];
  minRating?: number;
  maxRate?: number;
  language?: string;
  availability?: string;
  page?: number;
  limit?: number;
}
