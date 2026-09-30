'use client';

import { useState } from 'react';
import { QrCode, ShieldCheck, HeartPulse, X } from 'lucide-react';

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
    <div className="enterprise-card rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <h3 className="text-xs font-semibold text-ink-2   tabular-nums flex items-center gap-2">
          <QrCode className="w-4 h-4 text-accent" /> Patient details
        </h3>
        <button
          type="button"
          onClick={() => setShowAbhaModal(true)}
          className="btn btn-quiet !min-h-0 !py-1 !px-3 text-sm"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Scan ABHA QR</span>
        </button>
      </div>

      {/* ABHA Badge */}
      <div className="p-2.5 rounded bg-ok/10 border border-ok/30 text-ok text-xs tabular-nums flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-ok flex-shrink-0" />
          <div>
            <span className="font-semibold">ABDM Verified Health ID:</span>
            <span className="text-ink tabular-nums ml-1 font-semibold">
              {patientData.abhaNumber || '91-8402-9912-3401'}
            </span>
          </div>
        </div>
        <span className="text-xs text-ok font-semibold border border-ok/30 px-1.5 py-0.5 rounded">
          M1 Compliant
        </span>
      </div>

      {/* Basic Demographics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-ink-2 font-semibold mb-1 text-xs">Patient ID</label>
          <input
            type="text"
            value={patientData.patientId}
            onChange={(e) => onChange({ ...patientData, patientId: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="block text-ink-2 font-semibold mb-1 text-xs">Age</label>
          <input
            type="number"
            value={patientData.age}
            onChange={(e) => onChange({ ...patientData, age: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="block text-ink-2 font-semibold mb-1 text-xs">Gender</label>
          <select
            value={patientData.gender}
            onChange={(e) => onChange({ ...patientData, gender: e.target.value })}
            className="field"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs tabular-nums">
        <div>
          <label className="block text-ink-2 font-semibold mb-1 text-xs">Patient Full Name</label>
          <input
            type="text"
            value={patientData.patientName}
            onChange={(e) => onChange({ ...patientData, patientName: e.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="block text-ink-2 font-semibold mb-1 text-xs">PHC Sector</label>
          <select
            value={patientData.phcName}
            onChange={(e) => onChange({ ...patientData, phcName: e.target.value })}
            className="field"
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
      <div className="bg-fill p-3 rounded-lg border border-line space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs tabular-nums  text-ink-2 font-semibold flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-accent" />
            Vitals
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-xs tabular-nums">
          <div>
            <label className="block text-ink-3 text-xs">BP (mmHg)</label>
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
              className="field text-center !px-2 !py-1.5 !bg-surface"
            />
          </div>
          <div>
            <label className="block text-ink-3 text-xs">Pulse (bpm)</label>
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
              className="field text-center !px-2 !py-1.5 !bg-surface"
            />
          </div>
          <div>
            <label className="block text-ink-3 text-xs">SpO2 (%)</label>
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
              className="field text-center !px-2 !py-1.5 !bg-surface"
            />
          </div>
          <div>
            <label className="block text-ink-3 text-xs">Temp (°F)</label>
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
              className="field text-center !px-2 !py-1.5 !bg-surface"
            />
          </div>
        </div>
      </div>

      {/* Preset Shortcuts */}
      <div className="space-y-1.5 pt-1">
        <label className="block text-xs tabular-nums text-ink-2  font-semibold">
          Try an example case
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs tabular-nums">
          <button
            type="button"
            onClick={() => onLoadPreset('cholera')}
            className="btn btn-plain !justify-start !min-h-0 !py-2 text-sm font-medium"
          >
            Severe dehydration
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('snakebite')}
            className="btn btn-plain !justify-start !min-h-0 !py-2 text-sm font-medium"
          >
            Snakebite
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('respiratory')}
            className="btn btn-plain !justify-start !min-h-0 !py-2 text-sm font-medium"
          >
            Chest infection
          </button>
          <button
            type="button"
            onClick={() => onLoadPreset('dengue')}
            className="btn btn-plain !justify-start !min-h-0 !py-2 text-sm font-medium"
          >
            Dengue fever
          </button>
        </div>
      </div>

      {/* ABHA Modal */}
      {showAbhaModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card max-w-md w-full rounded-2xl p-5 space-y-4 border border-line shadow-none">
            <div className="flex justify-between items-center border-b border-line pb-2">
              <h4 className="text-sm font-semibold tabular-nums text-ink flex items-center gap-2">
                <QrCode className="w-4 h-4 text-ok" />
                ABHA QR Scanner Simulation
              </h4>
              <button
                onClick={() => setShowAbhaModal(false)}
                className="text-ink-2 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-ink-2">
              Select a pre-verified Ayushman Bharat Health Account profile to populate demographics:
            </p>
            <div className="space-y-2">
              {sampleAbhaProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectSampleAbha(p)}
                  className="w-full text-left p-3 rounded-lg bg-fill border border-line hover:border-accent/60 transition flex justify-between items-center"
                >
                  <div>
                    <p className="text-xs font-semibold text-ink">{p.name}</p>
                    <p className="text-xs tabular-nums text-accent">ABHA: {p.abha}</p>
                    <p className="text-xs text-ink-2">
                      {p.age}Y • {p.gender} • {p.phc}
                    </p>
                  </div>
                  <span className="text-xs tabular-nums text-ok bg-ok/10 px-2 py-1 rounded border border-ok/30">
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
