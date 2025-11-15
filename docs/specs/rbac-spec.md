# RBAC Specification (Role-Based Access Control)

**Project:** BYO (Build Your Own) - SaaS Boilerplate v4
**Version:** 1.0
**Date:** 2025-11-15
**Purpose:** Dual-role permission system for platform and organization-level authorization

---

## Overview

This application implements a **dual-role RBAC system**:

1. **Platform Roles** (System-Wide) - Grant access to administrative features across the entire platform
2. **Organization Roles** (Per-Workspace) - Grant access to resources within a specific organization

**Key Principles:**
- A user can have ONE platform role (or none)
- A user can have DIFFERENT organization roles in DIFFERENT organizations
- Platform roles DO NOT automatically grant organization access (explicit membership required)
- Platform admins CAN override organization restrictions for system management
- Roles are enforced at THREE levels: Database (RLS), Backend (API), Frontend (UI rendering)

---

## Role Hierarchy

### Platform Roles (System-Wide)

Stored in `system_roles` table. One role per user, globally applied.

#### **1. Platform Admin (`platform_admin`)**

**Purpose:** Full platform control - god mode for system management

**Capabilities:**
- View all organizations, users, and data (RLS override)
- Assign/revoke platform roles to any user
- Toggle demo mode globally
- Access admin dashboard
- View and export audit logs (all organizations)
- Modify system settings (maintenance mode, feature flags)
- Manage user accounts (suspend, delete, verify)
- Access support tools (impersonate users, debug sessions)

**Cannot:**
- Automatically become owner of organizations (must be explicitly added as member)
- Bypass billing restrictions (billing is organization-level)

**Use Cases:**
- System administrators
- DevOps team members
- Security team for auditing

---

#### **2. Platform Developer (`platform_developer`)**

**Purpose:** Technical access for development and debugging (no user management)

**Capabilities:**
- View database schema and migrations
- Access API documentation and playground
- View system logs and error reports
- Access developer tools (GraphQL playground, API explorer)
- View feature flag status (cannot modify)
- View system health metrics

**Cannot:**
- Modify system settings
- Assign platform roles
- Access user management features
- Toggle demo mode
- View audit logs (security restriction)
- Impersonate users

**Use Cases:**
- Backend engineers
- DevOps for debugging (read-only)
- External contractors with technical access

---

#### **3. Platform Support (`platform_support`)**

**Purpose:** Customer support access (read-only, assist users)

**Capabilities:**
- View user profiles (for support tickets)
- View organization details (for troubleshooting)
- Access support dashboard (ticket queue, user search)
- View user activity logs (limited to support context)
- Generate reports for support tickets

**Cannot:**
- Modify any data (strictly read-only)
- Assign roles
- Delete users or organizations
- Access admin dashboard
- Toggle system settings
- Impersonate users (view only)

**Use Cases:**
- Customer support agents
- Community managers
- External support contractors

---

### Organization Roles (Per-Workspace)

Stored in `organization_members` table. Users can have different roles in different organizations.

#### **1. Owner (`owner`)**

**Purpose:** Complete control over the organization (highest authority within workspace)

**Capabilities:**
- **All Admin capabilities PLUS:**
- Delete organization (permanent, cannot be undone)
- Transfer ownership to another member
- Manage billing and subscription
- Cancel subscription
- Export all organization data
- View billing history and invoices

**Cannot:**
- Access other organizations' data (unless explicitly member)
- Access platform admin features (unless also platform_admin)

**Constraints:**
- Each organization has exactly ONE owner
- Owner cannot leave organization (must transfer ownership first)
- Owner cannot downgrade own role (must transfer first)
- First person to create organization automatically becomes owner

**Use Cases:**
- Founder of the workspace
- Primary account holder
- Billing contact

---

#### **2. Admin (`admin`)**

**Purpose:** Manage organization and members (cannot delete org or manage billing)

**Capabilities:**
- Invite new members (any role except owner)
- Remove members (except owner)
- Change member roles (except owner)
- Revoke pending invitations
- Modify organization settings (name, avatar, preferences)
- View organization analytics
- Manage organization resources (projects, datasets, etc.)
- View member activity logs (within organization)

