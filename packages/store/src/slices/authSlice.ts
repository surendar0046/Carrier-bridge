import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, mapAuthError } from '@career-bridge/services';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  initialize: () => () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,  // NEVER persisted — Firebase is the source of truth
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: () => {
        // Timeout fallback: if Firebase doesn't respond in 3s, unblock the UI
        const timeout = setTimeout(() => {
          set((state) => {
            if (!state.isInitialized) {
              return { isInitialized: true, isAuthenticated: false, token: null };
            }
            return state;
          });
        }, 3000);

        let unsubscribe = () => {};
        try {
          unsubscribe = authService.onAuthStateChange(async (user) => {
            clearTimeout(timeout);
            if (user) {
              const token = await user.getIdToken();
              // Sync to localStorage for HTTP Client to pick up
              if (typeof window !== 'undefined') {
                localStorage.setItem('career_bridge_token', token);
              }
              set({ token, isAuthenticated: true, isInitialized: true });
            } else {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('career_bridge_token');
              }
              set({ token: null, isAuthenticated: false, isInitialized: true });
            }
          });
        } catch (err) {
          console.error("Auth initialization failed:", err);
          set({ isInitialized: true, isAuthenticated: false });
        }

        return () => {
          clearTimeout(timeout);
          unsubscribe();
        };
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const tokens = await authService.login({ email, password });
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
          const tokens = await authService.signup({ name, email, password, role });
          set({ token: tokens.accessToken, isAuthenticated: true, isLoading: false, isInitialized: true });
          return true;
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        authService.logout();
        set({ token: null, isAuthenticated: false });
      },

      clearError: () => set({ error: null }),
    }),
    { 
      name: 'career-bridge-auth',
      // Only persist non-sensitive UI state — auth state comes from Firebase on every load
      partialize: () => ({}),
    }
  )
);
