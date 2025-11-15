import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/context/AuthContext'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      })
    } catch (error: unknown) {
      toast({
        title: 'Sign out failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-card border-b border-border z-30">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Breadcrumb / Page Title */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {/* This could be dynamic based on route */}
          </h2>
        </div>

        {/* Right side - User menu, notifications, etc */}
        <div className="flex items-center gap-4">
          {/* User Avatar and Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {user?.profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.systemRole?.role || 'Member'}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {user?.profile?.full_name?.[0] || user?.email?.[0] || '?'}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="ml-2"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
