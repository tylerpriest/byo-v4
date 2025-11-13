# Authentication Documentation

**Project:** BYO v4 SaaS Boilerplate
**Last Updated:** 2025-11-13

## Overview

Authentication is handled entirely by Supabase Auth, providing secure and scalable user management without custom implementation.

## Authentication Flows

### Sign Up Flow
1. User fills out signup form (`/signup`)
2. Form data sent to `supabase.auth.signUp()`
3. Supabase creates user in `auth.users` table
4. Trigger creates corresponding profile in `public.profiles`
5. User receives confirmation email (if enabled)
6. Session created and JWT token returned
7. User redirected to `/dashboard`

### Sign In Flow
1. User enters credentials on `/login`
2. Credentials sent to `supabase.auth.signInWithPassword()`
3. Supabase validates credentials
4. JWT token returned with session
5. Session stored in `AuthContext`
6. User redirected to `/dashboard`

### Demo Login Flow
1. User clicks "Demo User" or "Demo Admin" button
2. Mock client returns predefined session
3. Demo user credentials:
   - Regular: `demo@example.com`
   - Admin: `admin@example.com`
4. User redirected to `/dashboard`

### Password Reset Flow
1. User navigates to `/reset-password`
2. Enters email address
3. `supabase.auth.resetPasswordForEmail()` sends reset link
4. User receives email with magic link
5. Link redirects to `/reset-password` with token
6. User sets new password
7. Session created automatically

### Sign Out Flow
1. User clicks "Sign Out"
2. `supabase.auth.signOut()` called
3. Session cleared from AuthContext
4. User redirected to `/login`

## Demo Mode System

### 3-Tier Hierarchy

**Tier 1: Admin Dashboard Toggle (Highest Priority)**
- Runtime control via Admin Dashboard
- Stored in application state (not persisted)
- Overrides all other settings
- Accessible at `/admin` by platform admins

**Tier 2: Environment Variable**
```env
VITE_DEMO_MODE=true
```
- Used in development/staging environments
- Set in `.env` file or Vercel environment variables
- Active when Tier 1 is not set

**Tier 3: Auto-Fallback (Lowest Priority)**
- Automatic activation when:
  - `VITE_SUPABASE_URL` is missing or empty
  - `VITE_SUPABASE_ANON_KEY` is missing or empty
- Zero-config quick start for demos
- Shows warning banner to users

### Demo Mode Features
- Mock Supabase client with realistic data
- One-click demo login buttons on `/login`
- Fully functional app without backend
- Console warnings (not errors)
- DemoModeBanner component shows active state

## AuthContext API

The `AuthContext` provides authentication state and methods throughout the app.

### State
```typescript
{
  user: User | null          // Current user object
  session: Session | null    // Current session with JWT
  loading: boolean          // Initial auth state loading
}
```

### Methods
```typescript
signIn(email: string, password: string): Promise<void>
signUp(email: string, password: string, metadata?: object): Promise<void>
signOut(): Promise<void>
```

### Usage
```typescript
import { useAuth } from '@/features/auth/AuthContext'

function MyComponent() {
  const { user, signOut } = useAuth()

  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={() => void signOut()}>Sign Out</button>
    </div>
  )
}
```

## Protected Routes

### ProtectedRoute Component
Wraps routes that require authentication.

```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

**Behavior:**
- Checks if user is authenticated
- If not, redirects to `/login`
- If yes, renders child component

### AdminRoute Component
Wraps routes that require platform admin role.

```typescript
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
```

**Behavior:**
- Requires user to be authenticated (via ProtectedRoute)
- Checks `system_roles` table for `platform_admin` role
- If not admin, shows "Access Denied" message
- If admin, renders child component

## Session Management

### Session Storage
- Sessions stored in browser localStorage
- JWT tokens auto-refreshed by Supabase client
- Token expiry: 1 hour (default)
- Refresh token expiry: 7 days (default)

### Session Persistence
- Users remain logged in across page refreshes
- Sessions persist until explicit logout or token expiry
- Session state restored on app mount via `supabase.auth.getSession()`

## Security Features

### Password Requirements
Currently using Supabase defaults:
- Minimum 6 characters
- No complexity requirements (configurable)

### Rate Limiting
Supabase provides built-in rate limiting:
- Email-based rate limits
- IP-based rate limits
- Configurable per project

### CSRF Protection
- Supabase handles CSRF tokens automatically
- JWT tokens validated on every request

### XSS Protection
- React's built-in XSS protection
- Content Security Policy headers (via Vercel)
- No dangerous HTML rendering

## Error Handling

All auth errors are caught and displayed to users via:
- Form error messages
- Toast notifications (post-implementation)
- Console logging with Pino

Common errors:
- Invalid credentials
- Email already registered
- Network errors
- Token expired

## Testing Authentication

### Manual Testing
1. Sign up with new email
2. Verify confirmation email (if enabled)
3. Sign in with credentials
4. Test protected route access
5. Test admin route access (with admin user)
6. Sign out and verify redirect

### Demo Mode Testing
1. Remove Supabase credentials from `.env`
2. Reload app (auto-fallback triggers)
3. Click "Demo User" or "Demo Admin"
4. Verify full app functionality

### E2E Tests
Located in `tests/e2e/auth.spec.ts`:
- Demo user login
- Demo admin login
- Protected route redirects
- Sign out functionality

## Future Enhancements

1. **OAuth Providers:** Add Google, GitHub, etc.
2. **Magic Links:** Email-only login
3. **2FA:** Two-factor authentication
4. **Session Management UI:** Active sessions view
5. **Account Deletion:** Self-service account removal
