<template>
  <AppLayout>
    <!-- Loading State -->
    <div v-if="loading" class="animate-pulse">
      <div class="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="card h-64 bg-gray-100"></div>
        </div>
        <div>
          <div class="card h-48 bg-gray-100"></div>
        </div>
      </div>
    </div>

    <!-- Grant Detail Content -->
    <div v-else-if="grant">
      <!-- Breadcrumb -->
      <BreadcrumbNav :crumbs="[
        { label: $t('grantDetail.grantsLabel'), to: '/grants' },
        { label: grant.title }
      ]" />

      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-4xl font-bold text-gray-900">
                {{ grant.title }}
              </h1>
              <!-- Readiness Score Badge -->
              <div
                v-if="isSaved"
                class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm"
                :class="overallReadiness >= 70 ? 'bg-green-500' : overallReadiness >= 40 ? 'bg-amber-500' : 'bg-red-500'"
                :title="$t('grantDetail.readiness.overallScore')"
              >
                {{ overallReadiness }}%
              </div>
            </div>
            <p class="text-lg text-gray-600">
              {{ grant.program_name || $t('grantDetail.grantProgram') }}
            </p>
          </div>

          <div class="flex items-center gap-3 ml-4">
            <button
              @click="toggleSave"
              :class="isSaved ? 'bg-yellow-50 text-yellow-600 border-yellow-300' : 'bg-white text-navy-700 border-gray-300'"
              class="btn-save flex items-center gap-2 px-4 py-2 border rounded-lg hover:shadow transition-all"
              :aria-label="isSaved ? $t('grantDetail.saved') : $t('grantDetail.save')"
              :aria-pressed="isSaved"
            >
              <svg class="w-5 h-5" :class="isSaved ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {{ isSaved ? $t('grantDetail.saved') : $t('grantDetail.save') }}
            </button>

            <button
              v-if="grant.deadline && !isReminderSet"
              @click="toggleReminder"
              class="flex items-center gap-2 px-4 py-2 bg-white text-navy-700 border border-gray-300 rounded-lg hover:shadow transition-all"
              :aria-label="$t('grantDetail.setReminder')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {{ $t('grantDetail.setReminder') }}
            </button>
            <button
              v-else-if="grant.deadline && isReminderSet"
              @click="toggleReminder"
              class="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 border border-amber-300 rounded-lg hover:shadow transition-all"
              :aria-label="$t('grantDetail.reminderSet')"
            >
              <svg class="w-5 h-5 fill-current" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              {{ $t('grantDetail.reminderSet') }}
            </button>

            <button
              @click="shareGrant"
              class="flex items-center gap-2 px-4 py-2 bg-white text-navy-700 border border-gray-300 rounded-lg hover:shadow transition-all"
              :aria-label="$t('grantDetail.share')"
            >
              <svg v-if="!linkCopied" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              <svg v-else class="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ linkCopied ? $t('grantDetail.linkCopied') : $t('grantDetail.share') }}
            </button>

            <!-- Annotations Toggle -->
            <button
              @click="showAnnotationsSidebar = !showAnnotationsSidebar"
              class="relative flex items-center gap-2 px-4 py-2 border rounded-lg hover:shadow transition-all"
              :class="showAnnotationsSidebar ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-white text-navy-700 border-gray-300'"
              :aria-label="$t('grantDetail.annotations.toggle')"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
              <span v-if="annotations.length > 0" class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {{ annotations.length }}
              </span>
            </button>
          </div>
        </div>

        <!-- Status and Deadline Banner -->
        <div class="flex items-center gap-4">
          <span
            :class="statusBadgeClass"
            class="px-3 py-1.5 rounded-full text-sm font-medium"
          >
            {{ grant.status || $t('grantDetail.open') }}
          </span>

          <div v-if="grant.deadline" class="flex items-center gap-2 text-sm">
            <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
            </svg>
            <span :class="deadlineColor" class="font-medium">
              {{ $t('grantDetail.deadlineLabel') }} {{ formatDate(grant.deadline) }}
            </span>
          </div>

          <div v-if="grant.category" class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
            {{ grant.category }}
          </div>
        </div>
      </div>

      <!-- Deadline Preparation Checklist -->
      <div
        v-if="grant.deadline && daysUntilDeadline > 0 && daysUntilDeadline <= 30"
        class="mb-8 p-5 rounded-xl border-2 animate-fade-in"
        :class="daysUntilDeadline <= 7 ? 'bg-red-50 border-red-200' : daysUntilDeadline <= 14 ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-display font-semibold text-navy-900 flex items-center gap-2">
            <svg class="w-5 h-5" :class="daysUntilDeadline <= 7 ? 'text-red-500' : daysUntilDeadline <= 14 ? 'text-amber-500' : 'text-blue-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ $t('grantDetail.deadlineChecklist.title') }}
          </h3>
          <span class="px-3 py-1 rounded-full text-sm font-bold"
            :class="daysUntilDeadline <= 7 ? 'bg-red-200 text-red-800' : daysUntilDeadline <= 14 ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'"
          >
            {{ daysUntilDeadline }} {{ $t('common.days') }}
          </span>
        </div>

        <div class="space-y-3">
          <!-- Step 1: Save grant -->
          <div class="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" :class="isSaved ? 'bg-sage-100 text-sage-600' : 'bg-navy-100 text-navy-400'">
              <svg v-if="isSaved" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else class="text-xs font-bold">1</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" :class="isSaved ? 'text-sage-700 line-through' : 'text-navy-800'">{{ $t('grantDetail.deadlineChecklist.saveGrant') }}</p>
            </div>
            <button v-if="!isSaved" @click="toggleSave" class="text-xs font-medium text-amber-600 hover:text-amber-700">{{ $t('grantDetail.save') }}</button>
          </div>

          <!-- Step 2: Set reminder -->
          <div class="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" :class="isReminderSet ? 'bg-sage-100 text-sage-600' : 'bg-navy-100 text-navy-400'">
              <svg v-if="isReminderSet" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else class="text-xs font-bold">2</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" :class="isReminderSet ? 'text-sage-700 line-through' : 'text-navy-800'">{{ $t('grantDetail.deadlineChecklist.setReminder') }}</p>
            </div>
            <button v-if="!isReminderSet" @click="toggleReminder" class="text-xs font-medium text-amber-600 hover:text-amber-700">{{ $t('grantDetail.setReminder') }}</button>
          </div>

          <!-- Step 3: Check eligibility -->
          <div class="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" :class="eligibilityResult ? 'bg-sage-100 text-sage-600' : 'bg-navy-100 text-navy-400'">
              <svg v-if="eligibilityResult" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else class="text-xs font-bold">3</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" :class="eligibilityResult ? 'text-sage-700 line-through' : 'text-navy-800'">{{ $t('grantDetail.deadlineChecklist.checkEligibility') }}</p>
            </div>
            <button v-if="!eligibilityResult && authStore.isAuthenticated" @click="runEligibilityCheck" class="text-xs font-medium text-amber-600 hover:text-amber-700">{{ $t('grantDetail.runCheck') }}</button>
          </div>

          <!-- Step 4: Start proposal -->
          <div class="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
            <div class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" :class="grantProposal ? 'bg-sage-100 text-sage-600' : 'bg-navy-100 text-navy-400'">
              <svg v-if="grantProposal" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              <span v-else class="text-xs font-bold">4</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium" :class="grantProposal ? 'text-sage-700 line-through' : 'text-navy-800'">{{ $t('grantDetail.deadlineChecklist.startProposal') }}</p>
              <p v-if="grantProposal" class="text-xs text-navy-500 mt-0.5">{{ $t('grantDetail.proposalStatus.' + (grantProposal.status || 'draft')) }}</p>
            </div>
            <router-link v-if="grantProposal" :to="`/proposals/${grantProposal.id}`" class="text-xs font-medium text-amber-600 hover:text-amber-700">{{ $t('grantDetail.deadlineChecklist.continue') }}</router-link>
            <button v-else-if="authStore.isAuthenticated" @click="startApplication" class="text-xs font-medium text-amber-600 hover:text-amber-700">{{ $t('grantDetail.deadlineChecklist.start') }}</button>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mt-4 flex items-center gap-3">
          <div class="flex-1 bg-white/50 rounded-full h-2 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="daysUntilDeadline <= 7 ? 'bg-red-500' : daysUntilDeadline <= 14 ? 'bg-amber-500' : 'bg-blue-500'"
              :style="`width: ${checklistProgress}%`"
            ></div>
          </div>
          <span class="text-xs font-semibold text-navy-600">{{ checklistProgress }}%</span>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Grant Details -->
        <div class="lg:col-span-2 space-y-6" ref="annotatableContentEl" @mouseup="handleTextSelection">
          <!-- Description -->
          <div class="card">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">{{ $t('grantDetail.description') }}</h2>
              <button
                @click="copyToClipboard(grant.description, $t('grantDetail.description'))"
                class="text-navy-400 hover:text-navy-600 transition-colors p-1"
                :aria-label="$t('grantDetail.copySection')"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
            <div class="prose max-w-none relative">
              <p
                class="text-gray-700 leading-relaxed transition-all duration-300 overflow-hidden"
                :class="descExpanded ? '' : 'max-h-48'"
                ref="descriptionEl"
              >{{ grant.description }}</p>
              <div v-if="!descExpanded && descNeedsExpand" class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            </div>
            <button
              v-if="descNeedsExpand"
              @click="descExpanded = !descExpanded"
              class="mt-3 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
            >
              {{ descExpanded ? $t('grantDetail.showLess') : $t('grantDetail.readMore') }}
              <svg class="w-4 h-4 transition-transform" :class="descExpanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>

          <!-- AI Summary (if available) -->
          <div v-if="aiSummary" class="card bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-600">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z"/>
                  <path fill-rule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 mb-2 inline-flex items-center gap-2">
                  {{ $t('grantDetail.aiSummary') }}
                  <HelpTooltip :content="$t('grantDetail.help.aiSummary')" position="right" />
                </h3>
                <p class="text-gray-700">{{ aiSummary }}</p>
              </div>
            </div>
          </div>

          <!-- Eligibility Checker -->
          <div class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 inline-flex items-center gap-2">
              {{ $t('grantDetail.eligibilityCheck') }}
              <HelpTooltip :content="$t('grantDetail.help.eligibility')" position="right" />
            </h2>

            <div v-if="authStore.isAuthenticated && eligibilityResult" class="space-y-3">
              <!-- Overall Result -->
              <div class="flex items-center gap-3 p-4 rounded-lg" :class="eligibilityBgClass">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" :class="eligibilityIconClass">
                  <svg v-if="eligibilityResult.score >= 0.7" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else-if="eligibilityResult.score >= 0.4" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-navy-900">{{ eligibilityResult.label }}</p>
                  <p class="text-sm text-navy-600">{{ eligibilityResult.summary }}</p>
                </div>
              </div>

              <!-- Check Items -->
              <div v-for="(check, idx) in eligibilityResult.checks" :key="idx"
                class="flex items-start gap-2 px-3 py-2 text-sm">
                <span v-if="check.pass" class="text-green-500 mt-0.5">&#x2713;</span>
                <span v-else class="text-red-500 mt-0.5">&#x2717;</span>
                <span :class="check.pass ? 'text-navy-700' : 'text-red-700'">{{ check.message }}</span>
              </div>

              <!-- CTA to Matches -->
              <router-link to="/matches" class="inline-flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700 mt-2">
                {{ $t('grantDetail.viewFullMatch') }} →
              </router-link>
            </div>

            <div v-else-if="authStore.isAuthenticated && !eligibilityResult" class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <div>
                    <p class="font-medium text-gray-900">{{ $t('grantDetail.checkYourEligibility') }}</p>
                    <p class="text-sm text-gray-600">{{ $t('grantDetail.basedOnCSOProfile') }}</p>
                  </div>
                </div>
                <button @click="runEligibilityCheck" class="btn btn-primary" :disabled="checkingEligibility">
                  {{ checkingEligibility ? $t('common.loading') : $t('grantDetail.runCheck') }}
                </button>
              </div>
            </div>
            <div v-else class="text-center py-6 text-gray-600">
              <p>{{ $t('grantDetail.signInForEligibility') }}</p>
              <router-link to="/auth/login" class="btn btn-primary mt-4">
                {{ $t('grantDetail.signIn') }}
              </router-link>
            </div>
          </div>

          <!-- Application Requirements Checklist -->
          <div class="card mt-6">
            <div class="p-5">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-navy-900">{{ t('grantDetail.requirements.title') }}</h3>
                <div class="flex gap-2">
                  <button v-if="requirementsGenerated" @click="exportRequirementsChecklist"
                    class="text-xs px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                    {{ t('grantDetail.requirements.exportChecklist') }}
                  </button>
                  <button v-if="requirementsGenerated" @click="requirementsGenerated = false; requirementCategories = []"
                    class="text-xs px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                    {{ t('grantDetail.requirements.regenerate') }}
                  </button>
                </div>
              </div>

              <!-- Before generation -->
              <div v-if="!requirementsGenerated && !requirementsLoading" class="text-center py-6">
                <p class="text-sm text-stone-500 mb-4">{{ t('grantDetail.requirements.description') }}</p>
                <button @click="generateRequirements"
                  class="px-5 py-2.5 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors">
                  {{ t('grantDetail.requirements.generate') }}
                </button>
              </div>

              <!-- Loading -->
              <div v-if="requirementsLoading" class="py-6">
                <div class="flex items-center justify-center gap-3 text-sm text-stone-500">
                  <div class="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                  {{ t('grantDetail.requirements.generating') }}
                </div>
              </div>

              <!-- Generated checklist -->
              <div v-if="requirementsGenerated && !requirementsLoading">
                <!-- Progress bar -->
                <div class="mb-5">
                  <div class="flex justify-between text-xs text-stone-500 mb-1">
                    <span>{{ t('grantDetail.requirements.progress', { checked: requirementsProgress.checked, total: requirementsProgress.total }) }}</span>
                    <span>{{ requirementsProgress.pct }}%</span>
                  </div>
                  <div class="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 rounded-full transition-all duration-300" :style="{ width: requirementsProgress.pct + '%' }"></div>
                  </div>
                </div>

                <!-- Categories -->
                <div v-for="(cat, catIdx) in requirementCategories" :key="cat.category" class="mb-5 last:mb-0">
                  <h4 class="text-sm font-semibold text-navy-800 mb-2">{{ t(cat.labelKey) }}</h4>
                  <div class="space-y-2">
                    <div v-for="(item, itemIdx) in cat.items" :key="item.id"
                      class="flex items-start gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors group">
                      <input type="checkbox" :checked="item.checked" @change="toggleRequirement(catIdx, itemIdx)"
                        class="mt-0.5 w-4 h-4 rounded border-stone-300 text-green-600 focus:ring-green-500" />
                      <div class="flex-1 min-w-0">
                        <span class="text-sm" :class="item.checked ? 'text-stone-400 line-through' : 'text-navy-800'">{{ item.text }}</span>
                        <input v-model="item.note" @blur="updateRequirementNote(catIdx, itemIdx, item.note)"
                          :placeholder="t('grantDetail.requirements.addNote')"
                          class="mt-1 w-full text-xs px-2 py-1 border-0 border-b border-transparent hover:border-stone-200 focus:border-amber-400 bg-transparent text-stone-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>
                </div>

                <p class="text-[11px] text-stone-400 mt-4 text-center italic">{{ t('grantDetail.requirements.fallbackNote') }}</p>
              </div>
            </div>
          </div>

          <!-- Similar Grants -->
          <div class="mt-8" v-if="similarGrants.length > 0 || similarLoading">
            <h3 class="text-lg font-bold text-navy-900 mb-4">{{ t('grantDetail.similarGrants.title') }}</h3>

            <div v-if="similarLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="i in 2" :key="i" class="card p-4 animate-pulse">
                <div class="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-stone-100 rounded w-1/2 mb-3"></div>
                <div class="h-3 bg-stone-100 rounded w-full"></div>
              </div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <router-link v-for="sg in similarGrants" :key="sg.id" :to="`/grants/${sg.id}`"
                class="card p-4 hover:shadow-md transition-shadow group">
                <h4 class="font-semibold text-navy-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">{{ sg.title }}</h4>
                <p class="text-xs text-stone-500 mt-1">{{ sg.funder_name }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span v-if="sg.amount_max" class="text-xs font-medium text-amber-600">
                    {{ sg.amount_min ? `€${sg.amount_min.toLocaleString()} – ` : '' }}€{{ sg.amount_max.toLocaleString() }}
                  </span>
                  <span v-if="sg.category" class="text-xs bg-navy-50 text-navy-600 px-2 py-0.5 rounded-full">{{ sg.category }}</span>
                </div>
                <p class="text-xs text-stone-400 mt-2 line-clamp-2">{{ sg.description }}</p>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Right Column: Key Information & Actions -->
        <div class="space-y-6">
          <!-- Quick Facts -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('grantDetail.quickFacts') }}</h3>

            <dl class="space-y-4">
              <!-- Amount -->
              <div v-if="grant.amount_min || grant.amount_max">
                <dt class="text-sm font-medium text-gray-600 mb-1">{{ $t('grantDetail.grantAmount') }}</dt>
                <dd class="text-lg font-semibold text-primary-600">
                  {{ formatAmount(grant.amount_min, grant.amount_max, grant.currency) }}
                </dd>
                <dd v-if="grant.funding_rate" class="text-sm text-gray-600 mt-1">
                  {{ $t('grantDetail.fundingRateLabel', { rate: grant.funding_rate }) }}
                </dd>
              </div>

              <!-- Deadline -->
              <div v-if="grant.deadline">
                <dt class="text-sm font-medium text-gray-600 mb-1">{{ $t('grantDetail.applicationDeadline') }}</dt>
                <dd :class="deadlineColor" class="text-base font-medium">
                  {{ formatDate(grant.deadline) }}
                </dd>
                <dd class="text-xs text-gray-500 mt-1">
                  {{ $t('grantDetail.daysRemaining', { count: daysUntilDeadline }) }}
                </dd>
                <dd class="text-xs text-navy-400 mt-0.5 italic">
                  {{ $t('grantDetail.timezoneNote') }}
                </dd>
              </div>

              <!-- Eligible Countries -->
              <div v-if="eligibleCountries.length > 0">
                <dt class="text-sm font-medium text-gray-600 mb-1">{{ $t('grantDetail.eligibleCountries') }}</dt>
                <dd class="flex flex-wrap gap-1">
                  <span v-for="country in eligibleCountries.slice(0, 5)" :key="country"
                    class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {{ country }}
                  </span>
                  <span v-if="eligibleCountries.length > 5"
                    class="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                    {{ $t('grantDetail.moreCountries', { count: eligibleCountries.length - 5 }) }}
                  </span>
                </dd>
              </div>

              <!-- Organization Types -->
              <div v-if="organizationTypes.length > 0">
                <dt class="text-sm font-medium text-gray-600 mb-1">{{ $t('grantDetail.organizationTypes') }}</dt>
                <dd class="text-sm text-gray-700">
                  {{ organizationTypes.join(', ') }}
                </dd>
              </div>

              <!-- Topics -->
              <div v-if="topics.length > 0">
                <dt class="text-sm font-medium text-gray-600 mb-1">{{ $t('grantDetail.topics') }}</dt>
                <dd class="flex flex-wrap gap-1">
                  <span v-for="topic in topics" :key="topic"
                    class="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {{ topic }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Application Readiness Score -->
          <div v-if="isSaved" class="card">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('grantDetail.readiness.title') }}</h3>
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                :class="overallReadiness >= 70 ? 'bg-green-500' : overallReadiness >= 40 ? 'bg-amber-500' : 'bg-red-500'"
              >
                {{ overallReadiness }}%
              </div>
            </div>

            <!-- Pentagon Radar Chart (CSS-only SVG) -->
            <div class="flex justify-center mb-4">
              <svg viewBox="0 0 200 200" class="w-48 h-48">
                <!-- Background pentagon grid -->
                <polygon :points="pentagonPoints(100)" fill="none" stroke="#e5e7eb" stroke-width="1" />
                <polygon :points="pentagonPoints(80)" fill="none" stroke="#e5e7eb" stroke-width="0.5" />
                <polygon :points="pentagonPoints(60)" fill="none" stroke="#e5e7eb" stroke-width="0.5" />
                <polygon :points="pentagonPoints(40)" fill="none" stroke="#e5e7eb" stroke-width="0.5" />
                <polygon :points="pentagonPoints(20)" fill="none" stroke="#e5e7eb" stroke-width="0.5" />
                <!-- Axis lines -->
                <line v-for="i in 5" :key="'axis-'+i"
                  x1="100" y1="100"
                  :x2="100 + 90 * Math.sin(2 * Math.PI * (i - 1) / 5)"
                  :y2="100 - 90 * Math.cos(2 * Math.PI * (i - 1) / 5)"
                  stroke="#d1d5db" stroke-width="0.5" />
                <!-- Data polygon -->
                <polygon
                  :points="radarDataPoints"
                  :fill="overallReadiness >= 70 ? 'rgba(34,197,94,0.2)' : overallReadiness >= 40 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'"
                  :stroke="overallReadiness >= 70 ? '#22c55e' : overallReadiness >= 40 ? '#f59e0b' : '#ef4444'"
                  stroke-width="2"
                />
                <!-- Data points -->
                <circle v-for="(pt, i) in radarDataPointsArray" :key="'pt-'+i"
                  :cx="pt.x" :cy="pt.y" r="3"
                  :fill="overallReadiness >= 70 ? '#22c55e' : overallReadiness >= 40 ? '#f59e0b' : '#ef4444'"
                />
                <!-- Labels -->
                <text v-for="(dim, i) in readinessDimensionLabels" :key="'lbl-'+i"
                  :x="100 + 98 * Math.sin(2 * Math.PI * i / 5)"
                  :y="100 - 98 * Math.cos(2 * Math.PI * i / 5)"
                  text-anchor="middle" dominant-baseline="central"
                  class="text-[9px] fill-gray-500 font-medium">
                  {{ dim }}
                </text>
              </svg>
            </div>

            <!-- Dimension Bars -->
            <div class="space-y-2 mb-4">
              <div v-for="(dim, key) in readinessDimensions" :key="key" class="flex items-center gap-2">
                <span class="text-xs text-navy-600 w-20 truncate">{{ $t('grantDetail.readiness.dimensions.' + key) }}</span>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="dim >= 70 ? 'bg-green-500' : dim >= 40 ? 'bg-amber-400' : 'bg-red-400'"
                    :style="{ width: dim + '%' }"
                  ></div>
                </div>
                <span class="text-xs font-semibold w-8 text-right" :class="dim >= 70 ? 'text-green-600' : dim >= 40 ? 'text-amber-600' : 'text-red-600'">{{ dim }}%</span>
              </div>
            </div>

            <!-- Document Checklist -->
            <div class="border-t border-gray-100 pt-3 mb-3">
              <button @click="showDocChecklist = !showDocChecklist" class="flex items-center justify-between w-full text-sm font-semibold text-navy-800">
                <span>{{ $t('grantDetail.readiness.documents.title') }}</span>
                <svg class="w-4 h-4 text-navy-400 transition-transform" :class="showDocChecklist ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-if="showDocChecklist" class="mt-2 space-y-1.5">
                <label v-for="(doc, idx) in readinessDocuments" :key="idx" class="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-50 rounded p-1 -mx-1">
                  <input type="checkbox" :checked="doc.checked" @change="toggleReadinessDoc(idx)"
                    class="w-3.5 h-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span :class="doc.checked ? 'text-gray-400 line-through' : 'text-navy-700'">{{ doc.label }}</span>
                </label>
              </div>
            </div>

            <!-- Gap Remediation Roadmap -->
            <div v-if="readinessGaps.length > 0" class="border-t border-gray-100 pt-3">
              <button @click="showGapRoadmap = !showGapRoadmap" class="flex items-center justify-between w-full text-sm font-semibold text-navy-800 mb-2">
                <span>{{ $t('grantDetail.readiness.roadmap.title') }}</span>
                <svg class="w-4 h-4 text-navy-400 transition-transform" :class="showGapRoadmap ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div v-if="showGapRoadmap" class="space-y-2">
                <div v-for="gap in readinessGaps" :key="gap.dimension"
                  class="p-2.5 rounded-lg border text-xs"
                  :class="gap.score < 40 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'">
                  <div class="flex items-center justify-between mb-1">
                    <span class="font-semibold" :class="gap.score < 40 ? 'text-red-700' : 'text-amber-700'">
                      {{ $t('grantDetail.readiness.dimensions.' + gap.dimension) }} — {{ gap.score }}%
                    </span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      :class="gap.score < 40 ? 'bg-red-200 text-red-800' : 'bg-amber-200 text-amber-800'">
                      {{ $t('grantDetail.readiness.roadmap.actionNeeded') }}
                    </span>
                  </div>
                  <p class="text-gray-600 mb-1.5">{{ gap.message }}</p>
                  <button @click="gap.action()" class="text-xs font-medium transition-colors"
                    :class="gap.score < 40 ? 'text-red-600 hover:text-red-700' : 'text-amber-600 hover:text-amber-700'">
                    {{ gap.actionLabel }} &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('grantDetail.actions') }}</h3>

            <div class="space-y-3">
              <a
                v-if="grant.url"
                :href="grant.url"
                target="_blank"
                rel="noopener noreferrer"
                class="block w-full btn btn-primary text-center"
              >
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  {{ $t('grantDetail.viewOfficialPage') }}
                </div>
              </a>

              <!-- Proposal Status or Start Application -->
              <div v-if="authStore.isAuthenticated">
                <router-link
                  v-if="grantProposal"
                  :to="`/proposals/${grantProposal.id}`"
                  class="block w-full btn text-center"
                  :class="grantProposal.status === 'submitted' ? 'btn-outline border-green-300 text-green-700 hover:bg-green-50' : 'btn-primary'"
                >
                  <div class="flex items-center justify-center gap-2">
                    <svg v-if="grantProposal.status === 'submitted'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    {{ $t('grantDetail.proposalStatus.' + (grantProposal.status || 'draft')) }}
                  </div>
                </router-link>
                <button
                  v-else
                  @click="startApplication"
                  class="block w-full btn btn-primary text-center"
                >
                  <div class="flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    {{ $t('grantDetail.startApplication') }}
                  </div>
                </button>
              </div>

              <button @click="printGrantDetails" class="block w-full btn btn-outline text-center" :title="$t('grantDetail.exportPdfHint')">
                <div class="flex items-center justify-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  {{ $t('grantDetail.exportDetails') }}
                </div>
              </button>
            </div>
          </div>

          <!-- Budget Planner -->
          <div v-if="grant.amount_max || grant.amount_min" class="card">
            <button @click="showBudgetPlanner = !showBudgetPlanner" class="w-full flex items-center justify-between">
              <h3 class="text-sm font-semibold text-navy-900 flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                </svg>
                {{ $t('grantDetail.budgetPlanner.title') }}
              </h3>
              <svg class="w-4 h-4 text-navy-400 transition-transform" :class="showBudgetPlanner ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div v-if="showBudgetPlanner" class="mt-4 space-y-3">
              <div>
                <label class="text-xs font-medium text-navy-500">{{ $t('grantDetail.budgetPlanner.requestedAmount') }}</label>
                <input v-model.number="budgetRequested" type="number" class="input text-sm py-1.5 w-full mt-1" :placeholder="String(grant.amount_max || grant.amount_min || 0)" @input="saveBudgetPlan" />
              </div>
              <div>
                <label class="text-xs font-medium text-navy-500">{{ $t('grantDetail.budgetPlanner.fundingRate') }} (%)</label>
                <input v-model.number="budgetFundingRate" type="number" min="1" max="100" class="input text-sm py-1.5 w-full mt-1" placeholder="80" @input="saveBudgetPlan" />
              </div>
              <div class="p-3 bg-stone-50 rounded-lg space-y-2">
                <div class="flex justify-between text-xs">
                  <span class="text-navy-500">{{ $t('grantDetail.budgetPlanner.totalProject') }}</span>
                  <span class="font-bold text-navy-900">€{{ budgetTotalProject.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-navy-500">{{ $t('grantDetail.budgetPlanner.grantCovers') }}</span>
                  <span class="font-semibold text-sage-600">€{{ budgetRequested.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-navy-500">{{ $t('grantDetail.budgetPlanner.coFinancing') }}</span>
                  <span class="font-semibold text-amber-600">€{{ budgetCoFinancing.toLocaleString() }}</span>
                </div>
                <!-- Visual bar -->
                <div class="flex rounded-full h-2 overflow-hidden bg-navy-100 mt-1">
                  <div class="bg-sage-400 transition-all" :style="`width: ${budgetFundingRate}%`"></div>
                  <div class="bg-amber-400 transition-all" :style="`width: ${100 - budgetFundingRate}%`"></div>
                </div>
                <div class="flex justify-between text-[10px] text-navy-400">
                  <span>{{ $t('grantDetail.budgetPlanner.grant') }} {{ budgetFundingRate }}%</span>
                  <span>{{ $t('grantDetail.budgetPlanner.own') }} {{ 100 - budgetFundingRate }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Effort Estimator -->
          <div class="card">
            <button @click="showEffortEstimator = !showEffortEstimator" class="w-full flex items-center justify-between">
              <h3 class="text-sm font-semibold text-navy-900 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ $t('grantDetail.effort.title') }}
              </h3>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-semibold rounded-full">
                  {{ $t('grantDetail.effort.badge', { hours: effortDisplayTotal }) }}
                </span>
                <svg class="w-4 h-4 text-navy-400 transition-transform" :class="showEffortEstimator ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>
            <div v-if="showEffortEstimator" class="mt-4 space-y-4">
              <!-- Phase Breakdown Stacked Bar -->
              <div>
                <p class="text-xs font-medium text-navy-500 mb-2">{{ $t('grantDetail.effort.phaseBreakdown') }}</p>
                <div class="flex rounded-full h-3 overflow-hidden bg-stone-100">
                  <div class="bg-blue-400 transition-all" :style="`width: ${effortAutoEstimate.total > 0 ? (effortAutoEstimate.phases.research / effortAutoEstimate.total * 100) : 0}%`" :title="$t('grantDetail.effort.phases.research') + ': ' + effortAutoEstimate.phases.research + 'h'"></div>
                  <div class="bg-amber-400 transition-all" :style="`width: ${effortAutoEstimate.total > 0 ? (effortAutoEstimate.phases.writing / effortAutoEstimate.total * 100) : 0}%`" :title="$t('grantDetail.effort.phases.writing') + ': ' + effortAutoEstimate.phases.writing + 'h'"></div>
                  <div class="bg-green-400 transition-all" :style="`width: ${effortAutoEstimate.total > 0 ? (effortAutoEstimate.phases.budgeting / effortAutoEstimate.total * 100) : 0}%`" :title="$t('grantDetail.effort.phases.budgeting') + ': ' + effortAutoEstimate.phases.budgeting + 'h'"></div>
                  <div class="bg-red-400 transition-all" :style="`width: ${effortAutoEstimate.total > 0 ? (effortAutoEstimate.phases.compliance / effortAutoEstimate.total * 100) : 0}%`" :title="$t('grantDetail.effort.phases.compliance') + ': ' + effortAutoEstimate.phases.compliance + 'h'"></div>
                  <div class="bg-purple-400 transition-all" :style="`width: ${effortAutoEstimate.total > 0 ? (effortAutoEstimate.phases.review / effortAutoEstimate.total * 100) : 0}%`" :title="$t('grantDetail.effort.phases.review') + ': ' + effortAutoEstimate.phases.review + 'h'"></div>
                </div>
                <div class="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                  <div class="flex items-center gap-1 text-[10px] text-stone-600">
                    <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                    {{ $t('grantDetail.effort.phases.research') }} {{ effortAutoEstimate.phases.research }}h
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-stone-600">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                    {{ $t('grantDetail.effort.phases.writing') }} {{ effortAutoEstimate.phases.writing }}h
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-stone-600">
                    <span class="w-2 h-2 rounded-full bg-green-400"></span>
                    {{ $t('grantDetail.effort.phases.budgeting') }} {{ effortAutoEstimate.phases.budgeting }}h
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-stone-600">
                    <span class="w-2 h-2 rounded-full bg-red-400"></span>
                    {{ $t('grantDetail.effort.phases.compliance') }} {{ effortAutoEstimate.phases.compliance }}h
                  </div>
                  <div class="flex items-center gap-1 text-[10px] text-stone-600">
                    <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                    {{ $t('grantDetail.effort.phases.review') }} {{ effortAutoEstimate.phases.review }}h
                  </div>
                </div>
              </div>
              <!-- Total -->
              <div class="p-3 bg-stone-50 rounded-lg">
                <div class="flex justify-between text-xs">
                  <span class="text-navy-500">{{ $t('grantDetail.effort.totalHours') }}</span>
                  <span class="font-bold text-navy-900">{{ effortDisplayTotal }}h</span>
                </div>
              </div>
              <!-- Override -->
              <div>
                <label class="text-xs font-medium text-navy-500">{{ $t('grantDetail.effort.override') }}</label>
                <p class="text-[10px] text-stone-400 mb-1">{{ $t('grantDetail.effort.overrideHint') }}</p>
                <div class="flex items-center gap-2">
                  <input v-model.number="effortOverride" type="number" min="1" class="input text-sm py-1.5 w-full" :placeholder="String(effortAutoEstimate.total)" @input="saveEffortEstimate" />
                  <button v-if="effortOverride" @click="effortOverride = 0; saveEffortEstimate()" class="text-xs text-amber-600 hover:text-amber-700 whitespace-nowrap">{{ $t('grantDetail.effort.reset') }}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Source Information -->
          <div class="card bg-gray-50">
            <h3 class="text-sm font-medium text-gray-600 mb-3">{{ $t('grantDetail.sourceInfo') }}</h3>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ $t('grantDetail.source') }}</span>
                <span class="font-medium text-gray-900">{{ grant.source_id }}</span>
              </div>
              <div v-if="grant.external_id" class="flex items-center justify-between">
                <span class="text-gray-600">{{ $t('grantDetail.referenceId') }}</span>
                <span class="font-mono text-xs text-gray-900">{{ grant.external_id }}</span>
              </div>
              <div v-if="grant.confidence_score" class="flex items-center justify-between">
                <span class="text-gray-600">{{ $t('grantDetail.dataQuality') }}</span>
                <div class="flex items-center gap-1">
                  <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="Math.round(grant.confidence_score * 100)" aria-valuemin="0" aria-valuemax="100">
                    <div
                      :style="{ width: `${grant.confidence_score * 100}%` }"
                      class="h-full bg-green-500"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-600">{{ Math.round(grant.confidence_score * 100) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Funder Intelligence Panel -->
          <div v-if="funderIntelLoading || funderIntel" class="card border border-stone-200">
            <button @click="showFunderIntel = !showFunderIntel" class="w-full flex items-center justify-between">
              <h3 class="text-sm font-semibold text-[#1e3a5f] flex items-center gap-2">
                <svg class="w-4 h-4 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                {{ $t('grantDetail.funderIntel.title') }}
              </h3>
              <svg class="w-4 h-4 text-stone-400 transition-transform" :class="showFunderIntel ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <div v-if="showFunderIntel" class="mt-4">
              <!-- Loading state -->
              <div v-if="funderIntelLoading" class="flex items-center justify-center gap-2 py-6 text-sm text-stone-400">
                <div class="w-4 h-4 border-2 border-[#d4a843] border-t-transparent rounded-full animate-spin"></div>
                {{ $t('grantDetail.funderIntel.loading') }}
              </div>

              <!-- Content -->
              <div v-else-if="funderIntel" class="space-y-4">
                <!-- Funder Name -->
                <p class="text-base font-display font-semibold text-[#1e3a5f]">{{ funderIntel.name }}</p>

                <!-- Grant Count Badges -->
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-xs font-medium">
                    {{ $t('grantDetail.funderIntel.totalGrants', { count: funderIntel.totalGrants }) }}
                  </span>
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-[#7c9a6e]/15 text-[#7c9a6e] rounded-full text-xs font-medium">
                    {{ $t('grantDetail.funderIntel.openGrants', { count: funderIntel.openGrants }) }}
                  </span>
                </div>

                <!-- Top Categories -->
                <div v-if="funderIntel.categories.length > 0">
                  <p class="text-xs font-medium text-stone-500 mb-2">{{ $t('grantDetail.funderIntel.topCategories') }}</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="cat in funderIntel.categories" :key="cat.name"
                      class="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-[11px] font-medium">
                      {{ cat.name }}
                      <span class="text-stone-400">({{ cat.count }})</span>
                    </span>
                  </div>
                </div>

                <!-- Funding Range -->
                <div v-if="funderIntel.fundingRange.max > 0">
                  <p class="text-xs font-medium text-stone-500 mb-1">{{ $t('grantDetail.funderIntel.fundingRange') }}</p>
                  <p class="text-sm font-semibold text-[#d4a843]">
                    {{ funderIntel.fundingRange.min > 0 ? `€${funderIntel.fundingRange.min.toLocaleString()}` : '€0' }}
                    –
                    €{{ funderIntel.fundingRange.max.toLocaleString() }}
                  </p>
                </div>

                <!-- User Engagement Summary -->
                <div v-if="funderIntel.userSavedFromFunder > 0 || funderIntel.userAppliedToFunder > 0"
                  class="p-3 bg-stone-50 rounded-lg space-y-1">
                  <p v-if="funderIntel.userSavedFromFunder > 0" class="text-xs text-[#1e3a5f]">
                    {{ $t('grantDetail.funderIntel.userSaved', { count: funderIntel.userSavedFromFunder }) }}
                  </p>
                  <p v-if="funderIntel.userAppliedToFunder > 0" class="text-xs text-[#7c9a6e]">
                    {{ $t('grantDetail.funderIntel.userApplied', { count: funderIntel.userAppliedToFunder }) }}
                  </p>
                </div>

                <!-- No data fallback -->
                <p v-if="funderIntel.totalGrants === 0" class="text-xs text-stone-400 text-center py-2">
                  {{ $t('grantDetail.funderIntel.noData') }}
                </p>

                <!-- View All Button -->
                <button v-if="funderIntel.totalGrants > 0" @click="viewAllFunderGrants"
                  class="w-full py-2 text-sm font-medium text-[#1e3a5f] bg-[#1e3a5f]/5 hover:bg-[#1e3a5f]/10 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  {{ $t('grantDetail.funderIntel.viewAllGrants') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Need Help? -->
          <div class="card border-2 border-primary-200 bg-primary-50">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ $t('grantDetail.needHelp') }}</h3>
                <p class="text-sm text-gray-700 mb-3">
                  {{ $t('grantDetail.aiHelpDescription') }}
                </p>
                <button class="btn btn-primary text-sm w-full">
                  {{ $t('grantDetail.askAIAssistant') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Handoff Notes -->
      <div class="card mt-6">
        <div class="p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-navy-900">{{ t('grantDetail.handoffNotes.title') }}</h3>
            <span v-if="handoffNotes.length" class="text-xs bg-navy-100 text-navy-600 px-2 py-0.5 rounded-full">{{ handoffNotes.length }}</span>
          </div>

          <!-- Composer -->
          <div class="flex gap-2 mb-4">
            <input v-model="newNoteText" @keyup.enter="addHandoffNote"
              :placeholder="t('grantDetail.handoffNotes.placeholder')"
              class="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent" />
            <select v-model="newNoteType" class="px-2 py-2 border border-stone-200 rounded-lg text-sm bg-white">
              <option value="general">&#x1F4DD; {{ t('grantDetail.handoffNotes.types.general') }}</option>
              <option value="question">&#x2753; {{ t('grantDetail.handoffNotes.types.question') }}</option>
              <option value="action">&#x26A1; {{ t('grantDetail.handoffNotes.types.action') }}</option>
              <option value="blocker">&#x1F6AB; {{ t('grantDetail.handoffNotes.types.blocker') }}</option>
              <option value="decision">&#x2705; {{ t('grantDetail.handoffNotes.types.decision') }}</option>
            </select>
            <button @click="addHandoffNote" class="px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 transition-colors">
              {{ t('grantDetail.handoffNotes.add') }}
            </button>
          </div>

          <!-- Notes Feed -->
          <div v-if="sortedNotes.length" class="space-y-3">
            <div v-for="note in sortedNotes" :key="note.id"
              class="border-l-4 rounded-r-lg bg-stone-50 p-3 relative group"
              :class="noteTypeConfig[note.type]?.border || 'border-l-stone-300'">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm">{{ noteTypeConfig[note.type]?.icon }}</span>
                  <span class="text-xs font-medium" :class="noteTypeConfig[note.type]?.color">
                    {{ t(`grantDetail.handoffNotes.types.${note.type}`) }}
                  </span>
                  <span v-if="note.pinned" class="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">&#x1F4CC;</span>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="togglePinNote(note.id)" class="p-1 rounded hover:bg-stone-200 text-xs" :title="note.pinned ? t('grantDetail.handoffNotes.unpin') : t('grantDetail.handoffNotes.pin')">
                    &#x1F4CC;
                  </button>
                  <button @click="deleteHandoffNote(note.id)" class="p-1 rounded hover:bg-red-100 text-xs text-red-500" :title="t('grantDetail.handoffNotes.delete')">
                    &#x2715;
                  </button>
                </div>
              </div>
              <p class="text-sm text-navy-800 mt-1">{{ note.text }}</p>
              <div class="flex items-center gap-2 mt-2 text-[11px] text-stone-400">
                <span>{{ note.author }}</span>
                <span>&middot;</span>
                <span>{{ timeAgo(note.createdAt) }}</span>
              </div>
            </div>
          </div>

          <p v-else class="text-sm text-stone-400 text-center py-4">{{ t('grantDetail.handoffNotes.empty') }}</p>
        </div>
      </div>

      <!-- Preparation Checklist -->
      <div class="card mt-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
            {{ $t('grantDetail.prepChecklist.title') }}
          </h2>
          <span v-if="prepItems.length > 0" class="text-xs font-medium" :class="prepProgress === 100 ? 'text-sage-600' : 'text-navy-400'">
            {{ prepCheckedCount }}/{{ prepItems.length }}
          </span>
        </div>

        <!-- Progress bar -->
        <div v-if="prepItems.length > 0" class="w-full bg-navy-100 rounded-full h-1.5 mb-4">
          <div class="h-1.5 rounded-full transition-all duration-500" :class="prepProgress === 100 ? 'bg-sage-500' : 'bg-amber-400'" :style="`width: ${prepProgress}%`"></div>
        </div>

        <!-- Checklist items -->
        <div class="space-y-2 mb-4">
          <div v-for="(item, index) in prepItems" :key="index" class="flex items-start gap-3 group">
            <button
              @click="togglePrepItem(index)"
              class="mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
              :class="item.checked ? 'bg-sage-500 border-sage-500 text-white' : 'border-navy-300 hover:border-amber-400'"
            >
              <svg v-if="item.checked" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </button>
            <span class="text-sm flex-1" :class="item.checked ? 'text-navy-400 line-through' : 'text-navy-700'">
              {{ item.text }}
            </span>
            <button @click="removePrepItem(index)" class="opacity-0 group-hover:opacity-100 p-0.5 text-navy-300 hover:text-red-400 transition-all">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Add item -->
        <div class="flex gap-2">
          <input
            v-model="newPrepItem"
            @keyup.enter="addPrepItem"
            :placeholder="$t('grantDetail.prepChecklist.addPlaceholder')"
            class="input text-sm flex-1 py-1.5"
          />
          <button @click="addPrepItem" :disabled="!newPrepItem.trim()" class="btn btn-sm bg-sage-500 text-white hover:bg-sage-600 disabled:opacity-40">
            +
          </button>
        </div>
      </div>

      <!-- Dependencies & Pre-Requisites Panel -->
      <div class="card mt-6">
        <div class="p-5">
          <!-- Collapsible Header -->
          <button @click="showDependencies = !showDependencies" class="w-full flex items-center justify-between">
            <h3 class="text-lg font-bold text-navy-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
              </svg>
              {{ $t('grantDetail.dependencies.title') }}
              <span v-if="currentGrantDeps.length > 0" class="text-xs font-medium px-2 py-0.5 rounded-full" :class="pendingDepsCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'">
                {{ $t('grantDetail.dependencies.count', { count: currentGrantDeps.length }) }}
              </span>
            </h3>
            <svg class="w-5 h-5 text-navy-400 transition-transform duration-200" :class="{ 'rotate-180': showDependencies }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div v-if="showDependencies" class="mt-4">
            <!-- Status Summary -->
            <div v-if="currentGrantDeps.length > 0" class="mb-4 p-3 rounded-lg text-sm" :class="pendingDepsCount > 0 ? 'bg-amber-50 border border-amber-200 text-amber-700' : 'bg-green-50 border border-green-200 text-green-700'">
              <span v-if="pendingDepsCount > 0">{{ $t('grantDetail.dependencies.pendingWarning', { count: pendingDepsCount }) }}</span>
              <span v-else>{{ $t('grantDetail.dependencies.allMet') }}</span>
            </div>

            <!-- Dependencies List -->
            <div v-if="currentGrantDeps.length > 0" class="space-y-3 mb-5">
              <div v-for="dep in currentGrantDeps" :key="dep.id"
                class="flex items-start gap-3 p-3 rounded-lg border group transition-colors"
                :class="dep.status === 'met' ? 'bg-green-50/50 border-green-200' : 'bg-amber-50/50 border-amber-200'">
                <!-- Status checkbox -->
                <button @click="toggleDepStatus(dep.id)"
                  class="mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  :class="dep.status === 'met' ? 'bg-green-500 border-green-500 text-white' : 'border-amber-400 hover:border-amber-500'">
                  <svg v-if="dep.status === 'met'" class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </button>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <!-- Type badge -->
                    <span class="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                      :class="{
                        'bg-[#1e3a5f]/10 text-[#1e3a5f]': dep.type === 'grant_completion',
                        'bg-[#d4a843]/15 text-[#d4a843]': dep.type === 'document',
                        'bg-[#7c9a6e]/15 text-[#7c9a6e]': dep.type === 'milestone',
                        'bg-stone-200 text-stone-600': dep.type === 'custom'
                      }">
                      {{ $t(`grantDetail.dependencies.type.${dep.type}`) }}
                    </span>
                    <span class="text-[10px] font-medium" :class="dep.status === 'met' ? 'text-green-600' : 'text-amber-600'">
                      {{ dep.status === 'met' ? $t('grantDetail.dependencies.statusMet') : $t('grantDetail.dependencies.statusPending') }}
                    </span>
                  </div>
                  <p class="text-sm font-medium" :class="dep.status === 'met' ? 'text-stone-400 line-through' : 'text-navy-800'">
                    {{ getDepTargetGrantTitle(dep) }}
                  </p>
                  <p v-if="dep.notes" class="text-xs text-stone-500 mt-1">{{ dep.notes }}</p>
                </div>

                <!-- Delete button -->
                <button @click="removeDependency(dep.id)" class="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0" :title="$t('grantDetail.dependencies.remove')">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Empty State -->
            <p v-if="currentGrantDeps.length === 0" class="text-sm text-stone-400 text-center py-4 mb-4">
              {{ $t('grantDetail.dependencies.noDependencies') }}
            </p>

            <!-- Add Dependency Form -->
            <div class="border border-stone-200 rounded-lg p-3 bg-stone-50">
              <p class="text-xs font-semibold text-navy-700 mb-2">{{ $t('grantDetail.dependencies.addDependency') }}</p>
              <div class="flex flex-col sm:flex-row gap-2">
                <!-- Type selector -->
                <select v-model="newDepType" class="text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-white text-navy-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none sm:w-40">
                  <option value="grant_completion">{{ $t('grantDetail.dependencies.type.grant_completion') }}</option>
                  <option value="document">{{ $t('grantDetail.dependencies.type.document') }}</option>
                  <option value="milestone">{{ $t('grantDetail.dependencies.type.milestone') }}</option>
                  <option value="custom">{{ $t('grantDetail.dependencies.type.custom') }}</option>
                </select>

                <!-- Grant dropdown (for grant_completion) or text input (for others) -->
                <select v-if="newDepType === 'grant_completion'" v-model="newDepTargetGrant"
                  class="flex-1 text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-white text-navy-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none">
                  <option value="">{{ $t('grantDetail.dependencies.selectGrant') }}</option>
                  <option v-for="sg in savedGrantsList" :key="sg.id" :value="sg.id">{{ sg.title }}</option>
                </select>
                <input v-else v-model="newDepLabel" type="text"
                  :placeholder="$t('grantDetail.dependencies.customLabelPlaceholder')"
                  class="flex-1 text-xs border border-stone-200 rounded-lg px-2.5 py-2 bg-white text-navy-700 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
                  @keyup.enter="handleAddDependency" />

                <!-- Add button -->
                <button @click="handleAddDependency"
                  class="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-xs font-medium hover:bg-[#1e3a5f]/90 transition-colors whitespace-nowrap"
                  :disabled="newDepType === 'grant_completion' ? !newDepTargetGrant : !newDepLabel.trim()">
                  {{ $t('grantDetail.dependencies.addDependency') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('grantDetail.grantNotFound') }}</h3>
      <p class="text-gray-600 mb-4">
        {{ $t('grantDetail.grantNotFoundDesc') }}
      </p>
      <router-link to="/grants" class="btn btn-primary">
        {{ $t('grantDetail.backToGrants') }}
      </router-link>
    </div>
    <!-- Mobile Sticky CTA Bar -->
    <div v-if="grant && !loading" class="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-sm border-t border-stone-200 px-4 py-3 shadow-lg">
      <div class="flex items-center gap-3 max-w-lg mx-auto">
        <button
          @click="toggleSave"
          :class="isSaved ? 'bg-amber-50 text-amber-600 border-amber-300' : 'bg-white text-navy-700 border-navy-200'"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm font-semibold transition-all"
        >
          <svg class="w-4 h-4" :class="isSaved ? 'fill-current' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
          </svg>
          {{ isSaved ? $t('grantDetail.saved') : $t('grantDetail.save') }}
        </button>
        <router-link
          :to="`/proposals/new?grantId=${grant.id}`"
          class="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
          </svg>
          {{ $t('grantDetail.startProposal') }}
        </router-link>
      </div>
    </div>
    <ScrollToTop />

    <!-- Floating Annotation Toolbar -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="showAnnotationToolbar && selectedText"
          ref="annotationToolbarEl"
          class="fixed z-[100] bg-navy-900 text-white rounded-lg shadow-2xl px-2 py-1.5 flex items-center gap-1"
          :style="{ top: annotationToolbarPos.y + 'px', left: annotationToolbarPos.x + 'px' }"
        >
          <button
            v-for="color in annotationColors"
            :key="color.id"
            @mousedown.prevent="createAnnotation(color.id)"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors text-xs font-medium whitespace-nowrap"
            :title="$t(`grantDetail.annotations.colors.${color.i18nKey}`)"
          >
            <span class="w-3 h-3 rounded-full flex-shrink-0" :class="color.dotClass"></span>
            <span class="hidden sm:inline">{{ $t(`grantDetail.annotations.colors.${color.i18nKey}`) }}</span>
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- Annotations Sidebar -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div
          v-if="showAnnotationsSidebar"
          class="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col border-l border-stone-200"
        >
          <!-- Sidebar Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-stone-200">
            <h3 class="text-base font-display font-semibold text-navy-900">
              {{ $t('grantDetail.annotations.sidebar.title') }}
              <span v-if="annotations.length > 0" class="ml-2 text-xs font-medium text-stone-500">
                ({{ annotations.length }})
              </span>
            </h3>
            <button @click="showAnnotationsSidebar = false" class="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Sidebar Content -->
          <div class="flex-1 overflow-y-auto px-5 py-4">
            <!-- Empty state -->
            <div v-if="annotations.length === 0" class="text-center py-10">
              <svg class="w-12 h-12 mx-auto mb-3 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
              <p class="text-sm text-stone-400">{{ $t('grantDetail.annotations.sidebar.empty') }}</p>
            </div>

            <!-- Grouped annotations -->
            <div v-else class="space-y-6">
              <div v-for="group in annotationGroups" :key="group.color">
                <div class="flex items-center gap-2 mb-3">
                  <span class="w-3 h-3 rounded-full flex-shrink-0" :class="getAnnotationColorDot(group.color)"></span>
                  <h4 class="text-xs font-bold uppercase tracking-wide text-stone-500">
                    {{ getAnnotationGroupLabel(group.color) }}
                  </h4>
                  <span class="text-[10px] text-stone-400">({{ group.items.length }})</span>
                </div>
                <div class="space-y-2">
                  <div
                    v-for="annotation in group.items"
                    :key="annotation.id"
                    :id="`annotation-card-${annotation.id}`"
                    class="rounded-lg border p-3 group hover:shadow-sm transition-shadow cursor-pointer"
                    :class="getAnnotationCardClass(annotation.color)"
                    @click="scrollToAnnotation(annotation.id)"
                  >
                    <!-- Text preview -->
                    <p class="text-xs text-navy-800 font-medium line-clamp-2 mb-2">
                      "{{ annotation.selectedText }}"
                    </p>

                    <!-- Note -->
                    <div v-if="editingAnnotationId === annotation.id" class="mb-2">
                      <textarea
                        v-model="editingAnnotationNote"
                        @blur="updateAnnotationNote(annotation.id, editingAnnotationNote)"
                        @keydown.enter.ctrl="updateAnnotationNote(annotation.id, editingAnnotationNote)"
                        :placeholder="$t('grantDetail.annotations.sidebar.notePlaceholder')"
                        class="w-full text-xs border border-stone-200 rounded-md px-2 py-1.5 resize-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                        rows="2"
                        @click.stop
                      ></textarea>
                    </div>
                    <p v-else-if="annotation.note" class="text-[11px] text-stone-600 mb-2 italic">
                      {{ annotation.note }}
                    </p>

                    <!-- Actions -->
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] text-stone-400">{{ timeAgo(annotation.createdAt) }}</span>
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          @click.stop="startEditAnnotationNote(annotation)"
                          class="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-600"
                          :title="$t('grantDetail.annotations.toolbar.addNote')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          @click.stop="createTaskFromAnnotation(annotation)"
                          class="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-600"
                          :title="$t('grantDetail.annotations.toolbar.createTask')"
                        >
                          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                          </svg>
                        </button>
                        <button
                          @click.stop="deleteAnnotation(annotation.id)"
                          class="p-1 rounded hover:bg-red-100 text-stone-400 hover:text-red-500"
                          :title="$t('grantDetail.annotations.toolbar.remove')"
                        >
                          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Sidebar backdrop -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showAnnotationsSidebar"
          class="fixed inset-0 bg-black/20 z-40"
          @click="showAnnotationsSidebar = false"
        ></div>
      </Transition>
    </Teleport>

  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import HelpTooltip from '@/components/HelpTooltip.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'
import { usePageTitle } from '@/lib/usePageTitle'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const toast = useToast()

const loading = ref(true)
const grant = ref<any>(null)

const pageTitle = computed(() => grant.value?.title || t('nav.grants'))
usePageTitle(pageTitle)
const similarGrants = ref<any[]>([])
const similarLoading = ref(false)
const aiSummary = ref('')
const isSaved = ref(false)
const linkCopied = ref(false)
const grantProposal = ref<any>(null)
const eligibilityResult = ref<any>(null)
const checkingEligibility = ref(false)
const descExpanded = ref(false)
const descNeedsExpand = ref(false)
const isReminderSet = ref(false)

// Funder Intelligence Panel
interface FunderIntelligence {
  name: string
  totalGrants: number
  openGrants: number
  categories: Array<{ name: string; count: number }>
  fundingRange: { min: number; max: number; currency: string }
  userSavedFromFunder: number
  userAppliedToFunder: number
  otherGrantIds: string[]
}

const funderIntel = ref<FunderIntelligence | null>(null)
const funderIntelLoading = ref(false)
const showFunderIntel = ref(true)

async function loadFunderIntelligence() {
  if (!grant.value) return
  const funderName = grant.value.funder_name || grant.value.program_name || grant.value.source_id
  if (!funderName) return

  funderIntelLoading.value = true
  try {
    const response = await api.get('/api/grants', { params: { search: funderName, limit: 50 } })
    const allResults = response.data?.grants || []
    const currentId = String(grant.value.id)
    const otherGrants = allResults.filter((g: any) => String(g.id) !== currentId)

    // Count open grants
    const now = new Date()
    const openGrants = otherGrants.filter((g: any) => {
      if (!g.deadline) return true
      return new Date(g.deadline) > now
    })

    // Compute categories
    const categoryMap: Record<string, number> = {}
    otherGrants.forEach((g: any) => {
      const cat = g.category || 'Other'
      categoryMap[cat] = (categoryMap[cat] || 0) + 1
    })
    const categories = Object.entries(categoryMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Compute funding range
    let minAmount = Infinity
    let maxAmount = 0
    let currency = 'EUR'
    otherGrants.forEach((g: any) => {
      if (g.amount_min && g.amount_min < minAmount) minAmount = g.amount_min
      if (g.amount_max && g.amount_max > maxAmount) maxAmount = g.amount_max
      if (g.currency) currency = g.currency
    })
    if (minAmount === Infinity) minAmount = 0

    // Cross-reference with user's saved grants and workflow
    const savedGrantIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
    const workflowData: Record<string, any> = JSON.parse(localStorage.getItem('grantWorkflow') || '{}')
    const otherIds = otherGrants.map((g: any) => String(g.id))
    const userSavedFromFunder = otherIds.filter((id: string) => savedGrantIds.includes(id)).length
    const userAppliedToFunder = otherIds.filter((id: string) => {
      const wf = workflowData[id]
      return wf && (wf.status === 'applying' || wf.status === 'submitted')
    }).length

    funderIntel.value = {
      name: funderName,
      totalGrants: otherGrants.length,
      openGrants: openGrants.length,
      categories,
      fundingRange: { min: minAmount, max: maxAmount, currency },
      userSavedFromFunder,
      userAppliedToFunder,
      otherGrantIds: otherIds
    }
  } catch {
    // Non-critical, silently fail
    funderIntel.value = null
  } finally {
    funderIntelLoading.value = false
  }
}

function viewAllFunderGrants() {
  if (!funderIntel.value) return
  router.push({ path: '/grants', query: { q: funderIntel.value.name } })
}

// === Application Readiness Score System ===
const showDocChecklist = ref(false)
const showGapRoadmap = ref(true)

interface ReadinessDoc {
  label: string
  checked: boolean
}

const readinessDocuments = ref<ReadinessDoc[]>([])

function loadReadiness() {
  const grantId = route.params.id as string
  const stored = localStorage.getItem(`grantReadiness_${grantId}`)
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.documents) readinessDocuments.value = parsed.documents
      else initDocuments()
    } catch { initDocuments() }
  } else {
    initDocuments()
  }
}

function initDocuments() {
  const docKeys = [
    'registrationCert', 'auditReport', 'annualReport', 'projectProposal',
    'budgetBreakdown', 'teamCVs', 'logicalFramework', 'partnerAgreements',
    'bankDetails', 'legalEntityForm'
  ]
  readinessDocuments.value = docKeys.map(key => ({
    label: t(`grantDetail.readiness.documents.${key}`),
    checked: false
  }))
}

function toggleReadinessDoc(idx: number) {
  if (readinessDocuments.value[idx]) {
    readinessDocuments.value[idx]!.checked = !readinessDocuments.value[idx]!.checked
    saveReadiness()
  }
}

function saveReadiness() {
  const grantId = route.params.id as string
  try {
    localStorage.setItem(`grantReadiness_${grantId}`, JSON.stringify({
      documents: readinessDocuments.value
    }))
  } catch { /* storage full */ }
}

// Readiness dimension computations
const readinessDimensions = computed(() => {
  const doc = computeDocumentReadiness()
  const budget = computeBudgetReadiness()
  const narrative = computeNarrativeReadiness()
  const timeline = computeTimelineReadiness()
  const compliance = computeComplianceReadiness()
  return { document: doc, budget, narrative, timeline, compliance }
})

function computeDocumentReadiness(): number {
  if (readinessDocuments.value.length === 0) return 0
  const checked = readinessDocuments.value.filter(d => d.checked).length
  return Math.round((checked / readinessDocuments.value.length) * 100)
}

function computeBudgetReadiness(): number {
  const grantId = route.params.id as string
  try {
    const data = JSON.parse(localStorage.getItem(`grantBudget_${grantId}`) || '{}')
    if (data.requested && data.requested > 0 && data.fundingRate && data.fundingRate > 0) return 100
    if (data.requested && data.requested > 0) return 60
  } catch { /* */ }
  return 0
}

function computeNarrativeReadiness(): number {
  // Check if proposal exists and has sections
  if (grantProposal.value) {
    const status = grantProposal.value.status
    if (status === 'submitted') return 100
    if (status === 'in_review') return 80
    return 50 // draft
  }
  // Check content library snippets
  try {
    const snippets = JSON.parse(localStorage.getItem('proposalSnippets') || '[]')
    if (snippets.length > 3) return 30
    if (snippets.length > 0) return 15
  } catch { /* */ }
  return 0
}

function computeTimelineReadiness(): number {
  if (!grant.value?.deadline) return 50 // No deadline = moderate
  const days = daysUntilDeadline.value
  if (days < 0) return 0 // Past deadline
  if (days <= 3) return 10
  if (days <= 7) return 30
  if (days <= 14) return 50
  if (days <= 30) return 70
  return 90 // More than 30 days
}

function computeComplianceReadiness(): number {
  if (eligibilityResult.value) {
    const score = eligibilityResult.value.score
    return Math.round(score * 100)
  }
  return 0
}

const overallReadiness = computed(() => {
  const dims = readinessDimensions.value
  const values = Object.values(dims)
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
})

const readinessDimensionLabels = computed(() => [
  t('grantDetail.readiness.dimensions.document'),
  t('grantDetail.readiness.dimensions.budget'),
  t('grantDetail.readiness.dimensions.narrative'),
  t('grantDetail.readiness.dimensions.timeline'),
  t('grantDetail.readiness.dimensions.compliance'),
])

// Pentagon chart helpers
function pentagonPoints(radius: number): string {
  const pts: string[] = []
  for (let i = 0; i < 5; i++) {
    const angle = (2 * Math.PI * i) / 5 - Math.PI / 2
    pts.push(`${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`)
  }
  return pts.join(' ')
}

const radarDataPointsArray = computed(() => {
  const dims = readinessDimensions.value
  const values = [dims.document, dims.budget, dims.narrative, dims.timeline, dims.compliance]
  return values.map((val, i) => {
    const angle = (2 * Math.PI * i) / 5 - Math.PI / 2
    const r = (val / 100) * 90
    return { x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle) }
  })
})

