import { useState } from 'react'
import { isInDemoMode } from '@/lib/supabase-client'

/**
 * Demo Login Button Component
 * One-click demo login when in demo mode
 * Different variants for regular user vs admin
 */

interface DemoLoginButtonProps {
  variant?: 'user' | 'admin'
  onLogin?: (email: string, password: string) => void
  className?: string
}

export function DemoLoginButton({
  variant = 'user',
  onLogin,
  className = '',
}: DemoLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isDemoActive = isInDemoMode()

  if (!isDemoActive) return null

  const handleDemoLogin = async () => {
    setIsLoading(true)

    const demoEmail = variant === 'admin' ? 'admin@demo.com' : 'demo@example.com'
    const demoPassword = 'demo'

    if (onLogin) {
      await onLogin(demoEmail, demoPassword)
    }

    setIsLoading(false)
  }

  return (
    <button
      onClick={handleDemoLogin}
      disabled={isLoading}
      className={`w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Logging in...
        </span>
      ) : (
        <>
          {variant === 'admin' ? '🔐 Admin Demo Login' : '👤 Demo Login'}
        </>
      )}
    </button>
  )
}
