from dataclasses import dataclass
from typing import List, Tuple

Point2D = Tuple[float, float]


@dataclass
class Waypoint:
    x: float
    y: float

    def as_tuple(self) -> Point2D:
        return (self.x, self.y)


@dataclass
class DroneMission:
    drone_id: str
    waypoints: List[Waypoint]
    speed: float        
    start_time: float   
    
    
    
"""
models.py

Defines the core data models used across the UAV Strategic Deconfliction system.

This module contains lightweight, immutable representations of:
- Waypoints: spatial coordinates in the shared airspace
- DroneMission: a complete planned mission including waypoints, constant velocity,
  and mission start time

These models act as the foundational input layer for trajectory generation,
conflict detection, and visualization, and are intentionally kept free of
any computational or simulation logic.
"""
