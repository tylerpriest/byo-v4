import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignupPage } from '@/features/auth/pages/SignupPage'
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DemoModeBanner />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requirePlatformAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
