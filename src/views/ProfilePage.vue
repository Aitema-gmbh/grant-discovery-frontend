<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto animate-fade-in">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('profile.title') }}</h1>
        <p class="text-navy-600">{{ $t('profile.description') }}</p>
      </div>

      <!-- Profile Card -->
      <div v-if="user" class="space-y-6">
        <!-- User Info Card -->
        <div class="card-premium">
          <div class="flex items-center gap-6 mb-6 pb-6 border-b border-navy-100">
            <div class="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-inner-soft">
              <span class="text-3xl font-bold text-amber-800 font-display">
                {{ userInitials }}
              </span>
            </div>
            <div>
              <h2 class="text-2xl font-display font-semibold text-navy-900">
                {{ user.user_metadata?.full_name || $t('profile.noName') }}
              </h2>
              <p class="text-navy-600">{{ user.email }}</p>
            </div>
          </div>

          <!-- Profile Details Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-3 bg-stone-50 rounded-lg">
              <dt class="text-xs font-medium text-navy-500 mb-1">{{ $t('profile.email') }}</dt>
              <dd class="text-sm text-navy-900 font-medium">{{ user.email }}</dd>
            </div>

            <div class="p-3 bg-stone-50 rounded-lg">
              <dt class="text-xs font-medium text-navy-500 mb-1">{{ $t('profile.memberId') }}</dt>
              <dd class="font-mono text-xs text-navy-700 truncate">{{ user.id }}</dd>
            </div>

            <div v-if="user.created_at" class="p-3 bg-stone-50 rounded-lg">
              <dt class="text-xs font-medium text-navy-500 mb-1">{{ $t('profile.memberSince') }}</dt>
              <dd class="text-sm text-navy-900">{{ formatDate(user.created_at) }}</dd>
            </div>

            <div v-if="user.last_sign_in_at" class="p-3 bg-stone-50 rounded-lg">
              <dt class="text-xs font-medium text-navy-500 mb-1">{{ $t('profile.lastLogin') }}</dt>
              <dd class="text-sm text-navy-900">{{ formatDate(user.last_sign_in_at) }}</dd>
            </div>
          </div>
        </div>

        <!-- Activity Summary -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="card text-center p-4">
            <div class="text-2xl font-bold text-amber-600 font-display">{{ savedCount }}</div>
            <div class="text-xs text-navy-600 mt-1">{{ $t('profile.savedGrants') }}</div>
          </div>
          <div class="card text-center p-4">
            <div class="text-2xl font-bold text-blue-600 font-display">{{ remindersCount }}</div>
            <div class="text-xs text-navy-600 mt-1">{{ $t('profile.reminders') }}</div>
          </div>
          <div class="card text-center p-4">
            <div class="text-2xl font-bold text-sage-600 font-display">{{ notesCount }}</div>
            <div class="text-xs text-navy-600 mt-1">{{ $t('profile.notes') }}</div>
          </div>
          <div class="card text-center p-4">
            <div class="text-2xl font-bold text-navy-600 font-display">{{ searchesCount }}</div>
            <div class="text-xs text-navy-600 mt-1">{{ $t('profile.searches') }}</div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <h3 class="section-title mb-4">{{ $t('profile.quickLinks') }}</h3>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <router-link to="/cso" class="p-3 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-3 group">
              <div class="w-9 h-9 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <svg class="w-4 h-4 text-navy-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
              <span class="text-sm font-medium text-navy-700">{{ $t('nav.organizations') }}</span>
            </router-link>
            <router-link to="/saved" class="p-3 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-3 group">
              <div class="w-9 h-9 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <svg class="w-4 h-4 text-navy-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
              </div>
              <span class="text-sm font-medium text-navy-700">{{ $t('nav.saved') }}</span>
            </router-link>
            <router-link to="/settings" class="p-3 bg-stone-50 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-3 group">
              <div class="w-9 h-9 bg-navy-100 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <svg class="w-4 h-4 text-navy-600 group-hover:text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <span class="text-sm font-medium text-navy-700">{{ $t('nav.settings') }}</span>
            </router-link>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <router-link to="/settings" class="btn btn-outline">
            {{ $t('profile.editSettings') }}
          </router-link>
          <button @click="handleLogout" class="btn btn-outline text-red-600 border-red-300 hover:bg-red-50">
            {{ $t('profile.logout') }}
          </button>
        </div>
      </div>

      <!-- Not Logged In State -->
      <div v-else class="card-premium text-center py-16">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('profile.notLoggedIn') }}</h2>
        <p class="text-navy-600 mb-6">{{ $t('profile.pleaseLogin') }}</p>
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
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { usePageTitle } from '@/lib/usePageTitle'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()
usePageTitle(t('profile.title'))

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  const name = user.value?.user_metadata?.full_name
  if (name) {
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }
  return (user.value?.email || 'U').substring(0, 2).toUpperCase()
})

// Activity stats from localStorage
const savedCount = computed(() => {
  try { return JSON.parse(localStorage.getItem('savedGrants') || '[]').length }
  catch { return 0 }
})
const remindersCount = computed(() => {
  try { return JSON.parse(localStorage.getItem('grantReminders') || '[]').length }
  catch { return 0 }
})
const notesCount = computed(() => {
  try { return Object.keys(JSON.parse(localStorage.getItem('grantNotes') || '{}')).length }
  catch { return 0 }
})
const searchesCount = computed(() => {
  try { return JSON.parse(localStorage.getItem('recentSearches') || '[]').length }
  catch { return 0 }
})

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
