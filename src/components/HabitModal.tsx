import React, { useState, useEffect } from 'react';
import { Habit, HabitCategory } from '../types';
import { X, Check } from 'lucide-react';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Omit<Habit, 'id' | 'createdAt' | 'order'> & { id?: string }) => void;
  initialHabit?: Habit | null;
}

const COMMON_EMOJIS = [
  '💪', '🏃', '🏋️', '🚴', '🧘', '💧', '🥗', '🍎', 
  '📚', '💻', '✍️', '🎯', '🧠', '⚡', '🌿', '☕', 
  '🛌', '🚶', '🎸', '🎨', '🧹', '💊', '✨', '🔥'
];

const CATEGORIES: HabitCategory[] = [
  'Health',
  'Fitness',
  'Study',
  'Coding',
  'Mindfulness',
  'Productivity',
  'Personal',
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialHabit,
}) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💪');
  const [category, setCategory] = useState<HabitCategory>('Fitness');
  const [customCategory, setCustomCategory] = useState('');
  const [targetDays, setTargetDays] = useState(25);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name);
      setEmoji(initialHabit.emoji || '💪');
      if (CATEGORIES.includes(initialHabit.category)) {
        setCategory(initialHabit.category);
        setCustomCategory('');
      } else {
        setCategory('Custom');
        setCustomCategory(initialHabit.category);
      }
      setTargetDays(initialHabit.targetDays || 25);
    } else {
      setName('');
      setEmoji(COMMON_EMOJIS[Math.floor(Math.random() * COMMON_EMOJIS.length)]);
      setCategory('Fitness');
      setCustomCategory('');
      setTargetDays(25);
    }
    setError('');
  }, [initialHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a habit name');
      return;
    }

    const finalCategory = category === 'Custom' 
      ? (customCategory.trim() || 'General') 
      : category;

    onSave({
      id: initialHabit ? initialHabit.id : undefined,
      name: trimmed,
      emoji: emoji.trim() || '📌',
      category: finalCategory,
      targetDays: Number(targetDays) || 25,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {initialHabit ? 'Edit Habit' : 'Create New Habit'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Morning Workout, Read 20 Pages..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={40}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
          </div>

          {/* Emoji Picker */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Icon Emoji
              </label>
              <span className="text-xs text-gray-400">Pick or type</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                maxLength={4}
                className="w-14 text-center py-1.5 text-lg rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <span className="text-xs text-gray-500">Selected icon for your spreadsheet grid</span>
            </div>
            {/* Quick emoji selection grid */}
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-200 dark:border-gray-700/60 max-h-24 overflow-y-auto">
              {COMMON_EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base hover:bg-white dark:hover:bg-gray-700 transition ${
                    emoji === em ? 'bg-emerald-500/20 ring-2 ring-emerald-500' : ''
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1.5">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    category === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCategory('Custom')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  category === 'Custom'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                + Custom
              </button>
            </div>
            {category === 'Custom' && (
              <input
                type="text"
                placeholder="Enter custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            )}
          </div>

          {/* Monthly Target Days */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Monthly Target Days
              </label>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {targetDays} Days / Month
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={31}
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />

            {/* Quick target presets */}
            <div className="flex items-center justify-between gap-1.5 mt-2">
              {[15, 20, 25, 28, 30].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetDays(preset)}
                  className={`flex-1 py-1 text-xs font-mono rounded-lg border transition ${
                    targetDays === preset
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {preset}d
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{initialHabit ? 'Save Changes' : 'Add Habit'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
