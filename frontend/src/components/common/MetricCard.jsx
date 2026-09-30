'use client';

const TONE = { default: 'text-ink', ok: 'text-ok', bad: 'text-bad', warn: 'text-warn' };

// One number, one label, one plain-language note.
export default function MetricCard({ title, value, subtitle, icon: Icon, note, tone = 'default' }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink-2">{title}</p>
        {Icon && <Icon className="w-5 h-5 text-ink-3" aria-hidden="true" />}
      </div>
      <p className={`text-3xl font-semibold tabular-nums mt-2 ${TONE[tone] || TONE.default}`}>{value}</p>
      {subtitle && <p className="text-sm text-ink-2 mt-1">{subtitle}</p>}
      {note && <p className={`text-sm mt-3 ${TONE[tone] || 'text-ink-2'}`}>{note}</p>}
    </div>
  );
}
