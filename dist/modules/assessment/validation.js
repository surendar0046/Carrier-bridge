"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordBatchResponsesSchema = exports.RecordResponseSchema = exports.CreateAttemptSchema = exports.DatasetQuestionSchema = exports.QuestionDomainWeightsSchema = exports.DomainWeightMapSchema = exports.OptionItemSchema = exports.DifficultySchema = exports.SectionSchema = exports.AudienceSchema = exports.OptionKeySchema = void 0;
exports.validateQuestionDataset = validateQuestionDataset;
const zod_1 = require("zod");
exports.OptionKeySchema = zod_1.z.enum(['A', 'B', 'C', 'D']);
exports.AudienceSchema = zod_1.z.enum(['12th', 'engineering']);
exports.SectionSchema = zod_1.z.enum(['interest', 'aptitude', 'scenario', 'skill', 'technical']);
exports.DifficultySchema = zod_1.z.enum(['easy', 'medium', 'hard']);
exports.OptionItemSchema = zod_1.z.object({
    key: exports.OptionKeySchema,
    text: zod_1.z.string().min(1, 'Option text cannot be empty'),
});
// Domain weight: map of domainSlug -> integer weight between 0 and 3
exports.DomainWeightMapSchema = zod_1.z.record(zod_1.z.string(), zod_1.z.number().int().min(0, 'Weight cannot be less than 0').max(3, 'Weight cannot exceed 3'));
exports.QuestionDomainWeightsSchema = zod_1.z.object({
    A: exports.DomainWeightMapSchema.optional().default({}),
    B: exports.DomainWeightMapSchema.optional().default({}),
    C: exports.DomainWeightMapSchema.optional().default({}),
    D: exports.DomainWeightMapSchema.optional().default({}),
});
exports.DatasetQuestionSchema = zod_1.z
    .object({
    id: zod_1.z.string().min(1, 'Question ID is required').regex(/^[a-zA-Z0-9_-]+$/, 'Question ID must be alphanumeric/dashes'),
    audience: exports.AudienceSchema,
    section: exports.SectionSchema,
    question: zod_1.z.string().min(5, 'Question text must be at least 5 characters'),
    options: zod_1.z
        .array(exports.OptionItemSchema)
        .length(4, 'Question must have exactly 4 options (A, B, C, D)')
        .refine((opts) => {
        const keys = opts.map((o) => o.key);
        return keys.includes('A') && keys.includes('B') && keys.includes('C') && keys.includes('D');
    }, { message: 'Options must contain exactly keys A, B, C, and D' }),
    correct_answer: exports.OptionKeySchema.nullable().optional(),
    difficulty: exports.DifficultySchema.default('medium'),
    explanation: zod_1.z.string().default(''),
    domain_weights: exports.QuestionDomainWeightsSchema,
})
    .superRefine((data, ctx) => {
    // If section is aptitude or technical, correct_answer is required
    if (data.section === 'aptitude' || data.section === 'technical') {
        if (!data.correct_answer) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: `correct_answer is required for section '${data.section}'`,
                path: ['correct_answer'],
            });
        }
    }
});
/**
 * Validates a dataset array and produces a non-silent detailed error report
 */
function validateQuestionDataset(data) {
    const valid = [];
    const errors = [];
    data.forEach((row, index) => {
        const rowNum = index + 1;
        const parsed = exports.DatasetQuestionSchema.safeParse(row);
        if (parsed.success) {
            valid.push(parsed.data);
        }
        else {
            const rowId = typeof row === 'object' && row !== null && 'id' in row ? String(row.id) : undefined;
            const formattedErrors = parsed.error.issues.map((issue) => `[${issue.path.join('.') || 'root'}]: ${issue.message}`);
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
exports.CreateAttemptSchema = zod_1.z.object({
    audience: exports.AudienceSchema.default('engineering'),
    stage: zod_1.z.string().min(1).default('initial'),
});
exports.RecordResponseSchema = zod_1.z.object({
    question_id: zod_1.z.string().min(1, 'Question ID is required'),
    selected_option: exports.OptionKeySchema,
    time_spent_seconds: zod_1.z.number().int().nonnegative().default(0),
});
exports.RecordBatchResponsesSchema = zod_1.z.object({
    responses: zod_1.z.array(exports.RecordResponseSchema).min(1, 'At least one response is required'),
});
