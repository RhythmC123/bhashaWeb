// pages/_app.js
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import '@/styles/globals.css'
import Head from 'next/head'
import supabase from '@/supabaseClient'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/images/bhasha.jpeg" />
      </Head>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </>
  )
}
