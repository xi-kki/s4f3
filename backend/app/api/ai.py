from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.core.auth import verify_token
from app.models.bookmark import Bookmark
from app.services.ai import summarize_content, chat_with_bookmarks

router = APIRouter()

class SummarizeRequest(BaseModel):
    url: str
    title: Optional[str] = None
    content: Optional[str] = None

class ChatRequest(BaseModel):
    message: str

@router.post("/summarize")
async def summarize_url(data: SummarizeRequest):
    result = await summarize_content(data.url, data.title or "", data.content or "")
    return result

@router.post("/chat")
async def chat(
    data: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(verify_token)
):
    result = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == user_id)
        .order_by(Bookmark.created_at.desc())
        .limit(50)
    )
    bookmarks = result.scalars().all()
    
    context = "\n".join([
        f"- {b.title or 'Untitled'}: {b.url} ({', '.join(b.tags or [])})"
        for b in bookmarks
    ])
    
    response = await chat_with_bookmarks(data.message, context)
    return {"response": response, "bookmarks_count": len(bookmarks)}
