import { useState } from 'react'
import { getDemoModeStatus } from '@/lib/supabase/client'

const REASON_MESSAGES = {
  admin_toggle: 'enabled by admin',
  env_variable: 'enabled via environment',
  auto_fallback: 'missing Supabase credentials',
  disabled: '',
}

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false)
  const demoStatus = getDemoModeStatus()

  // Don't show banner if not in demo mode or if dismissed
  if (!demoStatus.isActive || dismissed) {
    return null
  }

  const message = REASON_MESSAGES[demoStatus.reason]

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-yellow-400 dark:bg-yellow-600">
              <svg
                className="h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <p className="ml-3 font-medium text-yellow-900 dark:text-yellow-100 text-sm">
              <span className="inline">
                🎭 Demo Mode Active ({message}) - All data is simulated
              </span>
            </p>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="-mr-1 flex p-2 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              aria-label="Dismiss banner"
            >
              <svg
                className="h-5 w-5 text-yellow-900 dark:text-yellow-100"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
