import { useJobsStore } from '@career-bridge/store';

export const useJobs = () => {
  const store = useJobsStore();
  return {
    jobs: store.jobs,
    featuredJobs: store.featuredJobs,
    isLoading: store.isLoading,
    fetchJobs: store.fetchJobs,
    fetchFeaturedJobs: store.fetchFeaturedJobs,
  };
};
