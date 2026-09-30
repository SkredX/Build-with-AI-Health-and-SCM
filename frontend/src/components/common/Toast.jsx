'use client';

import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-ok flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-warn flex-shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-bad flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-accent flex-shrink-0" />,
  };

  const borders = {
    success: 'border-ok/40',
    warning: 'border-warn/40',
    error: 'border-bad/40',
    info: 'border-accent/40',
  };

  return (
    <div
      className={`enterprise-card p-3 rounded-lg border ${
        borders[type] || borders.info
      } shadow-none text-xs text-ink flex items-center justify-between gap-3 tabular-nums transition-all animate-fade-in`}
    >
      <div className="flex items-center gap-2">
        {icons[type]}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-ink-2 hover:text-ink transition">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
