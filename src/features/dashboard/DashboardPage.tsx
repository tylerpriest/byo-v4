import { useAuth } from '@/features/auth/AuthContext'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui'

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Start building your application</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is a blank canvas. Add your business logic here to create
              your unique SaaS product.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Tenancy</CardTitle>
            <CardDescription>Organization workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create organizations, invite members, and manage team permissions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>Learn more</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check the docs folder for architecture details, database schema,
              and guides.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Customize your application</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              Set up your Supabase project and update environment variables
            </li>
            <li>Run database migrations to create tables</li>
            <li>Customize the UI components and theming</li>
            <li>Add your business-specific features</li>
            <li>Configure Vercel deployment</li>
            <li>Set up CI/CD with GitHub Actions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
