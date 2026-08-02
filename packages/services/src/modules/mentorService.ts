import { httpClient } from '../client/httpClient';
import { Mentor, MentorSession, SessionStatus } from '@career-bridge/types';
import { ApiResponse, PaginatedResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mentor-001',
    userId: 'user-m01',
    name: 'Priya Sharma',
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=3b82f6&color=fff',
    title: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['React', 'System Design', 'Career Growth', 'DSA'],
    bio: '8+ years at Google working on large-scale frontend systems. Passionate about mentoring early-career engineers.',
    rating: 4.9,
    reviewCount: 134,
    totalSessions: 280,
    hourlyRate: 2000,
    currency: 'INR',
    availability: [
      { dayOfWeek: 1, startTime: '18:00', endTime: '21:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '14:00' },
    ],
    languages: ['English', 'Hindi'],
    linkedinUrl: 'https://linkedin.com/in/priyasharma',
    isVerified: true,
    responseTime: '< 2 hours',
  },
  {
    id: 'mentor-002',
    userId: 'user-m02',
    name: 'Arjun Mehta',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=8b5cf6&color=fff',
    title: 'Staff Engineer',
    company: 'Microsoft',
    expertise: ['Cloud Architecture', 'Azure', 'DevOps', 'Leadership'],
    bio: 'Staff Engineer at Microsoft Azure with 10+ years building distributed systems. Love helping engineers level up.',
    rating: 4.8,
    reviewCount: 98,
    totalSessions: 190,
    hourlyRate: 2500,
    currency: 'INR',
    availability: [
      { dayOfWeek: 2, startTime: '19:00', endTime: '22:00' },
      { dayOfWeek: 5, startTime: '17:00', endTime: '20:00' },
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    isVerified: true,
    responseTime: '< 4 hours',
  },
  {
    id: 'mentor-003',
    userId: 'user-m03',
    name: 'Divya Nair',
    avatar: 'https://ui-avatars.com/api/?name=Divya+Nair&background=f97316&color=fff',
    title: 'Data Science Lead',
    company: 'Flipkart',
    expertise: ['Machine Learning', 'Python', 'Data Engineering', 'AI'],
    bio: 'Leading data science at Flipkart. Trained 50+ engineers in ML and data analysis over 3 years.',
    rating: 4.7,
    reviewCount: 76,
    totalSessions: 145,
    hourlyRate: 1800,
    currency: 'INR',
    availability: [
      { dayOfWeek: 3, startTime: '20:00', endTime: '22:00' },
      { dayOfWeek: 0, startTime: '11:00', endTime: '15:00' },
    ],
    languages: ['English', 'Malayalam', 'Tamil'],
    isVerified: true,
    responseTime: '< 6 hours',
  },
];

const USE_MOCK = env.useMock;

export const mentorService = {
  async getMentors(topic?: string): Promise<PaginatedResponse<Mentor>> {
    if (USE_MOCK) {
      const items = topic ? MOCK_MENTORS.filter(m => m.expertise.some(e => e.toLowerCase().includes(topic.toLowerCase()))) : MOCK_MENTORS;
      return { items, meta: { page: 1, limit: 10, total: items.length, totalPages: 1 } };
    }
    const res = await httpClient.get<ApiResponse<PaginatedResponse<Mentor>>>('/mentors', { params: { topic } });
    return res.data.data;
  },

  async getMentorById(id: string): Promise<Mentor | null> {
    if (USE_MOCK) return MOCK_MENTORS.find((m) => m.id === id) || null;
    const res = await httpClient.get<ApiResponse<Mentor>>(`/mentors/${id}`);
    return res.data.data;
  },

  async bookSession(payload: { mentorId: string; scheduledAt: string; duration: number; topic: string }): Promise<MentorSession> {
    if (USE_MOCK) {
      return {
        id: `session-${Date.now()}`,
        mentorId: payload.mentorId,
        userId: 'user-001',
        status: SessionStatus.SCHEDULED,
        scheduledAt: payload.scheduledAt,
        duration: payload.duration,
        topic: payload.topic,
        meetingUrl: 'https://meet.google.com/mock-session',
      };
    }
    const res = await httpClient.post<ApiResponse<MentorSession>>('/mentors/sessions', payload);
    return res.data.data;
  },

  async getMySessions(): Promise<MentorSession[]> {
    if (USE_MOCK) return [];
    const res = await httpClient.get<ApiResponse<MentorSession[]>>('/mentors/my-sessions');
    return res.data.data;
  },
};
