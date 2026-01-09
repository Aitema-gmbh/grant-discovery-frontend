<template>
  <AppLayout>
    <!-- Premium Ukraine Hero Section -->
    <div class="hero-ukraine mb-12 animate-fade-in">
      <div class="relative z-10">
        <h2 class="text-display-md font-display text-white mb-3 text-shadow">
          🇺🇦 {{ $t('grants.title') }}
        </h2>
        <p class="text-lg text-white/90 font-sans max-w-2xl">
          {{ $t('grants.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="card-premium mb-8 animate-slide-up">
      <!-- Search Bar -->
      <div class="relative mb-6">
        <input
          v-model="searchQuery"
          @input="debouncedSearch"
          type="text"
          :placeholder="$t('grants.searchPlaceholder')"
          class="input w-full pl-12 pr-4 sm:pr-48"
        />
        <svg class="absolute left-4 top-3.5 w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>

        <!-- Search Mode Toggle - Hidden on mobile, shown below search on small screens -->
        <div class="absolute right-3 top-2.5 hidden sm:flex items-center gap-2">
          <button
            @click="searchMode = 'text'"
            :class="searchMode === 'text' ? 'btn-primary py-1 px-3 text-sm' : 'bg-navy-100 text-navy-700 py-1 px-3 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors'"
          >
            Text
          </button>
          <button
            @click="searchMode = 'semantic'"
            :class="searchMode === 'semantic' ? 'btn-secondary py-1 px-3 text-sm' : 'bg-navy-100 text-navy-700 py-1 px-3 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors'"
            class="flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z"/>
              <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/>
            </svg>
            AI
          </button>
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <button
        @click="showFilters = !showFilters"
        class="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-amber-600 mb-4 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
        {{ showFilters ? $t('grants.hideAdvanced') : $t('grants.showAdvanced') }}
        <span v-if="activeFiltersCount > 0" class="badge badge-warning">
          {{ activeFiltersCount }}
        </span>
      </button>

      <!-- Filters Panel -->
      <div v-show="showFilters" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-navy-100 animate-slide-down">
        <!-- Amount Range -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            Grant Amount (EUR)
            <HelpTooltip content="Filter by minimum and maximum grant amount" />
          </label>
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model.number="filters.amountMin"
              type="number"
              placeholder="Min"
              class="input text-sm"
            />
            <input
              v-model.number="filters.amountMax"
              type="number"
              placeholder="Max"
              class="input text-sm"
            />
          </div>
        </div>

        <!-- Deadline -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            Deadline
          </label>
          <select v-model="filters.deadline" class="input text-sm">
            <option value="">Any deadline</option>
            <option value="7">Next 7 days</option>
            <option value="14">Next 14 days</option>
            <option value="30">Next 30 days</option>
            <option value="90">Next 90 days</option>
            <option value="180">Next 6 months</option>
          </select>
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            Eligible Country
          </label>
          <select v-model="filters.country" class="input text-sm">
            <option value="">All countries</option>
            <option value="UA">🇺🇦 Ukraine</option>
            <option value="PL">Poland</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="EU">European Union</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            Status
          </label>
          <select v-model="filters.status" class="input text-sm">
            <option value="">All statuses</option>
            <option value="open">🟢 Open - Accepting applications</option>
            <option value="upcoming">🟡 Upcoming - Opens soon</option>
            <option value="closed">🔴 Closed - Deadline passed</option>
          </select>
          <p class="text-xs text-navy-400 mt-1">Filter by application status</p>
        </div>
      </div>

      <!-- Active Filters Tags -->
      <div v-if="activeFiltersCount > 0" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-navy-100">
        <span class="text-sm font-medium text-navy-700">Active filters:</span>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''; searchGrants()"
          class="inline-flex items-center gap-1 px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm hover:bg-navy-200 transition-colors"
        >
          Search: "{{ searchQuery }}"
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
        <button
          @click="clearFilters"
          class="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm hover:bg-amber-200 transition-colors font-medium"
        >
          {{ $t('common.clear') }}
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Results Header -->
    <div class="flex items-center justify-between mb-8 animate-fade-in" style="animation-delay: 0.1s">
      <div>
        <p class="text-lg font-semibold text-navy-900 font-display">
          {{ loading ? $t('common.loading') : $t('grants.foundGrants', { count: totalGrants.toLocaleString() }) }}
        </p>
        <p v-if="searchQuery && searchMode === 'semantic'" class="text-sm text-amber-600 mt-1 flex items-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 7H7v6h6V7z"/>
            <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/>
          </svg>
          Using AI semantic search
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Sort -->
        <select v-model="sortBy" @change="searchGrants" class="input text-sm">
          <option value="relevance">Most Relevant</option>
          <option value="deadline">Deadline (Soonest)</option>
          <option value="amount">Amount (Highest)</option>
          <option value="recent">Recently Added</option>
        </select>

        <!-- View Toggle -->
        <div class="flex items-center gap-1 bg-navy-100 rounded-lg p-1">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-white shadow-soft text-navy-900' : 'text-navy-600'"
            class="p-2 rounded transition-all"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-white shadow-soft text-navy-900' : 'text-navy-600'"
            class="p-2 rounded transition-all"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="grant-card animate-pulse">
        <div class="h-4 bg-navy-200 rounded w-3/4 mb-4"></div>
        <div class="h-3 bg-navy-100 rounded w-full mb-2"></div>
        <div class="h-3 bg-navy-100 rounded w-5/6"></div>
      </div>
    </div>

    <!-- Grants Grid/List -->
    <div v-else-if="grants.length > 0" :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'">
      <div v-for="(grant, index) in grants" :key="grant.id"
        class="grant-card-ukraine card-lift cursor-pointer animate-fade-in"
        :style="`animation-delay: ${index * 0.05}s`"
        @click="viewGrantDetails(grant)"
      >
        <!-- Grant Card Content -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold text-navy-900 line-clamp-2 font-display">
              {{ grant.title }}
            </h3>
            <p class="text-sm text-navy-600 mt-1">
              {{ grant.program_name || grant.source_id }}
            </p>
          </div>
          <button
            @click.stop="toggleSaveGrant(grant.id)"
            class="ml-2 text-navy-400 hover:text-amber-500 transition-colors"
          >
            <svg class="w-5 h-5" :class="savedGrants.includes(grant.id) ? 'fill-amber-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          </button>
        </div>

        <p class="text-sm text-navy-700 line-clamp-3 mb-4">
          {{ grant.description }}
        </p>

        <!-- Grant Metadata -->
        <div class="space-y-2">
          <div v-if="grant.amount_min || grant.amount_max" class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-navy-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
            </svg>
            <span class="font-semibold text-amber-600">
              {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
            </span>
          </div>

          <div v-if="grant.deadline" class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-navy-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            <span :class="deadlineColor(grant.deadline)">
              {{ $t('grants.deadline') }}: {{ formatDate(grant.deadline) }}
            </span>
          </div>

          <div v-if="grant.eligible_countries && grant.eligible_countries !== '[]'" class="flex items-center gap-2 text-sm">
            <svg class="w-4 h-4 text-navy-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd"/>
            </svg>
            <span class="text-navy-600 font-mono text-xs">
              {{ parseCountries(grant.eligible_countries).slice(0, 3).join(', ') }}
              {{ parseCountries(grant.eligible_countries).length > 3 ? '...' : '' }}
            </span>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="mt-4 pt-4 border-t border-navy-100 flex items-center justify-between">
          <span :class="statusBadgeClass(grant.status)">
            {{ grant.status || 'Open' }}
          </span>
          <span class="text-xs text-navy-500 font-medium">
            {{ grant.category || 'General' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">No grants found</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        We couldn't find any funding opportunities matching your criteria. Try adjusting your filters or search terms.
      </p>
      <button @click="clearFilters" class="btn btn-primary">
        Clear all filters
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && grants.length > 0" class="flex items-center justify-between mt-12 pt-8 border-t border-navy-100">
      <p class="text-sm text-navy-700 font-medium">
        Showing {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalGrants) }} of {{ totalGrants.toLocaleString() }}
      </p>
      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn btn-outline"
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage * pageSize >= totalGrants"
          class="btn btn-primary"
          :class="currentPage * pageSize >= totalGrants ? 'opacity-50 cursor-not-allowed' : ''"
        >
          Next
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import api from '@/services/api'
import { useFeedback } from '@/lib/useFeedback'

const router = useRouter()
const { trackPageView, trackGrantAction } = useFeedback()

// State
const loading = ref(false)
const grants = ref<any[]>([])
const totalGrants = ref(0)
const currentPage = ref(1)
const pageSize = ref(30)

// Search & Filters
const searchQuery = ref('')
const searchMode = ref<'text' | 'semantic'>('text')
const showFilters = ref(false)
const sortBy = ref('relevance')
const viewMode = ref<'grid' | 'list'>('grid')

const filters = ref({
  amountMin: null as number | null,
  amountMax: null as number | null,
  deadline: '',
  country: '',
  status: '',
})

// Saved grants (localStorage)
const savedGrants = ref<string[]>([])

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (filters.value.amountMin) count++
  if (filters.value.amountMax) count++
  if (filters.value.deadline) count++
  if (filters.value.country) count++
  if (filters.value.status) count++
  return count
})

// Debounced search
let searchTimeout: number | null = null
function debouncedSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    searchGrants()
  }, 500) as unknown as number
}

