import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { query, pool } from '../../config/db';
import { cache } from '../../config/redis';
import { authenticateToken, requireRole } from '../../middleware/auth';
import {
  CreateAttemptSchema,
  RecordResponseSchema,
  RecordBatchResponsesSchema,
  Audience,
} from './validation';
import { calculateAssessmentScores, QuestionScoringData } from './scoring';

export const assessmentRouter = Router();

// ── GET /api/assessment/questions ───────────────────────────────────────────
// Cached in Redis; never exposes correct_answer to frontend clients.
assessmentRouter.get('/questions', async (req: Request, res: Response): Promise<void> => {
  try {
    const audienceParam = req.query.audience as string | undefined;
    const cacheKey = `assessment_questions_${audienceParam || 'all'}`;

    const cachedData = await cache.get(cacheKey);
    if (cachedData) {
      res.json({
        success: true,
        data: JSON.parse(cachedData),
        meta: { cached: true },
      });
      return;
    }

    let sql = `
      SELECT id, audience, section, question, options, difficulty, explanation
      FROM assessment_questions
      WHERE is_active = true
    `;
    const params: any[] = [];

    if (audienceParam === '12th' || audienceParam === 'engineering') {
      params.push(audienceParam);
      sql += ` AND audience = $${params.length}`;
    }

    sql += ' ORDER BY section, id ASC';

    const result = await query(sql, params);

    const questions = result.rows.map((row) => ({
      id: row.id,
      audience: row.audience,
      section: row.section,
      question: row.question,
      options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
      difficulty: row.difficulty,
      explanation: row.explanation,
    }));

    // Cache for 1 hour
    await cache.set(cacheKey, JSON.stringify(questions), 3600);

    res.json({
      success: true,
      data: questions,
      meta: { cached: false, count: questions.length },
    });
  } catch (err: any) {
    console.error('[Assessment API] Error fetching questions:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to retrieve assessment questions.' },
    });
  }
});

// All following routes require authentication & student role
assessmentRouter.use(authenticateToken);
assessmentRouter.use(requireRole(['STUDENT', 'ADMIN']));

// ── POST /api/assessment/attempts ───────────────────────────────────────────
// Creates a new attempt session for the authenticated student.
assessmentRouter.post('/attempts', async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = CreateAttemptSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message },
      });
      return;
    }

    const userId = req.user!.id;
    const attemptId = `att_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const { audience, stage } = parsed.data;

    await query(
      `INSERT INTO assessment_attempts (id, user_id, audience, stage, started_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [attemptId, userId, audience, stage]
    );

    res.status(201).json({
      success: true,
      data: {
        attempt_id: attemptId,
        user_id: userId,
        audience,
        stage,
        started_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[Assessment API] Error creating attempt:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to create assessment attempt.' },
    });
  }
});