const radarDataPoints = computed(() => {
  return radarDataPointsArray.value.map(pt => `${pt.x},${pt.y}`).join(' ')
})

// Gap Remediation Roadmap
interface ReadinessGap {
  dimension: string
  score: number
  message: string
  actionLabel: string
  action: () => void
}

const readinessGaps = computed((): ReadinessGap[] => {
  const dims = readinessDimensions.value
  const gaps: ReadinessGap[] = []

  if (dims.document < 80) {
    gaps.push({
      dimension: 'document',
      score: dims.document,
      message: dims.document === 0 ? t('grantDetail.readiness.gaps.documentMissing') : t('grantDetail.readiness.gaps.documentPartial'),
      actionLabel: t('grantDetail.readiness.actions.uploadDocs'),
      action: () => { showDocChecklist.value = true }
    })
  }
  if (dims.budget < 80) {
    gaps.push({
      dimension: 'budget',
      score: dims.budget,
      message: dims.budget === 0 ? t('grantDetail.readiness.gaps.budgetNotStarted') : t('grantDetail.readiness.gaps.budgetPartial'),
      actionLabel: t('grantDetail.readiness.actions.startBudget'),
      action: () => { showBudgetPlanner.value = true }
    })
  }
  if (dims.narrative < 80) {
    gaps.push({
      dimension: 'narrative',
      score: dims.narrative,
      message: dims.narrative === 0 ? t('grantDetail.readiness.gaps.narrativeNotStarted') : t('grantDetail.readiness.gaps.narrativePartial'),
      actionLabel: t('grantDetail.readiness.actions.writeNarrative'),
      action: () => { startApplication() }
    })
  }
  if (dims.timeline < 80) {
    gaps.push({
      dimension: 'timeline',
      score: dims.timeline,
      message: dims.timeline <= 30 ? t('grantDetail.readiness.gaps.timelineTight') : t('grantDetail.readiness.gaps.timelineOk'),
      actionLabel: t('grantDetail.readiness.actions.planTimeline'),
      action: () => { toggleReminder() }
    })
  }
  if (dims.compliance < 80) {
    gaps.push({
      dimension: 'compliance',
      score: dims.compliance,
      message: dims.compliance === 0 ? t('grantDetail.readiness.gaps.complianceNotChecked') : t('grantDetail.readiness.gaps.compliancePartial'),
      actionLabel: t('grantDetail.readiness.actions.checkCompliance'),
      action: () => { runEligibilityCheck() }
    })
  }

  return gaps.sort((a, b) => a.score - b.score)
})

