import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '@/lib/supabaseClient'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) return <div>Loading...</div>

  return children
}

export function AdminProtectedRoute({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) {
        router.replace('/login')
        return
      }

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)
      const isAllowed = adminEmails.includes(session.user.email)
      if (!isAllowed) {
        router.replace('/dashboard')
        return
      }

      setLoading(false)
    }

    checkAdmin()
  }, [router])

  if (loading) return <div>Loading...</div>
  return children
}
