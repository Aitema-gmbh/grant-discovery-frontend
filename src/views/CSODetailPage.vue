<template>
  <AppLayout>
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="h-4 bg-navy-200 rounded w-48 mb-6"></div>
      <div class="h-8 bg-navy-200 rounded w-2/3 mb-2"></div>
      <div class="h-4 bg-navy-100 rounded w-1/3 mb-8"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 card h-64 bg-navy-50"></div>
        <div class="card h-48 bg-navy-50"></div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else-if="profile">
      <!-- Breadcrumb -->
      <BreadcrumbNav :crumbs="[
        { label: $t('cso.title'), to: '/cso' },
        { label: profile.name }
      ]" />

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-display-sm font-display text-navy-900">{{ profile.name }}</h1>
            <span class="badge badge-success">{{ $t('cso.active') }}</span>
          </div>
          <p class="text-navy-600">
            {{ profile.org_type }} <span v-if="profile.headquarters_country">• {{ profile.headquarters_country }}</span>
          </p>
        </div>
        <div class="flex gap-3">
          <button @click="findMatches" class="btn btn-secondary">
            {{ $t('cso.findMatches') }}
          </button>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Mission / Description -->
          <div class="card">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-4">{{ $t('csoDetail.about') }}</h3>
            <p v-if="profile.mission_statement" class="text-navy-700 mb-4">
              {{ profile.mission_statement }}
            </p>
            <p v-if="profile.description" class="text-navy-600">
              {{ profile.description }}
            </p>
            <p v-if="!profile.mission_statement && !profile.description" class="text-navy-500 italic">
              {{ $t('cso.noDescription') }}
            </p>
          </div>

          <!-- Focus Areas -->
          <div v-if="focusAreas.length > 0" class="card">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-4">{{ $t('cso.focusAreas') }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="area in focusAreas"
                :key="area"
                class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
              >
                {{ area }}
              </span>
            </div>
          </div>

          <!-- Matched Grants -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-navy-900 font-display">{{ $t('csoDetail.matchedGrants') }}</h3>
              <button @click="findMatches" class="text-sm text-amber-600 hover:text-amber-700 font-medium">
                {{ $t('common.viewAll') }} →
              </button>
            </div>

            <div v-if="loadingMatches" class="space-y-3">
              <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3 p-3 bg-navy-50 rounded-lg">
                <div class="w-12 h-12 bg-navy-200 rounded-full"></div>
                <div class="flex-1">
                  <div class="h-4 bg-navy-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-navy-100 rounded w-1/2"></div>
                </div>
              </div>
            </div>

            <div v-else-if="topMatches.length > 0" class="space-y-3">
              <router-link
                v-for="match in topMatches"
                :key="match.grant_id"
                :to="`/grants/${match.grant_id}`"
                class="flex items-center gap-3 p-3 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
              >
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  :class="match.overall_score >= 0.7 ? 'bg-green-100 text-green-700' : match.overall_score >= 0.5 ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-700'"
                >
                  {{ Math.round(match.overall_score * 100) }}%
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-navy-900 truncate">{{ match.grant?.title || 'Grant' }}</p>
                  <p class="text-xs text-navy-500">{{ match.grant?.program_name || '' }}</p>
                </div>
              </router-link>
            </div>

            <div v-else class="text-center py-6">
              <p class="text-sm text-navy-500">{{ $t('csoDetail.noMatchesYet') }}</p>
              <button @click="findMatches" class="text-sm text-amber-600 hover:text-amber-700 font-medium mt-2">
                {{ $t('csoDetail.runMatching') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Facts -->
        <div class="space-y-6">
          <!-- Quick Facts Card -->
          <div class="card">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-4">{{ $t('csoDetail.quickFacts') }}</h3>
            <dl class="space-y-4">
              <div v-if="profile.org_type">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('cso.type') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ profile.org_type }}</dd>
              </div>
              <div v-if="profile.headquarters_country">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('cso.country') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ profile.headquarters_country }}</dd>
              </div>
              <div v-if="profile.registration_country">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('csoDetail.registered') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ profile.registration_country }}</dd>
              </div>
              <div v-if="operatingCountries.length > 0">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('csoDetail.operatingIn') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ operatingCountries.join(', ') }}</dd>
              </div>
              <div v-if="profile.annual_budget_eur">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('cso.annualBudget') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">€{{ profile.annual_budget_eur.toLocaleString() }}</dd>
              </div>
              <div v-if="profile.staff_count">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('cso.teamSize') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ profile.staff_count }}</dd>
              </div>
              <div v-if="profile.grant_experience_level">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('csoDetail.grantExperience') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ profile.grant_experience_level }}</dd>
              </div>
              <div v-if="profile.website">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('cso.website') }}</dt>
                <dd class="mt-1">
                  <a :href="profile.website.startsWith('http') ? profile.website : `https://${profile.website}`" target="_blank" rel="noopener noreferrer" class="text-sm text-amber-600 hover:text-amber-700 font-medium">
                    {{ profile.website }} ↗
                  </a>
                </dd>
              </div>
              <div v-if="profile.created_at">
                <dt class="text-xs font-medium text-navy-500 uppercase tracking-wide">{{ $t('csoDetail.memberSince') }}</dt>
                <dd class="text-sm text-navy-900 font-medium mt-1">{{ new Date(profile.created_at).toLocaleDateString() }}</dd>
              </div>
            </dl>
          </div>

          <!-- Languages -->
          <div v-if="languages.length > 0" class="card">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-4">{{ $t('csoDetail.languages') }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="lang in languages"
                :key="lang"
                class="px-2.5 py-1 bg-navy-100 text-navy-700 rounded-full text-xs font-medium"
              >
                {{ lang }}
              </span>
            </div>
          </div>

          <!-- Target Groups -->
          <div v-if="targetGroups.length > 0" class="card">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-4">{{ $t('csoDetail.targetGroups') }}</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="group in targetGroups"
                :key="group"
                class="px-2.5 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium"
              >
                {{ group }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('csoDetail.notFound') }}</h3>
      <p class="text-navy-600 mb-6">{{ $t('csoDetail.notFoundDesc') }}</p>
      <router-link to="/cso" class="btn btn-primary">
        {{ $t('csoDetail.backToOrgs') }}
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const loadingMatches = ref(false)
const profile = ref<any>(null)
const topMatches = ref<any[]>([])

function parseArray(value: string | string[] | null): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const focusAreas = computed(() => parseArray(profile.value?.focus_areas))
const operatingCountries = computed(() => parseArray(profile.value?.operating_countries))
const languages = computed(() => parseArray(profile.value?.languages))
const targetGroups = computed(() => parseArray(profile.value?.target_groups))

async function loadProfile() {
  loading.value = true
  try {
    const response = await api.get(`/api/cso/${route.params.id}`)
    profile.value = response.data.cso || response.data.profile || response.data
  } catch (error) {
    console.error('Error loading CSO profile:', error)
    toast.error('Failed to load organization profile.')
    profile.value = null
  } finally {
    loading.value = false
  }
}

async function loadTopMatches() {
  if (!profile.value?.id) return
  loadingMatches.value = true
  try {
    const response = await api.post('/api/match/grants', {
      cso_id: profile.value.id,
      limit: 5,
      include_ineligible: false
    })
    topMatches.value = response.data.matches || []
  } catch (error) {
    console.error('Error loading matches:', error)
  } finally {
    loadingMatches.value = false
  }
}

function findMatches() {
  router.push(`/matches?cso=${route.params.id}`)
}

onMounted(async () => {
  await loadProfile()
  if (profile.value) {
    loadTopMatches()
  }
})
</script>
