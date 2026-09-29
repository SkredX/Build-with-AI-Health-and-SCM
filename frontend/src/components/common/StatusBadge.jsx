'use client';

import { STATUS_CONFIG } from '@/lib/constants';

export default function StatusBadge({ status = 'Operational', className = '' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Operational;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'Critical' ? 'animate-ping' : ''}`} />
      {status.toUpperCase()}
    </span>
  );
}
