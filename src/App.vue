<template>
  <div id="app" class="min-h-screen">
    <router-view v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" :key="$route.path" />
      </Transition>
    </router-view>
    <OnboardingTour ref="tourRef" />
    <FeedbackButton />
    <CommandPalette v-if="showCommandPalette" @close="showCommandPalette = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from './stores/auth'
import OnboardingTour from './components/OnboardingTour.vue'
import FeedbackButton from './components/FeedbackButton.vue'
import CommandPalette from './components/CommandPalette.vue'

const authStore = useAuthStore()
const tourRef = ref()
const showCommandPalette = ref(false)

// Global keyboard shortcut: Cmd+K (Mac) / Ctrl+K (Windows/Linux)
function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    showCommandPalette.value = !showCommandPalette.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

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
/* Route transition animations */
.page-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-leave-active {
  transition: opacity 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
}
</style>
