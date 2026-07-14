import { useState, useCallback } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const { search, loadBookmarks } = useStore()
  const [searching, setSearching] = useState(false)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      await loadBookmarks()
      return
    }
    setSearching(true)
    await search(query)
    setSearching(false)
  }, [query, search, loadBookmarks])

  const handleClear = async () => {
    setQuery('')
    await loadBookmarks()
  }

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 text-zinc-400" size={16} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search your bookmarks..."
        className="w-full rounded-lg border border-[#27272a] bg-[#18181b] pl-10 pr-10 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 text-zinc-400 hover:text-white"
        >
          {searching ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />}
        </button>
      )}
    </div>
  )
}
