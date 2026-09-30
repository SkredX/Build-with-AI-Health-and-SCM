'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Sparkles, CheckCircle2, Pill, Activity } from 'lucide-react';

const SAMPLES = {
  cholera: {
    id: 'cholera',
    label: 'Sample Cholera',
    badge: 'OPD • ACUTE CHOLERA',
    badgeColor: 'border-warn text-warn bg-warn/10',
    headerBg: '#0284c7',
    hospital: 'GOVT OF RAJASTHAN • SANGANER PRIMARY HEALTH CENTRE',
    opNo: 'OPD/4921/EMG',
    patientName: 'Ramesh Kumar Sharma',
    patientAgeGender: '44Y / Male',
    vitals: { bp: '85/55', pulse: '124', spo2: '97', temp: '99.1' },
    vitalsStr: 'BP: 85/55 • Pulse: 124 • SpO2: 97% • Temp: 99.1°F',
    diagnosis: 'Acute Cholera Surge / Severe Dehydration & Watery Diarrhea',
    prognosisSummary: 'Guarded without immediate rehydration. High risk of hypovolemic shock within 6-12 hrs without aggressive fluid therapy.',
    rxLines: [
      '1. Sachet ORS (WHO Formula) x 10 pkts — continuous small sips',
      '2. Tab Zinc Sulfate 20mg OD x 14 days',
      '3. Cap Doxycycline 300mg stat (single dose)',
      '4. IV Ringer Lactate 1000ml stat run rapid (hypovolemia protocol)',
    ],
    doctor: 'Dr. A. Sharma, MBBS • MO I/C Sanganer PHC (Reg #38914)',
    medicineTags: ['ORS Sachets x10', 'Zinc Sulfate 20mg', 'Doxycycline 300mg', 'IV Ringer Lactate'],
  },
  snakebite: {
    id: 'snakebite',
    label: 'Sample Snakebite',
    badge: 'CASUALTY • SNAKEBITE EMERGENCY',
    badgeColor: 'border-bad text-bad bg-bad/10',
    headerBg: '#dc2626',
    hospital: 'COMMUNITY HEALTH CENTRE CHOMU • EMERGENCY CASUALTY / MLC',
    opNo: 'MLC/EMG/1042',
    patientName: 'Sunita Devi Gurjar',
    patientAgeGender: '34Y / Female',
    vitals: { bp: '90/60', pulse: '110', spo2: '95', temp: '98.4' },
    vitalsStr: 'BP: 90/60 • Pulse: 110 • SpO2: 95% • 20WBCT: Non-Clotting',
    diagnosis: "Severe Haemotoxic Snakebite Envenomation (Suspected Russell's Viper)",
    prognosisSummary: 'Critical emergency requiring prompt antivenom neutralization. High risk of systemic coagulopathy and acute kidney injury if ASV is delayed beyond 2 hours.',
    rxLines: [
      '1. Inj. Polyvalent ASV 10 vials in 500ml Normal Saline IV over 1 hr stat',
      '2. Inj. Tetanus Toxoid 0.5ml IM stat',
      '3. Strict splint immobilization of left limb below heart level (NO tourniquet)',
      '4. Emergency referral to Sub-District Hospital ICU; repeat 20WBCT in 6 hrs',
    ],
    doctor: 'Dr. V. K. Verma, MD (Emergency) • CHC Chomu (Reg #20941)',
    medicineTags: ['Polyvalent ASV (10 vials)', 'Tetanus Toxoid 0.5ml', 'Normal Saline IV'],
  },
  respiratory: {
    id: 'respiratory',
    label: 'Sample Bronchitis',
    badge: 'CHEST CLINIC • ACUTE BRONCHITIS',
    badgeColor: 'border-accent text-accent bg-accent/10',
    headerBg: '#0d9488',
    hospital: 'NATIONAL HEALTH MISSION • AMBER RURAL PHC',
    opNo: 'OPD/8320/CHEST',
    patientName: 'Mohan Lal Meena',
    patientAgeGender: '62Y / Male',
    vitals: { bp: '135/88', pulse: '94', spo2: '91', temp: '101.4' },
    vitalsStr: 'BP: 135/88 • Pulse: 94 • SpO2: 91% • Temp: 101.4°F • Wheeze +++',
    diagnosis: 'Acute Exacerbation of Chronic Bronchitis & Hypoxemia',
    prognosisSummary: 'Favorable with bronchodilator nebulization and oral antimicrobial coverage. Low risk of respiratory failure if SpO2 maintained above 92%.',
    rxLines: [
      '1. Salbutamol 2.5mg + Ipratropium Nebulization stat & TDS',
      '2. Cap. Amoxicillin 500mg TDS x 5 days',
      '3. Tab. Paracetamol 650mg TDS x 3 days for fever & chest discomfort',
      '4. O2 therapy via nasal prongs to maintain SpO2 > 92%',
    ],
    doctor: 'Dr. S. K. Gupta, MBBS, DTCD • Amber PHC (Reg #19482)',
    medicineTags: ['Amoxicillin 500mg', 'Salbutamol Nebules', 'Paracetamol 650mg'],
  },
  dengue: {
    id: 'dengue',
    label: 'Sample Dengue',
    badge: 'FEVER CLINIC • DENGUE SURGE',
    badgeColor: 'border-warn text-warn bg-warn/10',
    headerBg: '#b45309',
    hospital: 'PRIMARY HEALTH CENTRE PHULERA • EMERGENCY OPD',
    opNo: 'OPD/554/FEVER',
    patientName: 'Priya Sharma',
    patientAgeGender: '21Y / Female',
    vitals: { bp: '105/70', pulse: '102', spo2: '98', temp: '103.2' },
    vitalsStr: 'BP: 105/70 • Pulse: 102 • SpO2: 98% • Temp: 103.2°F',
    diagnosis: 'Acute Febrile Illness / Suspected Dengue with Warning Signs',
    prognosisSummary: 'Good recovery with strict volume management and antipyretics. Critical phase around days 3-7 requires close platelet and hematocrit monitoring.',
    rxLines: [
      '1. Tab Paracetamol 650mg TDS strictly (Contraindicated: Aspirin / NSAIDs)',
      '2. Oral Rehydration Fluids (ORS) > 2.5 Litres per day',
      '3. Platelet count & hematocrit check daily; monitor warning signs',
      '4. Urgent hospitalization if abdominal pain, bleeding, or fluid accumulation',
    ],
    doctor: 'Dr. P. K. Joshi, MBBS • Phulera PHC (Reg #40129)',
    medicineTags: ['Paracetamol 650mg', 'Oral Rehydration Salts', 'Platelet Monitoring'],
  },
};

