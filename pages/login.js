import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const hardcodedEmail = 'bhashaAdmin@bhashagroup.com'

  const handleLogin = async (e) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: hardcodedEmail, password }),
      })

      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Login failed')

      const to =
        router.query.from && typeof router.query.from === 'string'
          ? router.query.from
          : '/admin'
      router.push(to)
    } catch (err) {
      alert('❌ ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 sm:px-6 bg-gradient-to-br from-black via-[#1a0f07] to-[#2d0d00]">
      {/* subtle background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-16 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img src="/images/bhasha.jpeg" alt="Bhasha" className="h-12 w-12 rounded-full ring-2 ring-orange-300/60 shadow-lg" />
          <div className="text-center">
            <p className="text-2xl font-extrabold tracking-tight text-white">Bhasha</p>
            <p className="text-sm text-orange-200/80">Admin Access</p>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
          className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
            Sign in to your account
          </h2>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-orange-100">Email</label>
            <input
              type="text"
              value={hardcodedEmail}
              readOnly
              className="w-full rounded-xl px-4 py-3 text-white bg-white/10 border border-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-transparent"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-orange-100">Password</label>
              <span className="text-xs text-orange-200/70">Admin only</span>
            </div>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl px-4 py-3 text-white bg-white/10 border border-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-400/60 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 shadow-lg shadow-orange-900/30 hover:from-orange-600 hover:to-orange-700 transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in…' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-orange-200/70">
            By continuing you agree to our{' '}
            <Link href="#" className="underline decoration-orange-300/50 hover:decoration-orange-200">terms</Link> and{' '}
            <Link href="#" className="underline decoration-orange-300/50 hover:decoration-orange-200">privacy policy</Link>.
          </p>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-orange-200 hover:text-orange-100 transition-colors">← Back to home</Link>
        </div>
      </div>
    </div>
  )
}
