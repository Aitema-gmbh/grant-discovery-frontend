<template>
  <AppLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in">
      <div>
        <h2 class="text-display-sm font-display text-navy-900">{{ t('workspace.title') }}</h2>
        <p class="text-navy-600 mt-1">{{ t('workspace.description') }}</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- Team Members Toggle -->
        <button
          @click="showTeamSidebar = !showTeamSidebar"
          class="btn btn-outline btn-sm flex items-center gap-1.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          {{ t('workspace.teamMembers.title') }}
          <span class="bg-navy-100 text-navy-600 text-xs px-1.5 py-0.5 rounded-full">{{ teamMembers.length }}</span>
        </button>
        <!-- Add Card -->
        <button @click="showAddCard = true" class="btn btn-primary btn-sm flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ t('workspace.addNote') }}
        </button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="flex flex-wrap items-center gap-3 mb-6 animate-slide-up">
      <!-- Assignee Filter -->
      <select
        v-model="filterAssignee"
        class="text-xs border border-navy-200 rounded-lg px-3 py-1.5 text-navy-700 bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
      >
        <option value="">{{ t('workspace.filters.allAssignees') }}</option>
        <option value="__unassigned__">{{ t('workspace.filters.unassigned') }}</option>
        <option v-for="member in teamMembers" :key="member.id" :value="member.name">{{ member.name }}</option>
      </select>

      <!-- Urgency Filter -->
      <select
        v-model="filterUrgency"
        class="text-xs border border-navy-200 rounded-lg px-3 py-1.5 text-navy-700 bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
      >
        <option value="">{{ t('workspace.filters.allUrgencies') }}</option>
        <option value="critical">{{ t('workspace.urgency.critical') }}</option>
        <option value="high">{{ t('workspace.urgency.high') }}</option>
        <option value="medium">{{ t('workspace.urgency.medium') }}</option>
        <option value="low">{{ t('workspace.urgency.low') }}</option>
      </select>

      <!-- Grant Filter -->
      <select
        v-model="filterGrant"
        class="text-xs border border-navy-200 rounded-lg px-3 py-1.5 text-navy-700 bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none max-w-[200px]"
      >
        <option value="">{{ t('workspace.filters.allGrants') }}</option>
        <option v-for="grant in savedGrantsList" :key="grant.id" :value="grant.id">{{ grant.title }}</option>
      </select>

      <!-- Clear Filters -->
      <button
        v-if="filterAssignee || filterUrgency || filterGrant"
        @click="filterAssignee = ''; filterUrgency = ''; filterGrant = ''"
        class="text-xs text-amber-600 hover:text-amber-700 font-medium"
      >
        {{ t('common.clear') }}
      </button>

      <!-- Card Count -->
      <span class="text-xs text-navy-400 ml-auto">
        {{ totalCardCount }} {{ t('workspace.cards') }}
      </span>
    </div>

    <div class="flex gap-6">
      <!-- Kanban Board -->
      <div class="flex-1 min-w-0">
        <div class="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-2 px-2">
          <div
            v-for="column in columns"
            :key="column.id"
            class="flex-shrink-0 w-72 sm:w-80 snap-start"
          >
            <div class="rounded-xl p-3 min-h-[300px]" :class="column.bgClass">
              <!-- Column Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 rounded-full" :class="column.dotClass"></div>
                  <h3 class="text-sm font-bold text-navy-800">{{ column.label }}</h3>
                </div>
                <span class="text-xs font-medium bg-white text-navy-600 rounded-full px-2 py-0.5 shadow-sm">
                  {{ filteredCardsForColumn(column.id).length }}
                </span>
              </div>

              <!-- Cards -->
              <div class="space-y-2.5">
                <transition-group name="card-move" tag="div" class="space-y-2.5">
                  <div
                    v-for="card in filteredCardsForColumn(column.id)"
                    :key="card.id"
                    class="bg-white rounded-lg p-3 shadow-sm border border-stone-200 hover:shadow-md transition-all"
                    :class="[
                      card.resolved ? 'opacity-60' : '',
                      urgencyBorderClass(card.urgency)
                    ]"
                  >
                    <!-- Card Header -->
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <p class="text-xs font-semibold text-navy-900 line-clamp-2 flex-1" :class="card.resolved ? 'line-through' : ''">
                        {{ card.text }}
                      </p>
                      <!-- Card Menu -->
                      <div class="relative flex-shrink-0">
                        <button
                          @click="toggleCardMenu(card.id)"
                          class="p-1 text-navy-300 hover:text-navy-600 transition-colors rounded"
                        >
                          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                          </svg>
                        </button>
                        <div
                          v-if="openCardMenu === card.id"
                          class="absolute right-0 top-full mt-1 w-36 bg-white border border-stone-200 rounded-lg shadow-lg z-10 py-1"
                        >
                          <button
                            @click="toggleResolve(card.id); openCardMenu = ''"
                            class="block w-full text-left px-3 py-1.5 text-xs text-navy-700 hover:bg-stone-50"
                          >
                            {{ card.resolved ? t('workspace.actions.unresolve') : t('workspace.actions.resolve') }}
                          </button>
                          <button
                            @click="deleteCard(card.id); openCardMenu = ''"
                            class="block w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            {{ t('workspace.actions.delete') }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Grant Name -->
                    <div v-if="card.grantName" class="flex items-center gap-1 mb-1.5">
                      <svg class="w-3 h-3 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <router-link
                        v-if="card.grantId"
                        :to="`/grants/${card.grantId}`"
                        class="text-[10px] text-amber-600 hover:text-amber-700 font-medium truncate"
                      >
                        {{ card.grantName }}
                      </router-link>
                      <span v-else class="text-[10px] text-amber-600 font-medium truncate">{{ card.grantName }}</span>
                    </div>

                    <!-- Urgency Badge -->
                    <div class="flex items-center gap-2 mb-1.5">
                      <span
                        class="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        :class="urgencyBadgeClass(card.urgency)"
                      >
                        {{ t(`workspace.urgency.${card.urgency}`) }}
                      </span>
                      <span v-if="card.source === 'suggested'" class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600">
                        {{ t('workspace.suggested') }}
                      </span>
                    </div>

                    <!-- Assignee -->
                    <div class="mb-1.5">
                      <input
                        v-model="card.assignee"
                        @change="saveBoard"
                        :placeholder="t('workspace.card.assigneePlaceholder')"
                        class="w-full text-[10px] px-2 py-1 bg-stone-50 border border-stone-200 rounded text-navy-700 placeholder-stone-400 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 outline-none"
                      />
                    </div>

                    <!-- Due Date -->
                    <div class="flex items-center gap-2 mb-2">
                      <input
                        type="date"
                        v-model="card.dueDate"
                        @change="saveBoard"
                        class="flex-1 text-[10px] px-2 py-1 bg-stone-50 border border-stone-200 rounded text-navy-700 focus:ring-1 focus:ring-amber-400 focus:border-amber-400 outline-none"
                      />
                      <span v-if="card.dueDate && getDaysUntilDue(card.dueDate) <= 3 && getDaysUntilDue(card.dueDate) >= 0" class="text-[10px] text-red-600 font-medium whitespace-nowrap">
                        {{ getDaysUntilDue(card.dueDate) === 0 ? t('workspace.card.dueToday') : getDaysUntilDue(card.dueDate) + 'd' }}
                      </span>
                    </div>

                    <!-- Move Buttons -->
                    <div class="flex gap-1 pt-1.5 border-t border-stone-100">
                      <button
                        v-for="col in columns.filter(c => c.id !== column.id)"
                        :key="col.id"
                        @click="moveCard(card.id, col.id)"
                        class="flex-1 text-[10px] py-1 rounded font-medium transition-colors"
                        :class="col.moveButtonClass"
                      >
                        {{ col.shortLabel }}
                      </button>
                    </div>
                  </div>
                </transition-group>
              </div>

              <!-- Empty Column -->
              <div v-if="filteredCardsForColumn(column.id).length === 0" class="text-center py-8 text-xs text-navy-400">
                {{ t('workspace.emptyColumn') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Sidebar -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div v-if="showTeamSidebar" class="hidden lg:block w-64 flex-shrink-0">
          <div class="card p-4 sticky top-24">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-bold text-navy-800">{{ t('workspace.teamMembers.title') }}</h3>
              <button @click="showTeamSidebar = false" class="p-1 text-navy-400 hover:text-navy-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Add Member -->
            <div class="flex gap-1.5 mb-4">
              <input
                v-model="newMemberName"
                @keyup.enter="addTeamMember"
                :placeholder="t('workspace.teamMembers.addPlaceholder')"
                class="flex-1 text-xs px-2.5 py-1.5 border border-navy-200 rounded-lg focus:ring-1 focus:ring-amber-400 focus:border-amber-400 outline-none"
              />
              <button
                @click="addTeamMember"
                class="px-2.5 py-1.5 bg-navy-900 text-white rounded-lg text-xs font-medium hover:bg-navy-800 transition-colors"
              >
                {{ t('common.save') }}
              </button>
            </div>

            <!-- Member List -->
            <div class="space-y-2">
              <div
                v-for="member in teamMembers"
                :key="member.id"
                class="flex items-center justify-between p-2 bg-stone-50 rounded-lg"
              >
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                    <span class="text-amber-800 font-semibold text-[10px]">{{ getInitials(member.name) }}</span>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-navy-800">{{ member.name }}</p>
                    <p class="text-[10px] text-navy-400">{{ getCardCountForMember(member.name) }} {{ t('workspace.cards') }}</p>
                  </div>
                </div>
                <button
                  @click="removeTeamMember(member.id)"
                  class="p-1 text-navy-300 hover:text-red-500 transition-colors"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="teamMembers.length === 0" class="text-center py-4 text-xs text-navy-400">
              {{ t('workspace.teamMembers.empty') }}
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Add Card Modal -->
    <Teleport to="body">
      <transition
        enter-active-class="transition-opacity duration-150 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAddCard" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showAddCard = false"></div>
          <div class="relative flex items-start justify-center pt-[15vh]">
            <div class="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden mx-4">
              <div class="px-5 py-4 border-b border-stone-200">
                <h3 class="text-sm font-bold text-navy-900">{{ t('workspace.addNote') }}</h3>
              </div>
              <div class="px-5 py-4 space-y-3">
                <!-- Note Text -->
                <div>
                  <label class="text-xs font-medium text-navy-700 mb-1 block">{{ t('workspace.card.noteText') }}</label>
                  <textarea
                    v-model="newCard.text"
                    rows="3"
                    :placeholder="t('workspace.card.noteTextPlaceholder')"
                    class="input text-sm w-full"
                  ></textarea>
                </div>

                <!-- Grant -->
                <div>
                  <label class="text-xs font-medium text-navy-700 mb-1 block">{{ t('workspace.card.grantLabel') }}</label>
                  <select v-model="newCard.grantId" class="input text-sm w-full">
                    <option value="">{{ t('workspace.card.noGrant') }}</option>
                    <option v-for="grant in savedGrantsList" :key="grant.id" :value="grant.id">{{ grant.title }}</option>
                  </select>
                </div>

                <!-- Urgency -->
                <div>
                  <label class="text-xs font-medium text-navy-700 mb-1 block">{{ t('workspace.card.urgencyLabel') }}</label>
                  <select v-model="newCard.urgency" class="input text-sm w-full">
                    <option value="low">{{ t('workspace.urgency.low') }}</option>
                    <option value="medium">{{ t('workspace.urgency.medium') }}</option>
                    <option value="high">{{ t('workspace.urgency.high') }}</option>
                    <option value="critical">{{ t('workspace.urgency.critical') }}</option>
                  </select>
                </div>

                <!-- Column -->
                <div>
                  <label class="text-xs font-medium text-navy-700 mb-1 block">{{ t('workspace.card.columnLabel') }}</label>
                  <select v-model="newCard.column" class="input text-sm w-full">
                    <option v-for="col in columns" :key="col.id" :value="col.id">{{ col.label }}</option>
                  </select>
                </div>

                <!-- Assignee -->
                <div>
                  <label class="text-xs font-medium text-navy-700 mb-1 block">{{ t('workspace.card.assigneeLabel') }}</label>
                  <input
                    v-model="newCard.assignee"
                    :placeholder="t('workspace.card.assigneePlaceholder')"
                    class="input text-sm w-full"
                  />
                </div>

                <!-- Due Date -->
                <div>
                  <label class="text-xs font-medium text-navy-700 mb-1 block">{{ t('workspace.card.dueDateLabel') }}</label>
                  <input type="date" v-model="newCard.dueDate" class="input text-sm w-full" />
                </div>
              </div>
              <div class="px-5 py-3 border-t border-stone-100 bg-stone-50 flex justify-end gap-2">
                <button @click="showAddCard = false" class="btn btn-outline btn-sm">{{ t('common.cancel') }}</button>
                <button @click="addCard" :disabled="!newCard.text.trim()" class="btn btn-primary btn-sm">{{ t('workspace.addNote') }}</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import { usePageTitle } from '@/lib/usePageTitle'
import api from '@/services/api'

const { t } = useI18n()
usePageTitle(t('workspace.title'))

// --- Interfaces ---
interface WorkspaceCard {
  id: string
  text: string
  grantId: string
  grantName: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  dueDate: string
  column: 'todo' | 'inProgress' | 'review' | 'done'
  resolved: boolean
  source: 'manual' | 'handoff' | 'suggested'
  createdAt: string
}

interface TeamMember {
  id: string
  name: string
}

// --- State ---
const boardCards = ref<WorkspaceCard[]>([])
const teamMembers = ref<TeamMember[]>([])
const savedGrantsList = ref<{ id: string; title: string; status: string; deadline: string }[]>([])
const showTeamSidebar = ref(false)
const showAddCard = ref(false)
const openCardMenu = ref('')
const filterAssignee = ref('')
const filterUrgency = ref('')
const filterGrant = ref('')
const newMemberName = ref('')
const newCard = ref({
  text: '',
  grantId: '',
  urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  column: 'todo' as 'todo' | 'inProgress' | 'review' | 'done',
  assignee: '',
  dueDate: ''
})

// --- Column definitions ---
const columns = computed(() => [
  {
    id: 'todo' as const,
    label: t('workspace.columns.todo'),
    shortLabel: t('workspace.columns.todoShort'),
    bgClass: 'bg-stone-100',
    dotClass: 'bg-stone-400',
    moveButtonClass: 'bg-stone-100 text-stone-600 hover:bg-stone-200'
  },
  {
    id: 'inProgress' as const,
    label: t('workspace.columns.inProgress'),
    shortLabel: t('workspace.columns.inProgressShort'),
    bgClass: 'bg-blue-50',
    dotClass: 'bg-blue-400',
    moveButtonClass: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
  },
  {
    id: 'review' as const,
    label: t('workspace.columns.review'),
    shortLabel: t('workspace.columns.reviewShort'),
    bgClass: 'bg-amber-50',
    dotClass: 'bg-amber-400',
    moveButtonClass: 'bg-amber-50 text-amber-600 hover:bg-amber-100'
  },
  {
    id: 'done' as const,
    label: t('workspace.columns.done'),
    shortLabel: t('workspace.columns.doneShort'),
    bgClass: 'bg-emerald-50',
    dotClass: 'bg-emerald-400',
    moveButtonClass: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
  }
])

// --- Filtered cards per column ---
function filteredCardsForColumn(columnId: string): WorkspaceCard[] {
  return boardCards.value.filter(card => {
    if (card.column !== columnId) return false
    if (filterAssignee.value === '__unassigned__' && card.assignee.trim() !== '') return false
    if (filterAssignee.value && filterAssignee.value !== '__unassigned__' && card.assignee !== filterAssignee.value) return false
    if (filterUrgency.value && card.urgency !== filterUrgency.value) return false
    if (filterGrant.value && card.grantId !== filterGrant.value) return false
    return true
  })
}

const totalCardCount = computed(() => {
  return columns.value.reduce((sum, col) => sum + filteredCardsForColumn(col.id).length, 0)
})

// --- Urgency styling ---
function urgencyBorderClass(urgency: string): string {
  const classes: Record<string, string> = {
    low: 'border-l-4 border-l-stone-300',
    medium: 'border-l-4 border-l-blue-400',
    high: 'border-l-4 border-l-amber-400',
    critical: 'border-l-4 border-l-red-500'
  }
  return classes[urgency] || ''
}

function urgencyBadgeClass(urgency: string): string {
  const classes: Record<string, string> = {
    low: 'bg-stone-100 text-stone-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-amber-100 text-amber-700',
    critical: 'bg-red-100 text-red-700'
  }
  return classes[urgency] || 'bg-stone-100 text-stone-600'
}

// --- Card actions ---
function moveCard(cardId: string, toColumn: string) {
  const card = boardCards.value.find(c => c.id === cardId)
  if (card) {
    card.column = toColumn as WorkspaceCard['column']
    saveBoard()
  }
}

function toggleResolve(cardId: string) {
  const card = boardCards.value.find(c => c.id === cardId)
  if (card) {
    card.resolved = !card.resolved
    if (card.resolved) {
      card.column = 'done'
    }
    saveBoard()
  }
}

function deleteCard(cardId: string) {
  boardCards.value = boardCards.value.filter(c => c.id !== cardId)
  saveBoard()
}

function toggleCardMenu(cardId: string) {
  openCardMenu.value = openCardMenu.value === cardId ? '' : cardId
}

function addCard() {
  if (!newCard.value.text.trim()) return

  const grantId = newCard.value.grantId
  const grant = savedGrantsList.value.find(g => g.id === grantId)

  const card: WorkspaceCard = {
    id: 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    text: newCard.value.text.trim(),
    grantId: grantId,
    grantName: grant?.title || '',
    urgency: newCard.value.urgency,
    assignee: newCard.value.assignee,
    dueDate: newCard.value.dueDate,
    column: newCard.value.column,
    resolved: false,
    source: 'manual',
    createdAt: new Date().toISOString()
  }

  boardCards.value.push(card)
  saveBoard()

  // Reset form
  newCard.value = {
    text: '',
    grantId: '',
    urgency: 'medium',
    column: 'todo',
    assignee: '',
    dueDate: ''
  }
  showAddCard.value = false
}

// --- Due date helper ---
function getDaysUntilDue(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
}

// --- Team members ---
function addTeamMember() {
  const name = newMemberName.value.trim()
  if (!name) return
  if (teamMembers.value.some(m => m.name === name)) return

  teamMembers.value.push({
    id: 'member_' + Date.now(),
    name
  })
  newMemberName.value = ''
  saveTeamMembers()
}

function removeTeamMember(id: string) {
  teamMembers.value = teamMembers.value.filter(m => m.id !== id)
  saveTeamMembers()
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0]!.charAt(0) + parts[1]!.charAt(0)).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function getCardCountForMember(name: string): number {
  return boardCards.value.filter(c => c.assignee === name && !c.resolved).length
}

// --- Persistence ---
function saveBoard() {
  try {
    localStorage.setItem('workspaceBoard', JSON.stringify(boardCards.value))
  } catch { /* storage full */ }
}

function loadBoard() {
  try {
    const stored = localStorage.getItem('workspaceBoard')
    if (stored) {
      boardCards.value = JSON.parse(stored)
    }
  } catch { boardCards.value = [] }
}

function saveTeamMembers() {
  try {
    localStorage.setItem('workspaceTeamMembers', JSON.stringify(teamMembers.value))
  } catch { /* storage full */ }
}

function loadTeamMembers() {
  try {
    const stored = localStorage.getItem('workspaceTeamMembers')
    if (stored) {
      teamMembers.value = JSON.parse(stored)
    }
  } catch { teamMembers.value = [] }
}

// --- Load handoff notes from all saved grants ---
function loadHandoffNotes() {
  const savedIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
  const existingHandoffIds = new Set(
    boardCards.value.filter(c => c.source === 'handoff').map(c => c.id)
  )

  for (const grantId of savedIds) {
    try {
      const stored = localStorage.getItem(`grantHandoffNotes_${grantId}`)
      if (!stored) continue
      const notes = JSON.parse(stored) as Array<{ id?: string; text: string; type: string; pinned?: boolean; timestamp?: string }>
      const grant = savedGrantsList.value.find(g => g.id === grantId)
      const grantName = grant?.title || `Grant ${grantId}`

      for (const note of notes) {
        const noteId = `handoff_${grantId}_${note.id || note.timestamp || note.text.substring(0, 20)}`
        if (existingHandoffIds.has(noteId)) continue

        // Map handoff note type to urgency
        let urgency: WorkspaceCard['urgency'] = 'low'
        if (note.type === 'blocker') urgency = 'critical'
        else if (note.type === 'action') urgency = 'high'
        else if (note.type === 'question') urgency = 'medium'
        else if (note.type === 'decision') urgency = 'medium'

        boardCards.value.push({
          id: noteId,
          text: note.text,
          grantId: grantId,
          grantName: grantName,
          urgency,
          assignee: '',
          dueDate: '',
          column: note.type === 'blocker' ? 'todo' : 'todo',
          resolved: false,
          source: 'handoff',
          createdAt: note.timestamp || new Date().toISOString()
        })
      }
    } catch { /* ignore */ }
  }
}

// --- Auto-generated suggested action cards ---
function generateSuggestedCards() {
  const existingSuggestionTexts = new Set(
    boardCards.value.filter(c => c.source === 'suggested').map(c => c.text)
  )

  const savedIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
  const workflows: Record<string, string> = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000

  for (const grantId of savedIds) {
    const grant = savedGrantsList.value.find(g => g.id === grantId)
    if (!grant) continue
    const status = workflows[grantId] || 'interested'

    // Suggestion: grants in "applying" without handoff notes
    if (status === 'applying') {
      const hasNotes = localStorage.getItem(`grantHandoffNotes_${grantId}`)
      if (!hasNotes || hasNotes === '[]') {
        const text = t('workspace.suggestions.noHandoffNotes', { grant: grant.title })
        if (!existingSuggestionTexts.has(text)) {
          boardCards.value.push({
            id: 'suggested_handoff_' + grantId,
            text,
            grantId: grantId,
            grantName: grant.title,
            urgency: 'medium',
            assignee: '',
            dueDate: '',
            column: 'todo',
            resolved: false,
            source: 'suggested',
            createdAt: new Date().toISOString()
          })
        }
      }
    }

    // Suggestion: grants with deadlines within 7 days
    if (grant.deadline) {
      const deadlineMs = new Date(grant.deadline).getTime()
      const daysUntil = deadlineMs - now
      if (daysUntil > 0 && daysUntil <= sevenDays) {
        const daysLeft = Math.ceil(daysUntil / (24 * 60 * 60 * 1000))
        const text = t('workspace.suggestions.deadlineSoon', { grant: grant.title, days: daysLeft })
        if (!existingSuggestionTexts.has(text)) {
          boardCards.value.push({
            id: 'suggested_deadline_' + grantId,
            text,
            grantId: grantId,
            grantName: grant.title,
            urgency: daysLeft <= 3 ? 'critical' : 'high',
            assignee: '',
            dueDate: grant.deadline,
            column: 'todo',
            resolved: false,
            source: 'suggested',
            createdAt: new Date().toISOString()
          })
        }
      }
    }
  }
}

// --- Load saved grants ---
async function loadSavedGrants() {
  try {
    const savedIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
    if (savedIds.length === 0) {
      savedGrantsList.value = []
      return
    }
    const workflows: Record<string, string> = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
    const response = await api.get('/api/grants?limit=100')
    const all = response.data.grants || []
    savedGrantsList.value = all
      .filter((g: any) => savedIds.includes(g.id))
      .map((g: any) => ({
        id: g.id,
        title: g.title || `Grant ${g.id}`,
        status: workflows[g.id] || 'interested',
        deadline: g.deadline || ''
      }))
  } catch {
    savedGrantsList.value = []
  }
}

// --- Close card menu on outside click ---
function handleOutsideClick() {
  if (openCardMenu.value) {
    openCardMenu.value = ''
  }
}

// --- Watch for card menu click-away ---
watch(openCardMenu, (val) => {
  if (val) {
    setTimeout(() => {
      document.addEventListener('click', handleOutsideClick, { once: true })
    }, 0)
  }
})

// --- Initialization ---
onMounted(async () => {
  loadBoard()
  loadTeamMembers()
  await loadSavedGrants()
  loadHandoffNotes()
  generateSuggestedCards()
  saveBoard()
})
</script>

<style scoped>
.card-move-enter-active,
.card-move-leave-active {
  transition: all 0.3s ease;
}
.card-move-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.card-move-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
