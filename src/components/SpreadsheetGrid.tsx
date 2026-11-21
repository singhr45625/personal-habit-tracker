import React, { useState, useMemo } from 'react';
import { Habit, HabitLogs } from '../types';
import { HabitRow } from './HabitRow';
import { DailySummaryRow } from './DailySummaryRow';
import { 
  getDaysInMonth, 
  getWeekdayInitial, 
  isSameDay, 
  isWeekend, 
  formatDateKey 
} from '../utils/dateUtils';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { Plus, Search, Filter, HelpCircle, Sparkles } from 'lucide-react';

interface SpreadsheetGridProps {
  currentYear: number;
  currentMonth: number;
  habits: Habit[];
  logs: HabitLogs;
  onToggleCell: (habitId: string, dateKey: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onReorderHabits: (fromIndex: number, toIndex: number) => void;
  onOpenAddModal: () => void;
  hintsEnabled: boolean;
  onTriggerHint: (hintId: string) => void;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  currentYear,
  currentMonth,
  habits,
  logs,
  onToggleCell,
  onEditHabit,
  onDeleteHabit,
  onReorderHabits,
  onOpenAddModal,
  hintsEnabled,
  onTriggerHint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const today = useMemo(() => new Date(), []);
  const days = useMemo(() => getDaysInMonth(currentYear, currentMonth), [currentYear, currentMonth]);

  // Unique categories for filtering (starts with only 'All' when habits are empty)
  const categories = useMemo(() => {
    const set = new Set<string>();
    habits.forEach(h => {
      if (h.category) set.add(h.category);
    });
    return ['All', ...Array.from(set)];
  }, [habits]);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    return habits.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [habits, searchTerm, selectedCategory]);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs mb-8 overflow-hidden transition-colors duration-200">
      
