import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>
                Logged in as: <span className="font-medium">{user?.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This is your main workspace. Add your business logic and features here.
              </p>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-4">
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
                <CardTitle className="text-base">Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Across all organizations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">Member</p>
                <p className="text-sm text-muted-foreground">In current workspace</p>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Build your SaaS application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">✅ Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    User authentication is set up and working with Supabase.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">✅ Demo Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    3-tier demo mode system is active and functioning.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🚀 Next Steps</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your business logic, create custom pages, and build your unique SaaS
                    product!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
