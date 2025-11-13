# Architecture Documentation

**Project:** BYO v4 SaaS Boilerplate
**Last Updated:** 2025-11-13

## Overview

BYO v4 is a production-ready, multi-tenant SaaS boilerplate built with a modern tech stack. The architecture follows industry best practices for scalability, security, and maintainability.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  React 18 + TypeScript + Vite + TailwindCSS + ShadCN UI    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS / REST / Realtime
                         │
┌────────────────────────┴────────────────────────────────────┐
│                     Supabase Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │ Database │  │ Storage  │  │ Realtime │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Principles

### 1. Multi-Tenancy
- **Pattern:** Row-Level Multi-Tenancy
- **Isolation:** Database-level using RLS (Row Level Security)
- **Scaling:** Single instance, shared database
- **Benefits:**
  - Cost-effective for scaling
  - Simplified deployment
  - Strong data isolation via RLS policies

### 2. Security-First
- All database access controlled by RLS policies
- JWT-based authentication via Supabase Auth
- HTTPS-only communication
- XSS and CSRF protection built-in

### 3. Graceful Degradation
- **Demo Mode System** (3-tier hierarchy):
  1. Admin dashboard toggle (runtime control)
  2. Environment variable (`VITE_DEMO_MODE`)
  3. Auto-fallback (missing credentials)
- Application never crashes due to missing configuration
- Clear user communication via banners and toasts

## Directory Structure

```
byo-v4/
├── src/
│   ├── components/        # Shared UI components
│   │   ├── ui/           # ShadCN components
│   │   ├── Header.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── DemoModeBanner.tsx
│   ├── features/         # Feature-based modules
│   │   ├── auth/        # Authentication
│   │   ├── rbac/        # Role-based access control
│   │   └── admin/       # Admin features
│   ├── lib/             # Utilities and services
│   │   ├── supabase/   # Supabase client + mock
│   │   ├── logger.ts   # Pino logger
│   │   └── utils.ts    # Helper functions
│   ├── pages/           # Route pages
│   └── App.tsx          # Root component
├── supabase/            # Database migrations
│   ├── migrations/
│   └── config.toml
├── docs/                # Documentation
│   ├── documentation/  # Technical docs
│   ├── specs/          # Specifications
│   └── tasks/          # Task management
└── tests/              # E2E tests
    └── e2e/
```

## Data Flow

### Authentication Flow
```
User → Login Page → Supabase Auth → JWT Token → AuthContext → Protected Routes
```

### Data Access Flow
```
Component → Supabase Client → RLS Check → Database → Response → UI Update
```

### Demo Mode Flow
```
Missing Credentials → Auto-Fallback Triggered → Mock Client Loaded → Demo Data Served
```

## State Management

### Global State
- **Authentication:** React Context API (`AuthContext`)
- **Notifications:** Toast system with state reducer
- **Error Handling:** Error Boundaries with fallback UI

### Local State
- **Forms:** React useState (will migrate to react-hook-form)
- **UI State:** Component-level useState

## Routing

- **Library:** React Router v6
- **Strategy:** Client-side routing with BrowserRouter
- **Protected Routes:** HOC pattern with `ProtectedRoute` and `AdminRoute` wrappers
- **Route Structure:**
  - `/` - Landing page (public)
  - `/login`, `/signup`, `/reset-password` - Auth pages (public)
  - `/dashboard` - Main app (protected)
  - `/account`, `/settings` - User pages (protected)
  - `/admin` - Admin dashboard (protected + platform_admin role)

## Database Schema

### Core Tables
- `profiles` - User profiles (1:1 with auth.users)
- `organizations` - Tenant workspaces
- `organization_members` - User-org relationships with roles
- `system_roles` - Platform-level admin roles
- `system_settings` - Application configuration
- `invitations` - Org invitation system

### Security Model
All tables use RLS policies for access control:
- Users can only see their own profile
- Users can only see orgs they're members of
- Only platform admins can access system tables
- Org admins can manage members within their org

## Deployment Architecture

### Development
```
Local Machine → Vite Dev Server (Port 5173)
                ↓
                Supabase Local (Optional)
                OR
                Demo Mode (No backend)
```

### Production
```
GitHub → GitHub Actions CI/CD → Vercel Edge Network → Supabase Cloud
```

## Performance Considerations

- **Code Splitting:** Vite handles automatic chunking
- **Lazy Loading:** Route-based code splitting
- **Bundle Size:** ~400KB gzipped total
- **Caching:** Static assets cached at edge
- **Database:** Connection pooling via Supabase

## Scalability

### Horizontal Scaling
- Stateless frontend (deployed to edge)
- Supabase handles database scaling
- No server-side session state

### Multi-Region
- Vercel edge network for global CDN
- Supabase read replicas (when needed)

## Monitoring & Observability

- **Logging:** Pino structured logging
- **Error Tracking:** Error boundaries + console logging
- **User Feedback:** Toast notifications
- **Demo Mode:** Clear banners showing system state

## Future Architecture Plans

1. **React Query:** Add for data fetching and caching
2. **Zustand:** Consider for complex client-state management
3. **Feature Flags:** Implement via system_settings table
4. **Real-time:** Add Supabase Realtime subscriptions
5. **Background Jobs:** Consider Supabase Edge Functions
