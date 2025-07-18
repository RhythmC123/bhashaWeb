import { NextResponse } from 'next/server'

export function middleware(req) {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  // If admin route, redirect to login page (basic)
  if (isAdminRoute) {
    const cookie = req.cookies.get('supabase-auth-token') // example, adjust name
    if (!cookie) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}
