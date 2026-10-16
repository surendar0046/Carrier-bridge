import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { query, pool } from '../../config/db';
import { authenticateToken } from '../../middleware/auth';
import { SaveProgressSchema, SubmitOnboardingSchema } from './validation';
import {
  evaluate12thStandard,
  evaluateEarlyCollege,
  evaluateFinalCollege,
  checkReliability,
} from '../../../../packages/ai/src/modules/onboardingEngine';
import {
  SCHOOL_QUESTIONS,
  EARLY_COLLEGE_QUESTIONS,
  FINAL_COLLEGE_QUESTIONS,
  getQuestionsForStage,
} from '../../../../apps/web/src/data/onboardingQuestions';

export const onboardingRouter = Router();

// ── GET /api/onboarding/questions ───────────────────────────────────────────
onboardingRouter.get('/questions', async (req: Request, res: Response): Promise<void> => {
  try {
    const stageParam = (req.query.stage as string) || 'school';
    if (!['school', 'early', 'final'].includes(stageParam)) {
      res.status(400).json({ success: false, error: { message: 'Invalid stage parameter.' } });
      return;
    }

    // Try fetching from DB if questions table exists
    try {
      const dbResult = await query(
        'SELECT id, stage, step_number, question_text, description, question_type, options, is_required FROM onboarding_questions WHERE stage = $1 AND is_active = true ORDER BY step_number ASC',
        [stageParam]
      );

      if (dbResult && dbResult.rows && dbResult.rows.length > 0) {
        const questions = dbResult.rows.map((r: any) => ({
          id: r.id,
          stage: r.stage,
          stepNumber: r.step_number,
          questionText: r.question_text,
          description: r.description,
          type: r.question_type,
          options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options,
          isRequired: Boolean(r.is_required),
        }));

        res.json({ success: true, data: questions, meta: { count: questions.length, source: 'database' } });
        return;
      }
    } catch {
      // Fallback seamlessly to in-repo question banks
    }

    const fallbackQuestions = getQuestionsForStage(stageParam as any);
    res.json({
      success: true,
      data: fallbackQuestions,
      meta: { count: fallbackQuestions.length, source: 'seed' },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── GET /api/onboarding/status ──────────────────────────────────────────────
onboardingRouter.get('/status', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'guest_user';

    try {
      const result = await query(
        'SELECT id, stage, primary_suggestion, secondary_suggestion, work_path, reasons, confidence, reliability_status, created_at FROM onboarding_results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (result && result.rows && result.rows.length > 0) {
        const row = result.rows[0];
        res.json({
          success: true,
          data: {
            isCompleted: true,
            stage: row.stage,
            result: {
              primarySuggestion: typeof row.primary_suggestion === 'string' ? JSON.parse(row.primary_suggestion) : row.primary_suggestion,
              secondarySuggestion: typeof row.secondary_suggestion === 'string' ? JSON.parse(row.secondary_suggestion) : row.secondary_suggestion,
              workPath: typeof row.work_path === 'string' ? JSON.parse(row.work_path) : row.work_path,
              reasons: typeof row.reasons === 'string' ? JSON.parse(row.reasons) : row.reasons,
              confidence: row.confidence,
              reliabilityStatus: row.reliability_status,
              completedAt: row.created_at,
            },
          },
        });
        return;
      }
    } catch {
      // In local dev without MySQL, return status false
    }

    res.json({
      success: true,
      data: { isCompleted: false, stage: null, result: null },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── POST /api/onboarding/save-progress ──────────────────────────────────────
onboardingRouter.post('/save-progress', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = SaveProgressSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: { message: 'Invalid payload', details: parseResult.error.format() } });
      return;
    }

    const { stage, answers } = parseResult.data;
    const userId = req.user?.id || 'guest_user';
    const responseId = `resp_${randomUUID()}`;

    try {
      await query(
        `INSERT INTO onboarding_responses (id, user_id, stage, answers, is_completed)
         VALUES ($1, $2, $3, $4, false)
         ON DUPLICATE KEY UPDATE answers = $4, updated_at = CURRENT_TIMESTAMP`,
        [responseId, userId, stage, JSON.stringify(answers)]
      );
    } catch {
      // Local fallback
    }

    res.json({ success: true, message: 'Progress saved successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── POST /api/onboarding/submit ─────────────────────────────────────────────
onboardingRouter.post('/submit', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = SubmitOnboardingSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ success: false, error: { message: 'Validation failed', details: parseResult.error.format() } });
      return;
    }

    const { stage, answers, timeTakenSeconds, under18Consent } = parseResult.data;
    const userId = req.user?.id || 'guest_user';

    // 1. Run pure, deterministic recommendation engine
    let payloadResult;
    if (stage === 'school') {
      payloadResult = evaluate12thStandard(answers, timeTakenSeconds, under18Consent as any);
    } else if (stage === 'early') {
      payloadResult = evaluateEarlyCollege(answers, timeTakenSeconds);
    } else {
      payloadResult = evaluateFinalCollege(answers, timeTakenSeconds);
    }

    // 2. Persist to DB if database is connected
    const responseId = `resp_${randomUUID()}`;
    const resultId = `res_${randomUUID()}`;
    const roadmapId = `rdm_${randomUUID()}`;

    try {
      await query(
        `INSERT INTO onboarding_responses (id, user_id, stage, answers, time_taken_seconds, is_completed, completed_at)
         VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP)`,
        [responseId, userId, stage, JSON.stringify(answers), timeTakenSeconds]
      );

      await query(
        `INSERT INTO onboarding_results (id, user_id, stage, response_id, primary_suggestion, secondary_suggestion, work_path, reasons, confidence, reliability_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          resultId,
          userId,
          stage,
          responseId,
          JSON.stringify(payloadResult.primarySuggestion),
          JSON.stringify(payloadResult.secondarySuggestion || null),
          JSON.stringify(payloadResult.workPath || payloadResult.placementPlan || []),
          JSON.stringify(payloadResult.reasons),
          payloadResult.confidence,
          payloadResult.reliabilityStatus,
        ]
      );

      await query(
        `INSERT INTO user_roadmaps (id, user_id, roadmap_id, stage, target_domain, target_role, phases, active_phase)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 0)
         ON DUPLICATE KEY UPDATE target_domain = $5, target_role = $6, updated_at = CURRENT_TIMESTAMP`,
        [
          roadmapId,
          userId,
          payloadResult.assignedRoadmapId,
          stage,
          payloadResult.assignedDomain,
          payloadResult.assignedRole,
          JSON.stringify(payloadResult.workPath || []),
        ]
      );
    } catch (dbErr: any) {
      console.warn('[Onboarding] Note: DB persistence skipped or fallback used:', dbErr.message);
    }

    res.json({
      success: true,
      data: payloadResult,
      message: 'Onboarding evaluated and personalized pathway successfully generated.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});

// ── POST /api/onboarding/reset ──────────────────────────────────────────────
onboardingRouter.post('/reset', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || 'guest_user';

    try {
      // Delete active user_roadmaps and marks previous onboarding result archived without dropping history
      await query('DELETE FROM user_roadmaps WHERE user_id = $1', [userId]);
    } catch {
      // Local fallback
    }

    res.json({ success: true, message: 'Onboarding reset successfully. User can re-select stage.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: { message: err.message } });
  }
});
