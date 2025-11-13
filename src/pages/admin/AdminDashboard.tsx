import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { usePlatformRole } from '@/features/rbac/useRoles'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { getDemoModeStatus, setAdminDemoModeOverride } from '@/lib/supabase'
import { useState } from 'react'

export function AdminDashboard() {
  const { signOut, user } = useAuth()
  const { role } = usePlatformRole()
  const navigate = useNavigate()
  const [demoModeStatus, setDemoModeStatus] = useState(getDemoModeStatus())

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleToggleDemoMode = (enabled: boolean) => {
    setAdminDemoModeOverride(enabled)
    setDemoModeStatus(getDemoModeStatus())
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Button onClick={() => void handleSignOut()} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate('/admin/users')}
            >
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage users and assign platform roles</CardDescription>
              </CardHeader>
            </Card>
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate('/organizations')}
            >
              <CardHeader>
                <CardTitle>Organizations</CardTitle>
                <CardDescription>View and manage all organizations</CardDescription>
              </CardHeader>
            </Card>
            <Card className="opacity-50">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Feature flags and configurations (Coming soon)</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Admin Info */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Admin Access</CardTitle>
              <CardDescription>
                You have full system access as a platform administrator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{role?.replace('platform_', '').toUpperCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Demo users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Organizations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Active workspaces</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">System administrators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demo Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{demoModeStatus.isActive ? 'ON' : 'OFF'}</p>
                <p className="text-sm text-muted-foreground">{demoModeStatus.reason}</p>
              </CardContent>
            </Card>
          </div>

          {/* System Controls */}
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
              <CardDescription>Manage system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Demo Mode Toggle</p>
                  <p className="text-sm text-muted-foreground">
                    Override environment settings (Tier 1 control)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={demoModeStatus.reason === 'admin_toggle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleToggleDemoMode(true)}
                  >
                    Enable
                  </Button>
                  <Button
                    variant={
                      demoModeStatus.reason === 'disabled' ||
                      (demoModeStatus.isActive && demoModeStatus.reason !== 'admin_toggle')
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => handleToggleDemoMode(false)}
                  >
                    Disable
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
                Current status: {demoModeStatus.isActive ? 'Active' : 'Inactive'} (
                {demoModeStatus.reason})
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" disabled>
                Manage Users
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                View Activity Logs
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                System Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                Database Backups
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Additional admin features will be available in future updates
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
