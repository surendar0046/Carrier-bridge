import { useMentorStore } from '@career-bridge/store';

export const useMentors = () => {
  const store = useMentorStore();
  return {
    mentors: store.mentors,
    isLoading: store.isLoading,
    fetchMentors: store.fetchMentors,
  };
};
