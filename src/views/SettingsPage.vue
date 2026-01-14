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
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.notifications') }}</h2>
        <p class="text-gray-500">{{ $t('settings.comingSoon') }}</p>
        <div class="mt-4 space-y-4 opacity-50">
          <label class="flex items-center gap-3">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
            <span class="text-gray-700">Email notifications for new grant matches</span>
          </label>
          <label class="flex items-center gap-3">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
            <span class="text-gray-700">Weekly digest of saved grants</span>
          </label>
          <label class="flex items-center gap-3">
            <input type="checkbox" disabled class="w-4 h-4 rounded border-gray-300" />
            <span class="text-gray-700">Deadline reminders</span>
          </label>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('settings.account') }}</h2>
        <p class="text-gray-500 mb-4">{{ $t('settings.comingSoon') }}</p>
        <div class="flex gap-3">
          <button disabled class="btn btn-outline opacity-50">
            {{ $t('settings.changePassword') }}
          </button>
          <button disabled class="btn btn-outline text-red-600 border-red-300 opacity-50">
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
