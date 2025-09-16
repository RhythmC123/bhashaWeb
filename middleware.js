// middleware.js
import { NextResponse } from 'next/server'

export function middleware(req) {
  // Temporarily disabled - using simple password check instead
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/login'
  ],
}
