import { 
  OnboardingQuestion, 
  OnboardingStage, 
  OnboardingResultPayload, 
  OnboardingProgressState,
  Under18Consent 
} from '@career-bridge/types';
import { getQuestionsForStage } from '@/data/onboardingQuestions';
import {
  evaluate12thStandard,
  evaluateEarlyCollege,
  evaluateFinalCollege,
} from '@career-bridge/ai';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const onboardingService = {
  /**
   * Retrieves data-driven questions for a stage (with instant offline fallback)
   */
  async getQuestions(stage: OnboardingStage): Promise<OnboardingQuestion[]> {
    try {
      const res = await fetch(`${API_BASE}/onboarding/questions?stage=${stage}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback
    }
    return getQuestionsForStage(stage);
  },

  /**
   * Auto-saves progress to localStorage and syncs with backend
   */
  async saveProgress(
    userEmail: string,
    stage: OnboardingStage,
    currentStep: number,
    answers: Record<string, any>,
    under18Consent?: Under18Consent
  ): Promise<void> {
    const key = `cb_onboarding_${userEmail.toLowerCase().trim()}_${stage}`;
    const progress: OnboardingProgressState = {
      stage,
      currentStep,
      answers,
      under18Consent,
      startedAt: Date.now(),
      lastSavedAt: Date.now(),
      isCompleted: false,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(progress));
      } catch {}
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('career_bridge_token') : null;
      await fetch(`${API_BASE}/onboarding/save-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stage, currentStep, answers, under18Consent }),
      });
    } catch {
      // Non-critical background sync
    }
  },

  /**
   * Loads in-progress saved answers if the student previously exited
   */
  getSavedProgress(userEmail: string, stage: OnboardingStage): OnboardingProgressState | null {
    if (typeof window === 'undefined') return null;
    const key = `cb_onboarding_${userEmail.toLowerCase().trim()}_${stage}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  },

  /**
   * Evaluates questions, generates personalized pathway and roadmap, and logs completion
   */
  async submitOnboarding(
    userEmail: string,
    stage: OnboardingStage,
    answers: Record<string, any>,
    timeTakenSeconds: number,
    under18Consent?: Under18Consent
  ): Promise<OnboardingResultPayload> {
    const emailKey = userEmail.toLowerCase().trim();

    // 1. First run deterministic engine for instant client output
    let localResult: OnboardingResultPayload;
    if (stage === 'school') {
      localResult = evaluate12thStandard(answers, timeTakenSeconds, under18Consent);
    } else if (stage === 'early') {
      localResult = evaluateEarlyCollege(answers, timeTakenSeconds);
    } else {
      localResult = evaluateFinalCollege(answers, timeTakenSeconds);
    }

    // 2. Persist local state for instant offline dashboard readiness
    if (typeof window !== 'undefined') {
      try {
        const resultKey = `cb_onboarding_result_${emailKey}`;
        localStorage.setItem(resultKey, JSON.stringify(localResult));

        // Mark onboarding completed for this user
        localStorage.setItem(`cb_onboarding_completed_${emailKey}`, 'true');
        localStorage.setItem(`cb_onboarding_stage_${emailKey}`, stage);

        // Update active role and recommendation preferences for dashboard & roadmap
        const storageKey = `cb_prefs_${emailKey}`;
        const stored = localStorage.getItem(storageKey);
        const prefs = stored ? JSON.parse(stored) : {};
        prefs.activeRole = localResult.assignedRole;
        prefs.targetDomain = localResult.assignedDomain;
        prefs.onboardingStage = stage;
        prefs.recommendation = {
          role: localResult.assignedRole,
          domain: localResult.assignedDomain,
          confidence: localResult.confidence === 'High' ? 95 : 85,
          reasoning: localResult.reasons.join('. '),
          strengths: localResult.primarySuggestion.insight?.keySkills || ['Problem Solving', 'Engineering Fundamentals'],
          workPath: localResult.workPath,
          placementPlan: localResult.placementPlan,
        };
        localStorage.setItem(storageKey, JSON.stringify(prefs));

        // Keep global fallback aligned
        localStorage.setItem('cb_recommendation', JSON.stringify(prefs.recommendation));

        // Real-time broadcast
        window.dispatchEvent(new CustomEvent('cb-active-role-changed', { detail: localResult.assignedRole }));
        window.dispatchEvent(new CustomEvent('cb-onboarding-completed', { detail: localResult }));
      } catch {}
    }

    // 3. Sync to API backend if available
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('career_bridge_token') : null;
      const res = await fetch(`${API_BASE}/onboarding/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ stage, answers, timeTakenSeconds, under18Consent }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch {
      // Offline fallback: local engine output was already created
    }

    return localResult;
  },

  /**
   * Resets onboarding on backend API
   */
  async resetOnboarding(userId: string): Promise<void> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('career_bridge_token') : null;
      await fetch(`${API_BASE}/onboarding/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId }),
      });
    } catch {}
  },

  /**
   * Resets local onboarding answers for testing/re-assessment
   */
  clearProgress(userEmail: string, stage: OnboardingStage): void {
    if (typeof window === 'undefined') return;
    const emailKey = userEmail.toLowerCase().trim();
    localStorage.removeItem(`cb_onboarding_${emailKey}_${stage}`);
    localStorage.removeItem(`cb_onboarding_result_${emailKey}`);
    localStorage.removeItem(`cb_onboarding_completed_${emailKey}`);
  },
};
