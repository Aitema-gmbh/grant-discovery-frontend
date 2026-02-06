<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <!-- Draft Restore Banner -->
      <div v-if="showDraftBanner" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="text-sm text-navy-700">{{ $t('proposalWizard.draftFound') }}</p>
        </div>
        <div class="flex gap-2">
          <button @click="restoreDraft" class="btn btn-sm btn-primary">{{ $t('proposalWizard.restoreDraft') }}</button>
          <button @click="discardDraft" class="btn btn-sm btn-outline">{{ $t('proposalWizard.discardDraft') }}</button>
        </div>
      </div>

      <!-- Offline Banner -->
      <div v-if="isOffline" class="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 animate-fade-in">
        <div class="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-2.828 2.828a1 1 0 010 1.414"/>
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium text-amber-800">{{ $t('proposalWizard.offline') }}</p>
          <p class="text-xs text-amber-600">{{ $t('proposalWizard.offlineDesc') }}</p>
        </div>
      </div>

      <!-- Header with Progress -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('proposalWizard.title') }}</h1>
        <p class="text-gray-600 mb-6">{{ grantTitle }}</p>

        <!-- Sync status indicator -->
        <div class="flex items-center gap-2 mb-2">
          <button @click="showSnippetLibrary = !showSnippetLibrary"
            class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-colors"
            :class="showSnippetLibrary ? 'bg-[#1e3a5f] text-white' : 'text-[#1e3a5f] border border-stone-200 hover:bg-stone-50'">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            {{ showSnippetLibrary ? t('proposalWizard.snippets.hideLibrary') : t('proposalWizard.snippets.snippetLibrary') }}
            <span v-if="snippets.length > 0" class="px-1.5 py-0.5 rounded-full text-[10px] font-bold" :class="showSnippetLibrary ? 'bg-white/20' : 'bg-[#d4a843]/20 text-[#d4a843]'">{{ snippets.length }}</span>
          </button>
          <button @click="shareProposal" class="p-2 text-navy-400 hover:text-amber-500 transition-colors rounded-lg hover:bg-amber-50" :title="$t('proposalWizard.shareProposal')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>
          <div v-if="isSaving" class="flex items-center gap-1.5 text-xs text-navy-400">
            <svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ $t('proposalWizard.saving') }}
          </div>
          <div v-else-if="lastSavedAt" class="flex items-center gap-1.5 text-xs" :class="isOffline ? 'text-amber-500' : 'text-sage-600'">
            <svg v-if="!isOffline" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
            </svg>
            {{ isOffline ? $t('proposalWizard.savedLocally', { time: lastSavedAt }) : $t('proposalWizard.autoSaved', { time: lastSavedAt }) }}
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center gap-4">
          <div v-for="(stepName, index) in steps" :key="index" class="flex items-center">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep > index ? 'bg-primary-600 text-white' :
                currentStep === index ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600' :
                'bg-gray-200 text-gray-600'
              ]"
            >
              <svg v-if="currentStep > index" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              :class="['ml-2 text-sm font-medium', currentStep >= index ? 'text-gray-900' : 'text-gray-500']"
            >
              {{ stepName }}
            </span>
            <svg v-if="index < steps.length - 1" class="w-5 h-5 mx-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Step 1: Select CSO -->
      <div v-if="currentStep === 0" class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('proposalWizard.step1.title') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('proposalWizard.step1.subtitle') }}</p>

        <div v-if="profilePreFilled" class="flex items-center gap-2 mb-4 px-3 py-2 bg-sage-50 border border-sage-200 rounded-lg text-xs text-sage-700">
          <svg class="w-4 h-4 text-sage-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ $t('proposalWizard.prefilledFromProfile') }}
        </div>

        <div v-if="loadingCsos" class="animate-pulse space-y-3">
          <div class="h-20 bg-gray-200 rounded-lg"></div>
          <div class="h-20 bg-gray-200 rounded-lg"></div>
        </div>

        <div v-else-if="csos.length === 0" class="text-center py-8">
          <p class="text-gray-600 mb-4">{{ $t('proposalWizard.step1.noCSOProfiles') }}</p>
          <router-link to="/cso/create" class="btn btn-primary">{{ $t('proposalWizard.step1.createCSOProfile') }}</router-link>
        </div>

        <div v-else class="space-y-3">
          <label
            v-for="cso in csos"
            :key="cso.id"
            :class="[
              'block p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedCsoId === cso.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="radio"
              :value="cso.id"
              v-model="selectedCsoId"
              class="sr-only"
              :aria-label="cso.name"
            />
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ cso.name }}</h3>
                <p class="text-sm text-gray-600">{{ cso.org_type }} - {{ cso.headquarters_country }}</p>
              </div>
              <div v-if="selectedCsoId === cso.id" class="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </label>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="nextStep"
            :disabled="!selectedCsoId"
            class="btn btn-primary"
          >
            {{ $t('proposalWizard.step1.continue') }}
          </button>
        </div>
      </div>

      <!-- Step 2: Select Sections -->
      <div v-if="currentStep === 1" class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('proposalWizard.step2.title') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('proposalWizard.step2.subtitle') }}</p>

        <div class="space-y-3">
          <label
            v-for="section in availableSections"
            :key="section.type"
            :class="[
              'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedSections.includes(section.type) ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="checkbox"
              :value="section.type"
              v-model="selectedSections"
              class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              :aria-label="section.label"
            />
            <div class="ml-4 flex-1">
              <h3 class="font-medium text-gray-900">{{ section.label }}</h3>
              <p class="text-sm text-gray-600">{{ section.description }}</p>
            </div>
            <span
              v-if="section.recommended"
              class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded"
            >
              {{ $t('proposalWizard.step2.recommended') }}
            </span>
          </label>
        </div>

        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="btn btn-outline">{{ $t('proposalWizard.step2.back') }}</button>
          <button
            @click="startGeneration"
            :disabled="selectedSections.length === 0"
            class="btn btn-primary"
          >
            {{ $t('proposalWizard.step2.generateSections', { count: selectedSections.length }) }}
          </button>
        </div>
      </div>

      <!-- Step 3: Generation -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('proposalWizard.step3.title') }}</h2>
          <p class="text-gray-600 mb-6">
            {{ $t('proposalWizard.step3.subtitle') }}
          </p>

          <!-- Overall Progress -->
          <div class="mb-6">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-600">{{ $t('proposalWizard.step3.overallProgress') }}</span>
              <span class="font-medium">{{ completedSections.length }} / {{ selectedSections.length }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="completedSections.length" :aria-valuemax="selectedSections.length" aria-valuemin="0" :aria-label="$t('proposalWizard.step3.overallProgress')">
              <div
                class="h-full bg-primary-600 transition-all duration-500"
                :style="{ width: `${(completedSections.length / selectedSections.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Snippet Library Panel -->
        <div v-if="showSnippetLibrary" class="card border-[#1e3a5f]/20 bg-stone-50 animate-fade-in">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-semibold text-[#1e3a5f] flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              {{ t('proposalWizard.snippets.snippetLibrary') }}
            </h3>
            <span class="text-[10px] text-stone-400">{{ t('proposalWizard.snippets.matchingSnippets') }}</span>
          </div>

          <div v-if="filteredSnippets.length === 0" class="text-center py-6">
            <svg class="w-8 h-8 text-stone-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <p class="text-xs text-stone-500">{{ t('proposalWizard.snippets.noSnippets') }}</p>
            <p class="text-[10px] text-stone-400 mt-1">{{ t('proposalWizard.snippets.noSnippetsDesc') }}</p>
          </div>

          <div v-else class="space-y-2 max-h-64 overflow-y-auto">
            <div v-for="snippet in filteredSnippets" :key="snippet.id"
              class="p-3 bg-white rounded-lg border border-stone-200 hover:border-[#d4a843]/40 transition-colors group">
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-medium text-[#1e3a5f] truncate">{{ snippet.title }}</span>
                    <span class="px-1.5 py-0.5 rounded text-[9px] font-medium"
                      :class="{
                        'bg-[#1e3a5f]/10 text-[#1e3a5f]': snippet.category === 'organization',
                        'bg-[#7c9a6e]/10 text-[#7c9a6e]': snippet.category === 'methodology',
                        'bg-purple-100 text-purple-700': snippet.category === 'impact',
                        'bg-[#d4a843]/10 text-[#d4a843]': snippet.category === 'budget',
                        'bg-teal-100 text-teal-700': snippet.category === 'sustainability',
                        'bg-stone-100 text-stone-600': snippet.category === 'other',
                      }">
                      {{ t(`proposalWizard.snippets.categories.${snippet.category}`) }}
                    </span>
                  </div>
                  <p class="text-[10px] text-stone-500 line-clamp-2">{{ snippet.content.substring(0, 120) }}{{ snippet.content.length > 120 ? '...' : '' }}</p>
                  <div class="flex items-center gap-3 mt-1.5">
                    <span class="text-[9px] text-stone-400">{{ t('proposalWizard.snippets.usageCount', { count: snippet.usageCount }) }}</span>
                    <span v-if="snippet.sourceGrantTitle" class="text-[9px] text-stone-400 truncate max-w-[150px]">{{ snippet.sourceGrantTitle }}</span>
                  </div>
                </div>
                <div class="flex gap-1 flex-shrink-0">
                  <button @click="deleteSnippetFromWizard(snippet.id)"
                    class="p-1 rounded text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    :title="t('proposalWizard.snippets.deleteSnippet')">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Cards -->
        <div v-for="sectionType in selectedSections" :key="sectionType" class="card">
          <div class="flex items-center gap-3 mb-4">
            <!-- Status Icon -->
            <div v-if="completedSections.includes(sectionType)" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div v-else-if="currentGeneratingSection === sectionType" class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div v-else class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>

            <div>
              <h3 class="font-medium text-gray-900">{{ getSectionLabel(sectionType) }}</h3>
              <p class="text-sm text-gray-500">
                <span v-if="completedSections.includes(sectionType)">{{ $t('proposalWizard.step3.complete') }}</span>
                <span v-else-if="currentGeneratingSection === sectionType">{{ $t('proposalWizard.step3.generating') }}</span>
                <span v-else>{{ $t('proposalWizard.step3.waiting') }}</span>
              </p>
            </div>
          </div>

          <!-- Reuse from Previous Button -->
          <div v-if="!currentGeneratingSection || currentGeneratingSection !== sectionType" class="mb-3">
            <button
              @click="toggleReusePanel(sectionType)"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors"
              :class="showReusePanel[sectionType]
                ? 'bg-[#1e3a5f] text-white'
                : 'text-[#1e3a5f] border border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5'"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              {{ showReusePanel[sectionType] ? t('proposalWizard.reuse.hidePanel') : t('proposalWizard.reuse.buttonLabel') }}
            </button>

            <!-- Reuse Candidates Panel -->
            <div v-if="showReusePanel[sectionType]" class="mt-2 p-3 bg-stone-50 border border-[#1e3a5f]/10 rounded-lg animate-fade-in">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h4 class="text-xs font-semibold text-[#1e3a5f]">{{ t('proposalWizard.reuse.panelTitle') }}</h4>
                  <p class="text-[10px] text-stone-400 mt-0.5">{{ t('proposalWizard.reuse.panelSubtitle') }}</p>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="reuseLoading" class="flex items-center gap-2 py-4 justify-center">
                <div class="w-4 h-4 border-2 border-[#1e3a5f] border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs text-stone-500">{{ t('proposalWizard.reuse.loading') }}</span>
              </div>

              <!-- No Candidates -->
              <div v-else-if="reuseCandidates.length === 0" class="text-center py-4">
                <svg class="w-8 h-8 text-stone-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="text-xs text-stone-500">{{ t('proposalWizard.reuse.noCandidates') }}</p>
                <p class="text-[10px] text-stone-400 mt-0.5">{{ t('proposalWizard.reuse.noCandidatesDesc') }}</p>
              </div>

              <!-- Candidate List -->
              <div v-else class="space-y-2 max-h-72 overflow-y-auto">
                <div
                  v-for="candidate in reuseCandidates"
                  :key="candidate.section.proposalId + '_' + candidate.section.sectionType"
                  class="p-3 bg-white rounded-lg border border-stone-200 hover:border-[#d4a843]/40 transition-colors group"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="text-xs font-medium text-[#1e3a5f] truncate max-w-[200px]">{{ candidate.section.grantTitle }}</span>
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-medium bg-stone-100 text-stone-600">
                          {{ candidate.section.sectionType }}
                        </span>
                        <!-- Similarity Badge -->
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          :class="candidate.similarityScore >= 50
                            ? 'bg-[#7c9a6e]/15 text-[#7c9a6e]'
                            : candidate.similarityScore >= 25
                              ? 'bg-[#d4a843]/15 text-[#d4a843]'
                              : 'bg-stone-100 text-stone-500'"
                        >
                          {{ t('proposalWizard.reuse.similarity', { score: candidate.similarityScore }) }}
                        </span>
                      </div>

                      <!-- Preview text -->
                      <p class="text-[10px] text-stone-500 line-clamp-2 mt-1">{{ candidate.section.content.substring(0, 150) }}{{ candidate.section.content.length > 150 ? '...' : '' }}</p>

                      <!-- Meta info -->
                      <div class="flex items-center gap-3 mt-1.5">
                        <span class="text-[9px] text-stone-400">{{ t('proposalWizard.reuse.wordCount', { count: candidate.section.wordCount }) }}</span>
                        <span class="text-[9px] text-stone-400">{{ t('proposalWizard.reuse.createdAt', { date: new Date(candidate.section.createdAt).toLocaleDateString() }) }}</span>
                      </div>

                      <!-- Similarity bar -->
                      <div class="mt-1.5 flex items-center gap-2">
                        <div class="flex-1 h-1 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            class="h-full rounded-full transition-all"
                            :class="candidate.similarityScore >= 50
                              ? 'bg-[#7c9a6e]'
                              : candidate.similarityScore >= 25
                                ? 'bg-[#d4a843]'
                                : 'bg-stone-400'"
                            :style="{ width: candidate.similarityScore + '%' }"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Import Button -->
                    <button
                      @click="importSection(candidate, sectionType)"
                      class="px-2.5 py-1.5 bg-[#1e3a5f] text-white rounded-lg text-[10px] font-medium hover:bg-[#2a4d7a] transition-colors flex-shrink-0 flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                      </svg>
                      {{ t('proposalWizard.reuse.importButton') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Streaming Content -->
          <div
            v-if="currentGeneratingSection === sectionType || completedSections.includes(sectionType)"
            class="prose max-w-none bg-gray-50 rounded-lg p-4 text-sm"
          >
            <div v-html="formatContent(generatedContent[sectionType] || '')"></div>
            <span v-if="currentGeneratingSection === sectionType" class="inline-block w-2 h-4 bg-primary-600 animate-pulse ml-1"></span>
          </div>

          <!-- Section Actions: Review + Save to Library -->
          <div v-if="completedSections.includes(sectionType)" class="mt-4 pt-3 border-t border-stone-100">
            <div class="flex items-center gap-2 flex-wrap">
              <button v-if="!sectionReviews[sectionType] && reviewingSection !== sectionType"
                @click="reviewSection(sectionType)"
                class="text-xs px-3 py-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors flex items-center gap-1.5">
                {{ t('proposalWizard.review.getFeedback') }}
              </button>

              <button v-if="snippetSaveSection !== sectionType"
                @click="openSaveSnippetForm(sectionType)"
                class="text-xs px-3 py-1.5 border border-[#d4a843]/30 text-[#d4a843] rounded-lg hover:bg-[#d4a843]/5 transition-colors flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                {{ t('proposalWizard.snippets.saveToLibrary') }}
              </button>
            </div>

            <!-- Inline Save Snippet Form -->
            <div v-if="snippetSaveSection === sectionType" class="mt-3 p-3 bg-[#d4a843]/5 border border-[#d4a843]/20 rounded-lg animate-fade-in">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-[#d4a843]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
                <span class="text-xs font-semibold text-[#1e3a5f]">{{ t('proposalWizard.snippets.saveSnippet') }}</span>
              </div>
              <div class="space-y-2">
                <input v-model="snippetSaveTitle" type="text"
                  :placeholder="t('proposalWizard.snippets.snippetTitlePlaceholder')"
                  class="w-full px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-[#d4a843] focus:border-transparent" />
                <div class="flex items-center gap-2">
                  <label class="text-[10px] text-stone-500 flex-shrink-0">{{ t('proposalWizard.snippets.category') }}:</label>
                  <select v-model="snippetSaveCategory"
                    class="flex-1 px-2 py-1 border border-stone-200 rounded text-[10px] focus:ring-1 focus:ring-[#d4a843] focus:border-transparent bg-white">
                    <option v-for="cat in snippetCategories" :key="cat" :value="cat">
                      {{ t(`proposalWizard.snippets.categories.${cat}`) }}
                    </option>
                  </select>
                </div>
                <div class="flex justify-end gap-2">
                  <button @click="cancelSaveSnippet"
                    class="px-3 py-1 text-[10px] text-stone-500 hover:text-stone-700 transition-colors">
                    {{ t('proposalWizard.snippets.cancelButton') }}
                  </button>
                  <button @click="saveAsSnippet(sectionType)"
                    :disabled="!snippetSaveTitle.trim()"
                    class="px-3 py-1 bg-[#d4a843] text-white rounded text-[10px] font-medium hover:bg-[#c49a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ t('proposalWizard.snippets.saveButton') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Available Snippets for this Section -->
            <div v-if="showSnippetLibrary && getSnippetsForSection(sectionType).length > 0" class="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <p class="text-[10px] font-semibold text-[#1e3a5f] mb-2">{{ t('proposalWizard.snippets.matchingSnippets') }}</p>
              <div class="space-y-1.5">
                <div v-for="snippet in getSnippetsForSection(sectionType)" :key="snippet.id"
                  class="flex items-center justify-between gap-2 p-2 bg-white rounded border border-stone-100 hover:border-[#d4a843]/30 transition-colors">
                  <div class="flex-1 min-w-0">
                    <span class="text-[10px] font-medium text-[#1e3a5f] block truncate">{{ snippet.title }}</span>
                    <span class="text-[9px] text-stone-400">{{ snippet.content.substring(0, 60) }}...</span>
                  </div>
                  <button @click="insertSnippet(snippet.id, sectionType)"
                    class="px-2 py-1 bg-[#1e3a5f] text-white rounded text-[9px] font-medium hover:bg-[#2a4d7a] transition-colors flex-shrink-0">
                    {{ t('proposalWizard.snippets.insertSnippet') }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="reviewingSection === sectionType" class="flex items-center gap-2 text-xs text-stone-500">
              <div class="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              {{ t('proposalWizard.review.analyzing') }}
            </div>

            <div v-if="sectionReviews[sectionType]" class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-stone-600">{{ t('proposalWizard.review.qualityScore') }}:</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-bold" :class="getScoreColor(sectionReviews[sectionType].score)">
                  {{ sectionReviews[sectionType].score }}/10
                </span>
              </div>

              <div v-if="sectionReviews[sectionType].strengths.length" class="space-y-1">
                <p class="text-[11px] font-semibold text-green-700">{{ t('proposalWizard.review.strengths') }}</p>
                <p v-for="s in sectionReviews[sectionType].strengths" :key="s" class="text-[11px] text-green-600 pl-2">+ {{ s }}</p>
              </div>

              <div v-if="sectionReviews[sectionType].suggestions.length" class="space-y-1">
                <p class="text-[11px] font-semibold text-amber-700">{{ t('proposalWizard.review.suggestions') }}</p>
                <p v-for="s in sectionReviews[sectionType].suggestions" :key="s" class="text-[11px] text-amber-600 pl-2">&rarr; {{ s }}</p>
              </div>

              <button @click="clearReview(sectionType)" class="text-[10px] text-stone-400 hover:text-stone-600 transition-colors">
                {{ t('proposalWizard.review.dismiss') }}
              </button>
            </div>
          </div>

          <!-- Section Comments -->
          <div class="mt-3 pt-3 border-t border-stone-100">
            <button @click="toggleCommentSection(sectionType)"
              class="flex items-center gap-2 text-xs text-stone-500 hover:text-navy-600 transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <span v-if="getCommentCount(sectionType).total > 0">
                {{ t('proposalWizard.comments.count', { count: getCommentCount(sectionType).total }) }}
                <span v-if="getCommentCount(sectionType).unresolved > 0" class="text-amber-600 font-medium ml-1">
                  ({{ getCommentCount(sectionType).unresolved }} {{ t('proposalWizard.comments.open') }})
                </span>
              </span>
              <span v-else>{{ t('proposalWizard.comments.add') }}</span>
            </button>

            <div v-if="expandedComments.has(sectionType)" class="mt-3 space-y-2">
              <!-- Comment List -->
              <div v-for="comment in (sectionComments[sectionType] || [])" :key="comment.id"
                class="flex gap-2 p-2 rounded-lg text-xs group"
                :class="comment.resolved ? 'bg-stone-50 opacity-60' : 'bg-amber-50'">
                <div class="w-6 h-6 rounded-full bg-navy-200 text-navy-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                  {{ comment.author.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-navy-800">{{ comment.author }}</span>
                    <span class="text-stone-400">{{ commentTimeAgo(comment.createdAt) }}</span>
                    <span v-if="comment.resolved" class="text-green-600 text-[10px]">{{ t('proposalWizard.comments.resolved') }}</span>
                  </div>
                  <p class="mt-0.5" :class="comment.resolved ? 'line-through text-stone-400' : 'text-navy-700'">{{ comment.text }}</p>
                </div>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="toggleResolveComment(sectionType, comment.id)"
                    class="p-1 rounded hover:bg-stone-200 text-[10px]" :title="comment.resolved ? t('proposalWizard.comments.unresolve') : t('proposalWizard.comments.resolve')">
                    {{ comment.resolved ? '&#8617;' : '&#10003;' }}
                  </button>
                  <button @click="deleteComment(sectionType, comment.id)"
                    class="p-1 rounded hover:bg-red-100 text-[10px] text-red-400">&#10005;</button>
                </div>
              </div>

              <!-- Add Comment Input -->
              <div class="flex gap-2">
                <input v-model="commentInputs[sectionType]" @keyup.enter="addComment(sectionType)"
                  :placeholder="t('proposalWizard.comments.placeholder')"
                  class="flex-1 px-3 py-1.5 border border-stone-200 rounded-lg text-xs focus:ring-1 focus:ring-amber-400 focus:border-transparent" />
                <button @click="addComment(sectionType)"
                  class="px-3 py-1.5 bg-navy-800 text-white rounded-lg text-xs hover:bg-navy-700 transition-colors">
                  {{ t('proposalWizard.comments.post') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Actions -->
        <div v-if="generationComplete" class="card bg-green-50 border-green-200">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('proposalWizard.step3.generationComplete') }}</h3>
              <p class="text-gray-600">{{ $t('proposalWizard.step3.generationCompleteDesc') }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <button @click="viewProposal" class="btn btn-primary">
                {{ $t('proposalWizard.step3.viewProposal') }}
              </button>
              <button @click="saveAsTemplate" class="btn btn-outline btn-sm flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                {{ $t('proposalWizard.saveAsTemplate') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import { useToast } from '@/lib/useToast'
import { csoApi, grantsApi, proposalsApi, type SectionType } from '@/services/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()

// Profile prefill state
const profilePreFilled = ref(false)

// Wizard state
const steps = computed(() => [t('proposalWizard.steps.selectOrg'), t('proposalWizard.steps.chooseSections'), t('proposalWizard.steps.generate')])
const currentStep = ref(0)

// Data
const grantId = ref('')
const grantTitle = ref(t('common.loading'))
const csos = ref<any[]>([])
const loadingCsos = ref(true)
const selectedCsoId = ref('')
const proposalId = ref('')

// Section selection
const availableSections = computed(() => [
  { type: 'objectives' as SectionType, label: t('proposalWizard.step2.objectives'), description: t('proposalWizard.step2.objectivesDesc'), recommended: true },
  { type: 'methodology' as SectionType, label: t('proposalWizard.step2.methodology'), description: t('proposalWizard.step2.methodologyDesc'), recommended: true },
  { type: 'impact' as SectionType, label: t('proposalWizard.step2.impact'), description: t('proposalWizard.step2.impactDesc'), recommended: true },
  { type: 'work_plan' as SectionType, label: t('proposalWizard.step2.workPlan'), description: t('proposalWizard.step2.workPlanDesc'), recommended: true },
  { type: 'budget_narrative' as SectionType, label: t('proposalWizard.step2.budgetNarrative'), description: t('proposalWizard.step2.budgetNarrativeDesc'), recommended: false },
  { type: 'sustainability' as SectionType, label: t('proposalWizard.step2.sustainability'), description: t('proposalWizard.step2.sustainabilityDesc'), recommended: false },
  { type: 'background' as SectionType, label: t('proposalWizard.step2.background'), description: t('proposalWizard.step2.backgroundDesc'), recommended: false },
  { type: 'partners' as SectionType, label: t('proposalWizard.step2.partners'), description: t('proposalWizard.step2.partnersDesc'), recommended: false },
])

const selectedSections = ref<SectionType[]>(['objectives', 'methodology', 'impact', 'work_plan'])

// Generation state
const currentGeneratingSection = ref<SectionType | null>(null)
const completedSections = ref<SectionType[]>([])
const generatedContent = ref<Record<string, string>>({})
const generationComplete = computed(() => completedSections.value.length === selectedSections.value.length && selectedSections.value.length > 0)

// Section Quality Review
interface SectionReview {
  score: number
  strengths: string[]
  suggestions: string[]
}

const sectionReviews = ref<Record<string, SectionReview>>({})
const reviewingSection = ref<string | null>(null)

function reviewSection(sectionKey: string) {
  const content = generatedContent.value?.[sectionKey] || ''
  if (!content || content.length < 20) return

  reviewingSection.value = sectionKey

  // Client-side quality analysis
  setTimeout(() => {
    const words = content.split(/\s+/).length
    const sentences = content.split(/[.!?]+/).filter(Boolean).length
    const paragraphs = content.split(/\n\n+/).filter(Boolean).length
    const hasNumbers = /\d+/.test(content)
    const hasMetrics = /\d+%|\d+\s*(people|organizations|participants|beneficiaries|months|years|EUR|USD|UAH)/i.test(content)
    const hasStructure = paragraphs > 1
    const hasBullets = /[-•*]\s/.test(content)

    let score = 5 // base score
    const strengths: string[] = []
    const suggestions: string[] = []

    // Length analysis
    if (words > 200) { score += 1; strengths.push('Good level of detail') }
    else if (words < 50) { score -= 1; suggestions.push('Section is quite short — consider adding more detail') }

    // Structure
    if (hasStructure) { score += 0.5; strengths.push('Well-structured with multiple paragraphs') }
    else { suggestions.push('Consider breaking into multiple paragraphs for readability') }

    if (hasBullets) { score += 0.5; strengths.push('Uses bullet points for clarity') }

    // Specificity
    if (hasMetrics) { score += 1; strengths.push('Includes measurable indicators') }
    else { suggestions.push('Add specific numbers, percentages, or measurable targets') }

    if (hasNumbers) { score += 0.5 }
    else { suggestions.push('Include quantitative data to strengthen the proposal') }

    // Section-specific checks
    if (sectionKey === 'methodology' || sectionKey === 'activities') {
      if (/timeline|phase|stage|month|week/i.test(content)) {
        score += 0.5; strengths.push('Includes timeline or phasing')
      } else {
        suggestions.push('Consider adding a timeline or phases to the methodology')
      }
    }

    if (sectionKey === 'impact' || sectionKey === 'results') {
      if (/indicator|outcome|result|change|impact/i.test(content)) {
        score += 0.5; strengths.push('References outcomes and impact')
      } else {
        suggestions.push('Explicitly state expected outcomes and how impact will be measured')
      }
    }

    if (sectionKey === 'budget' || sectionKey === 'budget_narrative') {
      if (/co-financ|match|own contribution|in-kind/i.test(content)) {
        score += 0.5; strengths.push('Addresses co-financing')
      } else {
        suggestions.push('Mention co-financing or own contribution if applicable')
      }
    }

    if (sectionKey === 'sustainability') {
      if (/after|beyond|long-term|continue|maintain/i.test(content)) {
        score += 0.5; strengths.push('Addresses long-term sustainability')
      } else {
        suggestions.push('Explain how project results will be sustained after funding ends')
      }
    }

    // Sentence quality
    const avgWordsPerSentence = words / Math.max(sentences, 1)
    if (avgWordsPerSentence > 30) {
      suggestions.push('Some sentences are very long — consider simplifying for clarity')
    } else if (avgWordsPerSentence > 15 && avgWordsPerSentence < 25) {
      strengths.push('Good sentence length for readability')
    }

    // Cap score
    score = Math.max(1, Math.min(10, Math.round(score)))

    sectionReviews.value[sectionKey] = { score, strengths: strengths.slice(0, 3), suggestions: suggestions.slice(0, 3) }
    reviewingSection.value = null
  }, 1200) // Simulate analysis time
}

function getScoreColor(score: number): string {
  if (score >= 8) return 'bg-green-100 text-green-700'
  if (score >= 5) return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-700'
}

function clearReview(sectionKey: string) {
  delete sectionReviews.value[sectionKey]
}

// Proposal Section Comments
interface ProposalComment {
  id: string
  text: string
  author: string
  createdAt: string
  resolved: boolean
}

const sectionComments = ref<Record<string, ProposalComment[]>>({})
const commentInputs = ref<Record<string, string>>({})
const expandedComments = ref<Set<string>>(new Set())

function loadComments() {
  const pid = route.query.proposalId as string || 'draft'
  const stored = localStorage.getItem(`proposalComments_${pid}`)
  if (stored) sectionComments.value = JSON.parse(stored)
}

function saveComments() {
  const pid = route.query.proposalId as string || 'draft'
  localStorage.setItem(`proposalComments_${pid}`, JSON.stringify(sectionComments.value))
}

function addComment(sectionKey: string) {
  const text = (commentInputs.value[sectionKey] || '').trim()
  if (!text) return

  if (!sectionComments.value[sectionKey]) {
    sectionComments.value[sectionKey] = []
  }

  sectionComments.value[sectionKey].push({
    id: Date.now().toString(),
    text,
    author: 'Me',
    createdAt: new Date().toISOString(),
    resolved: false,
  })

  commentInputs.value[sectionKey] = ''
  saveComments()
}

function toggleResolveComment(sectionKey: string, commentId: string) {
  const comments = sectionComments.value[sectionKey] || []
  const comment = comments.find(c => c.id === commentId)
  if (comment) {
    comment.resolved = !comment.resolved
    saveComments()
  }
}

function deleteComment(sectionKey: string, commentId: string) {
  sectionComments.value[sectionKey] = (sectionComments.value[sectionKey] || []).filter(c => c.id !== commentId)
  saveComments()
}

function toggleCommentSection(sectionKey: string) {
  if (expandedComments.value.has(sectionKey)) {
    expandedComments.value.delete(sectionKey)
  } else {
    expandedComments.value.add(sectionKey)
  }
}

function getCommentCount(sectionKey: string): { total: number; unresolved: number } {
  const comments = sectionComments.value[sectionKey] || []
  return {
    total: comments.length,
    unresolved: comments.filter(c => !c.resolved).length,
  }
}

function commentTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

// Proposal Snippet Library
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

const snippets = ref<ProposalSnippet[]>([])
const showSnippetLibrary = ref(false)
const snippetSaveSection = ref<string | null>(null)
const snippetSaveTitle = ref('')
const snippetSaveCategory = ref<SnippetCategory>('other')

const sectionToCategory: Record<string, SnippetCategory> = {
  objectives: 'organization',
  background: 'organization',
  methodology: 'methodology',
  work_plan: 'methodology',
  impact: 'impact',
  budget_narrative: 'budget',
  sustainability: 'sustainability',
  partners: 'other',
}

const snippetCategories: SnippetCategory[] = ['organization', 'methodology', 'impact', 'budget', 'sustainability', 'other']

function loadSnippets() {
  try {
    const stored = localStorage.getItem('proposalSnippets')
    if (stored) snippets.value = JSON.parse(stored)
  } catch { snippets.value = [] }
}

function saveSnippetsToStorage() {
  localStorage.setItem('proposalSnippets', JSON.stringify(snippets.value))
}

function openSaveSnippetForm(sectionKey: string) {
  snippetSaveSection.value = sectionKey
  snippetSaveTitle.value = ''
  snippetSaveCategory.value = sectionToCategory[sectionKey] || 'other'
}

function cancelSaveSnippet() {
  snippetSaveSection.value = null
  snippetSaveTitle.value = ''
}

function saveAsSnippet(sectionKey: string) {
  const content = generatedContent.value?.[sectionKey] || ''
  if (!content || !snippetSaveTitle.value.trim()) return

  const snippet: ProposalSnippet = {
    id: Date.now().toString(),
    title: snippetSaveTitle.value.trim(),
    content,
    category: snippetSaveCategory.value,
    sourceGrantTitle: grantTitle.value || undefined,
    createdAt: new Date().toISOString(),
    usageCount: 0,
  }

  snippets.value.push(snippet)
  saveSnippetsToStorage()
  snippetSaveSection.value = null
  snippetSaveTitle.value = ''
  toast.success(t('proposalWizard.snippets.savedSuccess'))
}

function insertSnippet(snippetId: string, targetSection: string) {
  const snippet = snippets.value.find(s => s.id === snippetId)
  if (!snippet) return

  const existing = generatedContent.value[targetSection] || ''
  generatedContent.value[targetSection] = existing ? existing + '\n\n' + snippet.content : snippet.content

  snippet.usageCount++
  saveSnippetsToStorage()
  toast.success(t('proposalWizard.snippets.insertedSuccess'))
}

function deleteSnippetFromWizard(snippetId: string) {
  snippets.value = snippets.value.filter(s => s.id !== snippetId)
  saveSnippetsToStorage()
  toast.success(t('proposalWizard.snippets.deletedSuccess'))
}

const filteredSnippets = computed(() => {
  // Find the current section being viewed in step 3
  // Show snippets matching the category of the current step sections
  const currentSections = selectedSections.value
  const relevantCategories = new Set(
    currentSections.map(s => sectionToCategory[s] || 'other')
  )
  return snippets.value.filter(s => relevantCategories.has(s.category))
})

function getSnippetsForSection(sectionKey: string): ProposalSnippet[] {
  const category = sectionToCategory[sectionKey] || 'other'
  return snippets.value.filter(s => s.category === category)
}

// Proposal Section Reuse Engine
interface ProposalSectionIndex {
  proposalId: string
  grantTitle: string
  sectionType: string
  content: string
  wordCount: number
  createdAt: string
}

interface ReuseCandidate {
  section: ProposalSectionIndex
  similarityScore: number
}

const showReusePanel = ref<Record<string, boolean>>({})
const reuseCandidates = ref<ReuseCandidate[]>([])
const reuseLoading = ref(false)

function getJaccardSimilarity(text1: string, text2: string): number {
  const tokenize = (text: string): Set<string> => {
    return new Set(
      text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 2)
    )
  }
  const set1 = tokenize(text1)
  const set2 = tokenize(text2)
  if (set1.size === 0 || set2.size === 0) return 0

  let intersection = 0
  for (const word of set1) {
    if (set2.has(word)) intersection++
  }
  const union = new Set([...set1, ...set2]).size
  return union > 0 ? intersection / union : 0
}

function buildSectionIndex(): ProposalSectionIndex[] {
  const index: ProposalSectionIndex[] = []

  try {
    // Scan all localStorage keys for proposal data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue

      // proposal_ keys (saved proposals)
      if (key.startsWith('proposal_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          const proposalId = key.replace('proposal_', '')
          const title = data.grantTitle || data.title || t('proposalWizard.reuse.fromGrant', { title: proposalId })

          // Check for sections in various data shapes
          const sections = data.sections || data.generatedContent || {}
          for (const [sectionType, content] of Object.entries(sections)) {
            if (typeof content === 'string' && content.trim().length > 20) {
              index.push({
                proposalId,
                grantTitle: title,
                sectionType,
                content: content as string,
                wordCount: (content as string).split(/\s+/).length,
                createdAt: data.createdAt || data.savedAt || new Date().toISOString(),
              })
            }
          }
        } catch { /* skip invalid entries */ }
      }

      // proposalDraft_ keys (draft proposals)
      if (key.startsWith('proposalDraft_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}')
          const proposalId = key.replace('proposalDraft_', '')
          const title = data.grantTitle || t('proposalWizard.reuse.fromGrant', { title: proposalId })

          const sections = data.generatedContent || {}
          for (const [sectionType, content] of Object.entries(sections)) {
            if (typeof content === 'string' && content.trim().length > 20) {
              index.push({
                proposalId,
                grantTitle: title,
                sectionType,
                content: content as string,
                wordCount: (content as string).split(/\s+/).length,
                createdAt: data.savedAt || new Date().toISOString(),
              })
            }
          }
        } catch { /* skip invalid entries */ }
      }
    }

    // Also scan proposalSnippets for reusable content
    try {
      const snippetsData = JSON.parse(localStorage.getItem('proposalSnippets') || '[]')
      for (const snippet of snippetsData) {
        if (snippet.content && snippet.content.trim().length > 20) {
          index.push({
            proposalId: `snippet_${snippet.id}`,
            grantTitle: snippet.sourceGrantTitle || snippet.title || 'Snippet',
            sectionType: snippet.category || 'other',
            content: snippet.content,
            wordCount: snippet.content.split(/\s+/).length,
            createdAt: snippet.createdAt || new Date().toISOString(),
          })
        }
      }
    } catch { /* skip */ }
  } catch { /* localStorage access error */ }

  return index
}

function findReusableSections(sectionType: string) {
  reuseLoading.value = true
  reuseCandidates.value = []

  setTimeout(() => {
    const index = buildSectionIndex()
    const currentContent = generatedContent.value[sectionType] || ''

    // Get the section label as reference text for similarity when no current content
    const sectionLabel = getSectionLabel(sectionType).toLowerCase()
    const referenceText = currentContent.length > 20 ? currentContent : sectionLabel

    const candidates: ReuseCandidate[] = []

    for (const entry of index) {
      // Skip entries from the current proposal
      if (entry.proposalId === grantId.value) continue

      // Calculate similarity: if we have content, compare content; otherwise compare section types
      let score: number
      if (currentContent.length > 20) {
        score = getJaccardSimilarity(currentContent, entry.content)
      } else {
        // Boost score for matching section types
        const typeMatch = entry.sectionType === sectionType ? 0.5 : 0
        const textSimilarity = getJaccardSimilarity(referenceText, entry.content.substring(0, 500))
        score = Math.min(1, typeMatch + textSimilarity)
      }

      if (score > 0.02) {
        candidates.push({
          section: entry,
          similarityScore: Math.round(score * 100),
        })
      }
    }

    // Sort by score descending, take top 5
    candidates.sort((a, b) => b.similarityScore - a.similarityScore)
    reuseCandidates.value = candidates.slice(0, 5)
    reuseLoading.value = false
  }, 300) // Small delay for UX
}

function importSection(candidate: ReuseCandidate, targetSectionKey: string) {
  const existing = generatedContent.value[targetSectionKey] || ''
  generatedContent.value[targetSectionKey] = existing
    ? existing + '\n\n' + candidate.section.content
    : candidate.section.content

  // Mark as completed if not already
  if (!completedSections.value.includes(targetSectionKey as SectionType)) {
    completedSections.value.push(targetSectionKey as SectionType)
  }

  toast.success(t('proposalWizard.reuse.importedSuccess'))
  showReusePanel.value[targetSectionKey] = false
}

function toggleReusePanel(sectionType: string) {
  const isOpen = showReusePanel.value[sectionType]
  showReusePanel.value[sectionType] = !isOpen
  if (!isOpen) {
    findReusableSections(sectionType)
  }
}

// Offline detection
const isOffline = ref(!navigator.onLine)
const isSaving = ref(false)
function handleOnline() { isOffline.value = false }
function handleOffline() { isOffline.value = true }

// Auto-save state
const lastSavedAt = ref('')
const showDraftBanner = ref(false)
let autoSaveInterval: ReturnType<typeof setInterval> | null = null
const DRAFT_KEY = computed(() => `proposalDraft_${grantId.value}`)

function saveDraft() {
  if (!grantId.value || generationComplete.value) return
  isSaving.value = true
  const draft = {
    grantId: grantId.value,
    grantTitle: grantTitle.value,
    selectedCsoId: selectedCsoId.value,
    selectedSections: selectedSections.value,
    currentStep: currentStep.value,
    generatedContent: generatedContent.value,
    completedSections: completedSections.value,
    proposalId: proposalId.value,
    savedAt: new Date().toISOString()
  }
  try {
    localStorage.setItem(DRAFT_KEY.value, JSON.stringify(draft))
    const now = new Date()
    lastSavedAt.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch { /* storage full */ }
  setTimeout(() => { isSaving.value = false }, 500)
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY.value)
    if (!raw) return
    const draft = JSON.parse(raw)
    selectedCsoId.value = draft.selectedCsoId || ''
    selectedSections.value = draft.selectedSections || ['objectives', 'methodology', 'impact', 'work_plan']
    currentStep.value = Math.min(draft.currentStep || 0, 1) // Don't restore to generation step
    generatedContent.value = draft.generatedContent || {}
    completedSections.value = draft.completedSections || []
    proposalId.value = draft.proposalId || ''
    toast.success(t('proposalWizard.draftRestored'))
  } catch { /* ignore */ }
  showDraftBanner.value = false
}

function discardDraft() {
  try { localStorage.removeItem(DRAFT_KEY.value) } catch { /* ignore */ }
  showDraftBanner.value = false
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY.value) } catch { /* ignore */ }
}

// Unsaved form warning
const isGenerating = computed(() => currentGeneratingSection.value !== null)

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (isGenerating.value || (currentStep.value > 0 && !generationComplete.value)) {
    e.preventDefault()
  }
}

onBeforeRouteLeave(() => {
  if (isGenerating.value) {
    return window.confirm(t('common.generationInProgress'))
  }
  if (currentStep.value > 0 && !generationComplete.value) {
    return window.confirm(t('common.unsavedChanges'))
  }
  return true
})

// CSO Profile prefill
async function prefillFromProfile() {
  try {
    // Try localStorage cache first
    let profiles = JSON.parse(localStorage.getItem('csoProfiles') || '[]')
    if (profiles.length === 0) {
      // Try API
      const { csos } = await csoApi.getAll()
      if (csos?.length > 0) {
        profiles = csos
      }
    }
    if (profiles.length > 0) {
      const profile = profiles[0]
      // Auto-select CSO if not already selected
      if (profile.id && !selectedCsoId.value) {
        selectedCsoId.value = profile.id
      }
      profilePreFilled.value = true
    }
  } catch {
    // Silent fail - profile prefill is optional
  }
}

// Methods
function nextStep() {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function getSectionLabel(type: string): string {
  return availableSections.value.find(s => s.type === type)?.label || type
}

function formatContent(content: string): string {
  // Simple markdown-like formatting
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

async function startGeneration() {
  currentStep.value = 2

  try {
    // Create the proposal first
    const createResult = await proposalsApi.create({
      grant_id: grantId.value,
      cso_id: selectedCsoId.value,
    })
    proposalId.value = createResult.proposal_id

    // Generate sections sequentially with streaming
    for (const sectionType of selectedSections.value) {
      currentGeneratingSection.value = sectionType
      generatedContent.value[sectionType] = ''

      try {
        const response = await proposalsApi.generateSectionStream(proposalId.value, sectionType)

        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            // Parse SSE events
            const lines = chunk.split('\n')
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    generatedContent.value[sectionType] += parsed.content
                  }
                } catch {
                  // Plain text chunk
                  generatedContent.value[sectionType] += data
                }
              }
            }
          }
        } else {
          // Fallback to non-streaming if stream not available
          const result = await proposalsApi.generateSection(proposalId.value, sectionType)
          generatedContent.value[sectionType] = result.section.content
        }

        completedSections.value.push(sectionType)
      } catch (error) {
        console.error(`Error generating ${sectionType}:`, error)
        generatedContent.value[sectionType] = `Error generating this section. Please try again.`
        completedSections.value.push(sectionType)
      }

      currentGeneratingSection.value = null
    }
  } catch (error) {
    console.error('Error creating proposal:', error)
    toast.error(t('errors.createProposal'))
  }
}

