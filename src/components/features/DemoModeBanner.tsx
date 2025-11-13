import { useState } from 'react'
import { supabaseConfig } from '@/lib/supabase'
import { Button } from '@/components/ui'

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (!supabaseConfig.isDemoMode || dismissed) {
    return null
  }

  const getMessage = () => {
    switch (supabaseConfig.demoModeReason) {
      case 'env_variable':
        return '🎭 Demo Mode is enabled via environment variable (VITE_DEMO_MODE=true)'
      case 'auto_fallback':
        return '🎭 Demo Mode is active - Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use real backend.'
      case 'admin_toggle':
        return '🎭 Demo Mode is enabled by system administrator'
      default:
        return '🎭 Demo Mode is active'
    }
  }

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-yellow-800">{getMessage()}</p>
          <a
            href="https://github.com/yourusername/byo-saas-boilerplate#demo-mode"
            className="text-sm text-yellow-900 underline hover:text-yellow-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </a>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-100"
        >
          Dismiss
        </Button>
      </div>
    </div>
  )
}
