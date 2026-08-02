from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="Career Bridge Intelligence Engine",
    description="Python AI/ML Recommendation & Analysis Microservice",
    version="1.0.0"
)

class RecommendationRequest(BaseModel):
    user_id: str
    skills: List[str]
    target_role: Optional[str] = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend-intelligence"}

@app.post("/api/intelligence/recommend")
def get_recommendations(req: RecommendationRequest):
    return {
        "user_id": req.user_id,
        "match_score": 95,
        "recommended_jobs": ["job-101", "job-102"],
        "skill_gaps": ["Kubernetes", "GraphQL"]
    }
