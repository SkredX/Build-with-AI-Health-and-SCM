'use client';

export default function Footer() {
  return (
    <footer className="bg-[#070d1f] border-t border-govBorder py-4 mt-8">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500">
        <div>
          <span>PHC-Connect Enterprise Stack</span> • <span>National Health Mission (NHM)</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>ABDM FHIR R4 Compliant</span>
          <span>Google Gemini AI</span>
          <span>IDSP Integrated</span>
        </div>
      </div>
    </footer>
  );
}
