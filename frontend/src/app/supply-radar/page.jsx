'use client';

import { useState } from 'react';
import PHCStockTable from '@/components/supply/PHCStockTable';
import ForecastChart from '@/components/supply/ForecastChart';
import AlertBanner from '@/components/supply/AlertBanner';
import Toast from '@/components/common/Toast';
import {
  Download,
  AlertOctagon,
  Truck,
  PlusCircle,
  Radio,
  CheckCircle,
} from 'lucide-react';
import { downloadJSON } from '@/lib/utils';

export default function SupplyRadarPage() {
  const [toastMsg, setToastMsg] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [alertDetails, setAlertDetails] = useState({
    title: 'MONSOON CHOLERA SURGE DETECTED (SANGANER SECTOR)',
    message: '380% Spike in Acute Diarrheal Outbreak in Sanganer within 24h. Stock exhaustion predicted in 6 hours.',
  });

  const [phcs, setPhcs] = useState([
    { phc_id: 'PHC-JR-301', name: 'Sanganer PHC', district: 'Jaipur Rural', state: 'Rajasthan', paracetamol: 18, ors: 32, amoxicillin: 95, antivenom: 4, status: 'Warning', coordinates: [75.7873, 26.8156] },
    { phc_id: 'PHC-JR-302', name: 'Amber PHC', district: 'Jaipur Rural', state: 'Rajasthan', paracetamol: 120, ors: 190, amoxicillin: 22, antivenom: 12, status: 'Warning', coordinates: [75.8507, 26.9855] },
    { phc_id: 'PHC-JR-303', name: 'Chomu PHC', district: 'Jaipur Rural', state: 'Rajasthan', paracetamol: 85, ors: 140, amoxicillin: 110, antivenom: 1, status: 'Critical', coordinates: [75.7208, 27.1724] },
    { phc_id: 'PHC-JR-304', name: 'Jamwa Ramgarh PHC', district: 'Jaipur Rural', state: 'Rajasthan', paracetamol: 160, ors: 210, amoxicillin: 140, antivenom: 8, status: 'Optimal', coordinates: [76.0125, 27.0089] },
    { phc_id: 'PHC-JR-305', name: 'Phulera PHC', district: 'Jaipur Rural', state: 'Rajasthan', paracetamol: 210, ors: 300, amoxicillin: 180, antivenom: 10, status: 'Optimal', coordinates: [75.2394, 26.8732] },
    { phc_id: 'PHC-JR-306', name: 'Shahpura PHC', district: 'Jaipur Rural', state: 'Rajasthan', paracetamol: 140, ors: 180, amoxicillin: 130, antivenom: 6, status: 'Optimal', coordinates: [75.9614, 27.3917] },
  ]);

  const [purchaseOrders, setPurchaseOrders] = useState([
    { id: 'PO-2026-901', destination: 'Chomu PHC', item: 'Polyvalent Antivenom (50 vials)', reason: 'Critical Stockout Threshold', status: 'In Transit', targetIdx: 2, restockItem: 'antivenom', qty: 50 },
    { id: 'PO-2026-894', destination: 'Amber PHC', item: 'Amoxicillin 500mg (300 caps)', reason: 'Respiratory Surge Trigger', status: 'Delivered', targetIdx: 1, restockItem: 'amoxicillin', qty: 300 },
  ]);

  const triggerSurge = (type) => {
    setShowAlert(true);
    if (type === 'cholera') {
      setPhcs((prev) =>
        prev.map((p, i) =>
          i === 0 ? { ...p, ors: 4, status: 'Critical' } : p
        )
      );
      setAlertDetails({
        title: 'CRITICAL ANOMALY: MONSOON CHOLERA SPIKE (SANGANER)',
        message: 'ORS supplies dropped to 4 packets. Emergency rehydration buffer required immediately.',
      });
      setToastMsg({ text: 'Simulated Anomaly: Cholera Surge in Sanganer PHC', type: 'warning' });
    } else if (type === 'snakebite') {
      setPhcs((prev) =>
        prev.map((p, i) =>
          i === 2 ? { ...p, antivenom: 0, status: 'Critical' } : p
        )
      );
      setAlertDetails({
        title: 'CRITICAL STOCKOUT: POLYVALENT ANTIVENOM (CHOMU PHC)',
        message: 'Chomu PHC has 0 vials of antivenom following snakebite admissions. High fatality risk without resupply.',
      });
      setToastMsg({ text: 'Emergency: Zero Antivenom in Chomu PHC', type: 'error' });
    }
  };

  const handleDispatchEmergencyBuffer = () => {
    const newPO = {
      id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
      destination: 'Sanganer PHC',
      item: 'Emergency ORS Packets (500 pkts) & IV Normal Saline',
      reason: 'Outbreak Early Warning Trigger',
      status: 'In Transit',
      targetIdx: 0,
      restockItem: 'ors',
      qty: 500,
    };
    setPurchaseOrders([newPO, ...purchaseOrders]);
    setShowAlert(false);
    setToastMsg({ text: 'Dispatched Priority Emergency PO to Central Warehouse!', type: 'success' });
  };

  const handleRestockPO = (idx) => {
    const po = purchaseOrders[idx];
    const updatedPOs = [...purchaseOrders];
    updatedPOs[idx] = { ...po, status: 'Delivered' };
    setPurchaseOrders(updatedPOs);

    setPhcs((prev) =>
      prev.map((p, i) => {
        if (i === po.targetIdx) {
          const itemKey = po.restockItem;
          return {
            ...p,
            [itemKey]: (p[itemKey] || 0) + po.qty,
            status: 'Optimal',
          };
        }
        return p;
      })
    );

    setToastMsg({ text: `Restocked ${po.destination} with ${po.qty} units!`, type: 'success' });
  };

  const handleExportGeoJSON = () => {
    const geojson = {
      type: 'FeatureCollection',
      metadata: {
        district: 'Jaipur Rural (Zone 04)',
        state: 'Rajasthan',
        standard: 'RFC 7946',
        timestamp: new Date().toISOString(),
      },
      features: phcs.map((p, i) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: p.coordinates,
        },
        properties: {
          phc_name: p.name,
          status: p.status,
          ors: p.ors,
          antivenom: p.antivenom,
          amoxicillin: p.amoxicillin,
        },
      })),
    };

    downloadJSON(geojson, `Jaipur_Rural_Outbreak_Surveillance_Grid_${Date.now()}.geojson`);
    setToastMsg({ text: 'Exported RFC 7946 GeoJSON Layer for QGIS & ArcGIS!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full">
          <Toast message={toastMsg.text} type={toastMsg.type} onClose={() => setToastMsg(null)} />
        </div>
      )}

      {/* Top Banner */}
      <div className="enterprise-card rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-warningAmber">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 status-pulse-amber" />
            <span className="text-xs font-mono font-bold uppercase text-amber-400">
              District Operational Command • Zone 04 Jaipur Rural
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Predictive Supply Chain & Outbreak Early-Warning Radar
          </h2>
          <p className="text-xs text-slate-400">
            Monitors drug depletion velocity across all PHCs, correlates clinical surges, and exports standard GIS outbreak layers for District Collector and CMHO spatial mapping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportGeoJSON}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono shadow flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export GIS GeoJSON (.geojson)</span>
          </button>
          <button
            type="button"
            onClick={() => triggerSurge('cholera')}
            className="px-2.5 py-1.5 rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 font-bold text-xs font-mono transition"
          >
            Simulate Cholera Spike
          </button>
          <button
            type="button"
            onClick={() => triggerSurge('snakebite')}
            className="px-2.5 py-1.5 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-xs font-mono transition"
          >
            Simulate Snakebite Crisis
          </button>
        </div>
      </div>

      {/* Outbreak Alert Banner */}
      {showAlert && (
        <AlertBanner
          title={alertDetails.title}
          message={alertDetails.message}
          onAction={handleDispatchEmergencyBuffer}
          actionLabel="Dispatch Emergency Buffer PO"
        />
      )}

      {/* PHC Stock Table */}
      <PHCStockTable phcs={phcs} />

      {/* Split Charts & Purchase Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ForecastChart />
        </div>

        {/* Autonomous Central Warehouse Purchase Orders Feed */}
        <div className="lg:col-span-5 enterprise-card rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-govBorder pb-2 mb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Truck className="w-4 h-4 text-clinicalEmerald" />
                Central Warehouse Purchase Orders
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Autonomous Reorder Feed</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {purchaseOrders.map((po, index) => (
                <div
                  key={po.id}
                  className="p-3 rounded-lg bg-[#0d182e] border border-govBorder flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-cyan-400">{po.id}</span>
                      <span className="text-slate-300">&rarr; {po.destination}</span>
                    </div>
                    <p className="text-slate-200 text-[11px] mt-0.5 font-semibold">{po.item}</p>
                    <p className="text-[10px] text-slate-500">Reason: {po.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    {po.status === 'In Transit' ? (
                      <button
                        type="button"
                        onClick={() => handleRestockPO(index)}
                        className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                        DELIVERED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-govBorder flex justify-between items-center text-xs font-mono text-slate-400">
            <span>
              Avg Depot Transit ETA: <strong className="text-emerald-400">3.2 Hours</strong>
            </span>
            <span className="text-cyan-400 text-[11px]">Direct Cold Chain Linked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
