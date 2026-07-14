import { useState, useEffect } from 'react'
import { useStore } from './hooks/useBookmarks'
import { BookmarkCard } from './components/BookmarkCard'
import { SaveModal } from './components/SaveModal'
import { AIChat } from './components/AIChat'
import { SearchBar } from './components/SearchBar'
import { LayoutGrid, List, Table, Kanban, Plus, MessageCircle, Loader2 } from 'lucide-react'

function App() {
  const { bookmarks, view, setView, loadBookmarks, loading } = useStore()
  const [showSave, setShowSave] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    loadBookmarks()
  }, [])

  const views = [
    { id: 'grid' as const, icon: LayoutGrid, label: 'Grid' },
    { id: 'list' as const, icon: List, label: 'List' },
    { id: 'table' as const, icon: Table, label: 'Table' },
    { id: 'kanban' as const, icon: Kanban, label: 'Kanban' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#27272a] bg-[#0a0a0b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔗</span>
            <h1 className="text-xl font-bold">S4F3</h1>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">AI</span>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-[#27272a] bg-[#18181b] p-1">
              {views.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🔗</span>
            <h2 className="text-xl font-semibold mb-2">Your library is empty</h2>
            <p className="text-zinc-400 mb-6">Save your first link to get started</p>
            <button
              onClick={() => setShowSave(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium hover:bg-blue-600 transition-colors"
            >
              <Plus size={18} />
              Save your first link
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        ) : view === 'list' ? (
          <div className="flex flex-col gap-2">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} layout="list" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showSave && <SaveModal onClose={() => setShowSave(false)} />}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}
    </div>
  )
}

export default App
