import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase-client'
import type { Database } from '@/lib/database.types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type SystemRole = Database['public']['Tables']['system_roles']['Row']
type OrgMember = Database['public']['Tables']['organization_members']['Row']

interface AuthUser {
  id: string
  email: string
  profile: UserProfile | null
  systemRole: SystemRole | null
  orgMemberships: OrgMember[]
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile, system role, and org memberships
  const fetchUserData = async (userId: string): Promise<AuthUser | null> => {
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      // Fetch system role (if any)
      const { data: systemRoleData } = await supabase
        .from('system_roles')
        .select('*')
        .eq('user_id', userId)
        .single()

      // Fetch organization memberships
      const { data: orgMemberships } = await supabase
        .from('organization_members')
        .select('*')
        .eq('user_id', userId)

      return {
        id: userId,
        email: profile?.email || '',
        profile: profile || null,
        systemRole: systemRoleData || null,
        orgMemberships: orgMemberships || [],
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  // Initialize auth state
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        fetchUserData(session.user.id).then(setUser)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (session?.user) {
        const userData = await fetchUserData(session.user.id)
        setUser(userData)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      const userData = await fetchUserData(data.user.id)
      setUser(userData)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (error) throw error

    if (data.user) {
      const userData = await fetchUserData(data.user.id)
      setUser(userData)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
