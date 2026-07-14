from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.bookmark import Bookmark
from app.services.ai import get_embedding

router = APIRouter()

class SearchQuery(BaseModel):
    query: str
    user_id: str = "default"

@router.post("/semantic")
async def semantic_search(
    data: SearchQuery,
    db: AsyncSession = Depends(get_db)
):
    embedding = await get_embedding(data.query)
    
    result = await db.execute(
        text("""
            SELECT id, url, title, description, summary, tags, ai_tags,
                   1 - (embedding <=> :embedding) as similarity
            FROM bookmarks
            WHERE user_id = :user_id
            ORDER BY embedding <=> :embedding
            LIMIT 10
        """),
        {"embedding": str(embedding), "user_id": data.user_id}
    )
    bookmarks = result.mappings().all()
    return {"results": bookmarks, "query": data.query}

@router.get("/text")
async def text_search(
    q: str,
    user_id: str = "default",
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Bookmark).where(
            Bookmark.user_id == user_id,
            (Bookmark.title.ilike(f"%{q}%")) | (Bookmark.description.ilike(f"%{q}%")) | (Bookmark.tags.any(q))
        ).order_by(Bookmark.created_at.desc()).limit(10)
    )
    bookmarks = result.scalars().all()
    return {"results": bookmarks, "query": q}
