<template>
  <div class="min-h-screen bg-stone-50">
    <!-- Skip to Content (a11y) -->
    <a href="#main-content" class="skip-link">{{ $t('common.skipToContent') }}</a>

    <!-- Navigation Bar -->
    <nav class="bg-white shadow-soft border-b border-navy-100" role="navigation" :aria-label="$t('nav.mainNavigation')">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <router-link to="/dashboard" class="flex items-center gap-3 group">
              <img src="@/assets/logo.png" alt="Grants Bridge Ukraine" class="w-12 h-12 rounded-xl shadow-glass group-hover:shadow-float transition-shadow duration-300" />
              <div class="hidden sm:block">
                <h1 class="text-xl font-display font-bold text-navy-900">Grants Bridge Ukraine</h1>
                <p class="text-xs text-navy-500 font-sans">Connecting CSOs with Funding</p>
              </div>
            </router-link>
          </div>

          <!-- Navigation Links (Desktop) -->
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
              data-tour="grants"
            >
              {{ $t('nav.grants') }}
            </router-link>
            <router-link
              to="/saved"
              class="nav-link"
              active-class="nav-link-active"
            >
              {{ $t('nav.saved') }}
            </router-link>
            <router-link
              to="/matches"
              class="nav-link"
              active-class="nav-link-active"
              data-tour="matches"
            >
              {{ $t('nav.matches') }}
            </router-link>
            <router-link
              to="/cso"
              class="nav-link"
              active-class="nav-link-active"
              data-tour="cso-profile"
            >
              {{ $t('nav.organizations') }}
            </router-link>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-2 sm:gap-4">
            <!-- Language Switcher -->
            <LanguageSwitcher />

            <!-- Notifications Bell -->
            <div class="relative hidden sm:block">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2.5 text-navy-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-navy-50"
                aria-label="Notifications"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span v-if="hasNotifications" class="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-soft-lg border border-navy-100 py-2 z-50 animate-scale-in"
              >
                <div class="px-4 py-3 border-b border-navy-100">
                  <p class="text-sm font-semibold text-navy-900">{{ $t('nav.notifications') }}</p>
                </div>
                <div v-if="notifications.length === 0" class="px-4 py-6 text-center text-navy-400">
                  <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p class="text-sm">{{ $t('nav.noNotifications') }}</p>
                </div>
                <div v-else class="max-h-64 overflow-y-auto">
                  <router-link
                    v-for="(notif, index) in notifications"
                    :key="index"
                    :to="notif.grantId ? `/grants/${notif.grantId}` : '/saved'"
                    class="block px-4 py-3 hover:bg-navy-50 cursor-pointer border-b border-navy-50 last:border-0 transition-colors"
                    :class="!notif.read ? 'bg-amber-50/50' : ''"
                    @click="showNotifications = false"
                  >
                    <div class="flex items-start gap-2">
                      <span v-if="notif.urgent" class="mt-0.5 flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></span>
                      <span v-else-if="!notif.read" class="mt-0.5 flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm text-navy-700" :class="!notif.read ? 'font-medium' : ''">{{ notif.message }}</p>
                        <p class="text-xs text-navy-400 mt-1">{{ notif.time }}</p>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="px-4 py-2 border-t border-navy-100">
                  <button
                    @click="clearNotifications"
                    class="text-xs text-amber-600 hover:text-amber-700"
                  >
                    {{ $t('nav.markAllRead') }}
                  </button>
                </div>
              </div>
            </div>

            <!-- User Avatar (Desktop) -->
            <div class="relative hidden md:block" v-if="authStore.isAuthenticated">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 p-2 rounded-xl hover:bg-navy-50 transition-colors"
                :aria-label="$t('nav.userMenu')"
                :aria-expanded="showUserMenu"
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
                class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-soft-lg border border-navy-100 py-2 z-50 animate-scale-in"
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

            <!-- Mobile Hamburger Button -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="md:hidden p-3 -mr-1 text-navy-600 hover:text-navy-900 transition-colors rounded-lg hover:bg-navy-50"
              aria-label="Toggle menu"
            >
              <svg v-if="!showMobileMenu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Drawer -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-navy-100 shadow-soft-lg">
          <div class="px-4 py-4 space-y-1">
            <router-link
              to="/dashboard"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
              @click="showMobileMenu = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              {{ $t('nav.dashboard') }}
            </router-link>
            <router-link
              to="/grants"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
              @click="showMobileMenu = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              {{ $t('nav.grants') }}
            </router-link>
            <router-link
              to="/saved"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
              @click="showMobileMenu = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              {{ $t('nav.saved') }}
            </router-link>
            <router-link
              to="/matches"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
              @click="showMobileMenu = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
              {{ $t('nav.matches') }}
            </router-link>
            <router-link
              to="/cso"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
              @click="showMobileMenu = false"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              {{ $t('nav.organizations') }}
            </router-link>

            <!-- Mobile Divider -->
            <hr class="my-3 border-navy-100">

            <!-- User Section (Mobile) -->
            <div v-if="authStore.isAuthenticated">
              <div class="flex items-center gap-3 px-3 py-2 mb-2">
                <div class="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                  <span class="text-amber-800 font-semibold text-xs">{{ userInitials }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-navy-900">{{ userName }}</p>
                  <p class="text-xs text-navy-500">{{ userEmail }}</p>
                </div>
              </div>
              <router-link
                to="/profile"
                class="mobile-nav-link"
                @click="showMobileMenu = false"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ $t('nav.profile') }}
              </router-link>
              <router-link
                to="/settings"
                class="mobile-nav-link"
                @click="showMobileMenu = false"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ $t('nav.settings') }}
              </router-link>
              <button
                @click="handleLogout(); showMobileMenu = false"
                class="mobile-nav-link w-full text-red-600 hover:bg-red-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                {{ $t('nav.logout') }}
              </button>
            </div>

            <!-- Login Button (Mobile, not authenticated) -->
            <div v-else class="pt-2">
              <router-link
                to="/auth/login"
                class="block w-full text-center px-4 py-3 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-colors"
                @click="showMobileMenu = false"
              >
                {{ $t('nav.login') }}
              </router-link>
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <!-- Offline Banner -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="!isOnline" class="bg-amber-500 text-white px-4 py-2.5">
        <div class="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm font-medium">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12h.01"/>
          </svg>
          {{ $t('offline.banner') }}
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main id="main-content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
      <slot />
    </main>

    <!-- Toast Notifications -->
    <ToastContainer />

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
            <router-link to="/grants" class="text-sm text-navy-600 hover:text-amber-600 transition-colors">{{ $t('nav.grants') }}</router-link>
            <router-link to="/settings" class="text-sm text-navy-600 hover:text-amber-600 transition-colors">{{ $t('nav.settings') }}</router-link>
            <a href="mailto:support@aitema.de" class="text-sm text-navy-600 hover:text-amber-600 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useNetworkStatus } from '@/lib/useNetworkStatus'

