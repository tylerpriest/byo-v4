# BYO v4 - Multi-Tenant SaaS Boilerplate

A production-ready, fully-featured SaaS boilerplate with multi-tenancy, RBAC, and demo mode built from scratch.

## Features

### 🎯 Core Capabilities
- **Multi-Tenant Architecture** - Row-level isolation with organization workspaces
- **Dual RBAC System** - Platform roles (Admin/Developer/Support) + Organization roles (Owner/Admin/Member/Viewer)
- **Demo Mode** - 3-tier system: Admin toggle → Env var → Auto-fallback
- **Complete Auth System** - Login, signup, password reset with Supabase Auth
- **Organization Management** - Create, manage, invite members, assign roles
- **Protected Routes** - Role-based access control at route level
- **Form Validation** - react-hook-form + Zod with real-time validation
- **Type Safety** - Full TypeScript with strict mode, auto-generated database types

### 🛠 Tech Stack

**Framework & Build:**
- Vite 7 + React 19 + TypeScript
- TailwindCSS v4 (Oxide engine)
- npm package management

**Backend & Database:**
- Supabase (PostgreSQL + Auth + Storage + Realtime)
- Row Level Security (RLS) policies
- Auto-generated TypeScript types

**State & Forms:**
- react-hook-form for form state
- Zod 4 for schema validation
- React Context for auth state

**Testing:**
- Vitest 4.0 for unit tests
- @testing-library/react for component tests
- Playwright for E2E tests
- Coverage targets: Critical paths >80%, Overall >30%

**Code Quality:**
- ESLint v9 (flat config)
- Prettier for formatting
- Husky for pre-commit hooks
- Strict TypeScript

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- (Optional) Supabase account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd byo-v4

# Install dependencies
npm install

# Run in demo mode (no Supabase needed)
npm run dev

# Visit http://localhost:5173
```

**Demo Mode** automatically enables when Supabase credentials are missing. Click "Demo Login" to access the app as a platform admin.

### Connecting to Supabase (Production)

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Add your Supabase credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_DEMO_MODE=false
   ```
4. Apply database migrations:
   ```bash
   npx supabase db push
   ```
5. Restart dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
byo-v4/
├── docs/                          # Documentation
│   ├── specs/                     # Technical specifications
│   │   ├── database-schema.md     # Complete database schema with RLS
│   │   └── rbac-spec.md           # RBAC permission matrix
│   └── notes.md                   # Build session notes
├── src/
│   ├── features/                  # Feature-based organization
│   │   ├── auth/                  # Authentication
│   │   │   ├── components/        # ProtectedRoute
│   │   │   ├── context/           # AuthContext
│   │   │   ├── hooks/             # useAuth, usePermissions
│   │   │   └── pages/             # Login, Signup, AdminLogin
│   │   ├── organizations/         # Multi-tenancy
│   │   │   ├── hooks/             # useOrganizations, useMembers
│   │   │   ├── pages/             # Organization list & detail
│   │   │   └── types/             # TypeScript types
│   │   ├── admin/                 # Platform admin features
│   │   ├── dashboard/             # User dashboard
│   │   └── landing/               # Public landing page
│   ├── components/                # Shared components
│   │   ├── DemoModeBanner.tsx     # Demo mode warning
│   │   └── DemoLoginButton.tsx    # One-click demo login
│   ├── lib/                       # Core libraries
│   │   ├── supabase.ts            # Real Supabase client
│   │   ├── supabase-mock.ts       # Mock client for demo mode
│   │   ├── supabase-client.ts     # Client selector
│   │   └── database.types.ts      # Auto-generated DB types
│   └── test/                      # Test configuration
├── supabase/
│   ├── config.toml                # Supabase configuration
│   └── migrations/                # Database migrations
└── package.json                   # Dependencies & scripts
```

## Available Scripts

```bash
# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm run preview            # Preview production build

# Testing
npm test                   # Run unit tests
npm run test:coverage      # Run tests with coverage
npm run test:e2e           # Run E2E tests (Playwright)

