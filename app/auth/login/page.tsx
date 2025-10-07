'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      setEmailSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="card-mm w-full max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-heading">Check your email</h1>
            <p className="text-muted-foreground">
              We sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Click the link in the email to sign in to your account.
            </p>
          </div>

          <button
            onClick={() => {
              setEmailSent(false)
              setEmail('')
            }}
            className="btn-secondary w-full"
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="card-mm w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-heading">Peptide Shot Tracker</h1>
          <p className="text-muted-foreground">
            Sign in to track your injections
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-mm"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-error text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-mm w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending magic link...
              </>
            ) : (
              <>
                Send magic link
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          We&apos;ll email you a magic link for a password-free sign in.
        </p>
      </div>
    </div>
  )
}
