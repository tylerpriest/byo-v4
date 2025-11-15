// Mock Supabase client implementation

/**
 * Mock Supabase client for demo mode
 * Simulates Supabase API with realistic demo data
 */

// Demo user data
const DEMO_USER_ID = 'demo-user-123'
const DEMO_USER_EMAIL = 'demo@example.com'
const DEMO_ORG_ID = 'demo-org-456'

// Mock session
let mockSession: any = null

// Auth state change listeners
const authListeners: Array<(event: string, session: any) => void> = []

// Mock data store
const mockData = {
  user_profiles: [
    {
      id: DEMO_USER_ID,
      email: DEMO_USER_EMAIL,
      full_name: 'Demo User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  organizations: [
    {
      id: DEMO_ORG_ID,
      name: 'Demo Organization',
      slug: 'demo-org',
      avatar_url: null,
      billing_email: 'billing@demo.com',
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: DEMO_USER_ID,
    },
  ],
  organization_members: [
    {
      id: 'demo-member-789',
      organization_id: DEMO_ORG_ID,
      user_id: DEMO_USER_ID,
      role: 'owner' as const,
      invited_by: null,
      joined_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  system_roles: [
    {
      id: 'demo-sysrole-001',
      user_id: DEMO_USER_ID,
      role: 'platform_admin' as const,
      assigned_by: null,
      assigned_at: new Date().toISOString(),
    },
  ],
  system_settings: [
    {
      key: 'demo_mode_enabled',
      value: { enabled: true },
      description: 'Demo mode is currently active',
      updated_by: null,
      updated_at: new Date().toISOString(),
    },
    {
      key: 'maintenance_mode',
      value: { enabled: false, message: '' },
      description: 'Maintenance mode status',
      updated_by: null,
      updated_at: new Date().toISOString(),
    },
  ],
  organization_invitations: [],
  audit_logs: [],
}

/**
 * Mock Supabase client
 * Implements minimal Supabase API surface needed for demo mode
 */
export function createMockSupabaseClient() {
  return {
    auth: {
      signInWithPassword: async ({
        email,
        password,
      }: {
        email: string
        password: string
      }) => {
        console.log('[Mock Supabase] signInWithPassword called:', email)

        // Accept any email/password for demo
        if (email && password) {
          mockSession = {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
            user: {
              id: DEMO_USER_ID,
              email: DEMO_USER_EMAIL,
              user_metadata: {
                full_name: 'Demo User',
              },
            },
          }

          // Notify all auth listeners
          setTimeout(() => {
            authListeners.forEach((listener) => {
              listener('SIGNED_IN', mockSession)
            })
          }, 0)

          return {
            data: { session: mockSession, user: mockSession.user },
            error: null,
          }
        }

        return {
          data: { session: null, user: null },
          error: { message: 'Invalid credentials', status: 400 },
        }
      },

      signUp: async ({ email }: { email: string; password: string }) => {
        console.log('[Mock Supabase] signUp called:', email)

        const newUser = {
          id: `user-${Date.now()}`,
          email,
          user_metadata: {},
        }

        mockSession = {
          access_token: 'mock-access-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          token_type: 'bearer',
          user: newUser,
        }

        // Notify all auth listeners
        setTimeout(() => {
          authListeners.forEach((listener) => {
            listener('SIGNED_IN', mockSession)
          })
        }, 0)

        return {
          data: { session: mockSession, user: newUser },
          error: null,
        }
      },

      signOut: async () => {
        console.log('[Mock Supabase] signOut called')
        mockSession = null

        // Notify all auth listeners
        setTimeout(() => {
          authListeners.forEach((listener) => {
            listener('SIGNED_OUT', null)
          })
        }, 0)

        return { error: null }
      },

      getSession: async () => {
        console.log('[Mock Supabase] getSession called')
        return {
          data: { session: mockSession },
          error: null,
        }
      },

      onAuthStateChange: (callback: any) => {
        console.log('[Mock Supabase] onAuthStateChange registered')

        // Add listener to array
        authListeners.push(callback)

        // Immediately call with current session if exists
        if (mockSession) {
          setTimeout(() => callback('SIGNED_IN', mockSession), 0)
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => {
                const index = authListeners.indexOf(callback)
                if (index > -1) {
                  authListeners.splice(index, 1)
                }
              },
            },
          },
        }
      },
    },

    from: (table: string) => ({
      select: (columns: string = '*') => ({
        eq: (column: string, value: any) => {
          console.log(`[Mock Supabase] SELECT ${columns} FROM ${table} WHERE ${column} = ${value}`)

          const tableData = (mockData as any)[table] || []
          const filtered = tableData.filter((row: any) => row[column] === value)

          return Promise.resolve({
            data: filtered,
            error: null,
          })
        },
        single: () => {
          const tableData = (mockData as any)[table] || []
          return Promise.resolve({
            data: tableData[0] || null,
            error: tableData.length === 0 ? { message: 'Not found' } : null,
          })
        },
        then: (resolve: any) => {
          const tableData = (mockData as any)[table] || []
          return resolve({
            data: tableData,
            error: null,
          })
        },
      }),

      insert: (values: any) => ({
        select: () =>
          Promise.resolve({
            data: Array.isArray(values) ? values : [values],
            error: null,
          }),
        then: (resolve: any) =>
          resolve({
            data: Array.isArray(values) ? values : [values],
            error: null,
          }),
      }),

      update: (values: any) => ({
        eq: (_column: string, _value: any) =>
          Promise.resolve({
            data: values,
            error: null,
          }),
      }),

      delete: () => ({
        eq: (_column: string, _value: any) =>
          Promise.resolve({
            data: null,
            error: null,
          }),
      }),
    }),
  }
}

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>
