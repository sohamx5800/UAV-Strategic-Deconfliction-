
import { Drone, ConflictAlert, Severity } from '../types';
import { SAFETY_DISTANCE, PREDICTION_LOOKAHEAD } from '../constants';

export const predictConflicts = (drones: Drone[]): ConflictAlert[] => {
  const alerts: ConflictAlert[] = [];

  for (let i = 0; i < drones.length; i++) {
    for (let j = i + 1; j < drones.length; j++) {
      const d1 = drones[i];
      const d2 = drones[j];

      if (d1.status === 'LANDED' || d2.status === 'LANDED') continue;

      // Relative motion calculation
      const dvx = d1.velocity.x - d2.velocity.x;
      const dvy = d1.velocity.y - d2.velocity.y;
      const dpx = d1.position.x - d2.position.x;
      const dpy = d1.position.y - d2.position.y;

      // Quadratic equation for closest point of approach (CPA)
      // distance(t)^2 = (dpx + dvx*t)^2 + (dpy + dvy*t)^2
      const a = dvx * dvx + dvy * dvy;
      const b = 2 * (dpx * dvx + dpy * dvy);
      const c = dpx * dpx + dpy * dpy;

      // Time to CPA
      let t_cpa = 0;
      if (Math.abs(a) > 0.0001) {
        t_cpa = -b / (2 * a);
      }

      // Check if CPA is in the future lookahead window
      if (t_cpa > 0 && t_cpa < PREDICTION_LOOKAHEAD) {
        const dist_sq_cpa = a * t_cpa * t_cpa + b * t_cpa + c;
        const dist_cpa = Math.sqrt(dist_sq_cpa);

        if (dist_cpa < SAFETY_DISTANCE) {
          const severity: Severity = t_cpa < 5 ? 'HIGH' : t_cpa < 10 ? 'MEDIUM' : 'LOW';
          
          alerts.push({
            id: `AL-${d1.id}-${d2.id}`,
            droneIds: [d1.id, d2.id],
            predictedTime: Math.round(t_cpa * 10) / 10,
            location: {
              x: d1.position.x + d1.velocity.x * t_cpa,
              y: d1.position.y + d1.velocity.y * t_cpa,
            },
            severity,
            confidence: 0.9 - (t_cpa / PREDICTION_LOOKAHEAD) * 0.4,
            isActionable: d1.type === 'CONTROLLED' || d2.type === 'CONTROLLED'
          });
        }
      } else {
          // Immediate check
          const dist = Math.sqrt(dpx*dpx + dpy*dpy);
          if (dist < SAFETY_DISTANCE) {
             alerts.push({
                id: `AL-IMM-${d1.id}-${d2.id}`,
                droneIds: [d1.id, d2.id],
                predictedTime: 0,
                location: { x: (d1.position.x + d2.position.x)/2, y: (d1.position.y + d2.position.y)/2 },
                severity: 'HIGH',
                confidence: 1.0,
                isActionable: d1.type === 'CONTROLLED' || d2.type === 'CONTROLLED'
             });
          }
      }
    }
  }

  return alerts.sort((a, b) => {
    const sevMap = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    if (sevMap[a.severity] !== sevMap[b.severity]) return sevMap[b.severity] - sevMap[a.severity];
    return a.predictedTime - b.predictedTime;
  });
};
