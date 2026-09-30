'use client';

import { AlertOctagon, ArrowRight } from 'lucide-react';

export default function AlertBanner({
  title = 'Stock-out risk detected',
  message = '380% spike in acute diarrhoeal cases in Sanganer within 24 hours. ORS stock is predicted to run out in about 6 hours.',
  onAction,
  actionLabel = 'Dispatch emergency buffer',
}) {
  return (
    <div role="alert" className="rounded-2xl p-4 bg-bad/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <AlertOctagon className="w-6 h-6 text-bad shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <h4 className="font-semibold text-ink">{title}</h4>
          <p className="text-sm text-ink-2 mt-0.5 max-w-2xl">{message}</p>
        </div>
      </div>
      {onAction && (
        <button type="button" onClick={onAction} className="btn btn-primary shrink-0" style={{ background: '#d70015' }}>
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
