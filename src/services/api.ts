/**
 * API Service
 *
 * Axios instance configured for Grant Discovery API
 * Automatically attaches Supabase JWT tokens to requests
 */

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

/**
 * Create Axios instance with default config
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor: Add Supabase JWT token to Authorization header
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()

    // Add Bearer token if user is authenticated
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor: Handle auth errors
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()

      // Token expired or invalid - logout user
      authStore.logout()

      // Redirect to login page
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// =============================================================================
// GRANTS API
// =============================================================================

export interface Grant {
  id: string
  title: string
  description: string
  url: string
  program_name?: string
  deadline?: string
  amount_min?: number
  amount_max?: number
  currency: string
  eligible_countries: string[]
  topics: string[]
  category?: string
  status: string
}

export const grantsApi = {
  /**
   * Search grants (public endpoint)
   */
  search: async (params: {
    query?: string
    category?: string
    status?: string
    limit?: number
    offset?: number
  }) => {
    const response = await api.get<{ success: boolean; grants: Grant[]; total: number }>(
      '/api/grants',
      { params }
    )
    return response.data
  },

  /**
   * Get single grant by ID
   */
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; grant: Grant }>(`/api/grants/${id}`)
    return response.data
  },

  /**
   * Find similar grants (semantic search)
   */
  findSimilar: async (id: string, limit = 10) => {
    const response = await api.get<{ success: boolean; grants: Grant[] }>(
      `/api/grants/${id}/similar`,
      { params: { limit } }
    )
    return response.data
  },
}

// =============================================================================
// CSO API
// =============================================================================

export interface CSOProfile {
  id: string
  name: string
  org_type: string
  registration_country: string
  headquarters_country: string
  operating_countries: string[]
  focus_areas: string[]
  annual_budget_eur?: number
  grant_experience_level: string
  created_at: string
}

export const csoApi = {
  /**
   * Create CSO profile (requires auth)
   */
  create: async (data: Partial<CSOProfile>) => {
    const response = await api.post<{ success: boolean; cso_id: string; cso: CSOProfile }>(
      '/api/cso',
      data
    )
    return response.data
  },

  /**
   * Get CSO profiles for current user
   */
  getAll: async () => {
    const response = await api.get<{ success: boolean; csos: CSOProfile[] }>('/api/cso')
    return response.data
  },

  /**
   * Get single CSO profile
   */
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; cso: CSOProfile }>(`/api/cso/${id}`)
    return response.data
  },

  /**
   * Update CSO profile
   */
  update: async (id: string, data: Partial<CSOProfile>) => {
    const response = await api.put<{ success: boolean; cso: CSOProfile }>(`/api/cso/${id}`, data)
    return response.data
  },
}

// =============================================================================
// MATCHING API
// =============================================================================

export interface GrantMatch {
  id: string
  grant_id: string
  cso_id: string
  overall_score: number
  semantic_score: number
  eligibility_score: number
  thematic_score: number
  status: string
  grant?: Grant
}

export const matchingApi = {
  /**
   * Find matching grants for CSO
   */
  findGrants: async (csoId: string, params?: { limit?: number; min_score?: number }) => {
    const response = await api.post<{ success: boolean; matches: GrantMatch[] }>(
      '/api/match/grants',
      { cso_id: csoId, ...params }
    )
    return response.data
  },

  /**
   * Get stored matches for CSO
   */
  getMatches: async (csoId: string) => {
    const response = await api.get<{ success: boolean; matches: GrantMatch[] }>(
      `/api/match/cso/${csoId}`
    )
    return response.data
  },

  /**
   * Update match status
   */
  updateStatus: async (matchId: string, status: string) => {
    const response = await api.patch<{ success: boolean }>(
      `/api/match/${matchId}`,
      { status }
    )
    return response.data
  },
}

// =============================================================================
// PROPOSALS API (Layer 3 - Grant Writing)
// =============================================================================

export interface Proposal {
  id: string
  grant_id: string
  cso_id: string
  title: string
  status: string
  total_budget?: number
  created_at: string
  updated_at: string
}

export interface ProposalSection {
  id: string
  proposal_id: string
  section_type: string
  content: string
  word_count: number
  ai_model_used: string
  created_at: string
}

export type SectionType = 'objectives' | 'methodology' | 'impact' | 'work_plan' | 'budget_narrative' | 'sustainability' | 'background' | 'partners'

export const proposalsApi = {
  /**
   * Create new proposal
   */
  create: async (data: { grant_id: string; cso_id: string; title?: string }) => {
    const response = await api.post<{ success: boolean; proposal_id: string; proposal: Proposal }>(
      '/api/proposals',
      data
    )
    return response.data
  },

  /**
   * Get proposal by ID
   */
  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; proposal: Proposal; sections: ProposalSection[] }>(
      `/api/proposals/${id}`
    )
    return response.data
  },

  /**
   * List proposals for current user
   */
  getAll: async () => {
    const response = await api.get<{ success: boolean; proposals: Proposal[] }>('/api/proposals')
    return response.data
  },

  /**
   * Generate a single section with streaming support
   * Returns a ReadableStream for real-time text display
   */
  generateSectionStream: (proposalId: string, sectionType: SectionType, thinkingLevel: 'basic' | 'standard' | 'extended' = 'standard') => {
    const authStore = useAuthStore()
    const url = `${API_BASE_URL}/api/proposals/${proposalId}/generate-section`

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.accessToken}`,
      },
      body: JSON.stringify({ section_type: sectionType, thinking_level: thinkingLevel, stream: true }),
    })
  },

  /**
   * Generate section (non-streaming, returns complete result)
   */
  generateSection: async (proposalId: string, sectionType: SectionType, thinkingLevel: 'basic' | 'standard' | 'extended' = 'standard') => {
    const response = await api.post<{ success: boolean; section: ProposalSection }>(
      `/api/proposals/${proposalId}/generate-section`,
      { section_type: sectionType, thinking_level: thinkingLevel }
    )
    return response.data
  },

  /**
   * Get all sections for a proposal
   */
  getSections: async (proposalId: string) => {
    const response = await api.get<{ success: boolean; sections: ProposalSection[] }>(
      `/api/proposals/${proposalId}/sections`
    )
    return response.data
  },

  /**
   * Delete a proposal
   */
  delete: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(`/api/proposals/${id}`)
    return response.data
  },
}

export default api
