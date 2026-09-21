import { useState } from 'react'
import { X, ArrowRight, Sparkles, Zap, Brain, Folder, MessageCircle, Plus } from 'lucide-react'

interface Props {
  onClose: () => void
}

const steps = [
  {
    title: "Welcome to S4F3",
    description: "Your AI-powered bookmark manager. Save smarter, find faster.",
    icon: Sparkles,
    color: "from-blue-500 to-purple-600",
  },
  {
    title: "One-Click Save",
    description: "Save any link instantly. AI auto-summarizes, auto-tags, and auto-organizes everything.",
    icon: Zap,
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "AI Intelligence",
    description: "Semantic search finds by meaning, not keywords. Chat with your bookmarks naturally.",
    icon: Brain,
    color: "from-purple-500 to-violet-600",
  },
  {
    title: "Smart Collections",
    description: "AI creates collections automatically. Kanban, Grid, List, Table views — your way.",
    icon: Folder,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Keyboard Shortcuts",
    description: "⌘K to search, Escape to close, Arrow keys to navigate. Built for speed.",
    icon: MessageCircle,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "You're Ready!",
    description: "Start saving your first link. Try the example buttons on the empty state.",
    icon: Plus,
    color: "from-pink-500 to-rose-600",
  },
]

export function OnboardingOverlay({ onClose }: Props) {
  const [step, setStep] = useState(0)

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onClose()
    }
  }

  const prev = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const current = steps[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl border border-[#27272a] bg-[#18181b] overflow-hidden animate-in">
        {/* Progress */}
        <div className="h-1 bg-[#27272a]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="p-8">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#27272a] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center`}>
              <current.icon className="text-white" size={32} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">{current.title}</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">{current.description}</p>
          </div>

          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === step
                    ? 'bg-blue-500 w-8'
                    : 'bg-[#27272a] hover:bg-zinc-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#27272a] text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowRight className="-rotate-180" size={18} />
              <span>Back</span>
            </button>

            <button
              onClick={next}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium text-white hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              {step === steps.length - 1 ? (
                <>
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}