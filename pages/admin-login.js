import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from '@supabase/auth-helpers-react'
import supabase from '@/lib/supabaseClient'

export default function AdminLogin() {
  const router = useRouter()
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const processedRef = useRef(false)

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin-login` : undefined,
        },
      })
      if (error) {
        setMessage('Failed to start Google sign-in.')
        setLoading(false)
      }
    } catch (e) {
      setMessage('Unexpected error starting Google sign-in.')
      setLoading(false)
    }
  }

  const signInWithMicrosoft = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/admin-login` : undefined,
        },
      })
      if (error) {
        setMessage('Failed to start Microsoft sign-in.')
        setLoading(false)
      }
    } catch (e) {
      setMessage('Unexpected error starting Microsoft sign-in.')
      setLoading(false)
    }
  }

  useEffect(() => {
    const guard = async () => {
      if (!session?.user || processedRef.current) return
      processedRef.current = true
      const email = session.user.email || ''

      // Basic allowlist check
      const isAllowed = adminEmails.includes(email)
      if (isAllowed) {
        router.replace('/admin')
        return
      }

      // Optional: check a role flag in profiles table
      try {
        const { data } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .maybeSingle()

        // If you later add a role flag, enforce it here
      } catch {}

      setMessage('You do not have admin access. Redirecting…')
      setTimeout(() => router.replace('/dashboard'), 1500)
    }

    guard()
  }, [session])

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 sm:px-6 bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img src="/images/bhasha.jpeg" alt="Bhasha" className="h-12 w-12 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
          <div className="text-center">
            <p className="text-2xl font-extrabold tracking-tight">Bhasha</p>
            <p className="text-sm text-orange-200/80">Admin Login</p>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
            Continue with Google
          </h2>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60"
              aria-label="Sign in with Google"
            >
              <Image
                src={require("@/components/signin-assets/Web (mobile + desktop)/png@2x/light/web_light_rd_SI@2x.png")}
                alt="Sign in with Google"
                width={220}
                height={50}
                priority
              />
            </button>
          </div>

          {process.env.NEXT_PUBLIC_ENABLE_MICROSOFT === 'true' && (
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={signInWithMicrosoft}
                disabled={loading}
                className="px-4 py-3 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text:white font-medium transition-colors disabled:opacity-60"
              >
                Sign in with Microsoft
              </button>
            </div>
          )}

          {message ? (
            <p className="text-center text-sm text-orange-100/90">{message}</p>
          ) : null}

          <div className="text-center text-xs text-orange-200/70">
            <p>Only authorized admins can proceed. Not an admin?</p>
            <Link href="/dashboard" className="underline decoration-orange-300/50 hover:decoration-orange-200">Go back</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

