<template>
  <div id="app" class="min-h-screen">
    <router-view />
    <OnboardingTour ref="tourRef" />
    <FeedbackButton />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import OnboardingTour from './components/OnboardingTour.vue'
import FeedbackButton from './components/FeedbackButton.vue'

const authStore = useAuthStore()
const tourRef = ref()

// Initialize auth state on app mount
onMounted(async () => {
  await authStore.initialize()

  // Start tour for new users after a short delay
  // This allows the UI to render properly first
  setTimeout(() => {
    if (tourRef.value && authStore.isAuthenticated) {
      tourRef.value.startTour()
    }
  }, 1000)
})
</script>

<style>
/* Global styles are in style.css */
</style>
