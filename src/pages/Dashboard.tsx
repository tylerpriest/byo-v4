import { useAuth } from '@/features/auth/AuthContext'
import { demoModeEnabled } from '@/lib/supabase/client'
import { DemoModeBanner } from '@/components/DemoModeBanner'

export function Dashboard() {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    void (async () => {
      try {
        await signOut()
      } catch (error) {
        console.error('Sign out error:', error)
      }
    })()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoModeBanner />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Welcome to BYO v4! 🎉</h2>
          <p className="text-gray-600 mb-4">
            You've successfully logged into the SaaS boilerplate dashboard. This is a blank canvas
            ready for your business logic.
          </p>

          {demoModeEnabled && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Demo Mode:</strong> You're viewing mock data. Configure Supabase
                credentials in your .env file to connect to a real database.
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Current User Info:</h3>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div>
                <dt className="font-medium text-gray-500">User ID:</dt>
                <dd className="text-gray-900">{user?.id}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email:</dt>
                <dd className="text-gray-900">{user?.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Created:</dt>
                <dd className="text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🏗️ Build Your Features</h3>
            <p className="text-sm text-gray-600">
              This dashboard is your starting point. Add your business logic, create new pages, and
              build your SaaS product.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Check the Docs</h3>
            <p className="text-sm text-gray-600">
              Review the documentation in /docs/ for setup instructions, database schema, and
              architecture details.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Ready to Deploy</h3>
            <p className="text-sm text-gray-600">
              The boilerplate is production-ready with testing, linting, and CI/CD configuration.
              Deploy to Vercel with one click.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>
                Set up Supabase: Create a project at{' '}
                <a
                  href="https://supabase.com"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  supabase.com
                </a>
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>
                Copy .env.example to .env and add your Supabase URL and anon key
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Run database migrations from /docs/specs/database-schema.md</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Customize the dashboard and add your business features</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">5.</span>
              <span>Deploy to Vercel or your preferred hosting platform</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
