
import React from 'react';
import { Drone, ConflictAlert, SystemMetrics, Severity } from '../types';
import { MAX_PAUSE_DURATION } from '../constants';

interface Props {
  drones: Drone[];
  alerts: ConflictAlert[];
  metrics: SystemMetrics;
  selectedDroneId: string | null;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onOpenReplay: () => void;
}

const SeverityBadge: React.FC<{ level: Severity }> = ({ level }) => {
  const colors = {
    HIGH: 'bg-red-500/20 text-red-500 border-red-500/50',
    MEDIUM: 'bg-orange-500/20 text-orange-500 border-orange-500/50',
    LOW: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${colors[level]}`}>
      {level}
    </span>
  );
};

const Sidebar: React.FC<Props> = ({ drones, alerts, metrics, selectedDroneId, onPause, onResume, onOpenReplay }) => {
  const selectedDrone = drones.find(d => d.id === selectedDroneId);
  const pausedDrones = drones.filter(d => d.status === 'PAUSED');

  return (
    <div className="w-80 h-full flex flex-col bg-[#0f1115] border-l border-slate-800 p-4 gap-4 overflow-y-auto">
      
      {/* System Health */}
      <section className="bg-black/20 p-3 rounded-lg border border-slate-800">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
          System Health
          <span className={`w-2 h-2 rounded-full ${metrics.isDegraded ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></span>
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/5 p-2 rounded">
            <div className="text-slate-400 mb-1">Drones</div>
            <div className="font-mono text-lg">{metrics.droneCount}</div>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <div className="text-slate-400 mb-1">Latency</div>
            <div className="font-mono text-lg">{Math.round(metrics.predictionLatency)}ms</div>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <div className="text-slate-400 mb-1">Rate</div>
            <div className="font-mono text-lg">{metrics.telemetryRate}Hz</div>
          </div>
          <div className="bg-white/5 p-2 rounded">
            <div className="text-slate-400 mb-1">Load</div>
            <div className="font-mono text-lg">{Math.round(metrics.cpuLoad)}%</div>
          </div>
        </div>
      </section>

      {/* Selected Drone Actions */}
      {selectedDrone && (
        <section className="bg-blue-900/10 p-4 rounded-lg border border-blue-500/30 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="text-sm font-bold text-blue-400 mb-2 flex items-center justify-between">
            Drone {selectedDrone.id}
            <span className="text-[10px] opacity-60 font-mono">{selectedDrone.type}</span>
          </h3>
          <div className="text-[11px] space-y-1 mb-4 text-slate-300">
            <div className="flex justify-between"><span>Status:</span> <span className="font-bold">{selectedDrone.status}</span></div>
            <div className="flex justify-between"><span>Altitude:</span> <span>{Math.round(selectedDrone.altitude)} ft</span></div>
            <div className="flex justify-between"><span>Velocity:</span> <span>{Math.round(Math.sqrt(selectedDrone.velocity.x**2 + selectedDrone.velocity.y**2))} kts</span></div>
          </div>
          {selectedDrone.type === 'CONTROLLED' ? (
            <div className="flex gap-2">
              {selectedDrone.status === 'FLYING' ? (
                <button 
                  onClick={() => onPause(selectedDrone.id)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded text-xs font-bold transition-colors"
                >
                  <i className="fas fa-pause mr-2"></i> PAUSE
                </button>
              ) : (
                <button 
                  onClick={() => onResume(selectedDrone.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-xs font-bold transition-colors"
                >
                  <i className="fas fa-play mr-2"></i> RESUME
                </button>
              )}
            </div>
          ) : (
            <p className="text-[10px] text-orange-400 italic">Uncontrolled drone. ATC cannot intervene directly.</p>
          )}
        </section>
      )}

      {/* Active Alerts */}
      <section className="flex-1 flex flex-col gap-2 min-h-0">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
          Active Alerts
          <span className="bg-slate-800 px-1.5 rounded text-[10px]">{alerts.length}</span>
        </h3>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {alerts.length === 0 ? (
            <div className="text-center py-10 opacity-30 text-xs italic">Clear skies. No conflicts detected.</div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded border bg-black/40 ${alert.severity === 'HIGH' ? 'border-red-500/50' : 'border-orange-500/30'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-mono text-slate-400">T-MINUS {alert.predictedTime}s</div>
                  <SeverityBadge level={alert.severity} />
                </div>
                <div className="text-xs font-bold mb-1">{alert.droneIds[0]} vs {alert.droneIds[1]}</div>
                <div className="text-[10px] text-slate-500 mb-3">Conflict at [{Math.round(alert.location.x)}, {Math.round(alert.location.y)}]</div>
                {!alert.isActionable && <div className="text-[9px] text-red-400 italic mb-2">Non-actionable (Both unknown)</div>}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Paused List */}
      <section className="bg-black/20 p-3 rounded-lg border border-slate-800">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
          Paused Queue ({pausedDrones.length})
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {pausedDrones.length === 0 ? (
            <div className="text-[10px] text-slate-600">No drones in holding.</div>
          ) : (
            pausedDrones.map(d => {
              const pauseTime = d.pauseTimestamp ? Date.now() - d.pauseTimestamp : 0;
              const isWarning = pauseTime > MAX_PAUSE_DURATION;
              return (
                <div key={d.id} className={`flex items-center justify-between p-2 rounded text-xs ${isWarning ? 'bg-red-900/20 border border-red-500/50' : 'bg-slate-800/50'}`}>
                  <div className="flex flex-col">
                    <span className="font-bold">{d.id}</span>
                    <span className={`text-[10px] ${isWarning ? 'text-red-400' : 'text-slate-400'}`}>
                      {Math.floor(pauseTime/1000)}s hold
                    </span>
                  </div>
                  <button 
                    onClick={() => onResume(d.id)}
                    className="p-1.5 hover:bg-green-500/20 text-green-500 rounded transition-colors"
                  >
                    <i className="fas fa-play"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Replay Trigger */}
      <button 
        onClick={onOpenReplay}
        className="mt-auto w-full border border-slate-700 hover:bg-slate-800 text-slate-300 py-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
      >
        <i className="fas fa-history"></i> OPEN INCIDENT REPLAY
      </button>

    </div>
  );
};

export default Sidebar;
