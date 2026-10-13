import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '@career-bridge/services';
import { UserProfile } from '@career-bridge/types';

interface UserState {
  profile: UserProfile | null;
  activeRole: string | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateActiveRole: (role: string) => void;
  clearProfile: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      activeRole: null,
      isLoading: false,
      error: null,

      clearProfile: () => {
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('career-bridge-user');
          } catch {}
        }
        set({ profile: null, activeRole: null, error: null, isLoading: false });
      },

      fetchProfile: async () => {
        // If current profile is dummy profile, clear it
        const currentProfile = get().profile;
        if (currentProfile?.id === 'usr-surendar' || currentProfile?.email === 'surendarg0046@gmail.com') {
          get().clearProfile();
        }

        // Stale-while-revalidate: only show loading if we don't already have a profile in state
        const validProfile = get().profile;
        if (!validProfile) {
          set({ isLoading: true, error: null });
        }
        try {
          const profile = await userService.getProfile();
          let activeRole = null;
          if (profile?.email && typeof window !== 'undefined') {
            const prefsStr = localStorage.getItem(`cb_prefs_${profile.email}`);
            if (prefsStr) {
              try {
                const prefs = JSON.parse(prefsStr);
                activeRole = prefs.activeRole || null;
              } catch (e) {
                console.error("Failed to parse prefs", e);
              }
            }
          }
          set({ profile, activeRole, isLoading: false, error: null });
        } catch (err: any) {
          console.error('fetchProfile error:', err.message);
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

      updateActiveRole: (role: string) => {
        set((state) => {
          if (state.profile?.email && typeof window !== 'undefined') {
            const prefsStr = localStorage.getItem(`cb_prefs_${state.profile.email}`);
            const prefs = prefsStr ? JSON.parse(prefsStr) : {};
            prefs.activeRole = role;
            localStorage.setItem(`cb_prefs_${state.profile.email}`, JSON.stringify(prefs));
          }
          return { activeRole: role };
        });
      },
    }),
    { 
      name: 'career-bridge-user',
      // We exclude activeRole from standard persist because we want it tied to email via fetchProfile
      partialize: (state) => ({ profile: state.profile })
    }
  )
);
