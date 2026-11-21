import React from 'react';
import { Habit } from '../types';
import { formatDateKey, isSameDay } from '../utils/dateUtils';
import { Flame, Check, ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react';

interface HabitRowProps {
  habit: Habit;
  days: Date[];
  today: Date;
  habitLogs: Record<string, boolean>;
  onToggleCell: (habitId: string, dateKey: string) => void;
  currentStreak: number;
  monthCompletedCount: number;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
  rowIndex: number;
}

export const HabitRow: React.FC<HabitRowProps> = ({
  habit,
  days,
  today,
  habitLogs,
  onToggleCell,
  currentStreak,
  monthCompletedCount,
  onEditHabit,
  onDeleteHabit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  rowIndex,
}) => {
  const targetDays = habit.targetDays || days.length;
  const progressPercent = Math.min(100, Math.round((monthCompletedCount / targetDays) * 100));

  // Category badge colors
  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fitness':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900';
      case 'health':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900';
      case 'study':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900';
      case 'coding':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900';
      case 'mindfulness':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const isRowEven = rowIndex % 2 === 0;

  return (
    <tr className={`border-b border-gray-100 dark:border-gray-800/80 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors group ${
      isRowEven ? 'bg-white dark:bg-[#111827]' : 'bg-gray-50/40 dark:bg-[#0E1522]'
    }`}>
      
      {/* 1. Sticky Left Column: Habit Info */}
      <td className={`sticky left-0 z-20 px-3 py-2.5 text-left border-r border-gray-200 dark:border-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${
        isRowEven ? 'bg-white dark:bg-[#111827]' : 'bg-gray-50 dark:bg-[#0E1522]'
      }`}>
        <div className="flex items-center gap-2 min-w-[210px] max-w-[240px]">
          {/* Reorder Buttons */}
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className={`p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${isFirst ? 'invisible' : ''}`}
              title="Move Habit Up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className={`p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 ${isLast ? 'invisible' : ''}`}
              title="Move Habit Down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Emoji */}
          <div className="text-xl shrink-0 select-none w-7 text-center">
            {habit.emoji || '📌'}
          </div>

          {/* Name & Category Tag */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-gray-100 truncate" title={habit.name}>
              {habit.name}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border ${getCategoryBadgeClass(habit.category)}`}>
                {habit.category}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                {habit.targetDays}d target
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Sticky Column: Current Streak */}
      <td className={`sticky left-[210px] sm:left-[240px] z-20 px-3 py-2 text-center border-r border-gray-200 dark:border-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] ${
        isRowEven ? 'bg-white dark:bg-[#111827]' : 'bg-gray-50 dark:bg-[#0E1522]'
      }`}>
        <div className="flex items-center justify-center gap-1 min-w-[70px]">
          <Flame className={`w-3.5 h-3.5 ${currentStreak > 0 ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'}`} />
          <span className={`font-bold text-xs font-mono ${
            currentStreak >= 7 
              ? 'text-amber-600 dark:text-amber-400' 
              : currentStreak > 0 
              ? 'text-gray-900 dark:text-gray-100' 
              : 'text-gray-400 dark:text-gray-600'
          }`}>
            {currentStreak}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">d</span>
        </div>
      </td>

      {/* 3. Sticky Column: Goal Progress */}
      <td className={`sticky left-[280px] sm:left-[310px] z-20 px-3 py-2 border-r border-gray-200 dark:border-gray-800 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)] ${
        isRowEven ? 'bg-white dark:bg-[#111827]' : 'bg-gray-50 dark:bg-[#0E1522]'
      }`}>
        <div className="min-w-[105px] max-w-[125px]">
          <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {monthCompletedCount}/{targetDays}
            </span>
            <span className={`font-bold ${progressPercent >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700/80 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent >= 100 ? 'bg-emerald-500' : 'bg-emerald-500/80'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </td>

      {/* 4. Scrollable Day Checkbox Columns */}
      {days.map((date) => {
        const dateKey = formatDateKey(date);
        const isChecked = !!habitLogs[dateKey];
        const isDayToday = isSameDay(date, today);

        return (
          <td
            key={dateKey}
            className={`p-1 text-center border-r border-gray-100 dark:border-gray-800/60 transition-colors ${
              isDayToday ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
            }`}
          >
            <button
              onClick={() => onToggleCell(habit.id, dateKey)}
              aria-label={`${habit.name} on ${dateKey}`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mx-auto transition-all transform active:scale-90 ${
                isChecked
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs animate-pop ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-transparent'
              }`}
            >
              <Check className={`w-4 h-4 stroke-[3] transition-transform ${isChecked ? 'scale-100' : 'scale-0'}`} />
            </button>
          </td>
        );
      })}

      {/* 5. Actions Column (Sticky or Right-aligned) */}
      <td className={`px-2 py-2 text-center border-l border-gray-200 dark:border-gray-800 whitespace-nowrap ${
        isRowEven ? 'bg-white dark:bg-[#111827]' : 'bg-gray-50 dark:bg-[#0E1522]'
      }`}>
        <div className="flex items-center justify-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditHabit(habit)}
            className="p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title="Edit Habit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteHabit(habit.id)}
            className="p-1 rounded-md text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
            title="Delete Habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

    </tr>
  );
};
