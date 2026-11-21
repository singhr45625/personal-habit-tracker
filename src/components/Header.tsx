import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Plus, 
  Download, 
  Edit2, 
  Check, 
  RotateCcw,
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { MONTH_NAMES } from '../utils/dateUtils';
import { UserSettings } from '../types';

interface HeaderProps {
  currentYear: number;
  currentMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpToday: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  onOpenAchievements: () => void;
  isCurrentMonth: boolean;
  onTriggerHint: (hintId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onJumpToday,
  settings,
  onUpdateSettings,
  onOpenAddModal,
  onOpenBackupModal,
  onOpenAchievements,
  isCurrentMonth,
  onTriggerHint,
}) => {
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [subtitleText, setSubtitleText] = useState(settings.subtitle);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSubtitleText(settings.subtitle);
  }, [settings.subtitle]);

  useEffect(() => {
    if (isEditingSubtitle && subtitleInputRef.current) {
      subtitleInputRef.current.focus();
      subtitleInputRef.current.select();
    }
  }, [isEditingSubtitle]);

  const handleSaveSubtitle = () => {
    setIsEditingSubtitle(false);
    const trimmed = subtitleText.trim() || 'Turn your life into a game';
    setSubtitleText(trimmed);
    onUpdateSettings({ subtitle: trimmed });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveSubtitle();
    if (e.key === 'Escape') {
      setSubtitleText(settings.subtitle);
      setIsEditingSubtitle(false);
    }
  };

  const handleToggleHints = () => {
    const nextState = !settings.hintsEnabled;
    onUpdateSettings({ hintsEnabled: nextState });
    if (nextState) {
      // Automatically open the first tour hint when turned on
      onTriggerHint('kpi-cards');
    }
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] sticky top-0 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Brand & Editable Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
                <path d="m9 12 2 2 4-4" stroke="#10B981" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  Streako <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 uppercase tracking-wider">Personal</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-700/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Local-First
                </span>
              </div>

              {/* Editable Subtitle */}
              <div className="flex items-center gap-1.5 mt-0.5 group">
                {isEditingSubtitle ? (
                  <div className="flex items-center gap-1">
                    <input
                      ref={subtitleInputRef}
                      type="text"
                      value={subtitleText}
                      onChange={(e) => setSubtitleText(e.target.value)}
                      onBlur={handleSaveSubtitle}
                      onKeyDown={handleKeyDown}
                      maxLength={60}
                      className="text-xs px-2 py-0.5 rounded border border-emerald-400 bg-emerald-50/50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      onClick={handleSaveSubtitle}
                      className="p-1 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                      title="Save subtitle"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p 
                    onClick={() => setIsEditingSubtitle(true)}
                    className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                    title="Click to edit subtitle"
                  >
                    <span>{settings.subtitle}</span>
                    <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Month / Week Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-center gap-2 bg-gray-50 dark:bg-gray-800/80 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700/80">
            <button
              onClick={onPrevMonth}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition shadow-xs active:scale-95"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-2 sm:px-3">
              <CalendarIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 tracking-tight min-w-[125px] text-center select-none">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </span>
            </div>

            <button
              onClick={onNextMonth}
              className="p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition shadow-xs active:scale-95"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={onJumpToday}
              disabled={isCurrentMonth}
              className={`ml-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                isCurrentMonth
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 cursor-default'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 border border-gray-200 dark:border-gray-600 shadow-xs active:scale-95'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              Today
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            
            {/* Interactive Hints / Guide Toggle */}
            <button
              onClick={handleToggleHints}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1.5 active:scale-95 ${
                settings.hintsEnabled
                  ? 'bg-emerald-500/15 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
              title={settings.hintsEnabled ? 'Interactive Hints: ON (Click to turn off)' : 'Interactive Hints: OFF (Click to turn on)'}
            >
              <Lightbulb className={`w-3.5 h-3.5 ${settings.hintsEnabled ? 'text-amber-500 fill-amber-400 animate-bounce' : 'text-gray-400'}`} />
              <span>Hints: {settings.hintsEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Gamification Achievements Button */}
            <div className="relative flex items-center">
              <button
                onClick={onOpenAchievements}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/50 hover:bg-amber-500/20 transition flex items-center gap-1.5 active:scale-95"
                title="View Gamified Badges & Levels"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Badges</span>
              </button>
              {settings.hintsEnabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerHint('badges-backup');
                  }}
                  className="ml-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold hover:scale-110 transition shadow-xs"
                  title="Hint: Badges & Data Portability"
                >
                  ?
                </button>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`p-2 rounded-xl border transition-colors ${
                settings.soundEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
              }`}
              title={settings.soundEnabled ? 'Mute Sounds' : 'Enable Pop Sounds'}
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
              className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {settings.darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            {/* Backup / Export Menu Button */}
            <button
              onClick={onOpenBackupModal}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition flex items-center gap-1.5 shadow-xs active:scale-95"
              title="Export to Excel/CSV, JSON Backup & Restore"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Data & Backup</span>
            </button>

            {/* + Add Habit Primary Button with Hint Beacon */}
            <div className="relative flex items-center">
              <button
                onClick={onOpenAddModal}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Habit</span>
              </button>
              {settings.hintsEnabled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerHint('add-habit');
                  }}
                  className="ml-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold hover:scale-110 transition shadow-xs"
                  title="Hint: Add Habit setup"
                >
                  ?
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
