<template>
  <AppLayout>
    <div class="mb-8 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('cso.title') }}</h1>
          <p class="text-navy-600">{{ $t('cso.subtitle') }}</p>
        </div>
        <div class="flex gap-3">
          <router-link to="/cso/smart" class="btn-ukraine flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {{ $t('cso.aiQuickSetup') }} ✨
          </router-link>
          <router-link to="/cso/create" class="btn btn-secondary">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('cso.manualSetup') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="i in 4" :key="i" class="card-premium animate-pulse">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-12 h-12 bg-navy-200 rounded-xl"></div>
          <div class="flex-1">
            <div class="h-5 bg-navy-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-navy-100 rounded w-1/2"></div>
          </div>
        </div>
        <div class="space-y-2 mb-4">
          <div class="h-3 bg-navy-100 rounded w-full"></div>
          <div class="h-3 bg-navy-100 rounded w-5/6"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-6 bg-navy-100 rounded-full w-16"></div>
          <div class="h-6 bg-navy-100 rounded-full w-20"></div>
        </div>
      </div>
    </div>

    <!-- CSO List -->
    <div v-else-if="csoProfiles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cso in csoProfiles"
        :key="cso.id"
        class="card-premium hover:shadow-lg cursor-pointer transition-all"
        @click="viewCsoDetails(cso)"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-navy-900 font-display">{{ cso.name }}</h3>
            <p class="text-sm text-navy-600">{{ cso.org_type }} • {{ cso.headquarters_country }}</p>
          </div>
          <span class="badge badge-success">{{ $t('cso.active') }}</span>
        </div>

        <p class="text-sm text-navy-700 line-clamp-2 mb-4">
          {{ cso.mission_statement || cso.description || $t('cso.noDescription') }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="area in parseFocusAreas(cso.focus_areas).slice(0, 3)"
            :key="area"
            class="px-2 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium"
          >
            {{ area }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-navy-100">
          <span class="text-sm text-navy-600">
            {{ $t('cso.experience') }} {{ cso.grant_experience_level || $t('cso.notSpecified') }}
          </span>
          <button @click.stop="findMatches(cso.id)" class="text-sm text-amber-600 hover:text-amber-700 font-medium">
            {{ $t('cso.findMatches') }} →
          </button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('cso.noOrganizations') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        {{ $t('cso.createFirst') }}
      </p>
      <router-link to="/cso/create" class="btn btn-primary">
        {{ $t('cso.createFirstOrg') }}
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const loading = ref(true)
const csoProfiles = ref<any[]>([])

async function loadProfiles() {
  loading.value = true
  try {
    // Request user's organizations (backend should filter by authenticated user)
    const response = await api.get('/api/cso', {
      params: { user_id: authStore.userId }
    })
    let profiles = response.data.profiles || []

    // Client-side fallback: filter by owner_id if backend returns all profiles
    if (authStore.userId && profiles.length > 0 && profiles[0].owner_id) {
      profiles = profiles.filter((p: any) => p.owner_id === authStore.userId)
    }

    csoProfiles.value = profiles
  } catch (error) {
    console.error('Error loading CSO profiles:', error)
    toast.error(t('errors.loadOrganizations'))
    csoProfiles.value = []
  } finally {
    loading.value = false
  }
}

function parseFocusAreas(focusAreas: string | string[] | null): string[] {
  if (!focusAreas) return []
  if (Array.isArray(focusAreas)) return focusAreas
  try {
    return JSON.parse(focusAreas)
  } catch {
    return []
  }
}

function viewCsoDetails(cso: any) {
  router.push(`/cso/${cso.id}`)
}

function findMatches(csoId: string) {
  router.push(`/matches?cso=${csoId}`)
}

onMounted(() => {
  loadProfiles()
})
</script>
