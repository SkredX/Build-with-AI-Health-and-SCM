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

export default function IndiaMap({ phcs = [], onSelectPHC }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-96 rounded-xl bg-[#0d182e] border border-govBorder flex items-center justify-center font-mono text-xs text-slate-400">
        Initializing Spatial GIS Layer...
      </div>
    );
  }

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
    if (status === 'Critical') return '#ef4444';
    if (status === 'Warning') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden border border-govBorder shadow-2xl relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                <div className="p-1 font-mono text-xs text-slate-900 space-y-1">
                  <p className="font-bold text-slate-950 text-sm">{p.phc_name || p.name}</p>
                  <p className="text-slate-600">
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
      <div className="absolute bottom-4 right-4 bg-[#070d1f]/90 border border-govBorder p-3 rounded-lg z-[1000] text-[11px] font-mono space-y-1 backdrop-blur-sm">
        <p className="font-bold text-white uppercase text-[10px]">Triage Risk Tier</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">Tier 1: Critical (Stockout Risk)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-slate-300">Tier 2: Warning Buffer</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-slate-300">Tier 3: Optimal Reserve</span>
        </div>
      </div>
    </div>
  );
}
