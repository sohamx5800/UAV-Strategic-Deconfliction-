# UAV Strategic Deconfliction & ATC System  
**FlytBase Robotics Assignment — V1, V1.1 & V2**

This repository presents a complete, multi-stage UAV traffic safety and airspace management solution developed as part of the **FlytBase Robotics Assignment**.

The project evolves from **offline, analytical mission validation** to a **real-time, operator-facing Air Traffic Control (ATC) system**, demonstrating strong fundamentals in:
- continuous-time modeling,
- analytical conflict prediction,
- real-time systems design,
- and ATC-oriented human–machine interaction.

---

## Project Overview

With the rapid adoption of drones for commercial and industrial operations, UAV airspace faces challenges such as:
- high traffic density,
- partial observability,
- and mixed cooperative and non-cooperative agents.

This project addresses these challenges through three progressive modules:

| Version | Focus |
|------|------|
| **V1** | Strategic, pre-flight deconfliction |
| **V1.1** | Continuous-time analytical deconfliction |
| **V2** | Real-time Air Traffic Control (ATC) system |

Each version builds directly on the previous one, forming a cohesive UAV Traffic Management (UTM) pipeline.

---


---

## Module V1 & V1.1 — Strategic UAV Deconfliction (Offline)

### Objective

Determine **before takeoff** whether a new UAV mission can safely operate in shared airspace without violating a minimum separation distance from other drones.

This mirrors real-world **strategic airspace planning**, where conflicts are resolved prior to execution rather than reactively.

---

### Core Assumptions

- All drones operate in a shared 2D airspace
- Each drone:
  - follows waypoint-defined paths,
  - moves at constant velocity,
  - has a known mission start time
- A conflict occurs if two drones:
  - are present at the same time,
  - and come within a minimum safety distance

---

### V1.1 Clarification

V1.1 refines V1 by explicitly requiring **continuous-time analysis**.

In this repository:
- V1 and V1.1 are treated as a **single unified system**
- All motion and conflict detection are:
  - analytical,
  - continuous-time,
  - free of discretization or simulation-step artifacts

---

### System Design

#### Mission Modeling
- Missions are segmented into straight-line paths between waypoints
- Segment traversal time is derived from constant speed
- Drone position can be queried at **any continuous timestamp**

#### Conflict Detection
- Analytical trajectory comparison
- Temporal overlap checking
- Exact minimum separation distance computation
- Closest-approach time calculation

#### Decision Engine
Evaluates a primary mission against all others and returns:

- **CLEAR** — no conflicts detected  
- **REJECTED** — conflict detected with:
  - conflicting drone ID
  - time of conflict
  - location
  - minimum distance

This ensures **explainability**, not just a binary outcome.

---

### Visualization 

#### 2D Visualization
- Top-down airspace view
- Mission paths with direction arrows
- Conflict points highlighted

#### 3D & 4D Visualization
- Space–time plots (X, Y, Time)
- Animated 4D simulations
- Conflicts visibly emerge and halt motion
- Used for validation, debugging, and demonstration

---

### Running V1 / V1.1

Run v1/v1.1
1.python test_v1_v1.1.py

2.python custom_test_case.py

## Module V2 — Real-Time UAV Air Traffic Control (ATC) System

### Motivation

While V1 and V1.1 focus on **strategic, pre-flight validation**, real-world drone operations require **continuous, real-time airspace supervision**.

V2 extends analytical deconfliction into a **live operational ATC environment**, where:
- not all drones are cooperative,
- telemetry is noisy and delayed,
- conflicts must be predicted, not reacted to,
- and operator trust and cognitive load are critical.

This module represents the transition from **mission planning** to **airspace operations**.

---

### V2 System Goals

- Maintain safe separation in a **dynamic, partially observable airspace**
- Predict conflicts **before** they become critical
- Clearly surface **actionable risks** to an ATC operator
- Provide control authority over cooperative drones
- Preserve explainability and system trust

---

### High-Level Architecture

The V2 system is implemented as a **modular real-time ATC platform**, composed of:

- **Telemetry Simulation Engine**
- **Conflict Prediction Engine**
- **Alert Management Layer**
- **Operator Control Interface**
- **Incident Replay Subsystem**
- **System Health Monitoring**

Each component is isolated but communicates through well-defined data flows, allowing scalability and future replacement with real telemetry sources.

---

### Telemetry Simulation

The system simulates **30+ concurrent drones**, divided into two categories:

#### Controlled Drones
- Known flight plans
- Cooperative behavior
- Can be paused or resumed by ATC
- Represent enterprise or authorized operators

#### Unknown Drones
- No flight plans
- Semi-random or unpredictable motion
- Limited or no ATC control
- Represent rogue, consumer, or external drones

Telemetry updates include:
- position
- velocity
- timestamp
- battery level
- operational status

Update rate is configurable between **0.5–2 Hz**, reflecting realistic telemetry constraints.

---

### Real-Time Conflict Prediction

Conflicts are predicted continuously using **relative motion analysis**.

Key techniques:
- Closest Point of Approach (CPA)
- Short-term lookahead window
- Continuous-time prediction (no discrete stepping)

Each detected conflict includes:
- predicted time to conflict
- predicted separation distance
- confidence score based on horizon
- involved drones

#### Severity Classification
- **HIGH** — imminent collision risk
- **MEDIUM** — unsafe proximity likely
- **LOW** — advisory or emerging risk

This allows operators to prioritize attention effectively.

---

### Alert Management & Prioritization

To prevent alert fatigue:
- Alerts are **grouped by drone**
- Sorted by **severity and urgency**
- Assigned **stable alert IDs** to avoid UI flicker
- Only conflicts involving **controlled drones** are marked as actionable

This mirrors real ATC principles where not all risks require immediate intervention.

---

### ATC Operator Controls

The ATC operator can:
- Pause a controlled drone instantly
- Resume it after a safety check
- Track total pause duration
- Ensure safe separation before resumption

Control actions are logged and reflected in both live state and replay history.

---

### Incident Replay System

The system maintains a **rolling buffer of recent airspace states**:
- Last **10–20 seconds**
- Replay does **not interrupt live monitoring**
- Enables post-incident analysis and operator training
- Supports trust-building through explainability

---

### System Health & Trust Monitoring

To ensure operational reliability, the system tracks:
- prediction latency
- system load
- degradation thresholds

Operators are informed when:
- predictions are delayed,
- confidence decreases,
- or system reliability degrades.

This transparency is critical in safety-critical ATC environments.

---

### ATC Web Dashboard (UI)

The dashboard is built using **React + TypeScript**, designed explicitly around **real ATC workflows**.

Key design elements:
- Dark, radar-inspired theme
- High-contrast airspace visualization
- Distinct visual encoding for:
  - controlled drones
  - unknown drones
  - paused drones
  - conflict points
- Live alert and control sidebar
- Asset monitoring and system health panels

The UI emphasizes **clarity, speed, and cognitive efficiency**.

---





