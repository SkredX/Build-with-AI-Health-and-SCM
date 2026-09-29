'use client';

import { useState } from 'react';
import IndiaMap from '@/components/map/IndiaMap';
import { MapPin, Download, Code, Layers } from 'lucide-react';
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

      {/* Header */}
      <div className="enterprise-card rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-l-4 border-l-govAccent">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-govAccent" />
            <span className="text-xs font-mono font-bold uppercase text-govAccent">
              Geospatial Epidemic Surveillance Layer
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            National GIS Outbreak & Buffer Heatmap Layer
          </h2>
          <p className="text-xs text-slate-400">
            Interactive RFC 7946 geospatial layer mapped to data.gov.in and IDSP surveillance grids for District Magistrates and State Health Secretaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGeoJSONModal(true)}
            className="px-3 py-1.5 rounded bg-[#0d182e] hover:bg-slate-800 text-slate-300 font-mono text-xs border border-govBorder flex items-center gap-1.5 transition"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Inspect GeoJSON</span>
          </button>
          <button
            type="button"
            onClick={handleExportGeoJSON}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GeoJSON Layer</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9">
          <IndiaMap onSelectPHC={setSelectedPHC} />
        </div>

        {/* Selected PHC Details Card */}
        <div className="lg:col-span-3 space-y-4">
          <div className="enterprise-card rounded-xl p-4 space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-govBorder pb-2">
              <Layers className="w-4 h-4 text-govAccent" />
              Node Spatial Telemetry
            </h3>

            {selectedPHC ? (
              <div className="space-y-2">
                <p className="font-bold text-cyan-400 text-sm">{selectedPHC.name || selectedPHC.phc_name}</p>
                <p className="text-slate-300">
                  {selectedPHC.district}, {selectedPHC.state}
                </p>
                <div className="p-2.5 rounded bg-[#0d182e] border border-govBorder space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Tier:</span>
                    <strong className="text-white">{selectedPHC.status}</strong>
                  </div>
                  {selectedPHC.ors !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">ORS:</span>
                      <strong className="text-amber-400">{selectedPHC.ors} pkts</strong>
                    </div>
                  )}
                  {selectedPHC.asv !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Antivenom:</span>
                      <strong className="text-rose-400">{selectedPHC.asv} vials</strong>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center">
                Click any node on the map to inspect its real-time GPS coordinates, stock buffers, and IDSP hazard alert levels.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* GeoJSON Modal */}
      {showGeoJSONModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="enterprise-card max-w-2xl w-full rounded-xl p-5 space-y-3 border border-govBorder shadow-2xl">
            <div className="flex justify-between items-center border-b border-govBorder pb-2">
              <h4 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-govAccent" />
                GIS GeoJSON Outbreak Layer (RFC 7946 Standard)
              </h4>
              <button
                onClick={() => setShowGeoJSONModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="bg-[#0d182e] p-3 rounded-lg border border-govBorder font-mono text-[11px] text-cyan-300 max-h-72 overflow-y-auto">
              {JSON.stringify(sampleGeoJSON, null, 2)}
            </pre>
            <div className="flex justify-end gap-2 pt-2 border-t border-govBorder">
              <button
                type="button"
                onClick={() => setShowGeoJSONModal(false)}
                className="px-3 py-1.5 rounded bg-[#0d182e] hover:bg-slate-800 text-slate-300 text-xs font-mono border border-govBorder"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleExportGeoJSON}
                className="px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono"
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
