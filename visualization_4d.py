"""
visualization_4d.py

Provides a 4D (X–Y–Time) static visualization of UAV trajectories.
Time is represented explicitly as the Z-axis.

This visualization is used to analytically demonstrate spatio-temporal
conflicts in continuous time.
"""

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import numpy as np
from trajectory import build_segments


def plot_4d_space_time(primary, others, result=None):
    fig = plt.figure(figsize=(9, 7))
    ax = fig.add_subplot(111, projection="3d")

    def plot_trajectory(mission, color, label):
        segments = build_segments(mission)

        xs, ys, ts = [], [], []

        for seg in segments:
            t_vals = np.linspace(seg.t_start, seg.t_end, 60)
            for t in t_vals:
                x, y = seg.position_at(t)
                xs.append(x)
                ys.append(y)
                ts.append(t)

        ax.plot(xs, ys, ts, color=color, linewidth=2, label=label)

    # Plot primary drone
    plot_trajectory(primary, "red", f"Primary {primary.drone_id}")

    # Plot other drones
    colors = ["blue", "green", "purple", "orange", "brown"]
    for drone, color in zip(others, colors):
        plot_trajectory(drone, color, f"Drone {drone.drone_id}")

    # -------------------------------
    # Conflict visualization
    # -------------------------------
    if result and result["status"] == "REJECTED":
        x, y = result["location"]
        t = result["time"]

        # Big conflict marker
        ax.scatter(
            x, y, t,
            color="black",
            s=200,
            marker="X",
            label="Conflict Point"
        )

        # Vertical dashed line showing same-space different-time alignment
        ax.plot(
            [x, x], [y, y], [0, t],
            linestyle="--",
            color="black",
            alpha=0.6
        )

        # Annotation
        ax.text(
            x, y, t,
            f"Conflict @ t={t}s",
            fontsize=10,
            fontweight="bold"
        )

    # Axis labels (explicit meaning)
    ax.set_xlabel("X Position (meters)")
    ax.set_ylabel("Y Position (meters)")
    ax.set_zlabel("Time (seconds)")

    ax.set_title(
        "4D Deconfliction Visualization (X–Y–Time)\n"
        "Trajectories intersecting at the same spatial location and time indicate conflict"
    )

    ax.legend()
    plt.tight_layout()
    plt.show()
