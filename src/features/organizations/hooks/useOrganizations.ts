import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/features/auth/context/AuthContext'
import type {
  Organization,
  OrganizationInsert,
  OrganizationUpdate,
  OrganizationMember,
  OrganizationInvitation,
} from '../types'

export function useOrganizations() {
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchOrganizations()
    }
  }, [user])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('organizations').select('*')

      if (error) throw error
      setOrganizations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createOrganization = async (org: OrganizationInsert) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert(org)
        .select()
        .single()

      if (error) throw error
      await fetchOrganizations()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateOrganization = async (id: string, updates: OrganizationUpdate) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      await fetchOrganizations()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const deleteOrganization = async (id: string) => {
    try {
      const { error } = await supabase.from('organizations').delete().eq('id', id)

      if (error) throw error
      await fetchOrganizations()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refetch: fetchOrganizations,
  }
}

export function useOrganizationMembers(organizationId: string) {
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (organizationId) {
      fetchMembers()
    }
  }, [organizationId])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('organization_members')
        .select('*')
        .eq('organization_id', organizationId)

      if (error) throw error
      setMembers(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateMemberRole = async (memberId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('id', memberId)

      if (error) throw error
      await fetchMembers()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase.from('organization_members').delete().eq('id', memberId)

      if (error) throw error
      await fetchMembers()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    members,
    loading,
    error,
    updateMemberRole,
    removeMember,
    refetch: fetchMembers,
  }
}

export function useOrganizationInvitations(organizationId: string) {
  const { user } = useAuth()
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (organizationId) {
      fetchInvitations()
    }
  }, [organizationId])

  const fetchInvitations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('organization_invitations')
        .select('*')
        .eq('organization_id', organizationId)
        .is('accepted_at', null)

      if (error) throw error
      setInvitations(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createInvitation = async (email: string, role: 'admin' | 'member' | 'viewer') => {
    if (!user) throw new Error('Must be logged in to invite')

    try {
      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

      const { data, error } = await supabase
        .from('organization_invitations')
        .insert({
          organization_id: organizationId,
          email,
          role,
          invited_by: user.id,
          token,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      await fetchInvitations()
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const revokeInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('organization_invitations')
        .delete()
        .eq('id', invitationId)

      if (error) throw error
      await fetchInvitations()
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  return {
    invitations,
    loading,
    error,
    createInvitation,
    revokeInvitation,
    refetch: fetchInvitations,
  }
}
