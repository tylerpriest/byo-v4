import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthContext'
import type { Database } from '@/lib/supabase/types'

type Organization = Database['public']['Tables']['organizations']['Row']

export function OrganizationsListPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchOrganizations() {
      if (!user) return

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setOrganizations(data)
      }
      setLoading(false)
    }

    void fetchOrganizations()
  }, [user])

  return (
    <div className="min-h-screen">
      <Header variant="app" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-muted-foreground mt-1">Manage your workspaces</p>
          </div>
          <Button asChild>
            <Link to="/organizations/new">Create Organization</Link>
          </Button>
        </div>

        {loading ? (
          <p>Loading organizations...</p>
        ) : organizations.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No organizations yet</CardTitle>
              <CardDescription>Create your first organization to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/organizations/new">Create Organization</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <Card
                key={org.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => navigate(`/organizations/${org.id}`)}
              >
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>/{org.slug}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Created {new Date(org.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
