"""
S4F3 API - Vercel Serverless Function Entry Point
Adapted from FastAPI for Vercel's serverless runtime
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

# Import routes
from app.api import bookmarks, search, collections, ai
from app.core.config import settings

app = FastAPI(
    title="S4F3 API",
    description="AI-powered bookmarking API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(bookmarks.router, prefix="/api/bookmarks", tags=["bookmarks"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(collections.router, prefix="/api/collections", tags=["collections"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/api/health")
async def health():
    return {"status": "ok", "app": "s4f3"}

# Vercel serverless handler
handler = Mangum(app)
