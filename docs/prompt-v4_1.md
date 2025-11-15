# BYO (Build Your Own) - SaaS Boilerplate Template v4

**Version:** 4.1
**Date:** 2025-11-15
**Purpose:** Production-ready multi-tenant SaaS starter template

**Changelog (v4.1):**
- Added Environment Variables reference table
- Added Build Phase Sequence with dependencies
- Added Test-First Workflow clarity
- Added ShadCN Block-to-Feature mapping
- Added Supabase Type Generation workflow
- Added Migration workflow with exact commands
- Added Demo Mode implementation details
- Updated validation checklist with exact npm commands

---

## 1. Tech Stack

### Core Framework & Build
- **Vite 7.x** - Build tool and dev server
- **React 19** - UI library with latest features
- **TypeScript** - Strict type safety
- **npm** - Package management

### Styling & UI
- **TailwindCSS v4** - Utility-first CSS (Oxide engine, 10x faster)
- **ShadCN UI** - Component library (Radix UI + Tailwind)
- **ShadCN Blocks** - Pre-built component compositions (dashboard, sidebar, auth)

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL, Auth, Storage, Realtime)
- **Supabase CLI** - Local development and migrations
- **Row Level Security (RLS)** - Database-level authorization

### Authentication & Authorization
- **Supabase Auth** - Email/password, magic links, OAuth
- **Custom RBAC** - Role-Based Access Control
  - **Platform Roles:** Admin, Developer, Support (system-wide)
  - **Organization Roles:** Owner, Admin, Member, Viewer (per-workspace)
  - Database-level enforcement via RLS
  - Permission-based UI rendering

### Multi-Tenancy Architecture
- **Pattern:** Row-level multi-tenancy + single-instance deployment
- **Database Schema:** Organizations, members, invitations
- **Isolation:** RLS policies enforce data separation
- **Scalability:** Single codebase, shared database, horizontal scaling

### Form Management & Validation
- **react-hook-form** - Form state management
- **Zod 4.x** - Schema validation and type inference

### Testing
- **Vitest 4.0** - Unit testing (browser mode, benchmarks, type testing)
- **@testing-library/react** - Component testing
- **Playwright** - E2E testing with AI agents
- **Coverage Targets:**
  - Critical paths (auth, RBAC, payments): >80%
  - Overall project: 30%

### Logging & Error Handling
- **Pino** - Fast JSON logger (browser-compatible)
- **React Error Boundaries** - Graceful error handling
- **ShadCN Toast** - User notifications
- **Optimistic UI** - Immediate feedback with graceful rollback

### Code Quality
- **ESLint v9** - Linting (flat config format)
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks (test enforcement, linting)
- **TypeScript strict mode** - Maximum type safety

### Deployment & CI/CD
- **Vercel** - Hosting and deployment
- **GitHub Actions** - CI/CD pipelines (lint, typecheck, test, deploy)
- **Supabase Project** - Production database

### MCP Ecosystem (Model Context Protocol)
**5 MCPs for AI-assisted development:**
1. **GitHub MCP** - PR/issue management, automation
   - https://github.com/github/github-mcp-server
2. **Vercel MCP** - Deployment automation, preview URLs
   - https://vercel.com/docs/mcp/vercel-mcp
3. **Supabase MCP** - Database operations, migrations
   - https://supabase.com/docs/guides/getting-started/mcp
   - https://github.com/supabase-community/supabase-mcp
4. **ShadCN MCP** - Component generation and management
   - https://ui.shadcn.com/docs/mcp
5. **Playwright MCP** - E2E testing automation
   - https://github.com/microsoft/playwright-mcp

### CLI Tools
**Official command-line interfaces for the tech stack:**
- **Supabase CLI** - https://supabase.com/docs/guides/local-development/cli/getting-started
- **Vercel CLI** - https://vercel.com/docs/cli
- **shadcn/ui CLI** - https://ui.shadcn.com/docs/cli
- **Playwright CLI** - https://playwright.dev/docs/intro
- **Vitest CLI** - https://vitest.dev/guide/

### Version Notes
- **All versions listed are latest stable releases** as of template creation date
- If a version seems unreleased, it's likely already available (trust the prompt)
- Verify `package.json` after initialization to confirm versions
- Technologies are chosen for production readiness, not bleeding edge

### Environment Variables Reference

**Required environment variables for local development and deployment:**

| Variable | Purpose | Example Value | Where to Get | Required |
|----------|---------|---------------|--------------|----------|
| `VITE_SUPABASE_URL` | Supabase project API URL | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API | Yes* |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase Dashboard → Settings → API | Yes* |
| `VITE_DEMO_MODE` | Force enable demo mode | `true` or `false` | Set in `.env.local` manually | No |

**\*Note:** Missing both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` triggers auto-fallback to demo mode.

**Setup:**
```bash
# Create .env.local file
cp .env.example .env.local

