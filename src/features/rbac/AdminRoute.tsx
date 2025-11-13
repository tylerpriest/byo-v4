import { Navigate } from 'react-router-dom'
import { usePlatformRole } from './useRoles'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { isPlatformAdmin, loading } = usePlatformRole()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Checking permissions...</p>
      </div>
    )
  }

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
