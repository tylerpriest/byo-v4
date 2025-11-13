import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, User, Session } from './types'

// Demo user IDs
const DEMO_USER_ID = 'demo-user-123'
const DEMO_ADMIN_ID = 'demo-admin-456'
const DEMO_ORG_ID = 'demo-org-789'

// Mock data
const mockUsers: Record<string, User> = {
  [DEMO_USER_ID]: {
    id: DEMO_USER_ID,
    email: 'demo@example.com',
    user_metadata: {
      full_name: 'Demo User',
    },
  },
  [DEMO_ADMIN_ID]: {
    id: DEMO_ADMIN_ID,
    email: 'admin@example.com',
    user_metadata: {
      full_name: 'Demo Admin',
    },
  },
}

const mockProfiles: Database['public']['Tables']['profiles']['Row'][] = [
  {
    id: DEMO_USER_ID,
    email: 'demo@example.com',
    full_name: 'Demo User',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: DEMO_ADMIN_ID,
    email: 'admin@example.com',
    full_name: 'Demo Admin',
    avatar_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockOrganizations: Database['public']['Tables']['organizations']['Row'][] = [
  {
    id: DEMO_ORG_ID,
    name: 'Demo Organization',
    slug: 'demo-org',
    owner_id: DEMO_ADMIN_ID,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockOrgMembers: Database['public']['Tables']['organization_members']['Row'][] = [
  {
    id: 'member-1',
    organization_id: DEMO_ORG_ID,
    user_id: DEMO_ADMIN_ID,
    role: 'owner',
    created_at: new Date().toISOString(),
  },
  {
    id: 'member-2',
    organization_id: DEMO_ORG_ID,
    user_id: DEMO_USER_ID,
    role: 'member',
    created_at: new Date().toISOString(),
  },
]

const mockSystemRoles: Database['public']['Tables']['system_roles']['Row'][] = [
  {
    user_id: DEMO_ADMIN_ID,
    role: 'platform_admin',
    created_at: new Date().toISOString(),
  },
]

const mockSystemSettings: Database['public']['Tables']['system_settings']['Row'][] = [
  {
    key: 'demo_mode',
    value: true,
    updated_at: new Date().toISOString(),
  },
]

// Mock session state
let currentSession: Session | null = null

/**
 * Creates a mock Supabase client for demo mode
 * Provides realistic behavior without connecting to actual Supabase
 */
export function createMockSupabaseClient(): SupabaseClient<Database> {
  console.warn('🎭 Demo Mode Active - Using mock Supabase client')

  return {
    auth: {
      getSession: async () => {
        await Promise.resolve() // Async method must have await
        return { data: { session: currentSession }, error: null }
      },
      getUser: async () => {
        await Promise.resolve() // Async method must have await
        if (currentSession) {
          return { data: { user: currentSession.user }, error: null }
        }
        return { data: { user: null }, error: null }
      },
      signUp: async ({ email }: { email: string; password: string }) => {
        // Simulate signup delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const user: User = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: { full_name: email.split('@')[0] || 'User' },
        }

        currentSession = {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          user,
        }

        return { data: { user, session: currentSession }, error: null }
      },
      signInWithPassword: async ({ email }: { email: string; password: string }) => {
        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Check for demo credentials
        if (email === 'demo@example.com' || email === 'admin@example.com') {
          const user = mockUsers[email === 'admin@example.com' ? DEMO_ADMIN_ID : DEMO_USER_ID]
          currentSession = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            user: user!,
          }
          return { data: { user, session: currentSession }, error: null }
        }

        return {
          data: { user: null, session: null },
          error: new Error('Invalid credentials (demo mode)'),
        }
      },
      signInWithOAuth: async () => {
        await Promise.resolve() // Async method must have await
        return { data: { provider: 'github', url: '#' }, error: null }
      },
      signOut: async () => {
        await Promise.resolve() // Async method must have await
        currentSession = null
        return { error: null }
      },
      resetPasswordForEmail: async () => {
        await Promise.resolve() // Async method must have await
        return { data: {}, error: null }
      },
      updateUser: async (attributes: Partial<User>) => {
        await Promise.resolve() // Async method must have await
        if (currentSession) {
          currentSession.user = { ...currentSession.user, ...attributes }
          return { data: { user: currentSession.user }, error: null }
        }
        return { data: { user: null }, error: new Error('Not authenticated') }
      },
      onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        // Initial callback
        callback('INITIAL_SESSION', currentSession)

        // Return unsubscribe function
        return {
          data: { subscription: { id: 'mock', unsubscribe: () => {} } },
        }
      },
      setSession: async () => {
        await Promise.resolve() // Async method must have await
        return {
          data: { session: currentSession, user: currentSession?.user ?? null },
          error: null,
        }
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: (column: string, value: unknown) => ({
          single: async () => {
            await Promise.resolve() // Async method must have await
            if (table === 'profiles') {
              const profile = mockProfiles.find((p) => (p as never)[column] === value)
              return profile
                ? { data: profile, error: null }
                : { data: null, error: new Error('Not found') }
            }
            if (table === 'organizations') {
              const org = mockOrganizations.find((o) => (o as never)[column] === value)
              return org
                ? { data: org, error: null }
                : { data: null, error: new Error('Not found') }
            }
            if (table === 'system_roles') {
              const role = mockSystemRoles.find((r) => (r as never)[column] === value)
              return role
                ? { data: role, error: null }
                : { data: null, error: new Error('Not found') }
            }
            return { data: null, error: new Error('Not found') }
          },
          maybeSingle: async () => {
            await Promise.resolve() // Async method must have await
            if (table === 'system_roles') {
              const role = mockSystemRoles.find((r) => (r as never)[column] === value)
              return { data: role || null, error: null }
            }
            return { data: null, error: null }
          },
        }),
        data:
          table === 'profiles'
            ? mockProfiles
            : table === 'organizations'
              ? mockOrganizations
              : table === 'organization_members'
                ? mockOrgMembers
                : table === 'system_roles'
                  ? mockSystemRoles
                  : table === 'system_settings'
                    ? mockSystemSettings
                    : [],
        error: null,
      }),
      insert: async (values: unknown) => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return { data: values, error: null }
      },
      update: async (values: unknown) => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return { data: values, error: null }
      },
      delete: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return { data: null, error: null }
      },
      upsert: async (values: unknown) => {
        await new Promise((resolve) => setTimeout(resolve, 300))
        return { data: values, error: null }
      },
    }),
  } as unknown as SupabaseClient<Database>
}

// Export demo user IDs for testing
export { DEMO_USER_ID, DEMO_ADMIN_ID, DEMO_ORG_ID }
