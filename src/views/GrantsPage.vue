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
          :aria-label="$t('grants.searchPlaceholder')"
          class="input w-full pl-12 pr-4 sm:pr-48"
        />
        <svg class="absolute left-4 top-3.5 w-5 h-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>

        <!-- Search Mode Toggle - Hidden on mobile, shown below search on small screens -->
        <div class="absolute right-3 top-2.5 hidden sm:flex items-center gap-2" role="group" :aria-label="$t('grants.searchMode')">
          <button
            @click="searchMode = 'text'"
            :class="searchMode === 'text' ? 'btn-primary py-1 px-3 text-sm' : 'bg-navy-100 text-navy-700 py-1 px-3 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors'"
            :aria-pressed="searchMode === 'text'"
          >
            Text
          </button>
          <button
            @click="searchMode = 'semantic'"
            :class="searchMode === 'semantic' ? 'btn-secondary py-1 px-3 text-sm' : 'bg-navy-100 text-navy-700 py-1 px-3 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors'"
            class="flex items-center gap-1"
            :aria-pressed="searchMode === 'semantic'"
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
            {{ $t('grants.filters.amount') }}
            <HelpTooltip :content="$t('grants.filters.amountHint')" />
          </label>
          <div class="grid grid-cols-2 gap-2">
            <input
              v-model.number="filters.amountMin"
              type="number"
              :placeholder="$t('grants.filters.min')"
              class="input text-sm"
            />
            <input
              v-model.number="filters.amountMax"
              type="number"
              :placeholder="$t('grants.filters.max')"
              class="input text-sm"
            />
          </div>
        </div>

        <!-- Deadline -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            {{ $t('grants.deadline') }}
          </label>
          <select v-model="filters.deadline" class="input text-sm">
            <option value="">{{ $t('grants.filters.anyDeadline') }}</option>
            <option value="7">{{ $t('grants.filters.next7Days') }}</option>
            <option value="14">{{ $t('grants.filters.next14Days') }}</option>
            <option value="30">{{ $t('grants.filters.next30Days') }}</option>
            <option value="90">{{ $t('grants.filters.next90Days') }}</option>
            <option value="180">{{ $t('grants.filters.next6Months') }}</option>
          </select>
        </div>

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            {{ $t('grants.filters.country') }}
          </label>
          <select v-model="filters.country" class="input text-sm">
            <option value="">{{ $t('grants.filters.allCountries') }}</option>
            <option value="UA">🇺🇦 {{ $t('grants.filters.ukraine') }}</option>
            <option value="PL">{{ $t('grants.filters.poland') }}</option>
            <option value="DE">{{ $t('grants.filters.germany') }}</option>
            <option value="FR">{{ $t('grants.filters.france') }}</option>
            <option value="US">{{ $t('grants.filters.usa') }}</option>
            <option value="UK">{{ $t('grants.filters.uk') }}</option>
            <option value="EU">{{ $t('grants.filters.eu') }}</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-navy-700 mb-2">
            {{ $t('grants.filters.statusLabel') }}
          </label>
          <select v-model="filters.status" class="input text-sm">
            <option value="">{{ $t('grants.filters.allStatuses') }}</option>
            <option value="open">🟢 {{ $t('grants.filters.statusOpen') }}</option>
            <option value="upcoming">🟡 {{ $t('grants.filters.statusUpcoming') }}</option>
            <option value="closed">🔴 {{ $t('grants.filters.statusClosed') }}</option>
          </select>
        </div>
      </div>

      <!-- Recent & Saved Searches -->
      <div v-if="recentSearches.length > 0 && !searchQuery" class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-navy-100">
        <span class="text-xs font-medium text-navy-500">{{ $t('grants.recentSearches') }}:</span>
        <button
          v-for="(rs, idx) in recentSearches"
          :key="idx"
          @click="applyRecentSearch(rs)"
          class="inline-flex items-center gap-1 px-3 py-1 bg-navy-50 text-navy-700 rounded-full text-xs hover:bg-navy-100 transition-colors"
        >
          <svg class="w-3 h-3 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ rs.query }}
          <button @click.stop="removeRecentSearch(idx)" class="ml-0.5 text-navy-400 hover:text-red-500">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </button>
        <button
          @click="clearRecentSearches"
          class="text-xs text-navy-400 hover:text-red-500 transition-colors ml-1"
        >
          {{ $t('common.clear') }}
        </button>
      </div>

      <!-- Recently Viewed Grants -->
      <div v-if="recentlyViewed.length > 0 && !searchQuery" class="flex flex-wrap items-center gap-2 mt-3">
        <span class="text-xs font-medium text-navy-500">{{ $t('grants.recentlyViewed') }}:</span>
        <router-link
          v-for="rv in recentlyViewed"
          :key="rv.id"
          :to="`/grants/${rv.id}`"
          class="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs hover:bg-amber-100 transition-colors"
        >
          <svg class="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          {{ rv.title.length > 30 ? rv.title.slice(0, 30) + '...' : rv.title }}
        </router-link>
      </div>

      <!-- Active Filters Tags -->
      <div v-if="activeFiltersCount > 0" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-navy-100">
        <span class="text-sm font-medium text-navy-700">{{ $t('grants.filters.active') }}:</span>
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

    <!-- Sector Filter Chips -->
    <div class="flex flex-wrap gap-2 mb-6 animate-fade-in" style="animation-delay: 0.05s">
      <button
        @click="filters.category = ''; searchGrants()"
        :class="!filters.category ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-navy-700 border border-navy-200 hover:border-amber-400 hover:text-amber-700'"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
      >
        {{ $t('grants.allCategories') }}
      </button>
      <button
        v-for="sector in sectorChips"
        :key="sector.value"
        @click="filters.category = sector.value; searchGrants()"
        :class="filters.category === sector.value ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-navy-700 border border-navy-200 hover:border-amber-400 hover:text-amber-700'"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
      >
        <span>{{ sector.icon }}</span>
        {{ sector.label }}
      </button>
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
          {{ $t('grants.aiSearchActive') }}
        </p>
      </div>

      <div class="flex items-center gap-3">
        <!-- CSV Export -->
        <button
          v-if="grants.length > 0"
          @click="exportGrantsCsv"
          class="btn btn-outline btn-sm hidden sm:inline-flex items-center gap-1.5"
          :aria-label="$t('grants.exportCsv')"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          CSV
        </button>

        <!-- Sort -->
        <select v-model="sortBy" @change="searchGrants" class="input text-sm" :aria-label="$t('grants.sortLabel')">
          <option value="relevance">{{ $t('grants.sort.relevance') }}</option>
          <option value="deadline">{{ $t('grants.sort.deadline') }}</option>
          <option value="amount">{{ $t('grants.sort.amount') }}</option>
          <option value="recent">{{ $t('grants.sort.recent') }}</option>
        </select>

        <!-- View Toggle -->
        <div class="flex items-center gap-1 bg-navy-100 rounded-lg p-1" role="group" :aria-label="$t('grants.viewMode')">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-white shadow-soft text-navy-900' : 'text-navy-600'"
            class="p-2 rounded transition-all"
            :aria-pressed="viewMode === 'grid'"
            :aria-label="$t('grants.gridView')"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-white shadow-soft text-navy-900' : 'text-navy-600'"
            class="p-2 rounded transition-all"
            :aria-pressed="viewMode === 'list'"
            :aria-label="$t('grants.listView')"
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
      <SkeletonCard v-for="i in 6" :key="i" />
    </div>

    <!-- Grants Grid/List -->
    <div v-else-if="grants.length > 0" :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'">
      <div v-for="(grant, index) in grants" :key="grant.id"
        class="grant-card-ukraine card-lift cursor-pointer animate-fade-in relative overflow-hidden"
        :style="`animation-delay: ${index * 0.05}s`"
        @click="viewGrantDetails(grant)"
      >
        <!-- Category Color Strip -->
        <div class="absolute top-0 left-0 w-1 h-full" :class="categoryColorStrip(grant.category)"></div>

        <!-- Deadline Urgency Badge -->
        <div v-if="deadlineDaysLeft(grant.deadline) >= 0 && deadlineDaysLeft(grant.deadline) <= 7" class="absolute top-3 right-3">
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.828a1 1 0 101.415-1.414L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            {{ deadlineDaysLeft(grant.deadline) === 0 ? $t('grants.deadlineToday') : $t('grants.deadlineDaysLeft', { days: deadlineDaysLeft(grant.deadline) }) }}
          </span>
        </div>
        <div v-else-if="deadlineDaysLeft(grant.deadline) > 7 && deadlineDaysLeft(grant.deadline) <= 14" class="absolute top-3 right-3">
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
            {{ $t('grants.closingSoon') }}
          </span>
        </div>

        <!-- Grant Card Content -->
        <div class="pl-3">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 pr-16">
              <h3 class="font-semibold text-navy-900 line-clamp-3 sm:line-clamp-2 font-display" :title="grant.title">
                {{ grant.title }}
              </h3>
              <p class="text-sm text-navy-600 mt-1">
                {{ grant.program_name || grant.source_id }}
              </p>
            </div>
            <button
              @click.stop="toggleSaveGrant(grant.id)"
              class="ml-2 text-navy-400 hover:text-amber-500 transition-colors flex-shrink-0"
              :aria-label="savedGrants.includes(grant.id) ? $t('grants.unsaveGrant') : $t('grants.saveGrant')"
              :aria-pressed="savedGrants.includes(grant.id)"
            >
              <svg class="w-5 h-5" :class="savedGrants.includes(grant.id) ? 'fill-amber-500 text-amber-500' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
              </svg>
              <span class="font-semibold text-amber-600">
                {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
              </span>
            </div>

            <div v-if="grant.deadline" class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4" :class="deadlineDaysLeft(grant.deadline) <= 7 ? 'text-red-500' : deadlineDaysLeft(grant.deadline) <= 14 ? 'text-amber-500' : 'text-navy-400'" fill="currentColor" viewBox="0 0 20 20">
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

          <!-- Status Badge & Category -->
          <div class="mt-4 pt-4 border-t border-navy-100 flex items-center justify-between">
            <span :class="statusBadgeClass(grant.status)">
              {{ grant.status || 'Open' }}
            </span>
            <span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full" :class="categoryBadgeClass(grant.category)">
              <span>{{ categoryIcon(grant.category) }}</span>
              {{ grant.category || 'General' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State: Search with no results -->
    <div v-else-if="searchQuery" class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('grants.emptySearch.title') }}</h3>
      <p class="text-navy-600 mb-2 max-w-md mx-auto">
        {{ $t('grants.emptySearch.description', { query: searchQuery }) }}
      </p>
      <ul class="text-sm text-navy-500 mb-6 space-y-1 max-w-sm mx-auto text-left">
        <li class="flex items-start gap-2">
          <span class="text-amber-500 mt-0.5">•</span>
          {{ $t('grants.emptySearch.tip1') }}
        </li>
        <li class="flex items-start gap-2">
          <span class="text-amber-500 mt-0.5">•</span>
          {{ $t('grants.emptySearch.tip2') }}
        </li>
        <li v-if="searchMode === 'text'" class="flex items-start gap-2">
          <span class="text-amber-500 mt-0.5">•</span>
          {{ $t('grants.emptySearch.tip3') }}
        </li>
      </ul>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="clearFilters" class="btn btn-outline">
          {{ $t('grants.clearFilters') }}
        </button>
        <button v-if="searchMode === 'text'" @click="searchMode = 'semantic'; searchGrants()" class="btn btn-secondary">
          🤖 {{ $t('grants.emptySearch.tryAI') }}
        </button>
      </div>
    </div>

    <!-- Empty State: Filters active with no results -->
    <div v-else-if="activeFiltersCount > 0" class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('grants.emptyFilters.title') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        {{ $t('grants.emptyFilters.description') }}
      </p>
      <button @click="clearFilters" class="btn btn-primary">
        {{ $t('grants.clearFilters') }}
      </button>
    </div>

    <!-- Empty State: No grants at all -->
    <div v-else class="text-center py-16 animate-fade-in">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('grants.emptyDefault.title') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        {{ $t('grants.emptyDefault.description') }}
      </p>
      <router-link to="/dashboard" class="btn btn-primary">
        {{ $t('grants.emptyDefault.goToDashboard') }}
      </router-link>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && grants.length > 0" class="flex items-center justify-between mt-12 pt-8 border-t border-navy-100">
      <p class="text-sm text-navy-700 font-medium">
        {{ $t('grants.showingResults', { from: (currentPage - 1) * pageSize + 1, to: Math.min(currentPage * pageSize, totalGrants), total: totalGrants.toLocaleString() }) }}
      </p>
      <div class="flex gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn btn-outline"
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''"
          :aria-label="$t('common.previous')"
        >
          {{ $t('common.previous') }}
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage * pageSize >= totalGrants"
          class="btn btn-primary"
          :class="currentPage * pageSize >= totalGrants ? 'opacity-50 cursor-not-allowed' : ''"
          :aria-label="$t('common.next')"
        >
          {{ $t('common.next') }}
        </button>
      </div>
    </div>
    <ScrollToTop />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'
import { useFeedback } from '@/lib/useFeedback'

const router = useRouter()
const { t } = useI18n()
const { trackPageView, trackGrantAction } = useFeedback()
const toast = useToast()

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
  category: '',
})

