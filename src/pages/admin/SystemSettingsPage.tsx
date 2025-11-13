import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useAuth } from '@/features/auth/AuthContext'
import { usePlatformRole } from '@/features/rbac/useRoles'
import { getDemoModeStatus, setAdminDemoModeOverride } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
}

export function SystemSettingsPage() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const { isPlatformAdmin } = usePlatformRole()
  const { toast } = useToast()
  const [demoModeStatus, setDemoModeStatus] = useState(getDemoModeStatus())
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Mock feature flags - in production, these would come from a database
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'user-invitations',
      name: 'User Invitations',
      description: 'Allow organization owners to invite new members',
      enabled: true,
    },
    {
      id: 'email-notifications',
      name: 'Email Notifications',
      description: 'Send email notifications for important events',
      enabled: false,
    },
    {
      id: 'two-factor-auth',
      name: 'Two-Factor Authentication',
      description: 'Enable 2FA for all user accounts',
      enabled: false,
    },
    {
      id: 'api-access',
      name: 'API Access',
      description: 'Allow users to generate and use API keys',
      enabled: false,
    },
  ])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleToggleDemoMode = (enabled: boolean) => {
    setAdminDemoModeOverride(enabled)
    setDemoModeStatus(getDemoModeStatus())
    toast({
      title: enabled ? 'Demo mode enabled' : 'Demo mode disabled',
      description: `Demo mode has been ${enabled ? 'enabled' : 'disabled'} system-wide`,
    })
  }

  const handleToggleMaintenanceMode = () => {
    const newState = !maintenanceMode
    setMaintenanceMode(newState)
    toast({
      title: newState ? 'Maintenance mode enabled' : 'Maintenance mode disabled',
      description: newState
        ? 'The application is now in maintenance mode'
        : 'The application is now accessible to all users',
      variant: newState ? 'destructive' : 'default',
    })
  }

  const handleToggleFeatureFlag = (flagId: string) => {
    setFeatureFlags((prev) =>
      prev.map((flag) => (flag.id === flagId ? { ...flag, enabled: !flag.enabled } : flag)),
    )
    const flag = featureFlags.find((f) => f.id === flagId)
    if (flag) {
      toast({
        title: flag.enabled ? 'Feature disabled' : 'Feature enabled',
        description: `${flag.name} has been ${flag.enabled ? 'disabled' : 'enabled'}`,
      })
    }
  }

  if (!isPlatformAdmin) {
    return (
      <div className="min-h-screen bg-muted/40">
        <header className="border-b bg-background">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <Button onClick={() => void handleSignOut()} variant="outline">
              Sign Out
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Unauthorized</CardTitle>
              <CardDescription>
                You don't have permission to access this page. Only platform administrators can
                manage system settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              ← Admin Panel
            </Button>
            <h1 className="text-2xl font-bold">System Settings</h1>
          </div>
          <Button onClick={() => void handleSignOut()} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Admin Info */}
          <Card>
            <CardHeader>
              <CardTitle>System Administrator</CardTitle>
              <CardDescription>You are logged in as a platform administrator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">Platform Admin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Demo Mode</CardTitle>
              <CardDescription>Control demo mode settings for the entire platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Demo Mode Status</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {demoModeStatus.isActive ? 'Active' : 'Inactive'} (
                    {demoModeStatus.reason})
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
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>
                Enable maintenance mode to restrict access during updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {maintenanceMode
                      ? 'Application is currently in maintenance mode'
                      : 'Application is accessible to all users'}
                  </p>
                </div>
                <Button
                  variant={maintenanceMode ? 'destructive' : 'outline'}
                  onClick={handleToggleMaintenanceMode}
                >
                  {maintenanceMode ? 'Disable' : 'Enable'}
                </Button>
              </div>
              {maintenanceMode && (
                <div className="bg-destructive/10 p-4 rounded-md">
                  <p className="text-sm font-medium text-destructive">
                    ⚠️ Maintenance mode is active
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Only administrators can access the application while maintenance mode is
                    enabled.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable features across the entire platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureFlags.map((flag) => (
                  <div
                    key={flag.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="font-medium">{flag.name}</Label>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            flag.enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {flag.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{flag.description}</p>
                    </div>
                    <Button
                      variant={flag.enabled ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleToggleFeatureFlag(flag.id)}
                    >
                      {flag.enabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">
                  Note: Feature flags are currently stored in local state. In production, these
                  would be persisted in a database and synchronized across all servers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
