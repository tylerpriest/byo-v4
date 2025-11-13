# CLAUDE.md - AI Assistant Context

This file provides context for AI assistants (Claude, GitHub Copilot, etc.) working with this codebase.

## Project Overview

**BYO SaaS Boilerplate** - A production-ready, multi-tenant SaaS starter template built with modern web technologies.

## Architecture

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite 5
- **Styling**: TailwindCSS v4 (beta) + ShadCN UI components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Routing**: React Router v6
- **Forms**: react-hook-form + Zod
- **Testing**: Vitest + Playwright
- **Linting**: ESLint v9 (flat config) + Prettier

### Project Structure

```
/src
  /components
    /ui                 # Base UI components (Button, Input, Card, etc.)
    /layout            # Layout components (AppLayout)
    /features          # Feature-specific components (DemoModeBanner, ErrorBoundary)
  /features            # Feature modules (auth, dashboard, settings)
    /auth              # Authentication (LoginPage, SignupPage, AuthContext)
    /dashboard         # Main dashboard
    /settings          # User settings
    /landing           # Landing page
  /lib
    /supabase          # Supabase client + demo mode mock
    /logger            # Custom console logger
    /utils             # Utility functions (cn helper)
  /types               # TypeScript type definitions
  /test                # Test setup files
  /hooks               # (Future) Custom React hooks
/docs                  # Documentation
  /specs               # Technical specifications
  /documentation       # Core technical docs
  /tasks               # Task management
/public                # Static assets
```

### Key Features

1. **Demo Mode System** (3-tier hierarchy)
   - Admin toggle (via system_settings table)
   - Environment variable (VITE_DEMO_MODE=true)
   - Auto-fallback (missing Supabase credentials)
   - Mock Supabase client for offline development

2. **Authentication**
   - Supabase Auth integration
   - Email/password sign in/up
   - Password reset
   - Protected routes
   - Auth state management with React Context

3. **Multi-Tenancy** (Row-level)
   - Organizations (workspaces)
   - Organization members with roles
   - Invitation system
   - Row Level Security (RLS) policies

4. **RBAC (Role-Based Access Control)**
   - Platform roles: admin, developer, support
   - Organization roles: owner, admin, member, viewer
   - Database-level enforcement

5. **Error Handling**
   - React Error Boundaries
   - Custom logger
   - Graceful degradation

## Code Conventions

### TypeScript

- **Strict mode enabled** - All type safety features on
- **No implicit any** - Explicit types required
- Use `type` for props, `interface` for object shapes
- Prefer `React.FC` alternatives (explicit children)

### React

- **Functional components only**
- Use hooks (useState, useEffect, useContext, etc.)
- Custom hooks in `/src/hooks/` (prefix with `use`)
- Component files use PascalCase (e.g., `LoginPage.tsx`)
- One component per file (except small related components)

### Styling

- **TailwindCSS utility classes**
- Use `cn()` helper for conditional classes
- CSS custom properties in `src/index.css`
- Follow ShadCN UI patterns
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)

### File Naming

- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- Types: `camelCase.types.ts` or `types.ts`
- Tests: `*.test.tsx` (co-located with source)

### Imports

```typescript
// Absolute imports using @ alias
import { Button } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
```

## Common Patterns

### Creating a New Feature

1. Create directory in `/src/features/[feature-name]`
2. Add page components (e.g., `FeaturePage.tsx`)
3. Add context if needed (e.g., `FeatureContext.tsx`)
4. Add hooks if needed (e.g., `useFeature.ts`)
5. Update router in `src/AppRouter.tsx`
6. Add tests (`*.test.tsx`)

### Creating a New UI Component

1. Create file in `/src/components/ui/ComponentName.tsx`
2. Use `React.forwardRef` for ref forwarding
3. Accept className prop for customization
4. Use `cn()` helper for class merging
5. Export from `/src/components/ui/index.ts`

Example:
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary'
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-classes', variantClasses[variant], className)}
        {...props}
      />
    )
  }
)

Component.displayName = 'Component'

export { Component }
```

### Adding a Protected Route

```typescript
// In AppRouter.tsx
<Route
  path="/new-page"
  element={
    <ProtectedRoute>
      <AppLayout>
        <NewPage />
      </AppLayout>
    </ProtectedRoute>
  }
/>
```

### Using Supabase

```typescript
import { supabase } from '@/lib/supabase'

// Auth
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Database
const { data, error } = await supabase
  .from('organizations')
  .select('*')
  .eq('id', orgId)
  .single()
```

### Logging

```typescript
import logger from '@/lib/logger'

logger.debug('Debug message', { data })
logger.info('Info message', { user })
logger.warn('Warning message', { issue })
logger.error('Error message', { error })
```

## Environment Variables

```env
# Required for production (optional for demo mode)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional
VITE_DEMO_MODE=true  # Force demo mode
VITE_APP_NAME=BYO SaaS
VITE_APP_URL=http://localhost:5173
```

## Scripts

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint
npm run format      # Prettier formatting
npm run test        # Run Vitest tests
npm run test:e2e    # Run Playwright E2E tests
```

## Database Schema

See `/docs/specs/database-schema.md` for complete schema documentation.

Key tables:
- `profiles` - User profiles
- `organizations` - Multi-tenant workspaces
- `organization_members` - Member roles
- `invitations` - Email invitations
- `system_settings` - Platform settings

## Testing

- **Unit tests**: Vitest with React Testing Library
- **E2E tests**: Playwright
- **Coverage target**: 30% overall, >80% for auth/RBAC
- Co-locate tests with source files

Example test:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

## Known Issues & Notes

### Version Adjustments

Using stable versions instead of bleeding-edge:
- React 18 (not 19) - v19 not stable yet
- Vite 5 (not 7) - v7 not released
- Vitest 2 (not 4) - v4 not released

See `/docs/notes.md` for detailed notes.

### Custom Logger

Replaced Pino with custom logger due to browser compatibility issues. See `src/lib/logger/index.ts`.

### TailwindCSS v4 Beta

Using beta version. Some syntax differs from v3. See `src/index.css` for custom property usage.

## Future TODOs

- [ ] Add RBAC permission checks to UI
- [ ] Implement organization management pages
- [ ] Add member invitation flow
- [ ] Create admin dashboard
- [ ] Add E2E tests
- [ ] Set up CI/CD pipeline
- [ ] Add Playwright tests
- [ ] Implement payment system
- [ ] Add analytics
- [ ] Set up monitoring

## Getting Help

1. Check `/docs/` for documentation
2. Review `/docs/notes.md` for known issues
3. See database schema in `/docs/specs/database-schema.md`
4. Review original prompt in `prompt-v4.md`

## Contributing

When adding features:
1. Follow existing patterns
2. Add TypeScript types
3. Write tests (if critical path)
4. Update documentation
5. Run `npm run typecheck && npm run lint && npm run build`
6. Format with `npm run format`
