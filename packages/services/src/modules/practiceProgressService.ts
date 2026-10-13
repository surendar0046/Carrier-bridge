import { gamificationService } from './gamificationService';

export type PracticeCategory = 'aptitude' | 'verbal' | 'coding' | 'debugging' | 'weekly';

export interface PracticeSessionRecord {
  id: string;
  category: PracticeCategory;
  date: string;
  questionsCompleted: number;
  totalQuestions: number;
  score: number;
  accuracy: number;
  xpEarned: number;
  timeTakenSeconds: number;
  language?: string;
  isWeeklyAssessment?: boolean;
}

export interface CategoryProgress {
  category: PracticeCategory;
  completedQuestions: number;
  totalAttempts: number;
  correctAnswers: number;
  accuracy: number;
  xpEarned: number;
  bestScore: number;
  bestAccuracy: number;
  lastPracticed: string | null;
  history: PracticeSessionRecord[];
}

export interface WeeklyAssessmentProgress {
  completed: boolean;
  totalAttempts: number;
  latestScore: number;
  latestTotal: number;
  latestAccuracy: number;
  bestScore: number;
  bestAccuracy: number;
  totalXpEarned: number;
  lastCompletedAt: string | null;
  history: PracticeSessionRecord[];
}

export interface StudentPracticeProgress {
  userId: string;
  aptitude: CategoryProgress;
  verbal: CategoryProgress;
  coding: CategoryProgress;
  debugging: CategoryProgress;
  weeklyAssessment: WeeklyAssessmentProgress;
  totalQuestionsCompleted: number;
  totalXpEarned: number;
  overallAccuracy: number;
  streakDays: number;
  lastActiveDate: string | null;
}

const STORAGE_PREFIX = 'cb_practice_progress_';

const createDefaultCategoryProgress = (category: PracticeCategory): CategoryProgress => ({
  category,
  completedQuestions: 0,
  totalAttempts: 0,
  correctAnswers: 0,
  accuracy: 0,
  xpEarned: 0,
  bestScore: 0,
  bestAccuracy: 0,
  lastPracticed: null,
  history: [],
});

const createDefaultProgress = (userId: string = 'default_student'): StudentPracticeProgress => ({
  userId,
  aptitude: createDefaultCategoryProgress('aptitude'),
  verbal: createDefaultCategoryProgress('verbal'),
  coding: createDefaultCategoryProgress('coding'),
  debugging: createDefaultCategoryProgress('debugging'),
  weeklyAssessment: {
    completed: false,
    totalAttempts: 0,
    latestScore: 0,
    latestTotal: 0,
    latestAccuracy: 0,
    bestScore: 0,
    bestAccuracy: 0,
    totalXpEarned: 0,
    lastCompletedAt: null,
    history: [],
  },
  totalQuestionsCompleted: 0,
  totalXpEarned: 0,
  overallAccuracy: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
});

function getActiveUserKey(explicitUserId?: string): string {
  if (explicitUserId) return `${STORAGE_PREFIX}${explicitUserId}`;
  if (typeof window === 'undefined') return `${STORAGE_PREFIX}default`;

  try {
    const userStr = localStorage.getItem('career-bridge-user');
    if (userStr) {
      const parsed = JSON.parse(userStr);
      const email = parsed?.state?.profile?.email || parsed?.state?.profile?.id;
      if (email) return `${STORAGE_PREFIX}${email}`;
    }
  } catch {
    // fallback
  }

  return `${STORAGE_PREFIX}active_user`;
}

