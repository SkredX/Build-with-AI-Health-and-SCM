'use client';

import { Mic, MicOff, Volume2, AlertCircle, Sparkles } from 'lucide-react';
import { SPEECH_LANGUAGES } from '@/lib/constants';

export default function VoiceRecorder({
  isRecording,
  onToggleRecording,
  transcript,
  onTranscriptChange,
  language,
  onLanguageChange,
  onSubmit,
  loading = false,
  isSupported = true,
  speechError = null,
}) {
  const sampleVoiceMemos = [
    {
      label: '🐍 Snakebite (Hinglish)',
      text: 'Patient ko ek kaale rang ke saanp ne kaata hai',
    },
    {
      label: '💧 Cholera / Diarrhea (Hindi)',
      text: 'रोगी ने तेज पतले पानी जैसे दस्त और उल्टी की शिकायत है। बहुत कमजोरी है।',
    },
    {
      label: '🫁 Bronchitis (Hindi)',
      text: 'मरीज को सीने में तेज जकड़न, खांसी और सांस लेने में कठिनाई हो रही है।',
    },
    {
      label: '🌡️ Dengue / Fever (Hinglish)',
      text: 'Patient ko 3 din se tez bukhar, badan dard aur aankhon ke peeche dard hai',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs text-ink-2">
        <span>Record field audio memo in your dialect:</span>
        <div className="flex items-center space-x-1 text-xs tabular-nums">
          <span className="text-ink-3 mr-1">Dialect:</span>
          {SPEECH_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange(lang.code)}
              className={`px-2 py-0.5 rounded text-xs tabular-nums transition ${
                language === lang.code
                  ? 'bg-accent/20 text-accent font-semibold border border-accent/40'
                  : 'text-ink-2 hover:text-ink bg-fill'
              }`}
            >
              {lang.short}
            </button>
          ))}
        </div>
      </div>

      {/* Recording Box */}
      <div className="p-4 rounded-lg bg-fill border border-line text-center space-y-3 relative overflow-hidden">
        {isRecording && (
          <div className="absolute inset-0 bg-accent/5 animate-pulse pointer-events-none" />
        )}

        <div className="text-xs tabular-nums relative z-10">
          {isRecording ? (
            <span className="text-bad font-semibold flex items-center justify-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-bad" />
              Recording ({language}). Tap to stop
            </span>
          ) : (
            <span className="text-ink-2">Tap the microphone and speak</span>
          )}
        </div>

        <div className="flex justify-center items-center space-x-3 relative z-10">
          <button
            type="button"
            onClick={onToggleRecording}
            className={`w-16 h-16 rounded-full text-white flex items-center justify-center transition-transform active:scale-95 shadow-md ${
              isRecording
                ? 'bg-bad animate-pulse ring-4 ring-bad/20'
                : 'bg-accent-fill hover:opacity-90'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>

        {speechError && (
          <div className="text-xs text-bad bg-bad/10 border border-bad/20 rounded-md p-2 flex items-center justify-center gap-1.5 relative z-10">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {!isSupported && !speechError && (
          <div className="text-xs text-warn bg-warn/10 border border-warn/20 rounded-md p-2 text-center relative z-10">
            Browser voice recognition is inactive (Google Chrome or Edge recommended). You can type notes or tap a sample below.
          </div>
        )}

        {/* Live Editable Transcript */}
        <div className="text-left space-y-1 relative z-10">
          <div className="flex justify-between items-center text-xs tabular-nums text-ink-2">
            <label htmlFor="voice-transcript">
              Transcript (you can speak or edit it):
            </label>
            {transcript && (
              <button
                type="button"
                onClick={() => onTranscriptChange('')}
                className="text-xs text-ink-3 hover:text-ink underline"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            id="voice-transcript"
            rows={3}
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            className="field"
            placeholder="Spoken words will appear here live. e.g. Patient ko ek kaale rang ke saanp ne kaata hai..."
          />
        </div>

        {/* Quick Test Samples */}
        <div className="text-left space-y-1.5 pt-1 relative z-10">
          <span className="text-[11px] text-ink-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-accent" /> Quick test sample voice memos:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {sampleVoiceMemos.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => onTranscriptChange(sample.text)}
                className="text-xs px-2.5 py-1 rounded-md bg-surface hover:bg-surface-2 border border-line text-ink-2 hover:text-ink transition"
                title={`Click to fill: "${sample.text}"`}
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !transcript.trim()}
        className="btn btn-primary w-full shadow-sm"
      >
        <Volume2 className="w-4 h-4" />
        {loading ? 'Analysing...' : 'Analyse voice memo'}
      </button>
    </div>
  );
}
