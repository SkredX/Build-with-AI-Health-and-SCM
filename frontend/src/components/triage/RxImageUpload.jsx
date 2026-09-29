'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon } from 'lucide-react';

export default function RxImageUpload({
  onImageSelected,
  onSubmit,
  loading = false,
}) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const base64 = evt.target?.result;
        setPreview(base64);
        onImageSelected(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleRx = (type) => {
    let title = 'OPD PRESCRIPTION - CHOLERA SURGE';
    let rxText = 'Rx:\n1. Tab Doxycycline 100mg BD x 3d\n2. Sachet ORS x 10 pkts in boiled water\n3. Tab Zinc 20mg OD x 14d';

    if (type === 'snakebite') {
      title = 'EMERGENCY CASUALTY - SNAKEBITE';
      rxText = 'Rx:\n1. Inj. Polyvalent ASV 10 vials in 500ml NS over 1 hr\n2. Inj. Tetanus Toxoid 0.5ml IM stat';
    } else if (type === 'respiratory') {
      title = 'PEDIATRIC / GERIATRIC RESPIRATORY';
      rxText = 'Rx:\n1. Cap. Amoxicillin 500mg TDS x 5d\n2. Salbutamol Nebulization 2.5mg PRN';
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150">
        <rect width="100%" height="100%" fill="#f8fafc" rx="6" />
        <rect x="10" y="10" width="280" height="25" fill="#0284c7" rx="3" />
        <text x="150" y="27" fill="#ffffff" font-family="sans-serif" font-size="10" font-weight="bold" text-anchor="middle">${title}</text>
        <text x="20" y="55" fill="#0f172a" font-family="monospace" font-size="9" font-weight="bold">Jaipur Rural Medical Health Centre</text>
        <text x="20" y="75" fill="#334155" font-family="monospace" font-size="8">${rxText.split('\n')[0]}</text>
        <text x="20" y="90" fill="#334155" font-family="monospace" font-size="8">${rxText.split('\n')[1] || ''}</text>
        <text x="20" y="105" fill="#334155" font-family="monospace" font-size="8">${rxText.split('\n')[2] || ''}</text>
      </svg>
    `;

    const base64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    setPreview(base64);
    onImageSelected(base64);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-400">
        <span>Upload prescription or choose pre-verified sample:</span>
        <div className="flex gap-1 text-[10px] font-mono">
          <button
            type="button"
            onClick={() => loadSampleRx('cholera')}
            className="px-2 py-0.5 rounded bg-[#0d182e] border border-govBorder text-amber-300 hover:border-amber-500 transition"
          >
            Sample Cholera
          </button>
          <button
            type="button"
            onClick={() => loadSampleRx('snakebite')}
            className="px-2 py-0.5 rounded bg-[#0d182e] border border-govBorder text-rose-300 hover:border-rose-500 transition"
          >
            Sample Snakebite
          </button>
          <button
            type="button"
            onClick={() => loadSampleRx('respiratory')}
            className="px-2 py-0.5 rounded bg-[#0d182e] border border-govBorder text-cyan-300 hover:border-cyan-500 transition"
          >
            Sample Bronchitis
          </button>
        </div>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-govBorder hover:border-govAccent rounded-lg p-5 text-center bg-[#0d182e] transition cursor-pointer"
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
              className="max-h-36 mx-auto rounded border border-govBorder shadow"
            />
            <p className="text-[10px] text-cyan-400 font-mono">Image loaded • Click to replace</p>
          </div>
        ) : (
          <div className="space-y-2 py-3">
            <UploadCloud className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-xs font-semibold text-slate-300">
              Click to upload doctor prescription photo or clinical report
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Supports JPG, PNG, WEBP for Gemini Multimodal Vision OCR
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !preview}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.99] disabled:opacity-50"
      >
        <ImageIcon className="w-4 h-4" />
        {loading ? 'Analyzing with Gemini Vision...' : 'Parse Rx Image with Gemini Vision'}
      </button>
    </div>
  );
}