// Search grants
async function searchGrants() {
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.append('limit', pageSize.value.toString())
    params.append('offset', ((currentPage.value - 1) * pageSize.value).toString())

    if (searchQuery.value) {
      if (searchMode.value === 'semantic') {
        // Use semantic search endpoint
        const response = await api.post('/api/search/semantic', {
          query: searchQuery.value,
          limit: pageSize.value,
          threshold: 0.3
        })
        grants.value = response.data.results || []
        totalGrants.value = response.data.total || grants.value.length
        loading.value = false
        return
      } else {
        params.append('search', searchQuery.value)
      }
    }

    if (filters.value.status) params.append('status', filters.value.status)
    if (filters.value.country) params.append('country', filters.value.country)

    // Deadline filter - calculates max deadline date from days selection
    if (filters.value.deadline) {
      const days = parseInt(filters.value.deadline as string)
      const maxDate = new Date()
      maxDate.setDate(maxDate.getDate() + days)
      params.append('deadline_before', maxDate.toISOString().split('T')[0] as string)
    }

    // Amount filters
    if (filters.value.amountMin) params.append('amount_min', filters.value.amountMin.toString())
    if (filters.value.amountMax) params.append('amount_max', filters.value.amountMax.toString())

    const response = await api.get(`/api/grants?${params.toString()}`)
    grants.value = response.data.grants || []
    totalGrants.value = response.data.count || grants.value.length
  } catch (error) {
    console.error('Error fetching grants:', error)
    grants.value = []
    totalGrants.value = 0
  } finally {
    loading.value = false
  }
}

