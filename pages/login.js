import { useState } from 'react'
import { useRouter } from 'next/router'

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
        body: JSON.stringify({
          email: hardcodedEmail,
          password,
        }),
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
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
      <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
        <h2>Admin Login (Local)</h2>

        <input type="text" value={hardcodedEmail} readOnly />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p>
            LearnWithBhasha123
        </p>
      </form>
    </div>
  )
}
