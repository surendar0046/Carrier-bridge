import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineAction {
  id: string;
  type: string;
  payload: unknown;
  queuedAt: string;
  retries: number;
}

interface OfflineQueueState {
  queue: OfflineAction[];
  isOnline: boolean;
  addToQueue: (type: string, payload: unknown) => void;
  removeFromQueue: (id: string) => void;
  setOnline: (online: boolean) => void;
}

export const useOfflineQueueStore = create<OfflineQueueState>()(
  persist(
    (set) => ({
      queue: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,

      addToQueue: (type, payload) =>
        set((s) => ({
          queue: [
            ...s.queue,
            { id: `action-${Date.now()}`, type, payload, queuedAt: new Date().toISOString(), retries: 0 },
          ],
        })),

      removeFromQueue: (id) => set((s) => ({ queue: s.queue.filter((a) => a.id !== id) })),

      setOnline: (isOnline) => set({ isOnline }),
    }),
    { name: 'career-bridge-offline-queue' }
  )
);
