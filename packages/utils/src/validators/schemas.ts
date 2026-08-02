import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const jobApplicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  resumeId: z.string().min(1, 'Please select a resume'),
  coverLetter: z.string().optional(),
});
