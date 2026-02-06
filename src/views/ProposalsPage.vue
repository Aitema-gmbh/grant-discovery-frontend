<template>
  <AppLayout>
    <div class="mb-8 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('proposals.title') }}</h1>
          <p class="text-navy-600">{{ $t('proposals.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Portfolio Metrics -->
    <div v-if="portfolioMetrics.total > 0 || portfolioMetrics.submittedCount > 0" class="mb-8 animate-fade-in">
      <h2 class="text-lg font-display font-bold text-navy-900 mb-4">{{ $t('proposals.portfolio.title') }}</h2>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-navy-900">{{ portfolioMetrics.total }}</div>
          <div class="text-xs text-stone-500 mt-1">{{ $t('proposals.portfolio.totalProposals') }}</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold" :class="portfolioMetrics.winRate >= 50 ? 'text-green-600' : portfolioMetrics.winRate > 0 ? 'text-amber-600' : 'text-stone-400'">
            {{ portfolioMetrics.winRate }}%
          </div>
          <div class="text-xs text-stone-500 mt-1">{{ $t('proposals.portfolio.winRate') }}</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-indigo-600">{{ portfolioMetrics.applyingCount }}</div>
          <div class="text-xs text-stone-500 mt-1">{{ $t('proposals.portfolio.applying') }}</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-2xl font-bold text-sage-600">{{ portfolioMetrics.submittedCount }}</div>
          <div class="text-xs text-stone-500 mt-1">{{ $t('proposals.portfolio.submitted') }}</div>
        </div>
      </div>

      <!-- Win/Loss Bar -->
      <div v-if="portfolioMetrics.wonCount > 0 || portfolioMetrics.lostCount > 0" class="card p-4 mt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-stone-600">{{ $t('proposals.portfolio.outcomes') }}</span>
          <span class="text-xs text-stone-400">{{ portfolioMetrics.wonCount }}W / {{ portfolioMetrics.lostCount }}L</span>
        </div>
        <div class="h-4 rounded-full overflow-hidden flex bg-stone-100">
          <div class="h-full bg-green-500 transition-all"
            :style="{ width: (portfolioMetrics.wonCount / (portfolioMetrics.wonCount + portfolioMetrics.lostCount) * 100) + '%' }"></div>
          <div class="h-full bg-red-400 transition-all"
            :style="{ width: (portfolioMetrics.lostCount / (portfolioMetrics.wonCount + portfolioMetrics.lostCount) * 100) + '%' }"></div>
        </div>
        <div class="flex justify-between mt-1">
          <span class="text-[10px] text-green-600">{{ $t('proposals.portfolio.won') }}</span>
          <span class="text-[10px] text-red-500">{{ $t('proposals.portfolio.lost') }}</span>
        </div>
      </div>
    </div>

    <!-- Templates Section -->
    <div v-if="templates.length > 0" class="mb-8 animate-fade-in">
      <h3 class="text-lg font-display font-semibold text-navy-800 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
        {{ $t('proposals.templates.title') }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="tmpl in templates" :key="tmpl.id" class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 hover:shadow-soft transition-all">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-navy-800 truncate">{{ tmpl.name }}</p>
            <p class="text-[10px] text-navy-500">{{ new Date(tmpl.createdAt).toLocaleDateString() }}</p>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <router-link :to="`/proposals/new?template=${tmpl.id}`" class="btn btn-sm btn-primary text-xs px-2 py-1">{{ $t('proposals.templates.use') }}</router-link>
            <button @click="deleteTemplate(tmpl.id)" class="p-1 text-navy-400 hover:text-red-500 transition-colors">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Library -->
    <div class="mb-8 animate-fade-in">
      <button @click="contentLibraryOpen = !contentLibraryOpen"
        class="w-full flex items-center justify-between mb-3 group">
        <h3 class="text-lg font-display font-semibold text-[#1e3a5f] flex items-center gap-2">
          <svg class="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          {{ $t('proposals.contentLibrary.title') }}
          <span v-if="librarySnippets.length > 0" class="text-xs font-normal text-stone-400 ml-1">
            {{ $t('proposals.contentLibrary.snippetCount', { count: librarySnippets.length }) }}
          </span>
        </h3>
        <svg class="w-4 h-4 text-stone-400 transition-transform" :class="contentLibraryOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>

      <div v-if="contentLibraryOpen">
        <!-- Empty State -->
        <div v-if="librarySnippets.length === 0" class="card p-8 text-center">
          <div class="inline-flex items-center justify-center w-14 h-14 bg-[#d4a843]/10 rounded-full mb-4">
            <svg class="w-7 h-7 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </div>
          <p class="text-sm text-stone-600 mb-1">{{ $t('proposals.contentLibrary.empty') }}</p>
          <p class="text-xs text-stone-400">{{ $t('proposals.contentLibrary.emptyDesc') }}</p>
        </div>

        <!-- Snippets grouped by category -->
        <div v-else class="space-y-4">
          <div v-for="(categorySnippets, category) in snippetsByCategory" :key="category">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold border"
                :class="snippetCategoryColors[category as SnippetCategory]">
                {{ $t(`proposals.contentLibrary.categories.${category}`) }}
              </span>
              <div class="flex-1 h-px bg-stone-200"></div>
            </div>

            <div class="space-y-2">
              <div v-for="snippet in categorySnippets" :key="snippet.id"
                class="card p-4 hover:shadow-soft transition-all">

                <!-- View Mode -->
                <div v-if="editingSnippet !== snippet.id">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex-1 min-w-0 cursor-pointer" @click="toggleExpandSnippet(snippet.id)">
                      <h4 class="text-sm font-semibold text-[#1e3a5f]">{{ snippet.title }}</h4>
                      <p class="text-xs text-stone-500 mt-1" :class="expandedSnippet === snippet.id ? '' : 'line-clamp-2'">
                        {{ expandedSnippet === snippet.id ? snippet.content : snippet.content.substring(0, 100) + (snippet.content.length > 100 ? '...' : '') }}
                      </p>
                      <button v-if="snippet.content.length > 100" @click.stop="toggleExpandSnippet(snippet.id)"
                        class="text-[10px] text-[#d4a843] hover:underline mt-1">
                        {{ expandedSnippet === snippet.id ? $t('proposals.contentLibrary.collapsePreview') : $t('proposals.contentLibrary.expandPreview') }}
                      </button>
                    </div>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button @click="startEditSnippet(snippet)"
                        class="p-1.5 text-stone-400 hover:text-[#1e3a5f] hover:bg-stone-100 rounded transition-colors"
                        :title="$t('proposals.contentLibrary.editSnippet')">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button @click="deleteLibrarySnippet(snippet.id)"
                        class="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        :title="$t('proposals.contentLibrary.deleteSnippet')">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 mt-2 pt-2 border-t border-stone-100">
                    <span class="text-[9px] text-stone-400">{{ $t('proposals.contentLibrary.usageCount', { count: snippet.usageCount }) }}</span>
                    <span class="text-[9px] text-stone-400">{{ $t('proposals.contentLibrary.createdOn', { date: new Date(snippet.createdAt).toLocaleDateString() }) }}</span>
                    <span v-if="snippet.sourceGrantTitle" class="text-[9px] text-[#d4a843] truncate max-w-[200px]">
                      {{ $t('proposals.contentLibrary.source', { title: snippet.sourceGrantTitle }) }}
                    </span>
                  </div>
                </div>

                <!-- Edit Mode -->
                <div v-else class="space-y-3">
                  <input v-model="editTitle" type="text"
                    class="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-1 focus:ring-[#d4a843] focus:border-transparent" />
                  <textarea v-model="editContent" rows="6"
                    class="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-[#d4a843] focus:border-transparent resize-y"></textarea>
                  <div class="flex justify-end gap-2">
                    <button @click="cancelEditSnippet"
                      class="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-700 transition-colors">
                      {{ $t('proposals.contentLibrary.cancelEdit') }}
                    </button>
                    <button @click="updateSnippet(snippet.id)"
                      class="px-3 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium hover:bg-[#2a4d7a] transition-colors">
                      {{ $t('proposals.contentLibrary.saveChanges') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="card-premium animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="h-5 bg-navy-200 rounded w-2/5"></div>
          <div class="h-6 bg-amber-100 rounded-full w-20"></div>
        </div>
        <div class="h-4 bg-navy-100 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-navy-100 rounded w-1/2 mb-3"></div>
        <div class="flex items-center gap-4">
          <div class="h-3 bg-navy-100 rounded w-24"></div>
          <div class="h-3 bg-navy-100 rounded w-20"></div>
        </div>
      </div>
    </div>

    <!-- Proposals List -->
    <div v-else-if="proposals.length > 0" class="space-y-4">
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        class="card-premium hover:shadow-lg cursor-pointer transition-all"
        @click="viewProposal(proposal)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-1">
              {{ proposal.title }}
            </h3>
            <p class="text-sm text-navy-600 mb-3">
              {{ $t('proposals.created') }} {{ formatDate(proposal.created_at) }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span :class="statusBadge(proposal.status)">
                {{ proposal.status }}
              </span>
              <span v-if="proposal.total_budget" class="badge">
                €{{ proposal.total_budget.toLocaleString() }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click.stop="generateSections(proposal.id)"
              class="btn btn-outline btn-sm"
            >
              {{ $t('proposals.aiGenerate') }}
            </button>
            <button
              @click.stop="viewProposal(proposal)"
              class="btn btn-primary btn-sm"
            >
              {{ $t('proposals.view') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('proposals.noProposals') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        {{ $t('proposals.noProposalsDesc') }}
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <router-link to="/proposals/new" class="btn btn-primary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ $t('proposals.createNew') }}
        </router-link>
        <router-link to="/grants" class="btn btn-outline">
          {{ $t('proposals.browseGrants') }}
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const loading = ref(true)
const proposals = ref<any[]>([])

// Template system
const templates = ref<Array<{ id: string; name: string; csoId: string; sections: any; createdAt: string }>>([])

// Portfolio Analytics
const portfolioMetrics = computed(() => {
  const allProposals = JSON.parse(localStorage.getItem('proposalTemplates') || '[]') as any[]
  const outcomes = JSON.parse(localStorage.getItem('grantOutcomes') || '{}') as Record<string, string>

  const total = allProposals.length
  const wonCount = Object.values(outcomes).filter(o => o === 'won').length
  const lostCount = Object.values(outcomes).filter(o => o === 'lost').length
  const decidedCount = wonCount + lostCount
  const winRate = decidedCount > 0 ? Math.round(wonCount / decidedCount * 100) : 0

  // Workflow counts
  const workflows = JSON.parse(localStorage.getItem('grantWorkflow') || '{}') as Record<string, string>
  const submittedCount = Object.values(workflows).filter(s => s === 'submitted').length
  const applyingCount = Object.values(workflows).filter(s => s === 'applying').length

  const savedGrants = JSON.parse(localStorage.getItem('savedGrants') || '[]') as string[]

  return { total, wonCount, lostCount, winRate, submittedCount, applyingCount, savedGrants: savedGrants.length }
})

// Content Library (Snippet Management)
type SnippetCategory = 'organization' | 'methodology' | 'impact' | 'budget' | 'sustainability' | 'other'

interface ProposalSnippet {
  id: string
  title: string
  content: string
  category: SnippetCategory
  sourceGrantTitle?: string
  createdAt: string
  usageCount: number
}

const contentLibraryOpen = ref(true)
const librarySnippets = ref<ProposalSnippet[]>([])
const expandedSnippet = ref<string | null>(null)
const editingSnippet = ref<string | null>(null)
const editTitle = ref('')
const editContent = ref('')

const snippetCategoryColors: Record<SnippetCategory, string> = {
  organization: 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/20',
  methodology: 'bg-[#7c9a6e]/10 text-[#7c9a6e] border-[#7c9a6e]/20',
  impact: 'bg-purple-100 text-purple-700 border-purple-200',
  budget: 'bg-[#d4a843]/10 text-[#d4a843] border-[#d4a843]/20',
  sustainability: 'bg-teal-100 text-teal-700 border-teal-200',
  other: 'bg-stone-100 text-stone-600 border-stone-200',
}

const snippetsByCategory = computed(() => {
  const grouped: Record<string, ProposalSnippet[]> = {}
  for (const snippet of librarySnippets.value) {
    if (!grouped[snippet.category]) grouped[snippet.category] = []
    grouped[snippet.category]!.push(snippet)
  }
  return grouped
})

function loadLibrarySnippets() {
  try {
    const stored = localStorage.getItem('proposalSnippets')
    if (stored) librarySnippets.value = JSON.parse(stored)
  } catch { librarySnippets.value = [] }
}

function saveLibrarySnippets() {
  localStorage.setItem('proposalSnippets', JSON.stringify(librarySnippets.value))
}

function startEditSnippet(snippet: ProposalSnippet) {
  editingSnippet.value = snippet.id
  editTitle.value = snippet.title
  editContent.value = snippet.content
}

function cancelEditSnippet() {
  editingSnippet.value = null
  editTitle.value = ''
  editContent.value = ''
}

function updateSnippet(id: string) {
  const snippet = librarySnippets.value.find(s => s.id === id)
  if (!snippet) return
  snippet.title = editTitle.value.trim()
  snippet.content = editContent.value.trim()
  saveLibrarySnippets()
  editingSnippet.value = null
  toast.success(t('proposals.contentLibrary.updatedSuccess'))
}

function deleteLibrarySnippet(id: string) {
  librarySnippets.value = librarySnippets.value.filter(s => s.id !== id)
  saveLibrarySnippets()
  if (expandedSnippet.value === id) expandedSnippet.value = null
  if (editingSnippet.value === id) editingSnippet.value = null
  toast.success(t('proposals.contentLibrary.deletedSuccess'))
}

function toggleExpandSnippet(id: string) {
  expandedSnippet.value = expandedSnippet.value === id ? null : id
}

function loadTemplates() {
  try {
    templates.value = JSON.parse(localStorage.getItem('proposalTemplates') || '[]')
  } catch { templates.value = [] }
}

function deleteTemplate(id: string) {
  templates.value = templates.value.filter(t => t.id !== id)
  localStorage.setItem('proposalTemplates', JSON.stringify(templates.value))
}

async function loadProposals() {
  loading.value = true
  try {
    const response = await api.get('/api/proposals')
    proposals.value = response.data.proposals || []
  } catch (error) {
    console.error('Error loading proposals:', error)
    toast.error(t('errors.loadProposals'))
    proposals.value = []
  } finally {
    loading.value = false
  }
}

function viewProposal(proposal: any) {
  router.push(`/proposals/${proposal.id}`)
}

function generateSections(proposalId: string) {
  router.push(`/proposals/${proposalId}?generate=true`)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function statusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'badge'
    case 'in_review':
      return 'badge badge-info'
    case 'approved':
      return 'badge badge-success'
    case 'submitted':
      return 'badge badge-success'
    case 'rejected':
      return 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700'
    default:
      return 'badge'
  }
}

onMounted(() => {
  loadProposals()
  loadTemplates()
  loadLibrarySnippets()
})
</script>
