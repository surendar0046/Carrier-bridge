import { create } from 'zustand';
import { mentorService } from '@career-bridge/services';
import { Mentor, MentorSession } from '@career-bridge/types';

interface MentorState {
  mentors: Mentor[];
  sessions: MentorSession[];
  selectedMentor: Mentor | null;
  isLoading: boolean;
  error: string | null;
  fetchMentors: () => Promise<void>;
  fetchMySessions: () => Promise<void>;
  selectMentor: (mentor: Mentor | null) => void;
  bookSession: (payload: { mentorId: string; scheduledAt: string; duration: number; topic: string }) => Promise<boolean>;
}

export const useMentorStore = create<MentorState>()((set) => ({
  mentors: [],
  sessions: [],
  selectedMentor: null,
  isLoading: false,
  error: null,

  fetchMentors: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await mentorService.getMentors();
      set({ mentors: result.items, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchMySessions: async () => {
    set({ isLoading: true });
    try {
      const sessions = await mentorService.getMySessions();
      set({ sessions, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  selectMentor: (mentor) => set({ selectedMentor: mentor }),

  bookSession: async (payload) => {
    try {
      const session = await mentorService.bookSession(payload);
      set((s: any) => ({ sessions: [...s.sessions, session] }));
      return true;
    } catch {
      return false;
    }
  },
}));
