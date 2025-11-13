import { useState } from 'react'
import { demoModeEnabled } from '@/lib/supabase/client'

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (!demoModeEnabled || dismissed) {
    return null
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-yellow-800">
            <strong className="font-semibold">Demo Mode Active:</strong> You're using mock data.
            No real database connection. Configure Supabase credentials to use real data.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="ml-4 text-yellow-800 hover:text-yellow-900 focus:outline-none"
          aria-label="Dismiss demo mode banner"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
