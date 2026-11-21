export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}

export function getDaysInMonth(year: number, month: number): Date[] {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const days: Date[] = [];
  const totalDays = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= totalDays; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

export const WEEKDAY_INITIALS = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
export const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function getWeekdayInitial(date: Date): string {
  return WEEKDAY_INITIALS[date.getDay()];
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function getPreviousDayKey(dateStr: string): string {
  const d = parseDateKey(dateStr);
  d.setDate(d.getDate() - 1);
  return formatDateKey(d);
}

export function getNextDayKey(dateStr: string): string {
  const d = parseDateKey(dateStr);
  d.setDate(d.getDate() + 1);
  return formatDateKey(d);
}
