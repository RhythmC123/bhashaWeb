import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import supabase from '@/lib/supabaseClient'
import { useSession } from '@supabase/auth-helpers-react'

export default function Login() {
  const router = useRouter()
  const session = useSession()
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const processedRef = useRef(false)

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        },
      })
      if (error) {
        setStatusMessage('Failed to start Google sign-in.')
        setLoading(false)
      }
      // Redirect happens automatically on success
    } catch (e) {
      setStatusMessage('Unexpected error starting Google sign-in.')
      setLoading(false)
    }
  }

  useEffect(() => {
    const upsertUser = async () => {
      if (!session?.user || processedRef.current) return
      processedRef.current = true
      const user = session.user
      const email = user.email || ''
      const id = user.id
      const fullName =
        (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) ||
        [user.user_metadata?.given_name, user.user_metadata?.family_name].filter(Boolean).join(' ') ||
        ''
      const avatarUrl = (user.user_metadata && (user.user_metadata.avatar_url || user.user_metadata.picture)) || null

      try {
        // Check if email already exists in profiles
        const { data: existingByEmail, error: emailCheckError } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', email)
          .maybeSingle()

        if (emailCheckError) {
          // Non-fatal; continue
        }

        if (existingByEmail && existingByEmail.id !== id) {
          setStatusMessage('An account with this email already exists in profiles.')
        } else {
          // Ensure a row exists/updates for this user id
          const { error: upsertError } = await supabase.from('profiles').upsert(
            {
              id,
              email,
              name: fullName || null,
              username: null,
              avatar_url: avatarUrl,
            },
            { onConflict: 'id' }
          )
          if (upsertError) {
            // If unique violation on email, surface message
            setStatusMessage('Profile already exists for this email.')
          }
        }

        // Add to subscribers if not already there
        const { data: existingSub } = await supabase
          .from('subscribers')
          .select('id')
          .eq('email', email)
          .maybeSingle()

        if (!existingSub) {
          await supabase.from('subscribers').insert({ email, name: fullName || null, subscribed: true })
        }
      } catch (e) {
        setStatusMessage('There was a problem saving your account.')
      }
      // Redirect to dashboard regardless of prior message
      router.replace('/dashboard')
    }

    upsertUser()
  }, [session])

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 sm:px-6 bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img src="/images/bhasha.jpeg" alt="Bhasha" className="h-12 w-12 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
          <div className="text-center">
            <p className="text-2xl font-extrabold tracking-tight text-white">Bhasha</p>
            <p className="text-sm text-orange-200/80">Sign in</p>
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

          {statusMessage ? (
            <p className="text-center text-sm text-orange-100/90">{statusMessage}</p>
          ) : null}

          <p className="text-center text-xs text-orange-200/70">
            By continuing you agree to our{' '}
            <Link href="#" className="underline decoration-orange-300/50 hover:decoration-orange-200">terms</Link> and{' '}
            <Link href="#" className="underline decoration-orange-300/50 hover:decoration-orange-200">privacy policy</Link>.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-orange-200 hover:text-orange-100 transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
