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
    success: <CheckCircle className="w-4 h-4 text-clinicalEmerald flex-shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-warningAmber flex-shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-alertRed flex-shrink-0" />,
    info: <Info className="w-4 h-4 text-govAccent flex-shrink-0" />,
  };

  const borders = {
    success: 'border-clinicalEmerald/40',
    warning: 'border-warningAmber/40',
    error: 'border-alertRed/40',
    info: 'border-govAccent/40',
  };

  return (
    <div
      className={`enterprise-card p-3 rounded-lg border ${
        borders[type] || borders.info
      } shadow-2xl text-xs text-white flex items-center justify-between gap-3 font-mono transition-all animate-fade-in`}
    >
      <div className="flex items-center gap-2">
        {icons[type]}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-slate-400 hover:text-white transition">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
