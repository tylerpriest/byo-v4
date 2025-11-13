# BYO v4 Implementation Plan

**Project:** Build Your Own SaaS Boilerplate v4
**Date Created:** 2025-11-13
**Status:** In Progress

---

## Master Status Tracking

| Phase | Name | Status | Notes |
|-------|------|--------|-------|
| 0 | Project Foundation | 🔄 In Progress | Creating implementation plan |
| 1 | Core Stack Setup | 📋 Not Started | Vite + React + TypeScript |
| 2 | Development Tools | 📋 Not Started | ESLint, Prettier, Husky |
| 3 | Styling & UI Foundation | 📋 Not Started | TailwindCSS v4 + ShadCN |
| 4 | Supabase Integration | 📋 Not Started | Client setup + demo mode |
| 5 | Database Schema | 📋 Not Started | Multi-tenancy + RBAC tables |
| 6 | Authentication System | 📋 Not Started | Auth flows + demo login |
| 7 | Authorization (RBAC) | 📋 Not Started | Platform + Org roles |
| 8 | Multi-Tenancy | 📋 Not Started | Organizations + members |
| 9 | Layout Components | 📋 Not Started | Sidebar, header, footer |
| 10 | Public Pages | 📋 Not Started | Landing, login, signup |
| 11 | Authenticated Pages | 📋 Not Started | Dashboard, account, settings |
| 12 | Admin Features | 📋 Not Started | Admin dashboard + controls |
| 13 | Testing Infrastructure | 📋 Not Started | Vitest + Playwright |
| 14 | CI/CD & Deployment | 📋 Not Started | GitHub Actions + Vercel |
| 15 | Final Validation | 📋 Not Started | Validation checklist |

**Phase States:**
- 📋 **Not Started** - Phase has not begun
- 🔄 **In Progress** - Actively working on phase tasks
- ✅ **Implementation Complete** - All tasks finished, awaiting validation
- 🎯 **Tested & Validated** - All success criteria met, phase complete

---

## Phase 0: Project Foundation

**Status:** 🔄 In Progress
**Goal:** Create project structure and implementation plan
**Dependencies:** None

### Tasks
- [x] Create implementation plan document
- [ ] Create /docs/notes.md for session tracking
- [ ] Document MCP installation requirements
- [ ] Create basic .gitignore

### Success Criteria
- ✅ Implementation plan exists with all phases defined
- ⏳ Documentation structure ready
- ⏳ Git repository properly configured

### Deliverables
- `/docs/implementation-plan.md` (this file)
- `/docs/notes.md`
- `.gitignore`

---

## Phase 1: Core Stack Setup

**Status:** 📋 Not Started
**Goal:** Initialize Vite + React 19 + TypeScript project
**Dependencies:** Phase 0

### Tasks
- [ ] Initialize Vite project with React template
- [ ] Configure TypeScript strict mode
- [ ] Set up npm package.json with exact versions
- [ ] Configure vite.config.ts
- [ ] Create basic folder structure (/src, /public, /tests)
- [ ] Test dev server runs

### Tech Versions
- Vite 7.x
- React 19
- TypeScript 5.x (latest)

### Success Criteria
- ✅ `npm run dev` starts successfully
- ✅ TypeScript compilation works
- ✅ Basic React app renders

### Deliverables
- `package.json` with all dependencies
- `vite.config.ts`
- `tsconfig.json`
- Basic `/src` structure

---

## Phase 2: Development Tools

**Status:** 📋 Not Started
**Goal:** Configure code quality and pre-commit hooks
**Dependencies:** Phase 1

### Tasks
- [ ] Install and configure ESLint v9 (flat config)
- [ ] Install and configure Prettier
- [ ] Set up Husky for pre-commit hooks
- [ ] Configure lint-staged
- [ ] Add npm scripts (lint, format, type-check)
- [ ] Test hooks work

### Success Criteria
- ✅ `npm run lint` passes
- ✅ `npm run format` works
- ✅ Pre-commit hooks execute
- ✅ TypeScript strict mode enforced

### Deliverables
- `eslint.config.js` (flat config format)
- `.prettierrc`
- `.husky/` directory
- `lint-staged.config.js`

---

## Phase 3: Styling & UI Foundation

**Status:** 📋 Not Started
**Goal:** Set up TailwindCSS v4 and ShadCN UI
**Dependencies:** Phase 1

### Tasks
- [ ] Install TailwindCSS v4 (Oxide engine)
- [ ] Configure Tailwind with Vite
- [ ] Initialize ShadCN UI
- [ ] Install core ShadCN components (button, card, input, etc.)
- [ ] Set up theming system
- [ ] Test component rendering

### Success Criteria
- ✅ TailwindCSS classes work
- ✅ ShadCN components render correctly
- ✅ Theming system functional
- ✅ Dark mode support ready

