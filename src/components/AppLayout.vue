<template>
  <div class="min-h-screen bg-stone-50">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-soft border-b border-navy-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <router-link to="/dashboard" class="flex items-center gap-3 group">
              <img src="@/assets/logo.png" alt="Grants Bridge Ukraine" class="w-12 h-12 rounded-xl shadow-glass group-hover:shadow-float transition-shadow duration-300" />
              <div>
                <h1 class="text-xl font-display font-bold text-navy-900">Grants Bridge Ukraine</h1>
                <p class="text-xs text-navy-500 font-sans">Connecting CSOs with Funding</p>
              </div>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center gap-8">
            <router-link
              to="/dashboard"
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ $t('nav.dashboard') }}
            </router-link>
            <router-link
              to="/grants"
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ $t('nav.grants') }}
            </router-link>
            <router-link
              to="/matches"
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ $t('nav.matches') }}
            </router-link>
            <router-link
              to="/cso"
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ $t('nav.organizations') }}
            </router-link>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <!-- Language Switcher -->
            <LanguageSwitcher />
            
            <!-- Notifications Bell -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2 text-navy-400 hover:text-amber-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="hasNotifications" class="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full shadow-glow-amber"></span>
              </button>

              <!-- Notifications Dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-soft-lg border border-navy-100 py-2 z-50 animate-scale-in"
              >
                <div class="px-4 py-3 border-b border-navy-100">
                  <p class="text-sm font-semibold text-navy-900">Notifications</p>
                </div>
                <div v-if="notifications.length === 0" class="px-4 py-6 text-center text-navy-400">
                  <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p class="text-sm">No notifications yet</p>
                </div>
                <div v-else class="max-h-64 overflow-y-auto">
                  <div
                    v-for="(notif, index) in notifications"
                    :key="index"
                    class="px-4 py-3 hover:bg-navy-50 cursor-pointer border-b border-navy-50 last:border-0"
                  >
                    <p class="text-sm text-navy-700">{{ notif.message }}</p>
                    <p class="text-xs text-navy-400 mt-1">{{ notif.time }}</p>
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-navy-100">
                  <button
                    @click="clearNotifications"
                    class="text-xs text-amber-600 hover:text-amber-700"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>

            <div class="relative" v-if="authStore.isAuthenticated">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 p-2 rounded-xl hover:bg-navy-50 transition-colors"
              >
                <div class="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center shadow-inner-soft">
                  <span class="text-amber-800 font-semibold text-sm font-display">
                    {{ userInitials }}
                  </span>
                </div>
                <svg class="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-56 sm:w-56 bg-white rounded-xl shadow-soft-lg border border-navy-100 py-2 z-50 animate-scale-in"
              >
                <div class="px-4 py-3 border-b border-navy-100">
                  <p class="text-sm font-semibold text-navy-900">{{ userName }}</p>
                  <p class="text-xs text-navy-500 mt-1">{{ userEmail }}</p>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                  @click="showUserMenu = false"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    {{ $t('nav.profile') }}
                  </div>
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                  @click="showUserMenu = false"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ $t('nav.settings') }}
                  </div>
                </router-link>
                <hr class="my-2 border-navy-100">
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    {{ $t('nav.logout') }}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-navy-100 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p class="text-sm font-medium text-navy-700">
              🇺🇦 Grants Bridge Ukraine
            </p>
            <p class="text-xs text-navy-500 mt-1">
              © 2026 Supporting Ukrainian Civil Society. Powered by AI.
            </p>
          </div>
          <div class="flex gap-6">
            <a href="#" class="text-sm text-navy-600 hover:text-amber-600 transition-colors">Privacy</a>
            <a href="#" class="text-sm text-navy-600 hover:text-amber-600 transition-colors">Terms</a>
            <a href="#" class="text-sm text-navy-600 hover:text-amber-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const router = useRouter()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const showNotifications = ref(false)

// Notifications state (placeholder - can be connected to real backend later)
interface Notification {
  message: string
  time: string
  read: boolean
}

const notifications = ref<Notification[]>([
  { message: 'Welcome to Grants Bridge Ukraine! Start by creating your organization profile.', time: 'Just now', read: false }
])

const hasNotifications = computed(() => notifications.value.some(n => !n.read))

function clearNotifications() {
  notifications.value = notifications.value.map(n => ({ ...n, read: true }))
  showNotifications.value = false
}

const userInitials = computed(() => {
  const name = authStore.user?.user_metadata?.full_name
  if (name) {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }
  const email = authStore.user?.email || ''
  return email.substring(0, 2).toUpperCase()
})

const userName = computed(() => {
  return authStore.user?.user_metadata?.full_name || 'User'
})

const userEmail = computed(() => {
  return authStore.user?.email || ''
})

async function handleLogout() {
  showUserMenu.value = false
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<style scoped>
.nav-link {
  @apply text-navy-600 hover:text-navy-900 font-medium transition-colors duration-200 relative;
}

.nav-link-active {
  @apply text-amber-600 font-semibold;
}

.nav-link-active::after {
  content: '';
  @apply absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600;
}
</style>
