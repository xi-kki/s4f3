const API_URL = '/api'

export async function fetchBookmarks(skip = 0, limit = 20) {
  const res = await fetch(`${API_URL}/bookmarks/?skip=${skip}&limit=${limit}`)
  return res.json()
}

export async function createBookmark(data: { url: string; title?: string; tags?: string[] }) {
  const res = await fetch(`${API_URL}/bookmarks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export async function deleteBookmark(id: number) {
  await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' })
}

export async function toggleFavorite(id: number) {
  const res = await fetch(`${API_URL}/bookmarks/${id}/favorite`, { method: 'PATCH' })
  return res.json()
}

export async function semanticSearch(query: string) {
  const res = await fetch(`${API_URL}/search/semantic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  return res.json()
}

export async function textSearch(q: string) {
  const res = await fetch(`${API_URL}/search/text?q=${encodeURIComponent(q)}`)
  return res.json()
}

export async function summarizeUrl(url: string) {
  const res = await fetch(`${API_URL}/ai/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  })
  return res.json()
}

export async function aiChat(message: string) {
  const res = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
  return res.json()
}

export async function getCollections() {
  const res = await fetch(`${API_URL}/collections/`)
  return res.json()
}

export async function createCollection(data: { name: string; emoji?: string }) {
  const res = await fetch(`${API_URL}/collections/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}
