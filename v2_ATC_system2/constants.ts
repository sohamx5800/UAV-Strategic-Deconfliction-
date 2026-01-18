
export const AIRSPACE_SIZE = 1000; // units
export const SAFETY_DISTANCE = 40; // units
export const PREDICTION_LOOKAHEAD = 15; // seconds
export const TELEMETRY_INTERVAL = 500; // ms (2Hz)
export const MAX_PAUSE_DURATION = 60000; // 60 seconds warning
export const REPLAY_BUFFER_SIZE = 40; // frames (approx 20 seconds at 2Hz)

export const COLORS = {
  CONTROLLED: '#3b82f6', // blue
  UNKNOWN: '#f59e0b',    // amber
  PAUSED: '#8b5cf6',     // purple
  CONFLICT_HIGH: '#ef4444', // red
  CONFLICT_MED: '#f97316',  // orange
  CONFLICT_LOW: '#eab308',  // yellow
  GRID: '#1e293b',
};
