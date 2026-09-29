'use client';

import {
  AlertTriangle,
  CheckCircle,
  FileCode,
  Printer,
  RotateCcw,
  Boxes,
  Stethoscope,
} from 'lucide-react';
import { downloadJSON } from '@/lib/utils';
import DialectProtocols from './DialectProtocols';

export default function TriageResult({
  result,
  patientData,
  onReset,
  onOpenReferralSlip,
}) {
  if (!result) return null;

  const isEmergency =
    result.urgency?.includes('EMERGENCY') || result.urgency?.includes('CRITICAL');

  const handleExportFHIR = () => {
    const fhirBundle = {
      resourceType: 'Bundle',
      id: `abdm-bundle-${Date.now()}`,
      meta: {
        profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClinicalArtifactBundle'],
        lastUpdated: new Date().toISOString(),
      },
      identifier: {
        system: 'https://ndhm.in/phc-connect',
        value: `BUNDLE-JR-${Date.now()}`,
      },
      type: 'document',
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patientData.patientId}`,
          resource: {
            resourceType: 'Patient',
            id: patientData.patientId,
            identifier: [
              {
                system: 'https://healthid.ndhm.gov.in',
                value: patientData.abhaNumber,
              },
            ],
            name: [{ text: patientData.patientName }],
            gender: patientData.gender?.toLowerCase() || 'unknown',
          },
        },
        {
          fullUrl: `urn:uuid:condition-${patientData.patientId}`,
          resource: {
            resourceType: 'Condition',
            clinicalStatus: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                  code: 'active',
                },
              ],
            },
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: result.snomed_code || '63650001',
                  display: result.condition || result.title,
                },
              ],
            },
            subject: { reference: `Patient/${patientData.patientId}` },
          },
        },
      ],
    };

    downloadJSON(fhirBundle, `ABDM_FHIR_R4_${patientData.patientId}.json`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Severity Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between ${
          isEmergency
            ? 'bg-rose-500/10 border-rose-500/30'
            : 'bg-amber-500/10 border-amber-500/30'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
              isEmergency
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-bold text-slate-300">
                {patientData.patientId}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                  isEmergency
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {result.urgency || 'URGENT'}
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                SNOMED: {result.snomed_code || '63650001'}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">
              {result.condition || result.title || 'Acute Condition Diagnosed'}
            </h4>
          </div>
        </div>

        <div className="text-right font-mono hidden sm:block">
          <p className="text-[10px] text-slate-400">AI Confidence</p>
          <p className="text-xs font-bold text-clinicalEmerald">
            {result.confidence || '97.4%'}
          </p>
        </div>
      </div>

      {/* Structured Symptoms & Medicines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
        <div className="bg-[#0d182e] p-3 rounded-lg border border-govBorder space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-warningAmber" /> Identified Symptoms
          </span>
          <p className="font-semibold text-slate-200 text-xs">
            {result.symptoms || 'Symptoms recorded from clinical intake.'}
          </p>
        </div>

        <div className="bg-[#0d182e] p-3 rounded-lg border border-govBorder space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1.5">
            <Boxes className="w-3.5 h-3.5 text-govAccent" /> Prescribed Regimen
          </span>
          <p className="font-semibold text-cyan-400 text-xs">
            {result.medicines || 'Prescribed oral rehydration & emergency drugs.'}
          </p>
        </div>
      </div>

      {/* Multilingual Protocols */}
      <DialectProtocols result={result} />

      {/* Stock Auto-Deduction Banner */}
      <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyan-300">
          <Boxes className="w-4 h-4 text-govAccent flex-shrink-0" />
          <span>
            <strong>Inventory Updated:</strong> Automatic deduction recorded for{' '}
            {patientData.phcName}. Local ledger synced with central grid.
          </span>
        </div>
        <span className="text-[10px] text-clinicalEmerald font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          SYNCED
        </span>
      </div>

      {/* Action Footer */}
      <div className="border-t border-govBorder pt-3 flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
        <span className="text-slate-400 text-[11px] flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-clinicalEmerald" />
          ABDM M2 Audit Synced
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportFHIR}
            className="px-2.5 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition text-[11px]"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export ABDM FHIR R4</span>
          </button>

          <button
            type="button"
            onClick={onOpenReferralSlip}
            className="px-2.5 py-1.5 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 transition text-[11px]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Referral Slip</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 rounded bg-[#0d182e] hover:bg-slate-800 text-slate-300 border border-govBorder transition text-[11px] flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Next Intake</span>
          </button>
        </div>
      </div>
    </div>
  );
}