# Code Quality
npm run lint               # Lint with ESLint
npm run type-check         # TypeScript type checking

# Database
npm run supabase:gen       # Generate TypeScript types from schema
```

## Database Schema

7 tables with comprehensive RLS policies:

- **user_profiles** - User profile data (extends auth.users)
- **organizations** - Multi-tenant workspaces
- **organization_members** - User-org relationships with roles
- **organization_invitations** - Email invites with magic links
- **system_roles** - Platform-level roles (admin/developer/support)
- **system_settings** - Platform configuration (demo mode, feature flags)
- **audit_logs** - Activity tracking for compliance

See `docs/specs/database-schema.md` for complete schema with SQL.

## RBAC System

### Platform Roles (System-Wide)
- **platform_admin** - Full platform control
- **platform_developer** - Technical access, read-only
- **platform_support** - Customer support, read-only

### Organization Roles (Per-Workspace)
- **owner** - Full organization control including billing and deletion
- **admin** - Manage members, settings (cannot delete org)
- **member** - Standard access, can create/edit resources
- **viewer** - Read-only access

See `docs/specs/rbac-spec.md` for complete permission matrix.

## Demo Mode

Demo mode enables the app to run without Supabase credentials:

### 3-Tier Detection
1. **Admin Dashboard Toggle** (highest priority) - Runtime control via system_settings
2. **Environment Variable** - `VITE_DEMO_MODE=true` in .env.local
3. **Auto-Fallback** - Missing or invalid Supabase credentials

### Demo Mode Features
- Mock Supabase client with realistic data
- Demo user has `platform_admin` role
- One-click demo login buttons on all auth pages
- Dismissible warning banner
- Fully functional app with simulated backend

### Testing Demo Mode
```bash
# Remove Supabase credentials
rm .env.local

# Start dev server
npm run dev

# App auto-enables demo mode
# Click "Demo Login" button to access
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```
4. Deploy

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | No* | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No* | Supabase anonymous key |
| `VITE_DEMO_MODE` | No | Force enable demo mode (`true`/`false`) |

*Required for production, optional for demo mode

## Testing

### Coverage Requirements
- **Critical paths** (auth, RBAC, admin): **>80% coverage**
- **Overall project**: **>30% coverage**
- Pre-commit hooks enforce coverage thresholds

### Running Tests
```bash
# Unit tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Watch mode
npm test -- --watch
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and type-check: `npm test && npm run type-check`
4. Commit with descriptive message
5. Push and create a pull request

## License

MIT License - See LICENSE file for details

## Architecture Decisions

### Why Build from Scratch?
- Full control over architecture
- Understand every piece of code
- No bloat from unused boilerplate features
- Learn patterns instead of copying

### Why Supabase?
- Complete backend solution (auth + database + storage)
- Row Level Security for multi-tenancy
- Real-time subscriptions out of the box
- Generous free tier
- Auto-generated TypeScript types

### Why Demo Mode?
- Zero-config quick start for demos
- Development without production credentials
- Test features without external dependencies
- Show potential clients without real data

### Why Dual RBAC?
- Platform roles for system administration
- Organization roles for workspace management
- Clear separation of concerns
- Flexible permission model

## Support & Documentation

- **Full Specs**: See `docs/specs/` for detailed technical specifications
- **Database Schema**: `docs/specs/database-schema.md`
- **RBAC Details**: `docs/specs/rbac-spec.md`
- **Build Notes**: `docs/notes.md`

## Roadmap

- [x] Phase 0: Complete specifications
- [x] Phase 1: Project setup and configuration
- [x] Phase 2: Database schema and authentication
- [x] Phase 3: Organization management and RBAC
- [ ] Phase 4: Enhanced UI with ShadCN components
- [ ] Phase 5: Admin dashboard features
- [ ] Phase 6: Comprehensive testing
- [ ] Phase 7: CI/CD and deployment automation

---

**Built with ❤️ using modern web technologies**
