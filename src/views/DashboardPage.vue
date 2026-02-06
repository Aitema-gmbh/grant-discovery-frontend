<template>
  <AppLayout>
    <!-- Welcome Section with Gradient Background -->
    <div class="mb-12 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-50 via-amber-50 to-blue-50 rounded-3xl opacity-50"></div>
      <div class="relative p-8 animate-fade-in">
        <h2 class="text-display-sm font-display text-navy-900 gradient-text">
          🇺🇦 {{ $t('dashboard.welcome', { name: displayName }) }}
        </h2>
        <p class="mt-3 text-lg text-navy-600 font-sans">
          {{ $t('dashboard.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 animate-slide-up">
      <!-- Active Grants -->
      <div class="stat-card">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-inner-soft">
            <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <span class="badge badge-warning inline-flex items-center gap-1">{{ $t('dashboard.live') }}
            <HelpTooltip :content="$t('dashboard.help.live')" position="bottom" />
          </span>
        </div>
        <div class="stat-label">{{ $t('dashboard.activeGrants') }}</div>
        <div class="stat-value">
          {{ stats.activeGrants !== null ? stats.activeGrants.toLocaleString() : '...' }}
        </div>
        <p class="mt-2 text-sm text-sage-600 font-medium">
          <span class="inline-flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
            </svg>
            {{ $t('dashboard.changeThisMonth', { percent: stats.activeGrantsChange || 12 }) }}
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
          <span class="badge badge-success inline-flex items-center gap-1">{{ $t('dashboard.ai') }}
            <HelpTooltip :content="$t('dashboard.help.ai')" position="bottom" />
          </span>
        </div>
        <div class="stat-label">{{ $t('dashboard.matchedGrants') }}</div>
        <div class="stat-value">
          {{ stats.matchedGrants !== null ? stats.matchedGrants.toLocaleString() : '...' }}
        </div>
        <p class="mt-2 text-sm text-navy-500">
          {{ $t('dashboard.basedOnProfile') }}
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
          <span class="badge badge-info">{{ $t('dashboard.profile') }}</span>
        </div>
        <div class="stat-label">{{ $t('dashboard.myOrganizations') }}</div>
        <div class="stat-value">
          {{ stats.csoProfiles !== null ? stats.csoProfiles : '...' }}
        </div>
        <p class="mt-2 text-sm text-navy-500">
          {{ $t('dashboard.csoProfilesConfigured') }}
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
          <span class="badge badge-warning inline-flex items-center gap-1">{{ $t('dashboard.urgent') }}
            <HelpTooltip :content="$t('dashboard.help.urgent')" position="bottom" />
          </span>
        </div>
        <div class="stat-label">{{ $t('dashboard.deadlinesSoon') }}</div>
        <div class="stat-value">
          {{ stats.upcomingDeadlines !== null ? stats.upcomingDeadlines : '...' }}
        </div>
        <p class="mt-2 text-sm text-amber-600 font-medium">
          {{ $t('dashboard.next30Days') }}
        </p>
      </div>
    </div>

    <!-- Error Retry Banner -->
    <div v-if="loadError" class="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4 animate-fade-in">
      <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-semibold text-red-800">{{ $t('errors.network') }}</p>
        <p class="text-xs text-red-600 mt-0.5">{{ $t('errors.retryDesc') }}</p>
      </div>
      <button @click="fetchDashboardData" class="btn btn-sm bg-red-600 text-white hover:bg-red-700 flex items-center gap-1.5">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        {{ $t('common.tryAgain') }}
      </button>
    </div>

    <!-- Smart Insights -->
    <div v-if="insights.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 animate-fade-in" style="animation-delay: 0.15s">
      <div
        v-for="(insight, index) in insights"
        :key="index"
        class="p-5 rounded-xl border transition-all hover:shadow-soft"
        :class="insight.color"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl flex-shrink-0">{{ insight.icon }}</span>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-navy-900">{{ insight.title }}</p>
            <p class="text-xs text-navy-600 mt-1">{{ insight.description }}</p>
            <router-link
              v-if="insight.actionTo"
              :to="insight.actionTo"
              class="inline-flex items-center gap-1 text-xs font-medium mt-2 transition-colors"
              :class="insight.actionColor"
            >
              {{ insight.actionLabel }} →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activity -->
      <div class="lg:col-span-2">
        <div class="card animate-slide-up" style="animation-delay: 0.1s">
          <div class="section-header">
            <h3 class="section-title">{{ $t('dashboard.recentActivity') }}</h3>
            <button class="link text-sm">
              {{ $t('common.viewAll') }} →
            </button>
          </div>

          <div v-if="recentActivity.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <p class="text-lg font-medium text-navy-700">{{ $t('dashboard.noRecentActivity') }}</p>
            <p class="text-sm text-navy-500 mt-2 max-w-sm mx-auto">{{ $t('dashboard.emptyActivity.description') }}</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <router-link to="/grants" class="btn btn-primary">
                {{ $t('dashboard.browseGrants') }}
              </router-link>
              <router-link to="/onboarding/setup" class="btn btn-outline">
                {{ $t('dashboard.emptyActivity.setupProfile') }}
              </router-link>
            </div>
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
          <h3 class="section-title mb-6">{{ $t('dashboard.quickActions') }}</h3>
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
                  <p class="font-semibold text-navy-900 group-hover:text-amber-800 transition-colors">{{ $t('dashboard.browseGrants') }}</p>
                  <p class="text-sm text-navy-600">{{ $t('dashboard.discoverOpportunities') }}</p>
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
                  <p class="font-semibold text-navy-900 group-hover:text-sage-800 transition-colors">{{ $t('dashboard.createCSOProfile') }}</p>
                  <p class="text-sm text-navy-600">{{ $t('dashboard.setupOrganization') }}</p>
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
                  <p class="font-semibold text-navy-900 group-hover:text-navy-700 transition-colors">{{ $t('dashboard.viewMatches') }}</p>
                  <p class="text-sm text-navy-600">{{ $t('dashboard.aiMatchedGrants') }}</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Upcoming Deadlines List -->
        <div class="card animate-slide-up" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-6">
            <h3 class="section-title">{{ $t('dashboard.upcomingDeadlines') }}</h3>
            <HelpTooltip
              :content="$t('dashboard.next30Days')"
              position="left"
            />
          </div>

          <div v-if="upcomingDeadlinesList.length === 0" class="text-center py-8">
            <div class="w-12 h-12 mx-auto mb-3 bg-sage-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-sm text-navy-600 font-medium">{{ $t('dashboard.emptyDeadlines.title') }}</p>
            <p class="text-xs text-navy-400 mt-1 max-w-xs mx-auto">{{ $t('dashboard.emptyDeadlines.description') }}</p>
            <router-link to="/grants" class="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 mt-3 transition-colors">
              {{ $t('dashboard.emptyDeadlines.browseGrants') }} →
            </router-link>
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
                    {{ deadline.daysLeft }} {{ $t('common.days') }}
                  </p>
                  <p class="text-xs text-navy-400 font-mono">{{ deadline.date }} · UTC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Pipeline -->
    <div v-if="pipelineCounts.total > 0" class="mt-12 animate-fade-in" style="animation-delay: 0.35s">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-5">
          <h3 class="section-title">{{ $t('dashboard.pipeline.title') }}</h3>
          <router-link to="/saved" class="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
            {{ $t('common.viewAll') }} →
          </router-link>
        </div>
        <div class="grid grid-cols-5 gap-3">
          <router-link
            v-for="stage in pipelineStages"
            :key="stage.id"
            :to="`/saved`"
            class="text-center p-3 rounded-xl transition-all hover:shadow-soft group"
            :class="(pipelineCounts[stage.id] ?? 0) > 0 ? stage.bgHover : 'bg-stone-50 opacity-50'"
          >
            <span class="text-lg">{{ stage.icon }}</span>
            <div class="text-2xl font-bold font-display mt-1" :class="stage.textColor">
              {{ pipelineCounts[stage.id] || 0 }}
            </div>
            <div class="text-[10px] font-medium text-navy-600 mt-1 leading-tight">{{ stage.label }}</div>
          </router-link>
        </div>
        <!-- Pipeline progress bar -->
        <div class="mt-4 flex rounded-full h-2.5 overflow-hidden bg-navy-100">
          <div v-for="stage in pipelineStages" :key="'bar-'+stage.id"
            class="transition-all duration-500"
            :class="stage.barColor"
            :style="`width: ${pipelineCounts.total > 0 ? (pipelineCounts[stage.id] || 0) / pipelineCounts.total * 100 : 0}%`"
          ></div>
        </div>
      </div>
    </div>

    <!-- Grant Readiness Overview -->
    <div v-if="readinessData.length > 0" class="mt-8 animate-fade-in" style="animation-delay: 0.38s">
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">{{ $t('dashboard.readiness.title') }}</h3>
          <router-link to="/saved" class="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">
            {{ $t('common.viewAll') }} →
          </router-link>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <router-link
            v-for="item in readinessData"
            :key="item.id"
            :to="`/grants/${item.id}`"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all hover:scale-110 hover:shadow-md"
            :class="item.colorClass"
            :title="item.title + ' — ' + item.score + '%'"
          >
            {{ item.score }}
          </router-link>
        </div>
        <div class="flex items-center gap-4 mt-3 text-[10px] text-navy-500">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-red-100 border border-red-300"></span> {{ $t('dashboard.readiness.notReady') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-amber-100 border border-amber-300"></span> {{ $t('dashboard.readiness.inProgress') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-green-100 border border-green-300"></span> {{ $t('dashboard.readiness.ready') }}</span>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="allGrantsForCharts.length > 0" class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style="animation-delay: 0.4s">
      <!-- Deadline Timeline -->
      <div class="card-premium">
        <h3 class="section-title mb-6">{{ $t('dashboard.charts.deadlineTimeline') }}</h3>
        <div class="space-y-4">
          <div v-for="bucket in deadlineChartData" :key="bucket.label" class="flex items-center gap-3">
            <span class="text-xs font-medium text-navy-600 w-24 text-right truncate">{{ bucket.label }}</span>
            <div class="flex-1 bg-navy-100 rounded-full h-6 overflow-hidden">
              <div
                class="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                :style="`width: ${Math.max(bucket.percent, bucket.count > 0 ? 12 : 0)}%; background-color: ${bucket.color}`"
              >
                <span v-if="bucket.count > 0" class="text-xs font-bold text-white">{{ bucket.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="card-premium">
        <h3 class="section-title mb-6">{{ $t('dashboard.charts.categoryDistribution') }}</h3>
        <div class="space-y-3">
          <div v-for="cat in categoryChartData" :key="cat.name" class="flex items-center gap-3">
            <span class="text-xs font-medium text-navy-600 w-28 text-right truncate" :title="cat.name">{{ cat.name }}</span>
            <div class="flex-1 bg-navy-100 rounded-full h-5 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :style="`width: ${Math.max(cat.percent, cat.count > 0 ? 12 : 0)}%; background-color: ${cat.color}`"
              ></div>
            </div>
            <span class="text-xs font-semibold text-navy-700 w-8">{{ cat.count }}</span>
          </div>
          <p v-if="categoryChartData.length === 0" class="text-sm text-navy-400 text-center py-4">{{ $t('common.noResults') }}</p>
        </div>
      </div>
    </div>

    <!-- Month Calendar Widget -->
    <div v-if="allGrantsForCharts.length > 0" class="mt-8 max-w-md animate-fade-in" style="animation-delay: 0.45s">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-title">{{ $t('dashboard.calendar.title') }}</h3>
          <div class="flex items-center gap-2">
            <button @click="calendarMonth--" class="p-1 rounded hover:bg-navy-100 transition-colors">
              <svg class="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <span class="text-sm font-semibold text-navy-800 min-w-[120px] text-center">{{ calendarMonthLabel }}</span>
            <button @click="calendarMonth++" class="p-1 rounded hover:bg-navy-100 transition-colors">
              <svg class="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-7 gap-px text-center text-[10px] font-medium text-navy-400 mb-1">
          <div v-for="d in ['Mo','Tu','We','Th','Fr','Sa','Su']" :key="d">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7 gap-px">
          <div v-for="(cell, i) in calendarDays" :key="i"
            class="aspect-square flex flex-col items-center justify-center rounded-lg text-xs transition-all cursor-default"
            :class="[
              cell.isCurrentMonth ? 'text-navy-800' : 'text-navy-300',
              cell.isToday ? 'bg-amber-100 font-bold ring-1 ring-amber-400' : '',
              cell.deadlineCount > 0 ? 'hover:bg-navy-50 cursor-pointer' : ''
            ]"
            @click="cell.deadlineCount > 0 ? selectedCalendarDate = cell.dateStr : null"
          >
            <span>{{ cell.day }}</span>
            <div v-if="cell.deadlineCount > 0" class="flex gap-0.5 mt-0.5">
              <span v-for="n in Math.min(cell.deadlineCount, 3)" :key="n" class="w-1 h-1 rounded-full" :class="cell.isUrgent ? 'bg-red-500' : 'bg-amber-500'"></span>
            </div>
          </div>
        </div>
        <!-- Selected date deadlines -->
        <div v-if="selectedCalendarDate && selectedDateGrants.length > 0" class="mt-3 pt-3 border-t border-navy-100 space-y-2">
          <p class="text-xs font-semibold text-navy-600">{{ selectedCalendarDate }}</p>
          <router-link v-for="g in selectedDateGrants" :key="g.id" :to="`/grants/${g.id}`" class="block p-2 rounded-lg hover:bg-navy-50 transition-colors">
            <p class="text-xs font-medium text-navy-900 truncate">{{ g.title }}</p>
            <p class="text-[10px] text-navy-500">{{ g.organization || g.category }}</p>
          </router-link>
        </div>
      </div>
    </div>
    <!-- Onboarding Tour (auto-starts for new users) -->
    <OnboardingTour />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import OnboardingTour from '@/components/OnboardingTour.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'

const toast = useToast()

import { usePageTitle } from '@/lib/usePageTitle'

const authStore = useAuthStore()
const { t } = useI18n()
usePageTitle(t('nav.dashboard'))

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

// All grants for charts
const allGrantsForCharts = ref<any[]>([])

// Error state for retry
const loadError = ref(false)

// Application Pipeline
const pipelineStages = computed(() => [
  { id: 'interested', icon: '💡', label: t('dashboard.pipeline.interested'), bgHover: 'bg-amber-50 hover:bg-amber-100', textColor: 'text-amber-700', barColor: 'bg-amber-400' },
  { id: 'researching', icon: '🔍', label: t('dashboard.pipeline.researching'), bgHover: 'bg-blue-50 hover:bg-blue-100', textColor: 'text-blue-700', barColor: 'bg-blue-400' },
  { id: 'applying', icon: '📝', label: t('dashboard.pipeline.applying'), bgHover: 'bg-indigo-50 hover:bg-indigo-100', textColor: 'text-indigo-700', barColor: 'bg-indigo-400' },
  { id: 'submitted', icon: '📨', label: t('dashboard.pipeline.submitted'), bgHover: 'bg-sage-50 hover:bg-sage-100', textColor: 'text-sage-700', barColor: 'bg-sage-400' },
  { id: 'outcome', icon: '🏆', label: t('dashboard.pipeline.outcome'), bgHover: 'bg-green-50 hover:bg-green-100', textColor: 'text-green-700', barColor: 'bg-green-400' },
])

const pipelineCounts = computed((): { interested: number; researching: number; applying: number; submitted: number; outcome: number; total: number; [key: string]: number } => {
  const saved: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
  const workflow: Record<string, string> = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
  const counts = { interested: 0, researching: 0, applying: 0, submitted: 0, outcome: 0, total: 0 }
  saved.forEach(id => {
    const status: string = workflow[id] ?? 'interested'
    if (status in counts) (counts as any)[status]++
    else counts.interested++
    counts.total++
  })
  return counts
})

// Grant readiness heatmap
const readinessData = computed(() => {
  const savedIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
  const workflow: Record<string, string> = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')

  return savedIds.map(id => {
    let score = 0
    // Status progress
    const status = workflow[id] || 'interested'
    const statusScores: Record<string, number> = { interested: 10, researching: 30, applying: 55, submitted: 85, outcome: 100 }
    score += statusScores[status] || 10

    // Prep checklist
    try {
      const items = JSON.parse(localStorage.getItem(`grantPrep_${id}`) || '[]')
      if (items.length > 0) {
        const checked = items.filter((i: any) => i.checked).length
        score = Math.min(100, score + Math.round((checked / items.length) * 20))
      }
    } catch { /* */ }

    // Has budget plan
    try {
      if (localStorage.getItem(`grantBudget_${id}`)) score = Math.min(100, score + 5)
    } catch { /* */ }

    // Has notes
    try {
      const notes = localStorage.getItem(`grantNotes_${id}`)
      if (notes && notes.length > 2) score = Math.min(100, score + 5)
    } catch { /* */ }

    // Find grant title
    const grant = allGrantsForCharts.value.find((g: any) => g.id === id || String(g.id) === id)
    const title = grant?.title || `Grant ${id}`

    let colorClass = 'bg-red-100 text-red-700 border border-red-200'
    if (score >= 60) colorClass = 'bg-green-100 text-green-700 border border-green-200'
    else if (score >= 30) colorClass = 'bg-amber-100 text-amber-700 border border-amber-200'

    return { id, title, score, colorClass }
  }).sort((a, b) => a.score - b.score)
})

// Display name
const displayName = computed(() => {
  return authStore.user?.user_metadata?.full_name || authStore.user?.email?.split('@')[0] || 'User'
})

// Smart insights based on user data
const insights = computed(() => {
  const items: Array<{
    icon: string; title: string; description: string;
    color: string; actionTo?: string; actionLabel?: string; actionColor?: string
  }> = []

  // Insight: Urgent deadlines
  if (stats.value.upcomingDeadlines && stats.value.upcomingDeadlines > 0) {
    const urgentCount = upcomingDeadlinesList.value.filter(d => d.daysLeft <= 7).length
    if (urgentCount > 0) {
      items.push({
        icon: '⏰',
        title: t('dashboard.insights.urgentDeadlines', { count: urgentCount }),
        description: t('dashboard.insights.urgentDeadlinesDesc'),
        color: 'bg-red-50 border-red-200',
        actionTo: '/grants?deadline=7',
        actionLabel: t('dashboard.insights.viewUrgent'),
        actionColor: 'text-red-600 hover:text-red-700'
      })
    }
  }

  // Insight: No CSO profile
  if (stats.value.csoProfiles === 0) {
    items.push({
      icon: '🏢',
      title: t('dashboard.insights.noProfile'),
      description: t('dashboard.insights.noProfileDesc'),
      color: 'bg-amber-50 border-amber-200',
      actionTo: '/onboarding/setup',
      actionLabel: t('dashboard.insights.createProfile'),
      actionColor: 'text-amber-600 hover:text-amber-700'
    })
  }

  // Insight: Saved grants without proposals
  const savedCount = JSON.parse(localStorage.getItem('savedGrants') || '[]').length
  if (savedCount > 0) {
    items.push({
      icon: '📋',
      title: t('dashboard.insights.savedGrants', { count: savedCount }),
      description: t('dashboard.insights.savedGrantsDesc'),
      color: 'bg-blue-50 border-blue-200',
      actionTo: '/grants',
      actionLabel: t('dashboard.insights.reviewSaved'),
      actionColor: 'text-blue-600 hover:text-blue-700'
    })
  }

  // Insight: Has matches available
  if (stats.value.matchedGrants && stats.value.matchedGrants > 0 && stats.value.csoProfiles && stats.value.csoProfiles > 0) {
    items.push({
      icon: '🎯',
      title: t('dashboard.insights.matchesAvailable', { count: stats.value.matchedGrants }),
      description: t('dashboard.insights.matchesAvailableDesc'),
      color: 'bg-green-50 border-green-200',
      actionTo: '/matches',
      actionLabel: t('dashboard.insights.viewMatches'),
      actionColor: 'text-green-600 hover:text-green-700'
    })
  }

  return items.slice(0, 3) // Max 3 insights
})

// Chart data: Category distribution
const categoryChartData = computed(() => {
  const counts: Record<string, number> = {}
  allGrantsForCharts.value.forEach((g: any) => {
    const cat = g.category || 'Other'
    counts[cat] = (counts[cat] || 0) + 1
  })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const max = sorted.length > 0 ? sorted[0]![1] : 1
  return sorted.map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / max) * 100),
    color: categoryChartColor(name),
  }))
})

function categoryChartColor(cat: string): string {
  const c = cat.toLowerCase()
  if (c.includes('humanitarian') || c.includes('health')) return '#ef4444'
  if (c.includes('education') || c.includes('scholarship')) return '#3b82f6'
  if (c.includes('democracy') || c.includes('governance')) return '#6366f1'
  if (c.includes('environment') || c.includes('climate')) return '#10b981'
  if (c.includes('culture') || c.includes('media')) return '#8b5cf6'
  if (c.includes('infrastructure')) return '#f97316'
  if (c.includes('economic') || c.includes('development')) return '#14b8a6'
  return '#64748b'
}

// Chart data: Deadline timeline
const deadlineChartData = computed(() => {
  const now = new Date()
  const buckets = [
    { label: t('dashboard.charts.thisWeek'), max: 7, count: 0, color: '#ef4444' },
    { label: t('dashboard.charts.nextWeek'), max: 14, count: 0, color: '#f59e0b' },
    { label: t('dashboard.charts.thisMonth'), max: 30, count: 0, color: '#3b82f6' },
    { label: t('dashboard.charts.next3Months'), max: 90, count: 0, color: '#10b981' },
    { label: t('dashboard.charts.later'), max: 999, count: 0, color: '#64748b' },
  ]
  allGrantsForCharts.value.forEach((g: any) => {
    if (!g.deadline) return
    const days = Math.ceil((new Date(g.deadline).getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
    if (days < 0) return
    for (const b of buckets) {
      if (days <= b.max) { b.count++; break }
    }
  })
  const max = Math.max(...buckets.map(b => b.count), 1)
  return buckets.map(b => ({ ...b, percent: Math.round((b.count / max) * 100) }))
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

// Calendar widget
const calendarMonth = ref(0) // offset from current month
const selectedCalendarDate = ref('')

const calendarMonthLabel = computed(() => {
  const d = new Date()
  d.setMonth(d.getMonth() + calendarMonth.value)
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
})

const calendarDays = computed(() => {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth() + calendarMonth.value, 1)
  const year = target.getFullYear()
  const month = target.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Start from Monday
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean; deadlineCount: number; isUrgent: boolean; dateStr: string }> = []

  // Build deadline map for this month
  const deadlineMap: Record<string, any[]> = {}
  allGrantsForCharts.value.forEach((g: any) => {
    if (!g.deadline) return
    const dd = new Date(g.deadline)
    const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`
    if (!deadlineMap[key]) deadlineMap[key] = []
    deadlineMap[key].push(g)
  })

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // Previous month padding
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({ day: d.getDate(), isCurrentMonth: false, isToday: false, deadlineCount: (deadlineMap[key] || []).length, isUrgent: false, dateStr: key })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const daysUntil = Math.ceil((new Date(year, month, d).getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
    days.push({ day: d, isCurrentMonth: true, isToday: key === todayStr, deadlineCount: (deadlineMap[key] || []).length, isUrgent: daysUntil >= 0 && daysUntil <= 7, dateStr: key })
  }

  // Next month padding to fill 6 rows
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const nd = new Date(year, month + 1, d)
    const key = `${nd.getFullYear()}-${String(nd.getMonth() + 1).padStart(2, '0')}-${String(nd.getDate()).padStart(2, '0')}`
    days.push({ day: d, isCurrentMonth: false, isToday: false, deadlineCount: (deadlineMap[key] || []).length, isUrgent: false, dateStr: key })
  }

  return days
})

const selectedDateGrants = computed(() => {
  if (!selectedCalendarDate.value) return []
  return allGrantsForCharts.value.filter((g: any) => {
    if (!g.deadline) return false
    const dd = new Date(g.deadline)
    const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, '0')}-${String(dd.getDate()).padStart(2, '0')}`
    return key === selectedCalendarDate.value
  })
})

// Fetch dashboard data
async function fetchDashboardData() {
  loadError.value = false
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
      allGrantsForCharts.value = deadlinesResponse.data.grants
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
    loadError.value = true
    toast.error(t('errors.network'))
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
    console.log('Welcome! Onboarding completed successfully!')
  }
})
</script>
