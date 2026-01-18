
import React from 'react';
import { Drone, ConflictAlert, Vector2D } from '../types';
import { AIRSPACE_SIZE, COLORS, SAFETY_DISTANCE } from '../constants';

interface Props {
  drones: Drone[];
  alerts: ConflictAlert[];
  selectedDroneId: string | null;
  onSelectDrone: (id: string | null) => void;
}

const Airspace: React.FC<Props> = ({ drones, alerts, selectedDroneId, onSelectDrone }) => {
  const scale = (val: number) => (val / AIRSPACE_SIZE) * 100;

  return (
    <div className="relative w-full h-full bg-[#0a0a0c] overflow-hidden border border-slate-800 rounded-lg cursor-crosshair shadow-inner">
      {/* Grid Background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke={COLORS.GRID} strokeWidth="0.1" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      {/* Conflict Visualization Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        {alerts.map(alert => {
          const d1 = drones.find(d => d.id === alert.droneIds[0]);
          const d2 = drones.find(d => d.id === alert.droneIds[1]);
          const alertColor = alert.severity === 'HIGH' ? COLORS.CONFLICT_HIGH : COLORS.CONFLICT_MED;

          return (
            <g key={alert.id}>
              {/* Leader lines from drones to predicted collision point */}
              {d1 && (
                <line 
                  x1={scale(d1.position.x)} y1={scale(d1.position.y)}
                  x2={scale(alert.location.x)} y2={scale(alert.location.y)}
                  stroke={alertColor}
                  strokeWidth="0.15"
                  strokeDasharray="1,1"
                  opacity="0.4"
                />
              )}
              {d2 && (
                <line 
                  x1={scale(d2.position.x)} y1={scale(d2.position.y)}
                  x2={scale(alert.location.x)} y2={scale(alert.location.y)}
                  stroke={alertColor}
                  strokeWidth="0.15"
                  strokeDasharray="1,1"
                  opacity="0.4"
                />
              )}

              {/* High-visibility highlight at collision point */}
              <circle 
                cx={scale(alert.location.x)} 
                cy={scale(alert.location.y)} 
                r="0.6" 
                fill={alertColor}
                className="animate-pulse"
              />
              
              {/* Sharp Crosshair Marker */}
              <line 
                x1={scale(alert.location.x) - 1.5} y1={scale(alert.location.y)}
                x2={scale(alert.location.x) + 1.5} y2={scale(alert.location.y)}
                stroke={alertColor}
                strokeWidth="0.3"
              />
              <line 
                x1={scale(alert.location.x)} y1={scale(alert.location.y) - 1.5}
                x2={scale(alert.location.x)} y2={scale(alert.location.y) + 1.5}
                stroke={alertColor}
                strokeWidth="0.3"
              />
              
              {/* Boxed Label for legibility */}
              <rect 
                x={scale(alert.location.x) + 1.8} 
                y={scale(alert.location.y) - 1.5} 
                width="14" 
                height="3" 
                fill="rgba(0,0,0,0.85)" 
                rx="0.4"
                stroke={alertColor}
                strokeWidth="0.1"
              />
              <text 
                x={scale(alert.location.x) + 2.3} 
                y={scale(alert.location.y) + 0.6} 
                fill={alertColor} 
                fontSize="1.8" 
                fontWeight="900"
                fontFamily="monospace"
              >
                CPA T-{alert.predictedTime}s
              </text>
            </g>
          );
        })}
      </svg>

      {/* Drones Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {drones.map(drone => {
          const isSelected = selectedDroneId === drone.id;
          const isInConflict = alerts.some(a => a.droneIds.includes(drone.id));
          const color = drone.status === 'PAUSED' ? COLORS.PAUSED : (drone.type === 'CONTROLLED' ? COLORS.CONTROLLED : COLORS.UNKNOWN);

          return (
            <div 
              key={drone.id}
              className="absolute pointer-events-auto transition-all duration-500 ease-linear"
              style={{
                left: `${scale(drone.position.x)}%`,
                top: `${scale(drone.position.y)}%`,
                transform: `translate(-50%, -50%)`,
              }}
              onClick={() => onSelectDrone(isSelected ? null : drone.id)}
            >
              {/* Drone Marker */}
              <div 
                className={`relative w-4 h-4 rounded-sm flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-white scale-125 z-40' : 'z-10'} ${isInConflict ? 'ring-1 ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}
                style={{ backgroundColor: color }}
              >
                <div 
                  className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-white"
                  style={{ transform: `rotate(${drone.heading + 90}deg)` }}
                />
              </div>

              {/* Telemetry Tag */}
              <div className={`absolute left-5 top-0 text-[8px] font-bold whitespace-nowrap bg-black/80 px-1 rounded border ${isSelected ? 'border-white z-50 text-white' : 'border-transparent text-slate-400'}`}>
                {drone.id} {Math.round(drone.altitude)}m
              </div>

              {/* Velocity Vector */}
              {drone.status === 'FLYING' && (
                  <div 
                    className="absolute w-px h-8 origin-top opacity-20"
                    style={{
                        left: '50%',
                        top: '50%',
                        backgroundColor: color,
                        transform: `rotate(${drone.heading + 90}deg)`
                    }}
                  />
              )}
            </div>
          );
        })}
      </div>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
         <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-slate-700 text-[10px] font-mono flex items-center gap-4 shadow-xl">
            <span className="flex items-center gap-1.5 font-bold"><span className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor: COLORS.CONTROLLED}}></span> CONTROLLED</span>
            <span className="flex items-center gap-1.5 font-bold"><span className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor: COLORS.UNKNOWN}}></span> UNKNOWN</span>
            <span className="flex items-center gap-1.5 font-bold"><span className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor: COLORS.PAUSED}}></span> PAUSED</span>
         </div>
      </div>
    </div>
  );
};

export default Airspace;
