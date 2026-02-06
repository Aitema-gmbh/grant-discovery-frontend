<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('settings.title') }}</h1>
        <p class="text-navy-600">{{ $t('settings.description') }}</p>
      </div>

      <!-- Language Settings -->
      <div class="card-premium mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-display font-semibold text-navy-900">{{ $t('settings.language') }}</h2>
            <p class="text-sm text-navy-600">{{ $t('settings.languageDescription') }}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      <!-- Notification Settings -->
      <div class="card-premium mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-display font-semibold text-navy-900">{{ $t('settings.notifications') }}</h2>
            <p class="text-sm text-navy-600">{{ $t('settings.notificationsRoadmap') }}</p>
          </div>
          <span class="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{{ $t('settings.comingSoon') }}</span>
        </div>
        <div class="mt-4 space-y-4 opacity-40 pointer-events-none">
          <label class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-navy-300 text-amber-600" />
            <span class="text-sm text-navy-700">{{ $t('settings.notifGrantMatches') }}</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-navy-300 text-amber-600" />
            <span class="text-sm text-navy-700">{{ $t('settings.notifWeeklyDigest') }}</span>
          </label>
          <label class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-navy-300 text-amber-600" />
            <span class="text-sm text-navy-700">{{ $t('settings.notifDeadlineReminders') }}</span>
          </label>
        </div>
      </div>

      <!-- Data Management -->
      <div class="card-premium mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-sage-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-display font-semibold text-navy-900">{{ $t('settings.dataManagement') }}</h2>
            <p class="text-sm text-navy-600">{{ $t('settings.dataManagementDesc') }}</p>
          </div>
        </div>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-navy-800">{{ $t('settings.savedData') }}</p>
              <p class="text-xs text-navy-500 mt-0.5">{{ $t('settings.savedDataDesc') }}</p>
            </div>
            <button @click="clearLocalData" class="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50">
              {{ $t('settings.clearData') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="card-premium">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-display font-semibold text-navy-900">{{ $t('settings.account') }}</h2>
            <p class="text-sm text-navy-600">{{ $t('settings.accountRoadmap') }}</p>
          </div>
          <span class="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{{ $t('settings.comingSoon') }}</span>
        </div>
        <div class="flex gap-3">
          <button disabled class="btn btn-outline opacity-40">
            {{ $t('settings.changePassword') }}
          </button>
          <button disabled class="btn btn-outline text-red-600 border-red-300 opacity-40">
            {{ $t('settings.deleteAccount') }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { usePageTitle } from '@/lib/usePageTitle'
import { useToast } from '@/lib/useToast'

const { t } = useI18n()
const toast = useToast()
usePageTitle(t('settings.title'))

function clearLocalData() {
  localStorage.removeItem('savedGrants')
  localStorage.removeItem('grantWorkflow')
  localStorage.removeItem('grantReminders')
  localStorage.removeItem('grantNotes')
  localStorage.removeItem('recentSearches')
  localStorage.removeItem('recentlyViewedGrants')
  localStorage.removeItem('comparisonList')
  toast.success(t('settings.dataCleared'))
}
</script>
