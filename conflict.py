"""


Implements analytical closest-approach computation between two
trajectory segments to determine minimum separation over time.
"""


import math
from typing import Optional, Tuple
from trajectory import Segment


def closest_approach(seg1: Segment, seg2: Segment) -> Optional[Tuple[float, float, Tuple[float, float]]]:
    t_start = max(seg1.t_start, seg2.t_start)
    t_end = min(seg1.t_end, seg2.t_end)

    if t_start >= t_end:
        return None

    vx1 = seg1.dx / seg1.duration
    vy1 = seg1.dy / seg1.duration
    vx2 = seg2.dx / seg2.duration
    vy2 = seg2.dy / seg2.duration
    
    # Relative velocity between two drones
    rvx = vx1 - vx2
    rvy = vy1 - vy2

    x1s, y1s = seg1.position_at(t_start)
    x2s, y2s = seg2.position_at(t_start)

    rx0 = x1s - x2s
    ry0 = y1s - y2s

    a = rvx**2 + rvy**2
    b = 2 * (rx0 * rvx + ry0 * rvy)

    if a == 0:
        t_closest = t_start
    else:
        t_star = -b / (2 * a)
        t_closest = max(t_start, min(t_end, t_star))

    x1, y1 = seg1.position_at(t_closest)
    x2, y2 = seg2.position_at(t_closest)

    distance = math.hypot(x1 - x2, y1 - y2)
    return t_closest, distance, (x1, y1)
