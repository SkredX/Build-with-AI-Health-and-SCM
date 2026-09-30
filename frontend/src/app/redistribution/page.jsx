'use client';

import { useState } from 'react';
import { ArrowLeftRight, Truck, Plane, Clock, CheckCircle2 } from 'lucide-react';
import Toast from '@/components/common/Toast';

export default function RedistributionPage() {
  const [toastMsg, setToastMsg] = useState(null);
  const [sourceIdx, setSourceIdx] = useState('3');
  const [destIdx, setDestIdx] = useState('2');
  const [item, setItem] = useState('antivenom');
  const [qty, setQty] = useState(3);
  const [vehicle, setVehicle] = useState('Ambulance 108 Return Leg');

  const [phcs, setPhcs] = useState([
    { name: 'Sanganer PHC', paracetamol: 18, ors: 32, amoxicillin: 95, antivenom: 4 },
    { name: 'Amber PHC', paracetamol: 120, ors: 190, amoxicillin: 22, antivenom: 12 },
    { name: 'Chomu PHC', paracetamol: 85, ors: 140, amoxicillin: 110, antivenom: 1 },
    { name: 'Jamwa Ramgarh PHC', paracetamol: 160, ors: 210, amoxicillin: 140, antivenom: 8 },
    { name: 'Phulera PHC', paracetamol: 210, ors: 300, amoxicillin: 180, antivenom: 10 },
    { name: 'Shahpura PHC', paracetamol: 140, ors: 180, amoxicillin: 130, antivenom: 6 },
  ]);

  const [missions, setMissions] = useState([
    {
      id: 'LAT-884',
      from: 'Jamwa Ramgarh PHC',
      to: 'Chomu PHC',
      item: 'Polyvalent Antivenom (3 vials)',
      mode: 'Ambulance 108 Return Leg',
      eta: '32 mins',
      status: 'In Transit',
    },
    {
      id: 'LAT-881',
      from: 'Phulera PHC',
      to: 'Sanganer PHC',
      item: 'ORS Sachets (200 pkts)',
      mode: 'Rapid Drone Delivery Pilot',
      eta: 'Delivered',
      status: 'Completed',
    },
  ]);

  const handleExecuteTransfer = () => {
    const sIdx = parseInt(sourceIdx, 10);
    const dIdx = parseInt(destIdx, 10);

    if (sIdx === dIdx) {
      setToastMsg({ text: 'Source and Destination health centres cannot be identical.', type: 'warning' });
      return;
    }

    const src = phcs[sIdx];
    const dest = phcs[dIdx];

    if ((src[item] || 0) < qty) {
      setToastMsg({
        text: `Insufficient stock in ${src.name}. Only ${src[item] || 0} units available.`,
        type: 'warning',
      });
      return;
    }

    // Update local state
    setPhcs((prev) =>
      prev.map((p, i) => {
        if (i === sIdx) return { ...p, [item]: p[item] - qty };
        if (i === dIdx) return { ...p, [item]: p[item] + qty };
        return p;
      })
    );

    const isDrone = vehicle.includes('Drone');
    const newMission = {
      id: `LAT-${Math.floor(100 + Math.random() * 900)}`,
      from: src.name,
      to: dest.name,
      item: `${qty} ${item.toUpperCase()}`,
      mode: vehicle,
      eta: isDrone ? '18 mins' : '40 mins',
      status: 'In Transit',
    };

    setMissions([newMission, ...missions]);
    setToastMsg({
      text: `Dispatched ${qty} ${item.toUpperCase()} from ${src.name} to ${dest.name}!`,
      type: 'success',
    });
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
          <h1 className="text-3xl font-semibold tracking-tight">Transfers</h1>
          <p className="text-ink-2 mt-1 max-w-2xl">Move medicine from centres with a surplus to centres that are running low, by ambulance or courier.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 enterprise-card rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-ink   tabular-nums border-b border-line pb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-accent" />
            Initiate Lateral Stock Transfer
          </h3>

          <div className="space-y-3 text-xs tabular-nums">
            <div>
              <label className="block text-ink-2 mb-1">Source Health Centre (Surplus)</label>
              <select
                value={sourceIdx}
                onChange={(e) => setSourceIdx(e.target.value)}
                className="field"
              >
                <option value="3">Jamwa Ramgarh PHC (8 Antivenom, 210 ORS)</option>
                <option value="4">Phulera PHC (10 Antivenom, 300 ORS)</option>
                <option value="5">Shahpura PHC (6 Antivenom, 180 ORS)</option>
                <option value="1">Amber PHC (12 Antivenom, 190 ORS)</option>
              </select>
            </div>

            <div>
              <label className="block text-ink-2 mb-1">
                Destination Health Centre (Deficit / Critical)
              </label>
              <select
                value={destIdx}
                onChange={(e) => setDestIdx(e.target.value)}
                className="field"
              >
                <option value="2">Chomu PHC (1 Antivenom - CRITICAL)</option>
                <option value="0">Sanganer PHC (18 Paracetamol - WARNING)</option>
                <option value="1">Amber PHC (22 Amoxicillin - WARNING)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ink-2 mb-1">Commodity</label>
                <select
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="field"
                >
                  <option value="antivenom">Polyvalent Antivenom</option>
                  <option value="ors">ORS Packets</option>
                  <option value="amoxicillin">Amoxicillin 500mg</option>
                  <option value="paracetamol">Paracetamol Syrup</option>
                </select>
              </div>
              <div>
                <label className="block text-ink-2 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
                  className="field"
                />
              </div>
            </div>

            <div>
              <label className="block text-ink-2 mb-1">Dispatch Mechanism</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="field"
              >
                <option value="Ambulance 108 Return Leg">Ambulance 108 Return Leg (ETA ~45 mins)</option>
                <option value="District Vaccine Cold-Van">District Vaccine Cold-Van (ETA ~1.2 hrs)</option>
                <option value="Rapid Drone Delivery Pilot">Rapid Drone Delivery Pilot (ETA ~22 mins)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExecuteTransfer}
              className="w-full py-2.5 rounded-lg bg-accent-fill hover:brightness-110 text-white font-semibold   text-xs flex items-center justify-center gap-2 shadow-none transition active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Dispatch Lateral Stock Rebalance</span>
            </button>
          </div>
        </div>

        {/* Missions Feed (7 cols) */}
        <div className="lg:col-span-7 enterprise-card rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-line pb-2">
            <h3 className="text-xs font-semibold text-ink   tabular-nums flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" />
              Active Lateral Transfer Missions
            </h3>
            <span className="text-xs tabular-nums text-ok">Autonomous Routing Active</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="p-3.5 rounded-lg bg-fill border border-line flex items-center justify-between text-xs tabular-nums"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-accent">{mission.id}</span>
                    <span className="text-ink font-semibold">
                      {mission.from} &rarr; {mission.to}
                    </span>
                  </div>
                  <p className="text-ink text-xs mt-1 font-semibold">{mission.item}</p>
                  <p className="text-xs text-ink-2 mt-0.5 flex items-center gap-1">
                    {mission.mode.includes('Drone') ? (
                      <Plane className="w-3 h-3 text-accent" />
                    ) : (
                      <Truck className="w-3 h-3 text-warn" />
                    )}
                    <span>Mechanism: {mission.mode}</span>
                  </p>
                </div>
                <div className="text-right">
                  {mission.status === 'Completed' ? (
                    <span className="bg-ok/10 text-ok border border-ok/20 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED
                    </span>
                  ) : (
                    <span className="bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1 animate-pulse">
                      <Clock className="w-3 h-3" /> EN ROUTE ({mission.eta})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
