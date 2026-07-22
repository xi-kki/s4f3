import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useStore } from './hooks/useBookmarks'
import { BookmarkCard } from './components/BookmarkCard'
import { SaveModal } from './components/SaveModal'
import { AIChat } from './components/AIChat'
import { SearchBar } from './components/SearchBar'
import { AuthModal } from './components/AuthModal'
import { 
  LayoutGrid, List, Table, Kanban, Plus, MessageCircle, 
  Loader2, LogOut, User, Link2, Bookmark, Sparkles
} from 'lucide-react'

function AppContent() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { bookmarks, view, setView, loadBookmarks, loading } = useStore()
  const [showSave, setShowSave] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

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
      <div className="min-h-screen bg-[#0a0a0b]">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full" />
          
          {/* Navigation */}
          <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Link2 className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold">S4F3</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAuth(true)}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#27272a] bg-[#18181b]/80 px-4 py-1.5 mb-6">
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-xs text-zinc-400">AI-Powered Bookmarking</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Save smarter.
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Find faster.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Stop losing links in endless folders. S4F3 uses AI to organize, tag, and surface your bookmarks when you need them.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-4 text-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Start Saving — It's Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-4">No credit card required · Free forever</p>
          </div>
        </div>

        {/* Features Section */}
        <section className="relative py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Everything you need to save smarter</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">Powerful features that make bookmarking effortless</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, title: 'AI Auto-Tagging', desc: 'Automatically categorize and tag your bookmarks with AI. Never organize manually again.' },
                { icon: SearchBar, title: 'Natural Language Search', desc: 'Find bookmarks by describing what you remember. "That article about React performance" — found.' },
                { icon: LayoutGrid, title: 'Multiple Views', desc: 'Grid, list, table, or kanban — view your bookmarks the way that works best for you.' },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl border border-[#27272a] bg-[#18181b]/50 hover:border-zinc-600 transition-colors">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                    <feature.icon size={24} className="text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-[#18181b]/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How it works</h2>
              <p className="text-zinc-400">Three simple steps to organized bookmarks</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Save', desc: 'Click the extension or paste a URL. S4F3 captures everything automatically.' },
                { step: '02', title: 'AI Organizes', desc: 'Our AI reads, categorizes, and tags your bookmark instantly.' },
                { step: '03', title: 'Find Anytime', desc: 'Search naturally or browse by category. Your bookmarks, always accessible.' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-bold text-blue-500/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to save smarter?</h2>
            <p className="text-zinc-400 mb-8">Join thousands who've ditched messy bookmarks folders</p>
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-2 mx-auto rounded-lg bg-blue-500 px-8 py-4 text-lg font-medium hover:bg-blue-600 transition-colors"
            >
              <User size={20} />
              Get Started Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#27272a] py-8 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Link2 className="text-white" size={12} />
              </div>
              <span className="text-sm font-medium">S4F3</span>
            </div>
            <p className="text-xs text-zinc-500">© 2026 S4F3. Save smarter, find faster.</p>
          </div>
        </footer>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
              <Bookmark className="text-zinc-400" size={32} />
            </div>
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
