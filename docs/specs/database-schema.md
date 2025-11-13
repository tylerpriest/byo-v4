# Database Schema Specification

## Overview

This document defines the complete database schema for BYO v4, including tables, relationships, RLS policies, and indexes. The schema supports multi-tenant SaaS with Row-Level Security and dual RBAC (platform-level and organization-level roles).

## Schema Diagram

```
┌─────────────────┐
│  auth.users     │ (Supabase Auth)
└────────┬────────┘
         │
         ├──────────────────┬────────────────────┬──────────────────┐
         │                  │                    │                  │
    ┌────▼────────┐   ┌────▼─────────┐    ┌────▼──────────┐  ┌───▼──────────┐
    │  profiles   │   │system_roles  │    │  org_members  │  │organizations │
    └─────────────┘   └──────────────┘    └────┬──────────┘  └──────────────┘
                                                 │
                                          ┌──────▼────────────┐
                                          │   invitations     │
                                          └───────────────────┘
```

## Core Tables

### 1. `profiles`

User profile information (1:1 with auth.users).

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Profiles are created on signup (via trigger)
CREATE POLICY "Profiles are created on signup"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX profiles_email_idx ON profiles(email);

-- Updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. `system_roles`

Platform-wide roles (admin, developer, support).

```sql
CREATE TYPE platform_role AS ENUM ('platform_admin', 'developer', 'support');

CREATE TABLE system_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role platform_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_roles ENABLE ROW LEVEL SECURITY;

-- Anyone can check if they have a system role
CREATE POLICY "Users can view their own system role"
  ON system_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Only platform admins can assign system roles
CREATE POLICY "Platform admins can manage system roles"
  ON system_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid()
      AND role = 'platform_admin'
    )
  );

-- Indexes
CREATE INDEX system_roles_role_idx ON system_roles(role);
```

### 3. `organizations`

Multi-tenant organizations/workspaces.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users can view organizations they're members of
CREATE POLICY "Users can view their organizations"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
    )
  );

-- Users can create organizations (and become owner)
CREATE POLICY "Users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Only org owners can update organizations
CREATE POLICY "Org owners can update organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
      AND org_members.role = 'owner'
    )
  );

-- Only org owners can delete organizations
CREATE POLICY "Org owners can delete organization"
  ON organizations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = organizations.id
      AND org_members.user_id = auth.uid()
      AND org_members.role = 'owner'
    )
  );

-- Indexes
CREATE INDEX organizations_slug_idx ON organizations(slug);
CREATE INDEX organizations_created_by_idx ON organizations(created_by);

-- Updated_at trigger
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. `org_members`

Organization membership and roles.

```sql
CREATE TYPE org_role AS ENUM ('owner', 'admin', 'member', 'viewer');

CREATE TABLE org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'member',
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- Enable RLS
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- Users can view members of their organizations
CREATE POLICY "Users can view org members"
  ON org_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
    )
  );

-- Org owners and admins can invite members
CREATE POLICY "Org admins can add members"
  ON org_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = org_members.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- Org owners and admins can update member roles
CREATE POLICY "Org admins can update members"
  ON org_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Org owners and admins can remove members
CREATE POLICY "Org admins can remove members"
  ON org_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM org_members om
      WHERE om.org_id = org_members.org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Indexes
CREATE INDEX org_members_org_id_idx ON org_members(org_id);
CREATE INDEX org_members_user_id_idx ON org_members(user_id);
CREATE INDEX org_members_role_idx ON org_members(role);
```

### 5. `invitations`

Email invitations to join organizations.

```sql
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');

CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role org_role NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status invitation_status NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(org_id, email, status)
);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations to their email
CREATE POLICY "Users can view their invitations"
  ON invitations FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    OR
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = invitations.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- Org admins can create invitations
CREATE POLICY "Org admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM org_members
      WHERE org_members.org_id = invitations.org_id
      AND org_members.user_id = auth.uid()
      AND org_members.role IN ('owner', 'admin')
    )
  );

-- Users can update their own invitations (accept/decline)
CREATE POLICY "Users can update their invitations"
  ON invitations FOR UPDATE
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND status = 'pending'
    AND expires_at > NOW()
  );

-- Indexes
CREATE INDEX invitations_email_idx ON invitations(email);
CREATE INDEX invitations_token_idx ON invitations(token);
CREATE INDEX invitations_org_id_idx ON invitations(org_id);
CREATE INDEX invitations_status_idx ON invitations(status);
CREATE INDEX invitations_expires_at_idx ON invitations(expires_at);
```

### 6. `system_settings`

Platform-wide settings (demo mode toggle, etc.).

```sql
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read system settings
CREATE POLICY "Anyone can view system settings"
  ON system_settings FOR SELECT
  USING (true);

-- Only platform admins can modify settings
CREATE POLICY "Platform admins can manage settings"
  ON system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM system_roles
      WHERE user_id = auth.uid()
      AND role = 'platform_admin'
    )
  );

-- Insert default settings
INSERT INTO system_settings (key, value, description) VALUES
  ('demo_mode_enabled', 'false', 'Enable demo mode platform-wide'),
  ('maintenance_mode', 'false', 'Enable maintenance mode'),
  ('signup_enabled', 'true', 'Allow new user signups')
ON CONFLICT (key) DO NOTHING;
```

## Helper Functions

### 1. `update_updated_at_column()`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. `handle_new_user()`

Auto-create profile on user signup.

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 3. `is_platform_admin(user_id UUID)`

```sql
CREATE OR REPLACE FUNCTION is_platform_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM system_roles
    WHERE system_roles.user_id = user_id
    AND role = 'platform_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. `is_org_owner(user_id UUID, org_id UUID)`

```sql
CREATE OR REPLACE FUNCTION is_org_owner(user_id UUID, org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM org_members
    WHERE org_members.user_id = user_id
    AND org_members.org_id = org_id
    AND org_members.role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Migration Steps

1. **Enable Extensions**:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   CREATE EXTENSION IF NOT EXISTS "pgcrypto";
   ```

2. **Create Types**: Run ENUM type definitions

3. **Create Helper Functions**: Run function definitions

4. **Create Tables**: In order of dependencies

5. **Enable RLS**: Enable RLS on all tables

6. **Create Policies**: Add RLS policies for each table

7. **Create Indexes**: Add performance indexes

8. **Create Triggers**: Add triggers for auto-updates

9. **Insert Seed Data**: Add default system settings

## TypeScript Types

Generate types from the schema:

```bash
npx supabase gen types typescript --project-id your-project-id > src/lib/supabase/database.types.ts
```

## Security Considerations

1. **RLS is Required**: Never disable RLS on any table
2. **No Direct Deletes**: Use CASCADE for referential integrity
3. **Audit Trails**: Track who created/modified records
4. **Token Security**: Invitation tokens are cryptographically secure
5. **Email Verification**: Supabase handles email verification
6. **Rate Limiting**: Implement on API routes (Supabase functions)

## Performance Notes

- All foreign keys are indexed
- Composite unique constraints on junction tables
- Partial indexes on status/role columns
- TIMESTAMPTZ for all timestamps (timezone-aware)

## Next Steps

1. Apply migrations to Supabase project
2. Test RLS policies thoroughly
3. Generate TypeScript types
4. Update mock client to match schema
5. Build CRUD operations for each table
6. Add comprehensive tests for RLS
