# Role-Based Access Control (RBAC) Documentation

**Project:** BYO v4 SaaS Boilerplate
**Last Updated:** 2025-11-13

## Overview

BYO v4 implements a dual-level RBAC system:
1. **Platform Roles** - System-wide permissions (admin, developer, support)
2. **Organization Roles** - Workspace-specific permissions (owner, admin, member, viewer)

## Platform Roles

Platform roles are stored in the `system_roles` table and grant system-wide access.

### Role Hierarchy

| Role | Description | Access Level |
|------|-------------|--------------|
| `platform_admin` | Full system access | Can manage all users, orgs, and settings |
| `platform_developer` | Development support | Can view system data, limited write access |
| `platform_support` | Customer support | Can view user data, limited org access |

### Platform Admin Capabilities
- Access `/admin` dashboard
- View all users and organizations
- Assign platform roles to users
- Toggle demo mode system-wide
- View activity logs and audit trails
- Manage system settings (feature flags, maintenance mode)
- Delete organizations and users (with confirmation)

### Platform Developer Capabilities
- View system statistics
- Access debugging tools
- View (but not modify) system settings
- Read-only access to user data

### Platform Support Capabilities
- View user profiles and organizations
- Assist with account issues
- Cannot modify system settings
- Cannot assign platform roles

## Organization Roles

Organization roles are stored in the `organization_members` table and control access within a specific workspace.

### Role Hierarchy

| Role | Description | Permissions |
|------|-------------|-------------|
| `owner` | Organization creator | Full control, cannot be removed |
| `admin` | Organization administrator | Can manage members and settings |
| `member` | Regular member | Can view and edit org content |
| `viewer` | Read-only member | Can only view org content |

### Owner Capabilities
- Transfer ownership to another admin
- Delete the organization
- All admin capabilities

### Admin Capabilities
- Invite new members
- Remove members (except owner)
- Change member roles (except owner)
- Update organization settings
- View billing information

### Member Capabilities
- Access organization workspace
- Create and edit content
- View other members
- Cannot manage members or settings

### Viewer Capabilities
- Read-only access to organization
- View content and members
- Cannot create or edit anything

## RBAC Implementation

### Database Level (RLS Policies)

Row-Level Security policies enforce permissions at the database level.

**Example: Only org members can view org data**
```sql
CREATE POLICY "Users can view organizations they are members of"
    ON public.organizations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.organization_members
            WHERE organization_members.organization_id = organizations.id
            AND organization_members.user_id = auth.uid()
        )
    );
```

**Example: Only platform admins can view system roles**
```sql
CREATE POLICY "Platform admins can view all system roles"
    ON public.system_roles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.system_roles
            WHERE user_id = auth.uid()
            AND role = 'platform_admin'
        )
    );
```

### Application Level (React Hooks)

#### usePlatformRole Hook
Checks if current user has a platform role.

```typescript
import { usePlatformRole } from '@/features/rbac/useRoles'

function AdminDashboard() {
  const { role, isPlatformAdmin, loading } = usePlatformRole()

  if (loading) return <div>Loading...</div>
  if (!isPlatformAdmin) return <div>Access denied</div>

  return <div>Welcome, Admin!</div>
}
```

**Returns:**
- `role`: `'platform_admin' | 'platform_developer' | 'platform_support' | null`
- `isPlatformAdmin`: `boolean`
- `isPlatformDeveloper`: `boolean`
- `isPlatformSupport`: `boolean`
- `loading`: `boolean`

#### useOrganizationRole Hook
Checks user's role within a specific organization.

```typescript
import { useOrganizationRole } from '@/features/rbac/useRoles'

function OrganizationSettings({ orgId }: { orgId: string }) {
  const { role, isOwner, isAdmin, loading } = useOrganizationRole(orgId)

  if (loading) return <div>Loading...</div>
  if (!isAdmin && !isOwner) return <div>You need admin access</div>

  return <div>Organization Settings</div>
}
```

