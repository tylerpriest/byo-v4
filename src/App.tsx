import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import AppRoutes from './routes'

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
