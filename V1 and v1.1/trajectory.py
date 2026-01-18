"""
Responsible for converting waypoint missions into continuous-time
piecewise linear trajectory segments.
Each segment represents straight line motion between two waypoints
with a constant velocity.
"""

import math
from typing import List, Tuple
from models import DroneMission, Waypoint


class Segment:
    def __init__(self, start: Waypoint, end: Waypoint,
                 t_start: float, t_end: float):
        self.start = start
        self.end = end
        self.t_start = t_start
        self.t_end = t_end
        self.dx = end.x - start.x
        self.dy = end.y - start.y
        self.duration = t_end - t_start

    def position_at(self, t: float) -> Tuple[float, float]:
        ratio = (t - self.t_start) / self.duration
        x = self.start.x + ratio * self.dx
        y = self.start.y + ratio * self.dy
        return x, y


def build_segments(mission: DroneMission) -> List[Segment]:
    segments = []
    t = mission.start_time

    for i in range(len(mission.waypoints) - 1):
        p1 = mission.waypoints[i]
        p2 = mission.waypoints[i + 1]

        distance = math.hypot(p2.x - p1.x, p2.y - p1.y)
        duration = distance / mission.speed

        segments.append(Segment(p1, p2, t, t + duration))
        t += duration

    return segments
