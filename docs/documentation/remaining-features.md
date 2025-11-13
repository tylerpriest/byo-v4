# Remaining Features to Implement

This document outlines the features from the original prompt that haven't been implemented yet, organized by priority and complexity.

## Implementation Status Legend

- ✅ **Completed** - Fully implemented and tested
- 🚧 **In Progress** - Partially implemented
- 📋 **Planned** - Documented, ready to implement
- 💡 **Nice to Have** - Optional enhancement

---

## Foundation (✅ Completed)

### Infrastructure
- ✅ Vite 7 setup
- ✅ React 19
- ✅ TypeScript (strict mode)
- ✅ TailwindCSS v4
- ✅ ESLint v9 (flat config)
- ✅ Prettier
- ✅ Husky pre-commit hooks
- ✅ Vitest 4.0 configuration

### Core Systems
- ✅ Supabase client setup
- ✅ Demo mode (3-tier system)
- ✅ Mock Supabase client
- ✅ Pino logger
- ✅ Auth context and hooks
- ✅ Protected routes
- ✅ Environment variable handling

### Basic Pages
- ✅ Landing page
- ✅ Login page (with demo buttons)
- ✅ Dashboard page (basic)
- ✅ Demo mode banner component

---

## High Priority (📋 Planned)

### Database & Backend
**Effort**: Medium | **Priority**: Critical

- [ ] Apply database schema from `/docs/specs/database-schema.md`
- [ ] Set up Row Level Security (RLS) policies
- [ ] Test RLS policies thoroughly
- [ ] Generate TypeScript types from schema
- [ ] Update mock client to match real schema

**Files to Create**:
- Supabase migration files
- Updated `src/lib/supabase/types.ts` with generated types
- RLS policy tests

---

### RBAC System (Role-Based Access Control)
**Effort**: Medium | **Priority**: Critical

Implement dual RBAC system (platform + organization roles).

**Platform Roles**:
- Platform Admin (full system access)
- Developer (debugging, logs)
- Support (user assistance)

**Organization Roles**:
- Owner (full org access)
- Admin (manage members, billing)
- Member (standard access)
- Viewer (read-only)

**Tasks**:
- [ ] Create RBAC hooks (`usePermissions`, `useRole`)
- [ ] Implement permission checking utilities
- [ ] Add role-based UI rendering
- [ ] Create admin-only routes
- [ ] Test permission boundaries

**Files to Create**:
- `src/features/rbac/hooks/usePermissions.ts`
- `src/features/rbac/hooks/useRole.ts`
- `src/features/rbac/utils/permissions.ts`
- `src/features/rbac/components/Can.tsx` (permission wrapper)
- `src/features/rbac/rbac.test.ts` (>80% coverage)

---

### Organization Management
**Effort**: Medium | **Priority**: High

Multi-tenant organization features.

**Features**:
- Create new organization
- Update organization details
- Delete organization
- View organization list
- Switch between organizations
- Organization settings page

**Tasks**:
- [ ] Create organization context
- [ ] Build organization CRUD operations
- [ ] Add organization selector component
- [ ] Create organization settings page
- [ ] Implement organization switching
- [ ] Add organization validation

**Files to Create**:
- `src/features/organizations/OrganizationContext.tsx`
- `src/features/organizations/hooks/useOrganization.ts`
- `src/features/organizations/components/OrganizationSelector.tsx`
- `src/pages/OrganizationSettings.tsx`
- `src/features/organizations/api/` (CRUD functions)

---

### Member Management & Invitations
**Effort**: Medium | **Priority**: High

Invite and manage organization members.

**Features**:
- Invite members via email
- Accept/decline invitations
- View pending invitations
- Remove members
- Update member roles
- Invitation expiration
- Magic link authentication

**Tasks**:
- [ ] Build invitation system
- [ ] Create invitation email templates (Supabase)
- [ ] Add member list component
- [ ] Create invitation acceptance flow
- [ ] Add role assignment UI
- [ ] Implement expiration handling

**Files to Create**:
- `src/features/members/components/MemberList.tsx`
- `src/features/members/components/InviteModal.tsx`
- `src/pages/InvitationsPage.tsx`
- `src/features/members/api/invitations.ts`
- Email templates in Supabase

---

### Admin Dashboard
**Effort**: Medium | **Priority**: High

Platform-wide administration features.

**Features**:
- System overview (users, orgs, activity)
- User management (view, edit, assign platform roles)
- Demo mode toggle (admin override)
- Activity logs
- System settings
- Analytics dashboard

