export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export const WS_URL       = process.env.NEXT_PUBLIC_WS_URL  || 'ws://localhost:4000';
export const USE_MOCK     = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true;

export const ENDPOINTS = {
  // Auth
  LOGIN:   '/auth/login',
  SIGNUP:  '/auth/signup',
  LOGOUT:  '/auth/logout',
  REFRESH: '/auth/refresh',
  // Users
  ME:     '/users/me',
  // Jobs
  JOBS:         '/jobs',
  JOBS_FEATURED:'/jobs/featured',
  JOBS_APPLY:   '/jobs/apply',
  MY_APPLICATIONS: '/jobs/my-applications',
  // Mentors
  MENTORS:  '/mentors',
  SESSIONS: '/mentors/sessions',
  // Courses
  COURSES:  '/courses',
  ROADMAP:  '/courses/roadmap',
  // AI
  AI_CHAT:      '/ai/chat',
  AI_SKILL_GAP: '/ai/skill-gap',
  AI_CAREER:    '/ai/career-path',
  // Resume
  RESUMES:   '/resumes',
  ATS_SCORE: '/resumes/ats-score',
  // Gamification
  GAMIFICATION: '/gamification',
  LEADERBOARD:  '/gamification/leaderboard',
} as const;
