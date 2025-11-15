import { useAuth } from '@/features/auth/context/AuthContext'

export function AdminDashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Platform Admin Area</h2>
          <p className="text-gray-300 mb-4">
            Logged in as: {user?.email}
          </p>
          <p className="text-gray-300">
            Role: {user?.systemRole?.role}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-gray-400">Coming in Phase 5</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-gray-400">Coming in Phase 5</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Audit Logs</h3>
              <p className="text-sm text-gray-400">Coming in Phase 5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
