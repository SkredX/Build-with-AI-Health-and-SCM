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
    <div className="enterprise-card rounded-2xl p-5 space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-line pb-3">
        <div>
          <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            7-day demand forecast
          </h3>
          <p className="text-sm text-ink-2">
            Expected demand against safety stock level
          </p>
        </div>

        <div className="flex flex-wrap gap-0.5 bg-fill p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('ors')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === 'ors'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            ORS
          </button>
          <button
            type="button"
            onClick={() => setFilter('asv')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === 'asv'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-2 hover:text-ink'
            }`}
          >
            Antivenom
          </button>
          <button
            type="button"
            onClick={() => setFilter('amox')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              filter === 'amox'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-2 hover:text-ink'
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
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--c-line))" />
            <XAxis dataKey="day" stroke="rgb(var(--c-line))" tick={{ fontSize: 12, fill: 'rgb(var(--c-ink-2))' }} />
            <YAxis stroke="rgb(var(--c-line))" tick={{ fontSize: 12, fill: 'rgb(var(--c-ink-2))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(var(--c-surface))',
                borderColor: 'rgb(var(--c-line))',
                borderRadius: '8px',
                color: 'rgb(var(--c-ink))',
                fontSize: '13px',
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: '13px',
                paddingTop: '10px',
              }}
            />
            <Line
              type="monotone"
              dataKey="demand"
              name="Expected demand"
              stroke="rgb(var(--c-accent))"
              strokeWidth={2.5}
              dot={{ r: 4, fill: 'rgb(var(--c-accent))' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="threshold"
              name="Safety stock"
              stroke="rgb(var(--c-warn))"
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
