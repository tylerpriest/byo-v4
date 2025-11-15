import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'
import { DemoLoginButton } from '@/components/DemoLoginButton'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      setLoading(true)

      // Validate with Zod
      const validated = loginSchema.parse(data)

      await signIn(validated.email, validated.password)
      navigate('/admin')
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message)
      } else {
        setError(err.message || 'Failed to sign in')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (email: string, password: string) => {
    try {
      setError('')
      setLoading(true)
      await signIn(email, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 text-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
          <p className="text-center text-gray-400 text-sm mb-6">Platform Administrator Access</p>

          {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                id="password"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Signing in...' : 'Admin Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <DemoLoginButton variant="admin" onLogin={handleDemoLogin} />
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            Regular user?{' '}
            <a href="/login" className="text-indigo-400 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
