import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useOrganizationMembers, useOrganizationInvitations } from '../hooks/useOrganizations'
import { usePermissions } from '@/features/auth/hooks/usePermissions'
import { useToast } from '@/components/ui/use-toast'

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member', 'viewer']),
})

type InviteFormData = z.infer<typeof inviteSchema>

export function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const organizationId = id || ''
  const { toast } = useToast()

  const permissions = usePermissions(organizationId)
  const { members, updateMemberRole, removeMember } = useOrganizationMembers(organizationId)
  const { invitations, createInvitation, revokeInvitation } =
    useOrganizationInvitations(organizationId)

  const [showInviteForm, setShowInviteForm] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, reset } = useForm<InviteFormData>({
    defaultValues: { role: 'member' },
  })

  const onInvite = async (data: InviteFormData) => {
    try {
      setError('')
      const validated = inviteSchema.parse(data)
      await createInvitation(validated.email, validated.role)
      reset()
      setShowInviteForm(false)
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message)
      } else {
        setError(err.message || 'Failed to send invitation')
      }
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await updateMemberRole(memberId, newRole)
      toast({
        title: 'Role updated',
        description: 'Member role has been updated successfully.',
        variant: 'default',
      })
    } catch (err: any) {
      toast({
        title: 'Failed to update role',
        description: err.message || 'An error occurred while updating the role.',
        variant: 'destructive',
      })
    }
  }

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (confirm(`Remove ${memberName} from this organization?`)) {
      try {
        await removeMember(memberId)
        toast({
          title: 'Member removed',
          description: 'Member has been removed from the organization.',
          variant: 'default',
        })
      } catch (err: any) {
        toast({
          title: 'Failed to remove member',
          description: err.message || 'An error occurred while removing the member.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleRevokeInvitation = async (invitationId: string, email: string) => {
    if (confirm(`Revoke invitation for ${email}?`)) {
      try {
        await revokeInvitation(invitationId)
        toast({
          title: 'Invitation revoked',
          description: 'The invitation has been revoked successfully.',
          variant: 'default',
        })
      } catch (err: any) {
        toast({
          title: 'Failed to revoke invitation',
          description: err.message || 'An error occurred while revoking the invitation.',
          variant: 'destructive',
        })
      }
    }
  }

  if (!permissions.canInviteMembers && !permissions.canManageOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">
            You need admin or owner permissions to manage this organization.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Organization Members</h1>

        {/* Invite Section */}
        {permissions.canInviteMembers && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Invite Members</h2>
              <button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {showInviteForm ? 'Cancel' : 'Invite'}
              </button>
            </div>

            {showInviteForm && (
              <form onSubmit={handleSubmit(onInvite)} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    {...register('role')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Send Invitation
                </button>
              </form>
            )}
          </div>
        )}

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Pending Invitations</h2>
            <div className="space-y-2">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{inv.email}</p>
                    <p className="text-sm text-gray-600">
                      Role: {inv.role} · Expires:{' '}
                      {new Date(inv.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevokeInvitation(inv.id, inv.email)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Members */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Members</h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">User ID: {member.user_id}</p>
                  <p className="text-sm text-gray-600">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {permissions.canAssignRoles && member.role !== 'owner' ? (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      className="px-3 py-1 border rounded"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="px-3 py-1 bg-gray-100 rounded font-medium">
                      {member.role}
                    </span>
                  )}
                  {permissions.canRemoveMembers && member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.user_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
