from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import get_db
from app.models.bookmark import Bookmark

router = APIRouter()

class BookmarkCreate(BaseModel):
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = []
    collection_id: Optional[int] = None

class BookmarkResponse(BaseModel):
    id: int
    url: str
    title: Optional[str]
    description: Optional[str]
    summary: Optional[str]
    tags: List[str]
    ai_tags: List[str]
    source: Optional[str]
    content_type: str
    is_favorite: int
    collection_id: Optional[int]
    created_at: str
    
    class Config:
        from_attributes = True

@router.get("/")
async def list_bookmarks(
    user_id: str = "default",
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Bookmark)
        .where(Bookmark.user_id == user_id)
        .order_by(Bookmark.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    bookmarks = result.scalars().all()
    return {"bookmarks": bookmarks, "count": len(bookmarks)}

@router.post("/")
async def create_bookmark(
    data: BookmarkCreate,
    user_id: str = "default",
    db: AsyncSession = Depends(get_db)
):
    bookmark = Bookmark(
        user_id=user_id,
        url=data.url,
        title=data.title,
        description=data.description,
        tags=data.tags,
        collection_id=data.collection_id,
        source=data.url.split("/")[2] if "/" in data.url else None
    )
    db.add(bookmark)
    await db.commit()
    await db.refresh(bookmark)
    return bookmark

@router.get("/{bookmark_id}")
async def get_bookmark(bookmark_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bookmark).where(Bookmark.id == bookmark_id))
    bookmark = result.scalar_one_or_none()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    return bookmark

@router.patch("/{bookmark_id}/favorite")
async def toggle_favorite(bookmark_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bookmark).where(Bookmark.id == bookmark_id))
    bookmark = result.scalar_one_or_none()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    bookmark.is_favorite = 1 if bookmark.is_favorite == 0 else 0
    await db.commit()
    return bookmark

@router.delete("/{bookmark_id}")
async def delete_bookmark(bookmark_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Bookmark).where(Bookmark.id == bookmark_id))
    bookmark = result.scalar_one_or_none()
    if not bookmark:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    await db.delete(bookmark)
    await db.commit()
    return {"deleted": True}
