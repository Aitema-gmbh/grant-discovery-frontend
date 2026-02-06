<template>
  <Teleport to="body">
    <Transition name="command-palette">
      <div class="fixed inset-0 z-[100]" @keydown="handleKeydown">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>

        <!-- Modal Card -->
        <div class="relative flex items-start justify-center pt-[15vh]">
          <div class="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <!-- Search Input -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-stone-200">
              <svg class="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                :placeholder="t('commandPalette.searchPlaceholder')"
                class="flex-1 bg-transparent text-slate-900 placeholder-stone-400 outline-none text-base"
                @input="selectedIndex = 0"
              />
              <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-stone-400 bg-stone-100 rounded border border-stone-200 font-mono">
                ESC
              </kbd>
            </div>

            <!-- Results -->
            <div ref="resultsContainer" class="max-h-96 overflow-y-auto">
              <div v-if="flatResults.length === 0 && query.length > 0" class="px-4 py-8 text-center">
                <svg class="w-10 h-10 mx-auto text-stone-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-stone-500 text-sm">{{ t('commandPalette.noResults') }}</p>
              </div>

              <template v-for="(group, groupType) in groupedResults" :key="groupType">
                <div class="px-3 pt-3 pb-1">
                  <span class="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {{ getGroupLabel(groupType as string) }}
                  </span>
                </div>
                <div>
                  <button
                    v-for="item in group"
                    :key="item.id"
                    class="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors"
                    :class="flatResults.indexOf(item) === selectedIndex
                      ? 'bg-amber-50 text-slate-900'
                      : 'text-slate-700 hover:bg-stone-50'"
                    @click="executeCommand(item)"
                    @mouseenter="selectedIndex = flatResults.indexOf(item)"
                  >
                    <!-- Type Icon -->
                    <span class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
                      :class="getIconBg(item.type)"
                    >
                      <component :is="getIcon(item.type)" class="w-4 h-4" />
                    </span>

                    <!-- Title & Subtitle -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate" v-html="highlightMatch(item.title)"></p>
                      <p v-if="item.subtitle" class="text-xs text-stone-400 truncate">{{ item.subtitle }}</p>
                    </div>

                    <!-- Arrow indicator for selected -->
                    <svg
                      v-if="flatResults.indexOf(item) === selectedIndex"
                      class="w-4 h-4 text-amber-500 shrink-0"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </template>

              <!-- Default items when no query -->
              <div v-if="query.length === 0 && flatResults.length === 0" class="px-4 py-6 text-center">
                <p class="text-stone-400 text-sm">{{ t('commandPalette.searchPlaceholder') }}</p>
              </div>
            </div>

            <!-- Footer Keyboard Hints -->
            <div class="flex items-center gap-4 px-4 py-2.5 border-t border-stone-100 bg-stone-50/80">
              <span class="flex items-center gap-1.5 text-xs text-stone-400">
                <kbd class="inline-flex items-center justify-center w-5 h-5 rounded border border-stone-200 bg-white text-[10px] font-mono">&#8593;</kbd>
                <kbd class="inline-flex items-center justify-center w-5 h-5 rounded border border-stone-200 bg-white text-[10px] font-mono">&#8595;</kbd>
                <span>{{ t('commandPalette.navigate') }}</span>
              </span>
              <span class="flex items-center gap-1.5 text-xs text-stone-400">
                <kbd class="inline-flex items-center justify-center w-5 h-5 rounded border border-stone-200 bg-white text-[10px] font-mono">&#8629;</kbd>
                <span>{{ t('commandPalette.open') }}</span>
              </span>
              <span class="flex items-center gap-1.5 text-xs text-stone-400">
                <kbd class="inline-flex items-center justify-center px-1.5 h-5 rounded border border-stone-200 bg-white text-[10px] font-mono">esc</kbd>
                <span>{{ t('commandPalette.close') }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, h, type FunctionalComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const { t } = useI18n()

// --- Types ---
interface CommandItem {
  id: string
  type: 'page' | 'grant' | 'proposal' | 'snippet' | 'action' | 'recentlyViewed'
  title: string
  subtitle?: string
  route?: string
  action?: () => void
}

// --- State ---
const query = ref('')
const selectedIndex = ref(0)
const searchInput = ref<HTMLInputElement | null>(null)
const resultsContainer = ref<HTMLElement | null>(null)
const commandIndex = ref<CommandItem[]>([])

// --- Icons as functional components ---
const PageIcon: FunctionalComponent = () => h('svg', {
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' })
])

const GrantIcon: FunctionalComponent = () => h('svg', {
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
])

const ProposalIcon: FunctionalComponent = () => h('svg', {
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' })
])

const SnippetIcon: FunctionalComponent = () => h('svg', {
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' })
])

const ActionIcon: FunctionalComponent = () => h('svg', {
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const RecentIcon: FunctionalComponent = () => h('svg', {
  fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-4 h-4'
}, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
])

function getIcon(type: string): FunctionalComponent {
  const icons: Record<string, FunctionalComponent> = {
    page: PageIcon,
    grant: GrantIcon,
    proposal: ProposalIcon,
    snippet: SnippetIcon,
    action: ActionIcon,
    recentlyViewed: RecentIcon
  }
  return icons[type] || PageIcon
}

function getIconBg(type: string): string {
  const bgs: Record<string, string> = {
    page: 'bg-blue-50 text-[#1e3a5f]',
    grant: 'bg-amber-50 text-[#d4a843]',
    proposal: 'bg-emerald-50 text-[#7c9a6e]',
    snippet: 'bg-purple-50 text-purple-600',
    action: 'bg-stone-100 text-stone-600',
    recentlyViewed: 'bg-orange-50 text-orange-500'
  }
  return bgs[type] || 'bg-stone-100 text-stone-600'
}

function getGroupLabel(type: string): string {
  const labels: Record<string, string> = {
    page: t('commandPalette.pages'),
    grant: t('commandPalette.grants'),
    proposal: t('commandPalette.proposals'),
    snippet: t('commandPalette.snippets'),
    action: t('commandPalette.actions'),
    recentlyViewed: t('commandPalette.recentlyViewed')
  }
  return labels[type] || type
}

// --- Build command index ---
function buildCommandIndex(): CommandItem[] {
  const items: CommandItem[] = []

  // Static pages
  const pages: { id: string; title: string; subtitle?: string; route: string }[] = [
    { id: 'page-dashboard', title: t('nav.dashboard'), route: '/dashboard' },
    { id: 'page-grants', title: t('nav.grants'), subtitle: t('grants.subtitle'), route: '/grants' },
    { id: 'page-saved', title: t('savedGrants.title'), subtitle: t('savedGrants.subtitle'), route: '/saved' },
    { id: 'page-matches', title: t('nav.matches'), subtitle: t('matches.subtitle'), route: '/matches' },
    { id: 'page-proposals', title: t('nav.proposals'), subtitle: t('proposals.subtitle'), route: '/proposals' },
    { id: 'page-settings', title: t('nav.settings'), subtitle: t('settings.description'), route: '/settings' },
    { id: 'page-profile', title: t('nav.profile'), subtitle: t('profile.description'), route: '/profile' },
    { id: 'page-cso', title: t('nav.organizations'), subtitle: t('cso.subtitle'), route: '/cso' },
  ]
  for (const page of pages) {
    items.push({ ...page, type: 'page' })
  }

  // Saved grants from localStorage
  try {
    const savedRaw = localStorage.getItem('savedGrants')
    if (savedRaw) {
      const savedGrants = JSON.parse(savedRaw)
      if (Array.isArray(savedGrants)) {
        for (const grant of savedGrants.slice(0, 20)) {
          const title = grant.title || grant.name || `Grant ${grant.id}`
          items.push({
            id: `grant-${grant.id}`,
            type: 'grant',
            title,
            subtitle: grant.donor || grant.program_name || undefined,
            route: `/grants/${grant.id}`
          })
        }
      }
    }
  } catch { /* ignore parse errors */ }

  // Proposals from localStorage (keys matching proposal_*)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('proposal_')) {
        const raw = localStorage.getItem(key)
        if (raw) {
          const proposal = JSON.parse(raw)
          const proposalId = key.replace('proposal_', '')
          items.push({
            id: `proposal-${proposalId}`,
            type: 'proposal',
            title: proposal.title || proposal.grantTitle || `Proposal ${proposalId}`,
            subtitle: proposal.status || undefined,
            route: `/proposals/${proposalId}`
          })
        }
      }
    }
  } catch { /* ignore parse errors */ }

  // Snippets from localStorage
  try {
    const snippetsRaw = localStorage.getItem('proposalSnippets')
    if (snippetsRaw) {
      const snippets = JSON.parse(snippetsRaw)
      if (Array.isArray(snippets)) {
        for (const snippet of snippets.slice(0, 15)) {
          items.push({
            id: `snippet-${snippet.id || snippet.title}`,
            type: 'snippet',
            title: snippet.title || snippet.name || 'Snippet',
            subtitle: snippet.category || undefined
          })
        }
      }
    }
  } catch { /* ignore parse errors */ }

  // Recently viewed grants
  try {
    const recentRaw = localStorage.getItem('recentlyViewedGrants')
    if (recentRaw) {
      const recentGrants = JSON.parse(recentRaw)
      if (Array.isArray(recentGrants)) {
        for (const grant of recentGrants.slice(0, 5)) {
          const grantId = grant.id || grant
          const title = grant.title || grant.name || `Grant ${grantId}`
          // Avoid duplicates with saved grants
          if (!items.find(i => i.id === `grant-${grantId}`)) {
            items.push({
              id: `recent-${grantId}`,
              type: 'recentlyViewed',
              title,
              subtitle: grant.donor || grant.program_name || undefined,
              route: `/grants/${grantId}`
            })
          }
        }
      }
    }
  } catch { /* ignore parse errors */ }

  // Actions
  items.push({
    id: 'action-export',
    type: 'action',
    title: t('commandPalette.actionExportData'),
    action: () => {
      router.push('/settings')
    }
  })

  items.push({
    id: 'action-clear-recent',
    type: 'action',
    title: t('commandPalette.actionClearRecent'),
    action: () => {
      localStorage.removeItem('recentSearches')
      localStorage.removeItem('recentlyViewedGrants')
    }
  })

  return items
}

