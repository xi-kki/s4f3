import { useState, useEffect } from 'react'
import { X, Loader2, Sparkles, Link2, Eye, Check, AlertCircle } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import { summarizeUrl } from '../lib/api'
import { toast } from 'sonner'

interface Props {
  onClose: () => void
}

interface UrlPreview {
  title: string
  description: string
  image_url: string | null
  favicon_url: string | null
  source: string
}

export function SaveModal({ onClose }: Props) {
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const [preview, setPreview] = useState<UrlPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState<string | null>(null)
  const { addBookmark } = useStore()

  // Fetch preview when URL changes (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!url || !url.startsWith('http')) {
        setPreview(null)
        setPreviewError(null)
        return
      }
      setPreviewLoading(true)
      setPreviewError(null)
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/ai/preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        })
        if (res.ok) {
          const data = await res.json()
          setPreview(data.preview)
        } else {
          setPreviewError('Could not fetch preview')
        }
      } catch (e) {
        setPreviewError('Preview unavailable')
      }
      setPreviewLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [url])

  const handleSave = async () => {
    if (!url) return
    setSaving(true)

    try {
      // Get AI summary first
      const ai = await summarizeUrl(url)
      setAiResult(ai)

      // Save with AI tags
      const allTags = [
        ...tags.split(',').map((t) => t.trim()).filter(Boolean),
        ...(ai.tags || []),
      ]
      await addBookmark(url, allTags)
      toast.success('Bookmark saved!')
      onClose()
    } catch (e) {
      // Save anyway without AI
      await addBookmark(url, tags.split(',').map((t) => t.trim()).filter(Boolean))
      toast.success('Bookmark saved (without AI)')
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg sm:max-w-lg md:max-w-lg lg:max-w-lg xl:max-w-lg rounded-2xl border border-[#27272a] bg-[#18181b] p-4 sm:p-6 animate-in max-h-[90vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link2 size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold">Save to S4F3</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* URL Preview */}
          {previewLoading && (
            <div className="rounded-lg border border-[#27272a] bg-[#0a0a0b] p-4 flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-500" size={20} />
              <span className="text-zinc-400">Fetching preview...</span>
            </div>
          )}
          {previewError && !previewLoading && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400 text-sm">{previewError}</span>
            </div>
          )}
          {preview && !previewLoading && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
              <div className="flex items-center gap-2 text-sm text-green-400 mb-3">
                <Eye size={14} />
                <span>Preview</span>
                <Check className="text-green-400" size={12} />
              </div>
              <div className="flex gap-3">
                {preview.image_url && (
                  <img
                    src={preview.image_url}
                    alt=""
                    className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                {preview.favicon_url && !preview.image_url && (
                  <img
                    src={preview.favicon_url}
                    alt=""
                    className="h-24 w-24 rounded-lg object-contain flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate mb-1">{preview.title}</h4>
                  <p className="text-sm text-zinc-400 line-clamp-2">{preview.description}</p>
                  <span className="text-xs text-zinc-500">{preview.source}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, inspiration, tutorial"
              className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {aiResult && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                <Sparkles size={14} />
                AI Analysis
              </div>
              <p className="text-sm text-zinc-300">{aiResult.summary}</p>
              {aiResult.tags && aiResult.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {aiResult.tags.slice(0, 5).map((tag: string) => (
                    <span key={tag} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-[#27272a] bg-[#0a0a0b] py-3 text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !url}
              className="flex-1 rounded-lg bg-blue-500 py-3 font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}