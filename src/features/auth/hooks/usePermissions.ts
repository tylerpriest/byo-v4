import { useAuth } from '../context/AuthContext'

/**
 * Permission checking hook
 * Implements RBAC logic from rbac-spec.md
 */
export function usePermissions(organizationId?: string) {
  const { user } = useAuth()

  // Platform-level permissions
  const isPlatformAdmin = user?.systemRole?.role === 'platform_admin'
  const isPlatformDeveloper = user?.systemRole?.role === 'platform_developer'
  const isPlatformSupport = user?.systemRole?.role === 'platform_support'

  // Get organization role for specific org
  const getOrgRole = (orgId?: string) => {
    if (!orgId || !user) return null
    const membership = user.orgMemberships.find((m) => m.organization_id === orgId)
    return membership?.role || null
  }

  const orgRole = getOrgRole(organizationId)

  // Organization-level permissions
  const isOrgOwner = orgRole === 'owner'
  const isOrgAdmin = orgRole === 'admin'
  const isOrgMember = orgRole === 'member'
  const isOrgViewer = orgRole === 'viewer'

  // Composite permission checks
  const canManageOrg = isOrgOwner || isOrgAdmin || isPlatformAdmin
  const canInviteMembers = isOrgOwner || isOrgAdmin || isPlatformAdmin
  const canRemoveMembers = isOrgOwner || isOrgAdmin || isPlatformAdmin
  const canAssignRoles = isOrgOwner || isOrgAdmin || isPlatformAdmin
  const canDeleteOrg = isOrgOwner || isPlatformAdmin
  const canManageBilling = isOrgOwner || isPlatformAdmin
  const canEditResources = !isOrgViewer && user !== null
  const canCreateResources = (isOrgMember || isOrgAdmin || isOrgOwner) && !isOrgViewer
  const canViewAdminDashboard = isPlatformAdmin
  const canToggleDemoMode = isPlatformAdmin
  const canViewAuditLogs = isPlatformAdmin || isOrgOwner
  const canAssignPlatformRoles = isPlatformAdmin

  return {
    // Platform roles
    isPlatformAdmin,
    isPlatformDeveloper,
    isPlatformSupport,

    // Organization roles
    isOrgOwner,
    isOrgAdmin,
    isOrgMember,
    isOrgViewer,
    orgRole,

    // Permission checks
    canManageOrg,
    canInviteMembers,
    canRemoveMembers,
    canAssignRoles,
    canDeleteOrg,
    canManageBilling,
    canEditResources,
    canCreateResources,
    canViewAdminDashboard,
    canToggleDemoMode,
    canViewAuditLogs,
    canAssignPlatformRoles,

    // Helpers
    getOrgRole,
    hasAnyRole: !!user,
    isPlatformUser: !!user?.systemRole,
  }
}
