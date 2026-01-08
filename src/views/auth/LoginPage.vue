<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full animate-fade-in">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-blue-500 to-amber-400 rounded-2xl shadow-soft-lg mb-4">
          <span class="text-3xl">🇺🇦</span>
        </div>
        <h1 class="text-display-md font-display text-navy-900 mb-2 gradient-text">
          Grants Bridge Ukraine
        </h1>
        <p class="text-lg text-navy-600 font-sans">
          Sign in to connect with funding opportunities
        </p>
      </div>

      <!-- Main Card -->
      <div class="card-premium animate-slide-up">
        <!-- Error Message -->
        <div
          v-if="authStore.error"
          class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-scale-in"
        >
          <p class="text-sm font-medium text-red-800">{{ authStore.error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-navy-700">
              Email address
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="input"
              placeholder="you@organization.org"
            />
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-navy-700">
                Password
              </label>
              <router-link
                to="/auth/forgot-password"
                class="text-sm link"
              >
                Forgot password?
              </router-link>
            </div>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="input"
              placeholder="••••••••"
            />
          </div>

          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-navy-900 focus:ring-navy-500 border-navy-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-navy-600">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="btn btn-primary w-full"
          >
            <span v-if="!authStore.loading">Sign in to Dashboard</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-navy-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white text-navy-500 font-medium">Or continue with</span>
          </div>
        </div>

        <!-- Google OAuth -->
        <button
          @click="handleGoogleLogin"
          :disabled="authStore.loading"
          class="btn btn-outline w-full"
        >
          <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC04"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <!-- Sign up link -->
        <div class="mt-8 pt-6 border-t border-navy-100">
          <p class="text-center text-sm text-navy-600">
            Don't have an account?
            <router-link
              to="/auth/register"
              class="font-medium text-amber-600 hover:text-amber-700 transition-colors duration-200"
            >
              Create free account
            </router-link>
          </p>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-8 text-center">
        <p class="text-xs text-navy-500">
          🔒 Secured with industry-standard encryption
        </p>
        <p class="text-xs text-navy-400 mt-1">
          Trusted by 500+ civil society organizations worldwide
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}

async function handleGoogleLogin() {
  try {
    await authStore.loginWithGoogle()
    // Redirect will happen automatically via OAuth flow
  } catch (error) {
    console.error('Google login failed:', error)
  }
}
</script>
