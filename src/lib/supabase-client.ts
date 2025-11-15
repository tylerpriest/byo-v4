import { createSupabaseClient } from './supabase'
import { createMockSupabaseClient } from './supabase-mock'

/**
 * Demo mode detection and client selection
 *
 * Priority (highest to lowest):
 * 1. VITE_DEMO_MODE=true (force enable)
 * 2. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY (auto-fallback)
 * 3. Admin dashboard toggle (future: check system_settings table)
 */

function isDemoMode(): boolean {
  // 1. Check environment variable override
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    console.log('⚠️  Demo mode enabled via VITE_DEMO_MODE=true')
    return true
  }

  // 2. Auto-fallback if Supabase credentials missing or invalid
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  // Check for missing, undefined, or placeholder values
  const isUrlInvalid = !supabaseUrl ||
                       supabaseUrl.includes('xxxxx') ||
                       supabaseUrl === 'https://xxxxx.supabase.co'

  const isKeyInvalid = !supabaseAnonKey ||
                       supabaseAnonKey.includes('...') ||
                       supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')

  if (isUrlInvalid || isKeyInvalid) {
    console.log('⚠️  Demo mode auto-enabled (missing or invalid Supabase credentials)')
    return true
  }

  // 3. Future: Check system_settings.demo_mode_enabled from database
  // This would require an initial fetch, so it's lower priority

  console.log('✅ Connected to Supabase')
  return false
}

/**
 * Get Supabase client (real or mock based on demo mode)
 */
export function getSupabaseClient() {
  if (isDemoMode()) {
    return createMockSupabaseClient() as any // Type as 'any' for compatibility
  }

  return createSupabaseClient()
}

/**
 * Check if currently in demo mode
 */
export function isInDemoMode(): boolean {
  return isDemoMode()
}

// Export singleton client instance
export const supabase = getSupabaseClient()