// Handoff Notes System
interface HandoffNote {
  id: string
  text: string
  type: 'general' | 'question' | 'action' | 'blocker' | 'decision'
  author: string
  createdAt: string
  pinned: boolean
}

const handoffNotes = ref<HandoffNote[]>([])
const newNoteText = ref('')
const newNoteType = ref<HandoffNote['type']>('general')

const noteTypeConfig: Record<string, { icon: string; color: string; border: string }> = {
  general: { icon: '\u{1F4DD}', color: 'text-stone-600', border: 'border-l-stone-300' },
  question: { icon: '\u{2753}', color: 'text-blue-600', border: 'border-l-blue-400' },
  action: { icon: '\u{26A1}', color: 'text-amber-600', border: 'border-l-amber-400' },
  blocker: { icon: '\u{1F6AB}', color: 'text-red-600', border: 'border-l-red-400' },
  decision: { icon: '\u{2705}', color: 'text-green-600', border: 'border-l-green-400' }
}

function loadHandoffNotes() {
  const grantId = route.params.id as string
  const stored = localStorage.getItem(`grantHandoffNotes_${grantId}`)
  if (stored) {
    handoffNotes.value = JSON.parse(stored)
  } else {
    // Migrate old notes
    const oldNotes = JSON.parse(localStorage.getItem('grantNotes') || '{}')
    const oldNote = oldNotes[grantId]
    if (oldNote) {
      handoffNotes.value = [{
        id: Date.now().toString(),
        text: oldNote,
        type: 'general',
        author: 'Me',
        createdAt: new Date().toISOString(),
        pinned: false
      }]
      saveHandoffNotes()
    }
  }
}