# Add your Supabase credentials
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_DEMO_MODE=false  # Optional, defaults to auto-detect
```

**Verification:**
```bash
npm run dev
# Check console for:
# - "✅ Connected to Supabase" (real mode)
# - "⚠️  Running in demo mode" (demo mode)
```

---

## 2. Architecture & Development Principles

### Code Organization
- **Feature-based structure** in `/src/features/`
- Organize by feature, not by file type
- Keep related code together (components, hooks, types, tests)
- Co-locate tests with source code

### DRY Principles (Don't Repeat Yourself)
- **Never reinvent the wheel**
- Use Supabase built-in Auth (don't build custom)
- Use ShadCN blocks and templates (dashboard, auth, landing)
- Share components across features
- Leverage existing battle-tested solutions

### TDD Strategy (Test-Driven Development)
- **TDD-enforced for critical paths:**
  - Authentication: >80% coverage
  - Authorization (RBAC): >80% coverage
  - Payment processing: >80% coverage
  - Admin functions: >80% coverage
- **TDD-ready for everything else:**
  - Business logic: 30% coverage target
  - UI components: Test key interactions
  - Utilities: Test edge cases
- **Pre-commit hooks:** Block commits below coverage thresholds

### Graceful Degradation Pattern
**Philosophy:** Fail-safe, not fail-hard
- System continues with reduced functionality when services unavailable
- Clear communication to users (banners, toasts)
- Never crash on missing config or service failures
- **Examples:**
  - Missing Supabase credentials → Auto demo mode
  - Payment service down → Cache + retry queue
  - Email service down → Log + manual review

### Demo Mode System (3-Tier Hierarchy)
1. **Admin Dashboard Toggle** (highest priority)
   - Runtime control via `system_settings` table
   - Override environment variables
   - Instant enable/disable across entire platform
2. **Environment Variable** (`VITE_DEMO_MODE=true`)
   - Development/staging environments
   - Preview deployments
   - Local testing
3. **Auto-Fallback** (lowest priority)
   - Missing `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY`
   - Automatic mock client activation
   - Zero-config quick start for demos

**Demo Mode Features:**
- Mock Supabase client with realistic data
- Demo login button (one-click access)
- DemoModeBanner component (dismissible warning)
- Console warnings (not errors)
- Fully functional app with simulated backend

**Platform Admin Demo Mode:**
- **Platform admins MUST be able to login during demo mode**
- Mock data includes platform admin role for demo user
- Prevents admin lock-out scenario (can't disable demo mode if locked out)
- **Quick demo login buttons on ALL login pages:**
  - `/login` - Regular user demo login
  - `/admin/login` - Platform admin demo login
- Mock `system_roles` table includes: `demo-user-123` → `platform_admin`
- Ensures admins can test platform features in demo mode

### Demo Mode Implementation Checklist

**File Structure:**
```
/src/lib/
  supabase.ts           # Real Supabase client factory
  supabase-mock.ts      # Mock Supabase client (demo mode)
  supabase-client.ts    # Client selector (real vs mock)

/src/components/
  DemoModeBanner.tsx    # Warning banner component
  DemoLoginButton.tsx   # One-click demo login button
```

**Mock Client Requirements (`src/lib/supabase-mock.ts`):**
- Mock `auth.signInWithPassword()` → Returns demo user with platform_admin role
- Mock `auth.signOut()` → Clears demo session
- Mock `auth.getSession()` → Returns demo session or null
- Mock `.from('organizations').select()` → Returns demo organizations
- Mock `.from('organization_members').select()` → Returns demo memberships
- Mock `.from('system_roles').select()` → Returns `demo-user-123` with `platform_admin`
- Mock `.from('system_settings').select()` → Returns demo mode toggle setting

**Demo Mode Detection (`src/lib/supabase-client.ts`):**
```typescript
// 1. Check admin dashboard toggle (system_settings table)
// 2. Check VITE_DEMO_MODE environment variable
// 3. Check if VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing
// Return: Real client or Mock client
```

**Demo Login Button (`src/components/DemoLoginButton.tsx`):**
- Display on `/login` and `/admin/login` pages
- Label: "Demo Login" (regular) or "Admin Demo Login" (admin page)
- onClick: Call `auth.signInWithPassword('demo@example.com', 'demo')`
- Only visible when demo mode is active

**Demo Mode Banner (`src/components/DemoModeBanner.tsx`):**
- Fixed position at top of app
- Warning icon + "Demo Mode Active - Data is simulated"
- Dismissible (stores preference in localStorage)
- Background: Yellow/orange for visibility
- Only visible when demo mode is active

**Verification Steps:**
```bash
# Test Auto-Fallback
rm .env.local  # Remove Supabase credentials
npm run dev
# Expected: Demo mode banner appears, demo login buttons visible

# Test Demo Login
Click "Demo Login" button
# Expected: Logged in as demo user, dashboard accessible

# Test Admin Demo Login
Click "Admin Demo Login" button on /admin/login
# Expected: Logged in with platform_admin role, admin dashboard accessible

