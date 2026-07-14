CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL DEFAULT 'default',
    name VARCHAR NOT NULL,
    description TEXT,
    emoji VARCHAR DEFAULT '📁',
    is_ai_generated INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL DEFAULT 'default',
    url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    summary TEXT,
    image_url TEXT,
    favicon_url TEXT,
    source VARCHAR,
    content_type VARCHAR DEFAULT 'link',
    tags VARCHAR[] DEFAULT '{}',
    ai_tags VARCHAR[] DEFAULT '{}',
    is_favorite INTEGER DEFAULT 0,
    collection_id INTEGER REFERENCES collections(id) ON DELETE SET NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_created ON bookmarks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookmarks_source ON bookmarks(source);
CREATE INDEX IF NOT EXISTS idx_collections_user ON collections(user_id);

CREATE INDEX IF NOT EXISTS idx_bookmarks_embedding ON bookmarks USING ivfflat lists 100 (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_bookmarks_search ON bookmarks USING GIN (to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, '')));
