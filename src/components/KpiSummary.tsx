import React from 'react';
import { Flame, CheckCircle2, Award, TrendingUp, HelpCircle } from 'lucide-react';
import { LevelInfo } from '../utils/xpUtils';

interface KpiSummaryProps {
  todayCompletedCount: number;
  totalHabitsCount: number;
  longestStreak: number;
  longestStreakHabitName: string;
  monthlyConsistencyRate: number;
  monthlyTotalCompletions: number;
  monthlyTotalSlots: number;
  levelInfo: LevelInfo;
  onOpenAchievements: () => void;
  hintsEnabled: boolean;
  onTriggerHint: (hintId: string) => void;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({
  todayCompletedCount,
  totalHabitsCount,
  longestStreak,
  longestStreakHabitName,
  monthlyConsistencyRate,
  monthlyTotalCompletions,
  monthlyTotalSlots,
  levelInfo,
  onOpenAchievements,
  hintsEnabled,
  onTriggerHint,
}) => {
  const todayPercentage = totalHabitsCount > 0 ? Math.round((todayCompletedCount / totalHabitsCount) * 100) : 0;

  const handleCardClick = () => {
    if (hintsEnabled) {
      onTriggerHint('kpi-cards');
    }
  };

  return (
    <div className="relative mb-6">
      {/* Optional Hint indicator bar when hints are enabled */}
      {hintsEnabled && (
        <div className="flex items-center justify-between mb-2 px-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>💡 Click any KPI card below to see its exact formula & calculation guide</span>
          </span>
          <button
            onClick={() => onTriggerHint('kpi-cards')}
            className="hover:underline flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Formula Guide</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Today's Completion */}
        <div 
          onClick={handleCardClick}
          className={`bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all group ${
            hintsEnabled ? 'cursor-pointer ring-1 ring-emerald-500/10 hover:ring-emerald-500/30' : ''
          }`}
          title={hintsEnabled ? 'Click to see formula and calculation explanation' : undefined}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <span>Today's Completion</span>
              {hintsEnabled && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">💡</span>}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {todayCompletedCount} <span className="text-lg font-normal text-gray-400 dark:text-gray-500">/ {totalHabitsCount}</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
              {todayPercentage}% Done
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${todayPercentage}%` }}
            />
          </div>

          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            {totalHabitsCount === 0
              ? 'No habits added yet'
              : todayPercentage === 100 
              ? '🔥 All habits completed today! Perfect score!' 
              : `${totalHabitsCount - todayCompletedCount} habit${(totalHabitsCount - todayCompletedCount) === 1 ? '' : 's'} remaining today`}
          </p>
        </div>

        {/* 2. Longest Active Streak */}
        <div 
          onClick={handleCardClick}
          className={`bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-800/80 transition-all group ${
            hintsEnabled ? 'cursor-pointer ring-1 ring-amber-500/10 hover:ring-amber-500/30' : ''
          }`}
          title={hintsEnabled ? 'Click to see formula and calculation explanation' : undefined}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <span>Longest Active Streak</span>
              {hintsEnabled && <span className="text-[10px] text-amber-500">💡</span>}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4 fill-amber-500/20" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              <span className="text-amber-500">🔥</span>
              <span>{longestStreak}</span>
              <span className="text-base font-medium text-gray-400 dark:text-gray-500">Days</span>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {longestStreak >= 7 ? 'On Fire' : longestStreak > 0 ? 'Active' : '0 Days'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate max-w-[200px]" title={longestStreakHabitName}>
              {longestStreakHabitName || 'No active habits yet'}
            </span>
          </div>

          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            {longestStreak >= 21 ? '🏆 Incredible discipline!' : longestStreak > 0 ? 'Consecutive completed streak' : 'Consecutive completed streak'}
          </p>
        </div>

        {/* 3. Monthly Consistency Score */}
        <div 
          onClick={handleCardClick}
          className={`bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800/80 transition-all group ${
            hintsEnabled ? 'cursor-pointer ring-1 ring-emerald-500/10 hover:ring-emerald-500/30' : ''
          }`}
          title={hintsEnabled ? 'Click to see formula and calculation explanation' : undefined}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <span>Monthly Consistency</span>
              {hintsEnabled && <span className="text-[10px] text-emerald-600 dark:text-emerald-400">💡</span>}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {monthlyConsistencyRate}%
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              monthlyConsistencyRate >= 80 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : monthlyConsistencyRate >= 50
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
            }`}>
              {monthlyConsistencyRate >= 85 ? 'Master' : monthlyConsistencyRate >= 70 ? 'Strong' : totalHabitsCount === 0 ? 'Ready' : 'Building'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${monthlyConsistencyRate}%` }}
            />
          </div>

          <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            {monthlyTotalCompletions} of {monthlyTotalSlots} target check-ins done
          </p>
        </div>

        {/* 4. Gamified XP & Level Bar */}
        <div 
          onClick={() => {
            if (hintsEnabled) {
              onTriggerHint('kpi-cards');
            } else {
              onOpenAchievements();
            }
          }}
          className={`bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-800 shadow-xs hover:border-purple-300 dark:hover:border-purple-800/80 transition-all cursor-pointer group ${
            hintsEnabled ? 'ring-1 ring-purple-500/10 hover:ring-purple-500/30' : ''
          }`}
          title={hintsEnabled ? 'Click to see formula and calculation explanation' : 'Click to view Badges and Achievements'}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <span>Gamified Level & XP</span>
              <Award className="w-3.5 h-3.5 text-purple-500" />
              {hintsEnabled && <span className="text-[10px] text-purple-500">💡</span>}
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform text-sm">
              {levelInfo.badge}
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-1">
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>Lvl {levelInfo.level}</span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                {levelInfo.title}
              </span>
            </div>
            <div className="text-xs font-bold text-gray-600 dark:text-gray-400">
              {levelInfo.totalXp} <span className="text-[10px] text-gray-400">XP</span>
            </div>
          </div>

          {/* Progress bar to next level */}
          <div className="mt-3 w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-linear-to-r from-purple-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
            <span>{levelInfo.progressPercent}% to Lvl {levelInfo.level + 1}</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium">+10 XP / habit</span>
          </div>
        </div>

      </div>
    </div>
  );
};
