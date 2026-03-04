"""
EventBoard FastAPI — Vercel Serverless Entry Point.

Vercel routes /api/* to this file via vercel.json.
"""

import sys
import os

# Ensure the project root is on the path so imports work on Vercel
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import auth, events, activities, attendee, analytics

app = FastAPI(
    title="EventBoard API",
    description="B2B SaaS platform for live event interaction",
    version="1.0.0",
)

# CORS — allow frontend (same origin on Vercel, localhost in dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        os.getenv("APP_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(events.router)
app.include_router(activities.router)
app.include_router(attendee.router)
app.include_router(analytics.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "eventboard-api"}


# Vercel expects a WSGI/ASGI handler named `handler`
handler = app
