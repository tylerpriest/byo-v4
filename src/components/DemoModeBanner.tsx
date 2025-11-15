import { useState, useEffect } from 'react'
import { isInDemoMode } from '@/lib/supabase-client'

/**
 * Demo Mode Banner Component
 * Displays a warning banner when app is running in demo mode
 * Dismissible with localStorage persistence
 */
export function DemoModeBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if demo mode is active
    const isDemoActive = isInDemoMode()

    // Check if user previously dismissed the banner
    const wasDismissed = localStorage.getItem('demo-banner-dismissed') === 'true'

    setVisible(isDemoActive && !wasDismissed)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('demo-banner-dismissed', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-semibold">Demo Mode Active</p>
            <p className="text-sm opacity-90">
              Data is simulated. Connect Supabase for real functionality.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
          aria-label="Dismiss banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  )
}
