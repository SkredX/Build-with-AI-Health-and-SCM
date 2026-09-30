'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import MapContainer and TileLayer with ssr: false
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Basemap: CARTO tiles now need a free key (https://carto.com/basemaps/apikey).
// Set NEXT_PUBLIC_CARTO_KEY to use them; otherwise fall back to keyless OpenStreetMap tiles.
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY || '';
const ATTRIBUTION = CARTO_KEY
  ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default function IndiaMap({ phcs = [], onSelectPHC }) {
  const [mounted, setMounted] = useState(false);

  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDark(mq.matches);
    const onChange = (e) => setDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 rounded-2xl bg-fill border border-line flex items-center justify-center tabular-nums text-sm text-ink-2">
        Loading map...
      </div>
    );
  }

  const tileUrl = CARTO_KEY
    ? `https://basemaps.cartocdn.com/rastertiles/${dark ? 'dark_all' : 'voyager'}/{z}/{x}/{y}.png?key=${CARTO_KEY}`
    : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Center on India (Jaipur / Central India region)
  const center = [23.5, 78.5];
  const zoom = 5;

  const defaultPhcs = [
    { name: 'Sanganer PHC', lat: 26.8156, lon: 75.7873, status: 'Warning', district: 'Jaipur', state: 'Rajasthan', ors: 32, asv: 4 },
    { name: 'Amber PHC', lat: 26.9855, lon: 75.8507, status: 'Warning', district: 'Jaipur', state: 'Rajasthan', ors: 190, asv: 12 },
    { name: 'Chomu PHC', lat: 27.1724, lon: 75.7208, status: 'Critical', district: 'Jaipur', state: 'Rajasthan', ors: 140, asv: 1 },
    { name: 'Jamwa Ramgarh PHC', lat: 27.0089, lon: 76.0125, status: 'Optimal', district: 'Jaipur', state: 'Rajasthan', ors: 210, asv: 8 },
    { name: 'Phulera PHC', lat: 26.8732, lon: 75.2394, status: 'Optimal', district: 'Jaipur', state: 'Rajasthan', ors: 300, asv: 10 },
    { name: 'Shahpura PHC', lat: 27.3917, lon: 75.9614, status: 'Optimal', district: 'Jaipur', state: 'Rajasthan', ors: 180, asv: 6 },
    { name: 'Pune Rural PHC', lat: 18.5204, lon: 73.8567, status: 'Optimal', district: 'Pune', state: 'Maharashtra', ors: 240, asv: 15 },
    { name: 'Ernakulam Node', lat: 9.9816, lon: 76.2999, status: 'Optimal', district: 'Ernakulam', state: 'Kerala', ors: 310, asv: 18 },
    { name: 'Varanasi Central', lat: 25.3176, lon: 82.9739, status: 'Warning', district: 'Varanasi', state: 'Uttar Pradesh', ors: 45, asv: 2 },
    { name: 'Kolkata Sub-Health', lat: 22.5726, lon: 88.3639, status: 'Optimal', district: 'Kolkata', state: 'West Bengal', ors: 220, asv: 9 },
  ];

  const displayList = phcs.length > 0 ? phcs : defaultPhcs;

  const getColor = (status) => {
    if (status === 'Critical') return '#ff3b30';
    if (status === 'Warning') return '#ff9500';
    return '#34c759';
  };

  return (
    <div className="w-full h-[520px] rounded-2xl overflow-hidden border border-line shadow-none relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          key={`${dark}-${CARTO_KEY ? 'carto' : 'osm'}`}
          attribution={ATTRIBUTION}
          url={tileUrl}
          className={!CARTO_KEY && dark ? 'osm-dark-tiles' : ''}
        />

        {displayList.map((p, idx) => {
          const lat = parseFloat(p.latitude || p.lat);
          const lon = parseFloat(p.longitude || p.lon);
          if (isNaN(lat) || isNaN(lon)) return null;

          const color = getColor(p.status);

          return (
            <CircleMarker
              key={p.phc_id || idx}
              center={[lat, lon]}
              radius={p.status === 'Critical' ? 10 : 7}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onSelectPHC && onSelectPHC(p),
              }}
            >
              <Popup>
                <div className="p-1 tabular-nums text-xs text-slate-900 space-y-1">
                  <p className="font-semibold text-ink text-sm">{p.phc_name || p.name}</p>
                  <p className="text-ink-3">
                    {p.district}, {p.state}
                  </p>
                  <div className="pt-1 border-t border-slate-200">
                    <p>Status: <strong>{p.status || 'Optimal'}</strong></p>
                    {p.ors !== undefined && <p>ORS Packets: {p.ors}</p>}
                    {p.asv !== undefined && <p>Antivenom: {p.asv} vials</p>}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 border p-3 rounded-xl z-[1000] text-sm space-y-1.5 glass">
        <p className="font-semibold text-ink  text-xs">Stock status</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-bad" />
          <span className="text-ink-2">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-warn" />
          <span className="text-ink-2">Warning</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-ok" />
          <span className="text-ink-2">Optimal</span>
        </div>
      </div>
    </div>
  );
}