      {/* Table Toolbar: Category Filter & Search Bar */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/60 dark:bg-gray-800/40">
        
        {/* Category Pills with Hint Trigger */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
            {hintsEnabled && (
              <button
                onClick={() => onTriggerHint('category-search')}
                className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold hover:scale-110 transition shadow-xs ml-0.5"
                title="Hint: Category Filtering"
              >
                ?
              </button>
            )}
          </div>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-xs'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5 shrink-0 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Habit</span>
          </button>
        </div>

      </div>

      {/* Spreadsheet Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto relative max-w-full">
        <table className="w-full border-collapse text-left border-spacing-0">
          
          {/* Header Row */}
          <thead>
            <tr className="bg-gray-100/95 dark:bg-[#0E1522] border-b border-gray-200 dark:border-gray-800 text-[11px] font-semibold text-gray-600 dark:text-gray-300 select-none">
              
              {/* 1. Left Sticky Column Header */}
              <th className="sticky left-0 z-30 px-3 py-3 text-left border-r border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0E1522] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[210px] max-w-[240px]">
                <div className="flex items-center justify-between">
                  <span>HABIT & TARGET</span>
                  <span className="text-[10px] text-gray-400 font-normal">({filteredHabits.length})</span>
                </div>
              </th>

              {/* 2. Streak Column Header */}
              <th className="sticky left-[210px] sm:left-[240px] z-30 px-2 py-3 text-center border-r border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0E1522] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] min-w-[70px]">
                <span>STREAK</span>
              </th>

              {/* 3. Progress Column Header */}
              <th className="sticky left-[280px] sm:left-[310px] z-30 px-3 py-3 text-left border-r border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0E1522] shadow-[3px_0_6px_-2px_rgba(0,0,0,0.07)] min-w-[105px] max-w-[125px]">
                <span>PROGRESS</span>
              </th>

              {/* 4. Scrollable Day Headers with Checkbox Hint Trigger */}
              {days.map((date) => {
                const dayNum = date.getDate();
                const initial = getWeekdayInitial(date);
                const isDayToday = isSameDay(date, today);
                const isDayWeekend = isWeekend(date);

                return (
                  <th
                    key={date.toISOString()}
                    className={`px-1 py-2 text-center border-r border-gray-200/70 dark:border-gray-800 min-w-[32px] sm:min-w-[36px] transition-colors ${
                      isDayToday
                        ? 'bg-emerald-500/15 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                        : isDayWeekend
                        ? 'bg-gray-200/40 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <span className={`text-[10px] uppercase font-bold ${isDayToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {initial}
                      </span>
                      <span className={`text-xs font-mono font-bold leading-tight ${isDayToday ? 'text-emerald-700 dark:text-emerald-300 font-extrabold' : 'text-gray-800 dark:text-gray-200'}`}>
                        {dayNum}
                      </span>
                      {isDayToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-0.5 animate-pulse" />
                      )}
                    </div>
                  </th>
                );
              })}

              {/* 5. Actions Column Header */}
              <th className="px-3 py-3 text-center border-l border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0E1522] text-[10px] uppercase tracking-wider">
                ACTIONS
              </th>

            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {filteredHabits.length > 0 ? (
              filteredHabits.map((habit, index) => {
                const habitLog = logs[habit.id] || {};
                const currentStreak = calculateCurrentStreak(habitLog, today);

                // Count completed days in selected month
                let monthCompletedCount = 0;
                days.forEach(d => {
                  const key = formatDateKey(d);
                  if (habitLog[key]) monthCompletedCount++;
                });

                return (
                  <HabitRow
                    key={habit.id}
                    habit={habit}
                    days={days}
                    today={today}
                    habitLogs={habitLog}
                    onToggleCell={onToggleCell}
                    currentStreak={currentStreak}
                    monthCompletedCount={monthCompletedCount}
                    onEditHabit={onEditHabit}
                    onDeleteHabit={onDeleteHabit}
                    onMoveUp={() => onReorderHabits(index, index - 1)}
                    onMoveDown={() => onReorderHabits(index, index + 1)}
                    isFirst={index === 0}
                    isLast={index === filteredHabits.length - 1}
                    rowIndex={index}
                  />
                );
              })
            ) : habits.length === 0 ? (
              /* CLEAN SLATE / ZERO-STATE EMPTY CARD */
              <tr>
                <td colSpan={days.length + 4} className="py-16 px-4 text-center">
                  <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-linear-to-b from-gray-50/80 to-white dark:from-gray-800/40 dark:to-gray-900/60 border border-gray-200 dark:border-gray-700/80 shadow-xs flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 shadow-xs">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      No habits yet
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-5 max-w-sm">
                      Click <strong>"+ Add Habit"</strong> to create your first daily goal! Track routines, earn XP, and build unbroken streaks.
                    </p>

                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <button
                        onClick={onOpenAddModal}
                        className="px-5 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2 active:scale-95"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>+ Add Habit</span>
                      </button>

                      {hintsEnabled && (
                        <button
                          onClick={() => onTriggerHint('add-habit')}
                          className="px-4 py-2 text-xs font-semibold rounded-xl border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition flex items-center gap-1.5"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>How does it work?</span>
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              /* Search with no matches */
              <tr>
                <td colSpan={days.length + 4} className="py-12 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      No habits match "{searchTerm}"
                    </p>
                    <p className="text-xs text-gray-500">
                      Try clearing your search keyword or switching category filter.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                      }}
                      className="mt-2 px-3 py-1 text-xs font-semibold text-emerald-600 hover:underline"
                    >
                      Reset Filter
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {/* Bottom Daily Summary Row (COUNTIF) */}
            {filteredHabits.length > 0 && (
              <DailySummaryRow
                days={days}
                today={today}
                habits={filteredHabits}
                logs={logs}
                hintsEnabled={hintsEnabled}
                onTriggerHint={onTriggerHint}
              />
            )}
          </tbody>

        </table>
      </div>

      {/* Spreadsheet Bottom Hint & Stats Bar */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Click any cell to toggle completion. Streaks & stats update in real-time.</span>
          {hintsEnabled && (
            <button
              onClick={() => onTriggerHint('calendar-cells')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-0.5 ml-1"
            >
              <span>(Checkboxes Hint ?)</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono">Total Active Habits: <strong className="text-gray-800 dark:text-gray-200">{habits.length}</strong></span>
        </div>
      </div>

    </div>
  );
};
