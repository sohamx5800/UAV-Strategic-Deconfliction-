import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import numpy as np
from trajectory import build_segments


def animate_4d(primary, others, result=None):
    fig, ax = plt.subplots(figsize=(8, 8))

    missions = [primary] + others
    colors = ["red", "blue", "green", "purple", "orange"]
    segments_map = {m.drone_id: build_segments(m) for m in missions}

    lines = {}
    points = {}

    for mission, color in zip(missions, colors):
        line, = ax.plot([], [], color=color, linewidth=2, label=mission.drone_id)
        point, = ax.plot([], [], marker="o", color=color)
        lines[mission.drone_id] = line
        points[mission.drone_id] = point

    ax.set_xlim(-2, 14)
    ax.set_ylim(-2, 14)
    ax.set_xlabel("X Position (meters)")
    ax.set_ylabel("Y Position (meters)")
    ax.set_title("4D Deconfliction Animation (Time Evolving)")
    ax.legend()
    ax.grid(True)

    t_min = min(m.start_time for m in missions)
    t_max = max(seg.t_end for m in missions for seg in segments_map[m.drone_id])
    times = np.linspace(t_min, t_max, 200)

    def position_at(mission, t):
        for seg in segments_map[mission.drone_id]:
            if seg.t_start <= t <= seg.t_end:
                return seg.position_at(t)
        return None

    def update(frame):
        t = times[frame]
        for mission in missions:
            pos = position_at(mission, t)
            if pos:
                lines[mission.drone_id].set_data(
                    [seg.start.x for seg in segments_map[mission.drone_id]],
                    [seg.start.y for seg in segments_map[mission.drone_id]]
                )
                points[mission.drone_id].set_data(pos[0], pos[1])
        return list(lines.values()) + list(points.values())

    ani = FuncAnimation(fig, update, frames=len(times), interval=50)
    plt.show()
