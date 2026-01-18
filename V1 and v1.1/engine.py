"""
    Validates a primary drone mission against other drone missions.

    Parameters:
    - primary (DroneMission): mission to be validated
    - others (List[DroneMission]): other scheduled missions
    - safety_distance (float): minimum allowed separation (meters)

    Returns:
    - dict containing status (CLEAR / REJECTED) and conflict details
    """


from typing import List
from models import DroneMission
from trajectory import build_segments
from conflict import closest_approach


def check_mission(primary: DroneMission,
                  others: List[DroneMission],
                  safety_distance: float):

    primary_segments = build_segments(primary)
    safe_drones = []

    for other in others:
        other_segments = build_segments(other)
        conflict_found = False

        for s1 in primary_segments:
            for s2 in other_segments:
                result = closest_approach(s1, s2)
                if result is None:
                    continue

                t, dist, pos = result
                if dist <= safety_distance:
                    return {
                        "status": "REJECTED",
                        "conflict_with": other.drone_id,
                        "time": round(t, 2),
                        "location": (round(pos[0], 2), round(pos[1], 2)),
                        "minimum_distance": round(dist, 2),
                        "safety_distance": safety_distance,
                        "checked_safe_drones": safe_drones
                    }

        safe_drones.append(other.drone_id)

    return {
        "status": "CLEAR",
        "message": "No conflict detected within mission window",
        "primary_drone": primary.drone_id,
        "safety_distance": safety_distance,
        "checked_safe_drones": safe_drones
    }
 
 
    """
    Validates a primary drone mission against other drone missions.

    Parameters:
    - primary (DroneMission): mission to be validated
    - others (List[DroneMission]): other scheduled missions
    - safety_distance (float): minimum allowed separation (meters)

    Returns:
    - dict containing status (CLEAR / REJECTED) and conflict details
    """