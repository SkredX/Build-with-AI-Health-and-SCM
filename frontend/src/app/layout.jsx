import './globals.css';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'PHC-Connect Enterprise | National Health Mission',
  description: 'Federated AI platform for national-scale health resource and supply chain management across India\'s PHC network',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="h-full flex flex-col font-sans antialiased grid-bg text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
        <footer className="bg-[#070d1f] border-t border-govBorder py-3 text-center text-[10px] font-mono text-slate-500">
          PHC-Connect Enterprise © 2026 | National Health Mission • ABDM Compliant • Powered by Google Gemini AI
        </footer>
      </body>
    </html>
  );
}
