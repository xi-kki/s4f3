
import { Link2, Sparkles } from 'lucide-react'

interface Props {
  onSignIn: () => void
  onGetStarted: () => void
}

export function LandingPage({ onSignIn, onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0b] relative overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30"
        autoPlay
        muted
        loop
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_124724_bc041163-d651-425f-aea3-2acc1efc2c96.mp4"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <a href="#" className="flex items-center gap-3" aria-label="S4F3 home">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Link2 className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold">S4F3</span>
        </a>
        <div className="flex items-center gap-4">
          <button
            onClick={onSignIn}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#27272a] bg-[#18181b]/80 px-4 py-1.5 mb-6">
          <Sparkles size={14} className="text-blue-400" />
          <span className="text-xs text-zinc-400">AI-Powered Bookmarking</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Save smarter.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Find faster.
          </span>
        </h1>
        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
          Stop losing links in endless folders. S4F3 uses AI to organize, tag, and surface your bookmarks when you need them.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-4 text-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Start Saving — It's Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-4">No credit card required · Free forever</p>
      </main>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why S4F3?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon="🧠" title="AI Auto-Organization" desc="Auto-summarize, auto-tag, and auto-group your saves with Groq AI" />
          <FeatureCard icon="🔍" title="Semantic Search" desc="Find anything using natural language with pgvector-powered search" />
          <FeatureCard icon="💬" title="AI Chat Assistant" desc="Ask questions about your bookmarks — get instant answers" />
          <FeatureCard icon="📁" title="Smart Collections" desc="AI creates collections automatically based on content" />
          <FeatureCard icon="🎨" title="Multiple Views" desc="Grid, List, Table, and Kanban — your library, your way" />
          <FeatureCard icon="⚡" title="One-Click Save" desc="Browser extension and share sheet integration coming soon" />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-6 hover:border-blue-500/50 transition-colors">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{desc}</p>
    </div>
  )
}