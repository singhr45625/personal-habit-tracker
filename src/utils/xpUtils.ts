import { HabitLogs } from '../types';

export interface LevelInfo {
  level: number;
  title: string;
  badge: string;
  currentLevelXp: number;
  nextLevelXp: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercent: number;
  totalXp: number;
  totalCompletions: number;
}

export const LEVEL_TIERS = [
  { level: 1, title: 'Beginner', badge: '🌱', threshold: 0 },
  { level: 2, title: 'Habit Builder', badge: '🧱', threshold: 100 },
  { level: 3, title: 'Consistent Achiever', badge: '⚡', threshold: 250 },
  { level: 4, title: 'Momentum Master', badge: '🚀', threshold: 450 },
  { level: 5, title: 'Streak Champion', badge: '🔥', threshold: 750 },
  { level: 6, title: 'Iron Discipline', badge: '🛡️', threshold: 1200 },
  { level: 7, title: 'Unstoppable Force', badge: '⭐', threshold: 1800 },
  { level: 8, title: 'Habit Grandmaster', badge: '👑', threshold: 2600 },
  { level: 9, title: 'Zen Legend', badge: '💎', threshold: 3600 },
  { level: 10, title: 'Ascended Titan', badge: '🏆', threshold: 5000 },
];

export function calculateTotalXp(logs: HabitLogs): { totalXp: number; totalCompletions: number } {
  let totalCompletions = 0;

  Object.values(logs).forEach(habitLog => {
    Object.values(habitLog).forEach(completed => {
      if (completed) {
        totalCompletions++;
      }
    });
  });

  // Base 10 XP per completion
  const totalXp = totalCompletions * 10;
  return { totalXp, totalCompletions };
}

export function getLevelInfo(totalXp: number, totalCompletions: number): LevelInfo {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_TIERS[i].threshold) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || {
        level: currentTier.level + 1,
        title: 'Mythic Legend',
        badge: '✨',
        threshold: currentTier.threshold + 2000,
      };
      break;
    }
  }

  const currentLevelThreshold = currentTier.threshold;
  const nextLevelThreshold = nextTier.threshold;
  const xpInCurrentLevel = totalXp - currentLevelThreshold;
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  return {
    level: currentTier.level,
    title: currentTier.title,
    badge: currentTier.badge,
    currentLevelXp: currentLevelThreshold,
    nextLevelXp: nextLevelThreshold,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
    totalXp,
    totalCompletions,
  };
}