function generatePrescriptionSvg(sample) {
  const rxLineItems = sample.rxLines
    .map((line, idx) => `<text x="24" y="${120 + idx * 16}" fill="#1e293b" font-family="sans-serif" font-size="9">${line}</text>`)
    .join('\n');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="450" height="210" viewBox="0 0 450 210">
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#ffffff" rx="8" stroke="#cbd5e1" stroke-width="1" filter="url(#shadow)" />
      
      <!-- Top banner -->
      <rect x="0" y="0" width="450" height="34" fill="${sample.headerBg}" rx="8" />
      <rect x="0" y="24" width="450" height="10" fill="${sample.headerBg}" />
      <text x="20" y="16" fill="#ffffff" font-family="sans-serif" font-size="9" font-weight="bold" letter-spacing="0.5">${sample.hospital}</text>
      <text x="20" y="27" fill="#e2e8f0" font-family="sans-serif" font-size="8">CLINICAL OPD PRESCRIPTION & REFERRAL SLIP • ${sample.opNo}</text>
      
      <!-- Patient Demographic line -->
      <rect x="12" y="40" width="426" height="22" fill="#f8fafc" rx="4" stroke="#e2e8f0" />
      <text x="20" y="54" fill="#0f172a" font-family="sans-serif" font-size="9" font-weight="bold">Pt: ${sample.patientName} (${sample.patientAgeGender})</text>
      <text x="230" y="54" fill="#475569" font-family="sans-serif" font-size="8.5" font-weight="bold">${sample.vitalsStr}</text>

      <!-- Provisional Diagnosis Highlight Box -->
      <rect x="12" y="66" width="426" height="24" fill="#f1f5f9" rx="4" stroke="#cbd5e1" />
      <text x="20" y="77" fill="#64748b" font-family="sans-serif" font-size="7.5" font-weight="bold">PROVISIONAL DIAGNOSIS:</text>
      <text x="20" y="87" fill="#0f172a" font-family="sans-serif" font-size="8.5" font-weight="bold">${sample.diagnosis}</text>

      <!-- Rx Section -->
      <text x="20" y="106" fill="${sample.headerBg}" font-family="serif" font-size="14" font-weight="bold">℞</text>
      <line x1="38" y1="103" x2="430" y2="103" stroke="#e2e8f0" stroke-width="1" />
      ${rxLineItems}

      <!-- Doctor signature footer -->
      <line x1="12" y1="184" x2="438" y2="184" stroke="#e2e8f0" stroke-width="1" />
      <text x="20" y="198" fill="#64748b" font-family="sans-serif" font-size="7.5">Authentic Clinical Document • Ayushman Bharat Digital Mission (ABDM) Compatible</text>
      <text x="430" y="198" fill="#0f172a" font-family="sans-serif" font-size="8" font-weight="bold" text-anchor="end">${sample.doctor}</text>
    </svg>
  `;
}

export default function RxImageUpload({
  onImageSelected,
  onSubmit,
  loading = false,
}) {
  const [preview, setPreview] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target?.result;
        setPreview(base64);
        setActiveSampleId(null);
        const genericOcr = 'Doctor handwritten prescription photo uploaded for clinical extraction and medicine inventory deduction.';
        onImageSelected(base64, null, genericOcr, null);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSample = (sampleKey) => {
    const sample = SAMPLES[sampleKey];
    if (!sample) return;

    setActiveSampleId(sampleKey);

    const svg = generatePrescriptionSvg(sample);
    const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    setPreview(base64);

    // Full clinical text representation of this prescription for OCR / triage
    const ocrText = `${sample.hospital}. Patient: ${sample.patientName}, ${sample.patientAgeGender}. Vitals: ${sample.vitalsStr}. Clinical Provisional Diagnosis: ${sample.diagnosis}. Prescribed medicines: ${sample.rxLines.join(' | ')}. Attending Medical Officer: ${sample.doctor}`;

    const patientMeta = {
      patientName: sample.patientName,
      age: sample.patientAgeGender.split('Y')[0].trim(),
      gender: sample.patientAgeGender.includes('Female') ? 'Female' : 'Male',
      vitals: sample.vitals,
      phcName: sample.hospital.split('•')[1]?.trim() || 'Jaipur Rural Health Centre',
    };

    onImageSelected(base64, sampleKey, ocrText, patientMeta);
  };

  const activeSample = activeSampleId ? SAMPLES[activeSampleId] : null;

  return (
    <div className="space-y-3.5">
      {/* Sample Selector Bar */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-ink-2">
          <span className="flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Choose a pre-verified clinical prescription:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs tabular-nums">
          {Object.values(SAMPLES).map((sample) => {
            const isSelected = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => loadSample(sample.id)}
                className={`px-2.5 py-1.5 rounded-lg border font-medium transition text-center flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? `${sample.badgeColor} ring-2 ring-accent/30 font-semibold shadow-sm`
                    : 'bg-fill border-line text-ink-2 hover:text-ink hover:border-line-2'
                }`}
              >
                <span>{sample.label}</span>
                <span className="text-[10px] text-ink-3 truncate max-w-full font-normal">
                  {sample.id === 'cholera' && 'ORS + Doxy'}
                  {sample.id === 'snakebite' && 'ASV 10 vials'}
                  {sample.id === 'respiratory' && 'Amox + Salbut'}
                  {sample.id === 'dengue' && 'PCM + Fluids'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Dropzone / Visual Preview */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-line hover:border-accent rounded-xl p-4 text-center bg-fill transition cursor-pointer relative overflow-hidden group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Prescription preview"
              className="max-h-52 w-auto mx-auto rounded-lg border border-line shadow-sm object-contain"
            />
            <div className="flex items-center justify-center gap-1.5 text-xs text-accent">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{activeSample ? `${activeSample.label} Loaded` : 'Custom Prescription Loaded'} • Tap to upload different image</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 py-4">
            <UploadCloud className="w-8 h-8 text-ink-3 mx-auto group-hover:text-accent transition" />
            <p className="text-xs font-semibold text-ink">
              Upload prescription photo or select one of the samples above
            </p>
            <p className="text-xs text-ink-3 tabular-nums">
              Supports JPG, PNG, WEBP or pre-verified OPD slips
            </p>
          </div>
        )}
      </div>

      {/* OCR Recognized Live Teaser Card */}
      {activeSample && (
        <div className="bg-surface border border-line rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-accent" /> OCR Extracted Clinical Data:
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${activeSample.badgeColor}`}>
              {activeSample.badge}
            </span>
          </div>

          <p className="text-ink-2">
            <span className="font-medium text-ink">Provisional Diagnosis: </span>
            {activeSample.diagnosis}
          </p>

          <p className="text-ink-2">
            <span className="font-medium text-ink">Expected Prognosis: </span>
            {activeSample.prognosisSummary}
          </p>

          <div className="pt-1">
            <span className="text-[11px] font-medium text-ink-3 block mb-1">Prescribed Medicines to Deduct:</span>
            <div className="flex flex-wrap gap-1">
              {activeSample.medicineTags.map((med) => (
                <span
                  key={med}
                  className="px-2 py-0.5 rounded bg-fill border border-line text-ink text-[11px] flex items-center gap-1"
                >
                  <Pill className="w-2.5 h-2.5 text-accent" /> {med}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Read Prescription Button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !preview}
        className="btn btn-primary w-full shadow-sm py-2.5 flex items-center justify-center gap-2"
      >
        <ImageIcon className="w-4 h-4" />
        {loading ? 'Reading & Analysing prescription...' : 'Read prescription & Run Triage'}
      </button>
    </div>
  );
}
