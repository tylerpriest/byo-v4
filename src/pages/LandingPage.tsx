import { Link } from 'react-router-dom'
import { demoModeEnabled } from '@/lib/supabase/client'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">BYO v4</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Production-Ready SaaS Boilerplate
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Build your next SaaS application with React 19, TypeScript, Vite 7, TailwindCSS v4,
            and Supabase. Complete with authentication, multi-tenancy, RBAC, and demo mode.
          </p>

          {demoModeEnabled && (
            <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode Active:</strong> Try the app with mock data. No real backend
                required!
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <a
              href="https://github.com"
              className="px-8 py-3 text-lg font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Modern Stack</h3>
            <p className="text-gray-600">
              React 19, Vite 7, TypeScript, TailwindCSS v4 with the latest features and best
              practices.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔐 Auth & RBAC</h3>
            <p className="text-gray-600">
              Complete authentication system with role-based access control and multi-tenancy.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🎭 Demo Mode</h3>
            <p className="text-gray-600">
              Built-in demo mode with mock data. Perfect for development and demonstrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
