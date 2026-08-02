export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills?: string[];
}

export interface JobSearchRequest {
  keyword?: string;
  location?: string;
  type?: string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  isRemote?: boolean;
  page?: number;
  limit?: number;
}

export interface ApplyJobRequest {
  jobId: string;
  coverLetter?: string;
  resumeId: string;
}

export interface BookSessionRequest {
  mentorId: string;
  scheduledAt: string;
  duration: number;
  topic: string;
}

export interface SendMessageRequest {
  roomId: string;
  content: string;
  type?: string;
  fileUrl?: string;
}

export interface AIQueryRequest {
  message: string;
  context?: Record<string, unknown>;
  sessionId?: string;
}
