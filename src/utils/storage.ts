import { Habit, HabitLogs, UserSettings } from '../types';

const STORAGE_KEYS = {
  HABITS: 'streako_habits_v2',
  LOGS: 'streako_logs_v2',
  SETTINGS: 'streako_settings_v2',
  CLEAN_INITIALIZED: 'streako_clean_slate_v2',
};

export const DEFAULT_SETTINGS: UserSettings = {
  subtitle: 'Turn your life into a game',
  darkMode: false,
  soundEnabled: true,
  compactGrid: false,
  filterCategory: 'All',
  hintsEnabled: true,
};

/**
 * Ensures any old mock data from previous sessions is cleared once
 */
function ensureCleanSlate(): void {
  try {
    if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.CLEAN_INITIALIZED) !== 'true') {
      localStorage.removeItem('streako_habits_v1');
      localStorage.removeItem('streako_logs_v1');
      localStorage.removeItem(STORAGE_KEYS.HABITS);
      localStorage.removeItem(STORAGE_KEYS.LOGS);
      localStorage.setItem(STORAGE_KEYS.CLEAN_INITIALIZED, 'true');
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Loads habits from localStorage.
 * Guaranteed clean slate: returns empty array [] on first load.
 */
export function loadHabits(): Habit[] {
  ensureCleanSlate();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    return [];
  } catch (err) {
    console.error('Error loading habits from localStorage', err);
    return [];
  }
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (err) {
    console.error('Error saving habits', err);
  }
}

/**
 * Loads logs from localStorage.
 * Guaranteed clean slate: returns empty logs {} on first load.
 */
export function loadLogs(): HabitLogs {
  ensureCleanSlate();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.error('Error loading logs from localStorage', err);
    return {};
  }
}

export function saveLogs(logs: HabitLogs): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (err) {
    console.error('Error loading settings', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings', err);
  }
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.HABITS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem('streako_habits_v1');
    localStorage.removeItem('streako_logs_v1');
    localStorage.setItem(STORAGE_KEYS.CLEAN_INITIALIZED, 'true');
  } catch (err) {
    console.error('Error clearing storage', err);
  }
}
