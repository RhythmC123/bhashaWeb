// pages/_app.js
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import '@/styles/globals.css'
import supabase from '@/lib/supabaseClient'

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* Head content moved to _document to avoid stylesheet warning */}
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  )
}
