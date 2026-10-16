import { z } from 'zod';

export const StageEnum = z.enum(['school', 'early', 'final']);
export type StageType = z.infer<typeof StageEnum>;

export const SaveProgressSchema = z.object({
  stage: StageEnum,
  currentStep: z.number().int().min(1).max(10),
  answers: z.record(z.any()),
  under18Consent: z.object({
    isUnder18: z.boolean().optional(),
    studentConsent: z.boolean().optional(),
    parentConsent: z.boolean().optional(),
    parentName: z.string().optional(),
    parentEmail: z.string().email().optional().or(z.literal('')),
    parentPhone: z.string().optional(),
  }).optional(),
});

export const SubmitOnboardingSchema = z.object({
  stage: StageEnum,
  answers: z.record(z.any()),
  timeTakenSeconds: z.number().int().min(0).default(0),
  under18Consent: z.object({
    isUnder18: z.boolean().optional(),
    studentConsent: z.boolean().optional(),
    parentConsent: z.boolean().optional(),
    parentName: z.string().optional(),
    parentEmail: z.string().email().optional().or(z.literal('')),
    parentPhone: z.string().optional(),
  }).optional(),
});

export type SubmitOnboardingInput = z.infer<typeof SubmitOnboardingSchema>;
