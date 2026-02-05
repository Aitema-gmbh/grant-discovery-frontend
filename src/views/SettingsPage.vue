<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto py-8 px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('settings.title') }}</h1>
        <p class="text-gray-600">{{ $t('settings.description') }}</p>
      </div>

      <!-- Language Settings -->
      <div class="card mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.language') }}</h2>
        <p class="text-gray-600 mb-4">{{ $t('settings.languageDescription') }}</p>
        <LanguageSwitcher />
      </div>

      <!-- Notification Settings -->
      <div class="card mb-6">
        <div class="flex items-center gap-3 mb-4">
          <h2 class="text-xl font-semibold text-gray-900">{{ $t('settings.notifications') }}</h2>
          <span class="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{{ $t('settings.comingSoon') }}</span>
        </div>
        <p class="text-navy-600 text-sm mb-4">{{ $t('settings.notificationsRoadmap') }}</p>
        <div class="mt-4 space-y-4 opacity-40 pointer-events-none">
          <label class="flex items-center gap-3">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
            <span class="text-gray-700">{{ $t('settings.notifGrantMatches') }}</span>
          </label>
          <label class="flex items-center gap-3">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
            <span class="text-gray-700">{{ $t('settings.notifWeeklyDigest') }}</span>
          </label>
          <label class="flex items-center gap-3">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
            <span class="text-gray-700">{{ $t('settings.notifDeadlineReminders') }}</span>
          </label>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="card">
        <div class="flex items-center gap-3 mb-4">
          <h2 class="text-xl font-semibold text-gray-900">{{ $t('settings.account') }}</h2>
          <span class="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{{ $t('settings.comingSoon') }}</span>
        </div>
        <p class="text-navy-600 text-sm mb-4">{{ $t('settings.accountRoadmap') }}</p>
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
import AppLayout from '@/components/AppLayout.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>
