'use client';

import { useState } from 'react';
import { ShieldCheck, Download, Search, Eye, X } from 'lucide-react';
import { downloadCSV } from '@/lib/utils';
import Toast from '@/components/common/Toast';

export default function AuditPage() {
  const [toastMsg, setToastMsg] = useState(null);
  const [search, setSearch] = useState('');
  const [phcFilter, setPhcFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const [logs, setLogs] = useState([
    {
      time: '17:42:10 IST',
      id: 'PAT-ABHA-9038',
      abha: '91-8402-9912-3401',
      phc: 'Amber PHC',
      type: 'Voice Memo',
      diagnosis: 'Acute Bronchitis',
      urgency: 'URGENT YELLOW',
      conf: '96.2%',
      snomed: '10509002',
      meds: 'Amoxicillin 500mg, Salbutamol',
    },
    {
      time: '16:15:04 IST',
      id: 'PAT-ABHA-9031',
      abha: '14-2391-7784-9021',
      phc: 'Chomu PHC',
      type: 'Rx Vision OCR',
      diagnosis: "Russell's Viper Snakebite",
      urgency: 'CRITICAL EMERGENCY',
      conf: '99.1%',
      snomed: '242635008',
      meds: 'Polyvalent ASV x10 vials, Normal Saline',
    },
    {
      time: '14:28:44 IST',
      id: 'PAT-ABHA-9022',
      abha: '91-8402-9912-3401',
      phc: 'Sanganer PHC',
      type: 'Voice Memo',
      diagnosis: 'Acute Dehydrating Diarrhea (Cholera)',
      urgency: 'EMERGENCY RED',
      conf: '98.4%',
      snomed: '63650001',
      meds: 'ORS x8, Zinc Sulfate 20mg',
    },
    {
      time: '12:10:15 IST',
      id: 'PAT-ABHA-9015',
      abha: '32-9011-4421-1200',
      phc: 'Phulera PHC',
      type: 'Clinical Notes',
      diagnosis: 'Suspected Dengue Fever',
      urgency: 'URGENT YELLOW',
      conf: '94.8%',
      snomed: '38362002',
      meds: 'Paracetamol 650mg, Oral Fluids',
    },
    {
      time: '10:05:22 IST',
      id: 'PAT-ABHA-9008',
      abha: '91-8402-9912-3401',
      phc: 'Jamwa Ramgarh PHC',
      type: 'Voice Memo',
      diagnosis: 'Acute Upper Respiratory Tract Infection',
      urgency: 'ROUTINE',
      conf: '97.0%',
      snomed: '54150009',
      meds: 'Paracetamol 500mg, Cetirizine 10mg',
    },
  ]);

  const filteredLogs = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      log.id.toLowerCase().includes(q) ||
      log.abha.includes(q) ||
      log.diagnosis.toLowerCase().includes(q) ||
      log.meds.toLowerCase().includes(q);

    const matchesPhc = !phcFilter || log.phc === phcFilter;
    const matchesUrg = !urgencyFilter || log.urgency.includes(urgencyFilter);

    return matchesSearch && matchesPhc && matchesUrg;
  });

  const handleExportCSV = () => {
    let csv = 'Timestamp,PatientID,ABHA_ID,PHCLocation,InputType,Diagnosis,Urgency,Confidence,SNOMED,Medications\n';
    logs.forEach((l) => {
      csv += `${l.time},${l.id},${l.abha},${l.phc},${l.type},"${l.diagnosis}",${l.urgency},${l.conf},${l.snomed},"${l.meds}"\n`;
    });
    downloadCSV(csv, `PHC_Connect_District_Audit_${Date.now()}.csv`);
    setToastMsg({ text: 'Exported verified District Audit Trail (.csv)', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
          <Toast message={toastMsg.text} type={toastMsg.type} onClose={() => setToastMsg(null)} />
        </div>
      )}

      {/* Header */}
      <div className="enterprise-card rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-govBorder pb-4">
          <div>
            <h2 className="text-base font-bold text-white uppercase font-mono flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-govAccent" />
              Immutable District Clinical & Stock Audit Trail
            </h2>
            <p className="text-xs text-slate-400">
              Verifiable chronological ledger linked to ABDM ABHA registries and NHM stock auto-deductions.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 font-mono transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Patient ID, ABHA, Diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0d182e] border border-govBorder rounded-lg pl-8 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-govAccent"
            />
          </div>

          <div>
            <select
              value={phcFilter}
              onChange={(e) => setPhcFilter(e.target.value)}
              className="w-full bg-[#0d182e] border border-govBorder rounded-lg px-3 py-2 text-white focus:outline-none focus:border-govAccent"
            >
              <option value="">All Health Centres (6 PHCs)</option>
              <option value="Sanganer PHC">Sanganer PHC</option>
              <option value="Amber PHC">Amber PHC</option>
              <option value="Chomu PHC">Chomu PHC</option>
              <option value="Jamwa Ramgarh PHC">Jamwa Ramgarh PHC</option>
              <option value="Phulera PHC">Phulera PHC</option>
            </select>
          </div>

          <div>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full bg-[#0d182e] border border-govBorder rounded-lg px-3 py-2 text-white focus:outline-none focus:border-govAccent"
            >
              <option value="">All Urgency Levels</option>
              <option value="EMERGENCY">Emergency / Critical</option>
              <option value="URGENT">Urgent (Yellow)</option>
              <option value="ROUTINE">Routine (Green)</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0d182e] text-slate-400 border-b border-govBorder uppercase text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Patient / ABHA ID</th>
                <th className="p-3">PHC Location</th>
                <th className="p-3">Input Mode</th>
                <th className="p-3">Diagnosis (SNOMED)</th>
                <th className="p-3">Urgency</th>
                <th className="p-3">Confidence</th>
                <th className="p-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-govBorder text-slate-300">
              {filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 text-slate-400">{log.time}</td>
                  <td className="p-3">
                    <span className="font-bold text-cyan-400">{log.id}</span>
                    <span className="block text-[10px] text-teal-300">ABHA: {log.abha}</span>
                  </td>
                  <td className="p-3 font-semibold text-white">{log.phc}</td>
                  <td className="p-3 text-slate-300">{log.type}</td>
                  <td className="p-3 font-bold text-white">
                    {log.diagnosis} <span className="text-[10px] text-slate-400 font-normal">({log.snomed})</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-bold ${
                        log.urgency.includes('EMERGENCY') || log.urgency.includes('CRITICAL')
                          ? 'text-rose-400'
                          : log.urgency.includes('URGENT')
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {log.urgency}
                    </span>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">{log.conf}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedEntry(log)}
                      className="text-cyan-400 hover:text-cyan-300 underline font-bold"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card max-w-lg w-full rounded-xl p-5 space-y-4 border border-govBorder shadow-2xl font-mono text-xs">
            <div className="flex justify-between items-center border-b border-govBorder pb-2">
              <h3 className="font-bold text-white uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-govAccent" />
                Audit Entry Telemetry (ABDM M2)
              </h3>
              <button onClick={() => setSelectedEntry(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2 bg-[#0d182e] p-3 rounded border border-govBorder">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Patient Reference</span>
                  <p className="font-bold text-cyan-400">{selectedEntry.id}</p>
                  <p className="text-[10px] text-teal-300">ABHA: {selectedEntry.abha}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Timestamp</span>
                  <p className="text-slate-300">{selectedEntry.time}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Health Centre</span>
                  <p className="text-white font-bold">{selectedEntry.phc}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Urgency</span>
                  <p className="font-bold text-rose-400">{selectedEntry.urgency}</p>
                </div>
              </div>

              <div className="bg-[#0d182e] p-3 rounded border border-govBorder space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Provisional Diagnosis</span>
                <p className="text-white font-bold">{selectedEntry.diagnosis}</p>
                <p className="text-[11px] text-cyan-400">SNOMED-CT Code: {selectedEntry.snomed}</p>
              </div>

              <div className="bg-[#0d182e] p-3 rounded border border-govBorder space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Prescribed Regimen</span>
                <p className="text-slate-200">{selectedEntry.meds}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-govBorder">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded bg-cyan-600 text-slate-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
