<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full animate-fade-in">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-blue-500 to-amber-400 rounded-2xl shadow-soft-lg mb-4">
          <span class="text-3xl">🇺🇦</span>
        </div>
        <h1 class="text-display-md font-display text-navy-900 mb-2 gradient-text">
          {{ $t('auth.resetPasswordTitle') }}
        </h1>
        <p class="text-lg text-navy-600 font-sans">
          {{ $t('auth.resetPasswordSubtitle') }}
        </p>
      </div>

      <!-- Main Card -->
      <div class="card-premium animate-slide-up">
        <!-- Success Message -->
        <div v-if="success" class="text-center py-4">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="text-navy-800 font-medium mb-4">{{ $t('auth.passwordUpdated') }}</p>
          <router-link to="/auth/login" class="btn btn-primary">
            {{ $t('auth.backToLogin') }}
          </router-link>
        </div>

        <!-- Error Message -->
        <div
          v-if="error"
          class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg animate-scale-in"
        >
          <p class="text-sm font-medium text-red-800">{{ error }}</p>
        </div>

        <!-- Password Reset Form -->
        <form v-if="!success" @submit.prevent="handleReset" class="space-y-6">
          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-navy-700">
              {{ $t('auth.newPassword') }}
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              minlength="8"
              class="input"
              :placeholder="$t('auth.newPasswordPlaceholder')"
            />
          </div>

          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium text-navy-700">
              {{ $t('auth.confirmNewPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="input"
              :placeholder="$t('auth.confirmNewPasswordPlaceholder')"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading || password !== confirmPassword || password.length < 8"
          >
            <span v-if="loading">{{ $t('auth.updating') }}</span>
            <span v-else>{{ $t('auth.updatePasswordButton') }}</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

onMounted(async () => {
  // Supabase sets the session from the URL hash automatically
  // Wait briefly for it to be processed
  await new Promise(resolve => setTimeout(resolve, 500))

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    error.value = 'Invalid or expired reset link. Please request a new one.'
    setTimeout(() => router.push('/auth/login'), 3000)
  }
})

async function handleReset() {
  if (password.value !== confirmPassword.value) return

  loading.value = true
  error.value = null

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (updateError) throw updateError
    success.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update password'
  } finally {
    loading.value = false
  }
}
</script>