const { isOnline } = useNetworkStatus()

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showUserMenu = ref(false)
const showNotifications = ref(false)
const showMobileMenu = ref(false)

// Close mobile menu and dropdowns on route change (handles browser back/forward)
watch(() => route.fullPath, () => {
  showMobileMenu.value = false
  showUserMenu.value = false
  showNotifications.value = false
})

// Notifications state
interface Notification {
  message: string
  time: string
  read: boolean
  grantId?: string
  urgent?: boolean
}

// Trigger re-computation on route change (grants may be saved on other pages)
const notificationTrigger = ref(0)
watch(() => route.fullPath, () => { notificationTrigger.value++ })

const notifications = computed<Notification[]>(() => {
  void notificationTrigger.value
  const items: Notification[] = []
  const now = new Date()

  // Check deadline reminders from localStorage
  try {
    const reminders = JSON.parse(localStorage.getItem('grantReminders') || '[]')
    for (const r of reminders) {
      if (!r.deadline) continue
      const deadline = new Date(r.deadline)
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysLeft <= 0 || daysLeft > 14) continue
      items.push({
        message: `${r.title} — ${daysLeft}d left`,
        time: deadline.toLocaleDateString(),
        read: daysLeft > 7,
        grantId: r.grantId,
        urgent: daysLeft <= 3,
      })
    }
  } catch { /* ignore */ }

  return items.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
})

const hasNotifications = computed(() => notifications.value.some(n => !n.read))
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function clearNotifications() {
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
  showMobileMenu.value = false
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

.mobile-nav-link {
  @apply flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-navy-700 hover:bg-navy-50 hover:text-navy-900 transition-colors;
  min-height: 48px; /* WCAG touch target for mobile */
}

.mobile-nav-link-active {
  @apply bg-amber-50 text-amber-700;
}
</style>
