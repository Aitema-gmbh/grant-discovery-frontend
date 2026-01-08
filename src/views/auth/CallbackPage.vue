<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50">
    <div class="text-center animate-fade-in">
      <!-- Ukraine Flag -->
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-b from-blue-500 to-amber-400 rounded-2xl shadow-soft-lg mb-6">
        <span class="text-4xl">🇺🇦</span>
      </div>

      <!-- Loading Spinner -->
      <div class="mb-6">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-500 mx-auto"></div>
      </div>

      <!-- Loading Message -->
      <h2 class="text-display-sm font-display text-navy-900 mb-2">Completing sign in...</h2>
      <p class="text-navy-600 font-sans">Please wait while we verify your authentication.</p>

      <!-- Error Message -->
      <div v-if="error" class="mt-8 max-w-md mx-auto p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-soft animate-scale-in">
        <p class="text-sm text-red-800 font-medium mb-3">{{ error }}</p>
        <router-link to="/auth/login" class="btn btn-primary">
          Return to login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Handle OAuth callback
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw sessionError
    }

    if (session) {
      // Update auth store with new session
      authStore.session = session
      authStore.user = session.user

      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      // No session found - might be email confirmation or error
      error.value = 'No active session found. Please try signing in again.'
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    }
  } catch (err) {
    console.error('OAuth callback error:', err)
    error.value = err instanceof Error ? err.message : 'Authentication failed'

    // Redirect to login after 3 seconds
    setTimeout(() => {
      router.push('/auth/login')
    }, 3000)
  }
})
</script>
