'use client';

import { AlertOctagon, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AlertBanner({
  title = 'CRITICAL STOCKOUT RISK DETECTED',
  message = '380% Spike in Acute Diarrheal Outbreak in Sanganer Sector within 24h. Stock exhaustion predicted in 6 hours.',
  onAction,
  actionLabel = 'Dispatch Emergency Buffer PO',
}) {
  return (
    <div className="rounded-xl p-4 bg-gradient-to-r from-rose-950/80 via-red-900/60 to-[#1c2541] border border-rose-500/50 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center space-x-3.5">
        <div className="w-10 h-10 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl flex-shrink-0 status-pulse-rose">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
              District Early Warning
            </span>
            <span className="text-[11px] font-mono text-slate-400">IDSP Priority Node</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">{title}</h4>
          <p className="text-xs text-rose-200/80 mt-0.5 max-w-2xl">{message}</p>
        </div>
      </div>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase font-mono tracking-wider flex items-center gap-1.5 shadow-lg transition flex-shrink-0 active:scale-95"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{actionLabel}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      )}
    </div>
  );
}
