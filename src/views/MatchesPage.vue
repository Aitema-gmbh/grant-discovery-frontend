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

    <!-- Error Retry Banner for CSO profiles -->
    <div v-if="loadError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 animate-fade-in">
      <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-red-800">{{ $t('errors.loadOrganizations') }}</p>
        <p class="text-xs text-red-600 mt-0.5">{{ $t('errors.retryDesc') }}</p>
      </div>
      <button @click="loadCsoProfiles" class="btn btn-sm bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ $t('common.tryAgain') }}
      </button>
    </div>

    <!-- Error Retry Banner for matches -->
    <div v-if="matchError && !loading" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 animate-fade-in">
      <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-red-800">{{ $t('errors.loadMatches') }}</p>
        <p class="text-xs text-red-600 mt-0.5">{{ $t('errors.retryDesc') }}</p>
      </div>
      <button @click="loadMatches" class="btn btn-sm bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ $t('common.tryAgain') }}
      </button>
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
              <div class="flex items-center gap-2 ml-auto">
                <button
                  @click.stop="toggleImprove(match.grant_id)"
                  class="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                  :class="expandedImprove === match.grant_id ? 'bg-amber-100 text-amber-700' : 'text-stone-500 hover:bg-stone-100'"
                >
                  &#x1F4A1; {{ t('matches.improve.title') }}
                </button>
                <button
                  @click.stop="toggleRadar(match.grant_id)"
                  class="text-xs text-navy-400 hover:text-amber-500 transition-colors"
                  :aria-label="$t('matches.showRadar')"
                >
                  <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                  </svg>
                  {{ $t('matches.showRadar') }}
                </button>
              </div>
            </div>

            <!-- Radar Chart (expandable) -->
            <Transition name="slide">
              <div v-if="expandedRadar === match.grant_id" class="mt-4 flex justify-center" @click.stop>
                <svg viewBox="0 0 200 200" class="w-48 h-48" role="img" :aria-label="$t('matches.radarChart')">
                  <!-- Grid lines -->
                  <polygon v-for="level in [0.25, 0.5, 0.75, 1]" :key="level"
                    :points="radarGridPoints(level)" fill="none" stroke="#e2e8f0" stroke-width="0.5" />
                  <!-- Axes -->
                  <line v-for="(_, i) in 4" :key="'ax'+i"
                    x1="100" y1="100"
                    :x2="100 + 80 * Math.cos((i * Math.PI / 2) - Math.PI / 2)"
                    :y2="100 + 80 * Math.sin((i * Math.PI / 2) - Math.PI / 2)"
                    stroke="#cbd5e1" stroke-width="0.5" />
                  <!-- Data polygon -->
                  <polygon
                    :points="radarDataPoints(match)"
                    fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="2"
                  />
                  <!-- Data dots -->
                  <circle v-for="(pt, i) in radarDataPointsArray(match)" :key="'dot'+i"
                    :cx="pt.x" :cy="pt.y" r="3" fill="#f59e0b" />
                  <!-- Labels -->
                  <text x="100" y="10" text-anchor="middle" class="text-[9px] fill-navy-600">{{ $t('matches.semantic') }}</text>
                  <text x="190" y="104" text-anchor="start" class="text-[9px] fill-navy-600">{{ $t('matches.eligibilityScore') }}</text>
                  <text x="100" y="198" text-anchor="middle" class="text-[9px] fill-navy-600">{{ $t('matches.thematic') }}</text>
                  <text x="10" y="104" text-anchor="end" class="text-[9px] fill-navy-600">{{ $t('matches.budgetFit') }}</text>
                </svg>
              </div>
            </Transition>

            <!-- Improvement Tips (expandable) -->
            <Transition name="expand">
              <div v-if="expandedImprove === match.grant_id" class="mt-4 pt-4 border-t border-stone-100" @click.stop>
                <div class="space-y-3">
                  <div v-for="tip in getImprovementTips(match)" :key="tip.dimension"
                    class="flex items-start gap-3 p-3 rounded-lg border" :class="getStatusColor(tip.status)">
                    <span class="text-sm mt-0.5">{{ getStatusIcon(tip.status) }}</span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-semibold">{{ t(tip.labelKey) }}</span>
                        <span class="text-xs font-bold">{{ tip.score }}%</span>
                        <span v-if="tip.status === 'good'" class="text-[10px]">{{ t('matches.improve.goodFit') }}</span>
                      </div>
                      <p v-if="tip.status !== 'good'" class="text-[11px] opacity-80 mb-2">{{ t(tip.tipKey) }}</p>
                      <router-link v-if="tip.status !== 'good'" :to="tip.actionTo"
                        class="text-[11px] font-medium underline hover:no-underline">
                        {{ t(tip.actionLabel) }} &rarr;
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

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
const loadError = ref(false)
const matchError = ref(false)

