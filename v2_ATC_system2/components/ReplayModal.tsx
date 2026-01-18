
import React, { useState, useEffect } from 'react';
import { ReplayFrame } from '../types';
import Airspace from './Airspace';

interface Props {
  history: ReplayFrame[];
  onClose: () => void;
}

const ReplayModal: React.FC<Props> = ({ history, onClose }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrameIndex(prev => (prev + 1) % history.length);
      }, 500); // match sim rate
    }
    return () => clearInterval(interval);
  }, [isPlaying, history.length]);

  const currentFrame = history[frameIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
      <div className="bg-[#1a1a1e] w-full max-w-5xl h-[80vh] rounded-xl border border-slate-700 flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f1115]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <i className="fas fa-film text-blue-500"></i>
              INCIDENT REPLAY
            </h2>
            <div className="bg-slate-800 px-3 py-1 rounded text-xs font-mono text-slate-400">
              FRAME {frameIndex + 1} / {history.length}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-black p-4">
             <Airspace 
                drones={currentFrame.drones} 
                alerts={currentFrame.alerts} 
                selectedDroneId={null} 
                onSelectDrone={() => {}} 
             />
          </div>

          <div className="w-64 border-l border-slate-800 bg-[#0f1115] p-4 overflow-y-auto">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Incident Log</h3>
             <div className="space-y-4">
                {currentFrame.alerts.map(a => (
                    <div key={a.id} className="text-[11px] p-2 bg-red-900/10 border border-red-900/30 rounded text-red-200">
                        <div className="font-bold mb-1">{a.droneIds[0]} ↔ {a.droneIds[1]}</div>
                        <div>Predicted collision in {a.predictedTime}s</div>
                    </div>
                ))}
                {currentFrame.alerts.length === 0 && (
                    <div className="text-[11px] text-slate-500 italic">No violations recorded at this timestamp.</div>
                )}
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0f1115] flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-lg"
          >
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <input 
            type="range" 
            min="0" 
            max={history.length - 1} 
            value={frameIndex} 
            onChange={(e) => {
                setFrameIndex(parseInt(e.target.value));
                setIsPlaying(false);
            }}
            className="flex-1 accent-blue-500"
          />
          <div className="text-xs font-mono text-slate-500">
            TS: {Math.round(currentFrame.timestamp / 1000)}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplayModal;
