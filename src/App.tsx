import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { Toaster } from '@/components/ui/toaster'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignupPage } from '@/features/auth/pages/SignupPage'
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage'
import { LandingPage } from '@/features/landing/pages/LandingPage'
import { OrganizationListPage } from '@/features/organizations/pages/OrganizationListPage'
import { OrganizationDetailPage } from '@/features/organizations/pages/OrganizationDetailPage'
import { AccountPage } from '@/features/account/pages/AccountPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DemoModeBanner />
        <Toaster />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected routes with AppLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Account routes */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AccountPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Settings routes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <SettingsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Organization routes */}
          <Route
            path="/organizations"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OrganizationListPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OrganizationDetailPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requirePlatformAdmin>
                <AppLayout>
                  <AdminDashboardPage />
                </AppLayout>
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
