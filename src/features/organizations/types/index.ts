import type { Database } from '@/lib/database.types'

export type Organization = Database['public']['Tables']['organizations']['Row']
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert']
export type OrganizationUpdate = Database['public']['Tables']['organizations']['Update']

export type OrganizationMember = Database['public']['Tables']['organization_members']['Row']
export type OrganizationMemberInsert =
  Database['public']['Tables']['organization_members']['Insert']
export type OrganizationMemberUpdate =
  Database['public']['Tables']['organization_members']['Update']

export type OrganizationInvitation =
  Database['public']['Tables']['organization_invitations']['Row']
export type OrganizationInvitationInsert =
  Database['public']['Tables']['organization_invitations']['Insert']

export type OrgRole = 'owner' | 'admin' | 'member' | 'viewer'
