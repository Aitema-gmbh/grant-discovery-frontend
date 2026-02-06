<template>
  <!-- Scroll Progress Bar -->
  <div
    v-if="scrollProgress > 0"
    class="fixed top-0 left-0 h-0.5 bg-amber-500 z-50 transition-[width] duration-100"
    :style="{ width: scrollProgress + '%' }"
    role="progressbar"
    :aria-valuenow="Math.round(scrollProgress)"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="$t('common.scrollProgress')"
  ></div>

  <!-- Scroll To Top Button -->
  <Transition name="fade">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 z-40 w-12 h-12 bg-navy-900 text-white rounded-full shadow-lg hover:bg-navy-800 hover:shadow-xl transition-all duration-200 flex items-center justify-center active:scale-95 sm:hidden"
      :aria-label="$t('common.scrollToTop')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollProgress = ref(0)

function handleScroll() {
  isVisible.value = window.scrollY > 300

  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
