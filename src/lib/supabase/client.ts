import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createMockSupabaseClient } from './mock-client'
import type { Database } from './types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const DEMO_MODE_ENV = import.meta.env.VITE_DEMO_MODE

/**
 * Demo Mode Detection (3-Tier Hierarchy)
 *
 * 1. Admin Dashboard Toggle (highest priority)
 *    - Checked at runtime via system_settings table
 *    - Can override environment variables
 *    - Requires real Supabase connection
 *
 * 2. Environment Variable
 *    - VITE_DEMO_MODE=true
 *    - Development/staging/preview environments
 *
 * 3. Auto-Fallback (lowest priority)
 *    - Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY
 *    - Automatic mock client activation
 *    - Zero-config quick start
 */

// Tier 3: Auto-Fallback - Check if credentials are missing
const hasCredentials = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// Tier 2: Environment Variable - Check if demo mode is explicitly set
const envDemoMode = DEMO_MODE_ENV === 'true' || DEMO_MODE_ENV === '1'

// Tier 1: Admin Dashboard Toggle - Will be checked at runtime
let adminDemoModeOverride: boolean | null = null

export interface DemoModeStatus {
  isActive: boolean
  reason: 'admin_toggle' | 'env_variable' | 'auto_fallback' | 'disabled'
}

/**
 * Determines if demo mode should be active based on the 3-tier hierarchy
 */
export function getDemoModeStatus(): DemoModeStatus {
  // Tier 1: Admin Dashboard Toggle (if set)
  if (adminDemoModeOverride !== null) {
    return {
      isActive: adminDemoModeOverride,
      reason: adminDemoModeOverride ? 'admin_toggle' : 'disabled',
    }
  }

  // Tier 2: Environment Variable
  if (envDemoMode) {
    return {
      isActive: true,
      reason: 'env_variable',
    }
  }

  // Tier 3: Auto-Fallback (missing credentials)
  if (!hasCredentials) {
    return {
      isActive: true,
      reason: 'auto_fallback',
    }
  }

  // Demo mode is disabled
  return {
    isActive: false,
    reason: 'disabled',
  }
}

/**
 * Sets the admin demo mode override
 * This allows platform admins to toggle demo mode at runtime
 */
export function setAdminDemoModeOverride(enabled: boolean | null) {
  adminDemoModeOverride = enabled
  console.log(`🎛️  Admin demo mode override set to: ${enabled}`)
}

/**
 * Creates the Supabase client
 * Returns mock client if demo mode is active
 */
let supabaseInstance: SupabaseClient<Database> | null = null

export function getSupabaseClient(): SupabaseClient<Database> {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const demoStatus = getDemoModeStatus()

  if (demoStatus.isActive) {
    console.warn(`🎭 Demo Mode Active (${demoStatus.reason})`)
    console.warn('ℹ️  Using mock Supabase client with demo data')
    console.warn('ℹ️  To use real Supabase:')
    console.warn('   1. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
    console.warn('   2. Set VITE_DEMO_MODE=false (or remove it)')
    console.warn('   3. Disable demo mode in admin settings (if enabled)')
    supabaseInstance = createMockSupabaseClient()
    return supabaseInstance
  }

  if (!hasCredentials) {
    throw new Error(
      'Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.',
    )
  }

  console.log('✅ Using real Supabase client')
  supabaseInstance = createClient<Database>(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseInstance
}

/**
 * Resets the Supabase client instance
 * Useful when switching between demo and real mode
 */
export function resetSupabaseClient() {
  supabaseInstance = null
}

// Export the demo mode status check for components
export { getDemoModeStatus as useDemoModeStatus }
