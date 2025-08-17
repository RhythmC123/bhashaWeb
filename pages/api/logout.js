// pages/api/logout.js
import { serialize } from 'cookie'

export default function handler(req, res) {
  const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'bhasha_admin'

  res.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  }))

  return res.status(200).json({ success: true })
}
