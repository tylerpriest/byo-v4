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
import { createOrganizationSchema, type CreateOrganizationFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/supabase/types'

type Organization = Database['public']['Tables']['organizations']['Row']

export function OrganizationSettingsPage() {
  const { id } = useParams<{ id: string }>()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isOwner, isAdmin } = useOrganizationRole(id || '')
  const { toast } = useToast()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
  })

  useEffect(() => {
    async function fetchOrganization() {
      if (!id) return

      const supabase = getSupabaseClient()
      const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single()

      if (error) {
        toast({
          title: 'Error',
          description: 'Organization not found',
          variant: 'destructive',
        })
        navigate('/organizations')
        return
      }

      const org = data as unknown as Organization
      setOrganization(org)
      reset({
        name: org.name,
        slug: org.slug,
      })
      setLoading(false)
    }

    void fetchOrganization()
  }, [id, navigate, toast, reset])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50)
    setValue('slug', slug)
  }

  const handleSubmit = async (data: CreateOrganizationFormData) => {
    if (!id || !user || !isOwner) return
    setSaving(true)

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from('organizations')
        .update({
          name: data.name,
          slug: data.slug,
        } as never)
        .eq('id', id)

      if (error) throw error

      setOrganization((prev) => (prev ? { ...prev, name: data.name, slug: data.slug } : null))

      toast({
        title: 'Success',
        description: 'Organization updated successfully',
      })

      navigate(`/organizations/${id}`)
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update organization',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !user || !isOwner) return

    const confirmed = confirm(
      'Are you sure you want to delete this organization? This action cannot be undone.',
    )
    if (!confirmed) return

    setDeleting(true)

    try {
      const supabase = getSupabaseClient()

      // Delete organization (cascade will handle members and invitations)
      const { error } = await supabase.from('organizations').delete().eq('id', id)

      if (error) throw error

      toast({
        title: 'Organization deleted',
        description: 'The organization has been permanently deleted',
      })

      navigate('/organizations')
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete organization',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
    }
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

  if (!organization || (!isOwner && !isAdmin)) {
    return (
      <div className="min-h-screen">
        <Header variant="app" />
        <div className="container mx-auto px-4 py-8">
          <p>You don't have permission to edit this organization.</p>
          <Button onClick={() => navigate(`/organizations/${id}`)}>Back to Organization</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header variant="app" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(`/organizations/${id}`)} className="mb-4">
            ← Back to Organization
          </Button>
          <h1 className="text-3xl font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">Manage your organization details</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Update your organization name and URL slug</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    placeholder="Acme Inc."
                    {...register('name')}
                    onChange={(e) => {
                      void register('name').onChange(e)
                      handleNameChange(e)
                    }}
                    disabled={saving || !isOwner}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">app.com/</span>
                    <Input
                      id="slug"
                      placeholder="acme-inc"
                      {...register('slug')}
                      disabled={saving || !isOwner}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lowercase letters, numbers, and dashes only
                  </p>
                  {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                </div>

                {isOwner && (
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {isOwner && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions that will permanently affect your organization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Delete Organization</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete an organization, there is no going back. This will permanently
                      delete the organization, all members, and all associated data.
                    </p>
                    <Button
                      variant="destructive"
                      onClick={() => void handleDelete()}
                      disabled={deleting}
                    >
                      {deleting ? 'Deleting...' : 'Delete Organization'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
