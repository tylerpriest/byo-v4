import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthContext'
import { useOrganizationRole } from '@/features/rbac/useRoles'
import { inviteMemberSchema, type InviteMemberFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/supabase/types'

type Organization = Database['public']['Tables']['organizations']['Row']
type OrganizationMember = Database['public']['Tables']['organization_members']['Row'] & {
  profiles: { email: string; full_name: string | null }
}

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isOwner, isAdmin } = useOrganizationRole(id || '')
  const { toast } = useToast()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { role: 'member' },
  })

  useEffect(() => {
    async function fetchData() {
      if (!id) return

      const supabase = getSupabaseClient()

      // Fetch organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single()

      if (orgError) {
        toast({
          title: 'Error',
          description: 'Organization not found',
          variant: 'destructive',
        })
        navigate('/organizations')
        return
      }

      setOrganization(org)

      // Fetch members
      const { data: membersData } = await supabase
        .from('organization_members')
        .select('*, profiles(email, full_name)')
        .eq('organization_id', id)

      if (membersData) {
        setMembers(membersData as OrganizationMember[])
      }

      setLoading(false)
    }

    void fetchData()
  }, [id, navigate, toast])

  const handleInvite = async (data: InviteMemberFormData) => {
    if (!id || !user) return
    setInviting(true)

    try {
      const supabase = getSupabaseClient()

      // In a real app, this would send an email invitation
      // For now, we'll just create a placeholder invitation record
      const { error } = await supabase.from('invitations').insert({
        organization_id: id,
        email: data.email,
        role: data.role,
        invited_by: user.id,
        token: crypto.randomUUID(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      } as never)

      if (error) throw error

      toast({
        title: 'Invitation sent',
        description: `Invited ${data.email} as ${data.role}`,
      })

      reset()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to send invitation',
        variant: 'destructive',
      })
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!id || (!isOwner && !isAdmin)) return

    const supabase = getSupabaseClient()
    const { error } = await supabase.from('organization_members').delete().eq('id', memberId)

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      })
      return
    }

    setMembers((prev) => prev.filter((m) => m.id !== memberId))
    toast({
      title: 'Success',
      description: 'Member removed from organization',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header variant="app" />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return null
  }

  const canManageMembers = isOwner || isAdmin

  return (
    <div className="min-h-screen">
      <Header variant="app" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/organizations')} className="mb-4">
            ← Back to Organizations
          </Button>
          <h1 className="text-3xl font-bold">{organization.name}</h1>
          <p className="text-muted-foreground">/{organization.slug}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Members Card */}
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>People who have access to this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{member.profiles.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                    </div>
                    {canManageMembers && member.role !== 'owner' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => void handleRemoveMember(member.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invite Member Card */}
          {canManageMembers && (
            <Card>
              <CardHeader>
                <CardTitle>Invite Member</CardTitle>
                <CardDescription>Add new people to your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit(handleInvite)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      {...register('email')}
                      disabled={inviting}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      {...register('role')}
                      disabled={inviting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-destructive">{errors.role.message}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={inviting}>
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
