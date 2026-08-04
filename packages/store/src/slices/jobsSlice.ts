import { create } from 'zustand';
import { jobService, realTimeJobService } from '@career-bridge/services';
import { Job, JobFilter, JobApplication } from '@career-bridge/types';

interface JobsState {
  jobs: Job[];
  featuredJobs: Job[];
  selectedJob: Job | null;
  applications: JobApplication[];
  filters: JobFilter;
  isLoading: boolean;
  error: string | null;
  total: number;
  realTimeJobs: Job[];
  fetchJobs: (filters?: JobFilter) => Promise<void>;
  searchRealTimeJobs: (query: string, page?: number, limit?: number, titleFilter?: string) => Promise<void>;
  fetchFeaturedJobs: () => Promise<void>;
  fetchApplications: () => Promise<void>;
  selectJob: (job: Job | null) => void;
  applyToJob: (jobId: string, resumeId: string, coverLetter?: string) => Promise<boolean>;
  setFilters: (filters: Partial<JobFilter>) => void;
}

export const useJobsStore = create<JobsState>()((set, get) => ({
  jobs: [],
  featuredJobs: [],
  selectedJob: null,
  applications: [],
  filters: {},
  isLoading: false,
  error: null,
  total: 0,
  realTimeJobs: [],

  fetchJobs: async (filters) => {
    const mergedFilters = { ...get().filters, ...filters };
    set({ isLoading: true, error: null, filters: mergedFilters });
    try {
      const result = await jobService.getJobs(mergedFilters);
      set({ jobs: result.items, total: result.meta.total, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  searchRealTimeJobs: async (query, page = 1, limit = 20, titleFilter = '') => {
    set({ isLoading: true, error: null });
    try {
      const jobs = await realTimeJobService.searchJobs(query, page, limit, titleFilter);
      set({ realTimeJobs: jobs, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchFeaturedJobs: async () => {
    try {
      const jobs = await jobService.getFeaturedJobs();
      set({ featuredJobs: jobs });
    } catch {}
  },

  fetchApplications: async () => {
    try {
      const applications = await jobService.getMyApplications();
      set({ applications });
    } catch {}
  },

  selectJob: (job) => set({ selectedJob: job }),

  applyToJob: async (jobId, resumeId, coverLetter) => {
    try {
      const app = await jobService.applyToJob({ jobId, resumeId, coverLetter });
      set((s: any) => ({ applications: [...s.applications, app] }));
      return true;
    } catch {
      return false;
    }
  },

  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
}));
