import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/AuthContext'

interface HeaderProps {
  variant?: 'landing' | 'app'
}

export function Header({ variant = 'landing' }: HeaderProps) {
  const { user, signOut } = useAuth()

  if (variant === 'landing') {
    return (
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="font-bold text-xl">
                BYO v4
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                to="/#pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/#docs"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Docs
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button onClick={() => void signOut()} variant="outline">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }

  // App variant with user menu
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="font-bold text-xl">
              BYO v4
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/account"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Account
              </Link>
              <Link
                to="/settings"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button onClick={() => void signOut()} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
