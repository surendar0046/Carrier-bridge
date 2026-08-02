import { useCoursesStore } from '@career-bridge/store';

export const useRoadmap = () => {
  const store = useCoursesStore();
  return {
    activeRoadmap: store.activeRoadmap,
    fetchSkillRoadmap: store.fetchSkillRoadmap,
  };
};
