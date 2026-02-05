/**
 * Authentication Store (Pinia)
 *
 * Manages user authentication state and operations
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { AuthError } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // =============================================================================
  // STATE
  // =============================================================================

  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // =============================================================================
  // COMPUTED
  // =============================================================================

  const isAuthenticated = computed(() => !!session.value)
  const accessToken = computed(() => session.value?.access_token)
  const userEmail = computed(() => user.value?.email || '')
  const userId = computed(() => user.value?.id || '')

  // =============================================================================
  // ACTIONS
  // =============================================================================

  const initialized = ref(false)
  const serviceUnavailable = ref(false)

  /**
   * Initialize auth state from stored session
   * Gracefully handles Supabase being unreachable
   */
  async function initialize() {
    if (initialized.value) return

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user || null
      serviceUnavailable.value = false

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event: string, newSession: Session | null) => {
        session.value = newSession
        user.value = newSession?.user || null

        if (_event === 'SIGNED_OUT') {
          error.value = null
        }
      })
    } catch (err) {
      console.warn('Auth service unavailable:', err)
      serviceUnavailable.value = true
      session.value = null
      user.value = null
    } finally {
      initialized.value = true
    }
  }

  /**
   * Sign up with email and password
   */
  async function signup(email: string, password: string, fullName: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // If email confirmation is required, user won't be logged in yet
      if (data.session) {
        session.value = data.session
        user.value = data.user
      }

      return { success: true, requiresEmailConfirmation: !data.session }
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Signup failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with email and password
   */
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        throw signInError
      }

      session.value = data.session
      user.value = data.user

      return { success: true }
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with Google OAuth
   */
  async function loginWithGoogle() {
    loading.value = true
    error.value = null

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (oauthError) {
        throw oauthError
      }

      return { success: true, url: data.url }
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Google login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign out
   */
  async function logout() {
    loading.value = true

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        throw signOutError
      }

      session.value = null
      user.value = null
      error.value = null
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Logout failed'
      console.error('Logout error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Request password reset email
   */
  async function resetPassword(email: string) {
    loading.value = true
    error.value = null

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) {
        throw resetError
      }

      return { success: true }
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Password reset failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update password (for logged-in users)
   */
  async function updatePassword(newPassword: string) {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) {
        throw updateError
      }

      return { success: true }
    } catch (err) {
      error.value = err instanceof AuthError ? err.message : 'Password update failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // =============================================================================
  // RETURN
  // =============================================================================

  return {
    // State
    user,
    session,
    loading,
    error,
    initialized,
    serviceUnavailable,

    // Computed
    isAuthenticated,
    accessToken,
    userEmail,
    userId,

    // Actions
    initialize,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updatePassword,
  }
})
