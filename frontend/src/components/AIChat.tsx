import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, Bot, User, Sparkles, Copy } from 'lucide-react'
import { useStore } from '../hooks/useBookmarks'
import { toast } from 'sonner'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIChat({ isOpen, onClose }: Props) {
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

  // Reset messages when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm your AI bookmark assistant. Ask me anything about your saved links — I can find, summarize, or organize them for you."
        }
      ])
    }
  }, [isOpen])

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
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
      toast.error('AI chat failed')
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-[#18181b] border-l border-[#27272a] flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="text-white" size={18} />
            </div>
            <div>
              <h2 className="font-semibold">AI Assistant</h2>
              <p className="text-xs text-zinc-400">Powered by Groq</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user'
                    ? 'bg-blue-500'
                    : 'bg-purple-500'
                }`}
              >
                {message.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div
                className={`max-w-[80%] ${
                  message.role === 'user' ? 'text-right' : ''
                }`}
              >
                <div
                  className={`rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 text-blue-100 rounded-tr-none'
                      : 'bg-[#27272a] text-white rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="mt-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Copy size={12} />
                      Copy
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEnd} />
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="px-4 py-2 flex items-center gap-2 text-zinc-400 text-sm">
            <Loader2 className="animate-spin" size={16} />
            <span>Thinking...</span>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-[#27272a]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your bookmarks..."
              className="flex-1 rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              disabled={loading}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2 text-center">
            Try: "Show me React tutorials" or "Summarize my latest saves"
          </p>
        </div>
      </div>
    </div>
  )
}