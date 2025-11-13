import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/AuthContext'
import { ErrorBoundary } from '@/components/features/ErrorBoundary'
import { AppRouter } from './AppRouter'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
