import { Heart, ExternalLink, Trash2, Link2 } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import type { Bookmark } from '../types'

interface Props {
  bookmark: Bookmark
  layout?: 'grid' | 'list'
}

export function BookmarkCard({ bookmark, layout = 'grid' }: Props) {
  const { favBookmark, removeBookmark } = useStore()

  if (layout === 'list') {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-[#27272a] bg-[#18181b] p-4 hover:border-zinc-600 transition-colors">
        {bookmark.image_url && (
          <img
            src={bookmark.image_url}
            alt=""
            className="h-12 w-12 rounded-lg object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="truncate font-medium">{bookmark.title || 'Untitled'}</h3>
          <p className="truncate text-sm text-zinc-400">{bookmark.url}</p>
        </div>
        {bookmark.ai_tags?.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
            {tag}
          </span>
        ))}
        <div className="flex gap-1">
          <button
            onClick={() => favBookmark(bookmark.id)}
            className={`rounded-lg p-2 transition-colors ${
              bookmark.is_favorite ? 'text-red-500' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart size={16} fill={bookmark.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => removeBookmark(bookmark.id)}
            className="rounded-lg p-2 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[#27272a] bg-[#18181b] hover:border-zinc-600 transition-all">
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-medium">{bookmark.title || 'Untitled'}</h3>
          <button
            onClick={() => favBookmark(bookmark.id)}
            className={`shrink-0 rounded-lg p-1 transition-colors ${
              bookmark.is_favorite ? 'text-red-500' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart size={14} fill={bookmark.is_favorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        {bookmark.description && (
          <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{bookmark.description}</p>
        )}

        {bookmark.ai_tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {bookmark.ai_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
          <span>{bookmark.source || new URL(bookmark.url).hostname}</span>
          <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
        >
          <ExternalLink size={14} />
        </a>
        <button
          onClick={() => removeBookmark(bookmark.id)}
          className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-red-500/80 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
