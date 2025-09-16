import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ihqtqrrzthefvkdivqbp.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlocXRxcnJ6dGhlZnZrZGl2cWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Mzc5MzQsImV4cCI6MjA2ODAxMzkzNH0.-sbD9bWfWLyI45LE6974rImSZ7WH4kjl0LUkJ-O4ekc'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase environment variables are missing!")
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
