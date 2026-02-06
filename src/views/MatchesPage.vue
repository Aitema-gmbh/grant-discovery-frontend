<template>
  <AppLayout>
    <div class="mb-8 animate-fade-in">
      <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('matches.title') }}</h1>
      <p class="text-navy-600">{{ $t('matches.subtitle') }}</p>
    </div>

    <!-- CSO Selector -->
    <div class="card-premium mb-8" v-if="csoProfiles.length > 0">
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-navy-700">{{ $t('matches.selectOrganization') }}</label>
        <button
          v-if="matches.length > 0"
          @click="exportMatchesCsv"
          class="btn btn-outline btn-sm inline-flex items-center gap-1.5"
          :aria-label="$t('matches.exportCsv')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          CSV
        </button>
      </div>
      <select v-model="selectedCsoId" @change="loadMatches" class="input w-full max-w-md" :aria-label="$t('matches.selectOrganization')">
        <option value="">{{ $t('matches.chooseOrg') }}</option>
        <option v-for="cso in csoProfiles" :key="cso.id" :value="cso.id">
          {{ cso.name }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="card-premium animate-pulse">
        <div class="flex gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-amber-100 to-navy-100 rounded-full"></div>
          <div class="flex-1">
            <div class="h-5 bg-navy-200 rounded w-3/5 mb-2"></div>
            <div class="h-4 bg-navy-100 rounded w-2/5 mb-3"></div>
            <div class="h-3 bg-navy-100 rounded w-full mb-1.5"></div>
            <div class="h-3 bg-navy-100 rounded w-4/5 mb-3"></div>
            <div class="flex gap-3">
              <div class="h-5 bg-navy-100 rounded w-20"></div>
              <div class="h-5 bg-navy-100 rounded w-20"></div>
              <div class="h-5 bg-navy-100 rounded w-20"></div>
            </div>
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
              role="meter"
              :aria-valuenow="Math.round(match.overall_score * 100)"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="$t('matches.overallScore')"
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
              {{ match.grant?.program_name || $t('matches.unknownProgram') }}
            </p>
            <p class="text-sm text-navy-700 line-clamp-2">
              {{ match.grant?.description || $t('matches.noDescription') }}
            </p>

            <!-- Score Breakdown -->
            <div class="flex flex-wrap gap-3 mt-3 items-center">
              <span class="text-xs text-navy-500 inline-flex items-center gap-1">
                {{ $t('matches.semantic') }}: {{ Math.round(match.semantic_score * 100) }}%
                <HelpTooltip :content="$t('matches.help.semantic')" position="bottom" />
              </span>
              <span class="text-xs text-navy-500 inline-flex items-center gap-1">
                {{ $t('matches.eligibilityScore') }}: {{ Math.round(match.eligibility_score * 100) }}%
                <HelpTooltip :content="$t('matches.help.eligibility')" position="bottom" />
              </span>
              <span class="text-xs text-navy-500 inline-flex items-center gap-1">
                {{ $t('matches.thematic') }}: {{ Math.round(match.thematic_score * 100) }}%
                <HelpTooltip :content="$t('matches.help.thematic')" position="bottom" />
              </span>
              <span class="text-xs text-navy-500 inline-flex items-center gap-1">
                {{ $t('matches.budgetFit') }}: {{ Math.round(match.budget_fit_score * 100) }}%
                <HelpTooltip :content="$t('matches.help.budgetFit')" position="bottom" />
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
            <span v-if="match.is_eligible" class="badge badge-success">{{ $t('matches.eligible') }}</span>
            <span v-else class="badge badge-warning">{{ $t('matches.checkEligibility') }}</span>
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
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('matches.selectAnOrg') }}</h3>
      <p class="text-navy-600 max-w-md mx-auto">
        {{ $t('matches.selectAnOrgDesc') }}
      </p>
    </div>

    <!-- Empty state - No CSO profiles -->
    <div v-else-if="csoProfiles.length === 0 && !loading" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('matches.createOrgFirst') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        {{ $t('matches.createOrgFirstDesc') }}
      </p>
      <router-link to="/cso/create" class="btn btn-primary">
        {{ $t('matches.createOrganization') }}
      </router-link>
    </div>

    <!-- No matches found -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('matches.noMatches') }}</h3>
      <p class="text-navy-600 mb-4 max-w-md mx-auto">
        {{ $t('matches.noMatchesDesc') }}
      </p>
      <ul class="text-sm text-navy-500 mb-6 space-y-2 max-w-sm mx-auto text-left">
        <li class="flex items-start gap-2">
          <span class="text-amber-500 mt-0.5">•</span>
          {{ $t('matches.emptyTips.tip1') }}
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 mt-0.5">•</span>
          {{ $t('matches.emptyTips.tip2') }}
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 mt-0.5">•</span>
          {{ $t('matches.emptyTips.tip3') }}
        </li>
      </ul>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/cso" class="btn btn-primary">
          {{ $t('matches.emptyTips.updateProfile') }}
        </router-link>
        <router-link to="/grants" class="btn btn-outline">
          {{ $t('matches.emptyTips.browseManually') }}
        </router-link>
      </div>
    </div>
    <ScrollToTop />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import api from '@/services/api'
import { useFeedback } from '@/lib/useFeedback'
import { usePageTitle } from '@/lib/usePageTitle'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/lib/useToast'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const authStore = useAuthStore()
const { trackPageView, trackGrantAction } = useFeedback()
const toast = useToast()
usePageTitle(t('nav.matches'))

const loading = ref(false)
const csoProfiles = ref<any[]>([])
const selectedCsoId = ref('')
const matches = ref<any[]>([])

async function loadCsoProfiles() {
  try {
    const response = await api.get('/api/cso', {
      params: { user_id: authStore.userId }
    })
    let profiles = response.data.profiles || []

    // Client-side fallback: filter by owner_id if backend returns all profiles
    if (authStore.userId && profiles.length > 0 && profiles[0].owner_id) {
      profiles = profiles.filter((p: any) => p.owner_id === authStore.userId)
    }

    csoProfiles.value = profiles

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
    toast.error('Failed to load matches. Please try again.')
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

function exportMatchesCsv() {
  const headers = ['Grant Title', 'Program', 'Overall Score', 'Semantic Score', 'Eligible', 'Eligibility Issues']
  const rows = matches.value.map((m: any) => [
    `"${(m.grant?.title || '').replace(/"/g, '""')}"`,
    `"${(m.grant?.program_name || '').replace(/"/g, '""')}"`,
    Math.round(m.overall_score * 100) + '%',
    Math.round(m.semantic_score * 100) + '%',
    m.is_eligible ? 'Yes' : 'No',
    `"${(m.eligibility_issues || []).join('; ').replace(/"/g, '""')}"`
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `matches-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success(t('matches.csvExported'))
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
