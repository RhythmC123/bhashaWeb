import { createClient } from '@supabase/supabase-js'
import { GitGraph } from 'lucide-react'
import { getPreviouslyCachedImageOrNull } from 'next/dist/server/image-optimizer'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing!")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase

