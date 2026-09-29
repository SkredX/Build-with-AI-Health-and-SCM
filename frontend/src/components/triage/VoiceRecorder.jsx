'use client';

import { Mic, MicOff, Volume2 } from 'lucide-react';
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
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Record field audio memo in your dialect:</span>
        <div className="flex items-center space-x-1 text-[11px] font-mono">
          <span className="text-slate-500 mr-1">Dialect:</span>
          {SPEECH_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange(lang.code)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                language === lang.code
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-[#0d182e]'
              }`}
            >
              {lang.short}
            </button>
          ))}
        </div>
      </div>

      {/* Recording Box */}
      <div className="p-4 rounded-lg bg-[#0d182e] border border-govBorder text-center space-y-3 relative overflow-hidden">
        {isRecording && (
          <div className="absolute inset-0 bg-cyan-500/5 animate-pulse pointer-events-none" />
        )}

        <div className="text-xs font-mono relative z-10">
          {isRecording ? (
            <span className="text-rose-400 font-bold flex items-center justify-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Recording Live Voice ({language})... Speak Now
            </span>
          ) : (
            <span className="text-slate-400">Microphone Ready • Click Mic to Speak or Edit Below</span>
          )}
        </div>

        <div className="flex justify-center items-center space-x-3 relative z-10">
          <button
            type="button"
            onClick={onToggleRecording}
            className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-lg shadow-lg transition-transform active:scale-95 ${
              isRecording
                ? 'bg-rose-600 animate-bounce'
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* Live Editable Transcript */}
        <div className="text-left space-y-1 relative z-10">
          <label className="block text-[10px] font-mono text-slate-400">
            Spoken Memo Transcript (Speech-to-Text or Type Direct):
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            className="w-full bg-[#1c2541] border border-govBorder rounded p-2.5 text-xs text-white font-mono focus:outline-none focus:border-govAccent"
            placeholder="Microphone transcription will appear here. e.g. रोगी ने तेज दस्त और उल्टी की शिकायत है। बहुत प्यास लाग री है..."
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !transcript.trim()}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] disabled:opacity-50"
      >
        <Volume2 className="w-4 h-4" />
        {loading ? 'Processing with Gemini...' : 'Process Voice Intake with Gemini'}
      </button>
    </div>
  );
}