function saveHandoffNotes() {
  const grantId = route.params.id as string
  localStorage.setItem(`grantHandoffNotes_${grantId}`, JSON.stringify(handoffNotes.value))
}

function addHandoffNote() {
  if (!newNoteText.value.trim()) return
  handoffNotes.value.push({
    id: Date.now().toString(),
    text: newNoteText.value.trim(),
    type: newNoteType.value,
    author: 'Me',
    createdAt: new Date().toISOString(),
    pinned: false
  })
  newNoteText.value = ''
  newNoteType.value = 'general'
  saveHandoffNotes()
}

function deleteHandoffNote(id: string) {
  handoffNotes.value = handoffNotes.value.filter(n => n.id !== id)
  saveHandoffNotes()
}

function togglePinNote(id: string) {
  const note = handoffNotes.value.find(n => n.id === id)
  if (note) {
    note.pinned = !note.pinned
    saveHandoffNotes()
  }
}

const sortedNotes = computed(() => {
  return [...handoffNotes.value].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
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
const showDependencies = ref(true)
const newDepType = ref<GrantDependency['type']>('document')
const newDepTargetGrant = ref('')
const newDepLabel = ref('')

function loadAllDependencies() {
  try {
    grantDependencies.value = JSON.parse(localStorage.getItem('grantDependencies') || '[]')
  } catch { grantDependencies.value = [] }
}

function saveAllDependencies() {
  try {
    localStorage.setItem('grantDependencies', JSON.stringify(grantDependencies.value))
  } catch { /* storage full */ }
}

const currentGrantDeps = computed(() => {
  const grantId = route.params.id as string
  return grantDependencies.value.filter(d => d.fromGrantId === grantId)
})

const savedGrantsList = computed(() => {
  try {
    const savedIds: string[] = JSON.parse(localStorage.getItem('savedGrants') || '[]')
    const currentId = route.params.id as string
    // We return just the IDs with titles from the all grants cache or localStorage
    // Try to get grant titles from recently viewed
    const recent: Array<{id: string, title: string}> = JSON.parse(localStorage.getItem('recentlyViewedGrants') || '[]')
    const recentMap = new Map(recent.map(r => [r.id, r.title]))
    return savedIds
      .filter(id => id !== currentId)
      .map(id => ({ id, title: recentMap.get(id) || `Grant ${id.slice(0, 8)}...` }))
  } catch { return [] }
})

function addDependency(type: GrantDependency['type'], targetGrantId?: string, label?: string) {
  const grantId = route.params.id as string
  const dep: GrantDependency = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    fromGrantId: grantId,
    toGrantId: type === 'grant_completion' ? (targetGrantId || null) : null,
    prerequisiteLabel: type !== 'grant_completion' ? (label || '') : undefined,
    type,
    status: 'pending',
    notes: '',
    createdAt: new Date().toISOString()
  }
  grantDependencies.value.push(dep)
  saveAllDependencies()
  // Reset form
  newDepType.value = 'document'
  newDepTargetGrant.value = ''
  newDepLabel.value = ''
}

function removeDependency(depId: string) {
  grantDependencies.value = grantDependencies.value.filter(d => d.id !== depId)
  saveAllDependencies()
}

function toggleDepStatus(depId: string) {
  const dep = grantDependencies.value.find(d => d.id === depId)
  if (dep) {
    dep.status = dep.status === 'pending' ? 'met' : 'pending'
    saveAllDependencies()
  }
}

function getDepTargetGrantTitle(dep: GrantDependency): string {
  if (dep.type === 'grant_completion' && dep.toGrantId) {
    const recent: Array<{id: string, title: string}> = JSON.parse(localStorage.getItem('recentlyViewedGrants') || '[]')
    const found = recent.find(r => r.id === dep.toGrantId)
    return found?.title || `Grant ${dep.toGrantId.slice(0, 8)}...`
  }
  return dep.prerequisiteLabel || ''
}

function handleAddDependency() {
  if (newDepType.value === 'grant_completion') {
    if (!newDepTargetGrant.value) return
    addDependency('grant_completion', newDepTargetGrant.value)
  } else {
    if (!newDepLabel.value.trim()) return
    addDependency(newDepType.value, undefined, newDepLabel.value.trim())
  }
}

const pendingDepsCount = computed(() => currentGrantDeps.value.filter(d => d.status === 'pending').length)

// Budget planner
const showBudgetPlanner = ref(false)
const budgetRequested = ref(0)
const budgetFundingRate = ref(80)
const BUDGET_KEY = computed(() => `grantBudget_${route.params.id}`)
const budgetTotalProject = computed(() => budgetFundingRate.value > 0 ? Math.round(budgetRequested.value / (budgetFundingRate.value / 100)) : 0)
const budgetCoFinancing = computed(() => Math.max(0, budgetTotalProject.value - budgetRequested.value))

function loadBudgetPlan() {
  try {
    const data = JSON.parse(localStorage.getItem(BUDGET_KEY.value) || '{}')
    if (data.requested) budgetRequested.value = data.requested
    if (data.fundingRate) budgetFundingRate.value = data.fundingRate
  } catch { /* ignore */ }
}

function saveBudgetPlan() {
  try {
    localStorage.setItem(BUDGET_KEY.value, JSON.stringify({ requested: budgetRequested.value, fundingRate: budgetFundingRate.value }))
  } catch { /* storage full */ }
}

// Effort Estimator
const showEffortEstimator = ref(false)
const effortOverride = ref(0)

interface EffortPhases {
  research: number
  writing: number
  budgeting: number
  compliance: number
  review: number
}

interface EffortEstimate {
  total: number
  phases: EffortPhases
}

function calculateEffortEstimate(g: any): EffortEstimate {
  if (!g) return { total: 0, phases: { research: 0, writing: 0, budgeting: 0, compliance: 0, review: 0 } }

  // Base hours by budget size
  const maxAmount = g.amount_max || g.amount_min || 0
  let baseHours = 20
  if (maxAmount > 1000000) baseHours = 80
  else if (maxAmount > 500000) baseHours = 60
  else if (maxAmount > 200000) baseHours = 45
  else if (maxAmount > 50000) baseHours = 30

  // Modifier for funder type complexity
  const category = (g.category || '').toLowerCase()
  let funderMultiplier = 1.0
  if (category.includes('eu') || category.includes('european')) funderMultiplier = 1.4
  else if (category.includes('government') || category.includes('bilateral')) funderMultiplier = 1.2
  else if (category.includes('foundation') || category.includes('private')) funderMultiplier = 0.85

  // Modifier for co-financing
  const fundingRate = g.funding_rate || 100
  const coFinancingMultiplier = fundingRate < 80 ? 1.15 : 1.0

  // Modifier for requirements complexity (heuristic from description length)
  const descLength = (g.description || '').length
  let complexityMultiplier = 1.0
  if (descLength > 3000) complexityMultiplier = 1.2
  else if (descLength > 1500) complexityMultiplier = 1.1

  const total = Math.round(baseHours * funderMultiplier * coFinancingMultiplier * complexityMultiplier)

  // Phase distribution
  const phases: EffortPhases = {
    research: Math.round(total * 0.15),
    writing: Math.round(total * 0.35),
    budgeting: Math.round(total * 0.20),
    compliance: Math.round(total * 0.18),
    review: Math.round(total * 0.12),
  }

  // Adjust rounding to match total
  const phasesSum = phases.research + phases.writing + phases.budgeting + phases.compliance + phases.review
  if (phasesSum !== total) {
    phases.writing += (total - phasesSum)
  }

  return { total, phases }
}

const effortAutoEstimate = computed((): EffortEstimate => {
  return calculateEffortEstimate(grant.value)
})

const effortDisplayTotal = computed((): number => {
  return effortOverride.value > 0 ? effortOverride.value : effortAutoEstimate.value.total
})

function loadEffortEstimate() {
  try {
    const allEstimates = JSON.parse(localStorage.getItem('grantEffortEstimates') || '{}')
    const grantId = route.params.id as string
    if (allEstimates[grantId]?.override) {
      effortOverride.value = allEstimates[grantId].override
    }
  } catch { /* ignore */ }
}

function saveEffortEstimate() {
  try {
    const allEstimates = JSON.parse(localStorage.getItem('grantEffortEstimates') || '{}')
    const grantId = route.params.id as string
    allEstimates[grantId] = {
      total: effortDisplayTotal.value,
      phases: effortAutoEstimate.value.phases,
      override: effortOverride.value || null,
      grantTitle: grant.value?.title || '',
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('grantEffortEstimates', JSON.stringify(allEstimates))
    toast.success(t('grantDetail.effort.saved'))
  } catch { /* storage full */ }
}

// Preparation checklist
interface PrepItem { text: string; checked: boolean }
const prepItems = ref<PrepItem[]>([])
const newPrepItem = ref('')
const PREP_KEY = computed(() => `grantPrep_${route.params.id}`)

function loadPrepItems() {
  try {
    prepItems.value = JSON.parse(localStorage.getItem(PREP_KEY.value) || '[]')
  } catch { prepItems.value = [] }
}

function savePrepItems() {
  try {
    localStorage.setItem(PREP_KEY.value, JSON.stringify(prepItems.value))
  } catch { /* storage full */ }
}

function addPrepItem() {
  if (!newPrepItem.value.trim()) return
  prepItems.value.push({ text: newPrepItem.value.trim(), checked: false })
  newPrepItem.value = ''
  savePrepItems()
}

function togglePrepItem(index: number) {
  if (prepItems.value[index]) {
    prepItems.value[index]!.checked = !prepItems.value[index]!.checked
    savePrepItems()
  }
}

function removePrepItem(index: number) {
  prepItems.value.splice(index, 1)
  savePrepItems()
}

const prepCheckedCount = computed(() => prepItems.value.filter(i => i.checked).length)
const prepProgress = computed(() => prepItems.value.length === 0 ? 0 : Math.round((prepCheckedCount.value / prepItems.value.length) * 100))

// Requirement Checklist
interface RequirementItem {
  id: string
  text: string
  checked: boolean
  note: string
}

interface RequirementCategory {
  category: string
  labelKey: string
  items: RequirementItem[]
}

const requirementCategories = ref<RequirementCategory[]>([])
const requirementsLoading = ref(false)
const requirementsGenerated = ref(false)

function loadRequirements() {
  const grantId = route.params.id as string
  const stored = localStorage.getItem(`grantRequirements_${grantId}`)
  if (stored) {
    requirementCategories.value = JSON.parse(stored)
    requirementsGenerated.value = true
  }
}

function saveRequirements() {
  const grantId = route.params.id as string
  localStorage.setItem(`grantRequirements_${grantId}`, JSON.stringify(requirementCategories.value))
}

function toggleRequirement(catIdx: number, itemIdx: number) {
  const cat = requirementCategories.value[catIdx]
  if (cat && cat.items[itemIdx]) {
    cat.items[itemIdx]!.checked = !cat.items[itemIdx]!.checked
    saveRequirements()
  }
}

function updateRequirementNote(catIdx: number, itemIdx: number, note: string) {
  const cat = requirementCategories.value[catIdx]
  if (cat && cat.items[itemIdx]) {
    cat.items[itemIdx]!.note = note
    saveRequirements()
  }
}

const requirementsProgress = computed(() => {
  let checked = 0, total = 0
  requirementCategories.value.forEach(cat => {
    cat.items.forEach(item => {
      total++
      if (item.checked) checked++
    })
  })
  return { checked, total, pct: total > 0 ? Math.round(checked / total * 100) : 0 }
})

function generateRequirements() {
  requirementsLoading.value = true

  // Client-side heuristic extraction
  setTimeout(() => {
    const g = grant.value
    const desc = (g?.description || '').toLowerCase()
    const category = g?.category || ''

    const documents: RequirementItem[] = []
    const partners: RequirementItem[] = []
    const financial: RequirementItem[] = []
    const administrative: RequirementItem[] = []

    // Document requirements
    documents.push({ id: 'd1', text: 'Organization registration certificate', checked: false, note: '' })
    documents.push({ id: 'd2', text: 'Project proposal / concept note', checked: false, note: '' })

    if (desc.includes('annual report') || desc.includes('financial statement')) {
      documents.push({ id: 'd3', text: 'Annual report / financial statements', checked: false, note: '' })
    }
    if (desc.includes('audit') || (g?.amount_max && g.amount_max > 100000)) {
      documents.push({ id: 'd4', text: 'External audit report', checked: false, note: '' })
    }
    if (desc.includes('cv') || desc.includes('team') || desc.includes('staff')) {
      documents.push({ id: 'd5', text: 'Team CVs / key personnel qualifications', checked: false, note: '' })
    }
    if (desc.includes('budget') || desc.includes('financial plan')) {
      documents.push({ id: 'd6', text: 'Detailed budget breakdown', checked: false, note: '' })
    }
    documents.push({ id: 'd7', text: 'Logical framework / results matrix', checked: false, note: '' })

    // Partner requirements
    if (desc.includes('partner') || desc.includes('consortium') || desc.includes('collaboration')) {
      partners.push({ id: 'p1', text: 'Partnership agreement / MoU', checked: false, note: '' })
      partners.push({ id: 'p2', text: 'Partner organization profiles', checked: false, note: '' })
    }
    if (desc.includes('letter of support') || desc.includes('endorsement')) {
      partners.push({ id: 'p3', text: 'Letters of support from stakeholders', checked: false, note: '' })
    }
    if (desc.includes('local') || desc.includes('community')) {
      partners.push({ id: 'p4', text: 'Local community endorsement / needs assessment', checked: false, note: '' })
    }
    if (partners.length === 0) {
      partners.push({ id: 'p0', text: 'Check if partnership/consortium is required', checked: false, note: '' })
    }

    // Financial requirements
    if (g?.co_financing_rate && g.co_financing_rate > 0) {
      financial.push({ id: 'f1', text: `Co-financing proof (${g.co_financing_rate}% required)`, checked: false, note: '' })
    }
    financial.push({ id: 'f2', text: 'Bank account details / financial identification form', checked: false, note: '' })
    if (desc.includes('pre-financing') || desc.includes('advance payment')) {
      financial.push({ id: 'f3', text: 'Pre-financing guarantee (if required)', checked: false, note: '' })
    }
    financial.push({ id: 'f4', text: 'VAT status declaration', checked: false, note: '' })

    // Administrative requirements
    administrative.push({ id: 'a1', text: 'Legal entity registration in donor portal', checked: false, note: '' })
    if (desc.includes('eu') || desc.includes('european') || category.toLowerCase().includes('eu')) {
      administrative.push({ id: 'a2', text: 'PIC number (EU Participant Identification Code)', checked: false, note: '' })
      administrative.push({ id: 'a3', text: 'Legal Entity Form + supporting documents', checked: false, note: '' })
    }
    administrative.push({ id: 'a4', text: 'Declaration of honour / no conflict of interest', checked: false, note: '' })
    if (desc.includes('anti-terror') || desc.includes('sanctions') || desc.includes('compliance')) {
      administrative.push({ id: 'a5', text: 'Anti-terrorism / sanctions compliance declaration', checked: false, note: '' })
    }
    administrative.push({ id: 'a6', text: 'GDPR / data protection policy', checked: false, note: '' })

    requirementCategories.value = [
      { category: 'documents', labelKey: 'grantDetail.requirements.categories.documents', items: documents },
      { category: 'partners', labelKey: 'grantDetail.requirements.categories.partners', items: partners },
      { category: 'financial', labelKey: 'grantDetail.requirements.categories.financial', items: financial },
      { category: 'administrative', labelKey: 'grantDetail.requirements.categories.administrative', items: administrative }
    ]

    requirementsGenerated.value = true
    requirementsLoading.value = false
    saveRequirements()
  }, 1500) // Simulate analysis time
}

function exportRequirementsChecklist() {
  let text = 'APPLICATION REQUIREMENTS CHECKLIST\n'
  text += '='.repeat(40) + '\n\n'
  requirementCategories.value.forEach(cat => {
    text += `## ${t(cat.labelKey)}\n`
    cat.items.forEach(item => {
      text += `${item.checked ? '[x]' : '[ ]'} ${item.text}`
      if (item.note) text += ` — ${item.note}`
      text += '\n'
    })
    text += '\n'
  })
  text += `Progress: ${requirementsProgress.value.checked}/${requirementsProgress.value.total} (${requirementsProgress.value.pct}%)`
  navigator.clipboard.writeText(text)
}

const descriptionEl = ref<HTMLElement | null>(null)

// Computed properties
const eligibleCountries = computed(() => {
  if (!grant.value?.eligible_countries) return []
  try {
    const parsed = JSON.parse(grant.value.eligible_countries)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
})

const organizationTypes = computed(() => {
  if (!grant.value?.organization_types) return []
  try {
    const parsed = JSON.parse(grant.value.organization_types)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
})

const topics = computed(() => {
  if (!grant.value?.topics) return []
  try {
    const parsed = JSON.parse(grant.value.topics)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
})

const statusBadgeClass = computed(() => {
  const status = grant.value?.status?.toLowerCase()
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800'
    case 'upcoming':
      return 'bg-blue-100 text-blue-800'
    case 'closed':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-green-100 text-green-800'
  }
})

const deadlineColor = computed(() => {
  if (!grant.value?.deadline) return 'text-gray-700'
  const date = new Date(grant.value.deadline)
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-gray-500'
  if (diffDays <= 7) return 'text-red-600 font-bold'
  if (diffDays <= 14) return 'text-orange-600 font-medium'
  return 'text-gray-700'
})

const daysUntilDeadline = computed(() => {
  if (!grant.value?.deadline) return 0
  const date = new Date(grant.value.deadline)
  const now = new Date()
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
})

const checklistProgress = computed(() => {
  let done = 0
  if (isSaved.value) done++
  if (isReminderSet.value) done++
  if (eligibilityResult.value) done++
  if (grantProposal.value) done++
  return Math.round((done / 4) * 100)
})

// Methods
function formatAmount(min: number | null, max: number | null, currency: string = 'EUR') {
  const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency
  if (min && max) {
    return `${symbol}${(min / 1000).toFixed(0)}k - ${symbol}${(max / 1000).toFixed(0)}k`
  } else if (min) {
    return `${symbol}${(min / 1000).toFixed(0)}k+`
  } else if (max) {
    return `${t('grantDetail.upTo')} ${symbol}${(max / 1000).toFixed(0)}k`
  }
  return t('grantDetail.amountNotSpecified')
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const formatted = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

  if (diffDays < 0) return `${formatted} (${t('grantDetail.closed')})`
  if (diffDays === 0) return `${formatted}, 23:59 UTC (${t('grantDetail.today')})`
  if (diffDays === 1) return `${formatted}, 23:59 UTC (${t('grantDetail.tomorrow')})`
  if (diffDays <= 7) return `${formatted}, 23:59 UTC (${t('grantDetail.daysLeft', { count: diffDays })})`
  if (diffDays <= 30) return `${formatted}, 23:59 UTC (${t('grantDetail.weeksLeft', { count: Math.ceil(diffDays / 7) })})`

  return `${formatted} · UTC`
}

function toggleSave() {
  isSaved.value = !isSaved.value
  const saved = JSON.parse(localStorage.getItem('savedGrants') || '[]')
  if (isSaved.value) {
    saved.push(grant.value.id)
    toast.success(t('grantDetail.saved'))
  } else {
    const index = saved.indexOf(grant.value.id)
    if (index > -1) saved.splice(index, 1)
    toast.info(t('grantDetail.removedFromSaved'))
  }
  localStorage.setItem('savedGrants', JSON.stringify(saved))
}

async function shareGrant() {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: grant.value?.title, url })
    } catch { /* user cancelled */ }
  } else {
    await navigator.clipboard.writeText(url)
    linkCopied.value = true
    toast.success(t('grantDetail.linkCopied'))
    setTimeout(() => { linkCopied.value = false }, 2000)
  }
}

