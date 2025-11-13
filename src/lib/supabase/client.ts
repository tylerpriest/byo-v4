import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'
import { createMockClient } from './mock-client'

// Check if we should use demo mode
const isDemoMode = (): boolean => {
  // Priority 1: Check if explicitly enabled via env variable
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    console.warn('[Demo Mode] Explicitly enabled via VITE_DEMO_MODE environment variable')
    return true
  }

  // Priority 2: Auto-fallback if Supabase credentials are missing
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn(
      '[Demo Mode] Auto-enabled: Missing Supabase credentials (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)'
    )
    return true
  }

  return false
}

export const demoModeEnabled = isDemoMode()

// Create Supabase client (real or mock)
export const supabase = demoModeEnabled
  ? createMockClient()
  : createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    )

// Export type for use in components
export type SupabaseClient = typeof supabase
