// Database types (will be generated from Supabase schema)
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
      }
      system_roles: {
        Row: {
          user_id: string
          role: 'platform_admin' | 'developer' | 'support'
          created_at: string
        }
        Insert: {
          user_id: string
          role: 'platform_admin' | 'developer' | 'support'
          created_at?: string
        }
        Update: {
          user_id?: string
          role?: 'platform_admin' | 'developer' | 'support'
        }
      }
    }
  }
}