**Cannot:**
- Delete organization
- Transfer ownership
- Manage billing/subscription
- Change owner's role
- Remove owner
- Promote self to owner

**Use Cases:**
- Team leads
- Project managers
- Trusted power users

---

#### **3. Member (`member`)**

**Purpose:** Standard collaborator with read-write access to organization resources

**Capabilities:**
- View organization data
- Create, edit, delete own resources (projects, items, etc.)
- Collaborate with other members (comments, mentions)
- View other members' profiles
- Access organization dashboard
- Receive notifications for organization activity

**Cannot:**
- Invite new members
- Remove any members
- Change organization settings
- Assign roles
- View billing information
- Access admin features

**Use Cases:**
- Regular team members
- Contributors
- Freelancers with editing access

---

#### **4. Viewer (`viewer`)**

**Purpose:** Read-only access to organization (can view but not edit)

**Capabilities:**
- View organization data (read-only)
- View other members' profiles
- Access organization dashboard (read-only)
- Export own view of data (if allowed by settings)

**Cannot:**
- Create, edit, or delete any resources
- Invite members
- Comment or collaborate (view only)
- Change any settings
- Assign roles

**Use Cases:**
- Stakeholders (executives, clients)
- Auditors
- External reviewers
- Contractors with view-only access

---

## Permission Matrix

### Organization-Level Actions

| Action | Platform Admin* | Owner | Admin | Member | Viewer |
|--------|----------------|-------|-------|--------|--------|
| **Organization Management** |
| Create Organization | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Organization | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit Organization Settings | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete Organization | ✅ | ✅ | ❌ | ❌ | ❌ |
| Transfer Ownership | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Member Management** |
| Invite Members | ✅ | ✅ | ✅ | ❌ | ❌ |
| Remove Members | ✅ | ✅ | ✅ | ❌ | ❌ |
| Assign Org Roles | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Members List | ✅ | ✅ | ✅ | ✅ | ✅ |
| Remove Owner | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Invitation Management** |
| Create Invitation | ✅ | ✅ | ✅ | ❌ | ❌ |
| Revoke Invitation | ✅ | ✅ | ✅ | ❌ | ❌ |
| View Pending Invitations | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Data & Resources** |
| View Organization Data | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Resources | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Own Resources | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Others' Resources | ✅ | ✅ | ✅ | ✅** | ❌ |
| Delete Resources | ✅ | ✅ | ✅ | ✅*** | ❌ |
| Export Organization Data | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Billing (Organization-Level)** |
| View Billing Info | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Subscription | ✅ | ✅ | ❌ | ❌ | ❌ |
| Update Payment Method | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Invoices | ✅ | ✅ | ❌ | ❌ | ❌ |

