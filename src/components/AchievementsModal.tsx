import React from 'react';
import { LevelInfo, LEVEL_TIERS } from '../utils/xpUtils';
import { Habit, HabitLogs } from '../types';
import { calculateCurrentStreak } from '../utils/streakUtils';
import { X, Trophy, Award, Check, Lock } from 'lucide-react';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelInfo: LevelInfo;
  habits: Habit[];
  logs: HabitLogs;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  levelInfo,
  habits,
  logs,
}) => {
  if (!isOpen) return null;

  // Calculate highest streak across all habits
  let maxStreak = 0;
  habits.forEach(h => {
    const streak = calculateCurrentStreak(logs[h.id]);
    if (streak > maxStreak) maxStreak = streak;
  });

  const totalCompletions = levelInfo.totalCompletions;

  // Badges system
  const BADGES = [
    {
      id: 'first-step',
      title: 'First Step',
      description: 'Check off your very first habit',
      icon: '🌱',
      unlocked: totalCompletions >= 1,
      progress: Math.min(100, Math.round((totalCompletions / 1) * 100)),
      requirement: '1 Check-in',
    },
    {
      id: 'streak-3',
      title: 'Ignition Flame',
      description: 'Maintain a 3-day active streak on any habit',
      icon: '⚡',
      unlocked: maxStreak >= 3,
      progress: Math.min(100, Math.round((maxStreak / 3) * 100)),
      requirement: '3-Day Streak',
    },
    {
      id: 'streak-7',
      title: '7-Day Warrior',
      description: 'Hit a full 7-day streak without skipping a beat',
      icon: '🔥',
      unlocked: maxStreak >= 7,
      progress: Math.min(100, Math.round((maxStreak / 7) * 100)),
      requirement: '7-Day Streak',
    },
    {
      id: 'habit-5',
      title: 'High Five',
      description: 'Track 5 or more active habits concurrently',
      icon: '🖐️',
      unlocked: habits.length >= 5,
      progress: Math.min(100, Math.round((habits.length / 5) * 100)),
      requirement: '5 Habits',
    },
    {
      id: 'streak-21',
      title: 'Habit Architect',
      description: 'Reach a 21-day streak to cement neural pathways',
      icon: '🧠',
      unlocked: maxStreak >= 21,
      progress: Math.min(100, Math.round((maxStreak / 21) * 100)),
      requirement: '21-Day Streak',
    },
    {
      id: 'century-100',
      title: 'Century Club',
      description: 'Log 100 total habit completions across your dashboard',
      icon: '💯',
      unlocked: totalCompletions >= 100,
      progress: Math.min(100, Math.round((totalCompletions / 100) * 100)),
      requirement: '100 Completions',
    },
    {
      id: 'legend-300',
      title: 'Iron Titan',
      description: 'Accumulate 300+ total completions and 3,000 XP',
      icon: '👑',
      unlocked: totalCompletions >= 300,
      progress: Math.min(100, Math.round((totalCompletions / 300) * 100)),
      requirement: '300 Completions',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-2xl overflow-hidden animate-pop flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-purple-500 to-emerald-500 text-white flex items-center justify-center shadow-xs text-xl">
              {levelInfo.badge}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Level {levelInfo.level}: {levelInfo.title}
                </h3>
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  {levelInfo.totalXp} XP
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Each completed habit awards +10 XP. Level up as you build consistency!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content with Scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Level Progress Banner */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-500/10 via-purple-500/10 to-amber-500/10 border border-emerald-500/20 dark:border-emerald-500/30">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-gray-700 dark:text-gray-300">
                Level {levelInfo.level} ({levelInfo.currentLevelXp} XP)
              </span>
              <span className="text-purple-600 dark:text-purple-400 font-mono">
                {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP to Level {levelInfo.level + 1}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
              <div 
                className="bg-linear-to-r from-emerald-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
              <span>{levelInfo.totalCompletions} total habits checked off</span>
              <span>{levelInfo.progressPercent}% to next rank</span>
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Milestone Badges ({BADGES.filter(b => b.unlocked).length} / {BADGES.length} Unlocked)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGES.map(badge => (
                <div 
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    badge.unlocked
                      ? 'bg-white dark:bg-gray-800/80 border-emerald-300 dark:border-emerald-800/80 shadow-xs'
                      : 'bg-gray-50/70 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                    badge.unlocked 
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}>
                    {badge.unlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {badge.title}
                      </h5>
                      {badge.unlocked && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded">
                          Unlocked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5 line-clamp-2">
                      {badge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-2">
                      <div 
                        className={`h-full rounded-full transition-all ${badge.unlocked ? 'bg-emerald-500' : 'bg-gray-400'}`}
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Level Tiers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-purple-500" />
              <span>Rank Journey & Level Thresholds</span>
            </h4>

            <div className="space-y-1.5 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              {LEVEL_TIERS.map(tier => {
                const isCurrent = tier.level === levelInfo.level;
                const isCompleted = levelInfo.totalXp >= tier.threshold;

                return (
                  <div 
                    key={tier.level}
                    className={`px-4 py-2.5 flex items-center justify-between transition-colors ${
                      isCurrent 
                        ? 'bg-purple-50/80 dark:bg-purple-950/40 font-bold' 
                        : isCompleted 
                        ? 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300' 
                        : 'bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{tier.badge}</span>
                      <span className={isCurrent ? 'text-purple-700 dark:text-purple-300 font-extrabold' : ''}>
                        Level {tier.level}: {tier.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono">
                      <span>{tier.threshold} XP</span>
                      {isCompleted ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs hover:opacity-90 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