**Returns:**
- `role`: `'owner' | 'admin' | 'member' | 'viewer' | null`
- `isOwner`: `boolean`
- `isAdmin`: `boolean`
- `isMember`: `boolean`
- `isViewer`: `boolean`
- `hasWriteAccess`: `boolean` (true for owner, admin, member)
- `loading`: `boolean`

### Route Guards

#### AdminRoute Component
Protects routes requiring platform admin access.

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
- Fetches user's platform role
- Shows loading state while checking
- Renders children if user is `platform_admin`
- Shows "Access Denied" message otherwise

## Permission Checking Patterns

### UI-Level Permissions
Hide/show UI elements based on roles.

```typescript
function MemberList({ orgId }: { orgId: string }) {
  const { isOwner, isAdmin } = useOrganizationRole(orgId)
  const { isPlatformAdmin } = usePlatformRole()

  return (
    <div>
      {members.map(member => (
        <div key={member.id}>
          {member.name}
          {(isOwner || isAdmin || isPlatformAdmin) && (
            <button onClick={() => removeMember(member.id)}>
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
```

### API-Level Permissions
Check permissions before API calls.

```typescript
async function updateOrganization(orgId: string, data: object) {
  const { role } = await checkOrganizationRole(orgId)

  if (role !== 'owner' && role !== 'admin') {
    throw new Error('Insufficient permissions')
  }

  return supabase
    .from('organizations')
    .update(data)
    .eq('id', orgId)
}
```

## Demo Mode RBAC

In demo mode, the mock client provides predefined roles:

**Demo User (`demo@example.com`)**
- No platform role
- Member of mock organization "Acme Corp"
- Organization role: `member`

**Demo Admin (`admin@example.com`)**
- Platform role: `platform_admin`
- Owner of mock organization "Admin Workspace"
- Organization role: `owner`
- Can access `/admin` dashboard

## Adding New Roles

### Platform Role
1. Add role to `system_roles` table check constraint
2. Update TypeScript types in `src/lib/supabase/types.ts`
3. Add RLS policies for the new role
4. Update `usePlatformRole` hook with new helper
5. Create route guard if needed

### Organization Role
1. Add role to `organization_members` table check constraint
2. Update TypeScript types
3. Add RLS policies for the new role
4. Update `useOrganizationRole` hook with new helper
5. Update invitation system to support new role

## Security Best Practices

### Defense in Depth
Always implement permissions at multiple levels:
1. **Database (RLS)** - Prevents direct data access
2. **API** - Validates permissions before operations
3. **UI** - Hides unauthorized actions from users

### Principle of Least Privilege
- Users get minimum permissions needed
- Default role is `viewer` for invitations
- Promotions require explicit action

### Audit Logging
Log all permission-sensitive actions:
- Role changes
- Member additions/removals
- Organization creation/deletion
- Platform admin actions

## Testing RBAC

### Manual Testing Checklist
- [ ] Platform admin can access `/admin`
- [ ] Non-admin cannot access `/admin`
- [ ] Org owner can delete organization
- [ ] Org admin can invite members
- [ ] Org member cannot remove others
- [ ] Org viewer cannot edit content
- [ ] RLS policies prevent direct DB access

### E2E Tests
Located in `tests/e2e/rbac.spec.ts` (to be created):
- Platform role enforcement
- Organization role enforcement
- Permission boundary testing
- Unauthorized access attempts

## Common Issues & Solutions

### Issue: User has no platform role but needs admin access
**Solution:** Platform admin assigns role via Admin Dashboard

### Issue: User cannot see their own organizations
**Solution:** Check `organization_members` table for membership record

### Issue: RLS policy blocking legitimate access
**Solution:** Review policy logic, may need to add exception

### Issue: Demo admin cannot toggle demo mode
**Solution:** Verify mock client includes `platform_admin` role for demo admin user

## Future Enhancements

1. **Custom Roles:** Allow orgs to define custom roles with specific permissions
2. **Permission Sets:** Group permissions into reusable sets
3. **Temporary Access:** Time-limited role assignments
4. **Delegation:** Allow users to delegate permissions temporarily
5. **Audit UI:** Dashboard for viewing permission changes
