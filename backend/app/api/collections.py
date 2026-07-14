from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.bookmark import Collection, Bookmark

router = APIRouter()

class CollectionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    emoji: str = "📁"

@router.get("/")
async def list_collections(
    user_id: str = "default",
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Collection).where(Collection.user_id == user_id)
    )
    collections = result.scalars().all()
    return {"collections": collections}

@router.post("/")
async def create_collection(
    data: CollectionCreate,
    user_id: str = "default",
    db: AsyncSession = Depends(get_db)
):
    collection = Collection(
        user_id=user_id,
        name=data.name,
        description=data.description,
        emoji=data.emoji
    )
    db.add(collection)
    await db.commit()
    await db.refresh(collection)
    return collection
