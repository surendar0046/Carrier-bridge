import { useJobsStore } from '../slices/jobsSlice';

export const selectAllJobs = (state: ReturnType<typeof useJobsStore.getState>) => state.jobs;
export const selectFeaturedJobs = (state: ReturnType<typeof useJobsStore.getState>) => state.featuredJobs;
export const selectSelectedJob = (state: ReturnType<typeof useJobsStore.getState>) => state.selectedJob;
export const selectApplications = (state: ReturnType<typeof useJobsStore.getState>) => state.applications;
export const selectJobFilters = (state: ReturnType<typeof useJobsStore.getState>) => state.filters;
export const selectJobsLoading = (state: ReturnType<typeof useJobsStore.getState>) => state.isLoading;
