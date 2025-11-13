import logger from '@/lib/logger'

export interface SupabaseConfig {
  url: string | undefined
  anonKey: string | undefined
  isDemoMode: boolean
  demoModeReason: 'admin_toggle' | 'env_variable' | 'auto_fallback' | null
}

/**
 * Determines demo mode status using 3-tier hierarchy:
 * 1. Admin Dashboard Toggle (future - via system_settings table)
 * 2. Environment Variable (VITE_DEMO_MODE=true)
 * 3. Auto-Fallback (missing Supabase credentials)
 */
export function getSupabaseConfig(): SupabaseConfig {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const demoModeEnv = import.meta.env.VITE_DEMO_MODE

  // Tier 2: Environment Variable
  if (demoModeEnv === 'true') {
    logger.warn('🎭 Demo Mode: Enabled via VITE_DEMO_MODE environment variable')
    return {
      url,
      anonKey,
      isDemoMode: true,
      demoModeReason: 'env_variable',
    }
  }

  // Tier 3: Auto-Fallback (missing credentials)
  if (!url || !anonKey) {
    logger.warn('🎭 Demo Mode: Auto-enabled (missing Supabase credentials)', {
      hasUrl: !!url,
      hasAnonKey: !!anonKey,
    })
    return {
      url,
      anonKey,
      isDemoMode: true,
      demoModeReason: 'auto_fallback',
    }
  }

  // Production mode
  logger.info('✅ Production Mode: Using real Supabase client')
  return {
    url,
    anonKey,
    isDemoMode: false,
    demoModeReason: null,
  }
}
