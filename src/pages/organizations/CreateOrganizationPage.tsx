import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Header } from '@/components/Header'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/features/auth/AuthContext'
import { createOrganizationSchema, type CreateOrganizationFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/use-toast'
import type { Database } from '@/lib/supabase/types'

type Organization = Database['public']['Tables']['organizations']['Row']

export function CreateOrganizationPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    /* watch, */
    setValue,
  } = useForm<CreateOrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
  })

  // Auto-generate slug from name
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
    if (!user) return
    setLoading(true)

    try {
      const supabase = getSupabaseClient()

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: data.name,
          slug: data.slug,
          owner_id: user.id,
        } as never)
        .select()
        .single()

      if (orgError || !org) throw orgError

      // Add creator as owner in organization_members
      const organization = org as unknown as Organization
      const { error: memberError } = await supabase.from('organization_members').insert({
        organization_id: organization.id,
        user_id: user.id,
        role: 'owner',
      } as never)

      if (memberError) throw memberError

      toast({
        title: 'Success',
        description: 'Organization created successfully!',
      })

      navigate(`/organizations/${organization.id}`)
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create organization',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header variant="app" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Organization</CardTitle>
            <CardDescription>Set up a new workspace for your team</CardDescription>
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
                  disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Lowercase letters, numbers, and dashes only
                </p>
                {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Organization'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/organizations')}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
