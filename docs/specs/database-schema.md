# Database Schema

This document describes the database schema for the BYO SaaS Boilerplate. The schema is designed for Supabase (PostgreSQL) with Row Level Security (RLS) for multi-tenancy.

## Overview

The database implements a **multi-tenant architecture** with row-level isolation using PostgreSQL's RLS. Each organization has its own isolated data, and members have specific roles within organizations.

## Core Tables

### profiles

User profile information, linked to Supabase auth.users.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  platform_role TEXT CHECK (platform_role IN ('admin', 'developer', 'support')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Platform admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND platform_role = 'admin'
    )
  );
```

### organizations

Multi-tenant workspaces/organizations.

```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users can view organizations they're members of
CREATE POLICY "Members can view their organizations"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Organization owners can update their organization
CREATE POLICY "Owners can update organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role = 'owner'
    )
  );

-- Organization owners can delete their organization
CREATE POLICY "Owners can delete organization"
  ON organizations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role = 'owner'
    )
  );

-- Any authenticated user can create an organization
CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### organization_members

Members of organizations with their roles.

```sql
CREATE TABLE organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Indexes
CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);

-- RLS Policies
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Members can view other members in their organizations
CREATE POLICY "Members can view organization members"
  ON organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
    )
  );

-- Owners and admins can add members
CREATE POLICY "Owners and admins can add members"
  ON organization_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organization_members.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- Owners and admins can update member roles
CREATE POLICY "Owners and admins can update members"
  ON organization_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- Owners and admins can remove members
CREATE POLICY "Owners and admins can remove members"
  ON organization_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );
```

### invitations

Email invitations to join organizations.

```sql
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID NOT NULL REFERENCES profiles(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_invitations_org_id ON invitations(organization_id);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);

-- RLS Policies
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Members can view invitations for their organizations
CREATE POLICY "Members can view organization invitations"
  ON invitations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = invitations.organization_id
      AND organization_members.user_id = auth.uid()
    )
  );

-- Owners and admins can create invitations
CREATE POLICY "Owners and admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = invitations.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

-- Anyone with the token can update to accept
CREATE POLICY "Token holders can accept invitations"
  ON invitations FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

### system_settings

Platform-wide settings controlled by admins.

```sql
CREATE TABLE system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read system settings
CREATE POLICY "Anyone can view system settings"
  ON system_settings FOR SELECT
  USING (true);

-- Only platform admins can update settings
CREATE POLICY "Admins can update settings"
  ON system_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND platform_role = 'admin'
    )
  );

-- Only platform admins can insert settings
CREATE POLICY "Admins can insert settings"
  ON system_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND platform_role = 'admin'
    )
  );
```

## Enums

```sql
-- Platform roles (system-wide)
CREATE TYPE platform_role AS ENUM ('admin', 'developer', 'support');

-- Organization roles (per-workspace)
CREATE TYPE organization_role AS ENUM ('owner', 'admin', 'member', 'viewer');
```

## Functions

### Auto-update updated_at timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Auto-create profile on user signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Multi-Tenancy Pattern

This schema implements the **Row-level multi-tenancy** pattern as recommended by Supabase:

1. **Single database, shared schema** - All organizations share the same tables
2. **Row-level isolation** - RLS policies ensure data separation
3. **Organization-based access** - Users access data through organization membership
4. **Efficient queries** - Indexes on organization_id for fast filtering

### Benefits

- **Cost-effective**: Single database for all tenants
- **Easy maintenance**: Schema changes apply to all tenants
- **Scalable**: PostgreSQL can handle millions of rows
- **Secure**: Database-level enforcement via RLS

### References

- [Supabase Multi-tenancy Guide](https://supabase.com/docs/guides/database/postgres/row-level-security#multi-tenancy)
- [Row Level Security Patterns](https://supabase.com/docs/guides/auth/row-level-security)

## Migration Files

To apply this schema, create migration files in your Supabase project:

```bash
supabase migration new initial_schema
# Copy SQL from above into the migration file
supabase db push
```

## Type Generation

Generate TypeScript types from the schema:

```bash
supabase gen types typescript --local > src/types/database.types.ts
```