# Test Real Mode
# Add valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local
npm run dev
# Expected: No demo banner, no demo buttons, real Supabase connection
```

**Testing:**
- Unit test: Mock client returns correct demo data
- E2E test: Demo login flow works end-to-end
- E2E test: Admin demo login grants platform_admin access
- E2E test: Demo mode banner appears and is dismissible

### Project Creation
- **Build from scratch** - Don't use existing boilerplates from GitHub
- Understand every piece of the architecture
- Full control and customization
- Learn by building, not by copying

---

## 3. Features & Pages

### Public Pages
- **Landing Page** - Marketing homepage with call-to-action
- **Auth Pages** - Login, signup, password reset, email verification

### Authenticated Pages
- **Dashboard** - Main workspace (blank canvas approach, add your business logic)
- **Account Page** - User profile, settings, security
- **Settings Page** - User preferences, notifications, integrations

### Admin Features (Platform-Wide)
- **Admin Dashboard** - System overview, analytics
- **User Management** - View, edit, assign platform roles
- **Demo Mode Toggle** - System-wide control
- **Activity Monitoring** - Audit logs, user actions
- **System Settings** - Feature flags, maintenance mode, announcements

### Multi-Tenant Features (Organization-Level)
- **Organization Management** - Create, configure, delete workspaces
- **Member Management** - Invite, assign roles, remove members
- **Invitation System** - Email invites with magic links, expiration
- **Organization Settings** - Name, billing, preferences per workspace
- **Organization Dashboard** - Workspace-specific analytics and content

### Layout Components
- **Collapsible Sidebar** - Feature navigation
- **Header** - Top bar with user menu, notifications, search
- **Footer** - Links, legal, copyright

---

## 4. UI/UX Principles

### User Experience
- **Optimistic UI** - Update UI immediately, sync in background
  - Show success state instantly
  - Rollback gracefully on error
  - Display subtle syncing indicator
- **Fail Gracefully** - Never crash, always provide feedback
  - Meaningful error messages
  - Actionable recovery steps
  - Fallback content when data unavailable
- **Loading States** - Skeleton screens, spinners, progress bars
- **Responsive Design** - Mobile-first, tablet, desktop breakpoints

### Component Strategy
- **Use ShadCN components as much as possible**
- Start with ShadCN blocks (pre-built compositions)
- Customize when necessary (theming, variants)
- Maintain consistent design language
- Accessibility built-in (ARIA, keyboard nav)

### ShadCN Block Discovery & Selection

**Philosophy:** Discover available blocks dynamically, evaluate options thoughtfully, and choose the best fit for each feature.

#### Discovery Methods (Choose One)

**1. Interactive CLI (Recommended for browsing):**
```bash
npx shadcn@latest add
# Lists all available blocks interactively
# Use arrow keys to browse, search by typing
# Preview descriptions before selecting
```

**2. ShadCN MCP (Automated discovery):**
```bash
# Use ShadCN MCP to list available blocks
mcp shadcn list blocks

# Add blocks via MCP
mcp shadcn add [block-name]
```

**3. Visual Browse (Best for design review):**
- Visit: https://ui.shadcn.com/blocks
- Browse categories: Dashboard, Sidebar, Login, Settings, etc.
- View live previews and code
- Note block names for CLI installation

---

#### Feature-to-Block Selection Guide

**For each major feature, THINK DEEPLY about which block best serves the use case:**

##### **Admin Dashboard**
**What to look for:**
- Data density: Chart-heavy vs table-focused vs metrics cards
- Layout: Sidebar nav vs top nav vs split-pane
- Complexity: Simple overview vs detailed analytics

**Evaluation criteria:**
- Will admins need to see many data points at once? → Chart-heavy dashboard
- Is navigation more important than data? → Sidebar-focused layout
- Will this scale to 10+ widgets? → Consider grid-based layouts

**Target location:** `/src/features/admin/components/`

##### **App Sidebar (Navigation)**
**What to look for:**
- Collapsible: Icons only vs full labels vs hybrid
- Submenus: Nested navigation vs flat list
- Responsiveness: Mobile drawer vs desktop-only

**Evaluation criteria:**
- How many nav items exist? (5-10 = flat, 10+ = nested)
- Is screen real estate precious? → Collapsible sidebar
- Mobile-first app? → Drawer-based sidebar

**Target location:** `/src/components/layout/`

##### **Login/Auth Pages**
**What to look for:**
- Layout: Centered card vs split-screen vs illustrated
- Complexity: Simple form vs multi-step vs OAuth heavy
- Branding: Minimal vs brand-forward vs image-heavy

**Evaluation criteria:**
- Is this a B2B SaaS (professional) or consumer app? → Affects visual weight
- Do we need to inspire trust? → Consider illustrated/branded layouts
- Mobile conversion critical? → Minimal, focused design

**Target location:** `/src/features/auth/components/`

##### **Settings Page**
**What to look for:**
- Organization: Tabbed vs single-page vs wizard
- Density: Compact forms vs spacious cards vs grouped sections
- Updates: Real-time save vs explicit save button

**Evaluation criteria:**
- How many settings exist? (5-10 = single-page, 10+ = tabbed)
- Are settings grouped logically? → Tab-based organization
- Do users edit frequently? → Consider inline editing patterns

**Target location:** `/src/features/settings/components/`

##### **User Profile/Account**
**What to look for:**
- Edit mode: Inline editing vs modal vs dedicated edit page
- Information density: Avatar + basics vs detailed profile
- Actions: Quick actions visible vs menu-driven

**Evaluation criteria:**
- Is profile central to the app experience? → Detailed, prominent design
- Frequent updates expected? → Inline editing
- Security-focused? → Separate edit flow with confirmation

**Target location:** `/src/features/account/components/`

---

#### Selection Workflow

**For EVERY feature requiring a ShadCN block:**

1. **Discover options:**
   ```bash
   npx shadcn@latest add
   # OR visit https://ui.shadcn.com/blocks
   ```

2. **Think deeply about requirements:**
   - What is the primary user goal for this feature?
   - What data density is needed?
   - How does this fit into the overall app design?
   - What are the mobile vs desktop needs?
   - What accessibility requirements exist?

3. **Evaluate 2-3 block options:**
   - Review code structure and complexity
   - Check responsiveness and accessibility
   - Consider customization effort required
   - Assess fit with existing design language

4. **Make an informed choice:**
   - Document WHY you chose this block (in code comments or docs)
   - Consider trade-offs (e.g., feature-rich but complex vs simple but limited)
   - Use the `frontend-design` skill for customization after selection

5. **Install and integrate:**
   ```bash
   npx shadcn@latest add [chosen-block-name]
   # Follow prompts for customization
   ```

---

#### Integration with Frontend Design Skill

**IMPORTANT:** ShadCN blocks are starting points, not final designs.

- **Use the `frontend-design` skill to customize blocks** after installation
- Blocks provide:
  - Accessible markup (ARIA, keyboard nav)
  - Responsive layout structure
  - Tailwind + Radix UI integration

- **Frontend skill enhances with:**
  - Brand-specific theming
  - Custom animations and interactions
  - Unique visual elements
  - Optimized mobile experiences

**Workflow:**
```
1. Discover & select appropriate ShadCN block
2. Install via CLI: npx shadcn@latest add [block-name]
3. Invoke frontend-design skill for customization
4. Maintain accessibility features from original block
```

---

#### References

- **ShadCN Blocks Gallery:** https://ui.shadcn.com/blocks (browse all available blocks)
- **ShadCN CLI Docs:** https://ui.shadcn.com/docs/cli (installation and usage)
- **ShadCN MCP:** Use for automated block management and discovery

---

## 5. Documentation Strategy

### Documentation Philosophy
- **Documentation as Code** - Version controlled, lives with codebase
- **Progressive Disclosure** - README → CLAUDE.md → detailed docs
- **Living Documentation** - Update docs with code changes
- **Single Source of Truth (SSOT)** - One canonical location per topic

### Documentation Structure
```
/docs/
  /documentation/       # Core technical docs (generated during implementation)
    architecture.md
    auth.md
    rbac.md
    multi-tenancy.md
    testing.md
    deployment.md
    setup.md
  /specs/              # Technical specifications
    database-schema.md  ⭐ REQUIRED (create before coding)
    rbac-spec.md        ⭐ REQUIRED (create before coding)
    api-spec.md         (optional, create if needed)
  /tasks/              # Task management
    /active/           # In progress
    /complete/         # Finished
    /template/         # Templates
    /draft/            # Planned
  notes.md             # Build session log (living document)
