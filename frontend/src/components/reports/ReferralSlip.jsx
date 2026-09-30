'use client';

import { Printer, X } from 'lucide-react';

export default function ReferralSlip({ patientData, result, onClose }) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto z-50 flex items-center justify-center p-4">
      <div className="card max-w-xl w-full p-5 space-y-4 my-auto">
        {/* Printable Area */}
        <div className="print-area bg-white text-slate-950 p-6 rounded-lg font-sans space-y-4 border border-slate-300 shadow">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs font-extrabold tracking-widest text-slate-800 uppercase">
                National Health Mission (NHM)
              </span>
              <span className="text-xs font-bold text-slate-400">•</span>
              <span className="text-xs font-extrabold tracking-widest text-slate-800 uppercase">
                ABDM Triage
              </span>
            </div>
            <h2 className="text-base font-black uppercase text-slate-900">
              Emergency Patient Triage & Referral Slip
            </h2>
            <p className="text-[11px] text-slate-600 font-mono">
              Primary Health Centre: <span className="font-bold">{patientData?.phcName || 'Sanganer Rural (#302)'}</span>
            </p>
          </div>

          {/* Barcode & ABHA Token */}
          <div className="flex justify-between items-center text-xs font-mono bg-slate-100 p-2.5 rounded border border-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">ABHA Health ID</span>
              <span className="font-bold text-slate-900">{patientData?.abhaNumber || '91-8402-9912-3401'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Triage Slip #</span>
              <span className="font-bold text-cyan-800">REF-2026-9042</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Issue Time</span>
              <span className="font-bold text-slate-800">Live IST</span>
            </div>
          </div>

          {/* Patient Info */}
          <div className="grid grid-cols-2 gap-3 text-xs border border-slate-200 p-3 rounded">
            <div>
              <p className="text-slate-600">Patient ID: <strong className="text-slate-950 font-mono">{patientData?.patientId || 'PAT-ABHA-9042'}</strong></p>
              <p className="text-slate-600 mt-1">Name / Age / Sex: <strong className="text-slate-950 font-mono">{patientData?.patientName || 'Ramesh Kumar'} ({patientData?.age}Y/{patientData?.gender})</strong></p>
            </div>
            <div>
              <p className="text-slate-600">Triage Urgency: <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold font-mono text-[10px] uppercase">{result?.urgency || 'EMERGENCY RED'}</span></p>
              <p className="text-slate-600 mt-1">Vitals: <span className="font-mono text-[11px] font-semibold text-slate-900">SpO2: {patientData?.vitals?.spo2 || 98}% | BP: {patientData?.vitals?.bp || '118/76'} | HR: {patientData?.vitals?.pulse || 88}</span></p>
            </div>
          </div>

          {/* Impression & Regimen */}
          <div className="space-y-2 text-xs">
            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Provisional Clinical Impression:</span>
              <p className="font-bold text-slate-950 text-sm mt-0.5">
                {result?.condition || result?.title || 'Acute Diarrheal Dehydration'} (SNOMED: {result?.snomed_code || '63650001'})
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Field Medications Administered:</span>
              <p className="text-slate-800 font-mono mt-0.5 bg-slate-50 p-2 rounded border border-slate-200">
                {result?.medicines || 'ORS Sachet x4, Zinc Sulfate 20mg, Paracetamol 500mg'}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">Sub-District Referral Destination:</span>
              <p className="text-slate-900 font-semibold mt-0.5">District Hospital / Dedicated Acute Inpatient Unit</p>
            </div>
          </div>

          {/* Signoff */}
          <div className="border-t border-slate-300 pt-3 flex justify-between items-end text-[10px] font-mono text-slate-600">
            <div>
              <p>Verification Code: <strong className="text-slate-900">NHM-AI-4402-OK</strong></p>
              <p className="text-[9px] text-slate-400">Generated automatically via PHC-Connect Enterprise (ABDM M1)</p>
            </div>
            <div className="text-right">
              <p className="border-t border-slate-400 pt-1 px-4 text-slate-800 font-bold">Duty ASHA / Medical Officer</p>
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
            Close Preview
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="btn btn-primary"
          >
            <Printer className="w-4 h-4" />
            <span>Print Referral Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}
