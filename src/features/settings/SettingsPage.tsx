import { useAuth } from '@/features/auth/AuthContext'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui'

export function SettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 text-sm">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                User ID
              </dt>
              <dd className="mt-1 text-sm font-mono text-xs">{user?.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Account Created
              </dt>
              <dd className="mt-1 text-sm">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'Unknown'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Add your preference settings here (theme, notifications, etc.)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