// --- Filtering ---
const filteredResults = computed<CommandItem[]>(() => {
  if (!query.value.trim()) {
    // Show all pages + recently viewed + actions when no query
    return commandIndex.value.filter(item =>
      item.type === 'page' || item.type === 'recentlyViewed' || item.type === 'action'
    )
  }

  const q = query.value.toLowerCase().trim()
  return commandIndex.value.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(q)
    const subtitleMatch = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false
    return titleMatch || subtitleMatch
  })
})

const groupedResults = computed<Record<string, CommandItem[]>>(() => {
  const groups: Record<string, CommandItem[]> = {}
  const typeOrder = ['page', 'recentlyViewed', 'grant', 'proposal', 'snippet', 'action']

  for (const type of typeOrder) {
    const items = filteredResults.value.filter(item => item.type === type)
    if (items.length > 0) {
      groups[type] = items
    }
  }

  return groups
})

const flatResults = computed<CommandItem[]>(() => {
  const items: CommandItem[] = []
  const typeOrder = ['page', 'recentlyViewed', 'grant', 'proposal', 'snippet', 'action']
  for (const type of typeOrder) {
    items.push(...filteredResults.value.filter(item => item.type === type))
  }
  return items
})

// --- Highlight match ---
function highlightMatch(text: string): string {
  if (!query.value.trim()) return text
  const q = query.value.trim()
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-amber-200/60 text-inherit rounded px-0.5">$1</mark>')
}

