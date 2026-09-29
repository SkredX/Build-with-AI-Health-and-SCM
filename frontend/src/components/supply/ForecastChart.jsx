'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ForecastChart() {
  const [filter, setFilter] = useState('all');

  const chartDataMap = {
    all: [
      { day: 'Day -5', demand: 12, threshold: 50 },
      { day: 'Day -4', demand: 16, threshold: 50 },
      { day: 'Day -3', demand: 22, threshold: 50 },
      { day: 'Day -2', demand: 35, threshold: 50 },
      { day: 'Yesterday', demand: 54, threshold: 50 },
      { day: 'Today (Live)', demand: 88, threshold: 50 },
      { day: 'Day +1 (AI)', demand: 120, threshold: 50 },
      { day: 'Day +2 (AI)', demand: 155, threshold: 50 },
    ],
    ors: [
      { day: 'Day -5', demand: 14, threshold: 40 },
      { day: 'Day -4', demand: 20, threshold: 40 },
      { day: 'Day -3', demand: 32, threshold: 40 },
      { day: 'Day -2', demand: 70, threshold: 40 },
      { day: 'Yesterday', demand: 140, threshold: 40 },
      { day: 'Today (Live)', demand: 220, threshold: 40 },
      { day: 'Day +1 (AI)', demand: 280, threshold: 40 },
      { day: 'Day +2 (AI)', demand: 340, threshold: 40 },
    ],
    asv: [
      { day: 'Day -5', demand: 1, threshold: 5 },
      { day: 'Day -4', demand: 2, threshold: 5 },
      { day: 'Day -3', demand: 2, threshold: 5 },
      { day: 'Day -2', demand: 5, threshold: 5 },
      { day: 'Yesterday', demand: 8, threshold: 5 },
      { day: 'Today (Live)', demand: 14, threshold: 5 },
      { day: 'Day +1 (AI)', demand: 18, threshold: 5 },
      { day: 'Day +2 (AI)', demand: 22, threshold: 5 },
    ],
    amox: [
      { day: 'Day -5', demand: 30, threshold: 60 },
      { day: 'Day -4', demand: 45, threshold: 60 },
      { day: 'Day -3', demand: 60, threshold: 60 },
      { day: 'Day -2', demand: 80, threshold: 60 },
      { day: 'Yesterday', demand: 110, threshold: 60 },
      { day: 'Today (Live)', demand: 165, threshold: 60 },
      { day: 'Day +1 (AI)', demand: 210, threshold: 60 },
      { day: 'Day +2 (AI)', demand: 245, threshold: 60 },
    ],
  };

  const activeData = chartDataMap[filter] || chartDataMap.all;

  return (
    <div className="enterprise-card rounded-xl p-5 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-govBorder pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-govAccent" />
            Epidemic Velocity & 7-Day Demand Forecast
          </h3>
          <p className="text-[11px] font-mono text-cyan-400">
            Powered by Time-Series Exponential Trend Engine
          </p>
        </div>

        <div className="flex space-x-1 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2 py-0.5 rounded transition ${
              filter === 'all'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'bg-[#0d182e] text-slate-300 hover:text-white border border-govBorder'
            }`}
          >
            All Syndromes
          </button>
          <button
            type="button"
            onClick={() => setFilter('ors')}
            className={`px-2 py-0.5 rounded transition ${
              filter === 'ors'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'bg-[#0d182e] text-slate-300 hover:text-white border border-govBorder'
            }`}
          >
            ORS / Cholera
          </button>
          <button
            type="button"
            onClick={() => setFilter('asv')}
            className={`px-2 py-0.5 rounded transition ${
              filter === 'asv'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'bg-[#0d182e] text-slate-300 hover:text-white border border-govBorder'
            }`}
          >
            Antivenom (ASV)
          </button>
          <button
            type="button"
            onClick={() => setFilter('amox')}
            className={`px-2 py-0.5 rounded transition ${
              filter === 'amox'
                ? 'bg-cyan-600 text-slate-950 font-bold'
                : 'bg-[#0d182e] text-slate-300 hover:text-white border border-govBorder'
            }`}
          >
            Amoxicillin
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3b5c" opacity={0.4} />
            <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1c2541',
                borderColor: '#2a3b5c',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '11px',
                fontFamily: 'JetBrains Mono',
                paddingTop: '10px',
              }}
            />
            <Line
              type="monotone"
              dataKey="demand"
              name="Outbreak Velocity / Demand (Units)"
              stroke="#00b4d8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#00b4d8' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="threshold"
              name="Safety Buffer Threshold"
              stroke="#f59e0b"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
