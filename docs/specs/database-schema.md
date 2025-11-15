# Database Schema Specification

**Project:** BYO (Build Your Own) - SaaS Boilerplate v4
**Version:** 1.0
**Date:** 2025-11-15
**Purpose:** Complete database structure for multi-tenant SaaS with RBAC

---

## Overview

This database schema implements a **row-level multi-tenancy** architecture where:
- Each organization (tenant/workspace) has isolated data enforced by RLS policies
- Users can belong to multiple organizations with different roles per organization
- Platform-level roles (Admin, Developer, Support) provide system-wide permissions
- Organization-level roles (Owner, Admin, Member, Viewer) provide per-workspace permissions
- Demo mode support through system settings

**Isolation Strategy:** Row Level Security (RLS) policies ensure users only access data from organizations they belong to, with platform admins having override access.

**Scalability:** Single PostgreSQL database, shared infrastructure, horizontal scaling via Supabase.

---

## Tables

### 1. users (Supabase Auth Extension)

**Note:** This table is managed by `auth.users` in Supabase. We extend it with a public profile table.

**Extension Table: `public.user_profiles`**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK → auth.users(id) | User ID (matches Supabase Auth) |
| email | text | NOT NULL, UNIQUE | User email (synced from auth.users) |
| full_name | text | NULL | User's full name |
| avatar_url | text | NULL | Profile picture URL |
| created_at | timestamptz | DEFAULT now() | Account creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last profile update |

**Indexes:**
```sql
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
```

**RLS Policies:**
```sql
-- Users can view their own profile
CREATE POLICY "users_view_own_profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Platform admins can view all profiles
CREATE POLICY "platform_admins_view_all_profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );
```

---

### 2. organizations

The core multi-tenant table. Each row represents a workspace/tenant.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Organization ID |
| name | text | NOT NULL | Organization name |
| slug | text | NOT NULL, UNIQUE | URL-friendly identifier (e.g., "acme-corp") |
| avatar_url | text | NULL | Organization logo |
| billing_email | text | NULL | Billing contact email |
| settings | jsonb | DEFAULT '{}' | Organization-specific settings (JSON) |
| created_at | timestamptz | DEFAULT now() | Creation timestamp |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |
| created_by | uuid | FK → user_profiles(id) | User who created the org |

**Indexes:**
```sql
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_created_by ON organizations(created_by);
CREATE INDEX idx_organizations_created_at ON organizations(created_at DESC);
```

**RLS Policies:**
```sql
-- Users can view organizations they belong to
CREATE POLICY "org_member_view" ON organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Organization owners can update their org
CREATE POLICY "org_owner_update" ON organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Organization owners can delete their org
CREATE POLICY "org_owner_delete" ON organizations
  FOR DELETE USING (
    id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- Authenticated users can create organizations
CREATE POLICY "authenticated_users_create_org" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Platform admins can view, update, delete all organizations
CREATE POLICY "platform_admins_all_access" ON organizations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );
```

---

### 3. organization_members

Junction table linking users to organizations with role assignment.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Membership ID |
| organization_id | uuid | NOT NULL, FK → organizations(id) ON DELETE CASCADE | Organization reference |
| user_id | uuid | NOT NULL, FK → user_profiles(id) ON DELETE CASCADE | User reference |
| role | text | NOT NULL, CHECK (role IN ('owner', 'admin', 'member', 'viewer')) | Organization role |
| invited_by | uuid | NULL, FK → user_profiles(id) | User who invited this member |
| joined_at | timestamptz | DEFAULT now() | Membership start timestamp |
| updated_at | timestamptz | DEFAULT now() | Last role update |

**Unique Constraint:**
```sql
ALTER TABLE organization_members ADD CONSTRAINT unique_org_user UNIQUE (organization_id, user_id);
```

**Indexes:**
```sql
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
```

