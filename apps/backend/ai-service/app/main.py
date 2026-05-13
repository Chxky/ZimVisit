import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import health, compliance, forecasting, fingerprinting

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("zimvisit-ai")

app = FastAPI(
    title="ZimVisit AI Engine",
    description="AI-powered agent fingerprinting, revenue forecasting, and compliance analytics",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["Health"])
app.include_router(compliance.router, prefix="/api/v1/compliance", tags=["Compliance"])
app.include_router(forecasting.router, prefix="/api/v1/forecasting", tags=["Forecasting"])
app.include_router(fingerprinting.router, prefix="/api/v1/fingerprinting", tags=["Fingerprinting"])

@app.on_event("startup")
async def startup():
    logger.info("ZimVisit AI Engine starting up...")

@app.on_event("shutdown")
async def shutdown():
    logger.info("ZimVisit AI Engine shutting down...")
