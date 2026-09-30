'use client';

import { AlertTriangle, FileCode, Printer, RotateCcw, Pill, Activity } from 'lucide-react';
import { downloadJSON } from '@/lib/utils';
import DialectProtocols, { stopSpeaking } from './DialectProtocols';

export default function TriageResult({
  result,
  patientData,
  onReset,
  onOpenReferralSlip,
}) {
  if (!result) return null;

  const urgencyUp = (result.urgency || '').toUpperCase();
  const isEmergency = /EMERGENCY|CRITICAL|HIGH/.test(urgencyUp);

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

  const handleReset = () => {
    // Always stop any running speech before clearing the result panel
    stopSpeaking();
    onReset();
  };

  const list = (v) => (Array.isArray(v) ? v : v ? String(v).split(/,\s*/) : []);
  const symptoms = list(result.symptoms);
  const medicines = list(result.medicines);
  const usedFallback = result.deductions?.heuristic_used;
  const conf =
    typeof result.confidence === 'number'
      ? `${Math.round(result.confidence * 100)}%`
      : result.confidence || null;

  return (
    <div className="space-y-4">
      {/* The answer first: how urgent, and what is it */}
      <div className={`rounded-2xl p-4 ${isEmergency ? 'bg-bad/10' : 'bg-warn/10'}`}>
        <p className={`flex items-center gap-2 text-sm font-semibold ${isEmergency ? 'text-bad' : 'text-warn'}`}>
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          {result.urgency || 'Urgent'}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight mt-1">
          {result.condition || result.title || 'Condition not identified'}
        </h2>
        <p className="text-sm text-ink-2 mt-1">
          {patientData.patientName} · {patientData.patientId}
          {conf && !usedFallback ? ` · Confidence ${conf}` : ''}
        </p>
        {usedFallback && (
          <p className="text-sm text-ink-2 mt-2">
            {result.deductions?.offline
              ? 'The server could not be reached, so this is a basic offline estimate. '
              : 'The AI service was unavailable, so this is a basic rule-based estimate. '}
            Please confirm clinically.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <section className="bg-fill rounded-2xl p-4">
          <h3 className="text-sm text-ink-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4" aria-hidden="true" /> Symptoms found
          </h3>
          <ul className="mt-2 space-y-1 text-[15px]">
            {symptoms.length ? symptoms.map((x) => <li key={x}>{x}</li>) : <li className="text-ink-2">None recorded</li>}
          </ul>
        </section>
        <section className="bg-fill rounded-2xl p-4">
          <h3 className="text-sm text-ink-2 flex items-center gap-1.5">
            <Pill className="w-4 h-4" aria-hidden="true" /> Medicines to give
          </h3>
          <ul className="mt-2 space-y-1 text-[15px] font-medium">
            {medicines.length ? medicines.map((x) => <li key={x}>{x}</li>) : <li className="text-ink-2 font-normal">None suggested</li>}
          </ul>
        </section>
      </div>

      <DialectProtocols result={result} />

      {!usedFallback && (
        <p className="text-sm text-ink-2">
          Stock at {patientData.phcName} has been reduced to match the medicines above.
        </p>
      )}

      <div className="flex flex-wrap gap-2 pt-1">
        <button type="button" onClick={onOpenReferralSlip} className="btn btn-primary">
          <Printer className="w-4 h-4" aria-hidden="true" /> Print referral slip
        </button>
        <button type="button" onClick={handleExportFHIR} className="btn btn-plain">
          <FileCode className="w-4 h-4" aria-hidden="true" /> Export health record
        </button>
        <button type="button" onClick={handleReset} className="btn btn-plain">
          <RotateCcw className="w-4 h-4" aria-hidden="true" /> New patient
        </button>
      </div>
    </div>
  );
}
