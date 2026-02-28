export interface UserLevel {
  level: number;
  name: string;
  xp: number;
  xpToNextLevel: number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  completed: boolean;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  winRate: number;
  totalProfit: number;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string;
  xpBonus: number;
}

export interface Reward {
  id: string;
  type: 'xp' | 'badge' | 'title' | 'avatar';
  name: string;
  description: string;
  icon: string;
  timestamp: string;
}
