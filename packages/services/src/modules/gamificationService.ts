import { httpClient } from '../client/httpClient';
import { GamificationProfile, LeaderboardEntry, XPEvent } from '@career-bridge/types';
import { ApiResponse } from '@career-bridge/types';
import { env } from '@career-bridge/config';

export const MOCK_GAMIFICATION: GamificationProfile = {
  userId: 'user-001',
  xp: 3450,
  level: 8,
  nextLevelXp: 4000,
  streak: 7,
  lastActive: new Date().toISOString(),
  rank: 142,
  badges: [
    { id: 'badge-001', name: 'First Application', description: 'Applied to your first job', icon: '🚀', category: 'jobs', rarity: 'common', xpReward: 100, earnedAt: '2026-02-01T00:00:00Z' },
    { id: 'badge-002', name: 'Fast Learner', description: 'Completed a course in under 7 days', icon: '⚡', category: 'learning', rarity: 'rare', xpReward: 250, earnedAt: '2026-02-20T00:00:00Z' },
    { id: 'badge-003', name: 'Profile Star', description: 'Completed 100% of profile', icon: '⭐', category: 'profile', rarity: 'common', xpReward: 150, earnedAt: '2026-01-15T00:00:00Z' },
    { id: 'badge-004', name: 'Streak Master', description: '7-day activity streak', icon: '🔥', category: 'engagement', rarity: 'epic', xpReward: 500, earnedAt: '2026-04-28T00:00:00Z' },
  ],
  achievements: [
    { id: 'ach-001', title: 'Job Hunter', description: 'Apply to 10 jobs', progress: 6, target: 10, xpReward: 300, category: 'jobs' },
    { id: 'ach-002', title: 'Skill Collector', description: 'Add 10 skills to profile', progress: 5, target: 10, xpReward: 200, category: 'profile' },
    { id: 'ach-003', title: 'Course Completionist', description: 'Complete 5 courses', progress: 2, target: 5, xpReward: 500, category: 'learning' },
  ],
};

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'u1', name: 'Sneha Reddy', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=f97316&color=fff', xp: 8900, level: 18, badges: 14, location: 'Bangalore' },
  { rank: 2, userId: 'u2', name: 'Vikram Singh', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=8b5cf6&color=fff', xp: 7600, level: 16, badges: 11, location: 'Delhi' },
  { rank: 3, userId: 'u3', name: 'Meera Iyer', avatar: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=22c55e&color=fff', xp: 6800, level: 14, badges: 9, location: 'Chennai' },
  { rank: 4, userId: 'u4', name: 'Aryan Gupta', avatar: 'https://ui-avatars.com/api/?name=Aryan+Gupta&background=3b82f6&color=fff', xp: 5400, level: 12, badges: 8, location: 'Pune' },
  { rank: 5, userId: 'u5', name: 'Kavya Nair', avatar: 'https://ui-avatars.com/api/?name=Kavya+Nair&background=ec4899&color=fff', xp: 4700, level: 10, badges: 7, location: 'Hyderabad' },
  { rank: 142, userId: 'user-001', name: 'Rahul Kumar', avatar: 'https://ui-avatars.com/api/?name=Rahul+Kumar&background=3b82f6&color=fff', xp: 3450, level: 8, badges: 4, location: 'Bangalore' },
];

const USE_MOCK = env.useMock;

export const gamificationService = {
  async getProfile(userId: string): Promise<GamificationProfile> {
    if (USE_MOCK) return MOCK_GAMIFICATION;
    const res = await httpClient.get<ApiResponse<GamificationProfile>>(`/gamification/${userId}`);
    return res.data.data;
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    if (USE_MOCK) return MOCK_LEADERBOARD;
    const res = await httpClient.get<ApiResponse<LeaderboardEntry[]>>('/gamification/leaderboard');
    return res.data.data;
  },

  async awardXP(event: Omit<XPEvent, 'id' | 'createdAt'>): Promise<XPEvent> {
    if (USE_MOCK) return { ...event, id: `xp-${Date.now()}`, createdAt: new Date().toISOString() };
    const res = await httpClient.post<ApiResponse<XPEvent>>('/gamification/xp', event);
    return res.data.data;
  },
};
