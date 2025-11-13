import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'
import { supabaseConfig } from '@/lib/supabase'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">BYO SaaS</h1>
            {supabaseConfig.isDemoMode && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Demo
              </span>
            )}
          </div>
          <nav className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Production-Ready
            <br />
            <span className="text-primary">SaaS Boilerplate</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Build your next SaaS application with modern tech stack.
            Multi-tenant architecture, authentication, RBAC, and more out of the
            box.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">Start Building</Button>
            </Link>
            <a
              href="https://github.com/yourusername/byo-saas-boilerplate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                View on GitHub
              </Button>
            </a>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3">🔐 Authentication</h3>
              <p className="text-muted-foreground">
                Complete auth system with Supabase. Email/password, magic links,
                OAuth, and more.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3">🏢 Multi-Tenancy</h3>
              <p className="text-muted-foreground">
                Row-level security with organization workspaces. Invite members,
                manage roles.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3">🛡️ RBAC</h3>
              <p className="text-muted-foreground">
                Dual role system: platform roles (admin, developer, support) and
                org roles.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3">🎨 Modern UI</h3>
              <p className="text-muted-foreground">
                TailwindCSS v4 with ShadCN components. Beautiful, accessible,
                customizable.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3">🧪 Testing</h3>
              <p className="text-muted-foreground">
                Vitest + Playwright ready. TDD-enforced for critical paths with
                coverage thresholds.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-3">🎭 Demo Mode</h3>
              <p className="text-muted-foreground">
                3-tier graceful degradation. Works without backend for demos and
                development.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop reinventing the wheel. Start with a solid foundation and focus
            on your unique business logic.
          </p>
          <Link to="/signup">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </section>
      </main>

      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © 2025 BYO SaaS Boilerplate. Built with React, Vite, and
              Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
