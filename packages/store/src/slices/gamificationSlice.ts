import { create } from 'zustand';
import { gamificationService, MOCK_GAMIFICATION, MOCK_LEADERBOARD } from '@career-bridge/services';
import { GamificationProfile, LeaderboardEntry } from '@career-bridge/types';

interface GamificationState {
  profile: GamificationProfile | null;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;
}

export const useGamificationStore = create<GamificationState>()((set) => ({
  profile: MOCK_GAMIFICATION,
  leaderboard: MOCK_LEADERBOARD,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const profile = await gamificationService.getProfile('user-001');
      set({ profile, isLoading: false });
    } catch { set({ isLoading: false }); }
  },

  fetchLeaderboard: async () => {
    try {
      const leaderboard = await gamificationService.getLeaderboard();
      set({ leaderboard });
    } catch {}
  },
}));