function checkDescriptionHeight() {
  nextTick(() => {
    if (descriptionEl.value) {
      descNeedsExpand.value = descriptionEl.value.scrollHeight > 200
    }
  })
}

function trackRecentlyViewed(id: string, title: string) {
  try {
    const key = 'recentlyViewedGrants'
    const existing: Array<{id: string, title: string, ts: number}> = JSON.parse(localStorage.getItem(key) || '[]')
    const filtered = existing.filter(g => g.id !== id)
    filtered.unshift({ id, title, ts: Date.now() })
    localStorage.setItem(key, JSON.stringify(filtered.slice(0, 10)))
  } catch { /* ignore */ }
}

// Eligibility check
const eligibilityBgClass = computed(() => {
  if (!eligibilityResult.value) return ''
  if (eligibilityResult.value.score >= 0.7) return 'bg-green-50'
  if (eligibilityResult.value.score >= 0.4) return 'bg-amber-50'
  return 'bg-red-50'
})

const eligibilityIconClass = computed(() => {
  if (!eligibilityResult.value) return ''
  if (eligibilityResult.value.score >= 0.7) return 'bg-green-100 text-green-600'
  if (eligibilityResult.value.score >= 0.4) return 'bg-amber-100 text-amber-600'
  return 'bg-red-100 text-red-600'
})

