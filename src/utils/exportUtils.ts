import { Habit, HabitLogs, UserSettings, BackupData } from '../types';
import { formatDateKey, getDaysInMonth, MONTH_NAMES } from './dateUtils';

/**
 * Exports current month data to a clean CSV formatted with UTF-8 BOM for Excel / Google Sheets
 */
export function exportMonthToCSV(
  habits: Habit[],
  logs: HabitLogs,
  year: number,
  monthIndex: number
): void {
  const days = getDaysInMonth(year, monthIndex);
  const monthName = MONTH_NAMES[monthIndex];

  // CSV Headers
  const dayHeaders = days.map(d => `Day ${d.getDate()} (${d.toLocaleDateString('en-US', { weekday: 'narrow' })})`);
  const headers = ['Habit Name', 'Category', 'Target Days', 'Completed Days', 'Completion Rate %', ...dayHeaders];

  const rows: string[][] = [];

  habits.forEach(habit => {
    const habitLog = logs[habit.id] || {};
    let completedCount = 0;

    const dayValues = days.map(d => {
      const key = formatDateKey(d);
      const isDone = !!habitLog[key];
      if (isDone) completedCount++;
      return isDone ? '1' : '0';
    });

    const rate = Math.round((completedCount / (habit.targetDays || days.length)) * 100);

    const row = [
      `"${habit.emoji ? habit.emoji + ' ' : ''}${habit.name.replace(/"/g, '""')}"`,
      `"${habit.category}"`,
      String(habit.targetDays),
      String(completedCount),
      `${rate}%`,
      ...dayValues,
    ];

    rows.push(row);
  });

  // Calculate daily totals summary row (Excel COUNTIF equivalent)
  const summaryRow = [
    '"DAILY COMPLETION COUNT"',
    '""',
    '""',
    '""',
    '""',
    ...days.map(d => {
      const key = formatDateKey(d);
      const count = habits.filter(h => !!(logs[h.id] && logs[h.id][key])).length;
      return String(count);
    }),
  ];
  rows.push(summaryRow);

  const percentageRow = [
    '"DAILY COMPLETION %"',
    '""',
    '""',
    '""',
    '""',
    ...days.map(d => {
      const key = formatDateKey(d);
      const count = habits.filter(h => !!(logs[h.id] && logs[h.id][key])).length;
      const pct = habits.length > 0 ? Math.round((count / habits.length) * 100) : 0;
      return `${pct}%`;
    }),
  ];
  rows.push(percentageRow);

  // Join lines with CRLF and add UTF-8 BOM \uFEFF for Excel compatibility
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Streako_Habits_${monthName}_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a complete JSON backup of all habits, logs, and settings
 */
export function exportBackupJSON(
  habits: Habit[],
  logs: HabitLogs,
  settings: UserSettings
): void {
  const backup: BackupData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    habits,
    logs,
    settings,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = formatDateKey(new Date());
  link.setAttribute('href', url);
  link.setAttribute('download', `streako-backup-${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse and validate JSON backup file content
 */
export function validateAndParseJSONBackup(jsonString: string): BackupData {
  const parsed = JSON.parse(jsonString);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup file: not a JSON object.');
  }

  if (!Array.isArray(parsed.habits)) {
    throw new Error('Invalid backup file: missing habits list.');
  }

  if (typeof parsed.logs !== 'object' || parsed.logs === null) {
    throw new Error('Invalid backup file: missing habit logs.');
  }

  return {
    version: parsed.version || '1.0.0',
    exportedAt: parsed.exportedAt || new Date().toISOString(),
    habits: parsed.habits,
    logs: parsed.logs,
    settings: parsed.settings || {},
  };
}
