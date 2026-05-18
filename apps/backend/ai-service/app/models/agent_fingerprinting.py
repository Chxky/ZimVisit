import numpy as np
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timezone

logger = logging.getLogger(__name__)


class AgentFingerprintingEngine:

    def __init__(self):
        self.agent_profiles: Dict[str, dict] = {}
        self.anomaly_threshold = 0.25

    def analyze_behavior(self, agent_data: dict) -> dict:
        agent_id = agent_data.get("agent_id")

        profile = self._get_or_create_profile(agent_id, agent_data)

        velocity_anomaly = self._check_velocity_anomaly(profile, agent_data)
        destination_anomaly = self._check_destination_anomaly(profile, agent_data)
        timing_anomaly = self._check_timing_anomaly(profile, agent_data)
        value_anomaly = self._check_value_anomaly(profile, agent_data)

        anomaly_score = (
            velocity_anomaly * 0.35 +
            destination_anomaly * 0.30 +
            timing_anomaly * 0.20 +
            value_anomaly * 0.15
        )

        trust_score = max(0, min(100, 100 - (anomaly_score * 100)))

        risk_factors = []
        if velocity_anomaly > self.anomaly_threshold:
            risk_factors.append(f"High velocity anomaly ({agent_data.get('booking_velocity', 0):.1f} bookings/hr)")
        if destination_anomaly > self.anomaly_threshold:
            risk_factors.append("Unusual destinations detected")
        if timing_anomaly > self.anomaly_threshold:
            risk_factors.append("Abnormal booking hours")

        if anomaly_score > 0.4:
            status = "flagged"
        elif anomaly_score > 0.2:
            status = "suspicious"
        else:
            status = "normal"

        return {
            "agent_id": agent_id,
            "trust_score": round(trust_score, 1),
            "anomaly_score": round(anomaly_score * 100, 1),
            "risk_factors": risk_factors,
            "status": status,
            "confidence": round(95 - (anomaly_score * 20), 1),
            "analyzed_at": datetime.now(timezone.utc).isoformat(),
        }

    def _get_or_create_profile(self, agent_id: str, data: dict) -> dict:
        if agent_id not in self.agent_profiles:
            self.agent_profiles[agent_id] = {
                "velocity_history": [],
                "destinations": set(),
                "value_history": [],
                "hour_history": [],
                "profile_since": datetime.now(timezone.utc).isoformat(),
            }
        profile = self.agent_profiles[agent_id]

        if "booking_velocity" in data:
            profile["velocity_history"].append(data["booking_velocity"])
        if "destinations" in data:
            profile["destinations"].update(data["destinations"])
        if "avg_booking_value" in data:
            profile["value_history"].append(data["avg_booking_value"])
        if "booking_hours" in data:
            profile["hour_history"].extend(data["booking_hours"])

        if len(profile["velocity_history"]) > 100:
            profile["velocity_history"] = profile["velocity_history"][-100:]
        if len(profile["value_history"]) > 100:
            profile["value_history"] = profile["value_history"][-100:]

        return profile

    def _check_velocity_anomaly(self, profile: dict, data: dict) -> float:
        history = profile["velocity_history"]
        current = data.get("booking_velocity", 0)

        if len(history) < 3:
            return 0.8 if current > 20 else 0.0

        mean = np.mean(history[:-1])
        std = np.std(history[:-1]) + 0.001

        z_score = abs(current - mean) / std
        return min(1.0, z_score / 3.0)

    def _check_destination_anomaly(self, profile: dict, data: dict) -> float:
        known = profile["destinations"]
        current = set(data.get("destinations", []))

        if not current:
            return 0.0

        if not known:
            return min(1.0, len(current) / 5.0)

        unknown = current - known
        return min(1.0, len(unknown) / len(current))

    def _check_timing_anomaly(self, profile: dict, data: dict) -> float:
        hours = data.get("booking_hours", [])
        if not hours:
            return 0.0

        late_night = sum(1 for h in hours if h < 5 or h > 23)
        return min(1.0, late_night / len(hours))

    def _check_value_anomaly(self, profile: dict, data: dict) -> float:
        history = profile["value_history"]
        current = data.get("avg_booking_value", 0)

        if len(history) < 3:
            return 0.7 if current > 5000 else 0.0

        mean = np.mean(history[:-1])
        std = np.std(history[:-1]) + 0.001

        z_score = abs(current - mean) / std
        return min(1.0, z_score / 4.0)


fingerprinting_engine = AgentFingerprintingEngine()
