<template>
  <div class="relative inline-block">
    <button
      @mouseenter="show = true"
      @mouseleave="show = false"
      @click="show = !show"
      class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200 transition-colors"
      type="button"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
      </svg>
    </button>

    <div
      v-if="show"
      class="absolute z-50 w-64 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg"
      :class="positionClass"
    >
      <div class="relative">
        <div v-if="title" class="font-semibold mb-1">{{ title }}</div>
        <div>{{ content }}</div>
        <a v-if="link" :href="link" class="text-primary-300 hover:text-primary-200 mt-2 inline-block">
          Learn more →
        </a>
      </div>
      <!-- Arrow -->
      <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45" :class="arrowClass"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title?: string
  content: string
  link?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}>()

const show = ref(false)

const positionClass = computed(() => {
  switch (props.position || 'top') {
    case 'top':
      return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2'
    case 'bottom':
      return 'top-full left-1/2 transform -translate-x-1/2 mt-2'
    case 'left':
      return 'right-full top-1/2 transform -translate-y-1/2 mr-2'
    case 'right':
      return 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }
})

const arrowClass = computed(() => {
  switch (props.position || 'top') {
    case 'top':
      return 'top-full left-1/2 transform -translate-x-1/2 -mt-1'
    case 'bottom':
      return 'bottom-full left-1/2 transform -translate-x-1/2 -mb-1'
    case 'left':
      return 'left-full top-1/2 transform -translate-y-1/2 -ml-1'
    case 'right':
      return 'right-full top-1/2 transform -translate-y-1/2 -mr-1'
  }
})
</script>