function shareProposal() {
  try {
    const shareData = {
      csoId: selectedCsoId.value || '',
      grantId: grantId.value || '',
      grantTitle: grantTitle.value || '',
      content: generatedContent.value || {}
    }
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(shareData))))
    const truncated = encoded.length > 2000 ? encoded.substring(0, 2000) : encoded
    const shareUrl = `${window.location.origin}${window.location.pathname}?shared=${truncated}`
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success(t('proposalWizard.shareCopied'))
    }).catch(() => {
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      toast.success(t('proposalWizard.shareCopied'))
    })
  } catch {
    toast.error(t('proposalWizard.shareError'))
  }
}

function viewProposal() {
  clearDraft()
  router.push(`/proposals/${proposalId.value}`)
}

// Template system
function loadTemplate() {
  const templateId = route.query.template as string
  if (!templateId) return
  try {
    const templates = JSON.parse(localStorage.getItem('proposalTemplates') || '[]')
    const tmpl = templates.find((t: any) => t.id === templateId)
    if (tmpl) {
      if (tmpl.csoId) selectedCsoId.value = tmpl.csoId
      if (tmpl.sections) {
        // Store template sections to apply after generation
        Object.keys(tmpl.sections).forEach(key => {
          generatedContent.value[key] = tmpl.sections[key]
        })
      }
      toast.info(t('proposalWizard.templateLoaded'))
    }
  } catch { /* ignore */ }
}

