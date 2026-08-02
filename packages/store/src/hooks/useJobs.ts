import { useJobsStore } from '../slices/jobsSlice';

export const useJobs = () => {
  const store = useJobsStore();
  return {
    ...store,
  };
};
