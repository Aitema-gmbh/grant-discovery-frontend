/**
 * Vue Router Configuration
 *
 * Handles routing and navigation guards for authentication
 */

import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/grants',
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/auth/LoginPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/auth/callback',
    name: 'callback',
    component: () => import('@/views/auth/CallbackPage.vue'),
  },
  {
    path: '/grants',
    name: 'grants',
    component: () => import('@/views/GrantsPage.vue'),
    meta: { requiresAuth: false }, // Public page
  },
  {
    path: '/grants/:id',
    name: 'grant-detail',
    component: () => import('@/views/GrantDetailPage.vue'),
    meta: { requiresAuth: false }, // Public page
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cso',
    name: 'cso-list',
    component: () => import('@/views/CSOListPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cso/create',
    name: 'cso-create',
    component: () => import('@/views/CSOCreatePage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cso/smart',
    name: 'smart-onboarding',
    component: () => import('@/views/SmartOnboardingPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cso/:id',
    name: 'cso-detail',
    component: () => import('@/views/CSODetailPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/matches',
    name: 'matches',
    component: () => import('@/views/MatchesPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/proposals',
    name: 'proposals',
    component: () => import('@/views/ProposalsPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/proposals/new',
    name: 'proposal-wizard',
    component: () => import('@/views/ProposalWizardPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/proposals/:id',
    name: 'proposal-detail',
    component: () => import('@/views/ProposalDetailPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/onboarding/setup',
    name: 'onboarding-setup',
    component: () => import('@/views/onboarding/SetupWizard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundPage.vue'),
  },
]

// Create router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (!authStore.session && !authStore.user) {
    await authStore.initialize()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login page
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Redirect to dashboard if already logged in
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
