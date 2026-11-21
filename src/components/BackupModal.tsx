import React, { useRef, useState } from 'react';
import { Habit, HabitLogs, UserSettings } from '../types';
import { exportMonthToCSV, exportBackupJSON, validateAndParseJSONBackup } from '../utils/exportUtils';
import { 
  X, 
  FileSpreadsheet, 
  FileJson, 
  Upload, 
  Trash2, 
  Sparkles, 
  AlertTriangle,
  HelpCircle 
} from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  logs: HabitLogs;
  settings: UserSettings;
  currentYear: number;
  currentMonth: number;
  onRestoreData: (habits: Habit[], logs: HabitLogs, settings?: Partial<UserSettings>) => void;
  onClearAllData: () => void;
  onRestoreSampleData: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onTriggerHint?: (hintId: string) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  habits,
  logs,
  settings,
  currentYear,
  currentMonth,
  onRestoreData,
  onClearAllData,
  onRestoreSampleData,
  onShowToast,
  onTriggerHint,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleExportCSV = () => {
    try {
      exportMonthToCSV(habits, logs, currentYear, currentMonth);
      onShowToast('Excel/CSV spreadsheet exported successfully! 📊', 'success');
    } catch {
      onShowToast('Failed to export CSV.', 'error');
    }
  };

  const handleExportJSON = () => {
    try {
      exportBackupJSON(habits, logs, settings);
      onShowToast('Full JSON backup downloaded! 💾', 'success');
    } catch {
      onShowToast('Failed to export JSON backup.', 'error');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const backup = validateAndParseJSONBackup(text);
        onRestoreData(backup.habits, backup.logs, backup.settings);
        onShowToast(`Successfully restored ${backup.habits.length} habits! 🎉`, 'success');
        onClose();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Invalid backup file';
        onShowToast(`Restore error: ${message}`, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Data Portability & Backup Toolbar
                </h3>
                {onTriggerHint && (
                  <button
                    onClick={() => {
                      onClose();
                      onTriggerHint('badges-backup');
                    }}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 p-0.5"
                    title="View Backup Guide & Hints"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                100% free, local-first. Export or restore your habit data anytime.
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

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {/* 1. Export to Excel / CSV */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-400 dark:hover:border-emerald-700 bg-gray-50/50 dark:bg-gray-800/30 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Export to CSV / Excel
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Formatted spreadsheet with UTF-8 BOM. Opens natively in Microsoft Excel & Google Sheets.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shrink-0 transition active:scale-95"
            >
              Export CSV
            </button>
          </div>

          {/* 2. Full JSON Backup */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-700 bg-gray-50/50 dark:bg-gray-800/30 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Full JSON Backup
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Save all habits, history logs, settings, and XP progress into a portable file.
                </p>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs shrink-0 transition active:scale-95"
            >
              Export JSON
            </button>
          </div>

          {/* 3. Restore from JSON */}
          <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-purple-400 dark:hover:border-purple-700 bg-gray-50/50 dark:bg-gray-800/30 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Restore from JSON File
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Import a previously exported backup file to restore your tracking data.
                </p>
              </div>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs shrink-0 transition active:scale-95"
              >
                Import JSON
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800" />

          {/* 4. Reset & Clear Options */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={() => {
                onRestoreSampleData();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Load 5 Sample Habits</span>
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Reset all to 0?
                </span>
                <button
                  onClick={() => {
                    onClearAllData();
                    setConfirmClear(false);
                    onClose();
                  }}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
                >
                  Yes, Wipe Everything
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-3 py-1.5 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center gap-1.5"
                title="Wipe habits, logs, and streaks back to zero"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset All Data</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
