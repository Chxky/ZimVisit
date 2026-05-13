from fastapi import APIRouter, HTTPException
from app.schemas.models import AgentBehavior, AgentFingerprintResponse
from app.models.agent_fingerprinting import fingerprinting_engine
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze", response_model=AgentFingerprintResponse)
async def analyze_agent_behavior(agent_data: AgentBehavior):
    try:
        result = fingerprinting_engine.analyze_behavior(agent_data.dict())
        return AgentFingerprintResponse(**result)
    except Exception as e:
        logger.error(f"Fingerprinting analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/profile/{agent_id}")
async def get_agent_profile(agent_id: str):
    profile = fingerprinting_engine.agent_profiles.get(agent_id)
    if not profile:
        return {"agent_id": agent_id, "status": "unknown", "message": "No profile yet"}

    return {
        "agent_id": agent_id,
        "profile_since": profile.get("profile_since"),
        "total_observations": len(profile.get("velocity_history", [])),
        "known_destinations": list(profile.get("destinations", set())),
        "avg_velocity": round(sum(profile.get("velocity_history", [0])) / max(len(profile.get("velocity_history", [1])), 1), 2),
    }


@router.post("/batch-analyze")
async def batch_analyze_agents(agents: list[AgentBehavior]):
    results = []
    for agent in agents:
        result = fingerprinting_engine.analyze_behavior(agent.dict())
        results.append(result)

    flagged = [r for r in results if r.get("status") in ("flagged", "suspicious")]
    return {
        "total_analyzed": len(results),
        "normal": len(results) - len(flagged),
        "flagged": len(flagged),
        "results": results,
    }
