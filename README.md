# BYO SaaS Boilerplate v4

> Production-ready, multi-tenant SaaS starter template built with modern web technologies.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0--beta-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green.svg)](https://supabase.com/)

## Features

### Core

- ⚡ **Vite 5** - Lightning-fast build tool and dev server
- ⚛️ **React 18** - Modern React with hooks and concurrent features
- 📘 **TypeScript** - Full type safety with strict mode
- 🎨 **TailwindCSS v4** - Utility-first CSS with Oxide engine
- 🧩 **ShadCN UI** - Beautiful, accessible component library
- 🔐 **Supabase** - Backend as a Service (PostgreSQL, Auth, Storage, Realtime)

### Features

- 🏢 **Multi-Tenancy** - Row-level security with organization workspaces
- 🔒 **Authentication** - Email/password, OAuth, magic links via Supabase
- 🛡️ **RBAC** - Dual role system (platform + organization)
- 🎭 **Demo Mode** - 3-tier graceful degradation for offline development
- 🧪 **Testing** - Vitest + Playwright with coverage enforcement
- 📝 **TypeScript** - Strict mode enabled, full type safety
- 🎯 **ESLint v9** - Latest flat config with React rules
- 💅 **Prettier** - Consistent code formatting
- 🐶 **Husky** - Pre-commit hooks for quality gates
- 🚀 **CI/CD Ready** - GitHub Actions + Vercel deployment

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Supabase account** (optional - demo mode works without it)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/byo-saas-boilerplate.git
cd byo-saas-boilerplate
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials (or leave empty for demo mode):

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Start development server**

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## Demo Mode

The application supports a **3-tier demo mode system** for development without backend:

### 1. Auto-Fallback (Default)

If Supabase credentials are missing, the app automatically uses a mock client:

```bash
# No .env file needed!
npm run dev
```

Click "Demo Login" on the login page to access the app.

### 2. Environment Variable

Force demo mode even with valid credentials:

```env
VITE_DEMO_MODE=true
```

### 3. Admin Toggle (Future)

Platform admins can enable demo mode via `system_settings` table.

## Project Structure

```
/src
  /components
    /ui/                # Base UI components (Button, Input, Card)
    /layout/            # Layout components (AppLayout)
    /features/          # Feature-specific components (DemoModeBanner, ErrorBoundary)
  /features/            # Feature modules
    /auth/              # Authentication (Login, Signup, AuthContext)
    /dashboard/         # Main dashboard
    /settings/          # User settings
    /landing/           # Landing page
  /lib/
    /supabase/          # Supabase client + mock
    /logger/            # Custom logger
    /utils/             # Utilities (cn helper)
  /types/               # TypeScript types
  /test/                # Test setup
/docs/                  # Documentation
  /specs/               # Database schema, API specs
  /documentation/       # Technical docs
/public/                # Static assets
```

## Available Scripts

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # TypeScript type checking
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run unit tests (Vitest)
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests (Playwright)
```

## Database Setup

### Local Development with Supabase

1. **Install Supabase CLI**

```bash
npm install -g supabase
```

2. **Initialize Supabase**

```bash
supabase init
```

3. **Start local Supabase**

```bash
supabase start
```

4. **Create migration**

```bash
supabase migration new initial_schema
```

Copy the SQL from `/docs/specs/database-schema.md` into the migration file.

5. **Apply migrations**

```bash
supabase db push
```

6. **Generate TypeScript types**

```bash
supabase gen types typescript --local > src/types/database.types.ts
```

### Production (Supabase Cloud)

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Update `.env` with your credentials
4. Push migrations:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

## Authentication

### Sign Up

```typescript
import { useAuth } from '@/features/auth/AuthContext'

const { signUp } = useAuth()
await signUp(email, password)
```

### Sign In

```typescript
const { signIn } = useAuth()
await signIn(email, password)
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'

<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

## Multi-Tenancy

### Organizations

- Users can belong to multiple organizations
- Each organization has isolated data (via RLS)
- Roles: owner, admin, member, viewer

### Creating an Organization

```typescript
const { data, error } = await supabase
  .from('organizations')
  .insert({ name: 'My Org', slug: 'my-org' })
  .select()
  .single()
```

### Adding Members

```typescript
const { data, error } = await supabase
  .from('organization_members')
  .insert({
    organization_id: orgId,
    user_id: userId,
    role: 'member'
  })
```

See `/docs/specs/database-schema.md` for complete schema.

## Styling

### TailwindCSS

Use utility classes:

```tsx
<div className="flex items-center gap-4 p-6 rounded-lg border bg-card">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>
```

### Custom Classes

Use the `cn()` helper for conditional classes:

```typescript
import { cn } from '@/lib/utils/cn'

<button
  className={cn(
    'base-classes',
    isActive && 'active-classes',
    className
  )}
>
```

### Theme

Customize colors in `src/index.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  /* ... */
}
```

## Testing

### Unit Tests (Vitest)

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

Run tests:

```bash
npm run test
npm run test:coverage
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test'

test('user can sign in', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  await page.fill('input[type="email"]', 'demo@example.com')
  await page.fill('input[type="password"]', 'demo123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/.*dashboard/)
})
```

Run E2E tests:

```bash
npm run test:e2e
npm run test:e2e:ui  # with UI
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### Manual Build

```bash
npm run build
```

Deploy the `dist/` folder to any static host (Netlify, Cloudflare Pages, etc.)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | No* | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No* | Supabase anon key |
| `VITE_DEMO_MODE` | No | Force demo mode (`true`/`false`) |
| `VITE_APP_NAME` | No | Application name |
| `VITE_APP_URL` | No | Application URL |

*Required for production, optional for demo mode

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - AI assistant context
- **[Database Schema](./docs/specs/database-schema.md)** - Complete schema documentation
- **[Notes](./docs/notes.md)** - Development notes and issues
- **[Prompt](./prompt-v4.md)** - Original specification

## Tech Stack

### Core

- [React 18](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite 5](https://vitejs.dev/) - Build tool
- [React Router v6](https://reactrouter.com/) - Routing

### Styling

- [TailwindCSS v4](https://tailwindcss.com/) - Utility CSS
- [ShadCN UI](https://ui.shadcn.com/) - Component library (patterns)

### Backend

- [Supabase](https://supabase.com/) - BaaS (PostgreSQL, Auth, Storage, Realtime)

### Forms & Validation

- [react-hook-form](https://react-hook-form.com/) - Form management
- [Zod](https://zod.dev/) - Schema validation

### Testing

- [Vitest](https://vitest.dev/) - Unit testing
- [Playwright](https://playwright.dev/) - E2E testing
- [Testing Library](https://testing-library.com/) - React testing utilities

### Code Quality

- [ESLint v9](https://eslint.org/) - Linting (flat config)
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks

## Architecture Principles

### DRY (Don't Repeat Yourself)

- Use Supabase built-in features (don't reinvent auth)
- Use ShadCN patterns (don't rebuild components)
- Leverage battle-tested libraries

### TDD-Ready

- Coverage thresholds configured (30% overall, >80% critical paths)
- Pre-commit hooks block low coverage
- Co-located tests

### Graceful Degradation

- Demo mode when services unavailable
- Clear user communication
- Never crash on missing config

### Feature-Based Structure

- Organize by feature, not file type
- Keep related code together
- Co-locate tests with source

## Roadmap

- [ ] Admin dashboard
- [ ] Organization management UI
- [ ] Member invitation flow
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] API documentation
- [ ] Mobile app (React Native)
- [ ] Dark mode toggle

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/byo-saas-boilerplate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/byo-saas-boilerplate/discussions)
- **Email**: support@example.com

## Acknowledgments

- [Supabase](https://supabase.com/) for amazing BaaS
- [ShadCN](https://ui.shadcn.com/) for component inspiration
- [Vite](https://vitejs.dev/) for blazing-fast DX
- The React community

---

**Built with ❤️ using React, TypeScript, and Supabase**
