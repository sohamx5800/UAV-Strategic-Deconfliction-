
import { Drone, Vector2D, DroneType } from '../types';
import { AIRSPACE_SIZE } from '../constants';

const generateRandomPath = (): Vector2D[] => {
  const points = [];
  const numPoints = 5 + Math.floor(Math.random() * 5);
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * AIRSPACE_SIZE,
      y: Math.random() * AIRSPACE_SIZE
    });
  }
  return points;
};

export const createInitialDrones = (count: number): Drone[] => {
  const drones: Drone[] = [];
  for (let i = 0; i < count; i++) {
    const type: DroneType = Math.random() > 0.2 ? 'CONTROLLED' : 'UNKNOWN';
    const missionPath = generateRandomPath();
    const startPos = type === 'CONTROLLED' ? missionPath[0] : {
        x: Math.random() * AIRSPACE_SIZE,
        y: Math.random() * AIRSPACE_SIZE
    };

    drones.push({
      id: `${type === 'CONTROLLED' ? 'DRN' : 'UNK'}-${(Math.floor(Math.random() * 9000) + 1000)}`,
      type,
      status: 'FLYING',
      position: { ...startPos },
      velocity: { x: 0, y: 0 },
      heading: Math.random() * 360,
      altitude: 50 + Math.random() * 150,
      battery: 80 + Math.random() * 20,
      missionPath,
      currentWaypointIndex: 0,
      lastTelemetryUpdate: Date.now(),
    });
  }
  return drones;
};

export const updateDronePosition = (drone: Drone, dt: number): Drone => {
  if (drone.status === 'LANDED') return drone;

  // Battery drain
  const batteryDrain = drone.status === 'PAUSED' ? 0.01 : 0.05;
  const newBattery = Math.max(0, drone.battery - batteryDrain * dt);

  if (drone.status === 'PAUSED') {
    return { ...drone, battery: newBattery };
  }

  const speed = drone.type === 'CONTROLLED' ? 10 : 12; // units per second (m/s)
  let target = drone.missionPath[drone.currentWaypointIndex];

  // For unknown drones, if they reach target, pick a new random target
  if (drone.type === 'UNKNOWN') {
    const dist = Math.sqrt(Math.pow(target.x - drone.position.x, 2) + Math.pow(target.y - drone.position.y, 2));
    if (dist < 5) {
      target = { x: Math.random() * AIRSPACE_SIZE, y: Math.random() * AIRSPACE_SIZE };
      drone.missionPath = [target];
      drone.currentWaypointIndex = 0;
    }
  } else {
    // Controlled drone logic: follow waypoints
    const dist = Math.sqrt(Math.pow(target.x - drone.position.x, 2) + Math.pow(target.y - drone.position.y, 2));
    if (dist < 5) {
      drone.currentWaypointIndex = (drone.currentWaypointIndex + 1) % drone.missionPath.length;
      target = drone.missionPath[drone.currentWaypointIndex];
    }
  }

  const dx = target.x - drone.position.x;
  const dy = target.y - drone.position.y;
  const angle = Math.atan2(dy, dx);
  
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  return {
    ...drone,
    position: {
      x: drone.position.x + vx * dt,
      y: drone.position.y + vy * dt,
    },
    velocity: { x: vx, y: vy },
    heading: (angle * 180) / Math.PI,
    battery: newBattery,
    lastTelemetryUpdate: Date.now(),
  };
};
