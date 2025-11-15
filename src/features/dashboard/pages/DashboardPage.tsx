import { useAuth } from '@/features/auth/context/AuthContext'

export function DashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.profile?.full_name || user?.email}!</h2>
          <p className="text-gray-600 mb-4">
            Platform Role: {user?.systemRole?.role || 'None'}
          </p>
          <p className="text-gray-600">
            Organization Memberships: {user?.orgMemberships.length || 0}
          </p>
        </div>
      </div>
    </div>
  )
}
