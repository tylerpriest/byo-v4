import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Mock user data for demo mode
const DEMO_USER = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  user_metadata: {
    full_name: 'Demo User',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

const DEMO_ADMIN_USER = {
  id: 'demo-admin-456',
  email: 'admin@example.com',
  user_metadata: {
    full_name: 'Demo Admin',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
}

// Mock session data
const createMockSession = (user: typeof DEMO_USER) => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user,
})

// Simple in-memory storage for demo mode
let currentUser: typeof DEMO_USER | null = null
let currentSession: ReturnType<typeof createMockSession> | null = null

export function createMockClient(): SupabaseClient<Database> {
  console.warn('[Mock Supabase Client] Using mock client for demo mode')

  return {
    auth: {
      getSession: async () => {
        return Promise.resolve({
          data: { session: currentSession },
          error: null,
        })
      },
      getUser: async () => {
        return Promise.resolve({
          data: { user: currentUser },
          error: null,
        })
      },
      signInWithPassword: async ({ email }: { email: string; password: string }) => {
        // Simple email check for demo
        const user = email.includes('admin') ? DEMO_ADMIN_USER : DEMO_USER
        currentUser = user
        currentSession = createMockSession(user)

        return Promise.resolve({
          data: {
            user,
            session: currentSession,
          },
          error: null,
        })
      },
      signUp: async ({ email }: { email: string; password: string }) => {
        const user = { ...DEMO_USER, email }
        currentUser = user
        currentSession = createMockSession(user)

        return Promise.resolve({
          data: {
            user,
            session: currentSession,
          },
          error: null,
        })
      },
      signOut: async () => {
        currentUser = null
        currentSession = null
        return Promise.resolve({ error: null })
      },
      onAuthStateChange: (
        callback: (event: string, session: typeof currentSession) => void
      ) => {
        // Immediately call with current state
        void callback('INITIAL_SESSION', currentSession)

        // Return unsubscribe function
        return {
          data: { subscription: { unsubscribe: () => {} } },
        }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            // Return mock data based on table
            if (table === 'profiles' && currentUser) {
              return Promise.resolve({
                data: {
                  id: currentUser.id,
                  email: currentUser.email,
                  full_name: currentUser.user_metadata.full_name,
                  avatar_url: null,
                  created_at: currentUser.created_at,
                  updated_at: currentUser.created_at,
                },
                error: null,
              })
            }
            if (table === 'system_roles' && currentUser?.id === DEMO_ADMIN_USER.id) {
              return Promise.resolve({
                data: {
                  user_id: currentUser.id,
                  role: 'platform_admin',
                  created_at: new Date().toISOString(),
                },
                error: null,
              })
            }
            return Promise.resolve({ data: null, error: null })
          },
        }),
      }),
      insert: async () => Promise.resolve({ data: null, error: null }),
      update: async () => Promise.resolve({ data: null, error: null }),
      delete: async () => Promise.resolve({ data: null, error: null }),
    }),
  } as unknown as SupabaseClient<Database>
}