function saveAsTemplate() {
  const name = prompt(t('proposalWizard.templateName'))
  if (!name) return
  const sections: Record<string, string> = {}
  Object.keys(generatedContent.value).forEach(key => {
    if (generatedContent.value[key]) sections[key] = generatedContent.value[key]
  })
  const templates = JSON.parse(localStorage.getItem('proposalTemplates') || '[]')
  templates.push({
    id: Date.now().toString(),
    name,
    csoId: selectedCsoId.value || '',
    sections,
    createdAt: new Date().toISOString()
  })
  localStorage.setItem('proposalTemplates', JSON.stringify(templates))
  toast.success(t('proposalWizard.templateSaved'))
}

onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // Get grant ID from query
  grantId.value = route.query.grantId as string

  if (!grantId.value) {
    router.push('/grants')
    return
  }

  // Check for existing draft
  try {
    const raw = localStorage.getItem(`proposalDraft_${grantId.value}`)
    if (raw) {
      const draft = JSON.parse(raw)
      const savedTime = new Date(draft.savedAt)
      const hoursAgo = (Date.now() - savedTime.getTime()) / (1000 * 60 * 60)
      if (hoursAgo < 48 && draft.currentStep > 0) {
        showDraftBanner.value = true
      }
    }
  } catch { /* ignore */ }

  // Start auto-save every 30 seconds
  autoSaveInterval = setInterval(saveDraft, 30000)

  // Load grant details
  try {
    const grantResult = await grantsApi.getById(grantId.value)
    grantTitle.value = grantResult.grant.title
  } catch (error) {
    console.error('Error loading grant:', error)
    grantTitle.value = 'Grant Application'
  }

  // Load CSO profiles
  try {
    const csoResult = await csoApi.getAll()
    csos.value = csoResult.csos
    if (csos.value.length === 1) {
      selectedCsoId.value = csos.value[0].id
    }
  } catch (error) {
    console.error('Error loading CSOs:', error)
    toast.error(t('errors.loadOrganizations'))
  } finally {
    loadingCsos.value = false
  }

  // Pre-fill from CSO profile if available
  await prefillFromProfile()

  // Load template if specified in URL
  loadTemplate()

  // Load section comments
  loadComments()

  // Load snippet library
  loadSnippets()
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  if (autoSaveInterval) clearInterval(autoSaveInterval)
  // Final save on leave (unless complete)
  if (!generationComplete.value && currentStep.value > 0) {
    saveDraft()
  }
})
</script>
