export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  earnedAt?: string;
}

export type BadgeCategory = 'jobs' | 'learning' | 'mentoring' | 'profile' | 'engagement' | 'achievement';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xpReward: number;
  completedAt?: string;
  category: BadgeCategory;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: number;
  location?: string;
}

export interface GamificationProfile {
  userId: string;
  xp: number;
  level: number;
  nextLevelXp: number;
  badges: Badge[];
  achievements: Achievement[];
  streak: number;
  lastActive: string;
  rank?: number;
}

export interface XPEvent {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  category: BadgeCategory;
  createdAt: string;
}
