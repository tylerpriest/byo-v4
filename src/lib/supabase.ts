import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Real Supabase client factory
 * Connects to actual Supabase backend
 */
export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export type SupabaseClient = ReturnType<typeof createSupabaseClient>
