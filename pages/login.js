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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            value={hardcodedEmail}
            readOnly
            className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* <p className="text-sm text-gray-500 text-center">
          Hint: LearnWithBhasha123
        </p> */}
      </form>
    </div>
  )
}
