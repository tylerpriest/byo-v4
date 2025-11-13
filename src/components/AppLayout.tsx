import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/features/auth/AuthContext'
import { usePlatformRole } from '@/features/rbac/useRoles'
import {
  Menu,
  Home,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
}

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/admin', label: 'Admin Panel', icon: Settings, adminOnly: true },
  { href: '/admin/users', label: 'User Management', icon: Users, adminOnly: true },
]

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { isPlatformAdmin } = usePlatformRole()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || isPlatformAdmin)

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className="space-y-2">
      {filteredNavItems.map((item) => {
        const Icon = item.icon
        const isActive =
          location.pathname === item.href || location.pathname.startsWith(item.href + '/')

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            } ${collapsed && !mobile ? 'justify-center' : ''}`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {(!collapsed || mobile) && <span>{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden border-b bg-background sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">SaaS Boilerplate</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <ScrollArea className="flex-1 p-4">
                  <NavLinks mobile />
                </ScrollArea>
                <div className="p-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => void handleSignOut()}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold">SaaS Boilerplate</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r bg-background transition-all duration-300 ${
            collapsed ? 'w-16' : 'w-64'
          }`}
        >
          <div className="p-6 border-b flex items-center justify-between">
            {!collapsed && (
              <div className="flex-1">
                <h2 className="text-lg font-semibold">SaaS Boilerplate</h2>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="shrink-0"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <NavLinks />
          </ScrollArea>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className={`w-full ${collapsed ? 'px-0' : 'justify-start'}`}
              onClick={() => void handleSignOut()}
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span className="ml-3">Sign Out</span>}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
