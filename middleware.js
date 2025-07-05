import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
    const res = NextResponse.next()
  
    const supabase = createMiddlewareClient({ req, res })
  
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    console.log('Session:', session); // Log the session
  
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  
    if (isAdminRoute && !session) {
      const redirectUrl = new URL('/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  
    return res
  }
  