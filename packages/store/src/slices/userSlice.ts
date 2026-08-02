import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '@career-bridge/services';
import { UserProfile } from '@career-bridge/types';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const profile = await userService.getProfile();
          set({ profile, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const profile = await userService.updateProfile(data);
          set({ profile, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },
    }),
    { name: 'career-bridge-user' }
  )
);
