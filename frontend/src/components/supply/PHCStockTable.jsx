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
    <div className="enterprise-card rounded-xl p-5 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-govBorder pb-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
            Primary Health Centre Inventory Matrix
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Showing {filtered.length} nodes across district network
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search PHC or district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d182e] border border-govBorder rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-govAccent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d182e] border border-govBorder rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-govAccent"
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
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#0d182e] text-slate-400 border-b border-govBorder uppercase text-[10px]">
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
          <tbody className="divide-y divide-govBorder text-slate-300">
            {filtered.length > 0 ? (
              filtered.map((phc, idx) => (
                <tr key={phc.phc_id || idx} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-bold text-white">
                    {phc.phc_name || phc.name}
                  </td>
                  <td className="p-3 text-slate-400 text-[11px]">
                    {phc.district || 'Jaipur'}, {phc.state || 'Rajasthan'}
                  </td>
                  <td className={`p-3 ${(phc.paracetamol ?? 50) < 20 ? 'text-amber-400 font-bold' : ''}`}>
                    {phc.paracetamol ?? 50} units
                  </td>
                  <td className={`p-3 ${(phc.ors ?? 100) < 25 ? 'text-rose-400 font-bold' : ''}`}>
                    {phc.ors ?? 100} pkts
                  </td>
                  <td className={`p-3 ${(phc.amoxicillin ?? 80) < 30 ? 'text-amber-400 font-bold' : ''}`}>
                    {phc.amoxicillin ?? 80} caps
                  </td>
                  <td className={`p-3 ${(phc.antivenom ?? 4) < 2 ? 'text-rose-400 font-bold animate-pulse' : ''}`}>
                    {phc.antivenom ?? 4} vials
                  </td>
                  <td className="p-3">
                    <StatusBadge status={phc.status || 'Optimal'} />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => onQuickTransfer && onQuickTransfer(phc)}
                      className="px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center gap-1 ml-auto transition"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      <span>Transfer</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
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