**RLS Policies:**
```sql
-- Members can view other members of their organizations
CREATE POLICY "members_view_own_org" ON organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid()
    )
  );

-- Owners and admins can invite new members (via invitations table)
-- They can also update member roles
CREATE POLICY "owners_admins_manage_members" ON organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Platform admins can manage all memberships
CREATE POLICY "platform_admins_manage_all_members" ON organization_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );
```

---

### 4. organization_invitations

Invitation system for adding new members to organizations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Invitation ID |
| organization_id | uuid | NOT NULL, FK → organizations(id) ON DELETE CASCADE | Target organization |
| email | text | NOT NULL | Invitee email address |
| role | text | NOT NULL, CHECK (role IN ('admin', 'member', 'viewer')) | Role to be assigned (owner cannot be invited) |
| invited_by | uuid | NOT NULL, FK → user_profiles(id) | User who sent the invite |
| token | text | NOT NULL, UNIQUE | Magic link token (UUID) |
| expires_at | timestamptz | NOT NULL | Invitation expiration (typically 7 days) |
| accepted_at | timestamptz | NULL | When invitation was accepted (NULL = pending) |
| created_at | timestamptz | DEFAULT now() | Invitation creation timestamp |

**Indexes:**
```sql
CREATE INDEX idx_invitations_org ON organization_invitations(organization_id);
CREATE INDEX idx_invitations_email ON organization_invitations(email);
CREATE INDEX idx_invitations_token ON organization_invitations(token);
CREATE INDEX idx_invitations_expires ON organization_invitations(expires_at);
```

**RLS Policies:**
```sql
-- Organization owners and admins can view invitations for their org
CREATE POLICY "owners_admins_view_invitations" ON organization_invitations
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Owners and admins can create invitations
CREATE POLICY "owners_admins_create_invitations" ON organization_invitations
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Owners and admins can delete (revoke) invitations
CREATE POLICY "owners_admins_delete_invitations" ON organization_invitations
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Public read for token verification (during magic link acceptance)
CREATE POLICY "public_verify_invitation_token" ON organization_invitations
  FOR SELECT USING (expires_at > now() AND accepted_at IS NULL);
```

---

### 5. system_roles

Platform-level roles for system-wide permissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Role assignment ID |
| user_id | uuid | NOT NULL, UNIQUE, FK → user_profiles(id) ON DELETE CASCADE | User reference (one platform role per user) |
| role | text | NOT NULL, CHECK (role IN ('platform_admin', 'platform_developer', 'platform_support')) | Platform role |
| assigned_by | uuid | NULL, FK → user_profiles(id) | Admin who assigned this role |
| assigned_at | timestamptz | DEFAULT now() | Role assignment timestamp |

**Indexes:**
```sql
CREATE INDEX idx_system_roles_user ON system_roles(user_id);
CREATE INDEX idx_system_roles_role ON system_roles(role);
```

**RLS Policies:**
```sql
-- Platform admins can view all system roles
CREATE POLICY "platform_admins_view_system_roles" ON system_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Platform admins can assign system roles
CREATE POLICY "platform_admins_assign_roles" ON system_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Platform admins can revoke system roles
CREATE POLICY "platform_admins_revoke_roles" ON system_roles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Users can view their own system role
CREATE POLICY "users_view_own_system_role" ON system_roles
  FOR SELECT USING (user_id = auth.uid());
```

---

### 6. system_settings

Platform-wide configuration and feature flags.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| key | text | PK | Setting key (e.g., "demo_mode_enabled") |
| value | jsonb | NOT NULL | Setting value (JSON for flexibility) |
| description | text | NULL | Human-readable description |
| updated_by | uuid | NULL, FK → user_profiles(id) | Last admin who modified this |
| updated_at | timestamptz | DEFAULT now() | Last update timestamp |

**Special Settings:**
- `demo_mode_enabled`: `{ "enabled": true/false }` - Controls demo mode globally
- `maintenance_mode`: `{ "enabled": true/false, "message": "..." }` - Maintenance mode status
- `feature_flags`: `{ "feature_name": true/false, ... }` - Feature toggles

