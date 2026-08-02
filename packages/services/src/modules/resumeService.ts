import { httpClient } from '../client/httpClient';
import { Resume, ATSScore } from '@career-bridge/types';
import { ApiResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

const MOCK_RESUME: Resume = {
  id: 'resume-001',
  userId: 'user-001',
  title: 'Rahul Kumar - Software Developer',
  template: 'modern',
  personalInfo: {
    fullName: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka',
    linkedinUrl: 'https://linkedin.com/in/rahulkumar',
    githubUrl: 'https://github.com/rahulkumar',
  },
  summary: 'Results-driven Frontend Developer with 2+ years building scalable React applications. Passionate about clean code, performance optimization, and great UX.',
  experience: [
    {
      id: 'exp-001',
      company: 'StartupXYZ',
      role: 'Frontend Developer Intern',
      startDate: '2024-06-01',
      endDate: '2024-11-30',
      current: false,
      description: 'Built and maintained React components for the main SaaS dashboard.',
      achievements: ['Reduced bundle size by 35%', 'Shipped 12 new features', 'Improved accessibility score from 68 to 94'],
    },
  ],
  education: [
    {
      id: 'edu-001',
      institution: 'National Institute of Technology',
      degree: 'B.Tech',
      field: 'Computer Science',
      startYear: 2021,
      endYear: 2025,
      grade: '8.6 CGPA',
    },
  ],
  skills: [
    { name: 'React', level: 'advanced', category: 'Frontend' },
    { name: 'TypeScript', level: 'intermediate', category: 'Language' },
    { name: 'Node.js', level: 'intermediate', category: 'Backend' },
    { name: 'Python', level: 'beginner', category: 'Language' },
  ],
  certifications: [
    { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2025-03-15', url: 'https://aws.amazon.com' },
  ],
  projects: [
    {
      id: 'proj-001',
      name: 'CareerBridge Platform',
      description: 'Full-stack career management platform with AI features.',
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      githubUrl: 'https://github.com/rahulkumar/career-bridge',
    },
  ],
  atsScore: {
    overall: 78,
    keyword: 72,
    formatting: 88,
    readability: 81,
    suggestions: ['Add more quantified results', 'Include REST API keywords', 'Add a projects section'],
    missingKeywords: ['REST API', 'GraphQL', 'CI/CD', 'Docker'],
    lastScored: new Date().toISOString(),
  },
  createdAt: '2026-01-10T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

const USE_MOCK = env.useMock;

export const resumeService = {
  async getResumes(userId: string): Promise<Resume[]> {
    if (USE_MOCK) return [MOCK_RESUME];
    const res = await httpClient.get<ApiResponse<Resume[]>>('/resumes');
    return res.data.data;
  },

  async getResumeById(id: string): Promise<Resume | null> {
    if (USE_MOCK) return MOCK_RESUME;
    const res = await httpClient.get<ApiResponse<Resume>>(`/resumes/${id}`);
    return res.data.data;
  },

  async saveResume(data: Partial<Resume>): Promise<Resume> {
    if (USE_MOCK) return { ...MOCK_RESUME, ...data, updatedAt: new Date().toISOString() };
    const res = data.id
      ? await httpClient.put<ApiResponse<Resume>>(`/resumes/${data.id}`, data)
      : await httpClient.post<ApiResponse<Resume>>('/resumes', data);
    return res.data.data;
  },

  async scoreATS(resumeId: string, jobId?: string): Promise<ATSScore> {
    if (USE_MOCK) return MOCK_RESUME.atsScore!;
    const res = await httpClient.post<ApiResponse<ATSScore>>('/resumes/ats-score', { resumeId, jobId });
    return res.data.data;
  },
};
