import { Heart, ExternalLink, Trash2, Link2 } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import type { Bookmark } from '../types'

interface Props {
  bookmark: Bookmark
  layout?: 'grid' | 'list'
  isFocused?: boolean
}

export function BookmarkCard({ bookmark, layout = 'grid', isFocused = false }: Props) {
  const { favBookmark, removeBookmark } = useStore()

  if (layout === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-[#27272a] bg-[#18181b] p-4 hover:border-zinc-600 transition-colors">
        {bookmark.image_url && (
          <img
            src={bookmark.image_url}
            alt=""
            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate mb-1">{bookmark.title || 'Untitled'}</h3>
          <p className="text-sm text-zinc-400 truncate">{bookmark.description || 'No description'}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.ai_tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => favBookmark(bookmark.id)}
            className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
            title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`${bookmark.is_favorite ? 'fill-red-400 text-red-400' : ''}`} size={16} />
          </button>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-zinc-400 hover:text-blue-400 transition-colors"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => removeBookmark(bookmark.id)}
            className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all ${
        isFocused
          ? 'border-blue-500 ring-2 ring-blue-500/20'
          : 'border-[#27272a] hover:border-zinc-600'
      } bg-[#18181b}`}
      tabIndex={0}
    >
      {bookmark.image_url && (
        <img
          src={bookmark.image_url}
          alt=""
          className="h-40 w-full object-cover"
        />
      )}
      {!bookmark.image_url && (
        <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <Link2 className="text-zinc-400" size={32} />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-medium text-sm truncate mb-1">{bookmark.title || 'Untitled'}</h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{bookmark.description || 'No description'}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {(bookmark.ai_tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {bookmark.source || 'web'}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => favBookmark(bookmark.id)}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
              title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`${bookmark.is_favorite ? 'fill-red-400 text-red-400' : ''}`} size={14} />
            </button>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-zinc-400 hover:text-blue-400 transition-colors"
            >
              <ExternalLink size={14} />
            </a>
            <button
              onClick={() => removeBookmark(bookmark.id)}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => favBookmark(bookmark.id)}
          className="p-1.5 rounded bg-black/50 text-zinc-300 hover:text-red-400 hover:bg-red-500/20 transition-colors"
          title={bookmark.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`${bookmark.is_favorite ? 'fill-red-400 text-red-400' : ''}`} size={14} />
        </button>
        <button
          onClick={() => removeBookmark(bookmark.id)}
          className="p-1.5 rounded bg-black/50 text-zinc-300 hover:text-red-400 hover:bg-red-500/20 transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}