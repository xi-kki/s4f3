import { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { Search, X, Loader2, Zap, Brain, Clock, Trash2 } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import { toast } from 'sonner'

interface SearchBarProps {
  externalRef?: React.Ref<HTMLInputElement>
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>((props, ref) => {
  const { externalRef } = props
  const [query, setQuery] = useState('')
  const [searchMode, setSearchMode] = useState<'text' | 'semantic'>('text')
  const [showHistory, setShowHistory] = useState(false)
  const { search, semanticSearch, loadBookmarks } = useStore()
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  // Expose focus to parent via ref
  useImperativeHandle(ref, () => inputRef.current!, [])
  // Expose focus to parent via externalRef prop
  useImperativeHandle(externalRef as React.Ref<HTMLInputElement>, () => inputRef.current!, [])

  // Load search history from localStorage
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('s4f3_search_history') || '[]')
    } catch {
      return []
    }
  })

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('s4f3_search_history', JSON.stringify(history))
  }, [history])

  const addToHistory = useCallback((q: string) => {
    if (!q.trim()) return
    setHistory((prev) => [q, ...prev.filter((h) => h !== q)].slice(0, 10))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('s4f3_search_history')
  }, [])

  const handleSearch = useCallback(async (searchQuery: string = query) => {
    if (!searchQuery.trim()) {
      await loadBookmarks()
      return
    }
    setSearching(true)
    addToHistory(searchQuery)

    try {
      if (searchMode === 'semantic') {
        await semanticSearch(searchQuery)
      } else {
        await search(searchQuery)
      }
    } catch (e) {
      toast.error('Search failed')
    }
    setSearching(false)
  }, [query, searchMode, search, semanticSearch, loadBookmarks, addToHistory])

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query)
      } else {
        loadBookmarks()
      }
    }, 300)
    return () => clearTimeout(debounceTimerRef.current)
  }, [query, handleSearch, loadBookmarks])

  const handleClear = async () => {
    setQuery('')
    await loadBookmarks()
  }

  const handleHistoryClick = (q: string) => {
    setQuery(q)
    handleSearch(q)
    setShowHistory(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
      setShowHistory(false)
    }
    if (e.key === 'Escape') {
      setShowHistory(false)
      inputRef.current?.blur()
    }
  }

  const handleFocus = () => {
    if (history.length > 0) setShowHistory(true)
  }

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 text-zinc-400" size={16} />
      
      {/* Search Mode Toggle */}
      <div className="absolute left-10 flex items-center gap-1 rounded-lg bg-[#0a0a0b] border border-[#27272a] p-0.5 mr-2">
        <button
          onClick={() => setSearchMode('text')}
          className={`rounded-md px-2 py-1 text-xs transition-colors ${
            searchMode === 'text'
              ? 'bg-blue-500 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Text Search"
        >
          <Zap size={12} />
        </button>
        <button
          onClick={() => setSearchMode('semantic')}
          className={`rounded-md px-2 py-1 text-xs transition-colors ${
            searchMode === 'semantic'
              ? 'bg-purple-500 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Semantic Search (AI)"
        >
          <Brain size={12} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={() => setTimeout(() => setShowHistory(false), 200)}
        placeholder="Search your bookmarks... (⌘K to focus)"
        className="w-full rounded-lg border border-[#27272a] bg-[#18181b] pl-28 pr-10 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
      />

      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-zinc-400 hover:text-white"
        >
          {searching ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />}
        </button>
      )}

      {/* Search History Dropdown */}
      {showHistory && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-[#27272a] bg-[#18181b] shadow-xl overflow-hidden z-50 animate-in">
          <div className="px-3 py-2 border-b border-[#27272a] flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Recent searches</span>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
              >
                <Trash2 size={10} />
                Clear
              </button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {history.map((h) => (
              <button
                key={h}
                onClick={() => handleHistoryClick(h)}
                className="w-full px-3 py-2 text-left text-sm text-zinc-300 hover:bg-[#27272a] flex items-center gap-2"
              >
                <Clock size={14} className="text-zinc-500" />
                <span className="truncate">{h}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

SearchBar.displayName = 'SearchBar'