**Indexes:**
```sql
CREATE INDEX idx_system_settings_updated_at ON system_settings(updated_at DESC);
```

**RLS Policies:**
```sql
-- Platform admins can view all settings
CREATE POLICY "platform_admins_view_settings" ON system_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Platform admins can modify settings
CREATE POLICY "platform_admins_modify_settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Public read for specific settings (demo mode check, maintenance mode)
CREATE POLICY "public_read_public_settings" ON system_settings
  FOR SELECT USING (key IN ('demo_mode_enabled', 'maintenance_mode'));
```

---

### 7. audit_logs

Activity monitoring for compliance and debugging.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | Log entry ID |
| user_id | uuid | NULL, FK → user_profiles(id) | User who performed the action (NULL for system) |
| organization_id | uuid | NULL, FK → organizations(id) | Related organization (if applicable) |
| action | text | NOT NULL | Action performed (e.g., "user.login", "org.create") |
| resource_type | text | NULL | Type of resource affected (e.g., "organization", "user") |
| resource_id | uuid | NULL | ID of affected resource |
| metadata | jsonb | DEFAULT '{}' | Additional context (IP address, user agent, etc.) |
| created_at | timestamptz | DEFAULT now() | Timestamp of action |

**Indexes:**
```sql
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

**RLS Policies:**
```sql
-- Platform admins can view all audit logs
CREATE POLICY "platform_admins_view_logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- Organization owners can view logs for their org
CREATE POLICY "org_owners_view_org_logs" ON audit_logs
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- System can insert logs (bypass RLS for service role)
-- This is handled via service role key, not RLS policy
```

---

## Relationships

### Entity Relationship Diagram (Textual)

```
auth.users (Supabase managed)
  ↓ 1:1
user_profiles
  ↓ 1:many
  ├─→ organizations (created_by)
  ├─→ organization_members (user_id)
  ├─→ organization_invitations (invited_by)
  ├─→ system_roles (user_id) [1:1 unique]
  └─→ audit_logs (user_id)

organizations
  ↓ 1:many
  ├─→ organization_members (organization_id)
  ├─→ organization_invitations (organization_id)
  └─→ audit_logs (organization_id)

organization_members (junction table)
  ├─→ organizations (many:1)
  ├─→ user_profiles (many:1)
  └── role: owner | admin | member | viewer

organization_invitations
  ├─→ organizations (many:1)
  └─→ user_profiles (invited_by)

system_roles
  ├─→ user_profiles (1:1 unique)
  └── role: platform_admin | platform_developer | platform_support

system_settings (key-value store, no FK relationships)

audit_logs
  ├─→ user_profiles (many:1, nullable)
  └─→ organizations (many:1, nullable)
```

### Foreign Key Constraints

**user_profiles:**
- `id` → `auth.users(id)` ON DELETE CASCADE

**organizations:**
- `created_by` → `user_profiles(id)` ON DELETE SET NULL

**organization_members:**
- `organization_id` → `organizations(id)` ON DELETE CASCADE
- `user_id` → `user_profiles(id)` ON DELETE CASCADE
- `invited_by` → `user_profiles(id)` ON DELETE SET NULL

**organization_invitations:**
- `organization_id` → `organizations(id)` ON DELETE CASCADE
- `invited_by` → `user_profiles(id)` ON DELETE CASCADE

**system_roles:**
- `user_id` → `user_profiles(id)` ON DELETE CASCADE
- `assigned_by` → `user_profiles(id)` ON DELETE SET NULL

**system_settings:**
- `updated_by` → `user_profiles(id)` ON DELETE SET NULL

**audit_logs:**
- `user_id` → `user_profiles(id)` ON DELETE SET NULL
- `organization_id` → `organizations(id)` ON DELETE SET NULL

---

## Sample Data Structure

### Example: Multi-Tenant Scenario

**Scenario:** Alice creates "Acme Corp", invites Bob as admin, and Charlie as member.

```json
// user_profiles
[
  {
    "id": "user-alice-uuid",
    "email": "alice@example.com",
    "full_name": "Alice Admin",
    "avatar_url": null,
    "created_at": "2025-11-15T10:00:00Z",
    "updated_at": "2025-11-15T10:00:00Z"
  },
  {
    "id": "user-bob-uuid",
    "email": "bob@example.com",
    "full_name": "Bob Builder",
    "avatar_url": null,
    "created_at": "2025-11-15T10:05:00Z",
    "updated_at": "2025-11-15T10:05:00Z"
  },
  {
    "id": "user-charlie-uuid",
    "email": "charlie@example.com",
    "full_name": "Charlie Collaborator",
    "avatar_url": null,
    "created_at": "2025-11-15T10:10:00Z",
    "updated_at": "2025-11-15T10:10:00Z"
  }
]