```

### Documentation Rules
- **Allowed in root (5 files only):**
  1. `README.md` - Project overview and quick start
  2. `CLAUDE.md` - AI assistant context
  3. `CONTRIBUTING.md` - Contribution guidelines
  4. `CHANGELOG.md` - Version history and release notes
  5. `LICENSE` - Project license
- **All other docs go in `/docs/`** - No exceptions
- **Before creating ANY document:**
  1. Can I update an existing doc? → Update, don't create
  2. Is this SSOT? → Make it canonical
  3. Belongs in root? → Check the 5 allowed files list
  4. What's the lifecycle? → Place in appropriate subdirectory
- **Keep docs clean and organized** - Easy navigation, searchable

### Session Notes
- **Document build conversations in `/docs/notes.md`**
- Record any additions or changes beyond the original prompt
- Track user requests and decisions made during implementation
- Note deviations from the plan with rationale
- Include timestamps and context for future reference
- Use as a living log of the project's evolution

---

## 6. Testing & CI/CD

### Testing Strategy

**Coverage Requirements:**
- **Critical Paths (>80% coverage, enforced):**
  - Authentication flows
  - Authorization (RBAC, RLS policies)
  - Payment processing
  - Admin functions (user management, role assignment)
- **Standard Features (30% coverage, target):**
  - Business logic
  - Form validation
  - Utility functions
- **Optional (test when valuable):**
  - Simple UI components
  - Configuration files
  - Prototypes and spikes

**Test Types:**
- **Unit Tests** - Vitest, co-located with source
- **Integration Tests** - Multi-component interactions
- **E2E Tests** - Playwright, user workflows
- **Smoke Tests** - White screen detection, critical paths
- **Type Tests** - TypeScript compilation, Vitest type testing

**Pre-Commit Hooks (Husky):**
- Run tests, block if coverage drops below thresholds
- Lint and format code
- Type checking
- Commit message validation (conventional commits)

### Test-First Workflow

**For Critical Paths (Auth, RBAC, Payments, Admin) - TDD Required:**
1. **Write test file first**
   - Location: `src/features/[feature]/__tests__/[component].test.ts`
   - Example: `src/features/auth/__tests__/login.test.ts`
2. **Write failing test with expected behavior**
   ```typescript
   describe('Login', () => {
     it('should authenticate user with valid credentials', async () => {
       // Test code here - will fail initially
     });
   });
   ```
3. **Implement feature to make test pass**
   - Write minimal code to satisfy test
   - Refactor for quality
4. **Verify coverage >80%**
   ```bash
   npm test -- --coverage
   # Check coverage report for feature
   ```
5. **Pre-commit hook blocks commits if coverage drops**

**For Standard Features (Forms, Components, Business Logic):**
1. **Build feature first**
   - Implement component or function
   - Manual testing during development
2. **Write tests after (target 30% coverage)**
   - Focus on edge cases and key interactions
   - Don't test trivial code
3. **Refine based on test findings**
   - Fix bugs discovered during test writing
   - Add error handling as needed

**Coverage Enforcement:**
- Pre-commit hook runs: `npm test -- --coverage`
- Critical paths below 80% → Commit blocked
- Overall project below 30% → Commit blocked
- Override only with explicit justification in commit message

### Supabase Type Generation Workflow

**Initial Setup (after database schema is created):**
```bash
# Generate TypeScript types from Supabase schema
npm run supabase:gen

