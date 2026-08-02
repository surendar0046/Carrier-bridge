export const useJobUpdatesRealtime = () => {
  const latestJobUpdate = {
    jobId: 'job-101',
    status: 'NEW_MATCH',
    title: 'Lead Full Stack Architect',
    timestamp: new Date().toISOString(),
  };

  return { latestJobUpdate };
};