**Tasks**:
- [ ] Create admin layout
- [ ] Build user management page
- [ ] Add platform role assignment
- [ ] Implement demo mode toggle
- [ ] Create activity log viewer
- [ ] Add system settings page
- [ ] Build analytics dashboard

**Files to Create**:
- `src/features/admin/layouts/AdminLayout.tsx`
- `src/pages/admin/UsersPage.tsx`
- `src/pages/admin/SystemSettings.tsx`
- `src/pages/admin/ActivityLogs.tsx`
- `src/pages/admin/AnalyticsPage.tsx`
- `src/features/admin/components/DemoModeToggle.tsx`

---

## Medium Priority (📋 Planned)

### User Settings & Profile
**Effort**: Low | **Priority**: Medium

User preferences and account management.

**Features**:
- Update profile (name, avatar)
- Change email
- Change password
- Email preferences
- Notification settings
- Security settings (2FA)

**Tasks**:
- [ ] Create settings page
- [ ] Build profile update form
- [ ] Add password change flow
- [ ] Create notification preferences
- [ ] Add avatar upload

**Files to Create**:
- `src/pages/SettingsPage.tsx`
- `src/features/settings/components/ProfileSection.tsx`
- `src/features/settings/components/SecuritySection.tsx`
- `src/features/settings/components/NotificationsSection.tsx`

---

### Account Page
**Effort**: Low | **Priority**: Medium

View account details and manage subscription.

**Features**:
- Account overview
- Subscription details
- Billing history
- Payment methods
- Cancel subscription

**Tasks**:
- [ ] Create account page
- [ ] Display user information
- [ ] Show subscription status
- [ ] List organizations
- [ ] Add delete account flow

**Files to Create**:
- `src/pages/AccountPage.tsx`
- `src/features/account/components/AccountOverview.tsx`

---

### Layout Components
**Effort**: Medium | **Priority**: Medium

Improve UI consistency and navigation.

**Tasks**:
- [ ] Create collapsible sidebar (ShadCN sidebar-07)
- [ ] Build header component
- [ ] Add footer component
- [ ] Create navigation menu
- [ ] Add breadcrumbs
- [ ] Build responsive mobile menu

**Files to Create**:
- `src/components/layouts/Sidebar.tsx`
- `src/components/layouts/Header.tsx`
- `src/components/layouts/Footer.tsx`
- `src/components/layouts/MainLayout.tsx`

---

### Testing Suite
**Effort**: High | **Priority**: High

Comprehensive testing for critical paths (>80% coverage).

**Critical Path Tests** (>80% coverage):
- [ ] Authentication flow tests
- [ ] RBAC permission tests
- [ ] RLS policy tests
- [ ] Payment flow tests (when implemented)
- [ ] Admin function tests

**Standard Tests** (30% coverage):
- [ ] Component tests
- [ ] Utility function tests
- [ ] Hook tests
- [ ] Form validation tests

**E2E Tests**:
- [ ] User signup/login flow
- [ ] Organization creation
- [ ] Member invitation
- [ ] Admin workflows

**Tasks**:
- [ ] Write auth tests
- [ ] Write RBAC tests
- [ ] Configure Playwright
- [ ] Write E2E test suite
- [ ] Set up coverage reporting
- [ ] Add tests to CI/CD

**Files to Create**:
- `src/features/auth/auth.test.ts`
- `src/features/rbac/rbac.test.ts`
- `tests/e2e/auth.spec.ts`
- `tests/e2e/organizations.spec.ts`

---

### CI/CD Pipeline
**Effort**: Low | **Priority**: Medium

Automated testing and deployment.

**GitHub Actions Workflows**:
- [ ] Lint and type check on PR
- [ ] Run unit tests on PR
- [ ] Run E2E tests on PR
- [ ] Post coverage report to PR
- [ ] Deploy to Vercel on merge to main
- [ ] Run database migrations on deploy
- [ ] Smoke tests on production

**Tasks**:
- [ ] Create GitHub Actions workflows
- [ ] Set up test database for CI
- [ ] Configure Vercel integration
- [ ] Add deployment verification

