import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePermissions } from '../hooks/usePermissions'

interface ProtectedRouteProps {
  children: ReactNode
  requireAuth?: boolean
  requirePlatformAdmin?: boolean
  requireOrgRole?: 'owner' | 'admin' | 'member' | 'viewer'
  organizationId?: string
  redirectTo?: string
}

/**
 * Protected Route Component
 * Handles authentication and authorization checks
 */
export function ProtectedRoute({
  children,
  requireAuth = true,
  requirePlatformAdmin = false,
  requireOrgRole,
  organizationId,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const permissions = usePermissions(organizationId)

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return <Navigate to={redirectTo} replace />
  }

  // Check platform admin requirement
  if (requirePlatformAdmin && !permissions.isPlatformAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need platform admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  // Check organization role requirement
  if (requireOrgRole && organizationId) {
    const userOrgRole = permissions.getOrgRole(organizationId)

    const roleHierarchy = {
      owner: 4,
      admin: 3,
      member: 2,
      viewer: 1,
    }

    const requiredLevel = roleHierarchy[requireOrgRole]
    const userLevel = userOrgRole ? roleHierarchy[userOrgRole] : 0

    if (userLevel < requiredLevel && !permissions.isPlatformAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">
              You need at least {requireOrgRole} role to access this page.
            </p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
