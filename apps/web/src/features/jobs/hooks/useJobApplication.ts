import { useJobsStore } from '@career-bridge/store';

export const useJobApplication = () => {
  const store = useJobsStore();
  return {
    applications: store.applications,
    applyToJob: store.applyToJob,
    fetchApplications: store.fetchApplications,
  };
};
