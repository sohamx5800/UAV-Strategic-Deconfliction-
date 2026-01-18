import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import numpy as np
from trajectory import build_segments


def animate_4d(primary, others, result=None):
    fig, ax = plt.subplots(figsize=(8, 8))

    missions = [primary] + others
    colors = ["red", "blue", "green", "purple", "orange", "brown"]

    segments_map = {m.drone_id: build_segments(m) for m in missions}

    points = {}

    for mission, color in zip(missions, colors):
        point, = ax.plot([], [], marker="o", color=color, markersize=8)
        points[mission.drone_id] = point

    # Axis ...........
    ax.set_xlim(-2, 15)
    ax.set_ylim(-2, 15)
    ax.set_xlabel("X Position (meters)")
    ax.set_ylabel("Y Position (meters)")
    ax.set_title("4D Deconfliction Animation (Time-Evolving)")
    ax.grid(True)

    t_min = min(m.start_time for m in missions)
    t_max = max(
        seg.t_end
        for segs in segments_map.values()
        for seg in segs
    )
    times = np.linspace(t_min, t_max, 300)

    collision_time = None
    collision_location = None
    collided_drones = set()

    if result and result["status"] == "REJECTED":
        collision_time = result["time"]
        collision_location = result["location"]
        collided_drones = {primary.drone_id, result["conflict_with"]}

    collision_marker = None
    collision_text = None
    collision_occurred = False

    def position_at(mission_id, t):
        for seg in segments_map[mission_id]:
            if seg.t_start <= t <= seg.t_end:
                return seg.position_at(t)
        return None

    def update(frame):
        nonlocal collision_occurred, collision_marker, collision_text

        t = times[frame]

        # Update each drone independently
        for mission in missions:
            mid = mission.drone_id

            # Freeze only collided drones
            if collision_occurred and mid in collided_drones:
                x, y = collision_location
                points[mid].set_data(x, y)
                continue

            # All other drones continue normally
            pos = position_at(mid, t)
            if pos:
                points[mid].set_data(pos[0], pos[1])

        
        if (
            collision_time is not None
            and not collision_occurred
            and t >= collision_time
        ):
            collision_occurred = True

            x, y = collision_location

            collision_marker = ax.plot(
                x, y, marker="X", color="black", markersize=14
            )[0]

            a, b = collided_drones
            collision_text = ax.text(
                x + 0.3,
                y + 0.3,
                f"Collision: {a} ↔ {b}\n@ t = {collision_time:.2f}s",
                fontsize=10,
                fontweight="bold",
                color="black"
            )

        return list(points.values())

    ani = FuncAnimation(fig, update, frames=len(times), interval=40)
    plt.show()
