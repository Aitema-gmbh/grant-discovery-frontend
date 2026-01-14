<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto py-8 px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('profile.title') }}</h1>
        <p class="text-gray-600">{{ $t('profile.description') }}</p>
      </div>

      <!-- Profile Card -->
      <div v-if="user" class="card">
        <!-- Avatar and Name -->
        <div class="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
          <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span class="text-3xl font-bold text-primary-600">
              {{ user.email?.charAt(0).toUpperCase() || 'U' }}
            </span>
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-gray-900">
              {{ user.user_metadata?.full_name || $t('profile.noName') }}
            </h2>
            <p class="text-gray-600">{{ user.email }}</p>
          </div>
        </div>

        <!-- Profile Details -->
        <dl class="space-y-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 mb-1">{{ $t('profile.email') }}</dt>
            <dd class="text-gray-900">{{ user.email }}</dd>
          </div>

          <div>
            <dt class="text-sm font-medium text-gray-500 mb-1">{{ $t('profile.memberId') }}</dt>
            <dd class="font-mono text-sm text-gray-700">{{ user.id }}</dd>
          </div>

          <div v-if="user.created_at">
            <dt class="text-sm font-medium text-gray-500 mb-1">{{ $t('profile.memberSince') }}</dt>
            <dd class="text-gray-900">{{ formatDate(user.created_at) }}</dd>
          </div>

          <div v-if="user.last_sign_in_at">
            <dt class="text-sm font-medium text-gray-500 mb-1">{{ $t('profile.lastLogin') }}</dt>
            <dd class="text-gray-900">{{ formatDate(user.last_sign_in_at) }}</dd>
          </div>
        </dl>

        <!-- Actions -->
        <div class="mt-8 pt-6 border-t border-gray-200 flex gap-3">
          <router-link to="/settings" class="btn btn-outline">
            {{ $t('profile.editSettings') }}
          </router-link>
          <button @click="handleLogout" class="btn btn-outline text-red-600 border-red-300 hover:bg-red-50">
            {{ $t('profile.logout') }}
          </button>
        </div>
      </div>

      <!-- Not Logged In State -->
      <div v-else class="card text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('profile.notLoggedIn') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('profile.pleaseLogin') }}</p>
        <router-link to="/auth/login" class="btn btn-primary">
          {{ $t('auth.login') }}
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}
</script>
