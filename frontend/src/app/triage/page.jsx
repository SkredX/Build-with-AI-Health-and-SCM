'use client';

import { useState } from 'react';
import PatientIntake from '@/components/triage/PatientIntake';
import VoiceRecorder from '@/components/triage/VoiceRecorder';
import RxImageUpload from '@/components/triage/RxImageUpload';
import TriageResult from '@/components/triage/TriageResult';
import ReferralSlip from '@/components/reports/ReferralSlip';
import Toast from '@/components/common/Toast';
import { useGeminiTriage } from '@/hooks/useGeminiTriage';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { Stethoscope, Mic, FileImage, PenSquare, Brain } from 'lucide-react';

export default function TriagePage() {
  const [activeInputTab, setActiveInputTab] = useState('audio');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [uploadedImageBase64, setUploadedImageBase64] = useState(null);
  const [showReferralSlip, setShowReferralSlip] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const [patientData, setPatientData] = useState({
    patientId: 'PAT-ABHA-9042',
    patientName: 'Ramesh Kumar Sharma',
    age: '44',
    gender: 'Male',
    abhaNumber: '91-8402-9912-3401',
    phcName: 'Sanganer PHC',
    vitals: {
      bp: '118/76',
      pulse: '88',
      spo2: '98',
      temp: '98.6',
    },
  });

  const {
    isRecording,
    transcript,
    setTranscript,
    language,
    setLanguage,
    toggleRecording,
  } = useSpeechRecognition('hi-IN');

  const { loading, error, result, runTriage, resetTriage, setResult } = useGeminiTriage();

  const handlePresetSelect = (presetKey) => {
    if (presetKey === 'cholera') {
      setPatientData({
        patientId: 'PAT-ABHA-901',
        patientName: 'Ramesh Kumar Sharma',
        age: '5',
        gender: 'Male',
        abhaNumber: '91-8402-9912-3401',
        phcName: 'Sanganer PHC',
        vitals: { bp: '85/55', pulse: '124', spo2: '97', temp: '99.1' },
      });
      setTranscript('रोगी ने तेज पतले पानी जैसे दस्त और उल्टियां हो रही हैं। बहुत कमजोरी और आंखें धंसी हुई हैं। तुरंत ओआरएस चाहिए।');
      setResult({
        condition: 'Acute Cholera / Severe Dehydrating Diarrheal Outbreak',
        snomed_code: '63650001',
        urgency: 'EMERGENCY RED',
        confidence: '98.9%',
        symptoms: 'Profuse Rice-Water Diarrhea, Severe Dehydration, Sunken Eyes, Tachycardia',
        medicines: 'ORS Sachet x10, Zinc Sulfate 20mg, Doxycycline 100mg, IV Ringer Lactate',
        guidance_en: 'Administer rapid ORS rehydration. Initiate IV Ringer Lactate immediately due to severe hypovolemic dehydration. Urgent referral to Sub-District Hospital.',
        deductions: { ors: 10, zinc: 14, pcm: 2 },
      });
      setToastMsg({ text: 'Loaded Monsoon Cholera Preset (Sanganer)', type: 'warning' });
    } else if (presetKey === 'snakebite') {
      setPatientData({
        patientId: 'PAT-ABHA-402',
        patientName: 'Sunita Devi Gurjar',
        age: '34',
        gender: 'Female',
        abhaNumber: '14-2391-7784-9021',
        phcName: 'Chomu PHC',
        vitals: { bp: '90/60', pulse: '110', spo2: '95', temp: '98.4' },
      });
      setTranscript('खेती करते समय बाएं पैर पर सांप ने काटा। दो दांतों के निशान हैं, पैर में सूजन और मसूड़ों से हल्का खून आ रहा है।');
      setResult({
        condition: "Russell's Viper Envenomation (Haemotoxic Snakebite)",
        snomed_code: '242635008',
        urgency: 'CRITICAL EMERGENCY',
        confidence: '99.4%',
        symptoms: 'Fang marks on left ankle, Rapid localized edema, Ptosis, Spontaneous gingival bleeding',
        medicines: 'Polyvalent Anti-Snake Venom (ASV x10 vials in Normal Saline), Atropine',
        guidance_en: 'Immobilize bitten limb with a splint. Administer 10 vials of reconstituted Polyvalent ASV in 500ml NS over 1 hour. Do NOT apply tourniquet or incisions.',
        deductions: { antivenom: 1 },
      });
      setToastMsg({ text: 'Loaded Viper Snakebite Crisis Preset (Chomu)', type: 'error' });
    } else if (presetKey === 'respiratory') {
      setPatientData({
        patientId: 'PAT-ABHA-118',
        patientName: 'Mohan Lal Meena',
        age: '62',
        gender: 'Male',
        abhaNumber: '91-8402-9912-3401',
        phcName: 'Amber PHC',
        vitals: { bp: '135/88', pulse: '94', spo2: '91', temp: '101.4' },
      });
      setTranscript('मरीज को 4 दिन से सीने में तेज जकड़न, पीला बलगम और सांस लेने में कठिनाई है। ऑक्सीजन कम लग रही है।');
      setResult({
        condition: 'Acute Exacerbation of Chronic Bronchitis & Hypoxemia',
        snomed_code: '10509002',
        urgency: 'URGENT YELLOW',
        confidence: '96.4%',
        symptoms: 'Persistent purulent cough, Dyspnea on minimal exertion, Bilateral wheeze, Mild hypoxemia',
        medicines: 'Amoxicillin 500mg (x15 caps), Salbutamol Nebulization, Paracetamol 650mg',
        guidance_en: 'Administer Salbutamol nebulization immediately. Start Amoxicillin 500mg TDS for 5 days. Maintain SpO2 above 92%.',
        deductions: { amoxicillin: 15, pcm: 3 },
      });
      setToastMsg({ text: 'Loaded Bronchitis Surge Preset (Amber)', type: 'info' });
    } else if (presetKey === 'dengue') {
      setPatientData({
        patientId: 'PAT-ABHA-554',
        patientName: 'Priya Sharma',
        age: '21',
        gender: 'Female',
        abhaNumber: '91-8402-9912-3401',
        phcName: 'Phulera PHC',
        vitals: { bp: '105/70', pulse: '102', spo2: '98', temp: '103.2' },
      });
      setTranscript('तेज बुखार, आंखों के पीछे बहुत तेज दर्द और बदन में भयानक अकड़न है। उल्टी का मन हो रहा है।');
      setResult({
        condition: 'Suspected Dengue Fever with Warning Signs',
        snomed_code: '38362002',
        urgency: 'URGENT YELLOW',
        confidence: '95.1%',
        symptoms: 'High-grade fever (103.2°F), Retro-orbital headache, Myalgia, Persistent nausea',
        medicines: 'Paracetamol 650mg TDS, Oral Rehydration Fluids, Platelet Count Monitoring',
        guidance_en: 'Administer Paracetamol strictly. Contraindicated: NSAIDs/Aspirin due to hemorrhage risk. Ensure oral fluid hydration > 2.5L/day. Order urgent platelet count.',
        deductions: { pcm: 4, ors: 4 },
      });
      setToastMsg({ text: 'Loaded Dengue Cluster Preset (Phulera)', type: 'info' });
    }
  };

  const handleProcessTriage = async (mode) => {
    let textInput = '';
    if (mode === 'audio') textInput = transcript;
    else if (mode === 'text') textInput = clinicalNotes;
    else if (mode === 'image') textInput = 'Analyze prescription and extract medicine requirements.';

    try {
      await runTriage({
        patient_id: patientData.patientId,
        patient_name: patientData.patientName,
        age: parseInt(patientData.age, 10) || 40,
        gender: patientData.gender,
        phc_name: patientData.phcName,
        vitals: patientData.vitals,
        input_text: textInput,
        input_mode: mode,
        image_base64: mode === 'image' ? uploadedImageBase64 : undefined,
      });
      setToastMsg({ text: 'Patient successfully triaged & stock deducted!', type: 'success' });
    } catch (e) {
      setToastMsg({ text: 'FastAPI triage fallback engaged (offline/heuristic)', type: 'warning' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
          <Toast
            message={toastMsg.text}
            type={toastMsg.type}
            onClose={() => setToastMsg(null)}
          />
        </div>
      )}

      {/* Clinical Context Header */}
      <div className="enterprise-card rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-govAccent">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">
              Primary Health Centre: {patientData.phcName} Rural
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              Operational Node
            </span>
            <span className="bg-cyan-500/10 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30">
              ABDM Registry Active
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">
            ASHA Field Intake, Multimodal AI Triage & Prescription Parsing
          </h2>
          <p className="text-xs text-slate-400">
            Scan patient ABHA cards, record voice memos in regional dialects (Marwari/Hindi/Bengali/Tamil), or scan OPD prescriptions for instant triage & stock auto-deduction.
          </p>
        </div>

        <div className="flex items-center space-x-4 border-t lg:border-t-0 lg:border-l border-govBorder pt-3 lg:pt-0 lg:pl-6 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Today's Triaged</span>
            <span className="text-base font-bold text-white">43 Patients</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Emergency Red Flags</span>
            <span className="text-base font-bold text-rose-400">3 Cases</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Local Drug Reserve</span>
            <span className="text-base font-bold text-emerald-400">88% Adequate</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Demographics & Intake (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <PatientIntake
            patientData={patientData}
            onChange={setPatientData}
            onLoadPreset={handlePresetSelect}
          />

          {/* Mode Switcher Tabs */}
          <div className="enterprise-card rounded-xl p-5 space-y-4">
            <div className="flex bg-[#0d182e] p-1 rounded-lg border border-govBorder">
              <button
                type="button"
                onClick={() => setActiveInputTab('audio')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition ${
                  activeInputTab === 'audio'
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Memo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputTab('image')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition ${
                  activeInputTab === 'image'
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Rx Photo OCR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputTab('text')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded flex items-center justify-center gap-1.5 transition ${
                  activeInputTab === 'text'
                    ? 'bg-cyan-600 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Clinical Notes</span>
              </button>
            </div>

            {/* Input Panels */}
            {activeInputTab === 'audio' && (
              <VoiceRecorder
                isRecording={isRecording}
                onToggleRecording={toggleRecording}
                transcript={transcript}
                onTranscriptChange={setTranscript}
                language={language}
                onLanguageChange={setLanguage}
                onSubmit={() => handleProcessTriage('audio')}
                loading={loading}
              />
            )}

            {activeInputTab === 'image' && (
              <RxImageUpload
                onImageSelected={setUploadedImageBase64}
                onSubmit={() => handleProcessTriage('image')}
                loading={loading}
              />
            )}

            {activeInputTab === 'text' && (
              <div className="space-y-3 font-mono">
                <p className="text-xs text-slate-400">
                  Direct doctor handwritten notes or ICD descriptions:
                </p>
                <textarea
                  rows={5}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full bg-[#0d182e] border border-govBorder rounded-lg p-3 text-xs text-white font-mono focus:outline-none focus:border-govAccent"
                  placeholder="e.g. 34Y female admitted with Russell's viper bite marks on lower ankle. Localized edema, ptosis, bleeding gums."
                />
                <button
                  type="button"
                  onClick={() => handleProcessTriage('text')}
                  disabled={loading || !clinicalNotes.trim()}
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] disabled:opacity-50"
                >
                  <Stethoscope className="w-4 h-4" />
                  {loading ? 'Evaluating...' : 'Analyze Clinical Notes with Gemini'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Decision Support Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="enterprise-card rounded-xl p-5 border border-govBorder min-h-[520px] flex flex-col justify-between">
            <div>
              {/* Pipeline Header */}
              <div className="flex items-center justify-between border-b border-govBorder pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      loading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                    }`}
                  />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Gemini Clinical Engine & Decision Support
                  </h3>
                </div>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] px-2 py-0.5 rounded">
                    gemini-2.0-flash
                  </span>
                  <span className="bg-[#0d182e] text-slate-400 border border-govBorder text-[10px] px-2 py-0.5 rounded">
                    {loading ? 'Processing...' : result ? 'Triage Complete' : 'Awaiting Intake'}
                  </span>
                </div>
              </div>

              {/* Loader */}
              {loading && (
                <div className="space-y-3 my-16 text-center">
                  <Brain className="w-10 h-10 text-cyan-400 animate-pulse mx-auto" />
                  <p className="text-xs font-mono text-cyan-400 font-semibold animate-pulse">
                    Running Multimodal OCR, SNOMED-CT Mapping & Regional Dialect Synthesis...
                  </p>
                  <div className="w-48 bg-[#0d182e] rounded-full h-1.5 overflow-hidden border border-govBorder mx-auto">
                    <div className="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-1.5 rounded-full w-3/4 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !result && (
                <div className="text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#0d182e] border border-govBorder text-slate-500 flex items-center justify-center mx-auto text-2xl">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                    No Patient Active in Node
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Select a preset emergency scenario on the left, scan an ABHA card, or submit voice/prescription input to initiate real-time AI triage with automatic drug stock deductions.
                  </p>
                </div>
              )}

              {/* Result Card */}
              {!loading && result && (
                <TriageResult
                  result={result}
                  patientData={patientData}
                  onReset={resetTriage}
                  onOpenReferralSlip={() => setShowReferralSlip(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Referral Slip Modal */}
      {showReferralSlip && (
        <ReferralSlip
          patientData={patientData}
          result={result}
          onClose={() => setShowReferralSlip(false)}
        />
      )}
    </div>
  );
}
