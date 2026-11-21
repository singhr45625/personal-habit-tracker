import React from 'react';
import { formatDateKey, isSameDay } from '../utils/dateUtils';
import { Habit, HabitLogs } from '../types';

interface DailySummaryRowProps {
  days: Date[];
  today: Date;
  habits: Habit[];
  logs: HabitLogs;
  hintsEnabled?: boolean;
  onTriggerHint?: (hintId: string) => void;
}

export const DailySummaryRow: React.FC<DailySummaryRowProps> = ({
  days,
  today,
  habits,
  logs,
  hintsEnabled,
  onTriggerHint,
}) => {
  const totalHabits = habits.length;

  // Calculate monthly overall average
  let totalCompletionsInMonth = 0;
  let totalPossibleSlots = totalHabits * days.length;

  days.forEach((d) => {
    const key = formatDateKey(d);
    habits.forEach((h) => {
      if (logs[h.id] && logs[h.id][key]) {
        totalCompletionsInMonth++;
      }
    });
  });

  const monthAverageRate = totalPossibleSlots > 0 ? Math.round((totalCompletionsInMonth / totalPossibleSlots) * 100) : 0;

  return (
    <tr className="bg-gray-100/90 dark:bg-[#0B101B] border-t-2 border-b border-gray-200 dark:border-gray-800 font-mono text-xs select-none">
      
      {/* 1. Left Sticky Column: Summary Title */}
      <td className="sticky left-0 z-20 px-3 py-2.5 text-left border-r border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0B101B] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between min-w-[210px] max-w-[240px]">
          <span className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span>Daily Total</span>
            {hintsEnabled && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">💡</span>}
          </span>
          <button
            onClick={() => onTriggerHint && onTriggerHint('daily-summary')}
            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border transition ${
              hintsEnabled 
                ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse hover:bg-emerald-600' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
            title="Formula: COUNTIF(Completed) / TotalHabits. Click for explanation!"
          >
            COUNTIF ?
          </button>
        </div>
      </td>

      {/* 2. Streak column: Monthly Average label */}
      <td className="sticky left-[210px] sm:left-[240px] z-20 px-2 py-2 text-center border-r border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0B101B] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
        <div className="min-w-[70px] text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">
          Avg.
        </div>
      </td>

      {/* 3. Progress Column: Overall Month Avg */}
      <td className="sticky left-[280px] sm:left-[310px] z-20 px-3 py-2 border-r border-gray-200 dark:border-gray-800 bg-gray-100/95 dark:bg-[#0B101B] shadow-[3px_0_6px_-2px_rgba(0,0,0,0.07)]">
        <div className="min-w-[105px] max-w-[125px]">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-gray-700 dark:text-gray-300">
              {totalCompletionsInMonth}/{totalPossibleSlots}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {monthAverageRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${monthAverageRate}%` }}
            />
          </div>
        </div>
      </td>

      {/* 4. Scrollable Day Columns: Daily Count & % */}
      {days.map((date) => {
        const dateKey = formatDateKey(date);
        const isDayToday = isSameDay(date, today);

        let dayCount = 0;
        habits.forEach((h) => {
          if (logs[h.id] && logs[h.id][dateKey]) {
            dayCount++;
          }
        });

        const rate = totalHabits > 0 ? Math.round((dayCount / totalHabits) * 100) : 0;

        // Color coding based on rate
        let badgeColor = 'text-gray-400 dark:text-gray-500';
        let barColor = 'bg-gray-300 dark:bg-gray-700';

        if (rate === 100) {
          badgeColor = 'text-emerald-600 dark:text-emerald-400 font-extrabold';
          barColor = 'bg-emerald-500';
        } else if (rate >= 60) {
          badgeColor = 'text-emerald-500 dark:text-emerald-400 font-bold';
          barColor = 'bg-emerald-400';
        } else if (rate > 0) {
          badgeColor = 'text-amber-600 dark:text-amber-400 font-medium';
          barColor = 'bg-amber-400';
        }

        return (
          <td
            key={dateKey}
            className={`p-1 text-center border-r border-gray-200 dark:border-gray-800 transition-colors ${
              isDayToday ? 'bg-emerald-100/50 dark:bg-emerald-950/30' : ''
            }`}
            title={`${dateKey}: ${dayCount}/${totalHabits} habits (${rate}%)`}
          >
            <div className="flex flex-col items-center justify-center min-w-[28px] sm:min-w-[32px] py-1">
              <span className={`text-[11px] leading-tight ${badgeColor}`}>
                {rate}%
              </span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">
                {dayCount}/{totalHabits}
              </span>
              <div className="w-5 bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden mt-0.5">
                <div 
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          </td>
        );
      })}

      {/* 5. Actions spacer */}
      <td className="px-2 py-2 text-center border-l border-gray-200 dark:border-gray-800 bg-gray-100/90 dark:bg-[#0B101B]">
        <span className="text-[10px] text-gray-400">Total</span>
      </td>

    </tr>
  );
};
