import { z } from 'zod';

export const OptionKeySchema = z.enum(['A', 'B', 'C', 'D']);
export type OptionKey = z.infer<typeof OptionKeySchema>;

export const AudienceSchema = z.enum(['12th', 'engineering']);
export type Audience = z.infer<typeof AudienceSchema>;

export const SectionSchema = z.enum(['interest', 'aptitude', 'scenario', 'skill', 'technical']);
export type Section = z.infer<typeof SectionSchema>;

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const OptionItemSchema = z.object({
  key: OptionKeySchema,
  text: z.string().min(1, 'Option text cannot be empty'),
});
export type OptionItem = z.infer<typeof OptionItemSchema>;

// Domain weight: map of domainSlug -> integer weight between 0 and 3
export const DomainWeightMapSchema = z.record(
  z.string(),
  z.number().int().min(0, 'Weight cannot be less than 0').max(3, 'Weight cannot exceed 3')
);

export const QuestionDomainWeightsSchema = z.object({
  A: DomainWeightMapSchema.optional().default({}),
  B: DomainWeightMapSchema.optional().default({}),
  C: DomainWeightMapSchema.optional().default({}),
  D: DomainWeightMapSchema.optional().default({}),
});

export const DatasetQuestionSchema = z
  .object({
    id: z.string().min(1, 'Question ID is required').regex(/^[a-zA-Z0-9_-]+$/, 'Question ID must be alphanumeric/dashes'),
    audience: AudienceSchema,
    section: SectionSchema,
    question: z.string().min(5, 'Question text must be at least 5 characters'),
    options: z
      .array(OptionItemSchema)
      .length(4, 'Question must have exactly 4 options (A, B, C, D)')
      .refine(
        (opts) => {
          const keys = opts.map((o) => o.key);
          return keys.includes('A') && keys.includes('B') && keys.includes('C') && keys.includes('D');
        },
        { message: 'Options must contain exactly keys A, B, C, and D' }
      ),
    correct_answer: OptionKeySchema.nullable().optional(),
    difficulty: DifficultySchema.default('medium'),
    explanation: z.string().default(''),
    domain_weights: QuestionDomainWeightsSchema,
  })
  .superRefine((data, ctx) => {
    // If section is aptitude or technical, correct_answer is required
    if (data.section === 'aptitude' || data.section === 'technical') {
      if (!data.correct_answer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `correct_answer is required for section '${data.section}'`,
          path: ['correct_answer'],
        });
      }
    }
  });

export type DatasetQuestion = z.infer<typeof DatasetQuestionSchema>;

export interface ValidationReport {
  totalRows: number;
  validCount: number;
  invalidCount: number;
  errors: Array<{
    rowNumber: number;
    id?: string;
    errors: string[];
  }>;
}

/**
 * Validates a dataset array and produces a non-silent detailed error report
 */
export function validateQuestionDataset(data: unknown[]): {
  valid: DatasetQuestion[];
  report: ValidationReport;
} {
  const valid: DatasetQuestion[] = [];
  const errors: ValidationReport['errors'] = [];

  data.forEach((row, index) => {
    const rowNum = index + 1;
    const parsed = DatasetQuestionSchema.safeParse(row);

    if (parsed.success) {
      valid.push(parsed.data);
    } else {
      const rowId = typeof row === 'object' && row !== null && 'id' in row ? String((row as any).id) : undefined;
      const formattedErrors = parsed.error.issues.map(
        (issue) => `[${issue.path.join('.') || 'root'}]: ${issue.message}`
      );
      errors.push({
        rowNumber: rowNum,
        id: rowId,
        errors: formattedErrors,
      });
    }
  });

  return {
    valid,
    report: {
      totalRows: data.length,
      validCount: valid.length,
      invalidCount: errors.length,
      errors,
    },
  };
}

// ── API Payload Validation Schemas ──────────────────────────────────────────

export const CreateAttemptSchema = z.object({
  audience: AudienceSchema.default('engineering'),
  stage: z.string().min(1).default('initial'),
});

export const RecordResponseSchema = z.object({
  question_id: z.string().min(1, 'Question ID is required'),
  selected_option: OptionKeySchema,
  time_spent_seconds: z.number().int().nonnegative().default(0),
});

export const RecordBatchResponsesSchema = z.object({
  responses: z.array(RecordResponseSchema).min(1, 'At least one response is required'),
});