# Output: src/lib/database.types.ts
```

**During Development (after any schema change):**
1. **Create or modify migration**
   ```bash
   supabase migration new add_new_table
   # Edit /supabase/migrations/TIMESTAMP_add_new_table.sql
   ```
2. **Apply migration locally**
   ```bash
   supabase migration up
   ```
3. **Regenerate TypeScript types**
   ```bash
   npm run supabase:gen
   ```
4. **Verify types compile**
   ```bash
   npm run type-check
   # Expect: zero errors
   ```

**Using Generated Types in Components:**
```typescript
import type { Database } from '@/lib/database.types';

// Table row types (existing records)
type User = Database['public']['Tables']['users']['Row'];
type Organization = Database['public']['Tables']['organizations']['Row'];
type Member = Database['public']['Tables']['organization_members']['Row'];

// Insert types (new records)
type OrgInsert = Database['public']['Tables']['organizations']['Insert'];
type MemberInsert = Database['public']['Tables']['organization_members']['Insert'];

// Update types (partial updates)
type OrgUpdate = Database['public']['Tables']['organizations']['Update'];

// Use in components
function UserProfile({ user }: { user: User }) {
  // TypeScript knows exact shape of user
}
```

**NPM Script (add to package.json):**
```json
{
  "scripts": {
    "supabase:gen": "supabase gen types typescript --local > src/lib/database.types.ts"
  }
}
```

**When to Regenerate:**
- ✅ After creating new migration
- ✅ After applying migration locally
- ✅ Before committing schema changes
- ✅ After pulling new migrations from git
- ❌ Not needed if only writing application code (no schema changes)

**CI/CD Integration:**
- GitHub Actions auto-generates types on merge to main
- Verifies types compile before deployment
- Fails build if type errors detected

### CI/CD Pipeline (GitHub Actions)

**On Pull Request:**
- Lint (ESLint)
- Type check (TypeScript)
- Unit tests (Vitest)
- E2E tests (Playwright)
- Coverage report (comment on PR)
- Build verification

**On Merge to Main:**
- All PR checks
- Deploy to Vercel (production)
- Supabase migrations (if any)
- Type generation (`database.types.ts`)
- Smoke tests on production

**Deployment Verification:**
- White screen detection
- Critical user flows working
- Console error monitoring
- Performance metrics baseline

### Playwright Configuration
- **List mode** and **headless mode** for CI
- **Head mode** for local debugging
- Visual automation without full screen takeover
- MCP integration for AI-assisted test generation

### End-of-Build Validation

Before considering the build complete, run through this checklist with **exact commands**:

**Required Checks:**

- ✅ **Full test suite passes**
  ```bash
  npm test
  # Expected output: "✓ X tests passed"
  ```

- ✅ **TypeScript compilation**
  ```bash
  npm run type-check
  # Or: npx tsc --noEmit
  # Expected output: No errors, exit code 0
  ```

- ✅ **ESLint validation**
  ```bash
  npm run lint
  # Expected output: No errors (warnings acceptable)
  ```

- ✅ **Production build succeeds**
  ```bash
  npm run build
  # Expected output: Build completed, dist/ folder created
  # Check: No size warnings, all chunks optimized
  ```

- ✅ **White screen detection**
  ```bash
  npm run dev
  # Manually check these pages render without crashes:
  # - Landing page (/)
  # - Login page (/login)
  # - Dashboard (/dashboard)
  # - Admin dashboard (/admin)
  ```

- ✅ **No console errors**
  ```bash
  # Open browser console (F12) for each page above
  # Expected: No red errors (warnings acceptable)
  ```

- ✅ **Demo mode works**
  ```bash
  # Remove Supabase credentials from .env.local
  rm .env.local  # or comment out VITE_SUPABASE_* vars
  npm run dev
  # Expected:
  # - Demo mode banner appears
  # - Demo login buttons visible on /login and /admin/login
  # - Can login as demo user
  # - Can login as demo admin
  ```

- ✅ **Real mode works**
  ```bash
  # Add valid Supabase credentials to .env.local
  npm run dev
  # Expected:
  # - No demo mode banner
  # - Real Supabase connection
  # - Auth flows work with real backend
  ```

**Optional but Recommended:**

- **E2E tests pass**
  ```bash
  npm run test:e2e
  # Expected: Playwright tests pass
  ```

- **Preview deployment works**
  ```bash
  vercel deploy --prebuilt
  # Or: Push to PR, check Vercel preview URL
  ```

- **Database migrations apply cleanly**
  ```bash
  supabase db reset  # Local test
  # Expected: All migrations apply without errors
  ```

- **Coverage thresholds met**
  ```bash
  npm test -- --coverage
  # Expected:
  # - Critical paths (auth, RBAC): >80%
  # - Overall project: >30%
  ```

**If anything fails:**
- Document the issue in `/docs/notes.md`
- Include:
  - Exact command that failed
  - Full error message
  - Steps attempted to fix
  - Whether it's blocking or can be fixed later

---

## 7. Philosophy & Constraints

### Never Reinvent the Wheel
- **If Supabase offers it, use it:**
  - Authentication → Supabase Auth
  - Database → PostgreSQL with RLS
  - Storage → Supabase Storage
  - Realtime → Supabase Realtime subscriptions
- **If ShadCN has it, use it:**
  - Dashboard → `dashboard` block
  - Sidebar → `sidebar` block
  - Auth → `login` block
  - Forms → Pre-built form components
- **If it's battle-tested, leverage it:**
  - Logging → Pino
  - Validation → Zod
  - Forms → react-hook-form
  - Testing → Vitest + Playwright

**Reference Official Guides:**
- Follow official patterns and best practices when available
- Use documented approaches over custom solutions
- Check official docs before implementing complex features

### Build Fresh (Don't Use Boilerplates)
- **Create this project from scratch**
- No GitHub boilerplates (e.g., vite-react-ts-shadcn-ui)
- Understand every line of code
- Full control over architecture
- Learn patterns, don't copy-paste

### MCP-First Development
- **Install 5 mandatory MCPs early** (Phase 0 or Phase 1)
- Authenticate with services (GitHub, Vercel, Supabase)
- Use MCPs for repetitive tasks:
  - ShadCN MCP for component generation
  - GitHub MCP for PR creation
  - Vercel MCP for deployment
  - Supabase MCP for migrations
  - Playwright MCP for test generation
- **Human input required:** MCP authentication, OAuth approvals

### Graceful Degradation Everywhere
- **Apply the demo mode pattern to all external services:**
  - Supabase → Mock client (implemented)
  - Stripe → Mock payment processor (future)
  - SendGrid → Mock email service (future)
  - S3/Storage → Mock file storage (future)
  - Analytics → Mock tracking (future)
- **Benefits:**
  - Zero-config quick start
  - Demo environments without real services
  - Development without production credentials
  - Testing without external dependencies

### AI-Native Workflow
**Development Flow:**
```
Human: Write spec → Create draft task
  ↓
