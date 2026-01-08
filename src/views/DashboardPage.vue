<template>
  <AppLayout>
    <!-- Welcome Section with Gradient Background -->
    <div class="mb-12 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 rounded-3xl opacity-50"></div>
      <div class="relative p-8 animate-fade-in">
        <h2 class="text-display-sm font-display text-navy-900 gradient-text">
          🇺🇦 Welcome back, {{ displayName }}!
        </h2>
        <p class="mt-3 text-lg text-navy-600 font-sans">
          Connecting Ukrainian civil society with global funding opportunities
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
      <!-- Active Grants -->
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-inner-soft">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="badge badge-warning">Live</span>
        </div>
        <div class="stat-label">Active Grants</div>
        <div class="stat-value">
          {{ stats.activeGrants !== null ? stats.activeGrants.toLocaleString() : '...' }}
        </div>
        <p class="mt-2 text-sm text-sage-600 font-medium">
          <span class="inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
            </svg>
            +{{ stats.activeGrantsChange || 12 }}% this month
          </span>
        </p>
      </div>

      <!-- Matched Grants -->
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center shadow-inner-soft">
            <svg class="w-6 h-6 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="badge badge-success">AI</span>
        </div>
        <div class="stat-label">Matched Grants</div>
        <div class="stat-value">
          {{ stats.matchedGrants !== null ? stats.matchedGrants.toLocaleString() : '...' }}
        </div>
        <p class="mt-2 text-sm text-navy-500">
          Based on your organization profile
        </p>
      </div>

      <!-- CSO Profiles -->
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center shadow-inner-soft">
            <svg class="w-6 h-6 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="badge badge-info">Profile</span>
        </div>
        <div class="stat-label">My Organizations</div>
        <div class="stat-value">
          {{ stats.csoProfiles !== null ? stats.csoProfiles : '...' }}
        </div>
        <p class="mt-2 text-sm text-navy-500">
          CSO profiles configured
        </p>
      </div>

      <!-- Upcoming Deadlines -->
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-inner-soft">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="badge badge-warning">Urgent</span>
        </div>
        <div class="stat-label">Deadlines Soon</div>
        <div class="stat-value">
          {{ stats.upcomingDeadlines !== null ? stats.upcomingDeadlines : '...' }}
        </div>
        <p class="mt-2 text-sm text-amber-600 font-medium">
          Next 30 days
        </p>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <div class="card animate-slide-up" style="animation-delay: 0.1s">
          <div class="section-header">
            <h3 class="section-title">Recent Activity</h3>
            <button class="link text-sm">
              View all →
            </button>
          </div>

          <div v-if="recentActivity.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-navy-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p class="text-lg font-medium text-navy-700">No recent activity yet</p>
            <p class="text-sm text-navy-500 mt-2">Start browsing grants to see activity here</p>
            <router-link to="/grants" class="btn btn-primary inline-flex mt-6">
              Browse Grants
            </router-link>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(activity, index) in recentActivity" :key="activity.id"
              class="flex items-start gap-4 p-4 bg-stone-50 rounded-xl hover:shadow-soft transition-all duration-200 animate-scale-in"
              :style="`animation-delay: ${0.1 + index * 0.05}s`">
              <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="activityIconClass(activity.type)">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="activity.type === 'match'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  <path v-else-if="activity.type === 'grant'" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path v-else fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-navy-900">{{ activity.title }}</p>
                <p class="text-sm text-navy-600 mt-1">{{ activity.description }}</p>
                <p class="text-xs text-navy-400 mt-2 font-mono">{{ activity.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Upcoming Deadlines -->
      <div class="space-y-8">
        <!-- Quick Actions -->
        <div class="card animate-slide-up" style="animation-delay: 0.2s">
          <h3 class="section-title mb-6">Quick Actions</h3>
          <div class="space-y-3">
            <router-link to="/grants"
              class="block p-4 bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-glow-amber rounded-xl transition-all duration-300 group border border-amber-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-soft">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-navy-900 group-hover:text-amber-800 transition-colors">Browse Grants</p>
                  <p class="text-sm text-navy-600">Discover new opportunities</p>
                </div>
              </div>
            </router-link>

            <router-link to="/onboarding/setup"
              class="block p-4 bg-gradient-to-br from-sage-50 to-sage-100 hover:shadow-glow-sage rounded-xl transition-all duration-300 group border border-sage-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-sage-600 rounded-lg flex items-center justify-center shadow-soft">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-navy-900 group-hover:text-sage-800 transition-colors">Create CSO Profile</p>
                  <p class="text-sm text-navy-600">Set up your organization</p>
                </div>
              </div>
            </router-link>

            <router-link to="/matches"
              class="block p-4 bg-gradient-to-br from-navy-50 to-navy-100 hover:shadow-soft-lg rounded-xl transition-all duration-300 group border border-navy-200">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-navy-900 rounded-lg flex items-center justify-center shadow-soft">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-navy-900 group-hover:text-navy-700 transition-colors">View Matches</p>
                  <p class="text-sm text-navy-600">AI-matched grants for you</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Upcoming Deadlines List -->
        <div class="card animate-slide-up" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-6">
            <h3 class="section-title">Upcoming Deadlines</h3>
            <HelpTooltip
              content="Grants with deadlines in the next 30 days"
              position="left"
            />
          </div>

          <div v-if="upcomingDeadlinesList.length === 0" class="text-center py-8">
            <div class="w-12 h-12 mx-auto mb-3 bg-navy-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <p class="text-sm text-navy-600 font-medium">No upcoming deadlines</p>
            <p class="text-xs text-navy-400 mt-1">Saved grants will appear here</p>
          </div>

          <div v-else class="space-y-3">
            <div v-for="(deadline, index) in upcomingDeadlinesList" :key="deadline.id"
              class="p-4 border-l-4 rounded-r-xl hover:shadow-soft transition-all duration-200 cursor-pointer animate-scale-in"
              :class="deadlineBorderClass(deadline.daysLeft)"
              :style="`animation-delay: ${0.3 + index * 0.05}s`">
              <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0 pr-3">
                  <p class="text-sm font-semibold text-navy-900 truncate">
                    {{ deadline.title }}
                  </p>
                  <p class="text-xs text-navy-600 mt-1 font-medium">
                    {{ deadline.organization }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-bold" :class="deadlineTextClass(deadline.daysLeft)">
                    {{ deadline.daysLeft }} days
                  </p>
                  <p class="text-xs text-navy-400 font-mono">{{ deadline.date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section (if we have data) -->
    <div v-if="stats.activeGrants && stats.activeGrants > 0" class="mt-12 animate-fade-in" style="animation-delay: 0.4s">
      <div class="card-premium">
        <h3 class="section-title mb-6">Grant Discovery Trends</h3>
        <div class="h-64 flex items-center justify-center">
          <div class="text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-navy-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <p class="text-lg font-medium text-navy-600">Chart visualization coming soon</p>
            <p class="text-sm text-navy-400 mt-1">Track your grant discovery progress over time</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import api from '@/services/api'

const authStore = useAuthStore()

// Stats
const stats = ref({
  activeGrants: null as number | null,
  activeGrantsChange: 0,
  matchedGrants: null as number | null,
  csoProfiles: null as number | null,
  upcomingDeadlines: null as number | null,
})

// Recent activity
const recentActivity = ref<any[]>([])

// Upcoming deadlines list
const upcomingDeadlinesList = ref<any[]>([])

// Display name
const displayName = computed(() => {
  return authStore.user?.user_metadata?.full_name || authStore.user?.email?.split('@')[0] || 'User'
})

// Activity icon class
function activityIconClass(type: string) {
  switch (type) {
    case 'match':
      return 'bg-sage-100 text-sage-600'
    case 'grant':
      return 'bg-amber-100 text-amber-600'
    case 'profile':
      return 'bg-navy-100 text-navy-600'
    default:
      return 'bg-stone-100 text-stone-600'
  }
}

// Deadline color classes
function deadlineTextClass(daysLeft: number) {
  if (daysLeft <= 7) return 'text-red-600'
  if (daysLeft <= 14) return 'text-amber-600'
  return 'text-navy-600'
}

function deadlineBorderClass(daysLeft: number) {
  if (daysLeft <= 7) return 'border-red-500 bg-red-50'
  if (daysLeft <= 14) return 'border-amber-500 bg-amber-50'
  return 'border-navy-300 bg-navy-50'
}

// Fetch dashboard data
async function fetchDashboardData() {
  try {
    // Fetch grants count
    const grantsResponse = await api.get('/api/grants?limit=1')
    if (grantsResponse.data && grantsResponse.data.total) {
      stats.value.activeGrants = grantsResponse.data.total
    }

    // Fetch CSO profiles
    const csoResponse = await api.get('/api/cso')
    if (csoResponse.data && Array.isArray(csoResponse.data.csos)) {
      stats.value.csoProfiles = csoResponse.data.csos.length

      // If we have CSO profiles, fetch matches
      if (csoResponse.data.csos.length > 0) {
        const firstCsoId = csoResponse.data.csos[0].id
        const matchesResponse = await api.get(`/api/match/cso/${firstCsoId}?limit=100`)
        if (matchesResponse.data && Array.isArray(matchesResponse.data.matches)) {
          stats.value.matchedGrants = matchesResponse.data.matches.length
        }
      }
    }

    // Fetch upcoming deadlines (grants with deadline in next 30 days)
    const now = new Date()
    const deadlinesResponse = await api.get('/api/grants?limit=100')

    if (deadlinesResponse.data && Array.isArray(deadlinesResponse.data.grants)) {
      const grantsWithDeadlines = deadlinesResponse.data.grants
        .filter((g: any) => g.deadline)
        .map((g: any) => {
          const deadline = new Date(g.deadline)
          const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
          return {
            id: g.id,
            title: g.title,
            organization: g.program_name || 'Unknown',
            date: deadline.toLocaleDateString(),
            daysLeft,
            deadline
          }
        })
        .filter((g: any) => g.daysLeft > 0 && g.daysLeft <= 30)
        .sort((a: any, b: any) => a.daysLeft - b.daysLeft)
        .slice(0, 5)

      stats.value.upcomingDeadlines = grantsWithDeadlines.length
      upcomingDeadlinesList.value = grantsWithDeadlines
    }

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Set default values on error
    stats.value.activeGrants = 0
    stats.value.matchedGrants = 0
    stats.value.csoProfiles = 0
    stats.value.upcomingDeadlines = 0
  }
}

onMounted(async () => {
  await fetchDashboardData()

  // Check if user just completed onboarding
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('welcome') === 'true') {
    // Could show a welcome celebration modal here
    console.log('Welcome! Onboarding completed successfully!')
  }
})
</script>
