import { 
  OnboardingQuestion, 
  OnboardingStage, 
  OnboardingResultPayload, 
  OnboardingProgressState,
  Under18Consent 
} from '@career-bridge/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const onboardingService = {
  /**
   * Retrieves questions for a stage from the backend API
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
    return [];
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
   * Submits answers to the backend API
   */
  async submitOnboarding(
    userEmail: string,
    stage: OnboardingStage,
    answers: Record<string, any>,
    timeTakenSeconds: number,
    under18Consent?: Under18Consent
  ): Promise<OnboardingResultPayload | null> {
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
      // Sync failed
    }

    return null;
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

  clearProgress(userEmail: string, stage: OnboardingStage): void {
    if (typeof window === 'undefined') return;
    const emailKey = userEmail.toLowerCase().trim();
    localStorage.removeItem(`cb_onboarding_${emailKey}_${stage}`);
    localStorage.removeItem(`cb_onboarding_result_${emailKey}`);
    localStorage.removeItem(`cb_onboarding_completed_${emailKey}`);
  },
};