AI: Read spec + plan + code → Implement + Test + Document
  ↓
Human: Review code + security + business logic
  ↓
Human: Merge → AI archives task
```

**Human focuses on:**
- Requirements and specifications
- Business logic validation
- Security review
- Strategic decisions
- User experience

**AI focuses on:**
- Implementation
- Test writing
- Documentation updates
- Repetitive tasks
- Pattern application

---

## 8. Pre-Implementation Requirements

### Critical Specifications (Create These First)

**Before writing any application code, these two specification documents MUST be created:**

#### 1. `/docs/specs/database-schema.md` ⭐ REQUIRED
**Purpose:** Define the complete database structure for multi-tenant SaaS application

**Must Include:**
- **Tables & Columns:**
  - `users` (extends Supabase Auth)
  - `organizations` (tenant/workspace table)
  - `organization_members` (user-org relationship, role assignment)
  - `organization_invitations` (invite system with expiration)
  - `system_roles` (platform-level RBAC: admin, developer, support)
  - `system_settings` (demo mode toggle, feature flags, maintenance mode)
  - Any additional feature-specific tables
- **Data Types:** PostgreSQL types for each column (uuid, text, timestamptz, jsonb, etc.)
- **Relationships:** Foreign keys, cascade rules, indexes
- **Row Level Security (RLS) Policies:**
  - Multi-tenant isolation (users only see their org's data)
  - Platform admin override (can see all orgs)
  - Organization role enforcement (owner/admin/member/viewer permissions)
  - Public vs authenticated access
- **Indexes:** Performance optimization for common queries
- **Sample Data Structure:** Example rows for each table
- **Migration Strategy:** Initial schema + versioning approach

**Why Critical:**
- Enables TypeScript type generation (`database.types.ts`)
- Defines RLS policies for security enforcement
- Required for Supabase client queries
- Foundation for all features (auth, orgs, admin)

**Template Structure:**
```markdown
# Database Schema Specification

## Overview
[Multi-tenant architecture description]

## Tables

### users (Supabase Auth)
[Column definitions, notes on auth.users extension]

### organizations
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | Organization ID |
| name | text | NOT NULL | Org name |
| ... | ... | ... | ... |

[Repeat for all tables]

## Relationships
[Foreign key diagram/description]

## RLS Policies
### organizations table
- Policy: `org_isolation`
  - SQL: `CREATE POLICY org_isolation ON organizations FOR SELECT USING (...)`
  - Purpose: Users only see orgs they belong to

[All RLS policies defined]

## Indexes
[Performance indexes]

## Sample Data
[JSON examples of related records]
```

---

#### 2. `/docs/specs/rbac-spec.md` ⭐ REQUIRED
**Purpose:** Define the dual-role permission system (platform + organization roles)

**Must Include:**
- **Platform Roles:** Admin, Developer, Support (system-wide)
- **Organization Roles:** Owner, Admin, Member, Viewer (per-workspace)
- **Permission Matrix:** Table showing what each role can do
- **Role Assignment Logic:** How roles are granted/revoked
- **RLS Integration:** How roles are checked in database policies
- **UI Rendering Rules:** What each role sees in the interface
- **Edge Cases:** Role conflicts, inheritance, defaults

**Why Critical:**
- Prevents security vulnerabilities (broken access control)
- Clarifies authorization logic before implementation
- Guides RLS policy creation
- Defines UI conditional rendering
- Critical path requiring >80% test coverage

**Template Structure:**
```markdown
# RBAC Specification

## Role Hierarchy

### Platform Roles (System-Wide)
- **Admin:** Full platform control
- **Developer:** Technical access, no user management
- **Support:** Read-only, customer assistance

### Organization Roles (Per-Workspace)
- **Owner:** Full org control, billing, delete org
- **Admin:** Manage members, settings (no delete org)
- **Member:** Access org resources, collaborate
- **Viewer:** Read-only access

## Permission Matrix

| Action | Platform Admin | Org Owner | Org Admin | Org Member | Viewer |
|--------|----------------|-----------|-----------|------------|--------|
| Create Organization | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Organization | ✅ | ✅ | ❌ | ❌ | ❌ |
| Invite Members | ✅ | ✅ | ✅ | ❌ | ❌ |
| Remove Members | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign Org Roles | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Org Data | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Org Data | ✅ | ✅ | ✅ | ✅ | ❌ |
| Access Admin Dashboard | ✅ | ❌ | ❌ | ❌ | ❌ |
| Toggle Demo Mode | ✅ | ❌ | ❌ | ❌ | ❌ |

