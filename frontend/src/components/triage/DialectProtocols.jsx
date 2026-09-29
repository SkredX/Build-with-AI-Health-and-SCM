'use client';

import { useState } from 'react';
import { Languages, Volume2 } from 'lucide-react';
import { dialectProtocols, DIALECT_LABELS, DIALECT_TTS_LANG } from '@/data/dialectProtocols';

export default function DialectProtocols({ result }) {
  const [activeDialect, setActiveDialect] = useState('marwari');

  const getConditionKey = () => {
    if (!result) return 'cholera';
    const text = `${result.condition || ''} ${result.title || ''} ${result.symptoms || ''}`.toLowerCase();
    if (text.includes('snake') || text.includes('venom')) return 'snakebite';
    if (text.includes('bronch') || text.includes('breath') || text.includes('cough')) return 'respiratory';
    if (text.includes('dengue')) return 'dengue';
    if (text.includes('malaria')) return 'malaria';
    return 'cholera';
  };

  const conditionKey = getConditionKey();
  const conditionProtocols = dialectProtocols[conditionKey] || dialectProtocols.cholera;
  const guidanceText =
    conditionProtocols[activeDialect] ||
    result?.guidance_regional?.[activeDialect] ||
    conditionProtocols.hindi;

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(guidanceText);
    utterance.lang = DIALECT_TTS_LANG[activeDialect] || 'hi-IN';
    utterance.rate = activeDialect === 'marwari' ? 0.9 : 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-[#0d182e] p-3.5 rounded-lg border border-govBorder space-y-3">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-govBorder pb-2">
        <div className="flex items-center space-x-1.5">
          <Languages className="w-4 h-4 text-govAccent" />
          <span className="font-bold text-slate-200 text-xs font-mono">
            Regional Dialect ASHA Protocols
          </span>
        </div>

        {/* Dialect Switcher */}
        <div className="flex flex-wrap gap-1 text-[10px] font-mono">
          {Object.keys(DIALECT_LABELS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveDialect(key)}
              className={`px-2 py-0.5 rounded transition ${
                activeDialect === key
                  ? 'bg-cyan-600 text-slate-950 font-bold'
                  : 'bg-[#1c2541] text-slate-300 hover:text-white'
              }`}
            >
              {DIALECT_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {/* Protocol Text Box */}
      <div className="space-y-1.5 font-mono">
        <div className="flex justify-between items-center text-[10px] text-slate-400">
          <span>Active Script: {DIALECT_LABELS[activeDialect]}</span>
          <button
            type="button"
            onClick={handleSpeak}
            className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5 transition"
            title="Read Protocol Aloud (Speech Synthesis)"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>बोलो / Listen Audio</span>
          </button>
        </div>

        <p className="text-xs text-emerald-300 font-medium leading-relaxed bg-[#1c2541] p-3 rounded border border-govBorder font-sans">
          {guidanceText}
        </p>

        {result?.guidance_en && (
          <p className="text-[11px] text-slate-400 leading-relaxed font-sans pt-1">
            <strong>Standard Protocol (EN):</strong> {result.guidance_en}
          </p>
        )}
      </div>
    </div>
  );
}