**Files to Create**:
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/test.yml`

---

## Low Priority (💡 Nice to Have)

### Signup Page
**Effort**: Low | **Priority**: Low

Currently using login page for both. Can create separate signup page.

**Tasks**:
- [ ] Create dedicated signup page
- [ ] Add signup form validation
- [ ] Show terms of service
- [ ] Add social login options

---

### Error Boundaries
**Effort**: Low | **Priority**: Medium

Graceful error handling in React.

**Tasks**:
- [ ] Create global error boundary
- [ ] Add feature-specific boundaries
- [ ] Build error fallback UI
- [ ] Log errors to service (Sentry, etc.)

**Files to Create**:
- `src/components/ErrorBoundary.tsx`
- `src/pages/ErrorPage.tsx`

---

### Loading States & Skeleton Screens
**Effort**: Medium | **Priority**: Low

Improve perceived performance.

**Tasks**:
- [ ] Create skeleton components
- [ ] Add loading states to all async operations
- [ ] Build suspense boundaries
- [ ] Add optimistic UI patterns

**Files to Create**:
- `src/components/skeletons/`
- `src/hooks/useOptimistic.ts`

---

### Signup Page
**Effort**: Low | **Priority**: Optional

Separate signup flow from login.

**Tasks**:
- [ ] Create SignupPage component
- [ ] Add terms of service acceptance
- [ ] Implement OAuth providers
- [ ] Add email verification UI

---

## Future Enhancements (💡 Ideas)

### Payments & Subscriptions
**Effort**: High | **Priority**: Future

Integration with Stripe or similar.

**Features**:
- Subscription plans
- Payment processing
- Billing portal
- Usage tracking
- Invoices

---

### Email Service
**Effort**: Medium | **Priority**: Future

Transactional emails beyond auth.

**Features**:
- Welcome emails
- Invitation emails (custom templates)
- Notification emails
- Marketing emails

---

### File Upload & Storage
**Effort**: Medium | **Priority**: Future

Using Supabase Storage.

**Features**:
- Avatar uploads
- Document uploads
- File management
- Public/private buckets

---

### Analytics & Reporting
**Effort**: Medium | **Priority**: Future

Usage analytics and insights.

**Features**:
- User activity tracking
- Organization metrics
- Custom reports
- Export capabilities

---

### Real-time Features
**Effort**: Medium | **Priority**: Future

Using Supabase Realtime.

**Features**:
- Live collaboration
- Real-time notifications
- Presence indicators
- Live updates

---

### Search Functionality
**Effort**: Medium | **Priority**: Future

Full-text search across platform.

**Features**:
- Global search
- Filtered search
- Search suggestions
- Recent searches

---

## Implementation Strategy

### Phase 1: Core Backend (Week 1-2)
1. Apply database schema
2. Test RLS policies
3. Generate TypeScript types
4. Update mock client

### Phase 2: RBAC & Organizations (Week 2-3)
1. Implement RBAC system
2. Build organization management
3. Create member invitations
4. Add tests (>80% coverage)

### Phase 3: Admin & Settings (Week 3-4)
1. Build admin dashboard
2. Create user settings
3. Add account page
4. Implement demo mode toggle

### Phase 4: Polish & Testing (Week 4-5)
1. Add layout components
2. Improve loading states
3. Write comprehensive tests
4. Set up CI/CD

### Phase 5: Optional Features (Week 5+)
1. Add email templates
2. Implement file uploads
3. Build analytics
4. Add real-time features

## Getting Started

To start implementing features:

1. **Pick a feature** from High Priority section
2. **Read the spec** in `/docs/specs/` (if exists)
3. **Create branch**: `git checkout -b feature/feature-name`
4. **Implement feature** following structure in `/src/features/`
5. **Write tests** (especially for critical paths)
6. **Update documentation**
7. **Create pull request**

## Testing Requirements

Remember the testing strategy from the prompt:

- **Critical Paths** (>80% coverage, ENFORCED):
  - Authentication
  - Authorization (RBAC, RLS)
  - Payment processing
  - Admin functions

- **Standard Features** (30% coverage, TARGET):
  - Business logic
  - UI components
  - Utility functions

Pre-commit hooks will block commits below coverage thresholds for critical paths.

## Questions?

- Check `/docs/specs/database-schema.md` for database structure
- See `/docs/documentation/setup.md` for environment setup
- Read `CLAUDE.md` for project overview and patterns
- Review `/docs/notes.md` for build decisions

## Contributing

When implementing features:

1. Follow existing patterns in the codebase
2. Use TypeScript strictly
3. Write tests for critical paths
4. Update documentation
5. Test in demo mode first
6. Keep changes focused and small
7. Request review before merging
