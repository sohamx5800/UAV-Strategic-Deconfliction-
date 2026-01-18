
export type DroneType = 'CONTROLLED' | 'UNKNOWN';
export type DroneStatus = 'FLYING' | 'PAUSED' | 'LANDED' | 'WAITING_APPROVAL';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Drone {
  id: string;
  type: DroneType;
  status: DroneStatus;
  position: Vector2D;
  velocity: Vector2D;
  heading: number;
  altitude: number;
  battery: number;
  missionPath: Vector2D[];
  currentWaypointIndex: number;
  lastTelemetryUpdate: number;
  pauseTimestamp?: number;
}

export interface ConflictAlert {
  id: string;
  droneIds: [string, string];
  predictedTime: number; // Seconds from now
  location: Vector2D;
  severity: Severity;
  confidence: number;
  isActionable: boolean;
}

export interface SystemMetrics {
  droneCount: number;
  telemetryRate: number;
  predictionLatency: number;
  cpuLoad: number;
  isDegraded: boolean;
}

export interface ReplayFrame {
  timestamp: number;
  drones: Drone[];
  alerts: ConflictAlert[];
}