// Sector filter chips for quick category filtering
const sectorChips = computed(() => [
  { value: 'humanitarian', icon: '🏥', label: t('grants.sectors.humanitarian') },
  { value: 'education', icon: '📚', label: t('grants.sectors.education') },
  { value: 'democracy', icon: '🏛️', label: t('grants.sectors.democracy') },
  { value: 'environment', icon: '🌱', label: t('grants.sectors.environment') },
  { value: 'culture', icon: '🎭', label: t('grants.sectors.culture') },
  { value: 'health', icon: '💊', label: t('grants.sectors.health') },
  { value: 'infrastructure', icon: '🏗️', label: t('grants.sectors.infrastructure') },
  { value: 'economic', icon: '💼', label: t('grants.sectors.economic') },
])

// Saved grants (localStorage)
const savedGrants = ref<string[]>([])

// Recent searches (localStorage)
interface RecentSearch {
  query: string
  mode: 'text' | 'semantic'
  timestamp: number
}
const recentSearches = ref<RecentSearch[]>([])

function loadRecentSearches() {
  try {
    const saved = localStorage.getItem('recentSearches')
    if (saved) recentSearches.value = JSON.parse(saved)
  } catch { /* ignore */ }
}

function saveRecentSearch(query: string, mode: 'text' | 'semantic') {
  if (!query.trim() || query.length < 3) return
  // Remove duplicates
  recentSearches.value = recentSearches.value.filter(rs => rs.query !== query)
  // Add to front, keep max 5
  recentSearches.value.unshift({ query, mode, timestamp: Date.now() })
  recentSearches.value = recentSearches.value.slice(0, 5)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

function applyRecentSearch(rs: RecentSearch) {
  searchQuery.value = rs.query
  searchMode.value = rs.mode
  searchGrants()
}

function removeRecentSearch(index: number) {
  recentSearches.value.splice(index, 1)
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
}

function clearRecentSearches() {
  recentSearches.value = []
  localStorage.removeItem('recentSearches')
}

// Recently viewed grants
const recentlyViewed = ref<Array<{id: string, title: string}>>([])

function loadRecentlyViewed() {
  try {
    const saved = localStorage.getItem('recentlyViewedGrants')
    if (saved) recentlyViewed.value = JSON.parse(saved).slice(0, 5)
  } catch { /* ignore */ }
}

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
  if (searchQuery.value) saveRecentSearch(searchQuery.value, searchMode.value)
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
    if (filters.value.category) params.append('category', filters.value.category)

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
    toast.error(t('errors.network'))
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
    category: '',
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

// CSV Export
function exportGrantsCsv() {
  const headers = ['Title', 'Category', 'Donor', 'Amount Min', 'Amount Max', 'Currency', 'Deadline', 'Countries', 'URL']
  const rows = grants.value.map((g: any) => [
    `"${(g.title || '').replace(/"/g, '""')}"`,
    g.category || '',
    `"${(g.donor_name || '').replace(/"/g, '""')}"`,
    g.amount_min || '',
    g.amount_max || '',
    g.currency || 'EUR',
    g.deadline || '',
    `"${(Array.isArray(g.eligible_countries) ? g.eligible_countries.join(', ') : g.eligible_countries || '').replace(/"/g, '""')}"`,
    g.url || ''
  ])

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `grants-export-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success(t('grants.csvExported'))
}

// Formatting helpers
function formatCurrency(amount: number, currency: string = 'EUR') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR',
    maximumFractionDigits: 0
  }).format(amount)
}

function formatAmount(min: number | null, max: number | null, currency: string = 'EUR') {
  if (min && max) {
    return `${formatCurrency(min, currency)} – ${formatCurrency(max, currency)}`
  } else if (min) {
    return `${t('grants.from')} ${formatCurrency(min, currency)}`
  } else if (max) {
    return `${t('grants.upTo')} ${formatCurrency(max, currency)}`
  }
  return t('grantDetail.amountNotSpecified')
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const dateFormatted = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

  if (diffDays < 0) return t('grantDetail.closed')
  if (diffDays === 0) return `${dateFormatted} (${t('grantDetail.today')}) · UTC`
  if (diffDays === 1) return `${dateFormatted} (${t('grantDetail.tomorrow')}) · UTC`
  if (diffDays <= 14) return `${dateFormatted} (${t('grantDetail.daysLeft', { count: diffDays })}) · UTC`

  return `${dateFormatted} · UTC`
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

function deadlineDaysLeft(dateStr: string): number {
  if (!dateStr) return -1
  const date = new Date(dateStr)
  const now = new Date()
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function categoryColorStrip(category: string): string {
  const cat = category?.toLowerCase() || ''
  if (cat.includes('humanitarian') || cat.includes('health')) return 'bg-red-500'
  if (cat.includes('education') || cat.includes('scholarship')) return 'bg-blue-500'
  if (cat.includes('democracy') || cat.includes('governance') || cat.includes('civil')) return 'bg-indigo-500'
  if (cat.includes('environment') || cat.includes('climate')) return 'bg-emerald-500'
  if (cat.includes('culture') || cat.includes('media')) return 'bg-purple-500'
  if (cat.includes('infrastructure') || cat.includes('reconstruction')) return 'bg-orange-500'
  if (cat.includes('economic') || cat.includes('development')) return 'bg-teal-500'
  if (cat.includes('research') || cat.includes('innovation')) return 'bg-cyan-500'
  if (cat.includes('community')) return 'bg-pink-500'
  if (cat.includes('capacity')) return 'bg-lime-600'
  if (cat.includes('grant')) return 'bg-amber-500'
  return 'bg-navy-300'
}

function categoryIcon(category: string): string {
  const cat = category?.toLowerCase() || ''
  if (cat.includes('humanitarian')) return '🏥'
  if (cat.includes('education') || cat.includes('scholarship')) return '📚'
  if (cat.includes('democracy') || cat.includes('governance')) return '🏛️'
  if (cat.includes('environment') || cat.includes('climate')) return '🌱'
  if (cat.includes('culture')) return '🎭'
  if (cat.includes('health')) return '💊'
  if (cat.includes('infrastructure') || cat.includes('reconstruction')) return '🏗️'
  if (cat.includes('economic') || cat.includes('development')) return '💼'
  if (cat.includes('media')) return '📰'
  if (cat.includes('civil')) return '🤝'
  if (cat.includes('community')) return '🏘️'
  if (cat.includes('capacity')) return '📈'
  if (cat.includes('research') || cat.includes('innovation')) return '🔬'
  return '📋'
}

function categoryBadgeClass(category: string): string {
  const cat = category?.toLowerCase() || ''
  if (cat.includes('humanitarian') || cat.includes('health')) return 'bg-red-50 text-red-700'
  if (cat.includes('education') || cat.includes('scholarship')) return 'bg-blue-50 text-blue-700'
  if (cat.includes('democracy') || cat.includes('governance') || cat.includes('civil')) return 'bg-indigo-50 text-indigo-700'
  if (cat.includes('environment') || cat.includes('climate')) return 'bg-emerald-50 text-emerald-700'
  if (cat.includes('culture') || cat.includes('media')) return 'bg-purple-50 text-purple-700'
  if (cat.includes('infrastructure') || cat.includes('reconstruction')) return 'bg-orange-50 text-orange-700'
  if (cat.includes('economic') || cat.includes('development')) return 'bg-teal-50 text-teal-700'
  if (cat.includes('research') || cat.includes('innovation')) return 'bg-cyan-50 text-cyan-700'
  if (cat.includes('community')) return 'bg-pink-50 text-pink-700'
  if (cat.includes('capacity')) return 'bg-lime-50 text-lime-700'
  return 'bg-navy-50 text-navy-600'
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
  loadRecentSearches()
  loadRecentlyViewed()
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
