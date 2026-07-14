import { supabase } from './supabase'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
  }
}

export async function fetchBookmarks(skip = 0, limit = 20) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/bookmarks/?skip=${skip}&limit=${limit}`, { headers })
  return res.json()
}

export async function createBookmark(data: { url: string; title?: string; tags?: string[] }) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/bookmarks/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteBookmark(id: number) {
  const headers = await getHeaders()
  await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE', headers })
}

export async function toggleFavorite(id: number) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/bookmarks/${id}/favorite`, { method: 'PATCH', headers })
  return res.json()
}

export async function semanticSearch(query: string) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/search/semantic`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query })
  })
  return res.json()
}

export async function textSearch(q: string) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/search/text?q=${encodeURIComponent(q)}`, { headers })
  return res.json()
}

export async function summarizeUrl(url: string) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/ai/summarize`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ url })
  })
  return res.json()
}

export async function aiChat(message: string) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message })
  })
  return res.json()
}

export async function getCollections() {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/collections/`, { headers })
  return res.json()
}

export async function createCollection(data: { name: string; emoji?: string }) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}/collections/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
  return res.json()
}
