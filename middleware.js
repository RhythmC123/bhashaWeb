// middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
  const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'bhasha_admin'
  const token = req.cookies.get(COOKIE_NAME)?.value
  const { pathname } = req.nextUrl

  // Allow the login page and API routes
  if (pathname.startsWith('/api')) return NextResponse.next()
  if (pathname.startsWith('/login')) return NextResponse.next()

  // Protect /admin
  if (pathname.startsWith('/admin')) {
    if (token === 'ok') return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/api/:path*', '/((?!_next|static|images).*)'],
}
