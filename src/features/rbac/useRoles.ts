import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/AuthContext'
import { getSupabaseClient } from '@/lib/supabase'
import type { PlatformRole, OrganizationRole } from '@/lib/supabase/types'

/**
 * Hook to check if user has a specific platform role
 */
export function usePlatformRole() {
  const { user } = useAuth()
  const [role, setRole] = useState<PlatformRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      const supabase = getSupabaseClient()
      const result = await supabase
        .from('system_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      setRole((result.data as { role: PlatformRole } | null)?.role ?? null)
      setLoading(false)
    }

    void fetchRole()
  }, [user])

  return {
    role,
    loading,
    isPlatformAdmin: role === 'platform_admin',
    isPlatformDeveloper: role === 'platform_developer',
    isPlatformSupport: role === 'platform_support',
    hasPlatformRole: role !== null,
  }
}

/**
 * Hook to check if user has a specific organization role
 */
export function useOrganizationRole(organizationId?: string) {
  const { user } = useAuth()
  const [role, setRole] = useState<OrganizationRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRole() {
      if (!user || !organizationId) {
        setRole(null)
        setLoading(false)
        return
      }

      const supabase = getSupabaseClient()
      const result = await supabase
        .from('organization_members')
        .select('role')
        .eq('organization_id', organizationId)
        .eq('user_id', user.id)
        .maybeSingle()

      setRole((result.data as { role: OrganizationRole } | null)?.role ?? null)
      setLoading(false)
    }

    void fetchRole()
  }, [user, organizationId])

  return {
    role,
    loading,
    isOwner: role === 'owner',
    isAdmin: role === 'admin',
    isMember: role === 'member',
    isViewer: role === 'viewer',
    hasRole: role !== null,
    canManageMembers: role === 'owner' || role === 'admin',
    canEdit: role === 'owner' || role === 'admin' || role === 'member',
  }
}

/**
 * Permission check utilities
 */
export const Permissions = {
  platform: {
    canManageUsers: (role: PlatformRole | null) => role === 'platform_admin',
    canViewSystemSettings: (role: PlatformRole | null) =>
      role === 'platform_admin' || role === 'platform_developer',
    canAccessSupport: (role: PlatformRole | null) =>
      role === 'platform_admin' || role === 'platform_support',
  },
  organization: {
    canManageMembers: (role: OrganizationRole | null) => role === 'owner' || role === 'admin',
    canEditContent: (role: OrganizationRole | null) =>
      role === 'owner' || role === 'admin' || role === 'member',
    canViewContent: (role: OrganizationRole | null) => role !== null,
    canDeleteOrganization: (role: OrganizationRole | null) => role === 'owner',
  },
}