// organizations
[
  {
    "id": "org-acme-uuid",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "avatar_url": null,
    "billing_email": "billing@acme.com",
    "settings": {"timezone": "America/New_York"},
    "created_at": "2025-11-15T10:01:00Z",
    "updated_at": "2025-11-15T10:01:00Z",
    "created_by": "user-alice-uuid"
  }
]

// organization_members
[
  {
    "id": "member-1-uuid",
    "organization_id": "org-acme-uuid",
    "user_id": "user-alice-uuid",
    "role": "owner",
    "invited_by": null,
    "joined_at": "2025-11-15T10:01:00Z",
    "updated_at": "2025-11-15T10:01:00Z"
  },
  {
    "id": "member-2-uuid",
    "organization_id": "org-acme-uuid",
    "user_id": "user-bob-uuid",
    "role": "admin",
    "invited_by": "user-alice-uuid",
    "joined_at": "2025-11-15T10:15:00Z",
    "updated_at": "2025-11-15T10:15:00Z"
  },
  {
    "id": "member-3-uuid",
    "organization_id": "org-acme-uuid",
    "user_id": "user-charlie-uuid",
    "role": "member",
    "invited_by": "user-alice-uuid",
    "joined_at": "2025-11-15T10:20:00Z",
    "updated_at": "2025-11-15T10:20:00Z"
  }
]

// organization_invitations (pending invitation example)
[
  {
    "id": "invite-1-uuid",
    "organization_id": "org-acme-uuid",
    "email": "diana@example.com",
    "role": "viewer",
    "invited_by": "user-alice-uuid",
    "token": "inv-token-uuid-12345",
    "expires_at": "2025-11-22T10:30:00Z",
    "accepted_at": null,
    "created_at": "2025-11-15T10:30:00Z"
  }
]

// system_roles (Alice is platform admin)
[
  {
    "id": "sysrole-1-uuid",
    "user_id": "user-alice-uuid",
    "role": "platform_admin",
    "assigned_by": null,
    "assigned_at": "2025-11-15T09:00:00Z"
  }
]

// system_settings
[
  {
    "key": "demo_mode_enabled",
    "value": {"enabled": false},
    "description": "Global demo mode toggle",
    "updated_by": "user-alice-uuid",
    "updated_at": "2025-11-15T09:00:00Z"
  },
  {
    "key": "maintenance_mode",
    "value": {"enabled": false, "message": ""},
    "description": "Maintenance mode status",
    "updated_by": null,
    "updated_at": "2025-11-15T09:00:00Z"
  }
]

