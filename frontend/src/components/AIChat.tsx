import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, Bot, User } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'

interface Props {
  onClose: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIChat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI bookmark assistant. Ask me anything about your saved links — I can find, summarize, or organize them for you."
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { chat } = useStore()
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const response = await chat(userMsg)
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }
      ])
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex h-[600px] w-full max-w-lg flex-col rounded-2xl border border-[#27272a] bg-[#18181b] animate-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#27272a] p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
              <Bot size={16} className="text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-xs text-zinc-400">Ask about your bookmarks</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                  <Bot size={14} className="text-blue-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-[#27272a] text-zinc-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-700">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                <Bot size={14} className="text-blue-400" />
              </div>
              <div className="rounded-2xl bg-[#27272a] px-4 py-3">
                <Loader2 className="animate-spin text-blue-400" size={16} />
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Input */}
        <div className="border-t border-[#27272a] p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your bookmarks..."
              className="flex-1 rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="rounded-lg bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
