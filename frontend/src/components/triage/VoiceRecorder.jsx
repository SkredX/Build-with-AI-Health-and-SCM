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
            className={`w-16 h-16 rounded-full text-white flex items-center justify-center transition-transform active:scale-95 ${
              isRecording
                ? 'bg-bad'
                : 'bg-accent-fill'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        </div>

        {/* Live Editable Transcript */}
        <div className="text-left space-y-1 relative z-10">
          <label className="block text-xs tabular-nums text-ink-2">
            Transcript (you can edit it)
          </label>
          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => onTranscriptChange(e.target.value)}
            className="field"
            placeholder="Microphone transcription will appear here. e.g. रोगी ने तेज दस्त और उल्टी की शिकायत है। बहुत प्यास लाग री है..."
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !transcript.trim()}
        className="btn btn-primary w-full"
      >
        <Volume2 className="w-4 h-4" />
        {loading ? 'Analysing...' : 'Analyse voice memo'}
      </button>
    </div>
  );
}
