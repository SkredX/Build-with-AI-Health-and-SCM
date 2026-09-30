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

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Audit Log</h1>
          <p className="text-ink-2 mt-1 max-w-2xl">A record of every triage decision and stock change.</p>
        </div>
        <button type="button" onClick={handleExportCSV} className="btn btn-quiet">
          <Download className="w-4 h-4" aria-hidden="true" /> Export CSV
        </button>
      </header>

      <div className="card p-5 space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs tabular-nums">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-3 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search Patient ID, ABHA, Diagnosis..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field !pl-9"
            />
          </div>

          <div>
            <select
              value={phcFilter}
              onChange={(e) => setPhcFilter(e.target.value)}
              className="field"
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
              className="field"
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
          <table className="w-full text-left text-xs tabular-nums">
            <thead className="bg-fill text-ink-2 border-b border-line  text-xs">
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
            <tbody className="divide-y divide-line text-ink-2">
              {filteredLogs.map((log, index) => (
                <tr key={index} className="hover:bg-fill transition">
                  <td className="p-3 text-ink-2">{log.time}</td>
                  <td className="p-3">
                    <span className="font-semibold text-accent">{log.id}</span>
                    <span className="block text-xs text-accent">ABHA: {log.abha}</span>
                  </td>
                  <td className="p-3 font-semibold text-ink">{log.phc}</td>
                  <td className="p-3 text-ink-2">{log.type}</td>
                  <td className="p-3 font-semibold text-ink">
                    {log.diagnosis} <span className="text-xs text-ink-2 font-normal">({log.snomed})</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold ${
                        log.urgency.includes('EMERGENCY') || log.urgency.includes('CRITICAL')
                          ? 'text-bad'
                          : log.urgency.includes('URGENT')
                          ? 'text-warn'
                          : 'text-ok'
                      }`}
                    >
                      {log.urgency}
                    </span>
                  </td>
                  <td className="p-3 text-ok font-semibold">{log.conf}</td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedEntry(log)}
                      className="text-accent hover:text-accent underline font-semibold"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card max-w-lg w-full rounded-2xl p-5 space-y-4 border border-line shadow-none tabular-nums text-xs">
            <div className="flex justify-between items-center border-b border-line pb-2">
              <h3 className="font-semibold text-ink  flex items-center gap-2">
                <Eye className="w-4 h-4 text-accent" />
                Audit Entry Telemetry (ABDM M2)
              </h3>
              <button onClick={() => setSelectedEntry(null)} className="text-ink-2 hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2 bg-fill p-3 rounded border border-line">
                <div>
                  <span className="text-ink-3 text-xs ">Patient Reference</span>
                  <p className="font-semibold text-accent">{selectedEntry.id}</p>
                  <p className="text-xs text-accent">ABHA: {selectedEntry.abha}</p>
                </div>
                <div>
                  <span className="text-ink-3 text-xs ">Timestamp</span>
                  <p className="text-ink-2">{selectedEntry.time}</p>
                </div>
                <div>
                  <span className="text-ink-3 text-xs ">Health Centre</span>
                  <p className="text-ink font-semibold">{selectedEntry.phc}</p>
                </div>
                <div>
                  <span className="text-ink-3 text-xs ">Urgency</span>
                  <p className="font-semibold text-bad">{selectedEntry.urgency}</p>
                </div>
              </div>

              <div className="bg-fill p-3 rounded border border-line space-y-1">
                <span className="text-ink-3 text-xs ">Provisional Diagnosis</span>
                <p className="text-ink font-semibold">{selectedEntry.diagnosis}</p>
                <p className="text-xs text-accent">SNOMED-CT Code: {selectedEntry.snomed}</p>
              </div>

              <div className="bg-fill p-3 rounded border border-line space-y-1">
                <span className="text-ink-3 text-xs ">Prescribed Regimen</span>
                <p className="text-ink">{selectedEntry.meds}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded bg-accent-fill text-white font-semibold text-xs"
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
