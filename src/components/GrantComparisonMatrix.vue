<template>
  <Teleport to="body">
    <Transition name="comparison-matrix">
      <div v-if="modelValue" class="fixed inset-0 z-[100]" @keydown.escape="close">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Modal Card -->
        <div class="relative flex items-start justify-center pt-[5vh] pb-[5vh] h-full overflow-y-auto">
          <div class="w-full max-w-6xl mx-4 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <!-- Header -->
            <div class="sticky top-0 bg-white px-6 py-4 border-b border-stone-200 flex items-center justify-between z-10">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-display font-semibold text-navy-900">{{ t('comparison.title') }}</h2>
                  <p class="text-xs text-navy-500">{{ t('comparison.grantsCount', { count: grants.length }) }}</p>
                </div>
              </div>
              <button @click="close" class="p-2 -mr-2 text-navy-400 hover:text-navy-700 transition-colors rounded-lg hover:bg-stone-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Comparison Table -->
            <div class="p-6 overflow-x-auto">
              <div v-if="grants.length < 2" class="text-center py-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-stone-100 rounded-full mb-4">
                  <svg class="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <p class="text-navy-600 text-sm">{{ t('comparison.minRequired') }}</p>
              </div>

              <table v-else class="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th class="text-left py-3 px-4 text-navy-500 font-medium w-44 sticky left-0 bg-white z-[5]"></th>
                    <th
                      v-for="grant in grants"
                      :key="'head-' + grant.id"
                      class="text-left py-3 px-4 min-w-[200px]"
                    >
                      <div class="max-w-[220px]">
                        <p class="font-semibold text-navy-900 truncate font-display" :title="grant.title">{{ grant.title }}</p>
                        <p class="text-xs text-navy-500 truncate mt-0.5">{{ grant.program_name || grant.source_id || '' }}</p>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-stone-100">
                  <!-- Funding Amount -->
                  <tr>
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-white z-[5]">{{ t('comparison.rows.amount') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'amount-' + grant.id"
                      class="py-3 px-4 font-semibold"
                      :class="isBestValue('amount', grant) ? 'bg-emerald-50 text-emerald-700' : 'text-amber-600'"
                    >
                      {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
                    </td>
                  </tr>

                  <!-- Deadline -->
                  <tr class="bg-stone-50/50">
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-stone-50/50 z-[5]">{{ t('comparison.rows.deadline') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'deadline-' + grant.id"
                      class="py-3 px-4"
                      :class="isBestValue('deadline', grant) ? 'bg-emerald-50 text-emerald-700 font-semibold' : deadlineColor(grant.deadline)"
                    >
                      {{ grant.deadline ? formatDate(grant.deadline) : '-' }}
                    </td>
                  </tr>

                  <!-- Category -->
                  <tr>
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-white z-[5]">{{ t('comparison.rows.category') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'cat-' + grant.id"
                      class="py-3 px-4 text-navy-700"
                    >
                      {{ grant.category || '-' }}
                    </td>
                  </tr>

                  <!-- Eligible Countries -->
                  <tr class="bg-stone-50/50">
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-stone-50/50 z-[5]">{{ t('comparison.rows.eligibility') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'countries-' + grant.id"
                      class="py-3 px-4 text-navy-700"
                    >
                      <span class="text-xs font-mono">{{ parseCountries(grant.eligible_countries).join(', ') || '-' }}</span>
                    </td>
                  </tr>

                  <!-- Co-Financing -->
                  <tr>
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-white z-[5]">{{ t('comparison.rows.coFinancing') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'cofin-' + grant.id"
                      class="py-3 px-4"
                      :class="isBestValue('coFinancing', grant) ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-navy-700'"
                    >
                      {{ grant.co_financing_rate ? grant.co_financing_rate + '%' : grant.funding_rate ? (100 - grant.funding_rate) + '%' : '-' }}
                    </td>
                  </tr>

                  <!-- Funder / Donor -->
                  <tr class="bg-stone-50/50">
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-stone-50/50 z-[5]">{{ t('comparison.rows.funderRecord') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'funder-' + grant.id"
                      class="py-3 px-4 text-navy-700"
                    >
                      {{ grant.donor_name || grant.program_name || '-' }}
                    </td>
                  </tr>

                  <!-- Pipeline Status -->
                  <tr>
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-white z-[5]">{{ t('comparison.rows.status') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'status-' + grant.id"
                      class="py-3 px-4"
                    >
                      <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full" :class="getStatusBadgeClass(grant)">
                        {{ getStatusIcon(grant) }} {{ getStatusLabel(grant) }}
                      </span>
                    </td>
                  </tr>

                  <!-- Milestone Progress -->
                  <tr class="bg-stone-50/50">
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-stone-50/50 z-[5]">{{ t('comparison.rows.milestones') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'milestone-' + grant.id"
                      class="py-3 px-4"
                    >
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 rounded-full bg-stone-200 max-w-[100px]">
                          <div
                            class="h-full rounded-full transition-all duration-300"
                            :class="getMilestoneProgress(grant).pct >= 60 ? 'bg-emerald-500' : getMilestoneProgress(grant).pct >= 30 ? 'bg-amber-400' : 'bg-stone-300'"
                            :style="{ width: getMilestoneProgress(grant).pct + '%' }"
                          ></div>
                        </div>
                        <span class="text-xs text-stone-500 whitespace-nowrap">
                          {{ getMilestoneProgress(grant).completed }}/{{ getMilestoneProgress(grant).total }}
                        </span>
                      </div>
                    </td>
                  </tr>

                  <!-- Readiness Score -->
                  <tr>
                    <td class="py-3 px-4 font-medium text-navy-600 sticky left-0 bg-white z-[5]">{{ t('comparison.rows.readiness') }}</td>
                    <td
                      v-for="grant in grants"
                      :key="'readiness-' + grant.id"
                      class="py-3 px-4"
                      :class="isBestValue('readiness', grant) ? 'bg-emerald-50' : ''"
                    >
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
                          :class="getReadinessScore(grant) >= 70 ? 'border-emerald-500 text-emerald-700' : getReadinessScore(grant) >= 40 ? 'border-amber-400 text-amber-600' : 'border-stone-300 text-stone-500'">
                          {{ getReadinessScore(grant) }}
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Strategic Fit Score -->
                  <tr class="bg-amber-50/40 border-t-2 border-amber-200">
                    <td class="py-4 px-4 font-semibold text-navy-800 sticky left-0 bg-amber-50/40 z-[5]">
                      <div class="flex items-center gap-1.5">
                        <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        {{ t('comparison.rows.strategicFit') }}
                      </div>
                    </td>
                    <td
                      v-for="grant in grants"
                      :key="'fit-' + grant.id"
                      class="py-4 px-4"
                      :class="isBestValue('strategicFit', grant) ? 'bg-emerald-100' : 'bg-amber-50/40'"
                    >
                      <div class="flex items-center gap-3">
                        <!-- Circular Progress -->
                        <div class="relative w-12 h-12 flex-shrink-0">
                          <svg class="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                            <path
                              class="text-stone-200"
                              stroke="currentColor"
                              stroke-width="3"
                              fill="none"
                              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              :class="getStrategicFitScore(grant) >= 70 ? 'text-emerald-500' : getStrategicFitScore(grant) >= 40 ? 'text-amber-500' : 'text-stone-400'"
                              stroke="currentColor"
                              stroke-width="3"
                              fill="none"
                              stroke-linecap="round"
                              :stroke-dasharray="`${getStrategicFitScore(grant)}, 100`"
                              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span class="absolute inset-0 flex items-center justify-center text-xs font-bold"
                            :class="getStrategicFitScore(grant) >= 70 ? 'text-emerald-700' : getStrategicFitScore(grant) >= 40 ? 'text-amber-700' : 'text-stone-500'">
                            {{ getStrategicFitScore(grant) }}
                          </span>
                        </div>
                        <div v-if="isBestValue('strategicFit', grant)" class="text-xs font-semibold text-emerald-700">
                          {{ t('comparison.bestMatch') }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Score Breakdown -->
            <div v-if="grants.length >= 2" class="px-6 pb-4">
              <div class="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <h3 class="text-sm font-semibold text-navy-800 mb-3">{{ t('comparison.scoreBreakdown') }}</h3>
                <div class="grid grid-cols-5 gap-3 text-center text-xs">
                  <div>
                    <p class="text-navy-500 mb-1">{{ t('comparison.weights.deadline') }}</p>
                    <p class="font-bold text-navy-800">20%</p>
                  </div>
                  <div>
                    <p class="text-navy-500 mb-1">{{ t('comparison.weights.amount') }}</p>
                    <p class="font-bold text-navy-800">25%</p>
                  </div>
                  <div>
                    <p class="text-navy-500 mb-1">{{ t('comparison.weights.category') }}</p>
                    <p class="font-bold text-navy-800">25%</p>
                  </div>
                  <div>
                    <p class="text-navy-500 mb-1">{{ t('comparison.weights.eligibility') }}</p>
                    <p class="font-bold text-navy-800">15%</p>
                  </div>
                  <div>
                    <p class="text-navy-500 mb-1">{{ t('comparison.weights.readiness') }}</p>
                    <p class="font-bold text-navy-800">15%</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Bar -->
            <div class="sticky bottom-0 bg-white px-6 py-4 border-t border-stone-200 flex items-center justify-between rounded-b-xl">
              <div class="flex items-center gap-2">
                <button
                  @click="pinComparison"
                  class="btn btn-outline btn-sm flex items-center gap-1.5"
                  :class="isPinned ? 'border-amber-400 text-amber-600 bg-amber-50' : ''"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                  </svg>
                  {{ isPinned ? t('comparison.pinned') : t('comparison.pin') }}
                </button>
                <button
                  @click="exportComparison"
                  class="btn btn-outline btn-sm flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  {{ t('comparison.export') }}
                </button>
              </div>
              <div class="flex items-center gap-2">
                <button @click="clearComparison" class="btn btn-outline btn-sm text-red-600 border-red-200 hover:bg-red-50">
                  {{ t('comparison.clearAll') }}
                </button>
                <button @click="close" class="btn btn-primary btn-sm">
                  {{ t('comparison.close') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/lib/useToast'

const props = defineProps<{
  grants: any[]
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'clear'): void
}>()

const { t } = useI18n()
const toast = useToast()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

function clearComparison() {
  emit('clear')
  close()
}

// Prevent background scroll
function lockScroll() {
  if (props.modelValue) {
    document.body.style.overflow = 'hidden'
  }
}

function unlockScroll() {
  document.body.style.overflow = ''
}

onMounted(() => {
  lockScroll()
})

onUnmounted(() => {
  unlockScroll()
})

// Watch modelValue for scroll lock
import { watch } from 'vue'
watch(() => props.modelValue, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// --- Helpers ---
function formatAmount(min: number | null, max: number | null, currency: string = 'EUR') {
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'EUR', maximumFractionDigits: 0 }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `${t('grants.from')} ${fmt(min)}`
  if (max) return `${t('grants.upTo')} ${fmt(max)}`
  return '-'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const days = Math.ceil((date.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  if (days < 0) return t('grantDetail.closed')
  if (days === 0) return t('grants.deadlineToday')
  if (days <= 7) return `${days}d left`
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function deadlineColor(dateStr: string): string {
  if (!dateStr) return 'text-navy-400'
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
  if (days < 0) return 'text-navy-400'
  if (days <= 7) return 'text-red-600 font-semibold'
  if (days <= 14) return 'text-amber-600'
  return 'text-navy-700'
}

function parseCountries(countriesStr: string | string[] | null | undefined): string[] {
  if (!countriesStr) return []
  if (Array.isArray(countriesStr)) return countriesStr
  try {
    const parsed = JSON.parse(countriesStr)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// --- Pipeline Status ---
function getGrantStatus(grantId: string): string {
  try {
    const workflow = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
    return workflow[grantId] || 'interested'
  } catch { return 'interested' }
}

function getStatusLabel(grant: any): string {
  const status = getGrantStatus(String(grant.id))
  const labels: Record<string, string> = {
    interested: t('savedGrants.status.interested'),
    researching: t('savedGrants.status.researching'),
    applying: t('savedGrants.status.applying'),
    submitted: t('savedGrants.status.submitted'),
    outcome: t('savedGrants.status.outcome'),
  }
  return labels[status] || status
}

function getStatusIcon(grant: any): string {
  const status = getGrantStatus(String(grant.id))
  const icons: Record<string, string> = {
    interested: '\u2B50',
    researching: '\uD83D\uDD0D',
    applying: '\u270D\uFE0F',
    submitted: '\uD83D\uDCE4',
    outcome: '\uD83C\uDFC6',
  }
  return icons[status] || '\u2B50'
}

function getStatusBadgeClass(grant: any): string {
  const status = getGrantStatus(String(grant.id))
  const classes: Record<string, string> = {
    interested: 'bg-amber-100 text-amber-700',
    researching: 'bg-blue-100 text-blue-700',
    applying: 'bg-indigo-100 text-indigo-700',
    submitted: 'bg-green-100 text-green-700',
    outcome: 'bg-purple-100 text-purple-700',
  }
  return classes[status] || 'bg-stone-100 text-stone-600'
}

// --- Milestone Progress ---
const stageSteps: Record<string, { key: string }[]> = {
  interested: [{ key: 'read_call' }, { key: 'check_eligibility' }, { key: 'discuss_team' }],
  researching: [{ key: 'gather_docs' }, { key: 'find_partners' }, { key: 'review_budget' }, { key: 'confirm_cofin' }],
  applying: [{ key: 'draft_proposal' }, { key: 'prepare_budget' }, { key: 'collect_annexes' }, { key: 'internal_review' }, { key: 'submit' }],
  submitted: [{ key: 'confirmation' }, { key: 'clarifications' }],
}

function getMilestoneProgress(grant: any): { completed: number; total: number; pct: number } {
  const grantId = String(grant.id)
  const stage = getGrantStatus(grantId)
  const steps = stageSteps[stage] || []
  if (steps.length === 0) return { completed: 0, total: 0, pct: 100 }
  try {
    const all = JSON.parse(localStorage.getItem('grantMilestones') || '{}')
    const milestones = all[grantId] || {}
    const completed = steps.filter(s => milestones[s.key]).length
    return { completed, total: steps.length, pct: Math.round(completed / steps.length * 100) }
  } catch {
    return { completed: 0, total: steps.length, pct: 0 }
  }
}

// --- Readiness Score ---
function getReadinessScore(grant: any): number {
  const grantId = String(grant.id)
  let score = 0
  const status = getGrantStatus(grantId)
  const statusScores: Record<string, number> = { interested: 0, researching: 20, applying: 50, submitted: 80, outcome: 100 }
  score += statusScores[status] || 0
  try {
    const items = JSON.parse(localStorage.getItem(`grantPrep_${grantId}`) || '[]')
    if (items.length > 0) {
      const checked = items.filter((i: any) => i.checked).length
      score += Math.round((checked / items.length) * 30)
    }
  } catch { /* ignore */ }
  try {
    const notes = localStorage.getItem(`grantNotes_${grantId}`)
    if (notes && notes.length > 2) score += 10
  } catch { /* ignore */ }
  try {
    const budget = localStorage.getItem(`grantBudget_${grantId}`)
    if (budget) score += 10
  } catch { /* ignore */ }
  return Math.min(score, 100)
}

// --- Strategic Fit Score ---
function getStrategicFitScore(grant: any): number {
  let score = 0

  // 1. Deadline proximity (20% weight) — closer deadline = higher urgency/fit
  if (grant.deadline) {
    const daysLeft = Math.ceil((new Date(grant.deadline).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    if (daysLeft >= 0 && daysLeft <= 90) {
      // Grants due within 90 days get highest score, scales linearly
      score += Math.round(((90 - daysLeft) / 90) * 20)
    } else if (daysLeft > 90) {
      score += 5 // still open, just not urgent
    }
    // past deadline = 0
  }

  // 2. Amount match to CSO budget (25% weight)
  const csoProfile = getCSOProfile()
  if (csoProfile && (grant.amount_max || grant.amount_min)) {
    const grantAmount = grant.amount_max || grant.amount_min || 0
    const csoBudget = csoProfile.annualBudget || 0
    if (csoBudget > 0 && grantAmount > 0) {
      const ratio = grantAmount / csoBudget
      // Ideal: grant is 10-50% of annual budget
      if (ratio >= 0.1 && ratio <= 0.5) score += 25
      else if (ratio >= 0.05 && ratio <= 1) score += 18
      else if (ratio >= 0.01 && ratio <= 2) score += 10
      else score += 3
    } else {
      score += 10 // neutral if no budget info
    }
  } else {
    score += 10 // neutral
  }

  // 3. Category match to CSO focus (25% weight)
  if (csoProfile && csoProfile.focusAreas && grant.category) {
    const grantCat = (grant.category || '').toLowerCase()
    const focusAreas = (csoProfile.focusAreas || []).map((f: string) => f.toLowerCase())
    if (focusAreas.some((f: string) => grantCat.includes(f) || f.includes(grantCat))) {
      score += 25
    } else {
      score += 5
    }
  } else {
    score += 10 // neutral
  }

  // 4. Eligibility match (15% weight)
  if (csoProfile && csoProfile.country) {
    const countries = parseCountries(grant.eligible_countries)
    const csoCountry = (csoProfile.country || '').toUpperCase()
    if (countries.length === 0) {
      score += 10 // no restrictions = probably fine
    } else if (countries.some((c: string) => c.toUpperCase() === csoCountry || c.toUpperCase() === 'ALL')) {
      score += 15
    } else {
      score += 2
    }
  } else {
    score += 8 // neutral
  }

  // 5. Readiness (15% weight)
  const readiness = getReadinessScore(grant)
  score += Math.round((readiness / 100) * 15)

  return Math.min(Math.round(score), 100)
}

function getCSOProfile(): any {
  try {
    // Check for CSO profiles in localStorage
    const profiles = localStorage.getItem('csoProfiles')
    if (profiles) {
      const parsed = JSON.parse(profiles)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]
    }
    // Also try the setup wizard profile
    const setupProfile = localStorage.getItem('setupProfile')
    if (setupProfile) return JSON.parse(setupProfile)
  } catch { /* ignore */ }
  return null
}

// --- Best Value Detection ---
function isBestValue(dimension: string, grant: any): boolean {
  if (props.grants.length < 2) return false

  switch (dimension) {
    case 'amount': {
      const amounts = props.grants.map(g => g.amount_max || g.amount_min || 0)
      const maxAmount = Math.max(...amounts)
      return maxAmount > 0 && (grant.amount_max || grant.amount_min || 0) === maxAmount
    }
    case 'deadline': {
      // Best = most time left (latest deadline that's still open)
      const openDeadlines = props.grants
        .filter(g => g.deadline && new Date(g.deadline).getTime() > Date.now())
        .map(g => new Date(g.deadline).getTime())
      if (openDeadlines.length === 0) return false
      const latest = Math.max(...openDeadlines)
      return grant.deadline && new Date(grant.deadline).getTime() === latest
    }
    case 'coFinancing': {
      // Best = lowest co-financing requirement
      const rates = props.grants
        .map(g => g.co_financing_rate ?? (g.funding_rate ? 100 - g.funding_rate : null))
        .filter(r => r !== null && r !== undefined) as number[]
      if (rates.length === 0) return false
      const minRate = Math.min(...rates)
      const grantRate = grant.co_financing_rate ?? (grant.funding_rate ? 100 - grant.funding_rate : null)
      return grantRate !== null && grantRate === minRate
    }
    case 'readiness': {
      const scores = props.grants.map(g => getReadinessScore(g))
      const maxScore = Math.max(...scores)
      return maxScore > 0 && getReadinessScore(grant) === maxScore
    }
    case 'strategicFit': {
      const scores = props.grants.map(g => getStrategicFitScore(g))
      const maxScore = Math.max(...scores)
      return maxScore > 0 && getStrategicFitScore(grant) === maxScore
    }
    default:
      return false
  }
}

// --- Pin Comparison ---
const isPinned = computed(() => {
  try {
    const pinned = JSON.parse(localStorage.getItem('pinnedComparisons') || '[]')
    const currentIds = props.grants.map(g => String(g.id)).sort().join(',')
    return pinned.some((p: any) => p.ids === currentIds)
  } catch { return false }
})

function pinComparison() {
  try {
    const pinned = JSON.parse(localStorage.getItem('pinnedComparisons') || '[]')
    const currentIds = props.grants.map(g => String(g.id)).sort().join(',')
    const existing = pinned.findIndex((p: any) => p.ids === currentIds)
    if (existing >= 0) {
      pinned.splice(existing, 1)
      localStorage.setItem('pinnedComparisons', JSON.stringify(pinned))
      toast.info(t('comparison.unpinned'))
    } else {
      pinned.push({
        ids: currentIds,
        grantIds: props.grants.map(g => String(g.id)),
        titles: props.grants.map(g => g.title),
        pinnedAt: new Date().toISOString()
      })
      localStorage.setItem('pinnedComparisons', JSON.stringify(pinned))
      toast.success(t('comparison.pinnedSuccess'))
    }
  } catch { /* storage full */ }
}

// --- Export Comparison ---
function exportComparison() {
  const lines: string[] = []
  lines.push('=== ' + t('comparison.title') + ' ===')
  lines.push(t('comparison.exportDate', { date: new Date().toLocaleDateString() }))
  lines.push('')

  // Grant headers
  lines.push('Grants: ' + props.grants.map(g => g.title).join(' | '))
  lines.push('')

  // Rows
  const rows = [
    { label: t('comparison.rows.amount'), fn: (g: any) => formatAmount(g.amount_min, g.amount_max, g.currency) },
    { label: t('comparison.rows.deadline'), fn: (g: any) => g.deadline ? formatDate(g.deadline) : '-' },
    { label: t('comparison.rows.category'), fn: (g: any) => g.category || '-' },
    { label: t('comparison.rows.eligibility'), fn: (g: any) => parseCountries(g.eligible_countries).join(', ') || '-' },
    { label: t('comparison.rows.coFinancing'), fn: (g: any) => g.co_financing_rate ? g.co_financing_rate + '%' : g.funding_rate ? (100 - g.funding_rate) + '%' : '-' },
    { label: t('comparison.rows.funderRecord'), fn: (g: any) => g.donor_name || g.program_name || '-' },
    { label: t('comparison.rows.status'), fn: (g: any) => getStatusLabel(g) },
    { label: t('comparison.rows.readiness'), fn: (g: any) => getReadinessScore(g) + '/100' },
    { label: t('comparison.rows.strategicFit'), fn: (g: any) => getStrategicFitScore(g) + '/100' },
  ]

  rows.forEach(row => {
    lines.push(`${row.label}:`)
    props.grants.forEach(g => {
      lines.push(`  ${g.title}: ${row.fn(g)}`)
    })
    lines.push('')
  })

  // Best match
  const scores = props.grants.map(g => ({ grant: g, score: getStrategicFitScore(g) }))
  scores.sort((a, b) => b.score - a.score)
  if (scores[0]) {
    lines.push(`${t('comparison.recommendation')}: ${scores[0].grant.title} (${scores[0].score}/100)`)
  }

  const text = lines.join('\n')
  navigator.clipboard.writeText(text).then(() => {
    toast.success(t('comparison.exportCopied'))
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    toast.success(t('comparison.exportCopied'))
  })
}
</script>

<style scoped>
.comparison-matrix-enter-active {
  transition: opacity 0.2s ease;
}
.comparison-matrix-leave-active {
  transition: opacity 0.15s ease;
}
.comparison-matrix-enter-from,
.comparison-matrix-leave-to {
  opacity: 0;
}
</style>
