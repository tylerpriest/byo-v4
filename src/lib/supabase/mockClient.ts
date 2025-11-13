// Mock Supabase Client for Demo Mode
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import logger from '@/lib/logger'

// Mock data for demo mode
const mockUser = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {
    full_name: 'Demo User',
  },
  aud: 'authenticated',
}

const mockSession = {
  access_token: 'demo-token',
  refresh_token: 'demo-refresh',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
}

export function createMockSupabaseClient(): SupabaseClient<Database> {
  logger.warn('🎭 Demo Mode: Using mock Supabase client')

  return {
    auth: {
      getSession: async () => ({
        data: { session: mockSession },
        error: null,
      }),
      getUser: async () => ({
        data: { user: mockUser },
        error: null,
      }),
      signInWithPassword: async (credentials: {
        email: string
        password: string
      }) => {
        logger.info('🎭 Demo Mode: Mock sign in', { email: credentials.email })
        return {
          data: { user: mockUser, session: mockSession },
          error: null,
        }
      },
      signUp: async (credentials: { email: string; password: string }) => {
        logger.info('🎭 Demo Mode: Mock sign up', { email: credentials.email })
        return {
          data: { user: mockUser, session: mockSession },
          error: null,
        }
      },
      signOut: async () => {
        logger.info('🎭 Demo Mode: Mock sign out')
        return { error: null }
      },
      resetPasswordForEmail: async (email: string) => {
        logger.info('🎭 Demo Mode: Mock password reset', { email })
        return { data: {}, error: null }
      },
      onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
        // Immediately call with authenticated state
        setTimeout(
          () =>
            callback('SIGNED_IN', {
              access_token: 'demo-token',
              refresh_token: 'demo-refresh',
              expires_in: 3600,
              token_type: 'bearer',
              user: mockUser,
            }),
          0
        )
        return {
          data: { subscription: { id: 'demo-sub', unsubscribe: () => {} } },
        }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            logger.debug('🎭 Demo Mode: Mock select single from', { table })
            return { data: null, error: null }
          },
          maybeSingle: async () => {
            logger.debug('🎭 Demo Mode: Mock select maybe single from', {
              table,
            })
            return { data: null, error: null }
          },
        }),
        order: () => ({
          limit: async () => {
            logger.debug('🎭 Demo Mode: Mock select from', { table })
            return { data: [], error: null }
          },
        }),
      }),
      insert: async (data: unknown) => {
        logger.debug('🎭 Demo Mode: Mock insert into', { table, data })
        return { data: null, error: null }
      },
      update: async (data: unknown) => {
        logger.debug('🎭 Demo Mode: Mock update in', { table, data })
        return { data: null, error: null }
      },
      delete: async () => {
        logger.debug('🎭 Demo Mode: Mock delete from', { table })
        return { data: null, error: null }
      },
      upsert: async (data: unknown) => {
        logger.debug('🎭 Demo Mode: Mock upsert into', { table, data })
        return { data: null, error: null }
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as SupabaseClient<Database>
}
