<template>
  <AppLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h2 class="text-display-sm font-display text-navy-900">{{ $t('savedGrants.title') }}</h2>
        <p class="text-navy-600 mt-1">{{ $t('savedGrants.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- View Toggle -->
        <div v-if="allGrants.length > 0" class="flex bg-stone-100 rounded-lg p-0.5">
          <button @click="viewMode = 'cards'" :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', viewMode === 'cards' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </button>
          <button @click="viewMode = 'timeline'" :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', viewMode === 'timeline' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </button>
          <button @click="viewMode = 'kanban'" :class="['px-3 py-1.5 rounded-md text-xs font-medium transition-all', viewMode === 'kanban' ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500 hover:text-navy-700']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>
          </button>
        </div>
        <button v-if="allGrants.length > 0" @click="exportSavedCsv" class="btn btn-outline btn-sm flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          CSV
        </button>
        <button v-if="allGrants.length > 0" @click="exportIcal" class="btn btn-outline btn-sm flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          iCal
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

    <!-- Error Retry Banner -->
    <div v-if="loadError && !loading" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 animate-fade-in">
      <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-red-800">{{ $t('errors.network') }}</p>
        <p class="text-xs text-red-600 mt-0.5">{{ $t('errors.retryDesc') }}</p>
      </div>
      <button @click="loadSavedGrants" class="btn btn-sm bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ $t('common.tryAgain') }}
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

    <!-- Cards View -->
    <div v-if="!loading && filteredGrants.length > 0 && viewMode === 'cards'" class="space-y-4">
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

    <!-- Timeline View -->
    <div v-else-if="!loading && filteredGrants.length > 0 && viewMode === 'timeline'" class="space-y-8 animate-fade-in">
      <div v-for="group in timelineGroups" :key="group.key">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-3 h-3 rounded-full" :class="group.dotColor"></div>
          <h3 class="text-sm font-bold uppercase tracking-wide" :class="group.textColor">
            {{ group.label }}
          </h3>
          <span class="text-xs text-navy-400 font-medium">({{ group.grants.length }})</span>
          <div class="flex-1 h-px bg-navy-100"></div>
        </div>
        <div class="ml-1.5 border-l-2 pl-6 space-y-3" :class="group.borderColor">
          <router-link
            v-for="grant in group.grants"
            :key="grant.id"
            :to="`/grants/${grant.id}`"
            class="block p-4 bg-white rounded-xl border border-stone-200 hover:shadow-soft hover:border-amber-200 transition-all"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs">{{ getStatusIcon(grant.id) }}</span>
                  <h4 class="text-sm font-semibold text-navy-900 truncate">{{ grant.title }}</h4>
                </div>
                <p class="text-xs text-navy-500">{{ grant.program_name || '' }}</p>
              </div>
              <div class="text-right flex-shrink-0">
                <p v-if="grant.deadline" class="text-xs font-bold" :class="deadlineColor(grant.deadline)">
                  {{ formatDeadline(grant.deadline) }}
                </p>
                <p v-if="grant.amount_max" class="text-xs text-amber-600 font-medium mt-0.5">
                  {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Kanban View -->
    <div v-else-if="!loading && filteredGrants.length > 0 && viewMode === 'kanban'" class="animate-fade-in">
      <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-2 px-2">
        <div
          v-for="status in workflowStatuses"
          :key="status.id"
          class="flex-shrink-0 w-64 sm:w-72 snap-start"
          @dragover.prevent
          @dragenter.prevent="dragOverColumn = status.id"
          @dragleave="dragOverColumn = ''"
          @drop="onDrop(status.id)"
        >
          <div class="rounded-xl p-3 min-h-[200px] transition-colors" :class="dragOverColumn === status.id ? 'bg-amber-50 ring-2 ring-amber-300' : 'bg-stone-100'">
            <!-- Column Header -->
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-sm">{{ status.icon }}</span>
                <h3 class="text-sm font-bold text-navy-800">{{ status.label }}</h3>
              </div>
              <span class="text-xs font-medium bg-white text-navy-600 rounded-full px-2 py-0.5">
                {{ kanbanColumns[status.id]?.length || 0 }}
              </span>
            </div>

            <!-- Cards -->
            <div class="space-y-2">
              <div
                v-for="grant in (kanbanColumns[status.id] || [])"
                :key="grant.id"
                draggable="true"
                @dragstart="onDragStart(grant)"
                class="bg-white rounded-lg p-3 shadow-sm border border-stone-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
              >
                <router-link :to="`/grants/${grant.id}`" class="block" @click.stop>
                  <h4 class="text-xs font-semibold text-navy-900 line-clamp-2 hover:text-amber-600 transition-colors">
                    {{ grant.title }}
                  </h4>
                  <p class="text-[10px] text-navy-500 mt-1 truncate">{{ grant.program_name || '' }}</p>
                </router-link>
                <div class="flex items-center justify-between mt-2">
                  <span v-if="grant.amount_max" class="text-[10px] text-amber-600 font-medium">
                    {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
                  </span>
                  <span v-if="grant.deadline" class="text-[10px] font-medium" :class="deadlineColor(grant.deadline)">
                    {{ formatDeadline(grant.deadline) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty column -->
            <div v-if="!(kanbanColumns[status.id]?.length)" class="text-center py-6 text-xs text-navy-400">
              {{ $t('savedGrants.kanban.dropHere') }}
            </div>
          </div>
        </div>
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
const loadError = ref(false)
const viewMode = ref<'cards' | 'timeline' | 'kanban'>('cards')

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

// Kanban drag-and-drop
const dragOverColumn = ref('')
const draggedGrant = ref<any>(null)

function onDragStart(grant: any) {
  draggedGrant.value = grant
}

function onDrop(statusId: string) {
  if (draggedGrant.value) {
    setGrantStatus(draggedGrant.value.id, statusId)
    draggedGrant.value = null
  }
  dragOverColumn.value = ''
}

const kanbanColumns = computed(() => {
  const cols: Record<string, any[]> = {}
  workflowStatuses.value.forEach(s => { cols[s.id] = [] })
  filteredGrants.value.forEach(g => {
    const status = getGrantStatus(g.id)
    if (cols[status]) cols[status]!.push(g)
    else if (cols['interested']) cols['interested']!.push(g)
  })
  return cols
})

function getStatusIcon(grantId: string): string {
  const status = getGrantStatus(grantId)
  const s = workflowStatuses.value.find(ws => ws.id === status)
  return s?.icon || '⭐'
}

// Timeline groups
const timelineGroups = computed(() => {
  const now = Date.now()
  const groups = [
    { key: 'overdue', label: t('savedGrants.timeline.overdue'), grants: [] as any[], dotColor: 'bg-red-500', textColor: 'text-red-600', borderColor: 'border-red-200' },
    { key: 'thisWeek', label: t('savedGrants.timeline.thisWeek'), grants: [] as any[], dotColor: 'bg-red-400', textColor: 'text-red-500', borderColor: 'border-red-200' },
    { key: 'nextWeek', label: t('savedGrants.timeline.nextWeek'), grants: [] as any[], dotColor: 'bg-amber-400', textColor: 'text-amber-600', borderColor: 'border-amber-200' },
    { key: 'thisMonth', label: t('savedGrants.timeline.thisMonth'), grants: [] as any[], dotColor: 'bg-blue-400', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
    { key: 'later', label: t('savedGrants.timeline.later'), grants: [] as any[], dotColor: 'bg-navy-300', textColor: 'text-navy-500', borderColor: 'border-navy-200' },
    { key: 'noDeadline', label: t('savedGrants.timeline.noDeadline'), grants: [] as any[], dotColor: 'bg-stone-300', textColor: 'text-stone-500', borderColor: 'border-stone-200' },
  ]
  filteredGrants.value.forEach(g => {
    if (!g.deadline) { groups[5]!.grants.push(g); return }
    const days = Math.ceil((new Date(g.deadline).getTime() - now) / (24 * 60 * 60 * 1000))
    if (days < 0) groups[0]!.grants.push(g)
    else if (days <= 7) groups[1]!.grants.push(g)
    else if (days <= 14) groups[2]!.grants.push(g)
    else if (days <= 30) groups[3]!.grants.push(g)
    else groups[4]!.grants.push(g)
  })
  return groups.filter(g => g.grants.length > 0)
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

function exportIcal() {
  const grantsWithDeadlines = allGrants.value.filter((g: any) => g.deadline)
  if (grantsWithDeadlines.length === 0) {
    toast.info(t('savedGrants.noDeadlines'))
    return
  }
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Grants Bridge Ukraine//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]
  grantsWithDeadlines.forEach((g: any) => {
    const d = new Date(g.deadline)
    const dateStr = d.toISOString().replace(/[-:]/g, '').split('T')[0]
    const nextDay = new Date(d)
    nextDay.setDate(nextDay.getDate() + 1)
    const nextDateStr = nextDay.toISOString().replace(/[-:]/g, '').split('T')[0]
    const desc = [g.category, formatAmount(g.amount_min, g.amount_max, g.currency)].filter(Boolean).join(' — ')
    lines.push(
      'BEGIN:VEVENT',
      `UID:grant-${g.id}@grantsbridgeukraine`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${nextDateStr}`,
      `SUMMARY:${(g.title || 'Grant Deadline').replace(/[,;\\]/g, ' ')}`,
      `DESCRIPTION:${desc.replace(/[,;\\]/g, ' ')}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'END:VEVENT'
    )
  })
  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `grant-deadlines-${new Date().toISOString().split('T')[0]}.ics`
  a.click()
  URL.revokeObjectURL(url)
  toast.success(t('savedGrants.icalExported'))
}

async function loadSavedGrants() {
  loading.value = true
  loadError.value = false
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
    loadError.value = true
    toast.error(t('errors.network'))
  } finally {
    loading.value = false
  }
}

onMounted(loadSavedGrants)
</script>
