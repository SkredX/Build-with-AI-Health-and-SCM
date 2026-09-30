'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Stethoscope,
  TrendingDown,
  ArrowLeftRight,
  Map,
  ClipboardList,
  Activity,
} from 'lucide-react';

// Five primary destinations (fits a phone tab bar). Audit Log is a secondary destination.
const PRIMARY = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/triage', label: 'Triage', icon: Stethoscope },
  { href: '/supply-radar', label: 'Stock', icon: TrendingDown, long: 'Stock Forecast' },
  { href: '/redistribution', label: 'Transfers', icon: ArrowLeftRight },
  { href: '/outbreak-map', label: 'Map', icon: Map, long: 'Outbreak Map' },
];
const SECONDARY = [{ href: '/audit', label: 'Audit Log', icon: ClipboardList }];

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export default function Navbar() {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);

  return (
    <>
      {/* Top toolbar: functional layer, translucent */}
      <header className="glass sticky top-0 z-50 border-b" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="PHC-Connect home">
            <span className="w-8 h-8 rounded-lg bg-accent-fill text-white flex items-center justify-center">
              <Activity className="w-4.5 h-4.5" strokeWidth={2.5} />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">PHC-Connect</span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 flex-1">
            {[...PRIMARY, ...SECONDARY].map((l) => {
              const active = isActive(pathname, l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    active ? 'bg-ink/10 text-ink' : 'text-ink-2 hover:text-ink hover:bg-ink/5'
                  }`}
                >
                  {l.long || l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1 md:flex-none" />

          <button
            type="button"
            onClick={() => setOnline(!online)}
            aria-pressed={!online}
            title="Simulates offline mode (demo)"
            className="flex items-center gap-2 text-sm text-ink-2 hover:text-ink px-2.5 py-1.5 rounded-full hover:bg-ink/5 transition"
          >
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-ok' : 'bg-warn'}`} />
            <span>{online ? 'Online' : 'Offline (simulated)'}</span>
          </button>
        </div>
      </header>

      {/* Bottom tab bar on phones */}
      <nav
        aria-label="Primary"
        className="md:hidden glass fixed bottom-0 inset-x-0 z-50 border-t"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="grid grid-cols-5">
          {PRIMARY.map((l) => {
            const Icon = l.icon;
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                    active ? 'text-accent' : 'text-ink-2'
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={active ? 2.4 : 1.8} />
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
