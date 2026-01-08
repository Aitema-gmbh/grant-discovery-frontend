/**
 * Supabase Client for Frontend
 *
 * Manages authentication and database access
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.aitema.de'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn('VITE_SUPABASE_ANON_KEY is not set. Authentication will not work.')
}

/**
 * Supabase client singleton
 *
 * Configured for frontend use with:
 * - Session persistence in localStorage
 * - Automatic token refresh
 * - OAuth redirect detection
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Persist auth session in localStorage
    autoRefreshToken: true, // Automatically refresh tokens before expiry
    detectSessionInUrl: true, // Detect OAuth redirects
    storageKey: 'grant-discovery-auth', // Custom storage key
  },
})

// Database Types (matches Supabase schema)
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          organization_name: string | null
          role: 'cso_user' | 'cso_admin' | 'platform_admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      cso_profiles: {
        Row: {
          id: string
          owner_id: string
          name: string
          org_type: string
          registration_country: string
          headquarters_country: string
          operating_countries: string[]
          focus_areas: string[]
          target_groups: string[]
          thematic_keywords: string[]
          staff_count: number | null
          annual_budget_eur: number | null
          grant_experience_level: 'beginner' | 'intermediate' | 'experienced' | 'expert'
          preferred_grant_size_min: number | null
          preferred_grant_size_max: number | null
          eligible_for_eu_funding: boolean
          eligible_for_us_funding: boolean
          min_match_score: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['cso_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['cso_profiles']['Insert']>
      }
      cso_team_members: {
        Row: {
          id: string
          cso_id: string
          user_id: string
          role: 'member' | 'admin' | 'approver' | 'viewer'
          permissions: string[]
          invited_by: string | null
          invited_at: string
          joined_at: string | null
          is_active: boolean
          created_at: string
        }
      }
    }
  }
}

// Export typed client
export type SupabaseClient = typeof supabase
