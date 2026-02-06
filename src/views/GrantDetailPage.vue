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
            <h1 class="text-4xl font-bold text-gray-900 mb-2">
              {{ grant.title }}
            </h1>
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

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Grant Details -->
        <div class="lg:col-span-2 space-y-6">
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

          <!-- Similar Grants -->
          <div v-if="similarGrants.length > 0" class="card">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('grantDetail.similarGrants') }}</h2>
            <div class="space-y-3">
              <router-link
                v-for="similar in similarGrants"
                :key="similar.id"
                :to="`/grants/${similar.id}`"
                class="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-gray-50 transition-colors"
              >
                <h3 class="font-medium text-gray-900 mb-1">{{ similar.title }}</h3>
                <p class="text-sm text-gray-600 line-clamp-2">{{ similar.description }}</p>
                <div v-if="similar.amount_min || similar.amount_max" class="text-sm text-primary-600 font-medium mt-2">
                  {{ formatAmount(similar.amount_min, similar.amount_max, similar.currency) }}
                </div>
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

      <!-- Personal Notes -->
      <div class="card mt-6">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-navy-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            {{ $t('grantDetail.notes') }}
          </h2>
          <span v-if="noteLastSaved" class="text-xs text-navy-400">{{ noteLastSaved }}</span>
        </div>
        <textarea
          v-model="grantNote"
          @input="debounceSaveNote"
          :placeholder="$t('grantDetail.notesPlaceholder')"
          class="input w-full min-h-[100px] text-sm resize-y"
          rows="4"
        ></textarea>
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
    <ScrollToTop />
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
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

const pageTitle = computed(() => grant.value?.title || t('nav.grants'))
usePageTitle(pageTitle)

const loading = ref(true)
const grant = ref<any>(null)
const similarGrants = ref<any[]>([])
const aiSummary = ref('')
const isSaved = ref(false)
const linkCopied = ref(false)
const grantProposal = ref<any>(null)
const eligibilityResult = ref<any>(null)
const checkingEligibility = ref(false)
const descExpanded = ref(false)
const descNeedsExpand = ref(false)
const isReminderSet = ref(false)

// Grant notes
const grantNote = ref('')
const noteLastSaved = ref('')
let noteSaveTimeout: ReturnType<typeof setTimeout> | null = null

function loadNote(grantId: string) {
  try {
    const notes = JSON.parse(localStorage.getItem('grantNotes') || '{}')
    grantNote.value = notes[grantId] || ''
  } catch { grantNote.value = '' }
}

function saveNote() {
  const id = route.params.id as string
  try {
    const notes = JSON.parse(localStorage.getItem('grantNotes') || '{}')
    if (grantNote.value.trim()) {
      notes[id] = grantNote.value
    } else {
      delete notes[id]
    }
    localStorage.setItem('grantNotes', JSON.stringify(notes))
    noteLastSaved.value = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch { /* storage full */ }
}

function debounceSaveNote() {
  if (noteSaveTimeout) clearTimeout(noteSaveTimeout)
  noteSaveTimeout = setTimeout(saveNote, 1000)
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

    // Load notes
    loadNote(grantId)

    // Check for existing proposals for this grant
    if (authStore.isAuthenticated) {
      try {
        const proposalResponse = await api.get('/api/proposals')
        const proposals = proposalResponse.data.proposals || []
        grantProposal.value = proposals.find((p: any) => p.grant_id === grantId) || null
      } catch { /* ignore - proposals not critical */ }
    }

    // Fetch similar grants
    try {
      const similarResponse = await api.get(`/api/grants/${grantId}/similar?limit=3`)
      similarGrants.value = similarResponse.data.similarGrants || []
    } catch (error) {
      console.error('Error fetching similar grants:', error)
    }

  } catch (error) {
    console.error('Error fetching grant details:', error)
    grant.value = null
    toast.error(t('errors.network'))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGrantDetails()
})
</script>
