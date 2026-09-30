'use client';

import { useState } from 'react';
import IndiaMap from '@/components/map/IndiaMap';
import { MapPin, Download, Code, Layers, X } from 'lucide-react';
import { downloadJSON } from '@/lib/utils';
import Toast from '@/components/common/Toast';

export default function OutbreakMapPage() {
  const [toastMsg, setToastMsg] = useState(null);
  const [selectedPHC, setSelectedPHC] = useState(null);
  const [showGeoJSONModal, setShowGeoJSONModal] = useState(false);

  const sampleGeoJSON = {
    type: 'FeatureCollection',
    metadata: {
      district: 'Jaipur Rural (Zone 04)',
      state: 'Rajasthan',
      standard: 'RFC 7946',
      timestamp: new Date().toISOString(),
    },
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [75.7873, 26.8156] },
        properties: { phc_name: 'Sanganer PHC', status: 'Warning', alert: 'Cholera Surge' },
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [75.7208, 27.1724] },
        properties: { phc_name: 'Chomu PHC', status: 'Critical', alert: 'Antivenom Stockout' },
      },
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [75.7773, 26.8056],
            [75.7973, 26.8056],
            [75.7973, 26.8256],
            [75.7773, 26.8256],
            [75.7773, 26.8056],
          ]],
        },
        properties: {
          hazard_zone: 'Sanganer Acute Diarrheal Containment Ring',
          radius_km: 5.0,
          epidemic_type: 'Cholera / Water-Borne Surge',
          alert_level: 'RED TIER-1',
        },
      },
    ],
  };

  const handleExportGeoJSON = () => {
    downloadJSON(sampleGeoJSON, `Jaipur_Rural_GIS_Layer_${Date.now()}.geojson`);
    setToastMsg({ text: 'Downloaded WGS84 GeoJSON layer for ArcGIS & QGIS!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
          <Toast message={toastMsg.text} type={toastMsg.type} onClose={() => setToastMsg(null)} />
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Outbreak Map</h1>
          <p className="text-ink-2 mt-1 max-w-2xl">Health centres coloured by stock status. Select a marker for details.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowGeoJSONModal(true)} className="btn btn-plain">
            <Code className="w-4 h-4" aria-hidden="true" /> View data
          </button>
          <button type="button" onClick={handleExportGeoJSON} className="btn btn-quiet">
            <Download className="w-4 h-4" aria-hidden="true" /> Export map data
          </button>
        </div>
      </header>

      {/* Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <IndiaMap onSelectPHC={setSelectedPHC} />
        </div>

        {/* Selected PHC Details Card */}
        <div className="lg:col-span-3 space-y-4">
          <div className="enterprise-card rounded-2xl p-4 space-y-3 tabular-nums text-xs">
            <h3 className="text-xs font-semibold text-ink   flex items-center gap-1.5 border-b border-line pb-2">
              <Layers className="w-4 h-4 text-accent" />
              Node Spatial Telemetry
            </h3>

            {selectedPHC ? (
              <div className="space-y-2">
                <p className="font-semibold text-accent text-sm">{selectedPHC.name || selectedPHC.phc_name}</p>
                <p className="text-ink-2">
                  {selectedPHC.district}, {selectedPHC.state}
                </p>
                <div className="p-2.5 rounded bg-fill border border-line space-y-1">
                  <div className="flex justify-between">
                    <span className="text-ink-2">Risk Tier:</span>
                    <strong className="text-ink">{selectedPHC.status}</strong>
                  </div>
                  {selectedPHC.ors !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-ink-2">ORS:</span>
                      <strong className="text-warn">{selectedPHC.ors} pkts</strong>
                    </div>
                  )}
                  {selectedPHC.asv !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-ink-2">Antivenom:</span>
                      <strong className="text-bad">{selectedPHC.asv} vials</strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-ink-2 text-xs py-4 text-center">
                Click any node on the map to inspect its real-time GPS coordinates, stock buffers, and IDSP hazard alert levels.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* GeoJSON Modal */}
      {showGeoJSONModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card max-w-2xl w-full rounded-2xl p-5 space-y-3 border border-line shadow-none">
            <div className="flex justify-between items-center border-b border-line pb-2">
              <h4 className="text-sm font-semibold tabular-nums text-ink flex items-center gap-2">
                <Code className="w-4 h-4 text-accent" />
                GIS GeoJSON Outbreak Layer (RFC 7946 Standard)
              </h4>
              <button
                onClick={() => setShowGeoJSONModal(false)}
                className="text-ink-2 hover:text-ink"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <pre className="bg-fill p-3 rounded-lg border border-line tabular-nums text-xs text-accent max-h-72 overflow-y-auto">
              {JSON.stringify(sampleGeoJSON, null, 2)}
            </pre>
            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setShowGeoJSONModal(false)}
                className="px-3 py-1.5 rounded bg-fill hover:bg-fill text-ink-2 text-xs tabular-nums border border-line"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleExportGeoJSON}
                className="px-3.5 py-1.5 rounded bg-accent-fill hover:brightness-110 text-white font-semibold text-xs tabular-nums"
              >
                Download .geojson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
