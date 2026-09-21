import { useState, useEffect } from 'react'
import { Folder, FolderOpen, Plus, Edit2, Trash2 } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import type { Collection } from '../types'
import { toast } from 'sonner'

interface Props {
  isOpen: boolean
  onClose: () => void
  activeCollectionId: number | null
  onSelectCollection: (id: number | null) => void
}

export function CollectionsSidebar({ isOpen, onClose, activeCollectionId, onSelectCollection }: Props) {
  const { collections, loadCollections, deleteCollection } = useStore()
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadCollections()
    }
  }, [isOpen, loadCollections])

  const handleDelete = async (collection: Collection) => {
    if (!confirm(`Delete "${collection.name}"? Bookmarks will move to Uncategorized.`)) return
    try {
      await deleteCollection(collection.id)
      toast.success('Collection deleted')
      await loadCollections()
    } catch (e) {
      toast.error('Failed to delete collection')
    }
  }

  const startEdit = (collection: Collection) => {
    setEditingCollection(collection)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex lg:hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-72 h-full bg-[#18181b] border-r border-[#27272a] flex flex-col animate-in slide-in-from-left">
        <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
          <h2 className="font-semibold flex items-center gap-2">
            <FolderOpen size={20} />
            Collections
          </h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {/* All Bookmarks */}
          <button
            onClick={() => onSelectCollection(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeCollectionId === null
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-zinc-300 hover:bg-[#27272a]'
            }`}
          >
            <Folder size={18} />
            <span className="flex-1 truncate">All Bookmarks</span>
          </button>

          {/* Collections */}
          {collections.map((collection) => (
            <div key={collection.id} className="relative group">
              <button
                onClick={() => onSelectCollection(collection.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCollectionId === collection.id
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-zinc-300 hover:bg-[#27272a]'
                }`}
              >
                <span className="text-lg">{collection.emoji || '📁'}</span>
                <span className="flex-1 truncate">{collection.name}</span>
              </button>
              {/* Edit/Delete on hover */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); startEdit(collection) }}
                  className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#27272a]"
                  title="Edit"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(collection) }}
                  className="p-1.5 rounded text-zinc-400 hover:text-red-400 hover:bg-[#27272a]"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {collections.length === 0 && (
            <p className="px-3 py-4 text-center text-zinc-500 text-sm">
              No collections yet. Create one to organize your bookmarks!
            </p>
          )}
        </div>

        <div className="p-3 border-t border-[#27272a]">
          <button
            onClick={() => setEditingCollection({ id: 0, name: '', description: null, emoji: '📁', is_ai_generated: 0, created_at: '' } as Collection)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[#27272a] text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
          >
            <Plus size={16} />
            New Collection
          </button>
        </div>

        {editingCollection && (
          <CollectionModal
            isOpen={true}
            onClose={() => setEditingCollection(null)}
            onUpdate={async (id, name, emoji) => {
              if (id === 0) return // new collection handled by parent
              try {
                await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/collections/${id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: name.trim(), emoji }),
                })
                toast.success('Collection updated')
                await loadCollections()
              } catch (e) {
                toast.error('Failed to update collection')
              }
            }}
            editing={editingCollection}
          />
        )}
      </div>
    </div>
  )
}

interface CollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate?: (name: string, emoji: string) => void
  onUpdate?: (id: number, name: string, emoji: string) => void
  editing?: Collection | null
}

export function CollectionModal({ isOpen, onClose, onCreate, onUpdate, editing }: CollectionModalProps) {
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState('📁')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editing) {
      setName(editing.name)
      setEmoji(editing.emoji)
    } else {
      setName('')
      setEmoji('📁')
    }
  }, [editing, isOpen])

  const emojis = ['📁', '📂', '🗂️', '📚', '🎮', '💻', '🎨', '🔬', '💡', '🚀', '📝', '🎯', '🏷️', '⭐', '🔖']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || loading) return
    setLoading(true)
    try {
      if (editing && onUpdate) {
        await onUpdate(editing.id, name.trim(), emoji)
      } else if (onCreate) {
        await onCreate(name.trim(), emoji)
      }
      onClose()
    } catch (e) {
      toast.error(editing ? 'Failed to update' : 'Failed to create')
    }
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#27272a] bg-[#18181b] p-6 animate-in">
        <h2 className="text-xl font-bold mb-6">{editing ? 'Edit' : 'Create'} Collection</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Collection name"
              className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all ${
                    emoji === e
                      ? 'border-2 border-blue-500 bg-blue-500/10 scale-110'
                      : 'border border-[#27272a] hover:border-zinc-600'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#27272a] bg-[#0a0a0b] py-2 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 rounded-lg bg-blue-500 py-2 font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '...' : editing ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}