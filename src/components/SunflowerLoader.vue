<script setup lang="ts">
/**
 * SunflowerLoader - Animated Ukraine-themed loading spinner
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  text?: string
}>(), {
  size: 'md'
})

const sizeClasses = computed(() => ({
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20'
})[props.size])
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Animated Sunflower -->
    <div :class="sizeClasses" class="relative animate-spin-slow">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Center -->
        <circle cx="12" cy="12" r="3" fill="#8B4513"/>
        <!-- Petals -->
        <g fill="#FFD700">
          <ellipse cx="12" cy="4" rx="2" ry="3"/>
          <ellipse cx="12" cy="20" rx="2" ry="3"/>
          <ellipse cx="4" cy="12" rx="3" ry="2"/>
          <ellipse cx="20" cy="12" rx="3" ry="2"/>
          <ellipse cx="6.3" cy="6.3" rx="2" ry="3" transform="rotate(-45 6.3 6.3)"/>
          <ellipse cx="17.7" cy="17.7" rx="2" ry="3" transform="rotate(-45 17.7 17.7)"/>
          <ellipse cx="17.7" cy="6.3" rx="2" ry="3" transform="rotate(45 17.7 6.3)"/>
          <ellipse cx="6.3" cy="17.7" rx="2" ry="3" transform="rotate(45 6.3 17.7)"/>
        </g>
      </svg>
    </div>
    
    <!-- Loading Text -->
    <p v-if="text" class="text-sm font-medium text-navy-600 animate-pulse">
      {{ text }}
    </p>
  </div>
</template>
