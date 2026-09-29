'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Stethoscope,
  Radio,
  ArrowLeftRight,
  MapPin,
  ClipboardList,
  ShieldCheck,
  Brain,
  Wifi,
  WifiOff,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isOnline, setIsOnline] = useState(true);

  const navLinks = [
    { href: '/', label: 'Overview', icon: Activity },
    { href: '/triage', label: 'Field Triage', icon: Stethoscope },
    { href: '/supply-radar', label: 'Supply Radar', icon: Radio },
    { href: '/redistribution', label: 'Redistribution', icon: ArrowLeftRight },
    { href: '/outbreak-map', label: 'GIS Outbreak Map', icon: MapPin },
    { href: '/audit', label: 'Audit Log', icon: ClipboardList },
  ];

  return (
    <header className="bg-[#070d1f] border-b border-govBorder sticky top-0 z-50 shadow-lg">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-md border border-cyan-300/30 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-extrabold tracking-tight text-white uppercase">
                    PHC-Connect
                  </span>
                  <span className="bg-cyan-950/80 text-cyan-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border border-cyan-800/60 uppercase">
                    NHM Grid v5.0
                  </span>
                  <span className="hidden sm:inline-flex bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/20 items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> ABDM Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  National Health Mission • AI Supply Grid, Predictive Radar & ABDM Stack
                </p>
              </div>
            </Link>
          </div>

          {/* Right Header Status Badges */}
          <div className="flex items-center space-x-3">
            {/* Online / Offline Sync Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className="flex items-center space-x-1.5 bg-[#0d182e] px-2.5 py-1.5 rounded-lg border border-govBorder text-xs hover:border-cyan-500/50 transition"
              title="Toggle Offline Local Simulation / Online Mode"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-400 status-pulse-emerald' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300 font-mono text-[11px] hidden md:inline">
                {isOnline ? 'ONLINE (GCP Sync)' : 'OFFLINE (Local Cache)'}
              </span>
              {isOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              )}
            </button>

            {/* AI Engine Badge */}
            <div className="flex items-center space-x-1.5 bg-[#0d182e] px-2.5 py-1.5 rounded-lg border border-govBorder text-xs font-mono">
              <Brain className="w-3.5 h-3.5 text-warningAmber" />
              <span className="text-slate-300 text-[11px] hidden sm:inline">Gemini 2.0 Flash</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full status-pulse-emerald" />
            </div>
          </div>
        </div>
      </div>

      {/* Nav Link Bar */}
      <div className="bg-[#0d182e] border-t border-govBorder/60 px-4 sm:px-6">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1 py-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-semibold rounded-md flex items-center gap-2 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-govCard text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-slate-400 pr-2">
            <span>Protocol: <strong className="text-slate-200">ICMR / NHM-2026</strong></span>
            <span>•</span>
            <span className="text-emerald-400">ABDM M1/M2 Certified</span>
          </div>
        </div>
      </div>
    </header>
  );
}
