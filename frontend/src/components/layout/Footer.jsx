import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-8 pb-28 md:pb-10 text-xs text-ink-2 flex flex-wrap gap-x-4 gap-y-1">
      <span>PHC-Connect · National Health Mission demo</span>
      <span>Synthetic data. Not for clinical use.</span>
      <Link href="/audit" className="text-accent hover:underline">Audit log</Link>
    </footer>
  );
}
