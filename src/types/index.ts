export type HabitCategory = 
  | 'Health'
  | 'Fitness'
  | 'Study'
  | 'Coding'
  | 'Mindfulness'
  | 'Productivity'
  | 'Personal'
  | string;

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  targetDays: number; // e.g. 20, 25, 30
  color?: string; // hex or tailwind token
  createdAt: string; // ISO date
  order: number;
}

export type HabitLogs = Record<string, Record<string, boolean>>; // habitId -> { 'YYYY-MM-DD': boolean }

export interface UserSettings {
  subtitle: string;
  darkMode: boolean;
  soundEnabled: boolean;
  compactGrid: boolean;
  filterCategory: string; // 'All' or specific category
  hintsEnabled: boolean; // Interactive contextual hints & onboarding guide
}

export interface DayStats {
  dateStr: string;
  dayNumber: number;
  weekdayShort: string;
  weekdayFull: string;
  isToday: boolean;
  isPast: boolean;
  isWeekend: boolean;
  completedCount: number;
  totalHabits: number;
  completionRate: number; // 0 to 100
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  bestStreak: number;
  monthCompletedCount: number;
  monthTarget: number;
  monthProgressPercent: number;
  totalAllTimeCompleted: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  xpReward: number;
}

export interface BackupData {
  version: string;
  exportedAt: string;
  habits: Habit[];
  logs: HabitLogs;
  settings: Partial<UserSettings>;
}

export interface HintContent {
  id: string;
  elementKey: string;
  title: string;
  icon: string;
  whatItDoes: string;
  howItCalculates: string;
  proTip: string;
}
