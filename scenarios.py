from models import Waypoint, DroneMission


def conflict_scenario():
    primary = DroneMission(
        drone_id="A",
        waypoints=[Waypoint(0, 0), Waypoint(10, 10)],
        speed=1.0,
        start_time=0.0
    )

    other = DroneMission(
        drone_id="B",
        waypoints=[Waypoint(10, 0), Waypoint(0, 10)],
        speed=1.0,
        start_time=0.0
    )

    return primary, [other]


def safe_scenario():
    primary = DroneMission(
        drone_id="A",
        waypoints=[Waypoint(0, 0), Waypoint(10, 0)],
        speed=1.0,
        start_time=0.0
    )

    other = DroneMission(
        drone_id="B",
        waypoints=[Waypoint(0, 10), Waypoint(10, 10)],
        speed=1.0,
        start_time=0.0
    )

    return primary, [other]