async function runEligibilityCheck() {
  checkingEligibility.value = true
  try {
    // Load CSO profiles
    const csoResponse = await api.get('/api/cso', { params: { user_id: authStore.userId } })
    let profiles = csoResponse.data.profiles || csoResponse.data.csos || []
    if (authStore.userId && profiles.length > 0 && profiles[0].owner_id) {
      profiles = profiles.filter((p: any) => p.owner_id === authStore.userId)
    }

    if (profiles.length === 0) {
      eligibilityResult.value = {
        score: 0,
        label: t('grantDetail.eligibilityResults.noProfile'),
        summary: t('grantDetail.eligibilityResults.noProfileDesc'),
        checks: []
      }
      return
    }

    const cso = profiles[0]
    const checks: Array<{pass: boolean, message: string}> = []
    let passed = 0

    // Check country
    const countries = eligibleCountries.value.map((c: string) => c.toUpperCase())
    const csoCountry = (cso.registration_country || cso.headquarters_country || '').toUpperCase()
    if (countries.length === 0 || countries.includes(csoCountry)) {
      checks.push({ pass: true, message: t('grantDetail.eligibilityResults.countryMatch') })
      passed++
    } else {
      checks.push({ pass: false, message: t('grantDetail.eligibilityResults.countryMismatch', { country: csoCountry }) })
    }

    // Check org type
    const grantOrgTypes = organizationTypes.value.map((t: string) => t.toLowerCase())
    const csoType = (cso.org_type || '').toLowerCase()
    if (grantOrgTypes.length === 0 || grantOrgTypes.some((t: string) => csoType.includes(t) || t.includes(csoType))) {
      checks.push({ pass: true, message: t('grantDetail.eligibilityResults.orgTypeMatch') })
      passed++
    } else {
      checks.push({ pass: false, message: t('grantDetail.eligibilityResults.orgTypeMismatch', { type: cso.org_type }) })
    }

    // Check budget range
    const grantMin = grant.value?.amount_min || 0
    const grantMax = grant.value?.amount_max || Infinity
    const csoBudget = cso.annual_budget_eur || 0
    if (csoBudget === 0 || (csoBudget >= grantMin * 0.1 && csoBudget <= grantMax * 10)) {
      checks.push({ pass: true, message: t('grantDetail.eligibilityResults.budgetOk') })
      passed++
    } else {
      checks.push({ pass: false, message: t('grantDetail.eligibilityResults.budgetMismatch') })
    }

    const score = checks.length > 0 ? passed / checks.length : 0
    let label: string, summary: string
    if (score >= 0.7) {
      label = t('grantDetail.eligibilityResults.likelyEligible')
      summary = t('grantDetail.eligibilityResults.likelyEligibleDesc')
    } else if (score >= 0.4) {
      label = t('grantDetail.eligibilityResults.possiblyEligible')
      summary = t('grantDetail.eligibilityResults.possiblyEligibleDesc')
    } else {
      label = t('grantDetail.eligibilityResults.likelyIneligible')
      summary = t('grantDetail.eligibilityResults.likelyIneligibleDesc')
    }

    eligibilityResult.value = { score, label, summary, checks }
  } catch {
    toast.error(t('errors.network'))
  } finally {
    checkingEligibility.value = false
  }
}

