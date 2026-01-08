<template>
  <AppLayout>
    <div class="mb-8 animate-fade-in">
      <h1 class="text-display-sm font-display text-navy-900 mb-2">Grant Matches</h1>
      <p class="text-navy-600">AI-powered matching based on your organization profiles</p>
    </div>

    <!-- CSO Selector -->
    <div class="card-premium mb-8" v-if="csoProfiles.length > 0">
      <label class="block text-sm font-medium text-navy-700 mb-2">Select Organization</label>
      <select v-model="selectedCsoId" @change="loadMatches" class="input w-full max-w-md">
        <option value="">Choose an organization...</option>
        <option v-for="cso in csoProfiles" :key="cso.id" :value="cso.id">
          {{ cso.name }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="card-premium animate-pulse">
        <div class="flex gap-4">
          <div class="w-16 h-16 bg-navy-200 rounded-full"></div>
          <div class="flex-1">
            <div class="h-5 bg-navy-200 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-navy-100 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Matches List -->
    <div v-else-if="matches.length > 0" class="space-y-4">
      <div 
        v-for="match in matches" 
        :key="match.grant_id" 
        class="card-premium hover:shadow-lg cursor-pointer transition-all"
        @click="viewGrant(match.grant_id, match.overall_score)"
      >
        <div class="flex items-start gap-4">
          <!-- Match Score -->
          <div class="flex-shrink-0">
            <div 
              class="w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg"
              :class="scoreClass(match.overall_score)"
            >
              {{ Math.round(match.overall_score * 100) }}%
            </div>
          </div>

          <!-- Grant Info -->
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-1">
              {{ match.grant?.title || 'Grant' }}
            </h3>
            <p class="text-sm text-navy-600 mb-2">
              {{ match.grant?.program_name || 'Unknown program' }}
            </p>
            <p class="text-sm text-navy-700 line-clamp-2">
              {{ match.grant?.description || 'No description available' }}
            </p>

            <!-- Score Breakdown -->
            <div class="flex flex-wrap gap-3 mt-3">
              <span class="text-xs text-navy-500">
                Semantic: {{ Math.round(match.semantic_score * 100) }}%
              </span>
              <span class="text-xs text-navy-500">
                Eligibility: {{ Math.round(match.eligibility_score * 100) }}%
              </span>
              <span class="text-xs text-navy-500">
                Thematic: {{ Math.round(match.thematic_score * 100) }}%
              </span>
              <span class="text-xs text-navy-500">
                Budget Fit: {{ Math.round(match.budget_fit_score * 100) }}%
              </span>
            </div>

            <!-- Issues -->
            <div v-if="match.eligibility_issues?.length" class="mt-2">
              <span 
                v-for="issue in match.eligibility_issues.slice(0, 2)" 
                :key="issue"
                class="text-xs text-amber-600 mr-2"
              >
                ⚠️ {{ issue }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex-shrink-0">
            <span v-if="match.is_eligible" class="badge badge-success">Eligible</span>
            <span v-else class="badge badge-warning">Check eligibility</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state - No CSO selected -->
    <div v-else-if="!selectedCsoId && csoProfiles.length > 0" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">Select an organization</h3>
      <p class="text-navy-600 max-w-md mx-auto">
        Choose one of your organizations above to discover matching grants based on your profile.
      </p>
    </div>

    <!-- Empty state - No CSO profiles -->
    <div v-else-if="csoProfiles.length === 0 && !loading" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">Create an organization first</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        To see matched grants, you need to create a CSO profile that describes your organization.
      </p>
      <router-link to="/cso/create" class="btn btn-primary">
        Create organization
      </router-link>
    </div>

    <!-- No matches found -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">No matches found</h3>
      <p class="text-navy-600 max-w-md mx-auto">
        We couldn't find suitable grants for this organization. Try updating your profile or check back later.
      </p>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import api from '@/services/api'
import { useFeedback } from '@/lib/useFeedback'

const router = useRouter()
const route = useRoute()
const { trackPageView, trackGrantAction } = useFeedback()

const loading = ref(false)
const csoProfiles = ref<any[]>([])
const selectedCsoId = ref('')
const matches = ref<any[]>([])

async function loadCsoProfiles() {
  try {
    const response = await api.get('/api/cso')
    csoProfiles.value = response.data.profiles || []
    
    // Check for URL parameter
    const csoParam = route.query.cso as string
    if (csoParam && csoProfiles.value.find(c => c.id === csoParam)) {
      selectedCsoId.value = csoParam
      await loadMatches()
    }
  } catch (error) {
    console.error('Error loading CSO profiles:', error)
  }
}

async function loadMatches() {
  if (!selectedCsoId.value) {
    matches.value = []
    return
  }
  
  loading.value = true
  try {
    const response = await api.post('/api/match/grants', {
      cso_id: selectedCsoId.value,
      limit: 20,
      include_ineligible: true
    })
    matches.value = response.data.matches || []
  } catch (error) {
    console.error('Error loading matches:', error)
    matches.value = []
  } finally {
    loading.value = false
  }
}

function viewGrant(grantId: string, matchScore?: number) {
  // Track view with match context
  trackGrantAction(grantId, 'view', { 
    source_page: 'matches', 
    match_score: matchScore 
  })
  router.push(`/grants/${grantId}`)
}

function scoreClass(score: number) {
  if (score >= 0.7) return 'bg-green-100 text-green-700'
  if (score >= 0.5) return 'bg-amber-100 text-amber-700'
  return 'bg-navy-100 text-navy-700'
}

onMounted(() => {
  trackPageView('matches')
  loadCsoProfiles()
})
</script>