// ── POST /api/assessment/attempts/:id/responses ─────────────────────────────
// Records answer responses for an ongoing attempt (validates student ownership).
assessmentRouter.post('/attempts/:id/responses', async (req: Request, res: Response): Promise<void> => {
  const attemptId = req.params.id;
  const userId = req.user!.id;

  try {
    // 1. Verify attempt ownership and ongoing status
    const attemptRes = await query(
      'SELECT id, user_id, completed_at FROM assessment_attempts WHERE id = $1',
      [attemptId]
    );

    if (attemptRes.rowCount === 0) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Assessment attempt not found.' },
      });
      return;
    }

    const attempt = attemptRes.rows[0];
    if (attempt.user_id !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You cannot submit responses to another user\'s attempt.' },
      });
      return;
    }

    if (attempt.completed_at) {
      res.status(400).json({
        success: false,
        error: { code: 'ATTEMPT_CLOSED', message: 'This assessment attempt is already completed.' },
      });
      return;
    }

    // 2. Parse payload (supports single response or batch { responses: [...] })
    let responsesToRecord: Array<{
      question_id: string;
      selected_option: 'A' | 'B' | 'C' | 'D';
      time_spent_seconds: number;
    }> = [];

    if (Array.isArray(req.body.responses)) {
      const batchParsed = RecordBatchResponsesSchema.safeParse(req.body);
      if (!batchParsed.success) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: batchParsed.error.issues[0]?.message },
        });
        return;
      }
      responsesToRecord = batchParsed.data.responses;
    } else {
      const singleParsed = RecordResponseSchema.safeParse(req.body);
      if (!singleParsed.success) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: singleParsed.error.issues[0]?.message },
        });
        return;
      }
      responsesToRecord = [singleParsed.data];
    }

    // 3. Upsert responses into database
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const item of responsesToRecord) {
        // Check question correct answer
        const qRes = await client.query(
          'SELECT correct_answer FROM assessment_questions WHERE id = $1',
          [item.question_id]
        );
        const correctAnswer = qRes.rows[0]?.correct_answer;
        const isCorrect = correctAnswer ? item.selected_option === correctAnswer : null;

        await client.query(
          `INSERT INTO assessment_responses (
            attempt_id, question_id, selected_option, is_correct, time_spent_seconds, created_at
          ) VALUES (?, ?, ?, ?, ?, NOW())
          ON DUPLICATE KEY UPDATE
            selected_option = VALUES(selected_option),
            is_correct = VALUES(is_correct),
            time_spent_seconds = VALUES(time_spent_seconds)`,
          [attemptId, item.question_id, item.selected_option, isCorrect, item.time_spent_seconds]
        );
      }

      await client.query('COMMIT');
    } catch (dbErr: any) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }

    res.json({
      success: true,
      data: {
        attempt_id: attemptId,
        recorded_count: responsesToRecord.length,
      },
    });
  } catch (err: any) {
    console.error('[Assessment API] Error recording responses:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to record response(s).' },
    });
  }
});