[Add all application actions]

## Implementation Details
[How roles are checked in code, RLS policies, UI conditionals]

## Edge Cases
- User with multiple org roles (different orgs)
- Platform admin also org member
- Role inheritance and defaults
```

---

### Migration Workflow

**Complete workflow for database schema changes:**

#### Before Any Database Changes:
1. **Define schema in `/docs/specs/database-schema.md`**
   - Document table structure, columns, types
   - Define RLS policies
   - Specify foreign keys and indexes

2. **Create numbered migration file:**
   ```bash
   supabase migration new add_organizations_table
   # Creates: /supabase/migrations/YYYYMMDDHHMMSS_add_organizations_table.sql
   ```

3. **Write SQL in migration file:**
   ```sql
   -- /supabase/migrations/YYYYMMDDHHMMSS_add_organizations_table.sql

   CREATE TABLE organizations (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     created_at timestamptz DEFAULT now(),
     updated_at timestamptz DEFAULT now()
   );

   -- RLS Policies
   ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "org_isolation" ON organizations
     FOR SELECT USING (
       id IN (
         SELECT organization_id FROM organization_members
         WHERE user_id = auth.uid()
       )
     );

   -- Indexes
   CREATE INDEX idx_organizations_created_at ON organizations(created_at DESC);
   ```

4. **Apply migration locally:**
   ```bash
   supabase migration up
   # Expected: Migration applied successfully
   ```

5. **Verify migration applied:**
   ```bash
   supabase db diff
   # Expected: No differences (migration is clean)
   ```

6. **Generate TypeScript types:**
   ```bash
   npm run supabase:gen
   # Updates: src/lib/database.types.ts
   ```

7. **Verify types compile:**
   ```bash
   npm run type-check
   # Expected: Zero TypeScript errors
   ```

#### In Production (CI/CD):
- **Automated on merge to main:**
  - GitHub Actions runs: `supabase db push`
  - Migrations auto-apply to production database
  - Types regenerated and committed
  - Build fails if migration errors occur

- **Verify in Supabase Dashboard after deploy:**
  - Check Tables → Confirm new table exists
  - Check Policies → Confirm RLS policies active
  - Check Indexes → Confirm performance indexes created

#### Rollback (Development Only):
```bash
# DANGER: Destroys local database and reapplies all migrations
supabase db reset