// --- Execute command ---
function executeCommand(item: CommandItem) {
  if (item.route) {
    router.push(item.route)
  }
  if (item.action) {
    item.action()
  }
  emit('close')
}

// --- Keyboard navigation ---
function handleKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      if (flatResults.value.length > 0) {
        selectedIndex.value = (selectedIndex.value + 1) % flatResults.value.length
        scrollToSelected()
      }
      break
    case 'ArrowUp':
      event.preventDefault()
      if (flatResults.value.length > 0) {
        selectedIndex.value = (selectedIndex.value - 1 + flatResults.value.length) % flatResults.value.length
        scrollToSelected()
      }
      break
    case 'Enter':
      event.preventDefault()
      {
        const selected = flatResults.value[selectedIndex.value]
        if (selected) {
          executeCommand(selected)
        }
      }
      break
    case 'Escape':
      event.preventDefault()
      emit('close')
      break
  }
}

function scrollToSelected() {
  nextTick(() => {
    if (resultsContainer.value) {
      const selectedEl = resultsContainer.value.querySelectorAll('button')[selectedIndex.value]
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  })
}

// --- Lifecycle ---
onMounted(() => {
  commandIndex.value = buildCommandIndex()
  nextTick(() => {
    searchInput.value?.focus()
  })
})

// Prevent background scroll
onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.command-palette-enter-active {
  transition: opacity 0.15s ease;
}
.command-palette-leave-active {
  transition: opacity 0.1s ease;
}
.command-palette-enter-from,
.command-palette-leave-to {
  opacity: 0;
}
</style>
