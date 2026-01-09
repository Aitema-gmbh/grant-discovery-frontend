<script setup lang="ts">
import { ref } from 'vue'
import FeedbackModal from './FeedbackModal.vue'

const isModalOpen = ref(false)
</script>

<template>
  <!-- Floating Feedback Button -->
  <button
    @click="isModalOpen = true"
    class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all hover:scale-110 flex items-center gap-2"
    title="Report a bug or give feedback"
    aria-label="Report feedback"
  >
    <svg
      class="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span class="hidden md:inline text-sm font-medium">Feedback</span>
  </button>

  <!-- Feedback Modal -->
  <FeedbackModal v-if="isModalOpen" @close="isModalOpen = false" />
</template>

<style scoped>
button {
  animation: pulse-subtle 2s infinite;
}

@keyframes pulse-subtle {
  0%, 100% {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  50% {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2);
  }
}
</style>
