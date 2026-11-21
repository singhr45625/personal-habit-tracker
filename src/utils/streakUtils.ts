import { formatDateKey, parseDateKey, getPreviousDayKey } from './dateUtils';

/**
 * Calculates current streak for a habit.
 * Streak rules:
 * - If today is completed, count backwards consecutive days starting today.
 * - If today is NOT completed, but yesterday WAS completed, count backwards consecutive days starting yesterday.
 * - Otherwise 0.
 */
export function calculateCurrentStreak(habitLog: Record<string, boolean> | undefined, referenceDate: Date = new Date()): number {
  if (!habitLog) return 0;

  const todayKey = formatDateKey(referenceDate);
  const yesterdayKey = getPreviousDayKey(todayKey);

  let currentKey = '';
  if (habitLog[todayKey]) {
    currentKey = todayKey;
  } else if (habitLog[yesterdayKey]) {
    currentKey = yesterdayKey;
  } else {
    return 0;
  }

  let streak = 0;
  let checkKey = currentKey;

  while (habitLog[checkKey]) {
    streak++;
    checkKey = getPreviousDayKey(checkKey);
  }

  return streak;
}

/**
 * Calculates the all-time best streak for a habit.
 */
export function calculateBestStreak(habitLog: Record<string, boolean> | undefined): number {
  if (!habitLog) return 0;

  // Get all completed date keys sorted ascending
  const completedDates = Object.keys(habitLog)
    .filter(k => habitLog[k])
    .sort();

  if (completedDates.length === 0) return 0;
  if (completedDates.length === 1) return 1;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = parseDateKey(completedDates[i - 1]);
    const currDate = parseDateKey(completedDates[i]);

    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

/**
 * Calculates total completed days across all time for a habit.
 */
export function calculateTotalCompleted(habitLog: Record<string, boolean> | undefined): number {
  if (!habitLog) return 0;
  return Object.values(habitLog).filter(Boolean).length;
}
