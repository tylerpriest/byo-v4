import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { usePlatformRole } from '@/features/rbac/useRoles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export function AccountPage() {
  const { user, signOut } = useAuth()
  const { role, hasPlatformRole } = usePlatformRole()
  const navigate = useNavigate()
  const [email] = useState(user?.email ?? '')

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Back
            </Button>
            <h1 className="text-2xl font-bold">Account Settings</h1>
          </div>
          <Button onClick={() => void handleSignOut()} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" value={user?.id ?? ''} disabled className="font-mono text-xs" />
              </div>
            </CardContent>
          </Card>

          {/* Platform Role */}
          {hasPlatformRole && (
            <Card>
              <CardHeader>
                <CardTitle>Platform Role</CardTitle>
                <CardDescription>Your system-wide access level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="px-3 py-2 bg-primary/10 text-primary rounded-md font-medium">
                    {role?.replace('platform_', '').toUpperCase()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" disabled>
                Change Password
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Update Profile
              </Button>
              <Button variant="destructive" className="w-full" disabled>
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                These features will be available in a future update
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
