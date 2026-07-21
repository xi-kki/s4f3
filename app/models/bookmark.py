from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class Bookmark(Base):
    __tablename__ = "bookmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    url = Column(Text, nullable=False)
    title = Column(Text)
    description = Column(Text)
    summary = Column(Text)
    image_url = Column(Text)
    favicon_url = Column(Text)
    source = Column(String, index=True)
    content_type = Column(String, default="link")
    tags = Column(ARRAY(String), default=[])
    ai_tags = Column(ARRAY(String), default=[])
    is_favorite = Column(Integer, default=0)
    collection_id = Column(Integer, ForeignKey("collections.id"), nullable=True)
    embedding = Column(Vector(1536))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    collection = relationship("Collection", back_populates="bookmarks")

class Collection(Base):
    __tablename__ = "collections"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    emoji = Column(String, default="📁")
    is_ai_generated = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    bookmarks = relationship("Bookmark", back_populates="collection")
