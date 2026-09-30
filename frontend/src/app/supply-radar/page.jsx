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

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Stock Forecast</h1>
          <p className="text-ink-2 mt-1 max-w-2xl">
            Medicine stock at each health centre in Jaipur Rural, with a 7-day demand forecast.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => triggerSurge('cholera')} className="btn btn-plain">
            Demo: cholera surge
          </button>
          <button type="button" onClick={() => triggerSurge('snakebite')} className="btn btn-plain">
            Demo: snakebite cases
          </button>
          <button type="button" onClick={handleExportGeoJSON} className="btn btn-quiet">
            <Download className="w-4 h-4" aria-hidden="true" />
            Export map data
          </button>
        </div>
      </header>

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
        <div className="lg:col-span-5 enterprise-card rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-line pb-2 mb-3">
              <h3 className="text-xs font-semibold text-ink   tabular-nums flex items-center gap-2">
                <Truck className="w-4 h-4 text-ok" />
                Central Warehouse Purchase Orders
              </h3>
              <span className="text-xs tabular-nums text-ink-2">Autonomous Reorder Feed</span>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {purchaseOrders.map((po, index) => (
                <div
                  key={po.id}
                  className="p-3 rounded-lg bg-fill border border-line flex items-center justify-between text-xs tabular-nums"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-accent">{po.id}</span>
                      <span className="text-ink-2">&rarr; {po.destination}</span>
                    </div>
                    <p className="text-ink text-xs mt-0.5 font-semibold">{po.item}</p>
                    <p className="text-xs text-ink-3">Reason: {po.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    {po.status === 'In Transit' ? (
                      <button
                        type="button"
                        onClick={() => handleRestockPO(index)}
                        className="px-2 py-1 rounded bg-ok/20 hover:bg-ok/30 text-ok border border-ok/40 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    ) : (
                      <span className="bg-ok/10 text-ok border border-ok/20 px-2 py-0.5 rounded text-xs font-semibold">
                        DELIVERED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-line flex justify-between items-center text-xs tabular-nums text-ink-2">
            <span>
              Avg Depot Transit ETA: <strong className="text-ok">3.2 Hours</strong>
            </span>
            <span className="text-accent text-xs">Direct Cold Chain Linked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