async function copyToClipboard(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(t('grantDetail.copiedToClipboard', { section: label }))
  } catch {
    toast.error(t('errors.generic'))
  }
}

function toggleReminder() {
  const grantId = route.params.id as string
  const reminders = JSON.parse(localStorage.getItem('grantReminders') || '[]')
  const idx = reminders.findIndex((r: any) => r.grantId === grantId)
  if (idx > -1) {
    reminders.splice(idx, 1)
    isReminderSet.value = false
    toast.info(t('grantDetail.reminderRemoved'))
  } else {
    reminders.push({
      grantId,
      title: grant.value.title,
      deadline: grant.value.deadline,
      createdAt: new Date().toISOString()
    })
    isReminderSet.value = true
    toast.success(t('grantDetail.reminderAdded'))
  }
  localStorage.setItem('grantReminders', JSON.stringify(reminders))
}

function printGrantDetails() {
  window.print()
}

function startApplication() {
  router.push({ 
    name: 'proposal-wizard', 
    query: { grantId: grant.value.id } 
  })
}

async function loadSimilarGrants() {
  if (!grant.value) return
  similarLoading.value = true
  try {
    const g = grant.value
    const allGrants = (await api.get('/api/grants')).data?.grants || []
    const currentId = String(g.id)

    // Score grants by similarity (category match, funder match, amount range overlap)
    const scored = allGrants
      .filter((other: any) => String(other.id) !== currentId)
      .map((other: any) => {
        let score = 0
        // Category match
        if (other.category && g.category && other.category === g.category) score += 3
        // Funder match
        if (other.funder_name && g.funder_name && other.funder_name === g.funder_name) score += 2
        // Topic/keyword overlap
        const gWords = new Set((g.description || '').toLowerCase().split(/\s+/).filter((w: string) => w.length > 5))
        const oWords = (other.description || '').toLowerCase().split(/\s+/).filter((w: string) => w.length > 5)
        const overlap = oWords.filter((w: string) => gWords.has(w)).length
        score += Math.min(overlap / 10, 2) // max 2 points for keyword overlap
        // Amount range proximity
        if (g.amount_max && other.amount_max) {
          const ratio = Math.min(g.amount_max, other.amount_max) / Math.max(g.amount_max, other.amount_max)
          score += ratio // 0-1 points
        }
        return { ...other, _similarity: score }
      })
      .filter((g: any) => g._similarity > 1)
      .sort((a: any, b: any) => b._similarity - a._similarity)
      .slice(0, 4)

    similarGrants.value = scored
  } catch { /* non-critical */ }
  similarLoading.value = false
}