**Notes:**
- *Platform Admin requires explicit organization membership to perform actions (except view/delete org)
- **Members can edit resources based on resource-level permissions (future: per-resource ACLs)
- ***Members can only delete own resources (not others')

---

### Platform-Level Actions

| Action | Platform Admin | Platform Developer | Platform Support | Regular User |
|--------|----------------|-------------------|-----------------|--------------|
| **User Management** |
| View All Users | ✅ | ❌ | ✅ (read-only) | ❌ |
| Assign Platform Roles | ✅ | ❌ | ❌ | ❌ |
| Revoke Platform Roles | ✅ | ❌ | ❌ | ❌ |
| Suspend User Account | ✅ | ❌ | ❌ | ❌ |
| Delete User Account | ✅ | ❌ | ❌ | ❌ |
| Impersonate User | ✅ | ❌ | ❌ | ❌ |
| **System Settings** |
| Toggle Demo Mode | ✅ | ❌ | ❌ | ❌ |
| Enable Maintenance Mode | ✅ | ❌ | ❌ | ❌ |
| Modify Feature Flags | ✅ | ❌ | ❌ | ❌ |
| View System Settings | ✅ | ✅ (read-only) | ❌ | ❌ |
| **Admin Dashboard** |
| Access Admin Dashboard | ✅ | ❌ | ❌ | ❌ |
| View System Analytics | ✅ | ❌ | ❌ | ❌ |
| View All Organizations | ✅ | ❌ | ✅ (read-only) | ❌ |
| **Audit & Logs** |
| View Audit Logs (All Orgs) | ✅ | ❌ | ❌ | ❌ |
| Export Audit Logs | ✅ | ❌ | ❌ | ❌ |
| View System Logs | ✅ | ✅ | ❌ | ❌ |
| View Error Reports | ✅ | ✅ | ❌ | ❌ |
| **Developer Tools** |
| Access API Playground | ✅ | ✅ | ❌ | ❌ |
| View Database Schema | ✅ | ✅ | ❌ | ❌ |
| Run Migrations | ✅ | ❌ | ❌ | ❌ |

---

## Role Assignment Logic

### Platform Roles

**Assignment:**
- Only `platform_admin` can assign platform roles
- Assigned via `system_roles` table insert
- One role per user (UNIQUE constraint on `user_id`)
- Updating role requires DELETE old + INSERT new

**Revocation:**
- Only `platform_admin` can revoke
- DELETE from `system_roles` table
- User loses platform privileges immediately (RLS policies enforce)

**Default:**
- New users have NO platform role by default
- First user in production can be promoted manually via Supabase SQL editor

**Edge Cases:**
- Cannot revoke own `platform_admin` role (prevent lock-out)
- Deleting user account cascades to `system_roles` (ON DELETE CASCADE)

---

### Organization Roles

**Assignment:**
- `owner` and `admin` can invite members with roles
- Invitations created in `organization_invitations` table
- Upon acceptance, `organization_members` row created
- First person to create org automatically becomes `owner`

**Role Changes:**
- `owner` and `admin` can change member roles
- UPDATE `organization_members.role`
- Cannot change `owner` role (only via ownership transfer)

**Revocation:**
- `owner` and `admin` can remove members
- DELETE from `organization_members`
- User loses access to organization immediately

**Ownership Transfer:**
- Only `owner` can transfer ownership
- Atomic operation: new owner = owner, old owner = admin
- Prevents organization from having no owner

**Defaults:**
- New members invited with default role specified in invitation
- Owner cannot be invited (only assigned via transfer)

**Edge Cases:**
- Owner cannot remove self (must transfer ownership first)
- Owner cannot downgrade own role (must transfer first)
- Deleting organization cascades to members and invitations (ON DELETE CASCADE)
- User can be member of multiple orgs with different roles

---

## RLS Integration

### Database-Level Enforcement

All authorization is enforced at the database via RLS policies (see `database-schema.md`).

**Example: Organization isolation**
```sql
-- Users can only SELECT organizations they belong to
CREATE POLICY "org_member_view" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Platform admins can view ALL organizations
CREATE POLICY "platform_admins_all_access" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );
```

**Permission Checks in RLS:**
1. Check if user has `platform_admin` role → Grant full access
2. Check if user is member of organization → Grant based on org role
3. Otherwise → Deny access

**Performance:** RLS policies are indexed (on `user_id`, `organization_id`, `role`) for fast evaluation.

---

## UI Rendering Rules

### Conditional Rendering Based on Roles

**Philosophy:** Hide UI elements users cannot interact with (don't show buttons for forbidden actions).

#### Platform Admin UI

**Show when `user.systemRole === 'platform_admin'`:**
- "Admin Dashboard" link in main navigation
- "Manage Users" button in admin area
- "Toggle Demo Mode" switch in system settings
- "View Audit Logs" button
- "Impersonate User" button (in user management)

#### Organization Owner/Admin UI

**Show when `user.orgRole === 'owner' || user.orgRole === 'admin'`:**
- "Invite Members" button
- "Manage Members" page link
- "Organization Settings" page link
- Member role dropdown (for role changes)
- "Remove Member" button

**Show ONLY for owner (`user.orgRole === 'owner'`):**
- "Delete Organization" button (with confirmation modal)
- "Transfer Ownership" option
- "Billing & Subscription" page link

#### Organization Member UI

**Show when `user.orgRole === 'member'`:**
- "Create" buttons (new project, new item, etc.)
- "Edit" buttons on own resources
- "Delete" buttons on own resources

**Hide:**
- "Invite Members" button
- "Organization Settings" link
- Member management UI

#### Organization Viewer UI

**Show when `user.orgRole === 'viewer'`:**
- Read-only views of all pages
- "Export" button (if allowed by org settings)

**Hide:**
- All "Create", "Edit", "Delete" buttons
- Invite and member management UI
- Settings pages

---

### Permission Check Utilities

**Frontend Hooks:**

```typescript
// usePermissions.ts
export function usePermissions(organizationId?: string) {
  const { user } = useAuth();

  return {
    // Platform-level
    isPlatformAdmin: user?.systemRole === 'platform_admin',
    isPlatformDeveloper: user?.systemRole === 'platform_developer',
    isPlatformSupport: user?.systemRole === 'platform_support',

    // Organization-level (requires organizationId)
    isOrgOwner: user?.orgRole(organizationId) === 'owner',
    isOrgAdmin: user?.orgRole(organizationId) === 'admin',
    isOrgMember: user?.orgRole(organizationId) === 'member',
    isOrgViewer: user?.orgRole(organizationId) === 'viewer',

    // Composite checks
    canInviteMembers: ['owner', 'admin'].includes(user?.orgRole(organizationId)),
    canManageOrg: ['owner', 'admin'].includes(user?.orgRole(organizationId)),
    canDeleteOrg: user?.orgRole(organizationId) === 'owner' || user?.systemRole === 'platform_admin',
    canViewAdminDashboard: user?.systemRole === 'platform_admin',

    // Resource-level (example)
    canEditResource: (resource) => {
      if (user?.systemRole === 'platform_admin') return true;
      if (user?.orgRole(organizationId) === 'viewer') return false;
      if (resource.createdBy === user?.id) return true;
      return ['owner', 'admin'].includes(user?.orgRole(organizationId));
    }
  };
}
```

**Usage in Components:**
```tsx
function OrganizationSettings({ orgId }: Props) {
  const { canManageOrg, isOrgOwner } = usePermissions(orgId);

  if (!canManageOrg) {
    return <AccessDenied />;
  }

  return (
    <div>
      <h1>Organization Settings</h1>
      {/* ... settings form ... */}

      {isOrgOwner && (
        <DangerZone>
          <Button onClick={handleDeleteOrg}>Delete Organization</Button>
        </DangerZone>
      )}
    </div>
  );
}
```

---

## Edge Cases & Special Scenarios

### 1. User with Multiple Org Roles

**Scenario:** Alice is `owner` of Acme Corp, `admin` of Beta Inc, and `member` of Gamma LLC.

**Behavior:**
- Alice sees different UI in each organization's dashboard
- In Acme Corp: Can delete org, manage billing
- In Beta Inc: Can invite members, cannot delete org
- In Gamma LLC: Can create resources, cannot invite members

**Implementation:**
- Frontend checks `user.orgRole(currentOrgId)` for current workspace
- Backend/RLS checks org_id in request context

---

### 2. Platform Admin Also Org Member

**Scenario:** Bob is `platform_admin` and also `member` of Acme Corp.

**Behavior:**
- Bob can view ALL organizations in admin dashboard (platform override)
- Bob can access admin features globally
- Within Acme Corp: Bob has `member` permissions (not auto-upgraded to owner)
- Bob CAN delete Acme Corp via admin dashboard (platform admin power)
- Bob CANNOT invite members to Acme Corp via org UI (only as admin/owner could)

**Design Decision:** Platform roles do not grant organization permissions automatically. Explicit membership required.

---

### 3. Role Inheritance & Defaults

**No role inheritance:**
- `admin` role does NOT inherit `member` permissions (checked separately)
- `platform_admin` does NOT inherit `platform_developer` permissions

**Permission checks use explicit lists:**
```typescript
// Good: Explicit check
canInviteMembers: ['owner', 'admin'].includes(role)

// Bad: Implicit hierarchy
canInviteMembers: roleLevel >= ADMIN_LEVEL
```

**Defaults:**
- New users: No platform role
- New org members: Role specified in invitation (default: `member`)
- Org creator: Automatically `owner`

---

### 4. Deleted User Handling

**Scenario:** User Alice (platform_admin) deletes user Bob (member of 3 orgs).

**Behavior:**
- Bob's `user_profiles` row deleted
- Bob's `organization_members` rows CASCADE deleted (loses all org access)
- Bob's `system_roles` row CASCADE deleted (loses platform role)
- Bob's created resources remain (via `ON DELETE SET NULL` or transfer logic)
- Audit logs retain Bob's user_id (nullable FK, not cascaded)

**Decision:** User deletion is soft-recommended (mark `deleted_at` instead), but hard delete is supported.

---

### 5. Ownership Transfer Edge Cases

**Cannot transfer to:**
- User not already in organization → Must invite first, then transfer
- User with `viewer` role → Must upgrade to `member`+ first, then transfer

**Atomic transfer:**
```sql
BEGIN;
  UPDATE organization_members SET role = 'owner' WHERE user_id = new_owner_id AND organization_id = org_id;
  UPDATE organization_members SET role = 'admin' WHERE user_id = old_owner_id AND organization_id = org_id;
COMMIT;
```

**Audit log entry:**
```json
{
  "action": "organization.ownership_transferred",
  "metadata": {
    "from_user_id": "old-owner-uuid",
    "to_user_id": "new-owner-uuid",
    "organization_id": "org-uuid"
  }
}
```

---

### 6. Demo Mode & Roles

**Demo mode behavior:**
- Demo user (`demo@example.com`) has `platform_admin` role in mock data
- Allows testing admin features without real Supabase
- Demo login buttons on `/login` (regular user) and `/admin/login` (platform admin)
- Mock client returns demo user with `system_roles` entry for `platform_admin`

**Prevents lock-out:**
- If demo mode is enabled via admin toggle, admins can still log in
- Cannot disable demo mode if it would lock out all admins

---

## Testing Requirements (TDD)

### Critical Coverage (>80%)

**Auth Tests:**
- Login with valid credentials
- Login with invalid credentials
- Logout clears session
- Password reset flow
- Email verification

**RBAC Tests:**
- Platform admin can view all orgs
- Regular user cannot view other orgs
- Owner can delete org
- Admin cannot delete org
- Member cannot invite members
- Viewer cannot edit resources
- Platform admin can assign roles
- Regular user cannot assign platform roles

**Organization Tests:**
- Create org assigns owner role
- Invite member creates invitation
- Accept invitation creates membership
- Owner can transfer ownership
- Transfer ownership updates both users' roles
- Delete org removes all members and invitations

**RLS Policy Tests:**
- User can only select own org memberships
- Platform admin can select all memberships
- Owner can delete org
- Admin cannot delete org
- Viewer cannot insert resources

---

## Implementation Checklist

Before considering RBAC complete:

- ✅ All platform roles defined in code (`platform_admin`, `platform_developer`, `platform_support`)
- ✅ All org roles defined in code (`owner`, `admin`, `member`, `viewer`)
- ✅ `usePermissions` hook implemented with all permission checks
- ✅ `useAuth` hook provides current user's platform and org roles
- ✅ RLS policies enforce all permission rules at database level
- ✅ UI conditionally renders based on permissions (no forbidden buttons visible)
- ✅ Backend API routes check permissions before operations
- ✅ Ownership transfer function implemented and tested
- ✅ Role assignment functions implemented and tested
- ✅ Demo mode includes platform_admin role for demo user
- ✅ All RBAC tests pass with >80% coverage
- ✅ Edge cases handled (multiple orgs, platform admin + org member, etc.)
- ✅ Audit logs capture role changes and permission-sensitive actions

---

**End of RBAC Specification**
