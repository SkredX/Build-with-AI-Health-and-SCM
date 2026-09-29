'use client';

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'default',
}) {
  const borderColors = {
    default: 'border-govBorder',
    emerald: 'border-clinicalEmerald/40',
    rose: 'border-alertRed/40',
    amber: 'border-warningAmber/40',
    cyan: 'border-govAccent/40',
  };

  const iconColors = {
    default: 'text-govAccent',
    emerald: 'text-clinicalEmerald',
    rose: 'text-alertRed',
    amber: 'text-warningAmber',
    cyan: 'text-govAccent',
  };

  return (
    <div
      className={`enterprise-card rounded-xl p-5 border ${
        borderColors[variant] || borderColors.default
      } hover:border-govAccent/60 transition shadow-lg relative overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold font-mono text-white mt-1">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-[#0d182e] border border-govBorder ${iconColors[variant] || iconColors.default}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-mono">
          <span className={trendPositive ? 'text-clinicalEmerald font-bold' : 'text-alertRed font-bold'}>
            {trend}
          </span>
          <span className="text-slate-500">vs last cycle</span>
        </div>
      )}
    </div>
  );
}