// audit_logs (sample entries)
[
  {
    "id": "log-1-uuid",
    "user_id": "user-alice-uuid",
    "organization_id": "org-acme-uuid",
    "action": "organization.created",
    "resource_type": "organization",
    "resource_id": "org-acme-uuid",
    "metadata": {"ip": "192.168.1.1", "user_agent": "Mozilla/5.0..."},
    "created_at": "2025-11-15T10:01:00Z"
  },
  {
    "id": "log-2-uuid",
    "user_id": "user-alice-uuid",
    "organization_id": "org-acme-uuid",
    "action": "member.invited",
    "resource_type": "invitation",
    "resource_id": "invite-1-uuid",
    "metadata": {"invited_email": "diana@example.com", "role": "viewer"},
    "created_at": "2025-11-15T10:30:00Z"
  }
]
```

---

## Migration Strategy

### Initial Schema Migration

**File:** `/supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`

**Contents:**
1. Create all tables in order (respecting FK dependencies)
2. Enable RLS on all tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`)
3. Create all RLS policies
4. Create all indexes
5. Insert default system_settings rows
6. Create triggers for `updated_at` timestamps
7. Create functions for common operations (e.g., auto-assign owner role on org creation)

**Versioning Approach:**
- Use Supabase CLI migration system
- Each schema change = new numbered migration file
- Migrations are immutable once merged to production
- Test all migrations locally before deployment (`supabase db reset`)

**Migration Workflow:**
```bash
# Create migration
supabase migration new add_new_feature

# Write SQL in generated file
# /supabase/migrations/TIMESTAMP_add_new_feature.sql

# Apply locally
supabase migration up

# Verify no drift
supabase db diff

# Regenerate types
npm run supabase:gen

# Commit migration + types
git add supabase/migrations/*.sql src/lib/database.types.ts
git commit -m "Add new feature schema"

# Push to production (CI/CD auto-applies)
git push origin main
```

---

## Security Considerations

### RLS Policy Best Practices

1. **Default Deny:** All tables have RLS enabled with no default access
2. **Explicit Allow:** Policies explicitly grant access based on role checks
3. **Platform Admin Override:** Platform admins have read access to all data (audit trail)
4. **Service Role Bypass:** Backend operations use service role key to bypass RLS when needed (e.g., audit log writes)

### Multi-Tenant Isolation Verification

**Test Query (should return only user's orgs):**
```sql
-- Run as regular user (not platform admin)
SELECT * FROM organizations;
-- Should only return orgs where user is a member
```

**Test Query (platform admin should see all):**
```sql
-- Run as platform admin
SELECT * FROM organizations;
-- Should return ALL organizations
```

### Performance Considerations

1. **Index all FK columns** - Fast joins
2. **Index RLS policy filter columns** - Fast policy evaluation
3. **Composite indexes for common queries** - E.g., `(organization_id, user_id)` on `organization_members`
4. **Partition audit_logs by date** - For long-term data retention (future enhancement)

---

## Future Enhancements

**Potential additions (not in initial scope):**
- `billing_subscriptions` table (Stripe integration)
- `api_keys` table (for programmatic access)
- `webhooks` table (event notifications)
- `storage_objects` table (file uploads with RLS)
- `notification_preferences` table (user notification settings)
- `activity_feed` table (user-facing activity stream)

**Database functions to implement:**
- `create_organization_with_owner()` - Atomic org + owner creation
- `accept_invitation()` - Atomic invitation acceptance + member creation
- `check_user_permission()` - Helper for permission checks in policies
- `auto_update_timestamp()` - Trigger function for `updated_at` columns

---

## Verification Checklist

Before considering schema complete:

- ✅ All tables created with correct columns and types
- ✅ All foreign key constraints defined
- ✅ All indexes created
- ✅ RLS enabled on all tables
- ✅ All RLS policies created and tested
- ✅ Unique constraints enforced (e.g., org slug, org-user membership)
- ✅ Default values set where appropriate
- ✅ Cascade rules defined correctly (prevent orphaned records)
- ✅ TypeScript types generated successfully (`npm run supabase:gen`)
- ✅ Sample queries work as expected
- ✅ Multi-tenant isolation verified (users can't see other orgs' data)
- ✅ Platform admin override verified (admins can see all data)
- ✅ Migration applies cleanly on fresh database (`supabase db reset`)

---

**End of Database Schema Specification**
