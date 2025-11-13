import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { AuthProvider } from '@/features/auth/AuthContext'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AdminRoute } from '@/features/rbac/AdminRoute'
import { LandingPage } from '@/pages/Landing'
import { LoginPage } from '@/pages/Login'
import { SignupPage } from '@/pages/Signup'
import { DashboardPage } from '@/pages/Dashboard'
import { AccountPage } from '@/pages/Account'
import { SettingsPage } from '@/pages/Settings'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DemoModeBanner />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
