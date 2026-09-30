'use client';

import { STATUS_CONFIG } from '@/lib/constants';

// Status is never conveyed by color alone: a dot plus a text label.
export default function StatusBadge({ status = 'Operational', className = '' }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.Operational;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
