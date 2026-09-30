'use client';

import { Printer, X } from 'lucide-react';

export default function CMHOSitRep({ onClose, phcs = [] }) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const sampleMatrix = phcs.length > 0 ? phcs.slice(0, 6) : [
    { name: 'Sanganer PHC', ors: 32, asv: 4, amox: 95, status: 'Warning' },
    { name: 'Amber PHC', ors: 190, asv: 12, amox: 22, status: 'Warning' },
    { name: 'Chomu PHC', ors: 140, asv: 1, amox: 110, status: 'Critical' },
    { name: 'Jamwa Ramgarh PHC', ors: 210, asv: 8, amox: 140, status: 'Optimal' },
    { name: 'Phulera PHC', ors: 300, asv: 10, amox: 180, status: 'Optimal' },
    { name: 'Shahpura PHC', ors: 180, asv: 6, amox: 130, status: 'Optimal' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full p-5 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
        {/* Printable Area */}
        <div className="print-area bg-white text-slate-950 p-6 rounded-lg font-sans space-y-4 border border-slate-300 shadow">
          {/* Official Gov Banner */}
          <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
              Office of the Chief Medical and Health Officer (CMHO) • National Health Mission
            </p>
            <h2 className="text-base font-black uppercase text-slate-950">
              District Epidemic Surveillance & Supply Chain Situation Report (SITREP)
            </h2>
            <div className="flex justify-center items-center space-x-3 text-[11px] font-mono text-slate-600">
              <span>Doc ID: <strong>CMHO-NHM-2026/0929</strong></span>
              <span>•</span>
              <span>District: <strong>Jaipur Rural (Zone 04)</strong></span>
              <span>•</span>
              <span>Date: <strong>29-Sep-2026 IST</strong></span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-100 p-2 rounded border border-slate-300">
              <span className="text-[10px] text-slate-600 block">Total Active Triaged</span>
              <span className="text-base font-bold text-slate-900">42 Patients</span>
            </div>
            <div className="bg-red-50 p-2 rounded border border-red-300">
              <span className="text-[10px] text-red-700 block">Critical Referral Red Flags</span>
              <span className="text-base font-bold text-red-800">2 Cases</span>
            </div>
            <div className="bg-emerald-50 p-2 rounded border border-emerald-300">
              <span className="text-[10px] text-emerald-700 block">Stock Buffer Adequacy</span>
              <span className="text-base font-bold text-emerald-800">88.4%</span>
            </div>
          </div>

          {/* Table */}
          <div className="space-y-1 text-xs font-mono">
            <span className="font-bold text-slate-900 uppercase text-[10px]">
              Key Sector Status Summary:
            </span>
            <table className="w-full text-left border border-slate-300 text-[11px]">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700">
                <tr>
                  <th className="p-1.5">PHC Name</th>
                  <th className="p-1.5">ORS</th>
                  <th className="p-1.5">Antivenom</th>
                  <th className="p-1.5">Amoxicillin</th>
                  <th className="p-1.5">Risk Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {sampleMatrix.map((p, i) => (
                  <tr key={i}>
                    <td className="p-1.5 font-bold">{p.phc_name || p.name}</td>
                    <td className="p-1.5">{p.ors ?? 100} pkts</td>
                    <td className="p-1.5">{p.antivenom ?? p.asv ?? 4} vials</td>
                    <td className="p-1.5">{p.amoxicillin ?? p.amox ?? 80} caps</td>
                    <td className="p-1.5 font-bold">
                      {p.status === 'Critical' ? (
                        <span className="text-red-700">TIER-1 (CRITICAL)</span>
                      ) : p.status === 'Warning' ? (
                        <span className="text-amber-700">TIER-2 (WARNING)</span>
                      ) : (
                        <span className="text-emerald-700">OPTIMAL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Directives */}
          <div className="bg-amber-50 border border-amber-300 p-3 rounded text-xs space-y-1 text-slate-900">
            <span className="font-bold text-amber-900 uppercase text-[10px] flex items-center gap-1">
              CMHO Statutory Directives:
            </span>
            <p className="text-[11px] leading-relaxed">
              1. Authorize emergency lateral replenishment of 10 Polyvalent Antivenom vials from Jamwa Ramgarh to Chomu PHC.<br />
              2. Dispatch 1,000 ORS packets and IV Ringer Lactate buffers to Sanganer Rural node under Monsoon Water-Borne Alert.<br />
              3. Maintain 24x7 real-time voice logging via PHC-Connect Enterprise.
            </p>
          </div>

          {/* Signoff */}
          <div className="border-t border-slate-300 pt-3 flex justify-between items-end text-[10px] font-mono text-slate-600">
            <div>
              <p>Verification Hash: <strong className="text-slate-800">ABDM-RAJ-SITREP-4402</strong></p>
              <p className="text-[9px] text-slate-400">Generated via PHC-Connect Enterprise National Stack</p>
            </div>
            <div className="text-right">
              <p className="border-t border-slate-400 pt-1 px-4 text-slate-900 font-bold">
                Chief Medical & Health Officer
              </p>
            </div>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-plain"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-primary"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official SitRep</span>
          </button>
        </div>
      </div>
    </div>
  );
}
