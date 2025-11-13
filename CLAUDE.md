# BYO v4 - AI Assistant Context

## Project Overview

BYO v4 is a production-ready multi-tenant SaaS boilerplate built with modern technologies and best practices. It provides a solid foundation for building B2B SaaS applications with authentication, multi-tenancy, RBAC, and a unique demo mode feature.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7, TailwindCSS v4
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Testing**: Vitest 4.0, Playwright
- **Code Quality**: ESLint v9, Prettier, Husky
- **Logging**: Pino

## Key Features

### 1. Demo Mode System (3-Tier)

The application includes a sophisticated demo mode that allows users to try the app without backend setup:

1. **Admin Dashboard Toggle** (highest priority) - Runtime control via `system_settings` table
2. **Environment Variable** - `VITE_DEMO_MODE=true`
3. **Auto-Fallback** - Automatically enables if Supabase credentials are missing

**Files**:
- `src/lib/supabase/client.ts` - Demo mode detection and client creation
- `src/lib/supabase/mock-client.ts` - Mock Supabase client implementation
- `src/components/DemoModeBanner.tsx` - User notification component

### 2. Authentication System

Complete authentication using Supabase Auth with demo mode support:

**Files**:
- `src/features/auth/AuthContext.tsx` - Auth context provider and useAuth hook
- `src/pages/LoginPage.tsx` - Login page with demo login buttons
- `src/components/ProtectedRoute.tsx` - Route protection wrapper

**Demo Users**:
- Regular: `demo@example.com` (any password in demo mode)
- Admin: `admin@example.com` (any password in demo mode)

### 3. Project Structure

```
/src
  /components     - Shared UI components
  /features       - Feature-based modules (auth, etc.)
  /lib            - Utilities (supabase, logger, utils)
  /pages          - Page components
  /hooks          - Custom React hooks
  /types          - TypeScript type definitions
  /test           - Test setup and utilities

/docs
  /documentation  - Technical documentation
  /specs          - Specifications and schemas
  /tasks          - Task management (active, complete, template, draft)
```

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests with Vitest
npm run type-check   # TypeScript type checking
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEMO_MODE=false  # Set to 'true' to force demo mode
```

**Note**: If Supabase credentials are missing, demo mode automatically activates.

## Current Implementation Status

### ✅ Completed
- Project setup with Vite 7, React 19, TypeScript
- TailwindCSS v4 with ShadCN UI foundation
- ESLint v9 (flat config), Prettier, Husky hooks
- Vitest 4.0 configuration
- Supabase client with demo mode detection
- Mock Supabase client for demo mode
- Pino logger setup
- Authentication context and hooks
- Landing page
- Login page with demo login buttons
- Protected dashboard page
- Demo mode banner component
- Build and lint validation

### 🚧 To Be Implemented

See `/docs/documentation/remaining-features.md` for detailed list.

**High Priority**:
- Database schema implementation (see `/docs/specs/database-schema.md`)
- Row Level Security (RLS) policies
- RBAC system (platform roles + organization roles)
- Organization management
- Member management and invitations
- Admin dashboard
- Unit tests for authentication (>80% coverage target)

**Medium Priority**:
- User settings page
- Account page
- Sidebar navigation component
- E2E tests with Playwright
- GitHub Actions CI/CD pipeline

**Nice to Have**:
- Payment integration (Stripe)
- Email service integration
- File upload/storage features
- Analytics dashboard

## Important Notes for AI Assistants

1. **Never create docs in root** - Only CLAUDE.md belongs in root. All other docs go in `/docs/`
2. **Feature-based organization** - Keep related files together in `/src/features/`
3. **Demo mode first** - Always ensure features work in demo mode
4. **Type safety** - Strict TypeScript mode is enabled
5. **Logging** - Use Pino logger, not console.log
6. **Testing** - Critical paths (auth, RBAC, payments) require >80% coverage
7. **No emojis** - Unless explicitly requested by user

## Useful Patterns

### Adding a new authenticated page:
1. Create page component in `/src/pages/`
2. Add route in `/src/routes.tsx` wrapped with `<ProtectedRoute>`
3. Update navigation if needed

### Adding a new feature:
1. Create directory in `/src/features/feature-name/`
2. Keep components, hooks, types together
3. Export main items from index file
4. Co-locate tests with source

### Working with Supabase:
```typescript
import { supabase, demoModeEnabled } from '@/lib/supabase/client'

// Check if in demo mode
if (demoModeEnabled) {
  // Show demo-specific UI
}

// Use supabase client (works in both real and demo mode)
const { data, error } = await supabase.from('table').select()
```

## Architecture Decisions

- **Single-instance deployment** with row-level multi-tenancy
- **Mock-first** approach for demo mode (no backend required)
- **Graceful degradation** (fail-safe, not fail-hard)
- **DRY principle** (use Supabase, ShadCN, battle-tested libs)
- **Progressive enhancement** (works without JS, enhanced with JS)

## Getting Help

- **Setup issues**: See `/docs/documentation/setup.md`
- **Database schema**: See `/docs/specs/database-schema.md`
- **Remaining work**: See `/docs/documentation/remaining-features.md`
- **Build logs**: See `/docs/notes.md`
