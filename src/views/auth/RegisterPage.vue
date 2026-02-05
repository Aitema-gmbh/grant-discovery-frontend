<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full animate-fade-in">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-blue-500 to-amber-400 rounded-2xl shadow-soft-lg mb-4">
          <span class="text-3xl">🇺🇦</span>
        </div>
        <h1 class="text-display-md font-display text-navy-900 mb-2 gradient-text">
          {{ $t('auth.registerTitle') }}
        </h1>
        <p class="text-lg text-navy-600 font-sans">
          {{ $t('auth.registerSubtitle') }}
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

        <!-- Success Message (after signup, before email verification) -->
        <div
          v-if="registrationSuccess"
          class="mb-6 p-4 bg-sage-50 border-l-4 border-sage-500 rounded-r-lg animate-scale-in"
        >
          <p class="text-sm font-medium text-sage-800">
            ✓ {{ $t('auth.accountCreated') }}
          </p>
        </div>

        <!-- Registration Form -->
        <form v-if="!registrationSuccess" @submit.prevent="handleRegister" class="space-y-6">
          <div class="space-y-2">
            <label for="fullName" class="block text-sm font-medium text-navy-700">
              {{ $t('auth.fullName') }}
            </label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              required
              autocomplete="name"
              class="input"
              :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-200': nameError }"
              :placeholder="$t('auth.fullNamePlaceholder')"
              @blur="nameTouched = true"
            />
            <p v-if="nameError" class="text-xs text-red-600 mt-1 animate-fade-in">
              {{ nameError }}
            </p>
          </div>

          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-navy-700">
              {{ $t('auth.email') }}
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="input"
              :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-200': emailError }"
              :placeholder="$t('auth.emailPlaceholder')"
              @blur="emailTouched = true"
            />
            <p v-if="emailError" class="text-xs text-red-600 mt-1 animate-fade-in">
              {{ emailError }}
            </p>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-navy-700">
              {{ $t('auth.password') }}
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="new-password"
              class="input"
              :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-200': passwordError }"
              placeholder="••••••••"
              minlength="8"
              @blur="passwordTouched = true"
            />
            <!-- Password Strength Indicator -->
            <div v-if="password" class="mt-2">
              <div class="flex gap-1 mb-1">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="h-1 flex-1 rounded-full transition-colors duration-300"
                  :class="i <= passwordStrength.level ? passwordStrength.color : 'bg-navy-200'"
                ></div>
              </div>
              <p class="text-xs" :class="passwordStrength.textColor">
                {{ passwordStrength.label }}
              </p>
            </div>
            <p v-else class="text-xs text-navy-500">
              {{ $t('auth.passwordHint') }}
            </p>
            <p v-if="passwordError" class="text-xs text-red-600 mt-1 animate-fade-in">
              {{ passwordError }}
            </p>
          </div>

          <div class="space-y-2">
            <label for="confirmPassword" class="block text-sm font-medium text-navy-700">
              {{ $t('auth.confirmPassword') }}
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              required
              autocomplete="new-password"
              class="input"
              :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-200': passwordMismatch }"
              placeholder="••••••••"
              @blur="confirmTouched = true"
            />
            <p v-if="passwordMismatch" class="text-xs text-red-600 mt-1 animate-fade-in">
              {{ $t('auth.passwordsDontMatch') }}
            </p>
          </div>

          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="acceptedTerms"
                type="checkbox"
                required
                class="h-4 w-4 text-navy-900 focus:ring-navy-500 border-navy-300 rounded"
              />
            </div>
            <div class="ml-2 text-sm">
              <label for="terms" class="text-navy-600">
                {{ $t('auth.termsPrefix') }}
                <a href="/terms" target="_blank" class="text-amber-600 hover:text-amber-700 font-medium">
                  {{ $t('auth.termsOfService') }}
                </a>
                {{ $t('common.and') }}
                <a href="/privacy" target="_blank" class="text-amber-600 hover:text-amber-700 font-medium">
                  {{ $t('auth.privacyPolicy') }}
                </a>
              </label>
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading || passwordMismatch || !acceptedTerms"
            class="btn btn-primary w-full"
          >
            <span v-if="!authStore.loading">{{ $t('auth.createAccount') }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ $t('auth.creatingAccount') }}
            </span>
          </button>
        </form>

        <!-- After successful signup -->
        <div v-else class="text-center py-4">
          <router-link to="/auth/login" class="btn btn-primary w-full">
            {{ $t('auth.goToLogin') }}
          </router-link>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-navy-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-3 bg-white text-navy-500 font-medium">{{ $t('auth.orSignUpWith') }}</span>
          </div>
        </div>

        <!-- Google OAuth -->
        <button
          @click="handleGoogleSignup"
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
          {{ $t('auth.googleSignUp') }}
        </button>

        <!-- Sign in link -->
        <div class="mt-8 pt-6 border-t border-navy-100">
          <p class="text-center text-sm text-navy-600">
            {{ $t('auth.hasAccount') }}
            <router-link
              to="/auth/login"
              class="font-medium text-amber-600 hover:text-amber-700 transition-colors duration-200"
            >
              {{ $t('auth.signIn') }}
            </router-link>
          </p>
        </div>
      </div>

      <!-- Trust Indicators -->
      <div class="mt-8 text-center">
        <p class="text-xs text-navy-500">
          🔒 {{ $t('auth.dataSecure') }}
        </p>
        <p class="text-xs text-navy-400 mt-1">
          {{ $t('auth.joinOrgs') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptedTerms = ref(false)
const registrationSuccess = ref(false)

// Touched state for validation
const nameTouched = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)
const confirmTouched = ref(false)

// Validation
const nameError = computed(() => {
  if (!nameTouched.value || !fullName.value) return ''
  if (fullName.value.trim().length < 2) return t('validation.nameTooShort')
  return ''
})

const emailError = computed(() => {
  if (!emailTouched.value || !email.value) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) return t('validation.emailInvalid')
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value || !password.value) return ''
  if (password.value.length < 8) return t('validation.passwordMin8')
  return ''
})

const passwordMismatch = computed(() => {
  return confirmTouched.value && password.value && confirmPassword.value && password.value !== confirmPassword.value
})

// Password strength
const passwordStrength = computed(() => {
  const pw = password.value
  if (!pw) return { level: 0, label: '', color: '', textColor: '' }

  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { level: 1, label: t('validation.strengthWeak'), color: 'bg-red-500', textColor: 'text-red-600' }
  if (score === 2) return { level: 2, label: t('validation.strengthFair'), color: 'bg-amber-500', textColor: 'text-amber-600' }
  if (score === 3) return { level: 3, label: t('validation.strengthGood'), color: 'bg-sage-500', textColor: 'text-sage-600' }
  return { level: 4, label: t('validation.strengthStrong'), color: 'bg-green-500', textColor: 'text-green-600' }
})

async function handleRegister() {
  if (passwordMismatch.value || !acceptedTerms.value) {
    return
  }

  try {
    const result = await authStore.signup(email.value, password.value, fullName.value)

    if (result && result.requiresEmailConfirmation) {
      registrationSuccess.value = true
    } else {
      // Auto-logged in, redirect to dashboard
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

async function handleGoogleSignup() {
  try {
    await authStore.loginWithGoogle()
    // Redirect will happen automatically via OAuth flow
  } catch (error) {
    console.error('Google signup failed:', error)
  }
}
</script>
