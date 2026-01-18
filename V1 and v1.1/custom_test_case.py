"""
CUSTOM TEST CASE

Includes:
1. Hard-coded 4-drone scenario (demonstration)
2. Human input scenario (custom experimentation)
"""

from models import Waypoint, DroneMission
from engine import check_mission
from visualization import plot_missions

from visualization_4d import plot_4d_space_time
from visualization_4d_animation import animate_4d


SAFETY_DISTANCE = 1.5


def print_result(result):
    print("\nDECONFLICTION RESULT:")

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
        print(f"Status               : {result['status']}")
        print(result["message"])
        print(f"Primary drone        : {result['primary_drone']}")
        print(f"Safety threshold     : {result['safety_distance']} m")
        print("All drones are safe.")


# -------------------------------------------------


def four_drone_scenario():
    primary = DroneMission(
        drone_id="A",
        waypoints=[Waypoint(0, 0), Waypoint(10, 10)],
        speed=1.0,
        start_time=0.0
    )

    drones = [
        DroneMission("B", [Waypoint(10, 0), Waypoint(0, 10)], 1.0, 0.0),
        DroneMission("C", [Waypoint(11, 10), Waypoint(3, 0)], 2.0, 0.0),
        DroneMission("D", [Waypoint(12, 0), Waypoint(5, 12)], 3.0, 0.0)
    ]

    result = check_mission(primary, drones, SAFETY_DISTANCE)
    print_result(result)

    plot_missions(primary, drones, result)

    plot_4d_space_time(primary, drones, result)
    animate_4d(primary, drones, result)




def human_input_scenario():
    print("\nCUSTOM INPUT SCENARIO")

    speed = float(input("Enter primary drone speed (m/s): "))
    start_time = float(input("Enter primary drone start time (s): "))

    primary = DroneMission(
        drone_id="USER",
        waypoints=[Waypoint(0, 0), Waypoint(10, 10)],
        speed=speed,
        start_time=start_time
    )

    other = DroneMission(
        drone_id="STATIC",
        waypoints=[Waypoint(10, 0), Waypoint(0, 10)],
        speed=1.0,
        start_time=0.0
    )

    result = check_mission(primary, [other], SAFETY_DISTANCE)
    print_result(result)

    # 2D spatial visualization....
    plot_missions(primary, [other], result)

    # 4D visualizations...
    plot_4d_space_time(primary, [other], result)
    animate_4d(primary, [other], result)


# -------------------------------------------------

if __name__ == "__main__":
    four_drone_scenario()
    human_input_scenario()
