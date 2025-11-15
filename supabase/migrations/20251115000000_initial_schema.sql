-- BYO v4 Initial Schema Migration
-- Multi-tenant SaaS with RBAC
-- Date: 2025-11-15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLE: user_profiles (extends auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- RLS Policies for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "platform_admins_view_all_profiles"
  ON public.user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- =============================================
-- TABLE: organizations
-- =============================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  billing_email TEXT,
  settings JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_organizations_created_by ON public.organizations(created_by);
CREATE INDEX idx_organizations_created_at ON public.organizations(created_at DESC);

-- RLS Policies for organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_member_view"
  ON public.organizations
  FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "org_owner_update"
  ON public.organizations
  FOR UPDATE
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "org_owner_delete"
  ON public.organizations
  FOR DELETE
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "authenticated_users_create_org"
  ON public.organizations
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "platform_admins_all_access"
  ON public.organizations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- =============================================
-- TABLE: organization_members
-- =============================================
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user ON public.organization_members(user_id);
CREATE INDEX idx_org_members_role ON public.organization_members(role);

-- RLS Policies for organization_members
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_view_own_org"
  ON public.organization_members
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "owners_admins_manage_members"
  ON public.organization_members
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "platform_admins_manage_all_members"
  ON public.organization_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

-- =============================================
-- TABLE: organization_invitations
-- =============================================
CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invitations_org ON public.organization_invitations(organization_id);
CREATE INDEX idx_invitations_email ON public.organization_invitations(email);
CREATE INDEX idx_invitations_token ON public.organization_invitations(token);
CREATE INDEX idx_invitations_expires ON public.organization_invitations(expires_at);

-- RLS Policies for organization_invitations
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owners_admins_view_invitations"
  ON public.organization_invitations
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "owners_admins_create_invitations"
  ON public.organization_invitations
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "owners_admins_delete_invitations"
  ON public.organization_invitations
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "public_verify_invitation_token"
  ON public.organization_invitations
  FOR SELECT
  USING (expires_at > NOW() AND accepted_at IS NULL);

-- =============================================
-- TABLE: system_roles
-- =============================================
CREATE TABLE IF NOT EXISTS public.system_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('platform_admin', 'platform_developer', 'platform_support')),
  assigned_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_system_roles_user ON public.system_roles(user_id);
CREATE INDEX idx_system_roles_role ON public.system_roles(role);

-- RLS Policies for system_roles
ALTER TABLE public.system_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_admins_view_system_roles"
  ON public.system_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "platform_admins_assign_roles"
  ON public.system_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "platform_admins_revoke_roles"
  ON public.system_roles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "users_view_own_system_role"
  ON public.system_roles
  FOR SELECT
  USING (user_id = auth.uid());

-- =============================================
-- TABLE: system_settings
-- =============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_system_settings_updated_at ON public.system_settings(updated_at DESC);

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('demo_mode_enabled', '{"enabled": false}'::JSONB, 'Global demo mode toggle'),
  ('maintenance_mode', '{"enabled": false, "message": ""}'::JSONB, 'Maintenance mode status'),
  ('feature_flags', '{}'::JSONB, 'Feature toggles')
ON CONFLICT (key) DO NOTHING;

-- RLS Policies for system_settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_admins_view_settings"
  ON public.system_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "platform_admins_modify_settings"
  ON public.system_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "public_read_public_settings"
  ON public.system_settings
  FOR SELECT
  USING (key IN ('demo_mode_enabled', 'maintenance_mode'));

-- =============================================
-- TABLE: audit_logs
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_org ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- RLS Policies for audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "platform_admins_view_logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.system_roles
      WHERE user_id = auth.uid() AND role = 'platform_admin'
    )
  );

CREATE POLICY "org_owners_view_org_logs"
  ON public.audit_logs
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- =============================================
-- FUNCTIONS: Triggers and Helpers
-- =============================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at
  BEFORE UPDATE ON public.organization_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Auto-create owner membership when organization is created
CREATE OR REPLACE FUNCTION public.create_organization_owner_membership()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER auto_create_owner_membership
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.create_organization_owner_membership();

-- Function: Sync user profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE public.user_profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.organizations IS 'Multi-tenant organizations (workspaces)';
COMMENT ON TABLE public.organization_members IS 'User membership in organizations with roles';
COMMENT ON TABLE public.organization_invitations IS 'Pending invitations to join organizations';
COMMENT ON TABLE public.system_roles IS 'Platform-level roles (admin, developer, support)';
COMMENT ON TABLE public.system_settings IS 'System-wide configuration and feature flags';
COMMENT ON TABLE public.audit_logs IS 'Activity audit trail for compliance and debugging';

-- Migration complete
