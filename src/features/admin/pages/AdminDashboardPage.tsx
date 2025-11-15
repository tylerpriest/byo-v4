import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/context/AuthContext'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/database.types'

type UserProfile = Database['public']['Tables']['user_profiles']['Row']
type SystemRole = Database['public']['Tables']['system_roles']['Row']

interface UserWithRole extends UserProfile {
  systemRole?: SystemRole | null
}

export function AdminDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrgs: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [demoModeEnabled, setDemoModeEnabled] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      // Fetch all users
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      // Fetch system roles for each user
      const { data: rolesData } = await supabase
        .from('system_roles')
        .select('*')

      // Combine users with their roles
      const usersWithRoles = (usersData || []).map((user: UserProfile) => ({
        ...user,
        systemRole: rolesData?.find((role: SystemRole) => role.user_id === user.id),
      }))

      setUsers(usersWithRoles)

      // Fetch organizations count
      const { count: orgsCount } = await supabase
        .from('organizations')
        .select('*', { count: 'exact', head: true })

      // Calculate stats
      setStats({
        totalUsers: usersData?.length || 0,
        totalOrgs: orgsCount || 0,
        activeUsers: usersData?.length || 0, // In real app, filter by last_login
      })

      // Fetch demo mode setting
      const { data: settings } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'demo_mode_enabled')
        .single()

      if (settings?.value && typeof settings.value === 'object' && 'enabled' in settings.value) {
        setDemoModeEnabled(Boolean(settings.value.enabled))
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleDemoMode = async () => {
    try {
      const newValue = !demoModeEnabled

      const { error } = await supabase
        .from('system_settings')
        .update({ value: { enabled: newValue } })
        .eq('key', 'demo_mode_enabled')

      if (error) throw error

      setDemoModeEnabled(newValue)
      toast({
        title: 'Demo mode updated',
        description: `Demo mode has been ${newValue ? 'enabled' : 'disabled'}.`,
      })
    } catch (error: unknown) {
      toast({
        title: 'Failed to toggle demo mode',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleAssignRole = async (userId: string, role: string) => {
    try {
      // Check if user already has a system role
      const { data: existing } = await supabase
        .from('system_roles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (existing) {
        // Update existing role
        const { error } = await supabase
          .from('system_roles')
          .update({ role })
          .eq('user_id', userId)

        if (error) throw error
      } else {
        // Insert new role
        const { error } = await supabase
          .from('system_roles')
          .insert({
            user_id: userId,
            role,
            assigned_by: user?.id,
          })

        if (error) throw error
      }

      toast({
        title: 'Role assigned',
        description: 'User role has been updated successfully.',
      })

      fetchDashboardData()
    } catch (error: unknown) {
      toast({
        title: 'Failed to assign role',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Organizations</h3>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.totalOrgs}</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
          <p className="text-3xl font-bold text-foreground mt-2">{stats.activeUsers}</p>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">System Settings</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Demo Mode</p>
            <p className="text-sm text-muted-foreground">
              {demoModeEnabled ? 'Demo mode is currently enabled' : 'Demo mode is currently disabled'}
            </p>
          </div>

          <Button
            onClick={handleToggleDemoMode}
            variant={demoModeEnabled ? 'destructive' : 'default'}
          >
            {demoModeEnabled ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          </Button>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">User Management</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Created</th>
                <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-sm text-foreground">{userItem.email}</td>
                  <td className="p-3 text-sm text-foreground">{userItem.full_name || '-'}</td>
                  <td className="p-3 text-sm">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      userItem.systemRole?.role === 'platform_admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : userItem.systemRole?.role === 'platform_developer'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : userItem.systemRole?.role === 'platform_support'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {userItem.systemRole?.role || 'None'}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">
                    {new Date(userItem.created_at || '').toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm">
                    <select
                      onChange={(e) => handleAssignRole(userItem.id, e.target.value)}
                      value={userItem.systemRole?.role || ''}
                      className="text-sm border border-border rounded px-2 py-1 bg-background text-foreground"
                    >
                      <option value="">None</option>
                      <option value="platform_admin">Admin</option>
                      <option value="platform_developer">Developer</option>
                      <option value="platform_support">Support</option>
                    </select>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
