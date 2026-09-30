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
  const [uploadedRxText, setUploadedRxText] = useState('');
  const [uploadedSampleType, setUploadedSampleType] = useState(null);
  const [showReferralSlip, setShowReferralSlip] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const handleImageSelected = (base64, sampleType = null, ocrText = '', patientMeta = null) => {
    setUploadedImageBase64(base64);
    setUploadedSampleType(sampleType);
    setUploadedRxText(ocrText);
    if (patientMeta) {
      setPatientData((prev) => ({
        ...prev,
        ...patientMeta,
        vitals: { ...prev.vitals, ...(patientMeta.vitals || {}) },
      }));
    }
  };

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
    isSupported,
    speechError,
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
    else if (mode === 'image') {
      textInput = uploadedRxText || (uploadedSampleType ? `Doctor clinical prescription for ${uploadedSampleType}` : 'Doctor prescription photo uploaded for analysis and medicine extraction.');
    }

    try {
      const data = await runTriage({
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
      if (data?.deductions?.offline) {
        setToastMsg({ text: "Couldn't reach the server. Showing a basic offline estimate.", type: 'warning' });
      } else if (data?.deductions?.heuristic_used) {
        setToastMsg({ text: 'AI service unavailable. Showing a basic rule-based estimate.', type: 'warning' });
      } else {
        setToastMsg({ text: 'Patient triaged and stock updated.', type: 'success' });
      }
    } catch (e) {
      setToastMsg({ text: 'Something went wrong. Please try again.', type: 'warning' });
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

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Triage</h1>
        <p className="text-ink-2 mt-1 max-w-2xl">
          Enter a patient's details and symptoms by voice, prescription photo or typed notes. You get a suggested
          condition, urgency and the medicines to give. {patientData.phcName}.
        </p>
      </header>

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
          <div className="enterprise-card rounded-2xl p-5 space-y-4">
            <div className="flex bg-fill p-1 rounded-xl" role="tablist">
              <button
                type="button"
                onClick={() => setActiveInputTab('audio')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeInputTab === 'audio'
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Memo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputTab('image')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeInputTab === 'image'
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <FileImage className="w-3.5 h-3.5" />
                <span>Prescription photo</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveInputTab('text')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activeInputTab === 'text'
                    ? 'bg-surface text-ink shadow-sm'
                    : 'text-ink-2 hover:text-ink'
                }`}
              >
                <PenSquare className="w-3.5 h-3.5" />
                <span>Typed notes</span>
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
                isSupported={isSupported}
                speechError={speechError}
              />
            )}

            {activeInputTab === 'image' && (
              <RxImageUpload
                onImageSelected={handleImageSelected}
                onSubmit={() => handleProcessTriage('image')}
                loading={loading}
              />
            )}

            {activeInputTab === 'text' && (
              <div className="space-y-3 tabular-nums">
                <p className="text-xs text-ink-2">
                  Direct doctor handwritten notes or ICD descriptions:
                </p>
                <textarea
                  rows={5}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="field"
                  placeholder="e.g. 34Y female admitted with Russell's viper bite marks on lower ankle. Localized edema, ptosis, bleeding gums."
                />
                <button
                  type="button"
                  onClick={() => handleProcessTriage('text')}
                  disabled={loading || !clinicalNotes.trim()}
                  className="btn btn-primary w-full"
                >
                  <Stethoscope className="w-4 h-4" />
                  {loading ? 'Evaluating...' : 'Analyse notes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Decision Support Output (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="enterprise-card rounded-2xl p-5 border border-line min-h-[520px] flex flex-col justify-between">
            <div>
              {/* Pipeline Header */}
              <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      loading ? 'bg-warn ' : 'bg-ok'
                    }`}
                  />
                  <h3 className="text-xs font-semibold text-ink   tabular-nums">
                    Result
                  </h3>
                </div>
                <div className="flex items-center space-x-2 tabular-nums">
                  <span className="bg-fill text-ink-2 border border-line text-xs px-2 py-0.5 rounded">
                    {loading ? 'Processing...' : result ? 'Triage Complete' : 'Awaiting Intake'}
                  </span>
                </div>
              </div>

              {/* Loader */}
              {loading && (
                <div className="space-y-3 my-16 text-center">
                  <Brain className="w-10 h-10 text-accent animate-pulse mx-auto" />
                  <p className="text-xs tabular-nums text-accent font-semibold animate-pulse">
                    Running Multimodal OCR, SNOMED-CT Mapping & Regional Dialect Synthesis...
                  </p>
                  <div className="w-48 bg-fill rounded-full h-1.5 overflow-hidden border border-line mx-auto">
                    <div className="to-emerald-400 h-1.5 rounded-full w-3/4 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && !result && (
                <div className="text-center py-20 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-fill border border-line text-ink-3 flex items-center justify-center mx-auto text-2xl">
                    <Stethoscope className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-semibold text-ink-2   tabular-nums">
                    No result yet
                  </h4>
                  <p className="text-xs text-ink-2 max-w-md mx-auto">
                    Fill in the patient details, then record a voice memo, upload a prescription photo or type notes. The suggested condition, urgency and medicines appear here.
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
