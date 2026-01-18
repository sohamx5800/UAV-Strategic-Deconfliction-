"""
Assignment Description (V1.1):
"Two drones with crossing paths but different velocities.
The system must determine whether they will occupy the same
space at the same time. Both drones start from different
positions at different times."

Purpose:
- Validate continuous-time, analytical conflict detection
- No human input
- Fully deterministic and reproducible
"""

from models import Waypoint, DroneMission
from engine import check_mission
from visualization import plot_missions

SAFETY_DISTANCE = 1.5


def print_result(result):
    print("\nDECONFLICTION RESULT: ")

    if result["status"] == "REJECTED":
        print(f"Status               : {result['status']}")
        print(f"Conflict with drone  : {result['conflict_with']}")
        print(f"Time of conflict     : {result['time']} s")
        print(f"Location             : {result['location']}")
        print(f"Minimum distance     : {result['minimum_distance']} m")
        print(f"Safety threshold     : {result['safety_distance']} m")

        if result["checked_safe_drones"]:
            print("No conflict detected with other drones:")
            for d in result["checked_safe_drones"]:
                print(f"  - Drone {d}")
        else:
            print("No other drones were present in the airspace.")

    else:
        print(f"Status               : {result['status']}")
        print(result["message"])
        print(f"Primary drone        : {result['primary_drone']}")
        print(f"Safety threshold     : {result['safety_distance']} m")

        if result["checked_safe_drones"]:
            print("All checked drones are safe:")
            for d in result["checked_safe_drones"]:
                print(f"  - Drone {d}")
        else:
            print("No other drones were present in the airspace.")


def official_test_case():
    primary = DroneMission(
        drone_id="Primary",
        waypoints=[Waypoint(0, 0), Waypoint(10, 10)],
        speed=1.0,
        start_time=0.0
    )

    other = DroneMission(
        drone_id="Drone_B",
        waypoints=[Waypoint(10, 0), Waypoint(0, 10)],
        speed=1.2,        
        start_time=2.0    
    )

    result = check_mission(primary, [other], SAFETY_DISTANCE)
    print_result(result)
    plot_missions(primary, [other], result)


if __name__ == "__main__":
    official_test_case()
