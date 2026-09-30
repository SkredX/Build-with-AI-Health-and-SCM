'use client';

import { useState } from 'react';
import StatusBadge from '@/components/common/StatusBadge';
import { ArrowLeftRight, Search } from 'lucide-react';

export default function PHCStockTable({ phcs = [], onQuickTransfer }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = phcs.filter((p) => {
    const matchName =
      (p.phc_name || p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.district || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchName && matchStatus;
  });

  return (
    <div className="enterprise-card rounded-2xl p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-line pb-3">
        <div>
          <h3 className="text-sm font-semibold text-ink  tabular-nums ">
            Stock by health centre
          </h3>
          <p className="text-xs text-ink-2 tabular-nums">
            {filtered.length} health centres
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search PHC or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field !pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="field"
          >
            <option value="ALL">All Status</option>
            <option value="Critical">Critical Only</option>
            <option value="Warning">Warning Only</option>
            <option value="Optimal">Optimal Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs tabular-nums">
          <thead className="bg-fill text-ink-2 border-b border-line  text-xs">
            <tr>
              <th className="p-3">Health Centre</th>
              <th className="p-3">District / State</th>
              <th className="p-3">Paracetamol</th>
              <th className="p-3">ORS Packets</th>
              <th className="p-3">Amoxicillin</th>
              <th className="p-3">Antivenom (ASV)</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-2">
            {filtered.length > 0 ? (
              filtered.map((phc, idx) => (
                <tr key={phc.phc_id || idx} className="hover:bg-fill transition">
                  <td className="p-3 font-semibold text-ink">
                    {phc.phc_name || phc.name}
                  </td>
                  <td className="p-3 text-ink-2 text-xs">
                    {phc.district || 'Jaipur'}, {phc.state || 'Rajasthan'}
                  </td>
                  <td className={`p-3 ${(phc.paracetamol ?? 50) < 20 ? 'text-warn font-semibold' : ''}`}>
                    {phc.paracetamol ?? 50} units
                  </td>
                  <td className={`p-3 ${(phc.ors ?? 100) < 25 ? 'text-bad font-semibold' : ''}`}>
                    {phc.ors ?? 100} pkts
                  </td>
                  <td className={`p-3 ${(phc.amoxicillin ?? 80) < 30 ? 'text-warn font-semibold' : ''}`}>
                    {phc.amoxicillin ?? 80} caps
                  </td>
                  <td className={`p-3 ${(phc.antivenom ?? 4) < 2 ? 'text-bad font-semibold animate-pulse' : ''}`}>
                    {phc.antivenom ?? 4} vials
                  </td>
                  <td className="p-3">
                    <StatusBadge status={phc.status || 'Optimal'} />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onQuickTransfer && onQuickTransfer(phc)}
                      className="px-2 py-1 rounded bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 text-xs font-semibold flex items-center gap-1 ml-auto transition"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Transfer</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-ink-3">
                  No PHC nodes found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
