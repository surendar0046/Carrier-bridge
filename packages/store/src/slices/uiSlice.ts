import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, Language } from '@career-bridge/types';

interface UIState {
  theme: Theme;
  language: Language;
  lowDataMode: boolean;
  sidebarOpen: boolean;
  setTheme: (t: Theme) => void;
  setLanguage: (l: Language) => void;
  toggleLowDataMode: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: Theme.SYSTEM,
      language: Language.EN,
      lowDataMode: false,
      sidebarOpen: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleLowDataMode: () => set((s) => ({ lowDataMode: !s.lowDataMode })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    { name: 'career-bridge-ui' }
  )
);
