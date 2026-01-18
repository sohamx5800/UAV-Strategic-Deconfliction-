import matplotlib.pyplot as plt
from trajectory import build_segments
import itertools


def plot_missions(primary, others, result=None):
    plt.figure(figsize=(8, 8))

    color_map = {primary.drone_id: "red"}
    palette = itertools.cycle(
        ["blue", "green", "purple", "orange", "brown", "cyan"]
    )

    for d in others:
        color_map[d.drone_id] = next(palette)

    def plot_drone(mission, color, label):
        segments = build_segments(mission)

        for seg in segments:
        
            plt.plot(
                [seg.start.x, seg.end.x],
                [seg.start.y, seg.end.y],
                color=color,
                linewidth=2,
                alpha=0.85,
                label=label
            )

            plt.arrow(
                seg.start.x,
                seg.start.y,
                seg.dx * 0.25,
                seg.dy * 0.25,
                color=color,
                head_width=0.35,
                length_includes_head=True
            )

            label = None

        # Waypoints............
        xs = [w.x for w in mission.waypoints]
        ys = [w.y for w in mission.waypoints]
        plt.scatter(xs, ys, color=color, s=50)

    plot_drone(primary, color_map[primary.drone_id], f"Primary ({primary.drone_id})")

    for drone in others:
        plot_drone(drone, color_map[drone.drone_id], f"Drone {drone.drone_id}")

    if result and result["status"] == "REJECTED":
        cx, cy = result["location"]

        plt.scatter(cx, cy, color="black", s=150, marker="X", label="Conflict Point")

        collision_zone = plt.Circle(
            (cx, cy),
            0.6,
            color="black",
            fill=False,
            linestyle="--",
            linewidth=1.5
        )
        plt.gca().add_patch(collision_zone)

        plt.annotate(
            f"Conflict @ t = {result['time']} s",
            (cx, cy),
            xytext=(10, 10),
            textcoords="offset points",
            fontsize=10,
            fontweight="bold"
        )


    plt.xlabel("X Position (meters)")
    plt.ylabel("Y Position (meters)")
    plt.title(
        "UAV Strategic Deconfliction — Shared Airspace (V1 / V1.1)\n"
        "Top-down spatial view (time implicit via motion and annotations)"
    )

    plt.legend()
    plt.grid(True)
    plt.axis("equal")
    plt.show()
