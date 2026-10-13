import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, mapAuthError } from '@career-bridge/services';
import { UserRole } from '@career-bridge/types';
import { useUserStore } from './userSlice';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: () => {
        // Fast optimistic hydration on client mount (runs after initial SSR hydration pass)
        if (typeof window !== 'undefined') {
          try {
            const token = localStorage.getItem('career_bridge_token');
            const userStr = localStorage.getItem('career-bridge-user');
            if (token) {
              set({ token, isAuthenticated: true, isInitialized: true });
            } else if (userStr) {
              const parsed = JSON.parse(userStr);
              if (parsed?.state?.profile?.id && parsed.state.profile.id !== 'usr-surendar') {
                set({ token: 'cached-session', isAuthenticated: true, isInitialized: true });
              }
            }
          } catch {
            // ignore
          }
        }

        // Quick fallback: if Firebase doesn't respond in 600ms, unblock the UI
        const timeout = setTimeout(() => {
          set((state) => {
            if (!state.isInitialized) {
              return { isInitialized: true, isAuthenticated: state.isAuthenticated, token: state.token };
            }
            return state;
          });
        }, 600);

        let unsubscribe = () => {};
        try {
          unsubscribe = authService.onAuthStateChange(async (user) => {
            clearTimeout(timeout);
            if (user) {
              const token = await user.getIdToken();
              if (typeof window !== 'undefined') {
                localStorage.setItem('career_bridge_token', token);
              }
              // If the in-memory or persisted profile belongs to someone else or is dummy, wipe it
              const currentProfile = useUserStore.getState().profile;
              if (
                currentProfile &&
                (currentProfile.id === 'usr-surendar' ||
                  currentProfile.id !== user.uid ||
                  (user.email && currentProfile.email.toLowerCase() !== user.email.toLowerCase()))
              ) {
                useUserStore.getState().clearProfile();
              }
              // Fetch the active user's profile
              useUserStore.getState().fetchProfile().catch(() => {});
              set({ token, isAuthenticated: true, isInitialized: true, isLoading: false });
            } else {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('career_bridge_token');
                localStorage.removeItem('career-bridge-auth');
              }
              useUserStore.getState().clearProfile();
              set({ token: null, isAuthenticated: false, isInitialized: true, isLoading: false });
            }
          });
        } catch (err) {
          console.error("Auth initialization failed:", err);
          set({ isInitialized: true, isAuthenticated: false, isLoading: false });
        }

        return () => {
          clearTimeout(timeout);
          unsubscribe();
        };
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          useUserStore.getState().clearProfile();
          const tokens = await authService.login({ email, password });
          if (typeof window !== 'undefined' && tokens.accessToken) {
            localStorage.setItem('career_bridge_token', tokens.accessToken);
          }
          await useUserStore.getState().fetchProfile().catch(() => {});
          set({ token: tokens.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true });
          return true;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      signup: async (name, email, password, role) => {
        set({ isLoading: true, error: null });
        try {
          useUserStore.getState().clearProfile();
          const tokens = await authService.signup({ name, email, password, role });
          if (typeof window !== 'undefined' && tokens.accessToken) {
            localStorage.setItem('career_bridge_token', tokens.accessToken);
          }
          // Seed the newly registered profile immediately to eliminate redundant round-trip delay
          const userRole = role === 'professional' ? UserRole.PROFESSIONAL : UserRole.STUDENT;
          useUserStore.setState({
            profile: {
              id: tokens.uid || 'usr-new',
              name,
              email,
              role: userRole,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
              skills: [],
              xp: 0,
              level: 1,
              education: [],
              experience: [],
              certifications: [],
              languages: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            isLoading: false,
            error: null,
          });
          set({ token: tokens.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true });
          return true;
        } catch (err: any) {
          // If already registered with the same credentials (e.g. from an in-flight attempt), seamlessly login
          const errMsg = String(err.message || '').toLowerCase();
          if (errMsg.includes('already registered') || errMsg.includes('already in use') || errMsg.includes('already-in-use')) {
            try {
              const loginTokens = await authService.login({ email, password });
              if (typeof window !== 'undefined' && loginTokens.accessToken) {
                localStorage.setItem('career_bridge_token', loginTokens.accessToken);
              }
              await useUserStore.getState().fetchProfile().catch(() => {});
              set({ token: loginTokens.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true });
              return true;
            } catch {
              // Passwords differ or other login error
            }
          }
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        authService.logout();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('career_bridge_token');
          localStorage.removeItem('career-bridge-auth');
        }
        useUserStore.getState().clearProfile();
        set({ token: null, isAuthenticated: false, isInitialized: true });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
          return { success: true };
        } catch (err: any) {
          const message = err.message || 'Failed to send reset email';
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    { 
      name: 'career-bridge-auth',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