// ── POST /api/assessment/attempts/:id/complete ──────────────────────────────
// Finalizes attempt, evaluates deterministic scoring, persists results and career recommendation.
assessmentRouter.post('/attempts/:id/complete', async (req: Request, res: Response): Promise<void> => {
  const attemptId = req.params.id;
  const userId = req.user!.id;

  try {
    // 1. Verify attempt ownership
    const attemptRes = await query(
      'SELECT id, user_id, audience, completed_at FROM assessment_attempts WHERE id = ?',
      [attemptId]
    );

    if (attemptRes.rowCount === 0) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Assessment attempt not found.' },
      });
      return;
    }

    const attempt = attemptRes.rows[0];
    if (attempt.user_id !== userId && req.user!.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'You cannot complete another user\'s assessment.' },
      });
      return;
    }

    // 2. Fetch responses for this attempt
    const responsesRes = await query(
      'SELECT question_id, selected_option, time_spent_seconds FROM assessment_responses WHERE attempt_id = ?',
      [attemptId]
    );

    if (responsesRes.rowCount === 0) {
      res.status(400).json({
        success: false,
        error: { code: 'EMPTY_ATTEMPT', message: 'Cannot complete an attempt with no recorded answers.' },
      });
      return;
    }

    // 3. Fetch questions and their domain weights
    const questionsRes = await query(
      'SELECT id, section, correct_answer FROM assessment_questions WHERE is_active = true'
    );
    const weightsRes = await query(
      `SELECT w.question_id, w.option_key, w.weight, d.slug as domain_slug
       FROM question_domain_weights w
       JOIN domains d ON w.domain_id = d.id`
    );

    const weightsByQuestion: Record<string, Record<string, Record<string, number>>> = {};
    for (const w of weightsRes.rows) {
      if (!weightsByQuestion[w.question_id]) weightsByQuestion[w.question_id] = {};
      if (!weightsByQuestion[w.question_id][w.option_key]) weightsByQuestion[w.question_id][w.option_key] = {};
      weightsByQuestion[w.question_id][w.option_key][w.domain_slug] = Number(w.weight);
    }

    const questions: QuestionScoringData[] = questionsRes.rows.map((r) => ({
      id: r.id,
      section: r.section,
      correct_answer: r.correct_answer,
      domain_weights: weightsByQuestion[r.id] || {},
    }));

    // 4. Fetch all domains
    const domainsRes = await query('SELECT id, name, slug, description FROM domains');
    const domains = domainsRes.rows;

    // 5. Score the assessment with pure deterministic engine
    const scoringResult = calculateAssessmentScores(
      questions,
      responsesRes.rows.map((r) => ({
        question_id: r.question_id,
        selected_option: r.selected_option,
        time_spent_seconds: r.time_spent_seconds,
      })),
      domains
    );

    // 6. Save results and mark attempt completed in transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query(
        'UPDATE assessment_attempts SET completed_at = NOW() WHERE id = ?',
        [attemptId]
      );

      await client.query(
        `INSERT INTO assessment_results (attempt_id, section_scores, top_domains, skill_gaps, created_at)
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           section_scores = VALUES(section_scores),
           top_domains = VALUES(top_domains),
           skill_gaps = VALUES(skill_gaps)`,
        [
          attemptId,
          JSON.stringify(scoringResult.section_scores),
          JSON.stringify(scoringResult.top_domains),
          JSON.stringify(scoringResult.skill_gaps),
        ]
      );

      await client.query('COMMIT');
    } catch (dbErr: any) {
      await client.query('ROLLBACK');
      throw dbErr;
    } finally {
      client.release();
    }

    res.json({
      success: true,
      data: {
        attempt_id: attemptId,
        user_id: userId,
        section_scores: scoringResult.section_scores,
        aptitude_percent: scoringResult.aptitude_percent,
        top_domains: scoringResult.top_domains,
        skill_gaps: scoringResult.skill_gaps,
        completed_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('[Assessment API] Error completing attempt:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'SCORING_ERROR', message: 'Failed to score assessment attempt.' },
    });
  }
});

// ── GET /api/assessment/results/me ──────────────────────────────────────────
// Returns the student's latest assessment recommendations and historical results.
assessmentRouter.get('/results/me', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const resultsRes = await query(
      `SELECT r.id, r.attempt_id, r.section_scores, r.top_domains, r.skill_gaps, r.created_at,
              a.audience, a.stage, a.started_at, a.completed_at
       FROM assessment_results r
       JOIN assessment_attempts a ON r.attempt_id = a.id
       WHERE a.user_id = $1
       ORDER BY r.created_at DESC`,
      [userId]
    );

    if (resultsRes.rowCount === 0) {
      res.json({
        success: true,
        data: null,
        message: 'No completed assessments found for this user.',
      });
      return;
    }

    const latest = resultsRes.rows[0];
    res.json({
      success: true,
      data: {
        latest: {
          attempt_id: latest.attempt_id,
          audience: latest.audience,
          stage: latest.stage,
          completed_at: latest.completed_at,
          section_scores: typeof latest.section_scores === 'string' ? JSON.parse(latest.section_scores) : latest.section_scores,
          top_domains: typeof latest.top_domains === 'string' ? JSON.parse(latest.top_domains) : latest.top_domains,
          skill_gaps: typeof latest.skill_gaps === 'string' ? JSON.parse(latest.skill_gaps) : latest.skill_gaps,
        },
        history: resultsRes.rows.map((row) => ({
          attempt_id: row.attempt_id,
          completed_at: row.completed_at,
          top_domains: typeof row.top_domains === 'string' ? JSON.parse(row.top_domains) : row.top_domains,
        })),
      },
    });
  } catch (err: any) {
    console.error('[Assessment API] Error fetching user results:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'DATABASE_ERROR', message: 'Failed to fetch assessment results.' },
    });
  }
});
