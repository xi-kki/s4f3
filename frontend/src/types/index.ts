export interface Bookmark {
  id: number
  url: string
  title: string | null
  description: string | null
  summary: string | null
  image_url: string | null
  favicon_url: string | null
  source: string | null
  content_type: string
  tags: string[]
  ai_tags: string[]
  is_favorite: number
  collection_id: number | null
  created_at: string
}

export interface Collection {
  id: number
  name: string
  description: string | null
  emoji: string
  is_ai_generated: number
  created_at: string
}
