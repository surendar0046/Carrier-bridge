import { httpClient } from '../client/httpClient';
import { Job, JobFilter, JobApplication, JobType, ApplicationStatus } from '@career-bridge/types';
import { ApiResponse, PaginatedResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

// ─── Mock Data ───────────────────────────────────────────────────────────────
export const MOCK_JOBS: Job[] = [
  {
    id: 'job-001',
    title: 'Frontend Developer',
    company: 'TechNova Solutions',
    companyLogo: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%233b82f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="30">TN</text></svg>')}`,
    location: 'Bangalore, Karnataka',
    type: JobType.FULL_TIME,
    salary: { min: 80000, max: 120000, currency: 'INR', period: 'monthly' },
    description: 'Build scalable web applications using React and Next.js for our growing SaaS platform.',
    requirements: ['3+ years React', 'TypeScript', 'REST APIs', 'Git'],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    benefits: ['Health Insurance', 'Remote Work', 'Learning Budget', 'Stock Options'],
    postedAt: '2026-04-25T10:00:00Z',
    deadline: '2026-05-25T23:59:59Z',
    applicants: 142,
    matchScore: 92,
    isRemote: true,
    isFeatured: true,
  },
  {
    id: 'job-002',
    title: 'Full Stack Engineer',
    company: 'InnovateTech',
    companyLogo: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%238b5cf6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="30">IT</text></svg>')}`,
    location: 'Chennai, Tamil Nadu',
    type: JobType.FULL_TIME,
    salary: { min: 100000, max: 160000, currency: 'INR', period: 'monthly' },
    description: 'Join our engineering team to build high-performance fintech solutions.',
    requirements: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript'],
    benefits: ['Health Insurance', 'Flexible Hours', 'Annual Bonus'],
    postedAt: '2026-04-24T08:00:00Z',
    deadline: '2026-05-20T23:59:59Z',
    applicants: 98,
    matchScore: 85,
    isRemote: false,
    isFeatured: false,
  },
  {
    id: 'job-003',
    title: 'Data Science Intern',
    company: 'Analytics Corp',
    companyLogo: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23f97316"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="30">AC</text></svg>')}`,
    location: 'Hyderabad, Telangana',
    type: JobType.INTERNSHIP,
    salary: { min: 25000, max: 40000, currency: 'INR', period: 'monthly' },
    description: 'Work on real ML pipelines, data analysis and AI model training.',
    requirements: ['Python', 'Machine Learning basics', 'SQL', 'Statistics'],
    skills: ['Python', 'scikit-learn', 'pandas', 'SQL', 'Jupyter'],
    benefits: ['Mentorship', 'Certificate', 'Pre-placement offer'],
    postedAt: '2026-04-26T12:00:00Z',
    applicants: 312,
    matchScore: 78,
    isRemote: true,
    isFeatured: true,
  },
  {
    id: 'job-004',
    title: 'DevOps Engineer',
    company: 'CloudSystems Ltd',
    companyLogo: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%2322c55e"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="30">CS</text></svg>')}`,
    location: 'Mumbai, Maharashtra',
    type: JobType.FULL_TIME,
    salary: { min: 110000, max: 180000, currency: 'INR', period: 'monthly' },
    description: 'Manage CI/CD pipelines, Kubernetes clusters, and cloud infrastructure.',
    requirements: ['Kubernetes', 'Terraform', 'AWS/GCP', 'CI/CD', 'Linux'],
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'Jenkins', 'Linux'],
    benefits: ['Remote Work', 'Stock Options', 'Health Cover', 'Gym Allowance'],
    postedAt: '2026-04-23T09:00:00Z',
    applicants: 67,
    matchScore: 71,
    isRemote: true,
    isFeatured: false,
  },
  {
    id: 'job-005',
    title: 'UI/UX Designer',
    company: 'DesignFirst Studio',
    companyLogo: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100%" height="100%" fill="%23ec4899"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-family="Arial" font-size="30">DF</text></svg>')}`,
    location: 'Pune, Maharashtra',
    type: JobType.FULL_TIME,
    salary: { min: 70000, max: 110000, currency: 'INR', period: 'monthly' },
    description: 'Lead design for consumer mobile apps with a focus on accessibility and delight.',
    requirements: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Design Systems'],
    benefits: ['Creative Culture', 'Equipment Budget', 'Flexible Hours'],
    postedAt: '2026-04-22T11:00:00Z',
    applicants: 189,
    matchScore: 65,
    isRemote: false,
    isFeatured: false,
  },
];

// ─── Service ─────────────────────────────────────────────────────────────────
const USE_MOCK = env.useMock;

export const jobService = {
  async getJobs(filters: JobFilter = {}): Promise<PaginatedResponse<Job>> {
    try {
      if (USE_MOCK) throw new Error('Mock mode enabled');
      const res = await httpClient.get<ApiResponse<PaginatedResponse<Job>>>('/jobs', { params: filters });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
      throw new Error('API returned unsuccessful response');
    } catch (err) {
      console.warn('Job Service: Falling back to mock data', err);
      let jobs = [...MOCK_JOBS];
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        jobs = jobs.filter(
          (j) => j.title.toLowerCase().includes(kw) || j.company.toLowerCase().includes(kw)
        );
      }
      if (filters.isRemote !== undefined) jobs = jobs.filter((j) => j.isRemote === filters.isRemote);
      if (filters.type && filters.type.length > 0) {
        jobs = jobs.filter((j) => (filters.type as any)!.includes(j.type));
      }
      return { items: jobs, meta: { page: 1, limit: 10, total: jobs.length, totalPages: 1 } };
    }
  },

  async getJobById(id: string): Promise<Job | null> {
    if (USE_MOCK) return MOCK_JOBS.find((j) => j.id === id) || null;
    const res = await httpClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return res.data.data;
  },

  async applyToJob(payload: { jobId: string; coverLetter?: string; resumeId: string }): Promise<JobApplication> {
    if (USE_MOCK) {
      return {
        id: `app-${Date.now()}`,
        jobId: payload.jobId,
        userId: 'user-001',
        status: ApplicationStatus.PENDING,
        coverLetter: payload.coverLetter,
        resumeUrl: '/mock/resume.pdf',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const res = await httpClient.post<ApiResponse<JobApplication>>('/jobs/apply', payload);
    return res.data.data;
  },

  async getMyApplications(): Promise<JobApplication[]> {
    if (USE_MOCK) return [];
    const res = await httpClient.get<ApiResponse<JobApplication[]>>('/jobs/my-applications');
    return res.data.data;
  },

  async getFeaturedJobs(): Promise<Job[]> {
    if (USE_MOCK) return MOCK_JOBS.filter((j) => j.isFeatured);
    const res = await httpClient.get<ApiResponse<Job[]>>('/jobs/featured');
    return res.data.data;
  },
};