### Deliverables
- `tailwind.config.js`
- `src/components/ui/` (ShadCN components)
- `src/lib/utils.ts` (cn helper)
- Theme configuration

---

## Phase 4: Supabase Integration

**Status:** 📋 Not Started
**Goal:** Set up Supabase client with demo mode fallback
**Dependencies:** Phase 1

### Tasks
- [ ] Install @supabase/supabase-js
- [ ] Create Supabase client factory
- [ ] Implement 3-tier demo mode system
- [ ] Create mock Supabase client for demo mode
- [ ] Add environment variable handling
- [ ] Create DemoModeBanner component
- [ ] Test both real and demo modes

### Demo Mode Hierarchy
1. Admin Dashboard Toggle (system_settings table)
2. Environment Variable (VITE_DEMO_MODE=true)
3. Auto-Fallback (missing credentials)

### Success Criteria
- ✅ Real Supabase client works with credentials
- ✅ Demo mode activates automatically without credentials
- ✅ Mock client provides realistic data
- ✅ Demo mode banner displays correctly

### Deliverables
- `src/lib/supabase/client.ts`
- `src/lib/supabase/mock-client.ts`
- `src/components/DemoModeBanner.tsx`
- `src/lib/supabase/types.ts`

---

## Phase 5: Database Schema

**Status:** 📋 Not Started
**Goal:** Design and implement multi-tenant database with RBAC
**Dependencies:** Phase 4

### Tasks
- [ ] Create Supabase project (or document setup steps)
- [ ] Design database schema (ERD)
- [ ] Create migration files
- [ ] Implement tables (users, organizations, members, invitations, etc.)
- [ ] Set up RLS policies
- [ ] Create database types file
- [ ] Add seed data for testing

### Core Tables
- `profiles` (user profiles)
- `organizations` (workspaces)
- `organization_members` (membership + roles)
- `organization_invitations` (invite system)
- `system_roles` (platform-level roles)
- `system_settings` (demo mode, feature flags)

### Success Criteria
- ✅ All tables created with proper relationships
- ✅ RLS policies enforce multi-tenant isolation
- ✅ TypeScript types generated from schema
- ✅ Seed data allows testing

### Deliverables
- `supabase/migrations/` (SQL migration files)
- `src/types/database.types.ts`
- `/docs/specs/database-schema.md`
- Seed data scripts

### Testing Requirements
- Coverage: >80% for RLS policies
- Test multi-tenant data isolation
- Test role-based access

---

## Phase 6: Authentication System

**Status:** 📋 Not Started
**Goal:** Implement complete auth flows with demo mode
**Dependencies:** Phase 4, Phase 5

### Tasks
- [ ] Create auth context and hooks
- [ ] Build login page with demo button
- [ ] Build signup page
- [ ] Build password reset flow
- [ ] Build email verification flow
- [ ] Implement auth state management
- [ ] Add protected route wrapper
- [ ] Test all auth flows

### Auth Features
- Email/password login
- Magic link support
- Demo login buttons (user + admin)
- Password reset
- Email verification
- Session management

### Success Criteria
- ✅ Users can sign up and log in
- ✅ Demo login works for both user and admin
- ✅ Protected routes redirect to login
- ✅ Session persists across page reloads
- ✅ Password reset flow functional

