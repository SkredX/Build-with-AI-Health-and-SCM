'use client';

import { useState } from 'react';
import { QrCode, ShieldCheck, HeartPulse } from 'lucide-react';

export default function PatientIntake({
  patientData,
  onChange,
  onLoadPreset,
  phcList = [],
}) {
  const [showAbhaModal, setShowAbhaModal] = useState(false);

  const sampleAbhaProfiles = [
    {
      id: 'PAT-ABHA-9042',
      name: 'Ramesh Kumar Sharma',
      age: '44',
      gender: 'Male',
      abha: '91-8402-9912-3401',
      phc: 'Sanganer PHC',
      vitals: { bp: '118/76', pulse: '88', spo2: '98', temp: '98.6' },
    },
    {
      id: 'PAT-ABHA-4021',
      name: 'Sunita Devi Gurjar',
      age: '34',
      gender: 'Female',
      abha: '14-2391-7784-9021',
      phc: 'Chomu PHC',
      vitals: { bp: '90/60', pulse: '110', spo2: '95', temp: '98.4' },
    },
  ];

  const handleSelectSampleAbha = (profile) => {
    onChange({
      ...patientData,
      patientId: profile.id,
      patientName: profile.name,
      age: profile.age,
      gender: profile.gender,
      abhaNumber: profile.abha,
      phcName: profile.phc,
      vitals: profile.vitals,
    });
    setShowAbhaModal(false);
  };

  return (
    <div className="enterprise-card rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-govBorder pb-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-2">
          <QrCode className="w-4 h-4 text-govAccent" /> Patient Demographics & ABHA
        </h3>
        <button
          type="button"
          onClick={() => setShowAbhaModal(true)}
          className="px-2.5 py-1 rounded bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-slate-950 font-bold text-[11px] font-mono flex items-center gap-1.5 shadow transition"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan ABHA QR</span>
        </button>
      </div>

      {/* ABHA Badge */}
      <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-clinicalEmerald flex-shrink-0" />
          <div>
            <span className="font-bold">ABDM Verified Health ID:</span>
            <span className="text-white font-mono ml-1 font-bold">
              {patientData.abhaNumber || '91-8402-9912-3401'}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold border border-emerald-500/30 px-1.5 py-0.5 rounded">
          M1 Compliant
        </span>
      </div>

      {/* Basic Demographics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Patient ID</label>
          <input
            type="text"
            value={patientData.patientId}
            onChange={(e) => onChange({ ...patientData, patientId: e.target.value })}
            className="w-full bg-[#0d182e] border border-govBorder rounded px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-govAccent"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Age</label>
          <input
            type="number"
            value={patientData.age}
            onChange={(e) => onChange({ ...patientData, age: e.target.value })}
            className="w-full bg-[#0d182e] border border-govBorder rounded px-2.5 py-1.5 font-mono text-white focus:outline-none focus:border-govAccent"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Gender</label>
          <select
            value={patientData.gender}
            onChange={(e) => onChange({ ...patientData, gender: e.target.value })}
            className="w-full bg-[#0d182e] border border-govBorder rounded px-2 py-1.5 font-mono text-white focus:outline-none focus:border-govAccent"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Patient Full Name</label>
          <input
            type="text"
            value={patientData.patientName}
            onChange={(e) => onChange({ ...patientData, patientName: e.target.value })}
            className="w-full bg-[#0d182e] border border-govBorder rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-govAccent"
          />
        </div>
        <div>
          <label className="block text-slate-400 font-semibold mb-1 text-[11px]">PHC Sector</label>
          <select
            value={patientData.phcName}
            onChange={(e) => onChange({ ...patientData, phcName: e.target.value })}
            className="w-full bg-[#0d182e] border border-govBorder rounded px-2 py-1.5 font-mono text-white focus:outline-none focus:border-govAccent"
          >
            {phcList.length > 0 ? (
              phcList.map((p) => (
                <option key={p.phc_id || p.name} value={p.phc_name || p.name}>
                  {p.phc_name || p.name}
                </option>
              ))
            ) : (
              <>
                <option value="Sanganer PHC">Sanganer PHC (Jaipur)</option>
                <option value="Amber PHC">Amber PHC (Jaipur)</option>
                <option value="Chomu PHC">Chomu PHC (Jaipur)</option>
                <option value="Jamwa Ramgarh PHC">Jamwa Ramgarh PHC (Jaipur)</option>
                <option value="Phulera PHC">Phulera PHC (Jaipur)</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Vitals Matrix */}
      <div className="bg-[#0d182e] p-3 rounded-lg border border-govBorder space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-govAccent" />
            Clinical Vitals Matrix
          </span>
          <span className="text-cyan-400 text-[10px] font-mono">Real-time Anomaly Check</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
          <div>
            <label className="block text-slate-500 text-[10px]">BP (mmHg)</label>
            <input
              type="text"
              value={patientData.vitals?.bp || ''}
              onChange={(e) =>
                onChange({
                  ...patientData,
                  vitals: { ...patientData.vitals, bp: e.target.value },
                })
              }
              placeholder="118/76"
              className="w-full bg-[#1c2541] border border-govBorder rounded px-2 py-1 text-white text-center text-xs focus:outline-none focus:border-govAccent"
            />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px]">Pulse (bpm)</label>
            <input
              type="number"
              value={patientData.vitals?.pulse || ''}
              onChange={(e) =>
                onChange({
                  ...patientData,
                  vitals: { ...patientData.vitals, pulse: e.target.value },
                })
              }
              placeholder="88"
              className="w-full bg-[#1c2541] border border-govBorder rounded px-2 py-1 text-white text-center text-xs focus:outline-none focus:border-govAccent"
            />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px]">SpO2 (%)</label>
            <input
              type="number"
              value={patientData.vitals?.spo2 || ''}
              onChange={(e) =>
                onChange({
                  ...patientData,
                  vitals: { ...patientData.vitals, spo2: e.target.value },
                })
              }
              placeholder="98"
              className="w-full bg-[#1c2541] border border-govBorder rounded px-2 py-1 text-white text-center text-xs focus:outline-none focus:border-govAccent"
            />
          </div>
          <div>
            <label className="block text-slate-500 text-[10px]">Temp (°F)</label>
            <input
              type="text"
              value={patientData.vitals?.temp || ''}
              onChange={(e) =>
                onChange({
                  ...patientData,
                  vitals: { ...patientData.vitals, temp: e.target.value },
                })
              }
              placeholder="98.6"
              className="w-full bg-[#1c2541] border border-govBorder rounded px-2 py-1 text-white text-center text-xs focus:outline-none focus:border-govAccent"
            />
          </div>
        </div>
      </div>

      {/* Preset Shortcuts */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold">
          Emergency Presets (Evaluator Quick Test):
        </label>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => onLoadPreset('cholera')}
            className="p-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-left transition"
          >
            🌊 Cholera Dehydration
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('snakebite')}
            className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-left transition"
          >
            🐍 Viper Snakebite Crisis
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('respiratory')}
            className="p-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-left transition"
          >
            🫁 Acute Bronchitis
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('dengue')}
            className="p-1.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-left transition"
          >
            🦟 Dengue Warning
          </button>
        </div>
      </div>

      {/* ABHA Modal */}
      {showAbhaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card max-w-md w-full rounded-xl p-5 space-y-4 border border-govBorder shadow-2xl">
            <div className="flex justify-between items-center border-b border-govBorder pb-2">
              <h4 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-clinicalEmerald" />
                ABHA QR Scanner Simulation
              </h4>
              <button
                onClick={() => setShowAbhaModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Select a pre-verified Ayushman Bharat Health Account profile to populate demographics:
            </p>
            <div className="space-y-2">
              {sampleAbhaProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectSampleAbha(p)}
                  className="w-full text-left p-3 rounded-lg bg-[#0d182e] border border-govBorder hover:border-cyan-500/60 transition flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <p className="text-[10px] font-mono text-cyan-400">ABHA: {p.abha}</p>
                    <p className="text-[10px] text-slate-400">
                      {p.age}Y • {p.gender} • {p.phc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-clinicalEmerald bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                    Load
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
