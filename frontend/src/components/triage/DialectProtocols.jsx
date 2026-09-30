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
    <section className="bg-fill rounded-2xl p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="font-semibold flex items-center gap-2">
          <Languages className="w-4 h-4 text-ink-2" aria-hidden="true" /> Advice for the family
        </h3>
        <div className="flex flex-wrap gap-0.5 bg-surface p-1 rounded-xl" role="tablist">
          {Object.keys(DIALECT_LABELS).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeDialect === key}
              onClick={() => setActiveDialect(key)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                activeDialect === key ? 'bg-fill text-ink' : 'text-ink-2 hover:text-ink'
              }`}
            >
              {DIALECT_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[17px] leading-relaxed">{guidanceText}</p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={handleSpeak} className="btn btn-quiet !min-h-0 !py-1.5 text-sm">
          <Volume2 className="w-4 h-4" aria-hidden="true" /> Read aloud
        </button>
        {result?.guidance_en && (
          <p className="text-sm text-ink-2 basis-full">
            <span className="font-medium text-ink">In English:</span> {result.guidance_en}
          </p>
        )}
      </div>
    </section>
  );
}
