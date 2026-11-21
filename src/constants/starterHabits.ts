import { Habit, HabitLogs } from '../types';
import { formatDateKey } from '../utils/dateUtils';

export const STARTER_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Morning Workout',
    emoji: '💪',
    category: 'Fitness',
    targetDays: 20,
    color: '#10B981',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    order: 0,
  },
  {
    id: 'habit-2',
    name: 'Read 20 Pages',
    emoji: '📚',
    category: 'Study',
    targetDays: 25,
    color: '#3B82F6',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    order: 1,
  },
  {
    id: 'habit-3',
    name: 'Code / Build 2 Hours',
    emoji: '💻',
    category: 'Coding',
    targetDays: 22,
    color: '#8B5CF6',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    order: 2,
  },
  {
    id: 'habit-4',
    name: 'Drink 2L Water',
    emoji: '💧',
    category: 'Health',
    targetDays: 30,
    color: '#06B6D4',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    order: 3,
  },
  {
    id: 'habit-5',
    name: 'No Junk Food',
    emoji: '🥗',
    category: 'Health',
    targetDays: 28,
    color: '#F59E0B',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    order: 4,
  },
];

/**
 * Generate realistic sample completion logs for the current month
 */
export function generateStarterLogs(habits: Habit[] = STARTER_HABITS): HabitLogs {
  const logs: HabitLogs = {};
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const todayDate = today.getDate();

  habits.forEach((habit, hIdx) => {
    logs[habit.id] = {};

    // Pattern generator: give different habits realistic streaks and rates
    // e.g. habit 0 (Workout) has 80% completion and strong streak ending today
    // habit 1 (Reading) has 85% completion
    // habit 3 (Water) has 95% completion
    const probabilities = [0.75, 0.85, 0.70, 0.92, 0.80];
    const p = probabilities[hIdx % probabilities.length];

    for (let day = 1; day <= todayDate; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = formatDateKey(date);

      // Ensure recent 5-8 days are completed for great active streaks!
      const daysAgo = todayDate - day;
      if (daysAgo <= (hIdx === 2 ? 4 : 8) && daysAgo >= 0) {
        // Active streak
        logs[habit.id][dateKey] = true;
      } else {
        // Pseudo-random deterministic based on day & habit
        const seed = (day * 13 + hIdx * 7) % 100;
        if (seed < p * 100) {
          logs[habit.id][dateKey] = true;
        }
      }
    }
  });

  return logs;
}
