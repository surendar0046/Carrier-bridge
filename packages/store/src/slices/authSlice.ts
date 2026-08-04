import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, mapAuthError } from '@career-bridge/services';

// Track the last UID so we only wipe the user store when the account genuinely changes
let _lastUid: string | null = null;

const clearUserStoreIfUserChanged = (newUid: string | null) => {
  if (typeof window === 'undefined') return;
  if (_lastUid !== null && _lastUid !== newUid) {
    // A different user just logged in — wipe the stale profile
    localStorage.removeItem('career-bridge-user');
  }
  _lastUid = newUid;
};

const clearUserStoreOnLogout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('career-bridge-user');
  }
  _lastUid = null;
};

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
              if (typeof window !== 'undefined') {
                localStorage.setItem('career_bridge_token', token);
              }
              // Only wipe the persisted profile if a different user is logging in
              clearUserStoreIfUserChanged(user.uid);
              set({ token, isAuthenticated: true, isInitialized: true });
            } else {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('career_bridge_token');
              }
              clearUserStoreOnLogout();
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
        clearUserStoreOnLogout();
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
