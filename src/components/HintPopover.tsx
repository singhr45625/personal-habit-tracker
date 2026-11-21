import React, { useEffect } from 'react';
import { HintContent } from '../types';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Calculator, 
  Lightbulb, 
  CheckCircle2, 
  Power 
} from 'lucide-react';

interface HintPopoverProps {
  currentHint: HintContent | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleHintsOff: () => void;
  currentIndex: number;
  totalHints: number;
}

export const HintPopover: React.FC<HintPopoverProps> = ({
  currentHint,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onToggleHintsOff,
  currentIndex,
  totalHints,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !currentHint) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalHints - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in pointer-events-auto">
      <div 
        className="bg-white dark:bg-[#111827] rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-500/50 shadow-2xl w-full max-w-lg overflow-hidden animate-pop text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip with Step Badge */}
        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 border-b border-emerald-100 dark:border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-sm font-bold">
              {currentHint.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                  Feature Guide • Tip {currentIndex + 1} of {totalHints}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1">
                {currentHint.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition"
            title="Close hint (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popover Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Section 1: What It Does */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>What That Feature Does</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
              {currentHint.whatItDoes}
            </p>
          </div>

          {/* Section 2: How It Is Calculated */}
          <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
              <Calculator className="w-3.5 h-3.5 text-blue-500" />
              <span>How It Is Calculated or Used</span>
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line font-mono bg-white dark:bg-gray-900/80 p-2.5 rounded-xl border border-gray-200/80 dark:border-gray-700/80">
              {currentHint.howItCalculates}
            </div>
          </div>

          {/* Section 3: Pro Tips */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Pro Tip to Get the Most Out of It</span>
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
              {currentHint.proTip}
            </p>
          </div>

        </div>

        {/* Footer Actions & Tour Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2 flex-wrap">
          
          {/* Turn Hints Off Quick Link */}
          <button
            onClick={onToggleHintsOff}
            className="text-[11px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1 transition"
            title="Disable floating hints"
          >
            <Power className="w-3 h-3 text-gray-400" />
            <span>Turn Hints Off</span>
          </button>

          {/* Previous / Next Tour Navigation */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-1 active:scale-95"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            {isLast ? (
              <button
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Got it! Complete Tour</span>
              </button>
            ) : (
              <button
                onClick={onNext}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <span>Next Tip</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
