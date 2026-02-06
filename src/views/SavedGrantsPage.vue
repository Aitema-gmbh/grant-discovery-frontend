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
        <!-- Blocked Dependencies Badge -->
        <span v-if="allGrants.length > 0 && getBlockedCount() > 0" class="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium border border-amber-200">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
          {{ $t('savedGrants.dependencies.blockedCount', { count: getBlockedCount() }) }}
        </span>
        <select v-if="allGrants.length > 0" v-model="sortMode" class="text-xs border border-navy-200 rounded-lg px-3 py-1.5 text-navy-700 bg-white focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none">
          <option value="default">{{ $t('savedGrants.sort.default') }}</option>
          <option value="urgent">{{ $t('savedGrants.sort.urgent') }}</option>
          <option value="budget">{{ $t('savedGrants.sort.budget') }}</option>
          <option value="readiness">{{ $t('savedGrants.sort.readiness') }}</option>
          <option value="newest">{{ $t('savedGrants.sort.newest') }}</option>
        </select>
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
        <button v-if="compareGrants.length >= 2" @click="showCompareModal = true" class="btn btn-primary btn-sm flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          {{ $t('comparison.compareNow') }} ({{ compareGrants.length }})
        </button>
        <button v-if="allGrants.length > 0" @click="shareGrantList" class="btn btn-outline btn-sm flex items-center gap-1.5" :title="$t('savedGrants.shareList')">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          <span class="hidden sm:inline">{{ $t('savedGrants.shareList') }}</span>
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

    <!-- Tag Filters -->
    <div v-if="allTags.length > 0 || allGrants.length > 0" class="flex flex-wrap items-center gap-2 mb-4">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="activeTagFilter = activeTagFilter === tag ? null : tag"
        class="group px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1"
        :class="activeTagFilter === tag ? 'bg-navy-800 text-white' : 'bg-navy-100 text-navy-600 hover:bg-navy-200'"
      >
        {{ tag }}
        <span @click.stop="removeTag(tag)" class="ml-0.5 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-opacity">&times;</span>
      </button>
      <button v-if="!showTagInput" @click="showTagInput = true" class="px-3 py-1 rounded-full text-xs font-medium text-navy-400 border border-dashed border-navy-300 hover:border-amber-400 hover:text-amber-600 transition-all">
        + {{ $t('savedGrants.tags.addTag') }}
      </button>
      <div v-if="showTagInput" class="flex items-center gap-1">
        <input v-model="newTagName" @keyup.enter="addTag" :placeholder="$t('savedGrants.tags.tagName')" class="input text-xs py-1 px-2 w-28" autofocus />
        <button @click="addTag" class="text-xs text-amber-600 font-medium">{{ $t('common.save') }}</button>
        <button @click="showTagInput = false; newTagName = ''" class="text-xs text-navy-400">&times;</button>
      </div>
    </div>

    <!-- Deadline Conflicts Panel -->
    <div v-if="deadlineConflicts.length > 0" class="mb-6 animate-fade-in">
      <div class="border border-amber-200 rounded-xl overflow-hidden bg-gradient-to-r from-amber-50 to-stone-50">
        <!-- Collapsible Header -->
        <button
          @click="showConflictPanel = !showConflictPanel"
          class="w-full flex items-center justify-between px-5 py-3 hover:bg-amber-50/50 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="text-left">
              <span class="text-sm font-semibold text-navy-800">{{ $t('savedGrants.deadlineConflicts.title') }}</span>
              <span class="ml-2 text-xs font-medium px-2 py-0.5 bg-amber-200 text-amber-800 rounded-full">
                {{ $t('savedGrants.deadlineConflicts.conflictsDetected', { count: deadlineConflicts.length }) }}
              </span>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-navy-400 transition-transform duration-200"
            :class="{ 'rotate-180': showConflictPanel }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Collapsible Body -->
        <div v-if="showConflictPanel" class="px-5 pb-4 border-t border-amber-100">
          <p class="text-xs text-navy-500 mt-3 mb-4">{{ $t('savedGrants.deadlineConflicts.description') }}</p>

          <div class="space-y-4">
            <div
              v-for="(conflict, idx) in deadlineConflicts"
              :key="idx"
              class="p-4 rounded-lg border"
              :class="conflictSeverityClass(conflict.severity)"
            >
              <!-- Window Header -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span class="text-sm font-semibold">
                    {{ $t('savedGrants.deadlineConflicts.windowLabel', { start: conflict.windowStart, end: conflict.windowEnd }) }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="conflictSeverityBadgeClass(conflict.severity)">
                    {{ conflict.severity === 'critical' ? $t('savedGrants.deadlineConflicts.severityCritical') : $t('savedGrants.deadlineConflicts.severityWarning') }}
                  </span>
                  <span class="text-xs font-medium opacity-75">
                    {{ $t('savedGrants.deadlineConflicts.grantsInWindow', { count: conflict.grants.length }) }}
                  </span>
                </div>
              </div>

              <!-- Grants List -->
              <div class="space-y-2">
                <router-link
                  v-for="grant in conflict.grants"
                  :key="grant.id"
                  :to="`/grants/${grant.id}`"
                  class="flex items-center gap-3 p-2.5 rounded-md bg-white/60 hover:bg-white transition-colors group"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-navy-800 truncate group-hover:text-amber-700 transition-colors">{{ grant.title }}</p>
                    <div class="flex items-center gap-3 mt-1">
                      <span class="text-xs text-navy-500">
                        {{ new Date(grant.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) }}
                      </span>
                      <span class="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 capitalize">{{ grant.status }}</span>
                    </div>
                  </div>
                  <!-- Milestone Progress Bar -->
                  <div class="flex items-center gap-2 flex-shrink-0 w-32">
                    <div class="flex-1 h-1.5 rounded-full bg-stone-200">
                      <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="grant.milestoneProgress.pct >= 60 ? 'bg-sage-500' : grant.milestoneProgress.pct >= 30 ? 'bg-amber-400' : 'bg-red-400'"
                        :style="{ width: grant.milestoneProgress.pct + '%' }"
                      ></div>
                    </div>
                    <span class="text-[10px] text-stone-500 whitespace-nowrap">
                      {{ grant.milestoneProgress.completed }}/{{ grant.milestoneProgress.total }}
                    </span>
                  </div>
                  <svg class="w-4 h-4 text-navy-300 group-hover:text-amber-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Outcome Analytics -->
    <div v-if="outcomeStats.won + outcomeStats.lost > 0" class="mb-6 p-4 bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-100 rounded-xl animate-fade-in">
      <div class="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-lg">📊</span>
          <span class="font-semibold text-navy-800">{{ $t('savedGrants.outcomes.analytics') }}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          <span class="text-navy-600">{{ $t('savedGrants.outcomes.won') }}: <strong class="text-green-700">{{ outcomeStats.won }}</strong></span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-red-400"></span>
          <span class="text-navy-600">{{ $t('savedGrants.outcomes.lost') }}: <strong class="text-red-600">{{ outcomeStats.lost }}</strong></span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="font-semibold text-purple-700">{{ outcomeStats.winRate }}%</span>
          <span class="text-navy-500">{{ $t('savedGrants.outcomes.winRate') }}</span>
        </div>
        <div v-if="outcomeStats.totalAwarded > 0" class="flex items-center gap-1.5">
          <span class="font-semibold text-amber-700">€{{ outcomeStats.totalAwarded.toLocaleString() }}</span>
          <span class="text-navy-500">{{ $t('savedGrants.outcomes.totalAwarded') }}</span>
        </div>
      </div>
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

        <!-- Outcome Result -->
        <div v-if="getGrantStatus(grant.id) === 'outcome'" class="flex-shrink-0 flex items-center gap-1.5">
          <button
            v-for="oc in [{ id: 'won', icon: '✅', class: 'bg-green-100 text-green-700 border-green-300' }, { id: 'lost', icon: '❌', class: 'bg-red-50 text-red-600 border-red-200' }, { id: 'pending', icon: '⏳', class: 'bg-amber-50 text-amber-600 border-amber-200' }]"
            :key="oc.id"
            @click.stop="setGrantOutcome(grant.id, oc.id)"
            class="px-2 py-1 text-xs rounded-md border transition-all"
            :class="getGrantOutcome(grant.id)?.result === oc.id ? oc.class + ' ring-1 ring-offset-1' : 'bg-white text-navy-400 border-navy-200 hover:border-navy-300'"
          >
            {{ oc.icon }}
          </button>
        </div>

        <!-- Grant Info -->
        <router-link :to="`/grants/${grant.id}`" class="flex-1 min-w-0">
          <h3 class="font-semibold text-navy-900 truncate font-display hover:text-amber-600 transition-colors">
            {{ grant.title }}
            <span v-if="getHandoffNoteCount(grant.id).count > 0"
              class="inline-flex items-center gap-0.5 ml-2 text-xs px-1.5 py-0.5 rounded-full"
              :class="getHandoffNoteCount(grant.id).hasUrgent ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-500'">
              &#x1F4DD; {{ getHandoffNoteCount(grant.id).count }}
            </span>
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

        <!-- Tags -->
        <div class="flex-shrink-0 flex flex-wrap gap-1">
          <span
            v-for="tag in getGrantTags(grant.id)"
            :key="tag"
            class="px-1.5 py-0.5 text-[10px] bg-navy-100 text-navy-600 rounded font-medium"
          >{{ tag }}</span>
          <div class="relative group">
            <button @click.stop class="p-1 text-navy-300 hover:text-amber-500 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
            </button>
            <div class="hidden group-focus-within:block absolute right-0 top-full mt-1 z-10 bg-white border border-navy-200 rounded-lg shadow-lg p-2 min-w-[120px]">
              <button
                v-for="tag in allTags"
                :key="tag"
                @click.stop="toggleGrantTag(grant.id, tag)"
                class="flex items-center gap-1.5 w-full px-2 py-1 text-xs text-navy-700 hover:bg-navy-50 rounded transition-colors"
              >
                <span class="w-3 h-3 rounded border flex items-center justify-center" :class="getGrantTags(grant.id).includes(tag) ? 'bg-amber-500 border-amber-500 text-white' : 'border-navy-300'">
                  <svg v-if="getGrantTags(grant.id).includes(tag)" class="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </span>
                {{ tag }}
              </button>
              <p v-if="allTags.length === 0" class="text-[10px] text-navy-400 px-2 py-1">{{ $t('savedGrants.tags.noTags') }}</p>
            </div>
          </div>
        </div>

        <!-- Milestone Progress -->
        <div v-if="getStepsForGrant(String(grant.id)).length > 0" class="mt-3 pt-3 border-t border-stone-100 w-full">
          <div class="flex items-center gap-2 cursor-pointer" @click.stop="toggleMilestoneExpand(String(grant.id))">
            <div class="flex-1 h-1.5 rounded-full bg-stone-200">
              <div class="h-full rounded-full bg-sage-500 transition-all duration-300"
                :style="{ width: getMilestoneProgress(String(grant.id), getGrantStatus(String(grant.id))).pct + '%' }"></div>
            </div>
            <span class="text-[10px] text-stone-400 whitespace-nowrap">
              {{ getMilestoneProgress(String(grant.id), getGrantStatus(String(grant.id))).completed }}/{{ getMilestoneProgress(String(grant.id), getGrantStatus(String(grant.id))).total }}
            </span>
            <span class="text-[10px] text-stone-400">{{ expandedMilestones.has(String(grant.id)) ? '\u25B2' : '\u25BC' }}</span>
          </div>

          <div v-if="expandedMilestones.has(String(grant.id))" class="mt-2 space-y-1.5">
            <label v-for="step in getStepsForGrant(String(grant.id))" :key="step.key"
              class="flex items-center gap-2 text-xs cursor-pointer hover:bg-stone-50 rounded p-1 -mx-1"
              @click.stop>
              <input type="checkbox"
                :checked="getGrantMilestones(String(grant.id))[step.key]"
                @change="toggleMilestone(String(grant.id), step.key)"
                class="w-3.5 h-3.5 rounded border-stone-300 text-sage-600 focus:ring-sage-500" />
              <span :class="getGrantMilestones(String(grant.id))[step.key] ? 'text-stone-400 line-through' : 'text-navy-700'">
                {{ step.label }}
              </span>
            </label>
          </div>
        </div>

        <!-- Compare -->
        <button
          @click.stop="toggleComparison(grant)"
          class="flex-shrink-0 p-1.5 transition-colors"
          :class="isInComparison(grant.id) ? 'text-blue-500' : 'text-navy-400 hover:text-blue-500'"
          :aria-label="isInComparison(grant.id) ? $t('comparison.removeFromCompare') : $t('comparison.addToCompare')"
          :title="isInComparison(grant.id) ? $t('comparison.removeFromCompare') : $t('comparison.addToCompare')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </button>

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
                class="bg-white rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                :class="isGrantBlocked(String(grant.id)) ? 'border-2 border-dashed border-amber-400' : 'border border-stone-200'"
              >
                <router-link :to="`/grants/${grant.id}`" class="block" @click.stop>
                  <div class="flex items-center gap-1.5">
                    <h4 class="text-xs font-semibold text-navy-900 line-clamp-2 hover:text-amber-600 transition-colors flex-1">
                      {{ grant.title }}
                    </h4>
                    <span v-if="isGrantBlocked(String(grant.id))" class="flex-shrink-0 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-medium">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                      {{ $t('savedGrants.dependencies.blocked') }}
                    </span>
                  </div>
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

    <!-- Floating Comparison Bar -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-full opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-full opacity-0"
      >
        <div v-if="compareGrants.length > 0 && !showCompareModal" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-navy-900 text-white rounded-2xl shadow-2xl px-5 py-3 max-w-2xl">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              <span class="text-sm font-medium">{{ compareGrants.length }}/4</span>
            </div>
            <div class="hidden sm:flex items-center gap-2">
              <div v-for="cg in compareGrants" :key="cg.id" class="flex items-center gap-2 bg-white/10 rounded-lg px-2.5 py-1.5 max-w-[140px]">
                <p class="text-xs font-medium truncate flex-1 min-w-0">{{ cg.title }}</p>
                <button @click="toggleComparison(cg)" class="text-white/40 hover:text-white flex-shrink-0">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>
              </div>
            </div>
            <button
              @click="showCompareModal = true"
              :disabled="compareGrants.length < 2"
              class="btn btn-secondary btn-sm whitespace-nowrap"
              :class="compareGrants.length < 2 ? 'opacity-50 cursor-not-allowed' : ''"
            >
              {{ $t('comparison.compareNow') }}
            </button>
            <button @click="compareGrants = []" class="text-white/60 hover:text-white text-sm whitespace-nowrap">
              {{ $t('common.clear') }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Grant Comparison Matrix -->
    <GrantComparisonMatrix
      :grants="compareGrants"
      v-model="showCompareModal"
      @close="showCompareModal = false"
      @clear="compareGrants = []; showCompareModal = false"
    />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import GrantComparisonMatrix from '@/components/GrantComparisonMatrix.vue'
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
const sortMode = ref('default')

// Comparison
const compareGrants = ref<any[]>([])
const showCompareModal = ref(false)

function isInComparison(grantId: string): boolean {
  return compareGrants.value.some((g: any) => String(g.id) === String(grantId))
}

function toggleComparison(grant: any) {
  const idx = compareGrants.value.findIndex((g: any) => String(g.id) === String(grant.id))
  if (idx > -1) {
    compareGrants.value.splice(idx, 1)
  } else if (compareGrants.value.length < 4) {
    compareGrants.value.push(grant)
  } else {
    toast.warning(t('comparison.maxReached'))
  }
}

// Grant Dependency Mapper
interface GrantDependency {
  id: string
  fromGrantId: string
  toGrantId: string | null
  prerequisiteLabel?: string
  type: 'grant_completion' | 'document' | 'milestone' | 'custom'
  status: 'pending' | 'met'
  notes?: string
  createdAt: string
}

const grantDependencies = ref<GrantDependency[]>([])

function loadDependencies() {
  try {
    grantDependencies.value = JSON.parse(localStorage.getItem('grantDependencies') || '[]')
  } catch { grantDependencies.value = [] }
}

function getDependenciesFor(grantId: string): GrantDependency[] {
  return grantDependencies.value.filter(d => d.fromGrantId === grantId)
}

function isGrantBlocked(grantId: string): boolean {
  return getDependenciesFor(grantId).some(d => d.status === 'pending')
}

function getBlockedCount(): number {
  const grantIds = new Set(allGrants.value.map(g => String(g.id)))
  return Array.from(grantIds).filter(id => isGrantBlocked(id)).length
}

// Tagging system
const allTags = ref<string[]>([])
const activeTagFilter = ref<string | null>(null)
const showTagInput = ref(false)
const newTagName = ref('')

function loadTags() {
  try {
    allTags.value = JSON.parse(localStorage.getItem('grantTags') || '[]')
  } catch { allTags.value = [] }
}

function getGrantTags(grantId: string): string[] {
  try {
    const map = JSON.parse(localStorage.getItem('grantTagMap') || '{}')
    return map[grantId] || []
  } catch { return [] }
}

function toggleGrantTag(grantId: string, tag: string) {
  try {
    const map = JSON.parse(localStorage.getItem('grantTagMap') || '{}')
    const tags: string[] = map[grantId] || []
    const idx = tags.indexOf(tag)
    if (idx >= 0) tags.splice(idx, 1)
    else tags.push(tag)
    map[grantId] = tags
    localStorage.setItem('grantTagMap', JSON.stringify(map))
  } catch { /* storage full */ }
}

function addTag() {
  const name = newTagName.value.trim()
  if (!name || allTags.value.includes(name)) return
  allTags.value.push(name)
  localStorage.setItem('grantTags', JSON.stringify(allTags.value))
  newTagName.value = ''
  showTagInput.value = false
}

function removeTag(tag: string) {
  allTags.value = allTags.value.filter(t => t !== tag)
  localStorage.setItem('grantTags', JSON.stringify(allTags.value))
  // Clean up tag map
  try {
    const map = JSON.parse(localStorage.getItem('grantTagMap') || '{}')
    Object.keys(map).forEach(id => {
      map[id] = (map[id] || []).filter((t: string) => t !== tag)
    })
    localStorage.setItem('grantTagMap', JSON.stringify(map))
  } catch { /* */ }
  if (activeTagFilter.value === tag) activeTagFilter.value = null
}

// Deadline Conflict Detector
const showConflictPanel = ref(true)

const deadlineConflicts = computed(() => {
  const grantsWithDeadlines = filteredGrants.value.filter((g: any) => g.deadline)
  if (grantsWithDeadlines.length < 2) return []

  // Sort by deadline
  const sorted = [...grantsWithDeadlines].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )

  // Group into 7-day windows
  const windows: Array<{
    windowStart: string
    windowEnd: string
    grants: Array<{ id: string; title: string; deadline: string; milestoneProgress: { completed: number; total: number; pct: number }; status: string }>
    severity: 'warning' | 'critical'
  }> = []

  let i = 0
  while (i < sorted.length) {
    const windowStartDate = new Date(sorted[i]!.deadline)
    const windowEndDate = new Date(windowStartDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    const windowGrants: typeof windows[0]['grants'] = []

    let j = i
    while (j < sorted.length && new Date(sorted[j]!.deadline).getTime() <= windowEndDate.getTime()) {
      const g = sorted[j]!
      const grantId = String(g.id)
      const status = getGrantStatus(grantId)
      const progress = getMilestoneProgress(grantId, status)
      windowGrants.push({
        id: g.id,
        title: g.title,
        deadline: g.deadline,
        milestoneProgress: progress,
        status
      })
      j++
    }

    if (windowGrants.length >= 2) {
      const lastDeadline = new Date(windowGrants[windowGrants.length - 1]!.deadline)
      windows.push({
        windowStart: windowStartDate.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        windowEnd: lastDeadline.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
        grants: windowGrants,
        severity: windowGrants.length >= 3 ? 'critical' : 'warning'
      })
    }

    // Move past this window to avoid duplicating grants across windows
    i = j > i ? j : i + 1
  }

  return windows
})

function conflictSeverityClass(severity: 'warning' | 'critical'): string {
  if (severity === 'critical') return 'bg-red-100 text-red-700 border-red-300'
  return 'bg-amber-100 text-amber-700 border-amber-300'
}

function conflictSeverityBadgeClass(severity: 'warning' | 'critical'): string {
  if (severity === 'critical') return 'bg-red-600 text-white'
  return 'bg-amber-500 text-white'
}

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

// Outcome tracking
function getGrantOutcome(grantId: string): { result: string; amountAwarded: number } | null {
  try {
    const outcomes = JSON.parse(localStorage.getItem('grantOutcomes') || '{}')
    return outcomes[grantId] || null
  } catch { return null }
}

function setGrantOutcome(grantId: string, result: string, amountAwarded: number = 0) {
  try {
    const outcomes = JSON.parse(localStorage.getItem('grantOutcomes') || '{}')
    outcomes[grantId] = { result, amountAwarded }
    localStorage.setItem('grantOutcomes', JSON.stringify(outcomes))
  } catch { /* storage full */ }
}

// Outcome analytics
const outcomeStats = computed(() => {
  const outcomes = JSON.parse(localStorage.getItem('grantOutcomes') || '{}')
  let won = 0, lost = 0, pending = 0, totalAwarded = 0
  Object.values(outcomes).forEach((o: any) => {
    if (o.result === 'won') { won++; totalAwarded += (o.amountAwarded || 0) }
    else if (o.result === 'lost') lost++
    else if (o.result === 'pending') pending++
  })
  const total = won + lost
  const winRate = total > 0 ? Math.round((won / total) * 100) : 0
  return { won, lost, pending, totalAwarded, winRate }
})

function grantsForStatus(statusId: string): any[] {
  return allGrants.value.filter(g => getGrantStatus(g.id) === statusId)
}

function getHandoffNoteCount(grantId: string | number): { count: number; hasUrgent: boolean } {
  const stored = localStorage.getItem(`grantHandoffNotes_${grantId}`)
  if (!stored) return { count: 0, hasUrgent: false }
  const notes = JSON.parse(stored) as { type: string }[]
  return {
    count: notes.length,
    hasUrgent: notes.some(n => n.type === 'blocker' || n.type === 'action')
  }
}

function getReadinessScore(grantId: string): number {
  let score = 0
  const status = getGrantStatus(grantId)
  // Status progress score
  const statusScores: Record<string, number> = { interested: 0, researching: 20, applying: 50, submitted: 80, outcome: 100 }
  score += statusScores[status] || 0
  // Prep checklist progress
  try {
    const items = JSON.parse(localStorage.getItem(`grantPrep_${grantId}`) || '[]')
    if (items.length > 0) {
      const checked = items.filter((i: any) => i.checked).length
      score += Math.round((checked / items.length) * 30)
    }
  } catch { /* ignore */ }
  // Has notes
  try {
    const notes = localStorage.getItem(`grantNotes_${grantId}`)
    if (notes && notes.length > 2) score += 10
  } catch { /* ignore */ }
  // Has budget plan
  try {
    const budget = localStorage.getItem(`grantBudget_${grantId}`)
    if (budget) score += 10
  } catch { /* ignore */ }
  return score
}

const filteredGrants = computed(() => {
  let grants = activeStatusFilter.value
    ? allGrants.value.filter(g => getGrantStatus(g.id) === activeStatusFilter.value)
    : [...allGrants.value]

  // Apply tag filter
  if (activeTagFilter.value) {
    grants = grants.filter(g => getGrantTags(g.id).includes(activeTagFilter.value!))
  }

  if (sortMode.value === 'urgent') {
    grants.sort((a, b) => {
      const da = a.deadline ? new Date(a.deadline).getTime() : Infinity
      const db = b.deadline ? new Date(b.deadline).getTime() : Infinity
      return da - db
    })
  } else if (sortMode.value === 'budget') {
    grants.sort((a, b) => (b.amount_max || b.amount_min || 0) - (a.amount_max || a.amount_min || 0))
  } else if (sortMode.value === 'readiness') {
    grants.sort((a, b) => getReadinessScore(b.id) - getReadinessScore(a.id))
  } else if (sortMode.value === 'newest') {
    grants.sort((a, b) => {
      const da = a.created_at ? new Date(a.created_at).getTime() : 0
      const db = b.created_at ? new Date(b.created_at).getTime() : 0
      return db - da
    })
  }
  return grants
})

// Milestone Progress Tracker
const expandedMilestones = ref<Set<string>>(new Set())

const stageSteps: Record<string, { key: string; label: string }[]> = {
  interested: [
    { key: 'read_call', label: 'Read full grant call' },
    { key: 'check_eligibility', label: 'Check eligibility criteria' },
    { key: 'discuss_team', label: 'Discuss with team' },
  ],
  researching: [
    { key: 'gather_docs', label: 'Gather required documents' },
    { key: 'find_partners', label: 'Identify potential partners' },
    { key: 'review_budget', label: 'Review budget requirements' },
    { key: 'confirm_cofin', label: 'Confirm co-financing' },
  ],
  applying: [
    { key: 'draft_proposal', label: 'Draft proposal narrative' },
    { key: 'prepare_budget', label: 'Prepare budget breakdown' },
    { key: 'collect_annexes', label: 'Collect annexes & attachments' },
    { key: 'internal_review', label: 'Internal review & sign-off' },
    { key: 'submit', label: 'Submit application' },
  ],
  submitted: [
    { key: 'confirmation', label: 'Submission confirmation received' },
    { key: 'clarifications', label: 'Respond to clarifications (if any)' },
  ]
}

function getGrantMilestones(grantId: string): Record<string, boolean> {
  try {
    const all = JSON.parse(localStorage.getItem('grantMilestones') || '{}')
    return all[grantId] || {}
  } catch { return {} }
}

function toggleMilestone(grantId: string, stepKey: string) {
  try {
    const all = JSON.parse(localStorage.getItem('grantMilestones') || '{}')
    if (!all[grantId]) all[grantId] = {}
    all[grantId][stepKey] = !all[grantId][stepKey]
    localStorage.setItem('grantMilestones', JSON.stringify(all))
  } catch { /* storage full */ }
}

function getMilestoneProgress(grantId: string, stage: string): { completed: number; total: number; pct: number } {
  const steps = stageSteps[stage] || []
  if (steps.length === 0) return { completed: 0, total: 0, pct: 100 }
  const milestones = getGrantMilestones(grantId)
  const completed = steps.filter(s => milestones[s.key]).length
  return { completed, total: steps.length, pct: Math.round(completed / steps.length * 100) }
}

function toggleMilestoneExpand(grantId: string) {
  if (expandedMilestones.value.has(grantId)) {
    expandedMilestones.value.delete(grantId)
  } else {
    expandedMilestones.value.add(grantId)
  }
}

function getStepsForGrant(grantId: string): { key: string; label: string }[] {
  const stage = getGrantStatus(grantId)
  return stageSteps[stage] || []
}

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

function shareGrantList() {
  if (allGrants.value.length === 0) return
  const ids = allGrants.value.map((g: any) => g.id).join(',')
  const encoded = btoa(ids)
  const shareUrl = `${window.location.origin}/grants?shared=${encoded}`
  navigator.clipboard.writeText(shareUrl).then(() => {
    toast.success(t('savedGrants.shareCopied'))
  }).catch(() => {
    // Fallback
    const input = document.createElement('input')
    input.value = shareUrl
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    toast.success(t('savedGrants.shareCopied'))
  })
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

onMounted(() => {
  loadSavedGrants()
  loadTags()
  loadDependencies()
})
</script>
