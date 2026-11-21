import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'error';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500 shrink-0" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'error':
        return 'border-rose-500/40 bg-white dark:bg-gray-900';
      case 'info':
        return 'border-blue-500/40 bg-white dark:bg-gray-900';
      default:
        return 'border-emerald-500/40 bg-white dark:bg-gray-900';
    }
  };

  return (
    <div
      className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs text-gray-800 dark:text-gray-100 animate-pop transition-all ${getBorderColor()}`}
    >
      <div className="flex items-center gap-2.5">
        {getIcon()}
        <span className="font-medium">{toast.text}</span>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
