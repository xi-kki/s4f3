import { create } from 'zustand'
import type { Bookmark, Collection } from '../types'
import * as api from '../lib/api'

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
  chat: (message: string) => Promise<string>
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
    } catch (e) {
      console.error('Failed to add bookmark', e)
    }
  },

  removeBookmark: async (id) => {
    await api.deleteBookmark(id)
    set((s) => ({ bookmarks: s.bookmarks.filter((b) => b.id !== id) }))
  },

  favBookmark: async (id) => {
    await api.toggleFavorite(id)
    await get().loadBookmarks()
  },

  search: async (query) => {
    set({ loading: true })
    try {
      const data = await api.textSearch(query)
      set({ bookmarks: data.results || [] })
    } catch (e) {
      console.error('Search failed', e)
    }
    set({ loading: false })
  },

  chat: async (message) => {
    const data = await api.aiChat(message)
    return data.response
  }
}))
