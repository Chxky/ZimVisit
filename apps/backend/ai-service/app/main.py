import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import health, compliance, forecasting, fingerprinting, risk_scoring

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("zimvisit-ai")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ZimVisit AI Engine starting up...")
    yield
    logger.info("ZimVisit AI Engine shutting down...")


app = FastAPI(
    title="ZimVisit AI Engine",
    description="AI-powered agent fingerprinting, revenue forecasting, compliance risk scoring, and national tourism analytics for Zimbabwe's regulated tourism platform.",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
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
app.include_router(risk_scoring.router, prefix="/api/v1/risk", tags=["Risk Scoring"])
