import { useState } from 'react'
import { X, Loader2, Sparkles } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import { summarizeUrl } from '../lib/api'

interface Props {
  onClose: () => void
}

export function SaveModal({ onClose }: Props) {
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)
  const [aiResult, setAiResult] = useState<any>(null)
  const { addBookmark } = useStore()

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
        ...(ai.tags || [])
      ]
      await addBookmark(url, allTags)
      onClose()
    } catch (e) {
      // Save anyway without AI
      await addBookmark(url, tags.split(',').map((t) => t.trim()).filter(Boolean))
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-[#27272a] bg-[#18181b] p-6 animate-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
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
              <div className="mt-2 flex flex-wrap gap-1">
                {aiResult.tags?.map((tag: string) => (
                  <span key={tag} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={!url || saving}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                AI is analyzing...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Save with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