# Production migrations are PERMANENT - cannot rollback
# Plan migrations carefully before merging to main
```

#### Migration Best Practices:
- ✅ Always include RLS policies in migration
- ✅ Create indexes for foreign keys and frequent queries
- ✅ Test migration locally before pushing to production
- ✅ Write idempotent migrations when possible (`CREATE IF NOT EXISTS`)
- ❌ Never edit existing migrations after they're merged
- ❌ Never run `supabase db reset` on production

---

### Documentation Generation Strategy

**Create upfront (before coding):**
- `/docs/specs/database-schema.md` ✅ REQUIRED
- `/docs/specs/rbac-spec.md` ✅ REQUIRED

**Generate during implementation:**
- `/docs/documentation/setup.md` - Created as project is initialized
- `/docs/documentation/architecture.md` - Documented as features are built
- `/docs/documentation/testing.md` - Written as test infrastructure is added
- `/docs/documentation/deployment.md` - Created during CI/CD setup
- `/docs/notes.md` - Living log throughout the build session

**Why this order:**
- Schema and RBAC are foundational (everything depends on them)
- Other docs emerge naturally from actual implementation
- Prevents premature documentation of non-existent code
- Allows implementation details to inform documentation

---

## 9. Summary

### Build Phases (In Order)

**Clear dependency graph for implementation:**

#### Phase 0: Specifications & Planning (REQUIRED FIRST)
**Status:** BLOCKING - Must complete before Phase 1
- Create `/docs/specs/database-schema.md` (collaborate with user)
- Create `/docs/specs/rbac-spec.md` (collaborate with user)
- Review and finalize both specs
- **Output:** Complete schema + permission matrix

#### Phase 1: Project Setup
**Dependencies:** Phase 0 complete
- Initialize Vite + React + TypeScript
  ```bash
  npm create vite@latest byo-v4 -- --template react-ts
  ```
- Install core dependencies (Tailwind, ShadCN, Supabase, Vitest)
- Configure ESLint v9 + Prettier + Husky
- Set up Supabase CLI and local development
  ```bash
  supabase init
  ```
- Install and authenticate 5 MCPs (GitHub, Vercel, Supabase, ShadCN, Playwright)
- Create `.env.example` with required variables
- **Output:** Working dev environment, MCP ecosystem ready

#### Phase 2: Database & Auth Foundation
**Dependencies:** Phase 1 complete, database-schema.md finalized
- Create initial migration from schema spec
  ```bash
  supabase migration new initial_schema
  ```
- Write SQL for all tables (users, organizations, members, invitations, system_roles, system_settings)
- Write RLS policies for all tables
- Apply migration locally: `supabase migration up`
- Generate TypeScript types: `npm run supabase:gen`
- Implement Supabase client (real + mock for demo mode)
- Build demo mode infrastructure (mock client, banner, demo login)
- Implement auth flows (login, signup, logout, password reset)
- Write TDD tests for auth (>80% coverage required)
- **Output:** Auth system works in both real and demo mode

#### Phase 3: RBAC & Multi-Tenancy
**Dependencies:** Phase 2 complete, rbac-spec.md finalized
- Implement platform roles (Admin, Developer, Support)
- Implement organization roles (Owner, Admin, Member, Viewer)
- Create authorization hooks (`useAuth`, `usePermissions`, `useRole`)
- Build organization management (create, read, update, delete)
- Build member management (invite, assign roles, remove)
- Build invitation system (email invites, magic links, expiration)
- Write TDD tests for RBAC (>80% coverage required)
- **Output:** Multi-tenant system with dual RBAC working

#### Phase 4: Core Features & UI
**Dependencies:** Phase 3 complete
- Install ShadCN blocks (dashboard, sidebar, login, settings, profile)
- Build public pages (landing page, auth pages)
- Build authenticated pages (dashboard, account, settings)
- Build layout components (sidebar, header, footer)
- Build organization features (org dashboard, org settings)
- Implement optimistic UI patterns
- Add loading states and error handling
- Write tests for business logic (30% coverage target)
- **Output:** Functional SaaS app with core features

#### Phase 5: Admin Dashboard & Platform Features
**Dependencies:** Phase 4 complete
- Build admin dashboard (system overview, analytics)
- Build user management (view users, assign platform roles)
- Build demo mode toggle (admin control in system_settings)
- Build activity monitoring (audit logs, user actions)
- Build system settings (feature flags, maintenance mode)
- Write TDD tests for admin functions (>80% coverage required)
- **Output:** Platform admin can manage entire system

#### Phase 6: Testing & Quality
**Dependencies:** Phase 5 complete
- Review all test coverage (critical paths >80%, overall >30%)
- Set up Playwright E2E tests (auth flow, org flow, admin flow)
- Configure Husky pre-commit hooks (test, lint, type-check)
- Run full validation checklist (see End-of-Build Validation)
- Fix any failing tests or quality issues
- **Output:** High-quality, well-tested codebase

#### Phase 7: CI/CD & Deployment
**Dependencies:** Phase 6 complete
- Set up GitHub Actions workflows (lint, test, build, deploy)
- Configure Vercel deployment (production + preview)
- Set up Supabase production project
- Configure production environment variables
- Test deployment pipeline (PR → merge → deploy)
- Run smoke tests on production
- **Output:** Automated CI/CD pipeline, app deployed to Vercel

### Execution Instructions

**For Claude Code:**
0. **CREATE REQUIRED SPECIFICATIONS FIRST** ⭐ (Before any code)
   - Create `/docs/specs/database-schema.md` with complete schema, RLS policies, and relationships
   - Create `/docs/specs/rbac-spec.md` with permission matrix and role definitions
   - These are BLOCKING requirements - cannot proceed without them
   - Collaborate with user to finalize both specs before writing application code

1. **Follow build phases in order** (Phase 0 → Phase 7)
   - Do not skip phases or work out of order
   - Each phase depends on previous phases being complete
   - Use TodoWrite tool to track progress within each phase

2. **Follow this entire prompt and build until you have a useable app**
   - This is not just a planning document
   - Implement all features described
   - Create a functional, deployable application

3. **If blocked on something:**
   - Document the blocker in `/docs/notes.md`
   - Include what was attempted and why it failed
   - Move on to other tasks within the same phase, don't get stuck

4. **Document this build session:**
   - Record conversation highlights in `/docs/notes.md`
   - Note any user requests or modifications to the prompt
   - Track decisions made during implementation

5. **Complete the validation checklist:**
   - Run all checks in "End-of-Build Validation" section
   - Fix critical issues before marking complete
   - Document any non-critical issues for later

**Build Goal:** A working SaaS application that can be deployed and used immediately.

---

This is a **production-ready, multi-tenant SaaS boilerplate** designed for speed and quality:

### What You Get
- **Modern Tech Stack** - React 19, Vite 7, TypeScript, TailwindCSS v4, Vitest 4.0
- **Complete Auth System** - Supabase Auth with demo mode fallback
- **Multi-Tenancy** - Row-level isolation, organization workspaces
- **Dual RBAC** - Platform roles + organization roles
- **Admin Dashboard** - User management, system controls
- **Testing Infrastructure** - TDD-ready, 30% coverage target, pre-commit hooks
- **MCP Ecosystem** - AI-assisted development with 5 integrated tools
- **Demo Mode** - 3-tier system for zero-config demos
- **CI/CD Pipeline** - Automated testing, deployment, verification
- **Documentation** - Living docs, AI-friendly format

### Philosophy
- **DRY:** Never reinvent what exists (Supabase, ShadCN, battle-tested libraries)
- **TDD:** Enforce testing where it matters (auth, RBAC, payments)
- **Graceful Degradation:** Fail-safe, not fail-hard
- **AI-Native:** MCP-first, spec-driven, human review
- **Production-Ready:** Not a toy project, ready for real users

### Use Case
Perfect for building:
- B2B SaaS platforms
- Multi-tenant applications
- Workspace collaboration tools
- Project management systems
- CRM/ERP systems
- Any app with organizations + members

### Getting Started
Give this prompt to Claude Code in plan mode. Claude will:
1. **Create required specifications** (database-schema.md, rbac-spec.md)
2. Set up MCP ecosystem
3. Initialize project with latest versions
4. Implement features based on this spec
5. Create tests and documentation
6. Configure CI/CD
7. Deploy to Vercel

### Implementation Tracking
Follow the Build Phases (Phase 0-7) outlined above with status tracking via TodoWrite tool.

**This is a template.** Customize the business logic in the dashboard and build your unique SaaS product on this solid foundation.