async function loadCsoProfiles() {
  loadError.value = false
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
    loadError.value = true
    toast.error(t('errors.loadOrganizations'))
  }
}

async function loadMatches() {
  if (!selectedCsoId.value) {
    matches.value = []
    return
  }

  loading.value = true
  matchError.value = false
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
    matchError.value = true
    toast.error(t('errors.loadMatches'))
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

// Match Score Drill-Down
const expandedImprove = ref<string | null>(null)

function toggleImprove(matchId: string) {
  expandedImprove.value = expandedImprove.value === matchId ? null : matchId
}

interface ImproveTip {
  dimension: string
  labelKey: string
  score: number
  status: 'good' | 'warning' | 'critical'
  tipKey: string
  actionLabel: string
  actionTo: string
}

function getImprovementTips(match: any): ImproveTip[] {
  const tips: ImproveTip[] = []
  const csoId = selectedCsoId.value || ''

  const dims = [
    { key: 'semantic_score', label: 'matches.improve.semantic', tip: 'matches.improve.semanticTip', action: 'matches.improve.updateProfile', to: `/cso/${csoId}` },
    { key: 'eligibility_score', label: 'matches.improve.eligibility', tip: 'matches.improve.eligibilityTip', action: 'matches.improve.reviewGrant', to: `/grants/${match.grant_id}` },
    { key: 'thematic_score', label: 'matches.improve.thematic', tip: 'matches.improve.thematicTip', action: 'matches.improve.updateProfile', to: `/cso/${csoId}` },
    { key: 'budget_fit_score', label: 'matches.improve.budget', tip: 'matches.improve.budgetTip', action: 'matches.improve.adjustBudget', to: `/cso/${csoId}` },
  ]

  dims.forEach(d => {
    const score = match[d.key] ?? 0
    const pct = Math.round(score * 100)
    let status: 'good' | 'warning' | 'critical' = 'good'
    if (pct < 40) status = 'critical'
    else if (pct < 70) status = 'warning'

    tips.push({
      dimension: d.key,
      labelKey: d.label,
      score: pct,
      status,
      tipKey: d.tip,
      actionLabel: d.action,
      actionTo: d.to
    })
  })

  return tips
}

function getStatusColor(status: string): string {
  if (status === 'good') return 'bg-green-100 text-green-700 border-green-200'
  if (status === 'warning') return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-red-100 text-red-700 border-red-200'
}

function getStatusIcon(status: string): string {
  if (status === 'good') return '\u2705'
  if (status === 'warning') return '\u26A0\uFE0F'
  return '\uD83D\uDEAB'
}

// Radar chart
const expandedRadar = ref<string | null>(null)

function toggleRadar(grantId: string) {
  expandedRadar.value = expandedRadar.value === grantId ? null : grantId
}

function radarPoint(value: number, index: number, radius = 80): { x: number; y: number } {
  const angle = (index * Math.PI / 2) - Math.PI / 2
  return {
    x: 100 + radius * value * Math.cos(angle),
    y: 100 + radius * value * Math.sin(angle)
  }
}

function radarGridPoints(level: number): string {
  return [0, 1, 2, 3].map(i => {
    const pt = radarPoint(level, i)
    return `${pt.x},${pt.y}`
  }).join(' ')
}

function radarDataPointsArray(match: any): { x: number; y: number }[] {
  const scores = [
    match.semantic_score || 0,
    match.eligibility_score || 0,
    match.thematic_score || 0,
    match.budget_fit_score || 0
  ]
  return scores.map((s, i) => radarPoint(s, i))
}

function radarDataPoints(match: any): string {
  return radarDataPointsArray(match).map(pt => `${pt.x},${pt.y}`).join(' ')
}

onMounted(() => {
  trackPageView('matches')
  loadCsoProfiles()
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to, .slide-leave-from {
  opacity: 1;
  max-height: 300px;
}
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
