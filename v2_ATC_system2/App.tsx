
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Drone, ConflictAlert, SystemMetrics, ReplayFrame } from './types';
import { TELEMETRY_INTERVAL, REPLAY_BUFFER_SIZE } from './constants';
import { createInitialDrones, updateDronePosition } from './services/simulation';
import { predictConflicts } from './services/conflict';
import Airspace from './components/Airspace';
import Sidebar from './components/Sidebar';
import AssetsPanel from './components/AssetsPanel';
import ReplayModal from './components/ReplayModal';

const App: React.FC = () => {
  const [drones, setDrones] = useState<Drone[]>([]);
  const [alerts, setAlerts] = useState<ConflictAlert[]>([]);
  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    droneCount: 0,
    telemetryRate: 2,
    predictionLatency: 0,
    cpuLoad: 8,
    isDegraded: false
  });
  
  const [replayHistory, setReplayHistory] = useState<ReplayFrame[]>([]);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [lastTick, setLastTick] = useState<number>(Date.now());

  // Initialize
  useEffect(() => {
    setDrones(createInitialDrones(35)); 
  }, []);

  // Main Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const start = performance.now();
      const now = Date.now();
      const dt = (now - lastTick) / 1000;
      setLastTick(now);

      setDrones(prevDrones => {
        // Update physics and battery
        const nextDrones = prevDrones.map(d => updateDronePosition(d, dt));
        
        // Predict conflicts
        const nextAlerts = predictConflicts(nextDrones);
        setAlerts(nextAlerts);

        // Update Replay Buffer
        setReplayHistory(prev => {
          const newFrame: ReplayFrame = {
            timestamp: now,
            drones: nextDrones,
            alerts: nextAlerts
          };
          const nextBuffer = [...prev, newFrame];
          if (nextBuffer.length > REPLAY_BUFFER_SIZE) {
            nextBuffer.shift();
          }
          return nextBuffer;
        });

        // Update Metrics
        const end = performance.now();
        setMetrics(m => ({
          ...m,
          droneCount: nextDrones.length,
          predictionLatency: end - start,
          cpuLoad: Math.min(100, Math.floor((end - start) * 5)), // simplified load calculation
          isDegraded: (end - start) > 200 
        }));

        return nextDrones;
      });
    }, TELEMETRY_INTERVAL);

    return () => clearInterval(interval);
  }, [lastTick]);

  const handlePause = useCallback((id: string) => {
    setDrones(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'PAUSED', pauseTimestamp: Date.now() } : d
    ));
  }, []);

  const handleResume = useCallback((id: string) => {
    setDrones(prev => prev.map(d => 
      d.id === id ? { ...d, status: 'FLYING', pauseTimestamp: undefined } : d
    ));
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0c] text-slate-200 overflow-hidden select-none font-sans">
      
      {/* 1. Left Sidebar: Assets Monitor */}
      <AssetsPanel 
        drones={drones} 
        selectedDroneId={selectedDroneId} 
        onSelectDrone={setSelectedDroneId} 
      />

      {/* 2. Center: Main Radar View Area */}
      <main className="flex-1 flex flex-col p-4 gap-4 relative overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-lg shadow-blue-500/20">
                <i className="fas fa-radar text-white text-sm"></i>
             </div>
             <div>
                <h1 className="text-lg font-black tracking-tight leading-none text-white">SKYWATCH <span className="text-blue-500">ATC</span></h1>
                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1">Air Traffic Management Environment</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Local Time</span>
                <span className="font-mono text-xs text-slate-300">{new Date().toLocaleTimeString([], { hour12: false })}</span>
             </div>
             <div className="h-8 w-px bg-slate-800"></div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Airspace Security</span>
                <span className="text-green-500 text-xs font-bold flex items-center gap-1">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> SECURE
                </span>
             </div>
          </div>
        </header>

        {/* Radar View Container */}
        <div className="flex-1 relative">
           <Airspace 
              drones={drones} 
              alerts={alerts} 
              selectedDroneId={selectedDroneId} 
              onSelectDrone={setSelectedDroneId} 
           />
           
           {/* Telemetry Indicator Overlay */}
           <div className="absolute bottom-4 right-4 text-[9px] font-mono text-slate-600 uppercase tracking-widest pointer-events-none">
              Live Feed • {metrics.telemetryRate}Hz • RT_SYNC: {lastTick % 1000}ms
           </div>
        </div>

      </main>

      {/* 3. Right Sidebar: Alerts & Control */}
      <Sidebar 
        drones={drones} 
        alerts={alerts} 
        metrics={metrics}
        selectedDroneId={selectedDroneId}
        onPause={handlePause}
        onResume={handleResume}
        onOpenReplay={() => setIsReplayOpen(true)}
      />

      {/* Modals */}
      {isReplayOpen && (
        <ReplayModal 
          history={replayHistory} 
          onClose={() => setIsReplayOpen(false)} 
        />
      )}

      {/* Performance Warning Overlay */}
      {metrics.isDegraded && (
        <div className="fixed bottom-6 left-86 bg-red-600/90 text-white px-4 py-3 rounded-lg shadow-2xl animate-bounce z-[200] flex items-center gap-4 border border-red-400 backdrop-blur-sm">
           <i className="fas fa-exclamation-triangle text-xl"></i>
           <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-tight">Latency Alert</span>
              <span className="text-[10px] opacity-90">Processing delay detected. Prediction fidelity may be reduced.</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
