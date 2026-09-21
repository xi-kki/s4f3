import { useState } from 'react'
import { X, Loader2, Mail, Lock, Github, Chrome } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

interface Props {
  onClose: () => void
  mode?: 'login' | 'signup'
}

export function AuthModal({ onClose, mode = 'login' }: Props) {
  const [isSignUp, setIsSignUp] = useState(mode === 'signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setLoading(true)
    setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setError(error.message)
      }
    } catch (e) {
      setError('OAuth sign in failed')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (isSignUp) {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Check your email for confirmation link!')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        onClose()
      }
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md sm:max-w-md md:max-w-md lg:max-w-md xl:max-w-md rounded-2xl border border-[#27272a] bg-[#18181b] p-6 animate-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔗</span>
            <h2 className="text-lg font-semibold">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-3 text-sm font-medium text-zinc-300 hover:border-blue-500 hover:bg-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Github size={18} />
            <span>Continue with GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-[#27272a] bg-[#0a0a0b] px-4 py-3 text-sm font-medium text-zinc-300 hover:border-green-500 hover:bg-green-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Chrome size={18} />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#27272a]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#18181b] text-zinc-500">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0b] pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#27272a] bg-[#0a0a0b] pl-10 pr-4 py-3 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 py-3 font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <Loader2 className="mx-auto animate-spin" size={20} /> : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-400">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-blue-400 hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-blue-400 hover:underline"
              >
                Create one
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}