<template>
  <AppLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h2 class="text-display-sm font-display text-navy-900">{{ $t('savedGrants.title') }}</h2>
        <p class="text-navy-600 mt-1">{{ $t('savedGrants.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="allGrants.length > 0" @click="exportSavedCsv" class="btn btn-outline btn-sm flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          CSV
        </button>
        <router-link to="/grants" class="btn btn-primary btn-sm">
          {{ $t('savedGrants.browseMore') }}
        </router-link>
      </div>
    </div>

    <!-- Status Filter Chips -->
    <div v-if="allGrants.length > 0" class="flex flex-wrap gap-2 mb-6 animate-slide-up">
      <button
        @click="activeStatusFilter = null"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all',
          !activeStatusFilter ? 'bg-navy-900 text-white' : 'bg-white text-navy-700 border border-navy-200 hover:border-amber-400'
        ]"
      >
        {{ $t('savedGrants.allStatuses') }} ({{ allGrants.length }})
      </button>
      <button
        v-for="status in workflowStatuses"
        :key="status.id"
        @click="activeStatusFilter = status.id"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5',
          activeStatusFilter === status.id ? `${status.activeBg} text-white` : `bg-white text-navy-700 border border-navy-200 hover:border-amber-400`
        ]"
      >
        <span>{{ status.icon }}</span>
        {{ status.label }} ({{ grantsForStatus(status.id).length }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="card animate-pulse">
        <div class="h-4 bg-navy-200 rounded w-3/4 mb-3"></div>
        <div class="h-3 bg-navy-100 rounded w-1/2 mb-6"></div>
        <div class="h-8 bg-navy-100 rounded w-full"></div>
      </div>
    </div>

    <!-- Grants List -->
    <div v-else-if="filteredGrants.length > 0" class="space-y-4">
      <div
        v-for="grant in filteredGrants"
        :key="grant.id"
        class="card card-lift animate-fade-in flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <!-- Status Indicator -->
        <div class="flex-shrink-0">
          <select
            :value="getGrantStatus(grant.id)"
            @change="setGrantStatus(grant.id, ($event.target as HTMLSelectElement).value)"
            class="input text-sm py-1.5 pr-8"
            @click.stop
          >
            <option v-for="s in workflowStatuses" :key="s.id" :value="s.id">
              {{ s.icon }} {{ s.label }}
            </option>
          </select>
        </div>

        <!-- Grant Info -->
        <router-link :to="`/grants/${grant.id}`" class="flex-1 min-w-0">
          <h3 class="font-semibold text-navy-900 truncate font-display hover:text-amber-600 transition-colors">
            {{ grant.title }}
          </h3>
          <p class="text-sm text-navy-600 mt-0.5">{{ grant.program_name || grant.source_id || '' }}</p>
        </router-link>

        <!-- Meta -->
        <div class="flex items-center gap-4 flex-shrink-0 text-sm">
          <span v-if="grant.amount_min || grant.amount_max" class="text-amber-600 font-semibold whitespace-nowrap">
            {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
          </span>
          <span v-if="grant.deadline" :class="deadlineColor(grant.deadline)" class="whitespace-nowrap">
            {{ formatDeadline(grant.deadline) }}
          </span>
        </div>

        <!-- Remove -->
        <button
          @click.stop="removeSavedGrant(grant.id)"
          class="flex-shrink-0 p-1.5 text-navy-400 hover:text-red-500 transition-colors"
          :aria-label="$t('savedGrants.remove')"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('savedGrants.emptyTitle') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">{{ $t('savedGrants.emptyDesc') }}</p>
      <router-link to="/grants" class="btn btn-primary">
        {{ $t('savedGrants.browseGrants') }}
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'
import { usePageTitle } from '@/lib/usePageTitle'

const { t } = useI18n()
const toast = useToast()
usePageTitle(t('savedGrants.title'))

const loading = ref(true)
const allGrants = ref<any[]>([])
const activeStatusFilter = ref<string | null>(null)

// Workflow statuses
const workflowStatuses = computed(() => [
  { id: 'interested', icon: '⭐', label: t('savedGrants.status.interested'), activeBg: 'bg-amber-500' },
  { id: 'researching', icon: '🔍', label: t('savedGrants.status.researching'), activeBg: 'bg-blue-500' },
  { id: 'applying', icon: '✍️', label: t('savedGrants.status.applying'), activeBg: 'bg-indigo-500' },
  { id: 'submitted', icon: '📤', label: t('savedGrants.status.submitted'), activeBg: 'bg-green-500' },
  { id: 'outcome', icon: '🏆', label: t('savedGrants.status.outcome'), activeBg: 'bg-purple-500' },
])

// Grant workflow status stored in localStorage
function getGrantStatus(grantId: string): string {
  try {
    const workflow = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
    return workflow[grantId] || 'interested'
  } catch { return 'interested' }
}

function setGrantStatus(grantId: string, status: string) {
  try {
    const workflow = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
    workflow[grantId] = status
    localStorage.setItem('grantWorkflow', JSON.stringify(workflow))
  } catch { /* storage full */ }
}

function grantsForStatus(statusId: string): any[] {
  return allGrants.value.filter(g => getGrantStatus(g.id) === statusId)
}

const filteredGrants = computed(() => {
  if (!activeStatusFilter.value) return allGrants.value
  return allGrants.value.filter(g => getGrantStatus(g.id) === activeStatusFilter.value)
})

function removeSavedGrant(grantId: string) {
  try {
    const saved = JSON.parse(localStorage.getItem('savedGrants') || '[]')
    const updated = saved.filter((id: string) => id !== grantId)
    localStorage.setItem('savedGrants', JSON.stringify(updated))
    allGrants.value = allGrants.value.filter(g => g.id !== grantId)
    // Clean workflow
    const workflow = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
    delete workflow[grantId]
    localStorage.setItem('grantWorkflow', JSON.stringify(workflow))
  } catch { /* ignore */ }
}

function formatAmount(min: number | null, max: number | null, currency: string = 'EUR') {
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'EUR', maximumFractionDigits: 0 }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${t('grants.from')} ${fmt(min)}`
  if (max) return `${t('grants.upTo')} ${fmt(max)}`
  return ''
}

function formatDeadline(dateStr: string): string {
  const date = new Date(dateStr)
  const days = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  if (days < 0) return t('grantDetail.closed')
  if (days === 0) return t('grants.deadlineToday')
  if (days <= 7) return `${days}d left`
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
}

function deadlineColor(dateStr: string): string {
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  if (days < 0) return 'text-navy-400'
  if (days <= 7) return 'text-red-600 font-semibold'
  if (days <= 14) return 'text-amber-600'
  return 'text-navy-600'
}

function exportSavedCsv() {
  const headers = ['Title', 'Status', 'Category', 'Amount', 'Deadline', 'URL']
  const rows = allGrants.value.map((g: any) => {
    const status = workflowStatuses.value.find(s => s.id === getGrantStatus(g.id))
    return [
      `"${(g.title || '').replace(/"/g, '""')}"`,
      status?.label || '',
      g.category || '',
      formatAmount(g.amount_min, g.amount_max, g.currency),
      g.deadline || '',
      g.url || ''
    ]
  })
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `saved-grants-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success(t('grants.csvExported'))
}

async function loadSavedGrants() {
  loading.value = true
  try {
    const savedIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
    if (savedIds.length === 0) {
      allGrants.value = []
      return
    }
    // Fetch all grants and filter to saved ones
    const response = await api.get('/api/grants?limit=100')
    const all = response.data.grants || []
    allGrants.value = all.filter((g: any) => savedIds.includes(g.id))
  } catch {
    toast.error(t('errors.network'))
  } finally {
    loading.value = false
  }
}

onMounted(loadSavedGrants)
</script>
