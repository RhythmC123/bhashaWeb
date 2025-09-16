// middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
  const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'bhasha_admin'
  const token = req.cookies.get(COOKIE_NAME)?.value
  const { pathname } = req.nextUrl

  // Debug logging (remove in production)
  console.log('Middleware check:', {
    pathname,
    cookieName: COOKIE_NAME,
    token: token,
    allCookies: Object.fromEntries(req.cookies.getAll().map(c => [c.name, c.value]))
  })

  // Allow the login page and API routes
  if (pathname.startsWith('/api')) return NextResponse.next()
  if (pathname.startsWith('/login')) return NextResponse.next()
  if (pathname.startsWith('/_next')) return NextResponse.next()
  if (pathname.startsWith('/static')) return NextResponse.next()
  if (pathname.startsWith('/images')) return NextResponse.next()
  if (pathname.startsWith('/models')) return NextResponse.next()

  // Protect /admin
  if (pathname.startsWith('/admin')) {
    if (token === 'ok') {
      console.log('Admin access granted')
      return NextResponse.next()
    }
    console.log('Admin access denied, redirecting to login')
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/login'
  ],
}
