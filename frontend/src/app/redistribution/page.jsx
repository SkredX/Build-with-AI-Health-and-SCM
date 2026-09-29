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

      {/* Top Banner */}
      <div className="enterprise-card rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-l-4 border-l-govAccent">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 status-pulse-emerald" />
            <span className="text-xs font-mono font-bold uppercase text-cyan-400">
              District Lateral Logistics Optimization
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Inter-PHC Emergency Stock Balancing Network
          </h2>
          <p className="text-xs text-slate-400">
            Rebalance vital pharmaceuticals between surplus and deficit health centres directly via district 108 ambulances or rapid couriers without central warehouse latency.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-[#0d182e] p-2.5 rounded-lg border border-govBorder text-center">
            <span className="text-[10px] text-slate-400 block">Surplus Hub</span>
            <span className="text-white font-bold">Jamwa Ramgarh</span>
          </div>
          <div className="bg-[#0d182e] p-2.5 rounded-lg border border-govBorder text-center">
            <span className="text-[10px] text-slate-400 block">Critical Need</span>
            <span className="text-rose-400 font-bold">Chomu (Antivenom)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 enterprise-card rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-govBorder pb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-govAccent" />
            Initiate Lateral Stock Transfer
          </h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Source Health Centre (Surplus)</label>
              <select
                value={sourceIdx}
                onChange={(e) => setSourceIdx(e.target.value)}
                className="w-full bg-[#0d182e] border border-govBorder rounded px-3 py-2 text-white focus:outline-none focus:border-govAccent"
              >
                <option value="3">Jamwa Ramgarh PHC (8 Antivenom, 210 ORS)</option>
                <option value="4">Phulera PHC (10 Antivenom, 300 ORS)</option>
                <option value="5">Shahpura PHC (6 Antivenom, 180 ORS)</option>
                <option value="1">Amber PHC (12 Antivenom, 190 ORS)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Destination Health Centre (Deficit / Critical)
              </label>
              <select
                value={destIdx}
                onChange={(e) => setDestIdx(e.target.value)}
                className="w-full bg-[#0d182e] border border-govBorder rounded px-3 py-2 text-white focus:outline-none focus:border-govAccent"
              >
                <option value="2">Chomu PHC (1 Antivenom - CRITICAL)</option>
                <option value="0">Sanganer PHC (18 Paracetamol - WARNING)</option>
                <option value="1">Amber PHC (22 Amoxicillin - WARNING)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Commodity</label>
                <select
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full bg-[#0d182e] border border-govBorder rounded px-3 py-2 text-white focus:outline-none focus:border-govAccent"
                >
                  <option value="antivenom">Polyvalent Antivenom</option>
                  <option value="ors">ORS Packets</option>
                  <option value="amoxicillin">Amoxicillin 500mg</option>
                  <option value="paracetamol">Paracetamol Syrup</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#0d182e] border border-govBorder rounded px-3 py-2 text-white focus:outline-none focus:border-govAccent"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Dispatch Mechanism</label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full bg-[#0d182e] border border-govBorder rounded px-3 py-2 text-white focus:outline-none focus:border-govAccent"
              >
                <option value="Ambulance 108 Return Leg">Ambulance 108 Return Leg (ETA ~45 mins)</option>
                <option value="District Vaccine Cold-Van">District Vaccine Cold-Van (ETA ~1.2 hrs)</option>
                <option value="Rapid Drone Delivery Pilot">Rapid Drone Delivery Pilot (ETA ~22 mins)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleExecuteTransfer}
              className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Dispatch Lateral Stock Rebalance</span>
            </button>
          </div>
        </div>

        {/* Missions Feed (7 cols) */}
        <div className="lg:col-span-7 enterprise-card rounded-xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-govBorder pb-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Truck className="w-4 h-4 text-govAccent" />
              Active Lateral Transfer Missions
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Autonomous Routing Active</span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className="p-3.5 rounded-lg bg-[#0d182e] border border-govBorder flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cyan-400">{mission.id}</span>
                    <span className="text-white font-bold">
                      {mission.from} &rarr; {mission.to}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs mt-1 font-semibold">{mission.item}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    {mission.mode.includes('Drone') ? (
                      <Plane className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <Truck className="w-3 h-3 text-amber-400" />
                    )}
                    <span>Mechanism: {mission.mode}</span>
                  </p>
                </div>
                <div className="text-right">
                  {mission.status === 'Completed' ? (
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> COMPLETED
                    </span>
                  ) : (
                    <span className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 animate-pulse">
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
