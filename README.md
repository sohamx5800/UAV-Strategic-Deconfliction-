UAV Strategic Deconfliction & ATC System

Project Summary

This repository implements a complete UAV airspace safety system, progressing from offline strategic deconfliction to a real-time Air Traffic Control (ATC) system.
The project focuses on predicting, visualizing, and managing drone conflicts in shared airspace under both known and unknown traffic conditions.
The solution is developed in three stages, each building on the previous one.

Modules Overview
V1 – Strategic Pre-Flight Deconfliction
Offline validation of planned drone missions
Uses constant velocity and known start times
Predicts if two trajectories will violate safe separation
Outputs conflict status, time, location, and minimum distance
Purpose: Establish the analytical foundation for conflict prediction.
V1.1 – Continuous Deconfliction with Visualization
Extends V1 with continuous time analysis
Detects conflicts dynamically instead of discrete checks
Includes visual validation of results

Visualizations:

2D trajectory plots
3D spatial plots
4D space-time animation

Purpose: Bridge analytical logic with intuitive visual understanding.

V2 – Real-Time Air Traffic Control (ATC) System

Real-time simulation of 30+ drones

Supports controlled and unknown (non-cooperative) drones

Live telemetry at 2 Hz

Predictive conflict detection using Closest Point of Approach (CPA)

Alert prioritization by severity and urgency

Operator controls: pause/resume drones

Incident replay and system health monitoring

Purpose: Model a realistic ATC workflow under dynamic and partially observable airspace.
