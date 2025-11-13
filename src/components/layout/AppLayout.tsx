import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthContext'
import { Button } from '@/components/ui'
import { DemoModeBanner } from '@/components/features/DemoModeBanner'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <DemoModeBanner />

      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              BYO SaaS
            </Link>
            <nav className="flex gap-4">
              <Link to="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost">Settings</Button>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
