from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.services.matcher import SkillMatcher
from pydantic import BaseModel
from typing import List

app = FastAPI(
    title="CareerMatch AI Service",
    description="AI-powered Resume-Job Matching Service",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

matcher = SkillMatcher()


class MatchRequest(BaseModel):
    studentSkills: List[str]
    requiredSkills: List[str]
    preferredSkills: List[str] = []


class MatchResponse(BaseModel):
    matchScore: int
    matchedSkills: List[str]
    missingSkills: List[str]
    recommendations: List[str]
    explanation: str


@app.get("/")
def root():
    return {"message": "CareerMatch AI Service is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy", "service": "CareerMatch AI"}


@app.post("/match", response_model=MatchResponse)
def match_skills(request: MatchRequest):
    result = matcher.match(
        student_skills=request.studentSkills,
        required_skills=request.requiredSkills,
        preferred_skills=request.preferredSkills
    )
    return result