async function fetchGrantDetails() {
  loading.value = true
  try {
    const grantId = route.params.id as string

    // Fetch grant details
    const response = await api.get(`/api/grants/${grantId}`)
    grant.value = response.data.grant
    checkDescriptionHeight()
    trackRecentlyViewed(grantId, grant.value.title)

    // Check if saved
    const saved = JSON.parse(localStorage.getItem('savedGrants') || '[]')
    isSaved.value = saved.includes(grantId)

    // Check if reminder is set
    const reminders = JSON.parse(localStorage.getItem('grantReminders') || '[]')
    isReminderSet.value = reminders.some((r: any) => r.grantId === grantId)

    // Load handoff notes, prep checklist, budget plan, requirements, dependencies, and readiness
    loadHandoffNotes()
    loadPrepItems()
    loadBudgetPlan()
    loadEffortEstimate()
    loadRequirements()
    loadAllDependencies()
    loadReadiness()
    // Pre-fill budget from grant data
    if (!budgetRequested.value && grant.value) {
      budgetRequested.value = grant.value.amount_max || grant.value.amount_min || 0
      if (grant.value.funding_rate) budgetFundingRate.value = grant.value.funding_rate
    }

    // Check for existing proposals for this grant
    if (authStore.isAuthenticated) {
      try {
        const proposalResponse = await api.get('/api/proposals')
        const proposals = proposalResponse.data.proposals || []
        grantProposal.value = proposals.find((p: any) => p.grant_id === grantId) || null
      } catch { /* ignore - proposals not critical */ }
    }

    // Fetch similar grants and funder intelligence (non-blocking)
    loadSimilarGrants()
    loadFunderIntelligence()

  } catch (error) {
    console.error('Error fetching grant details:', error)
    grant.value = null
    toast.error(t('errors.network'))
  } finally {
    loading.value = false
  }
}

// ===== Contextual Grant Annotation Layer =====
interface GrantAnnotation {
  id: string; grantId: string; selectedText: string; color: 'yellow' | 'green' | 'red' | 'blue'
  note: string; textOffset: number; textLength: number; sectionId: string; createdAt: string; anchorHash: string
}
const annotations = ref<GrantAnnotation[]>([])
const showAnnotationsSidebar = ref(false)
const showAnnotationToolbar = ref(false)
const selectedText = ref('')
const selectionRange = ref<Range | null>(null)
const annotationToolbarPos = ref({ x: 0, y: 0 })
const annotationToolbarEl = ref<HTMLElement | null>(null)
const annotatableContentEl = ref<HTMLElement | null>(null)
const editingAnnotationId = ref<string | null>(null)
const editingAnnotationNote = ref('')
const annotationColors = [
  { id: 'yellow' as const, i18nKey: 'keyRequirement', dotClass: 'bg-yellow-400' },
  { id: 'green' as const, i18nKey: 'weMeetThis', dotClass: 'bg-green-400' },
  { id: 'red' as const, i18nKey: 'gapRisk', dotClass: 'bg-red-400' },
  { id: 'blue' as const, i18nKey: 'question', dotClass: 'bg-blue-400' },
]
const ANNOTATION_STORAGE_KEY = computed(() => `grantAnnotations_${route.params.id}`)

function loadAnnotations() {
  try { annotations.value = JSON.parse(localStorage.getItem(ANNOTATION_STORAGE_KEY.value) || '[]') }
  catch { annotations.value = [] }
}

function saveAnnotations() {
  try { localStorage.setItem(ANNOTATION_STORAGE_KEY.value, JSON.stringify(annotations.value)) }
  catch { /* storage full */ }
}

function handleTextSelection() {
  const selection = window.getSelection()
  if (!selection || selection.isCollapsed || !selection.toString().trim()) {
    setTimeout(() => {
      if (!annotationToolbarEl.value?.matches(':hover')) {
        showAnnotationToolbar.value = false
        selectedText.value = ''
        selectionRange.value = null
      }
    }, 200)
    return
  }
  const text = selection.toString().trim()
  if (text.length < 3) return
  const range = selection.getRangeAt(0)
  if (!annotatableContentEl.value?.contains(range.commonAncestorContainer)) return
  selectedText.value = text
  selectionRange.value = range.cloneRange()
  const rect = range.getBoundingClientRect()
  const tw = 400
  let x = rect.left + (rect.width / 2) - (tw / 2)
  x = Math.max(10, Math.min(x, window.innerWidth - tw - 10))
  annotationToolbarPos.value = { x, y: rect.top - 50 }
  showAnnotationToolbar.value = true
}

function createAnnotation(color: GrantAnnotation['color']) {
  if (!selectedText.value || !selectionRange.value) return
  const grantId = route.params.id as string
  const id = Date.now().toString() + Math.random().toString(36).slice(2, 6)
  const fullText = annotatableContentEl.value?.textContent || ''
  const textOffset = fullText.indexOf(selectedText.value)
  const annotation: GrantAnnotation = {
    id, grantId, selectedText: selectedText.value, color, note: '',
    textOffset: textOffset >= 0 ? textOffset : 0, textLength: selectedText.value.length,
    sectionId: 'content', createdAt: new Date().toISOString(), anchorHash: `ann-${id}`
  }
  annotations.value.push(annotation)
  saveAnnotations()
  applyHighlight(annotation, selectionRange.value)
  window.getSelection()?.removeAllRanges()
  showAnnotationToolbar.value = false
  selectedText.value = ''
  selectionRange.value = null
}

function applyHighlight(annotation: GrantAnnotation, range: Range) {
  const makeClick = () => () => {
    showAnnotationsSidebar.value = true
    nextTick(() => {
      document.getElementById(`annotation-card-${annotation.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
  try {
    const mark = document.createElement('mark')
    mark.id = `ann-mark-${annotation.id}`
    mark.dataset.annotationId = annotation.id
    mark.dataset.annotationColor = annotation.color
    mark.className = getHighlightClass(annotation.color)
    mark.style.cursor = 'pointer'
    mark.title = annotation.note || t(`grantDetail.annotations.colors.${annotationColors.find(c => c.id === annotation.color)?.i18nKey || 'keyRequirement'}`)
    mark.addEventListener('click', makeClick())
    range.surroundContents(mark)
  } catch {
    try {
      const f = range.extractContents()
      const mark = document.createElement('mark')
      mark.id = `ann-mark-${annotation.id}`
      mark.dataset.annotationId = annotation.id
      mark.className = getHighlightClass(annotation.color)
      mark.style.cursor = 'pointer'
      mark.appendChild(f)
      mark.addEventListener('click', makeClick())
      range.insertNode(mark)
    } catch { /* stored even if DOM fails */ }
  }
}

function getHighlightClass(color: string): string {
  const m: Record<string, string> = {
    yellow: 'bg-yellow-200/50 rounded px-0.5 transition-colors hover:bg-yellow-200/80',
    green: 'bg-green-200/50 rounded px-0.5 transition-colors hover:bg-green-200/80',
    red: 'bg-red-200/50 rounded px-0.5 transition-colors hover:bg-red-200/80',
    blue: 'bg-blue-200/50 rounded px-0.5 transition-colors hover:bg-blue-200/80'
  }
  return m[color] || m['yellow']!
}

function restoreHighlights() {
  if (!annotatableContentEl.value) return
  for (const ann of annotations.value) {
    const walker = document.createTreeWalker(annotatableContentEl.value, NodeFilter.SHOW_TEXT, null)
    let node: Text | null
    while (node = walker.nextNode() as Text | null) {
      const idx = node.textContent?.indexOf(ann.selectedText) ?? -1
      if (idx >= 0) {
        try {
          const r = document.createRange()
          r.setStart(node, idx)
          r.setEnd(node, idx + ann.selectedText.length)
          applyHighlight(ann, r)
        } catch { /* skip */ }
        break
      }
    }
  }
}

function deleteAnnotation(id: string) {
  const mark = document.getElementById(`ann-mark-${id}`)
  if (mark) {
    const p = mark.parentNode
    while (mark.firstChild) { p?.insertBefore(mark.firstChild, mark) }
    p?.removeChild(mark)
    p?.normalize()
  }
  annotations.value = annotations.value.filter(a => a.id !== id)
  saveAnnotations()
}

function startEditAnnotationNote(annotation: GrantAnnotation) {
  editingAnnotationId.value = annotation.id
  editingAnnotationNote.value = annotation.note
}

function updateAnnotationNote(id: string, note: string) {
  const ann = annotations.value.find(a => a.id === id)
  if (ann) {
    ann.note = note.trim()
    saveAnnotations()
    const mark = document.getElementById(`ann-mark-${id}`)
    if (mark) mark.title = note.trim() || t(`grantDetail.annotations.colors.${annotationColors.find(c => c.id === ann.color)?.i18nKey || 'keyRequirement'}`)
  }
  editingAnnotationId.value = null
  editingAnnotationNote.value = ''
}

function createTaskFromAnnotation(annotation: GrantAnnotation) {
  const grantId = route.params.id as string
  const grantTitle = grant.value?.title || 'Grant'
  try {
    const cards: any[] = JSON.parse(localStorage.getItem('workspaceCards') || '[]')
    const labels: Record<string, string> = {
      yellow: t('grantDetail.annotations.colors.keyRequirement'),
      green: t('grantDetail.annotations.colors.weMeetThis'),
      red: t('grantDetail.annotations.colors.gapRisk'),
      blue: t('grantDetail.annotations.colors.question')
    }
    cards.push({
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      text: `[${labels[annotation.color]}] "${annotation.selectedText.substring(0, 100)}${annotation.selectedText.length > 100 ? '...' : ''}"${annotation.note ? ` — ${annotation.note}` : ''}`,
      grantId, grantTitle, column: 'todo',
      urgency: annotation.color === 'red' ? 'high' : 'medium',
      assignee: '', dueDate: null, createdAt: new Date().toISOString(), resolved: false
    })
    localStorage.setItem('workspaceCards', JSON.stringify(cards))
    toast.success(t('grantDetail.annotations.sidebar.createdTask'))
  } catch { toast.error(t('errors.generic')) }
}

function scrollToAnnotation(id: string) {
  const mark = document.getElementById(`ann-mark-${id}`)
  if (mark) {
    mark.scrollIntoView({ behavior: 'smooth', block: 'center' })
    mark.style.transition = 'outline 0.3s ease'
    mark.style.outline = '2px solid #f59e0b'
    mark.style.outlineOffset = '2px'
    setTimeout(() => { mark.style.outline = 'none' }, 1500)
  }
}

function getAnnotationColorDot(color: string): string {
  return annotationColors.find(c => c.id === color)?.dotClass || 'bg-yellow-400'
}

function getAnnotationGroupLabel(color: string): string {
  const labels: Record<string, string> = {
    yellow: t('grantDetail.annotations.sidebar.groupYellow'),
    green: t('grantDetail.annotations.sidebar.groupGreen'),
    red: t('grantDetail.annotations.sidebar.groupRed'),
    blue: t('grantDetail.annotations.sidebar.groupBlue')
  }
  return labels[color] || color
}

function getAnnotationCardClass(color: string): string {
  const m: Record<string, string> = {
    yellow: 'border-l-4 border-l-yellow-400 border-yellow-200 bg-yellow-50/30',
    green: 'border-l-4 border-l-green-400 border-green-200 bg-green-50/30',
    red: 'border-l-4 border-l-red-400 border-red-200 bg-red-50/30',
    blue: 'border-l-4 border-l-blue-400 border-blue-200 bg-blue-50/30'
  }
  return m[color] || 'border-l-4 border-l-yellow-400 border-stone-200'
}

const annotationGroups = computed(() => {
  const order: GrantAnnotation['color'][] = ['yellow', 'green', 'red', 'blue']
  return order.map(color => ({ color, items: annotations.value.filter(a => a.color === color) })).filter(g => g.items.length > 0)
})

function checkDeepLinkAnchor() {
  const hash = window.location.hash
  if (hash?.startsWith('#ann-')) {
    const id = hash.replace('#ann-', '')
    nextTick(() => { setTimeout(() => { scrollToAnnotation(id); showAnnotationsSidebar.value = true }, 500) })
  }
}

function handleDocumentClick(e: MouseEvent) {
  if (annotationToolbarEl.value && !annotationToolbarEl.value.contains(e.target as Node)) {
    showAnnotationToolbar.value = false
  }
}

onBeforeUnmount(() => { document.removeEventListener('mousedown', handleDocumentClick) })


onMounted(() => {
  fetchGrantDetails()
  document.addEventListener('mousedown', handleDocumentClick)
})

watch(loading, (newVal) => {
  if (!newVal && grant.value) {
    nextTick(() => {
      loadAnnotations()
      nextTick(() => {
        restoreHighlights()
        checkDeepLinkAnchor()
      })
    })
  }
})
</script>