### Deliverables
- `src/features/auth/` (hooks, context, components)
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/pages/ResetPassword.tsx`
- `src/components/ProtectedRoute.tsx`

### Testing Requirements
- Coverage: >80% (critical path)
- Unit tests for auth hooks
- Integration tests for auth flows
- E2E tests for login/signup

---

## Phase 7: Authorization (RBAC)

**Status:** 📋 Not Started
**Goal:** Implement dual-level RBAC system
**Dependencies:** Phase 5, Phase 6

### Tasks
- [ ] Create RBAC types and enums
- [ ] Implement platform role checking
- [ ] Implement organization role checking
- [ ] Create permission hooks
- [ ] Create role guard components
- [ ] Add RLS policies for role enforcement
- [ ] Test role hierarchy

### RBAC Levels
**Platform Roles:** Admin, Developer, Support
**Organization Roles:** Owner, Admin, Member, Viewer

### Success Criteria
- ✅ Platform admins have system-wide access
- ✅ Organization roles enforce workspace access
- ✅ RLS policies block unauthorized queries
- ✅ UI conditionally renders based on permissions

### Deliverables
- `src/features/rbac/` (hooks, guards, types)
- `src/lib/supabase/rls-policies.sql`
- `/docs/specs/rbac-spec.md`

### Testing Requirements
- Coverage: >80% (critical path)
- Test all permission combinations
- Test RLS policy enforcement
- Test role inheritance

---

## Phase 8: Multi-Tenancy

**Status:** 📋 Not Started
**Goal:** Implement organization workspace system
**Dependencies:** Phase 5, Phase 7

### Tasks
- [ ] Create organization management hooks
- [ ] Build organization creation flow
- [ ] Build member invitation system
- [ ] Build member management UI
- [ ] Implement organization switching
- [ ] Add organization settings
- [ ] Test data isolation

### Features
- Create/delete organizations
- Invite members (email + magic link)
- Assign organization roles
- Remove members
- Organization settings
- Organization selector in UI

### Success Criteria
- ✅ Users can create organizations
- ✅ Invitations sent and accepted successfully
- ✅ Members can be assigned roles
- ✅ Data isolation enforced by RLS
- ✅ Organization switching works

### Deliverables
- `src/features/organizations/`
- `src/features/invitations/`
- Organization management UI components

### Testing Requirements
- Coverage: >80% for invitation system
- Test data isolation between orgs
- Test role assignment
- Integration tests for full flow

---

## Phase 9: Layout Components

**Status:** 📋 Not Started
**Goal:** Build reusable layout components
**Dependencies:** Phase 3, Phase 6

### Tasks
- [ ] Install ShadCN sidebar block
- [ ] Create collapsible sidebar component
- [ ] Create header with user menu
- [ ] Create footer component
- [ ] Build main layout wrapper
- [ ] Add responsive behavior
- [ ] Test on mobile/tablet/desktop

### Components
- Sidebar (collapsible, navigation)
- Header (logo, search, notifications, user menu)
- Footer (links, legal, copyright)
- MainLayout (wrapper)

### Success Criteria
- ✅ Sidebar collapses and expands
- ✅ User menu shows account actions
- ✅ Responsive across devices
- ✅ Navigation works correctly

### Deliverables
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/MainLayout.tsx`

---

## Phase 10: Public Pages

**Status:** 📋 Not Started
**Goal:** Create public-facing pages
**Dependencies:** Phase 6, Phase 9

### Tasks
- [ ] Build landing page (marketing)
- [ ] Use ShadCN blocks for landing sections
- [ ] Create login page with demo button
- [ ] Create signup page
- [ ] Create password reset page
- [ ] Add routing setup
- [ ] Test navigation flow

### Pages
- `/` - Landing page
- `/login` - Login (+ demo user button)
- `/signup` - Signup
- `/reset-password` - Password reset
- `/verify-email` - Email verification

### Success Criteria
- ✅ Landing page is visually appealing
- ✅ Auth pages functional
- ✅ Demo login easily accessible
- ✅ Responsive design

### Deliverables
- `src/pages/Landing.tsx`
- `src/pages/Login.tsx`
- `src/pages/Signup.tsx`
- `src/pages/ResetPassword.tsx`
- `src/App.tsx` (routing)

---

## Phase 11: Authenticated Pages

**Status:** 📋 Not Started
**Goal:** Create main user-facing pages
**Dependencies:** Phase 6, Phase 9

### Tasks
- [ ] Build dashboard page (blank canvas)
- [ ] Build account page (profile, security)
- [ ] Build settings page (preferences)
- [ ] Add organization selector to dashboard
- [ ] Implement user profile editing
- [ ] Test protected routing

### Pages
- `/dashboard` - Main workspace
- `/account` - User profile and settings
- `/settings` - App preferences

### Success Criteria
- ✅ Dashboard renders for authenticated users
- ✅ Users can update their profile
- ✅ Settings are persisted
- ✅ Protected routes work

### Deliverables
- `src/pages/Dashboard.tsx`
- `src/pages/Account.tsx`
- `src/pages/Settings.tsx`

---

## Phase 12: Admin Features

**Status:** 📋 Not Started
**Goal:** Build platform admin dashboard and controls
**Dependencies:** Phase 7, Phase 9

### Tasks
- [ ] Build admin dashboard page
- [ ] Create user management UI
- [ ] Add platform role assignment
- [ ] Implement demo mode toggle (admin control)
- [ ] Create system settings panel
- [ ] Add activity monitoring
- [ ] Test admin-only access

### Admin Features
- Admin dashboard (analytics, overview)
- User management (view, edit, assign roles)
- Demo mode toggle (system-wide)
- System settings (feature flags)
- Activity monitoring (audit logs)

### Success Criteria
- ✅ Only platform admins can access
- ✅ Admins can assign platform roles
- ✅ Demo mode toggle works system-wide
- ✅ Activity logs visible
- ✅ Platform admin can login in demo mode