export const practiceProgressService = {
  getProgress(userId?: string): StudentPracticeProgress {
    if (typeof window === 'undefined') {
      return createDefaultProgress(userId);
    }

    const key = getActiveUserKey(userId);
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed: StudentPracticeProgress = JSON.parse(stored);
        return {
          ...createDefaultProgress(userId),
          ...parsed,
          aptitude: { ...createDefaultCategoryProgress('aptitude'), ...(parsed.aptitude || {}) },
          verbal: { ...createDefaultCategoryProgress('verbal'), ...(parsed.verbal || {}) },
          coding: { ...createDefaultCategoryProgress('coding'), ...(parsed.coding || {}) },
          debugging: { ...createDefaultCategoryProgress('debugging'), ...(parsed.debugging || {}) },
          weeklyAssessment: {
            ...createDefaultProgress().weeklyAssessment,
            ...(parsed.weeklyAssessment || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Failed to parse practice progress from localStorage:', e);
    }

    const initial = createDefaultProgress(userId);
    try {
      localStorage.setItem(key, JSON.stringify(initial));
    } catch {}
    return initial;
  },

  recordSession(params: {
    category: PracticeCategory;
    score: number;
    totalQuestions: number;
    timeTakenSeconds: number;
    language?: string;
    isWeeklyAssessment?: boolean;
    userId?: string;
  }): PracticeSessionRecord {
    const {
      category,
      score,
      totalQuestions,
      timeTakenSeconds,
      language,
      isWeeklyAssessment = false,
      userId,
    } = params;

    const current = this.getProgress(userId);
    const now = new Date();
    const nowIso = now.toISOString();

    const safeTotal = Math.max(1, totalQuestions);
    const accuracy = Math.round((Math.max(0, score) / safeTotal) * 100);

    // XP calculation: 20 XP per correct question, with bonus 100 XP for weekly assessment
    const xpPerQuestion = isWeeklyAssessment ? 25 : 20;
    const baseXP = score * xpPerQuestion;
    const bonusXP = isWeeklyAssessment ? 100 : accuracy >= 80 ? 50 : 0;
    const xpEarned = Math.max(10, baseXP + bonusXP);

    const record: PracticeSessionRecord = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category,
      date: nowIso,
      questionsCompleted: totalQuestions,
      totalQuestions,
      score,
      accuracy,
      xpEarned,
      timeTakenSeconds,
      language,
      isWeeklyAssessment,
    };

    // Update Category progress
    const catKey = (category === 'weekly' ? 'aptitude' : category) as 'aptitude' | 'verbal' | 'coding' | 'debugging';
    const cat = current[catKey] || createDefaultCategoryProgress(catKey);

    const newCompletedQuestions = cat.completedQuestions + totalQuestions;
    const newCorrectAnswers = cat.correctAnswers + score;
    const newTotalAttempts = cat.totalAttempts + 1;
    const newAccuracy = Math.round((newCorrectAnswers / Math.max(1, newCompletedQuestions)) * 100);

    current[catKey] = {
      ...cat,
      completedQuestions: newCompletedQuestions,
      totalAttempts: newTotalAttempts,
      correctAnswers: newCorrectAnswers,
      accuracy: newAccuracy,
      xpEarned: cat.xpEarned + xpEarned,
      bestScore: Math.max(cat.bestScore, score),
      bestAccuracy: Math.max(cat.bestAccuracy, accuracy),
      lastPracticed: nowIso,
      history: [record, ...(cat.history || [])].slice(0, 20),
    };

    // If this is a Weekly Assessment, record in weeklyAssessment specifically
    if (isWeeklyAssessment || category === 'weekly') {
      const weekly = current.weeklyAssessment;
      current.weeklyAssessment = {
        completed: true,
        totalAttempts: weekly.totalAttempts + 1,
        latestScore: score,
        latestTotal: totalQuestions,
        latestAccuracy: accuracy,
        bestScore: Math.max(weekly.bestScore, score),
        bestAccuracy: Math.max(weekly.bestAccuracy, accuracy),
        totalXpEarned: weekly.totalXpEarned + xpEarned,
        lastCompletedAt: nowIso,
        history: [record, ...(weekly.history || [])].slice(0, 20),
      };
    }

    // Update overall totals
    current.totalQuestionsCompleted += totalQuestions;
    current.totalXpEarned += xpEarned;

    const allCorrect =
      current.aptitude.correctAnswers +
      current.verbal.correctAnswers +
      current.coding.correctAnswers +
      current.debugging.correctAnswers;
    const allTotal = Math.max(1, current.totalQuestionsCompleted);
    current.overallAccuracy = Math.round((allCorrect / allTotal) * 100);

    // Update streak logic
    if (current.lastActiveDate) {
      const lastDate = new Date(current.lastActiveDate);
      const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
      if (diffHours >= 20 && diffHours <= 48) {
        current.streakDays += 1;
      }
    }
    current.lastActiveDate = nowIso;

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      const key = getActiveUserKey(userId);
      try {
        localStorage.setItem(key, JSON.stringify(current));
        // Dispatch event for UI reactivity across all active components
        window.dispatchEvent(new CustomEvent('cb-practice-progress-updated', { detail: current }));
      } catch (e) {
        console.warn('Failed to save practice progress:', e);
      }
    }

    // Sync XP with gamification service
    try {
      gamificationService.awardXP({
        userId: current.userId,
        amount: xpEarned,
        reason: isWeeklyAssessment
          ? `Completed Weekly Skill Challenge (${score}/${totalQuestions})`
          : `Practiced ${category.toUpperCase()} (${score}/${totalQuestions})`,
        category: 'learning',
      });
    } catch {
      // non-critical
    }

    return record;
  },

  resetProgress(userId?: string): StudentPracticeProgress {
    const def = createDefaultProgress(userId);
    if (typeof window !== 'undefined') {
      const key = getActiveUserKey(userId);
      localStorage.setItem(key, JSON.stringify(def));
      window.dispatchEvent(new CustomEvent('cb-practice-progress-updated', { detail: def }));
    }
    return def;
  },
};
