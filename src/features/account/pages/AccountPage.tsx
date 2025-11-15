import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { supabase } from '@/lib/supabase-client'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function AccountPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.profile?.full_name || '',
      email: user?.email || '',
    },
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword } = useForm<PasswordFormData>()

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsUpdatingProfile(true)
      profileSchema.parse(data)

      const { error } = await supabase
        .from('user_profiles')
        .update({ full_name: data.fullName })
        .eq('id', user?.id)

      if (error) throw error

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      })
    } catch (err: unknown) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsUpdatingPassword(true)
      passwordSchema.parse(data)

      // Note: In demo mode, this won't actually work
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })

      if (error) throw error

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      })

      resetPassword()
    } catch (err: unknown) {
      toast({
        title: 'Password change failed',
        description: err instanceof Error ? err.message : 'Failed to change password',
        variant: 'destructive',
      })
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-foreground mb-6">Account Settings</h1>

      <div className="grid gap-6">
        {/* Profile Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Profile Information</h2>

          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                {...registerProfile('fullName')}
                id="fullName"
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                {...registerProfile('email')}
                id="email"
                type="email"
                placeholder="john@example.com"
                disabled
                className="mt-1 opacity-60"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>

            <Button type="submit" disabled={isUpdatingProfile}>
              {isUpdatingProfile ? 'Updating...' : 'Update Profile'}
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Change Password</h2>

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                {...registerPassword('currentPassword')}
                id="currentPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                {...registerPassword('newPassword')}
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                {...registerPassword('confirmPassword')}
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="mt-1"
              />
            </div>

            <Button type="submit" disabled={isUpdatingPassword}>
              {isUpdatingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </div>

        {/* Account Information */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Account Information</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground">User ID</p>
              <p className="text-sm text-muted-foreground font-mono">{user?.id}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Platform Role</p>
              <p className="text-sm text-muted-foreground">{user?.systemRole?.role || 'None'}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground">Organizations</p>
              <p className="text-sm text-muted-foreground">
                Member of {user?.orgMemberships?.length || 0} organization(s)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