### Deliverables
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/UserManagement.tsx`
- `src/pages/admin/SystemSettings.tsx`
- `src/features/admin/` (hooks, components)

### Testing Requirements
- Coverage: >80% (admin functions)
- Test admin-only access control
- Test role assignment
- Test demo mode toggle

---

## Phase 13: Testing Infrastructure

**Status:** 📋 Not Started
**Goal:** Set up comprehensive testing system
**Dependencies:** All previous phases

### Tasks
- [ ] Install and configure Vitest 4.0
- [ ] Install @testing-library/react
- [ ] Configure test environment
- [ ] Set up coverage reporting
- [ ] Install and configure Playwright
- [ ] Write tests for critical paths
- [ ] Configure pre-commit test hooks
- [ ] Document testing strategy

### Test Setup
- **Unit Tests:** Vitest + Testing Library
- **Integration Tests:** Multi-component flows
- **E2E Tests:** Playwright (auth flows, admin functions)
- **Coverage Targets:** >80% for auth/RBAC/admin, 30% overall

### Success Criteria
- ✅ `npm test` runs all tests
- ✅ Coverage reports generated
- ✅ E2E tests pass
- ✅ Pre-commit hooks enforce coverage

### Deliverables
- `vitest.config.ts`
- `playwright.config.ts`
- Test files co-located with source
- `/tests/e2e/` (E2E test suites)

### Testing Requirements
- Auth flows: >80% coverage
- RBAC: >80% coverage
- Admin functions: >80% coverage
- Overall: 30% target

---

## Phase 14: CI/CD & Deployment

**Status:** 📋 Not Started
**Goal:** Automate testing and deployment
**Dependencies:** Phase 13

### Tasks
- [ ] Create GitHub Actions workflow (PR checks)
- [ ] Create GitHub Actions workflow (deploy)
- [ ] Configure Vercel project
- [ ] Set up environment variables in Vercel
- [ ] Configure Supabase for production
- [ ] Add deployment verification
- [ ] Document deployment process

### CI/CD Pipeline
**On PR:**
- Lint, type check, test
- Coverage report
- Build verification

**On Merge:**
- Deploy to Vercel
- Run smoke tests
- Verify deployment

### Success Criteria
- ✅ PR checks pass automatically
- ✅ Deployment to Vercel works
- ✅ Environment variables configured
- ✅ Production smoke tests pass

### Deliverables
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `vercel.json`
- `/docs/documentation/deployment.md`

---

## Phase 15: Final Validation

**Status:** 📋 Not Started
**Goal:** Complete end-of-build validation checklist
**Dependencies:** All previous phases

### Tasks
- [ ] Run full test suite
- [ ] Run TypeScript type check
- [ ] Run ESLint validation
- [ ] Run production build
- [ ] Test demo mode (auto-fallback)
- [ ] Test demo login buttons
- [ ] Test with real Supabase credentials
- [ ] Check for console errors
- [ ] Verify white screen detection
- [ ] Document any issues

### Validation Checklist
- ✅ Full test suite passes (`npm test`)
- ✅ TypeScript compiles (`npm run type-check`)
- ✅ ESLint passes (`npm run lint`)
- ✅ Production build succeeds (`npm run build`)
- ✅ No console errors on key pages
- ✅ Demo mode works (all 3 tiers)
- ✅ Real mode works with credentials
- ✅ White screen detection passes

### Success Criteria
- ✅ All validation checks pass
- ✅ Application is deployable
- ✅ Documentation is complete
- ✅ Known issues are documented

### Deliverables
- `/docs/notes.md` (session notes)
- Updated documentation
- Final validation report

---

## Human Review Points

Throughout the implementation, human review is required at these critical points:

1. **After Phase 5** - Review database schema and RLS policies (security-critical)
2. **After Phase 7** - Review RBAC implementation (security-critical)
3. **After Phase 12** - Review admin features and controls (security-critical)
4. **After Phase 14** - Review deployment configuration and environment setup
5. **After Phase 15** - Final review before production use

---

## Notes

- This is a **from-scratch build** - no boilerplates used
- Follow the principle: **DRY** (Don't Repeat Yourself) - use Supabase, ShadCN, and battle-tested libraries
- **TDD enforced** for critical paths (auth, RBAC, payments, admin)
- **Demo mode** is a core feature - must work for platform admins
- **MCP installation** recommended early but not blocking for initial build
- Document blockers in `/docs/notes.md` and move forward
- Update this plan's status table as phases complete

---

## Timeline Estimate

Based on AI-assisted development:

- **Phases 0-4:** ~2 hours (foundation + setup)
- **Phases 5-8:** ~4 hours (backend + core features)
- **Phases 9-12:** ~3 hours (UI + pages)
- **Phases 13-15:** ~2 hours (testing + validation)

**Total:** ~11 hours of development time (with AI assistance)

*Actual time may vary based on complexity and human review cycles.*
