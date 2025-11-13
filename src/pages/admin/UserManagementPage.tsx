import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']
type SystemRole = Database['public']['Tables']['system_roles']['Row']

type UserWithRole = Profile & {
  system_role?: SystemRole
}

export function UserManagementPage() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchUsers() {
      const supabase = getSupabaseClient()

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (profilesError) {
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }

      // Fetch system roles for each user
      const { data: roles } = await supabase.from('system_roles').select('*')

      const usersWithRoles: UserWithRole[] = (profiles as Profile[]).map((profile) => ({
        ...profile,
        system_role:
          (roles as SystemRole[] | null)?.find((r) => r.user_id === profile.id) || undefined,
      }))

      setUsers(usersWithRoles)
      setLoading(false)
    }

    void fetchUsers()
  }, [toast])

  const handleAssignRole = async (
    userId: string,
    role: 'platform_admin' | 'platform_developer' | 'platform_support',
  ) => {
    const supabase = getSupabaseClient()

    const { error } = await supabase
      .from('system_roles')
      .upsert({ user_id: userId, role } as never, { onConflict: 'user_id' })

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign role',
        variant: 'destructive',
      })
      return
    }

    // Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, system_role: { user_id: userId, role, created_at: new Date().toISOString() } }
          : u,
      ),
    )

    toast({
      title: 'Success',
      description: `Assigned ${role} role`,
    })
  }

  const handleRemoveRole = async (userId: string) => {
    const supabase = getSupabaseClient()

    const { error } = await supabase.from('system_roles').delete().eq('user_id', userId)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove role',
        variant: 'destructive',
      })
      return
    }

    // Update local state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? ({ ...u, system_role: undefined } as unknown as UserWithRole) : u,
      ),
    )

    toast({
      title: 'Success',
      description: 'Platform role removed',
    })
  }

  return (
    <div className="min-h-screen">
      <Header variant="app" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage users and assign platform roles</p>
        </div>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{user.email}</CardTitle>
                      <CardDescription>
                        {user.full_name || 'No name set'} • Joined{' '}
                        {new Date(user.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.system_role ? (
                        <>
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                            {user.system_role.role.replace('platform_', '')}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => void handleRemoveRole(user.id)}
                          >
                            Remove Role
                          </Button>
                        </>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void handleAssignRole(user.id, 'platform_admin')}
                          >
                            Make Admin
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void handleAssignRole(user.id, 'platform_developer')}
                          >
                            Make Developer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void handleAssignRole(user.id, 'platform_support')}
                          >
                            Make Support
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
