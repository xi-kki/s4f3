import { create } from 'zustand'
import type { Bookmark, Collection } from '../types'
import * as api from '../lib/api'
import { toast } from 'sonner'

interface AppState {
  bookmarks: Bookmark[]
  collections: Collection[]
  view: 'grid' | 'list' | 'table' | 'kanban'
  searchQuery: string
  loading: boolean
  setView: (view: 'grid' | 'list' | 'table' | 'kanban') => void
  setSearchQuery: (q: string) => void
  loadBookmarks: () => Promise<void>
  loadCollections: () => Promise<void>
  addBookmark: (url: string, tags?: string[]) => Promise<void>
  removeBookmark: (id: number) => Promise<void>
  favBookmark: (id: number) => Promise<void>
  search: (query: string) => Promise<void>
  semanticSearch: (query: string) => Promise<void>
  chat: (message: string) => Promise<string>
  deleteCollection: (id: number) => Promise<void>
  updateCollection: (id: number, data: { name: string; emoji: string }) => Promise<void>
  createCollection: (data: { name: string; emoji: string }) => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  bookmarks: [],
  collections: [],
  view: 'grid',
  searchQuery: '',
  loading: false,

  setView: (view) => set({ view }),
  setSearchQuery: (q) => set({ searchQuery: q }),

  loadBookmarks: async () => {
    set({ loading: true })
    try {
      const data = await api.fetchBookmarks()
      set({ bookmarks: data.bookmarks || [] })
    } catch (e) {
      console.error('Failed to load bookmarks', e)
      toast.error('Failed to load bookmarks')
    }
    set({ loading: false })
  },

  loadCollections: async () => {
    try {
      const data = await api.getCollections()
      set({ collections: data.collections || [] })
    } catch (e) {
      console.error('Failed to load collections', e)
    }
  },

  addBookmark: async (url, tags = []) => {
    try {
      await api.createBookmark({ url, tags })
      await get().loadBookmarks()
      toast.success('Bookmark saved!')
    } catch (e) {
      console.error('Failed to add bookmark', e)
      toast.error('Failed to save bookmark')
    }
  },

  removeBookmark: async (id) => {
    try {
      await api.deleteBookmark(id)
      set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) }))
      toast.success('Bookmark deleted')
    } catch (e) {
      console.error('Failed to delete bookmark', e)
      toast.error('Failed to delete bookmark')
    }
  },

  favBookmark: async (id) => {
    try {
      await api.toggleFavorite(id)
      await get().loadBookmarks()
      toast.success('Favorites updated')
    } catch (e) {
      console.error('Failed to toggle favorite', e)
      toast.error('Failed to update favorite')
    }
  },

  search: async (query) => {
    set({ loading: true })
    try {
      const data = await api.textSearch(query)
      set({ bookmarks: data.results || [] })
    } catch (e) {
      console.error('Search failed', e)
      toast.error('Search failed')
    }
    set({ loading: false })
  },

  semanticSearch: async (query) => {
    set({ loading: true })
    try {
      const data = await api.semanticSearch(query)
      set({ bookmarks: data.results || [] })
    } catch (e) {
      console.error('Semantic search failed', e)
      toast.error('Semantic search failed')
    }
    set({ loading: false })
  },

  chat: async (message) => {
    const data = await api.aiChat(message)
    return data.response
  },

  deleteCollection: async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/collections/${id}`, {
        method: 'DELETE',
        headers: await (async () => {
          const { supabase } = await import('../lib/supabase')
          const { data: { session } } = await supabase.auth.getSession()
          return {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
          }
        })(),
      })
      set((s) => ({ collections: s.collections.filter((c) => c.id !== id) }))
      await get().loadBookmarks()
      toast.success('Collection deleted')
    } catch (e) {
      console.error('Failed to delete collection', e)
      toast.error('Failed to delete collection')
    }
  },

  updateCollection: async (id, data) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/collections/${id}`, {
        method: 'PATCH',
        headers: await (async () => {
          const { supabase } = await import('../lib/supabase')
          const { data: { session } } = await supabase.auth.getSession()
          return {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
          }
        })(),
        body: JSON.stringify(data),
      })
      await get().loadCollections()
      toast.success('Collection updated')
    } catch (e) {
      console.error('Failed to update collection', e)
      toast.error('Failed to update collection')
    }
  },

  createCollection: async (data) => {
    try {
      await api.createCollection(data)
      await get().loadCollections()
      toast.success('Collection created')
    } catch (e) {
      console.error('Failed to create collection', e)
      toast.error('Failed to create collection')
    }
  }
}))