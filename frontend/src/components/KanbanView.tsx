import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Heart, Trash2, GripVertical, ExternalLink } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import type { Bookmark } from '../types'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface KanbanColumnProps {
  id: string
  title: string
  bookmarks: Bookmark[]
  onBookmarkMove: (bookmarkId: number, newColumnId: string, newIndex: number) => void
}

function KanbanColumn({ title, bookmarks }: KanbanColumnProps) {
  return (
    <div className="flex flex-col min-h-[500px] w-80 flex-shrink-0">
      <div className="px-3 py-2 text-sm font-medium text-zinc-400 uppercase tracking-wider flex items-center justify-between">
        <span>{title}</span>
        <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">{bookmarks.length}</span>
      </div>
      <SortableContext
        items={bookmarks.map((b) => b.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto rounded-xl bg-[#0a0a0b] min-h-[400px]">
          {bookmarks.map((bookmark) => (
            <SortableBookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
            />
          ))}
          {bookmarks.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm py-8 border-2 border-dashed border-[#27272a] rounded-lg">
              Drop bookmarks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

interface SortableBookmarkCardProps {
  bookmark: Bookmark
}

function SortableBookmarkCard({ bookmark }: SortableBookmarkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl border border-[#27272a] bg-[#18181b] hover:border-zinc-600 transition-all ${
        isDragging ? 'shadow-xl ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="absolute top-2 left-2 z-10 p-1 text-zinc-500 hover:text-white">
        <GripVertical size={16} />
      </div>
      {bookmark.image_url && (
        <img
          src={bookmark.image_url}
          alt=""
          className="h-32 w-full object-cover rounded-t-xl"
        />
      )}
      {!bookmark.image_url && (
        <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-xl">
          <ExternalLink className="text-zinc-400" size={32} />
        </div>
      )}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate mb-1">{bookmark.title || 'Untitled'}</h3>
        <p className="text-xs text-zinc-400 line-clamp-2 mb-2">{bookmark.description || 'No description'}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {(bookmark.ai_tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-blue-500/10 px-1.5 py-0.5 text-xs text-blue-400">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {formatDistanceToNow(new Date(bookmark.created_at), { addSuffix: true })}
          </span>
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                useStore.getState().favBookmark(bookmark.id)
                toast.success(bookmark.is_favorite ? 'Removed from favorites' : 'Added to favorites')
              }}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <Heart className={`${bookmark.is_favorite ? 'fill-red-400 text-red-400' : ''}`} size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                useStore.getState().removeBookmark(bookmark.id)
                toast.success('Bookmark deleted')
              }}
              className="p-1 text-zinc-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      <div {...attributes} {...listeners} className="sr-only" aria-label="Drag to reorder" />
    </div>
  )
}

export function KanbanView() {
  const { bookmarks, collections } = useStore()
  const [columns, setColumns] = useState<Record<string, Bookmark[]>>(() => {
    const initial: Record<string, Bookmark[]> = { 'uncategorized': [] }
    collections.forEach((c) => { initial[c.id.toString()] = [] })
    bookmarks.forEach((b) => {
      const colId = b.collection_id?.toString() || 'uncategorized'
      if (!initial[colId]) initial[colId] = []
      initial[colId].push(b)
    })
    return initial
  })

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const bookmarkId = Number(active.id)
      const targetColumnId = over.id.toString().split('-')[0]
      const targetIndex = Number(over.id.toString().split('-')[1]) || 0

      setColumns((prev) => {
        const newColumns = { ...prev }
        const sourceColumnId = Object.keys(newColumns).find((col) =>
          newColumns[col].some((b) => b.id === bookmarkId)
        )

        if (!sourceColumnId) return prev

        const bookmark = newColumns[sourceColumnId].find((b) => b.id === bookmarkId)
        if (!bookmark) return prev

        newColumns[sourceColumnId] = newColumns[sourceColumnId].filter((b) => b.id !== bookmarkId)

        if (!newColumns[targetColumnId]) newColumns[targetColumnId] = []

        const insertIndex = Math.min(targetIndex, newColumns[targetColumnId].length)
        newColumns[targetColumnId] = arrayMove(
          [...newColumns[targetColumnId], bookmark],
          newColumns[targetColumnId].length,
          insertIndex
        )

        return newColumns
      })

      onMove(bookmarkId, targetColumnId, targetIndex)
    }
  }, [])

  const onMove = useCallback(async (bookmarkId: number, newColumnId: string, _newIndex: number) => {
    const collectionId = newColumnId === 'uncategorized' ? null : Number(newColumnId)
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/bookmarks/${bookmarkId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection_id: collectionId }),
      })
    } catch (e) {
      toast.error('Failed to move bookmark')
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const columnOrder = ['uncategorized', ...collections.map((c) => c.id.toString())]

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          {columnOrder.map((colId) => {
            const collection = collections.find((c) => c.id.toString() === colId)
            return (
              <KanbanColumn
                key={colId}
                id={colId}
                title={collection?.name || 'Uncategorized'}
                bookmarks={columns[colId] || []}
                onBookmarkMove={onMove}
              />
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}