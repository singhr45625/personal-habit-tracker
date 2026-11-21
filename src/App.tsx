import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Habit, HabitLogs, UserSettings } from './types';
import { 
  loadHabits, 
  saveHabits, 
  loadLogs, 
  saveLogs, 
  loadSettings, 
  saveSettings, 
  clearAllData 
} from './utils/storage';
import { STARTER_HABITS, generateStarterLogs } from './constants/starterHabits';
import { formatDateKey, getTodayKey, getDaysInMonth } from './utils/dateUtils';
import { calculateCurrentStreak } from './utils/streakUtils';
import { calculateTotalXp, getLevelInfo } from './utils/xpUtils';
import { playCheckSound, playUncheckSound, playLevelUpSound } from './utils/sound';
import { fireConfetti, fireLevelUpConfetti } from './utils/confetti';
import { APP_HINTS } from './constants/hints';

import { Header } from './components/Header';
import { KpiSummary } from './components/KpiSummary';
import { SpreadsheetGrid } from './components/SpreadsheetGrid';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { HabitModal } from './components/HabitModal';
import { BackupModal } from './components/BackupModal';
import { AchievementsModal } from './components/AchievementsModal';
import { HintPopover } from './components/HintPopover';
import { ToastContainer, ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  // Navigation State
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState<number>(() => today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => today.getMonth());

  // Core Data State (Clean slate on fresh initialization)
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [logs, setLogs] = useState<HabitLogs>(() => loadLogs());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());

  // UI Modals & Toasts
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Interactive Contextual Hints & Onboarding Walkthrough State
  const [activeHintIndex, setActiveHintIndex] = useState<number>(0);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);

  // Dark Mode Sync
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Persist habits on change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Persist logs on change
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  // Persist settings on change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Toast Helper
  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, text, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Trigger Contextual Hint Popover
  const handleTriggerHint = useCallback((hintId: string) => {
    const index = APP_HINTS.findIndex(h => h.id === hintId);
    if (index !== -1) {
      setActiveHintIndex(index);
      setIsHintOpen(true);
    } else {
      setActiveHintIndex(0);
      setIsHintOpen(true);
    }
  }, []);

  const handleNextHint = useCallback(() => {
    setActiveHintIndex(prev => Math.min(APP_HINTS.length - 1, prev + 1));
  }, []);

  const handlePrevHint = useCallback(() => {
    setActiveHintIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleToggleHintsOff = useCallback(() => {
    setSettings(prev => ({ ...prev, hintsEnabled: false }));
    setIsHintOpen(false);
    showToast('Interactive hints turned OFF. You can re-enable them in the top header anytime.', 'info');
  }, [showToast]);

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleJumpToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();

  // Gamification & XP calculation
  const { totalXp, totalCompletions } = useMemo(() => calculateTotalXp(logs), [logs]);
  const levelInfo = useMemo(() => getLevelInfo(totalXp, totalCompletions), [totalXp, totalCompletions]);

  // Track previous level to celebrate level ups!
  const [prevLevel, setPrevLevel] = useState<number>(levelInfo.level);

  useEffect(() => {
    if (levelInfo.level > prevLevel) {
      if (settings.soundEnabled) playLevelUpSound();
      fireLevelUpConfetti();
      showToast(`🎉 Level Up! You reached Level ${levelInfo.level}: ${levelInfo.title}!`, 'success');
      setPrevLevel(levelInfo.level);
    } else if (levelInfo.level < prevLevel) {
      setPrevLevel(levelInfo.level);
    }
  }, [levelInfo.level, prevLevel, levelInfo.title, settings.soundEnabled, showToast]);

  // Toggle Cell Checkbox
  const handleToggleCell = useCallback((habitId: string, dateKey: string) => {
    setLogs(prevLogs => {
      const habitLog = { ...(prevLogs[habitId] || {}) };
      const currentlyChecked = !!habitLog[dateKey];
      const willBeChecked = !currentlyChecked;

      if (willBeChecked) {
        habitLog[dateKey] = true;
        if (settings.soundEnabled) playCheckSound();
      } else {
        delete habitLog[dateKey];
        if (settings.soundEnabled) playUncheckSound();
      }

      const updated = {
        ...prevLogs,
        [habitId]: habitLog,
      };

      // Check if habit just reached its monthly target!
      if (willBeChecked) {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const days = getDaysInMonth(currentYear, currentMonth);
          let count = 0;
          days.forEach(d => {
            const k = formatDateKey(d);
            if (updated[habitId]?.[k]) count++;
          });
          if (count === habit.targetDays) {
            fireConfetti();
            showToast(`🎯 Goal Achieved! You completed all ${habit.targetDays} target days for "${habit.name}"!`, 'success');
          }
        }
      }

      return updated;
    });
  }, [habits, currentYear, currentMonth, settings.soundEnabled, showToast]);

  // Habit Management: Add or Update
  const handleSaveHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'order'> & { id?: string }) => {
    if (habitData.id) {
      // Edit
      setHabits(prev => prev.map(h => h.id === habitData.id ? { ...h, ...habitData } : h));
      showToast(`Habit "${habitData.name}" updated`, 'success');
    } else {
      // Add new
      if (habits.length >= 99) {
        showToast('Maximum of 99 habits reached.', 'error');
        return;
      }
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: habitData.name,
        emoji: habitData.emoji,
        category: habitData.category,
        targetDays: habitData.targetDays,
        color: habitData.color,
        createdAt: new Date().toISOString(),
        order: habits.length,
      };
      setHabits(prev => [...prev, newHabit]);
      showToast(`Added habit "${newHabit.name}"! ✨`, 'success');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsHabitModalOpen(true);
  };

  const handleDeleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (window.confirm(`Delete habit "${habit.name}"? This will also remove its tracked history.`)) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
      setLogs(prev => {
        const next = { ...prev };
        delete next[habitId];
        return next;
      });
      showToast(`Deleted habit "${habit.name}"`, 'info');
    }
  };

  const handleReorderHabits = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= habits.length) return;
    setHabits(prev => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy.map((h, idx) => ({ ...h, order: idx }));
    });
  };

  // Optional: Restore Sample Habits (for testing only when explicitly requested in Backup Modal)
  const handleRestoreSampleData = () => {
    const starterLogs = generateStarterLogs(STARTER_HABITS);
    setHabits(STARTER_HABITS);
    setLogs(starterLogs);
    showToast('Loaded 5 sample habits with active streaks! 🚀', 'success');
  };

  // Reset All Data (Clean Slate to 0)
  const handleClearAllData = () => {
    clearAllData();
    setHabits([]);
    setLogs({});
    showToast('All habit tracking data reset to zero (Clean Slate: 0 habits, 0 XP).', 'info');
  };

  // Restore from Backup Data
  const handleRestoreData = (newHabits: Habit[], newLogs: HabitLogs, newSettings?: Partial<UserSettings>) => {
    setHabits(newHabits);
    setLogs(newLogs);
    if (newSettings) {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };

  // KPI Calculations
  const todayKey = getTodayKey();

  const todayCompletedCount = useMemo(() => {
    let count = 0;
    habits.forEach(h => {
      if (logs[h.id] && logs[h.id][todayKey]) count++;
    });
    return count;
  }, [habits, logs, todayKey]);

  // Longest active streak across all habits
  const { longestStreak, longestStreakHabitName } = useMemo(() => {
    let best = 0;
    let name = '';
    habits.forEach(h => {
      const streak = calculateCurrentStreak(logs[h.id], today);
      if (streak > best) {
        best = streak;
        name = `${h.emoji ? h.emoji + ' ' : ''}${h.name}`;
      }
    });
    return { longestStreak: best, longestStreakHabitName: name };
  }, [habits, logs, today]);

  // Monthly consistency score
  const { monthlyConsistencyRate, monthlyTotalCompletions, monthlyTotalSlots } = useMemo(() => {
    const days = getDaysInMonth(currentYear, currentMonth);
    let done = 0;
    let totalSlots = habits.length * days.length;

    days.forEach(d => {
      const k = formatDateKey(d);
      habits.forEach(h => {
        if (logs[h.id] && logs[h.id][k]) done++;
      });
    });

    const rate = totalSlots > 0 ? Math.round((done / totalSlots) * 100) : 0;
    return {
      monthlyConsistencyRate: rate,
      monthlyTotalCompletions: done,
      monthlyTotalSlots: totalSlots,
    };
  }, [habits, logs, currentYear, currentMonth]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F19] text-[#111827] dark:text-[#F3F4F6] transition-colors duration-200">
      
      {/* 1. Top Control & Stats Header */}
      <Header
        currentYear={currentYear}
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onJumpToday={handleJumpToday}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenAddModal={() => {
          setEditingHabit(null);
          setIsHabitModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        isCurrentMonth={isCurrentMonth}
        onTriggerHint={handleTriggerHint}
      />

      {/* Main App Content Container */}
      <main className="max-w-[1720px] mx-auto px-4 sm:px-6 py-6">
        
        {/* Top KPI Summary Strip (4 Live Cards) */}
        <KpiSummary
          todayCompletedCount={todayCompletedCount}
          totalHabitsCount={habits.length}
          longestStreak={longestStreak}
          longestStreakHabitName={longestStreakHabitName}
          monthlyConsistencyRate={monthlyConsistencyRate}
          monthlyTotalCompletions={monthlyTotalCompletions}
          monthlyTotalSlots={monthlyTotalSlots}
          levelInfo={levelInfo}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          hintsEnabled={settings.hintsEnabled}
          onTriggerHint={handleTriggerHint}
        />

        {/* 2. Main Interactive Spreadsheet Habit Grid */}
        <SpreadsheetGrid
          currentYear={currentYear}
          currentMonth={currentMonth}
          habits={habits}
          logs={logs}
          onToggleCell={handleToggleCell}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
          onReorderHabits={handleReorderHabits}
          onOpenAddModal={() => {
            setEditingHabit(null);
            setIsHabitModalOpen(true);
          }}
          hintsEnabled={settings.hintsEnabled}
          onTriggerHint={handleTriggerHint}
        />

        {/* 3. Automated Visual Analytics Dashboard (Below Grid) */}
        <AnalyticsDashboard
          currentYear={currentYear}
          currentMonth={currentMonth}
          habits={habits}
          logs={logs}
        />

      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span>Streako Personal</span>
          <span>•</span>
          <span>100% Free & Open Local-First Habit Tracker</span>
          <span>•</span>
          <span>Auto-persisted in your browser with zero logins</span>
        </p>
      </footer>

      {/* Modals */}
      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        onSave={handleSaveHabit}
        initialHabit={editingHabit}
      />

      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        habits={habits}
        logs={logs}
        settings={settings}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onRestoreData={handleRestoreData}
        onClearAllData={handleClearAllData}
        onRestoreSampleData={handleRestoreSampleData}
        onShowToast={showToast}
        onTriggerHint={handleTriggerHint}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        levelInfo={levelInfo}
        habits={habits}
        logs={logs}
      />

      {/* Interactive Contextual Hint Popover & Walkthrough */}
      <HintPopover
        currentHint={APP_HINTS[activeHintIndex] || null}
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        onNext={handleNextHint}
        onPrev={handlePrevHint}
        onToggleHintsOff={handleToggleHintsOff}
        currentIndex={activeHintIndex}
        totalHints={APP_HINTS.length}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
};
