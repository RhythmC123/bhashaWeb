// pages/api/login.js
import { serialize } from 'cookie'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body || {}
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'bhasha_admin'

  // Debug logging (remove in production)
  console.log('Login attempt:', {
    email: email,
    passwordLength: password?.length,
    adminEmail: ADMIN_EMAIL,
    adminPasswordLength: ADMIN_PASSWORD?.length,
    cookieName: COOKIE_NAME,
    nodeEnv: process.env.NODE_ENV
  })

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Missing environment variables:', {
      hasAdminEmail: !!ADMIN_EMAIL,
      hasAdminPassword: !!ADMIN_PASSWORD
    })
    return res.status(500).json({ error: 'Server not configured' })
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    console.log('Invalid credentials:', {
      emailMatch: email === ADMIN_EMAIL,
      passwordMatch: password === ADMIN_PASSWORD
    })
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Very simple token for local/dev only
  const token = 'ok'

  res.setHeader('Set-Cookie', serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
    domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
  }))

  console.log('Login successful, cookie set:', COOKIE_NAME)
  return res.status(200).json({ success: true })
}
