import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { DemoModeBanner } from '@/components/DemoModeBanner'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/features/auth/AuthContext'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { AdminRoute } from '@/features/rbac/AdminRoute'
import { LandingPage } from '@/pages/Landing'
import { LoginPage } from '@/pages/Login'
import { SignupPage } from '@/pages/Signup'
import { PasswordResetPage } from '@/pages/PasswordReset'
import { DashboardPage } from '@/pages/Dashboard'
import { AccountPage } from '@/pages/Account'
import { SettingsPage } from '@/pages/Settings'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { UserManagementPage } from '@/pages/admin/UserManagementPage'
import { OrganizationsListPage } from '@/pages/organizations/OrganizationsListPage'
import { CreateOrganizationPage } from '@/pages/organizations/CreateOrganizationPage'
import { OrganizationDetailPage } from '@/pages/organizations/OrganizationDetailPage'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <DemoModeBanner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/reset-password" element={<PasswordResetPage />} />
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
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <UserManagementPage />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations"
              element={
                <ProtectedRoute>
                  <OrganizationsListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/new"
              element={
                <ProtectedRoute>
                  <CreateOrganizationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizations/:id"
              element={
                <ProtectedRoute>
                  <OrganizationDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
