import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useOrganizations } from '../hooks/useOrganizations'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useToast } from '@/components/ui/use-toast'

const createOrgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
})

type CreateOrgFormData = z.infer<typeof createOrgSchema>

export function OrganizationListPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const { organizations, loading, createOrganization, deleteOrganization } = useOrganizations()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset } = useForm<CreateOrgFormData>()

  const onSubmit = async (data: CreateOrgFormData) => {
    try {
      setError('')
      const validated = createOrgSchema.parse(data)

      await createOrganization({
        name: validated.name,
        slug: validated.slug,
        created_by: user?.id || '',
      })

      reset()
      setShowCreateForm(false)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message)
      } else {
        setError(err.message || 'Failed to create organization')
      }
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteOrganization(id)
        toast({
          title: 'Organization deleted',
          description: 'The organization has been deleted successfully.',
          variant: 'default',
        })
      } catch (err: any) {
        toast({
          title: 'Failed to delete organization',
          description: err.message || 'An error occurred while deleting the organization.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Organizations</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {showCreateForm ? 'Cancel' : 'Create Organization'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Organization</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL-friendly identifier)
                </label>
                <input
                  {...register('slug')}
                  type="text"
                  id="slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="acme-corp"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
              >
                Create Organization
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        ) : organizations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No organizations yet. Create your first one above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {organizations.map((org) => {
              const userMembership = user?.orgMemberships.find((m) => m.organization_id === org.id)
              return (
                <div key={org.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{org.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">/{org.slug}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        Your role: <span className="font-medium">{userMembership?.role}</span>
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => navigate(`/organizations/${org.id}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        View
                      </button>
                      {(userMembership?.role === 'owner' || user?.systemRole?.role === 'platform_admin') && (
                        <button
                          onClick={() => handleDelete(org.id, org.name)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
