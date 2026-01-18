# UAV-Strategic-Deconfliction-
Continuous-time UAV mission deconfliction system with analytical conflict detection and multi-dimensional visualization (V1 / V1.1).


## Module Coverage

This repository fully satisfies:
- **V1 – Strategic Deconfliction in Shared Airspace**
- **V1.1 – Continuous-Time Deconfliction with Constant Velocity**

V1.1 is treated as a clarification of V1 constraints and is implemented within the same system.

---

## Key Features

- Waypoint-based drone mission modeling
- Continuous-time trajectory computation
- Analytical conflict detection (no discrete simulation)
- Minimum safety distance enforcement
- Clear conflict explanations (time, location, drone ID)
- 2D spatial visualization (top-down airspace view)
- 3D space–time visualization (X–Y–Time)
- 4D animated visualization (time-evolving motion)
- Official and extended test scenarios
- Modular, extensible architecture (foundation for V2)

---

## Core Assumptions

- All drones operate in a shared 2D airspace.
- Each drone:
  - follows a piecewise linear path defined by waypoints,
  - moves at a **constant speed** throughout its mission,
  - has a defined **start time**.
- Drone positions are calculated **continuously in time**.
- A conflict occurs if two drones come within a predefined **minimum safety distance** at the same time.

---

## Module Description

### `models.py`
Defines core data models:
- `Waypoint` – spatial coordinate (x, y)
- `DroneMission` – complete mission including waypoints, speed, and start time

---

### `trajectory.py`
- Converts waypoint missions into **continuous-time straight-line segments**
- Computes traversal time using constant speed
- Enables precise position calculation at any moment

---

### `conflict.py`
- Compares two drone trajectory segments
- Checks temporal overlap
- Computes minimum separation distance analytically
- Detects conflicts without discrete time stepping

---

### `engine.py`
- Acts as the **strategic deconfliction authority**
- Validates a primary drone mission against all others
- Returns:
  - `CLEAR` if no conflicts exist
  - `REJECTED` if any safety violation is detected
- Provides detailed conflict explanations

---

### `visualization.py`
- 2D top-down airspace visualization
- Shows drone paths, direction arrows, and conflict points
- Used for clarity and explanation

---

### `visualization_4d.py`
- 3D visualization with:
  - X position
  - Y position
  - Time (Z-axis)
- Conflicts appear as intersections in space–time

---

### `visualization_4d_animation.py`
- Animated visualization of drone motion over time
- Demonstrates conflicts dynamically
- Used for demonstration and extra credit

---

## Test Scenarios

### Official Test Case

---

## System Architecture

The following diagram illustrates the high-level architecture of the UAV Strategic Deconfliction system, showing how mission data flows through trajectory generation, conflict detection, and visualization layers.


)

This modular design cleanly separates data modeling, analytical conflict detection, decision logic, and visualization, making the system easy to extend toward real-time ATC workflows (V2).


Run:
1. python test_v1_v1.1.py
2. python custom_test_case.py
