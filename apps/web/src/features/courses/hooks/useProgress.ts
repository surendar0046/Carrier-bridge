import { useCoursesStore } from '@career-bridge/store';

export const useProgress = () => {
  const store = useCoursesStore();
  return {
    updateProgress: store.updateProgress,
  };
};
