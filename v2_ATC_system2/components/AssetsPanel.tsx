
import React from 'react';
import { Drone, DroneStatus } from '../types';

interface Props {
  drones: Drone[];
  selectedDroneId: string | null;
  onSelectDrone: (id: string | null) => void;
}

const StatusBadge: React.FC<{ status: DroneStatus }> = ({ status }) => {
  const colorClass = status === 'FLYING' ? 'bg-green-500/10 text-green-500' : 
                    status === 'PAUSED' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-500';
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${colorClass}`}>
      {status}
    </span>
  );
};

const AssetsPanel: React.FC<Props> = ({ drones, selectedDroneId, onSelectDrone }) => {
  return (
    <div className="w-80 h-full flex flex-col bg-[#0f1115] border-r border-slate-800 overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-[#16181d]">
        <h2 className="text-sm font-black tracking-widest text-slate-400 flex items-center gap-2">
          <i className="fas fa-plane-up"></i> ASSETS
        </h2>
        <span className="bg-[#1a1c22] border border-slate-700 text-green-500 text-[10px] px-2 py-0.5 rounded font-mono">
          {drones.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#0a0c10]">
        {drones.map(drone => {
          const isSelected = selectedDroneId === drone.id;
          const speed = Math.round(Math.sqrt(drone.velocity.x ** 2 + drone.velocity.y ** 2) * 10) / 10;
          
          return (
            <div 
              key={drone.id}
              onClick={() => onSelectDrone(isSelected ? null : drone.id)}
              className={`p-3 rounded-md border cursor-pointer transition-all duration-200 group ${
                isSelected 
                  ? 'bg-blue-900/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                  : 'bg-[#12141a] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <i className={`fas fa-plane text-xs ${drone.type === 'CONTROLLED' ? 'text-blue-500' : 'text-red-500'}`}></i>
                  <span className="text-xs font-bold text-slate-200 tracking-tight">{drone.id}</span>
                </div>
                <StatusBadge status={drone.status} />
              </div>

              <div className="flex items-center justify-between mb-3 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <i className={`fas fa-battery-three-quarters text-[10px] ${drone.battery < 20 ? 'text-red-500 animate-pulse' : 'text-green-500'}`}></i>
                  <span className="text-[10px] font-mono">{Math.floor(drone.battery)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <i className="fas fa-location-arrow text-[10px] text-blue-400" style={{ transform: `rotate(${drone.heading - 45}deg)` }}></i>
                  <span className="text-[10px] font-mono">{Math.round(drone.heading)}°</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-[10px] font-mono">
                  <span className="text-slate-600 uppercase mr-1">ALT:</span>
                  <span className="text-slate-300 font-bold">{Math.round(drone.altitude)}m</span>
                </div>
                <div className="text-[10px] font-mono text-right">
                  <span className="text-slate-600 uppercase mr-1">SPD:</span>
                  <span className="text-slate-300 font-bold">{speed.toFixed(1)}m/s</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetsPanel;