// Clear filters
function clearFilters() {
  searchQuery.value = ''
  filters.value = {
    amountMin: null,
    amountMax: null,
    deadline: '',
    country: '',
    status: '',
  }
  currentPage.value = 1
  searchGrants()
}

// Pagination
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    searchGrants()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (currentPage.value * pageSize.value < totalGrants.value) {
    currentPage.value++
    searchGrants()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// View grant details
function viewGrantDetails(grant: any) {
  // Track view action
  trackGrantAction(grant.id, 'view', { source_page: 'grants' })
  // Navigate to grant detail page
  router.push(`/grants/${grant.id}`)
}

// Toggle save grant
function toggleSaveGrant(grantId: string) {
  const index = savedGrants.value.indexOf(grantId)
  if (index > -1) {
    savedGrants.value.splice(index, 1)
    trackGrantAction(grantId, 'dismiss', { source_page: 'grants' })
  } else {
    savedGrants.value.push(grantId)
    trackGrantAction(grantId, 'save', { source_page: 'grants' })
  }
  localStorage.setItem('savedGrants', JSON.stringify(savedGrants.value))
}

// Formatting helpers
function formatAmount(min: number | null, max: number | null, currency: string = 'EUR') {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency
  if (min && max) {
    return `${symbol}${(min / 1000).toFixed(0)}k - ${symbol}${(max / 1000).toFixed(0)}k`
  } else if (min) {
    return `${symbol}${(min / 1000).toFixed(0)}k+`
  } else if (max) {
    return `Up to ${symbol}${(max / 1000).toFixed(0)}k`
  }
  return 'Amount not specified'
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'Closed'
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays <= 7) return `${diffDays} days left`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks left`

  return date.toLocaleDateString()
}

function deadlineColor(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-navy-400'
  if (diffDays <= 7) return 'text-red-600 font-semibold'
  if (diffDays <= 14) return 'text-amber-600 font-medium'
  return 'text-navy-700'
}

function parseCountries(countriesStr: string) {
  try {
    const parsed = JSON.parse(countriesStr)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function statusBadgeClass(status: string) {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'badge badge-success'
    case 'upcoming':
      return 'badge badge-info'
    case 'closed':
      return 'px-2 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-700'
    default:
      return 'badge badge-success'
  }
}

// Load saved grants from localStorage
onMounted(() => {
  const saved = localStorage.getItem('savedGrants')
  if (saved) {
    savedGrants.value = JSON.parse(saved)
  }
  // Track page view
  trackPageView('grants')
  searchGrants()
})

// Watch filters for changes
watch(filters, () => {
  currentPage.value = 1
  debouncedSearch()
}, { deep: true })
</script>
