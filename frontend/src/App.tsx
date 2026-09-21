import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useStore } from './hooks/useBookmarks'
import { BookmarkCard } from './components/BookmarkCard'
import { TableView } from './components/TableView'
import { KanbanView } from './components/KanbanView'
import { GridSkeleton, ListSkeleton, TableSkeleton, KanbanSkeleton } from './components/Skeleton'
import { SaveModal } from './components/SaveModal'
import { AIChat } from './components/AIChat'
import { SearchBar } from './components/SearchBar'

import { LandingPage } from './components/LandingPage'
import { CollectionsSidebar, CollectionModal } from './components/CollectionsSidebar'
import { OnboardingOverlay } from './components/OnboardingOverlay'
import { Toaster } from 'sonner'
import {
  LayoutGrid, List, Table, Kanban, Plus, MessageCircle,
  Loader2, LogOut, User, Link2, Bookmark, Sparkles, Folder
} from 'lucide-react'

function AppContent() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { bookmarks, view, setView, loadBookmarks, loadCollections, loading, collections, updateCollection, createCollection: createCollectionApi } = useStore()
  const [showSave, setShowSave] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCollections, setShowCollections] = useState(false)
  const [showCreateCollection, setShowCreateCollection] = useState(false)
  const [editingCollection, setEditingCollection] = useState<typeof collections[0] | null>(null)
  const [activeCollectionId, setActiveCollectionId] = useState<number | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('s4f3_onboarding_complete'))
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Filter bookmarks by active collection
  const filteredBookmarks = useMemo(() => {
    if (activeCollectionId === null) return bookmarks
    return bookmarks.filter((b) => b.collection_id === activeCollectionId)
  }, [bookmarks, activeCollectionId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K -> Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }
      // Escape -> Close modals
      if (e.key === 'Escape') {
        if (showChat) setShowChat(false)
        if (showSave) setShowSave(false)
        if (showAuth) setShowAuth(false)
        if (showSettings) setShowSettings(false)
        if (showCollections) setShowCollections(false)
        if (showCreateCollection) setShowCreateCollection(false)
        if (editingCollection) setEditingCollection(null)
        return
      }
      // Arrow key navigation for grid view
      if (view === 'grid' && filteredBookmarks.length > 0 && !e.metaKey && !e.ctrlKey) {
        const cols = window.innerWidth >= 1280 ? 4 : window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1
        let newIndex = focusedIndex
        switch (e.key) {
          case 'ArrowRight':
            newIndex = focusedIndex < filteredBookmarks.length - 1 ? focusedIndex + 1 : 0
            break
          case 'ArrowLeft':
            newIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredBookmarks.length - 1
            break
          case 'ArrowDown':
            newIndex = Math.min(focusedIndex + cols, filteredBookmarks.length - 1)
            break
          case 'ArrowUp':
            newIndex = Math.max(focusedIndex - cols, 0)
            break
        }
        if (newIndex !== focusedIndex) {
          e.preventDefault()
          setFocusedIndex(newIndex)
          return
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showChat, showSave, showAuth, showSettings, showCollections, showCreateCollection, editingCollection, view, filteredBookmarks, focusedIndex])

  // Load saved view from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem('s4f3_view') as 'grid' | 'list' | 'table' | 'kanban' | null
    if (savedView && ['grid', 'list', 'table', 'kanban'].includes(savedView)) {
      setView(savedView)
    }
  }, [setView])

  // Persist view to localStorage
  const handleViewChange = useCallback((newView: 'grid' | 'list' | 'table' | 'kanban') => {
    setView(newView)
    localStorage.setItem('s4f3_view', newView)
  }, [setView])

  useEffect(() => {
    if (user) {
      loadBookmarks()
    }
  }, [user])

  const views = [
    { id: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
    { id: 'list' as const, icon: List, label: 'List' },
    { id: 'table' as const, icon: Table, label: 'Table' },
    { id: 'kanban' as const, icon: Kanban, label: 'Kanban' },
  ]

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0b]">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  // Show auth screen if not logged in
  if (!user) {
    return (
      <LandingPage onSignIn={() => setShowAuth(true)} onGetStarted={() => setShowAuth(true)} />
    )
  }

  const handleCreateCollection = useCallback(async (name: string, emoji: string) => {
    await createCollectionApi({ name, emoji })
    await loadCollections()
  }, [createCollectionApi, loadCollections])

  const handleUpdateCollection = useCallback(async (id: number, name: string, emoji: string) => {
    await updateCollection(id, { name, emoji })
    await loadCollections()
  }, [updateCollection, loadCollections])

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#27272a] bg-[#0a0a0b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Link2 className="text-white" size={18} />
            </div>
            <h1 className="text-xl font-bold">S4F3</h1>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400 flex items-center gap-1">
              <Sparkles size={10} />
              AI
            </span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <SearchBar externalRef={searchInputRef} />
          </div>

          <div className="flex items-center gap-2">
            {/* Collections Filter Button */}
            <button
              onClick={() => setShowCollections(!showCollections)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                showCollections
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-[#27272a] bg-[#18181b] text-zinc-400 hover:text-white'
              }`}
              title="Collections"
            >
              <Folder size={16} />
              <span className="hidden sm:inline">
                {activeCollectionId === null ? 'All' : collections.find(c => c.id === activeCollectionId)?.name || 'All'}
              </span>
              {activeCollectionId !== null && (
                <button
                  onClick={(e) => { e.stopPropagation(); setActiveCollectionId(null) }}
                  className="ml-1 p-0.5 rounded text-zinc-400 hover:text-white"
                >✕</button>
              )}
            </button>

            {/* View Toggle */}
            <div className="flex rounded-lg border border-[#27272a] bg-[#18181b] p-1">
              {views.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => handleViewChange(id)}
                  className={`rounded-md p-1.5 transition-colors ${
                    view === id
                      ? 'bg-blue-500 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title={label}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            {/* AI Chat */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="rounded-lg border border-[#27272a] bg-[#18181b] p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <MessageCircle size={18} />
            </button>

            {/* Save Button */}
            <button
              onClick={() => setShowSave(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
              Save
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg border border-[#27272a] bg-[#18181b] p-2 text-zinc-400 hover:text-white transition-colors"
              title="Settings"
            >
              <User size={18} />
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[#27272a]">
              <span className="text-sm text-zinc-400 truncate max-w-[100px]">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded-lg p-2 text-zinc-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Collections Sidebar (Mobile) */}
      <CollectionsSidebar
        isOpen={showCollections}
        onClose={() => setShowCollections(false)}
        activeCollectionId={activeCollectionId}
        onSelectCollection={setActiveCollectionId}
      />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <>
            {view === 'grid' && <GridSkeleton />}
            {view === 'list' && <ListSkeleton />}
            {view === 'table' && <TableSkeleton />}
            {view === 'kanban' && <KanbanSkeleton />}
          </>
        ) : filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <Bookmark className="text-zinc-400" size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {activeCollectionId ? 'This collection is empty' : 'Your library is empty'}
            </h2>
            <p className="text-zinc-400 mb-6">
              {activeCollectionId ? 'Add some bookmarks to this collection' : 'Save your first link to get started'}
            </p>
            <button
              onClick={() => setShowSave(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
              {activeCollectionId ? 'Add to collection' : 'Save your first link'}
            </button>
            
            {/* Example bookmarks */}
            {!activeCollectionId && (
              <div className="mt-10 w-full max-w-md">
                <p className="text-sm text-zinc-500 mb-4 text-center">Or try with example links:</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Development</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { url: 'https://github.com/vercel/next.js', label: 'Next.js' },
                        { url: 'https://react.dev', label: 'React' },
                        { url: 'https://tailwindcss.com', label: 'Tailwind CSS' },
                        { url: 'https://www.typescriptlang.org', label: 'TypeScript' },
                      ].map((item) => (
                        <button
                          key={item.url}
                          onClick={() => {
                            setShowSave(true)
                            useStore.getState().addBookmark(item.url)
                          }}
                          className="text-left p-3 rounded-lg border border-[#27272a] bg-[#18181b] hover:border-blue-500 transition-colors text-sm flex items-center gap-2"
                        >
                          <span className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">{item.label[0]}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-2">Design & Tools</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { url: 'https://www.figma.com', label: 'Figma' },
                        { url: 'https://www.notion.so', label: 'Notion' },
                        { url: 'https://vercel.com', label: 'Vercel' },
                        { url: 'https://supabase.com', label: 'Supabase' },
                      ].map((item) => (
                        <button
                          key={item.url}
                          onClick={() => {
                            setShowSave(true)
                            useStore.getState().addBookmark(item.url)
                          }}
                          className="text-left p-3 rounded-lg border border-[#27272a] bg-[#18181b] hover:border-purple-500 transition-colors text-sm flex items-center gap-2"
                        >
                          <span className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">{item.label[0]}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredBookmarks.map((bookmark, index) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} isFocused={index === focusedIndex} />
            ))}
          </div>
        ) : view === 'list' ? (
          <div className="flex flex-col gap-2">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} layout="list" />
            ))}
          </div>
        ) : view === 'table' ? (
          <TableView />
        ) : (
          <KanbanView />
        )}
      </main>

      {/* Modals */}
      {showSave && <SaveModal onClose={() => setShowSave(false)} />}
      {showOnboarding && <OnboardingOverlay onClose={() => { localStorage.setItem('s4f3_onboarding_complete', 'true'); setShowOnboarding(false); }} />}
      {showChat && <AIChat isOpen={showChat} onClose={() => setShowChat(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showCreateCollection && (
        <CollectionModal
          isOpen={showCreateCollection}
          onClose={() => setShowCreateCollection(false)}
          onCreate={handleCreateCollection}
        />
      )}
      {editingCollection && (
        <CollectionModal
          isOpen={!!editingCollection}
          onClose={() => setEditingCollection(null)}
          onUpdate={handleUpdateCollection}
          editing={editingCollection}
        />
      )}
      
      <Toaster position="bottom-right" theme="dark" />
    </div>
  )
}


function SettingsModal({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('s4f3_theme') as 'light' | 'dark') || 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('s4f3_theme', theme)
  }, [theme])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#27272a] bg-[#18181b] p-6 animate-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Theme</label>
            <div className="flex gap-3">
              {['light', 'dark'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t as 'light' | 'dark')}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
                    theme === t
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-[#27272a] text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {t === 'light' ? '☀️' : '🌙'} <span className="capitalize">{t}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Keyboard Shortcuts</label>
            <div className="space-y-2 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <kbd className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 font-mono">
                  <span>⌘</span>K
                </kbd>
                <span>Focus search</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 font-mono">
                  <span>Esc</span>
                </kbd>
                <span>Close modals</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#27272a]">
            <p className="text-xs text-zinc-500 text-center">S4F3 v1.0 — Built with AI</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  // Apply theme on mount
  useEffect(() => {
    const theme = (localStorage.getItem('s4f3_theme') as 'light' | 'dark') || 'dark'
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App