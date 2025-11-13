import { useEffect, useState } from 'react'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { getSupabaseClient, getDemoModeStatus } from '@/lib/supabase'

function App() {
  const [count, setCount] = useState(0)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialize Supabase client on mount
    getSupabaseClient()
    const demoStatus = getDemoModeStatus()

    console.log('Supabase client initialized:', {
      demo: demoStatus.isActive,
      reason: demoStatus.reason,
    })

    setInitialized(true)
  }, [])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <DemoModeBanner />
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl font-bold mb-8">BYO v4 🚀</h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Production-ready multi-tenant SaaS boilerplate
        </p>
        <div className="mb-8">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 text-base rounded-lg border-2 border-primary bg-primary text-primary-foreground cursor-pointer font-semibold hover:bg-primary/90 transition-colors"
          >
            count is {count}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          React 18 + Vite 5 + TypeScript + TailwindCSS
        </p>
      </div>
    </>
  )
}

export default App
