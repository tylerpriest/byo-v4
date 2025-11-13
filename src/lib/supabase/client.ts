import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { getSupabaseConfig } from './config'
import { createMockSupabaseClient } from './mockClient'

const config = getSupabaseConfig()

let supabase: SupabaseClient<Database>

if (config.isDemoMode) {
  // Demo mode: use mock client
  supabase = createMockSupabaseClient() as SupabaseClient<Database>
} else {
  // Production mode: use real Supabase client
  supabase = createClient<Database>(config.url!, config.anonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export { supabase, config as supabaseConfig }
export default supabase
