<script setup lang="ts">
/**
 * EmptyState - Ukraine-themed empty state with sad sunflower
 */
import { computed } from 'vue'
import emptyStateImage from '@/assets/empty-state.png'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  actionText?: string
  variant?: 'default' | 'search' | 'grants'
}>(), {
  title: 'No results found',
  description: 'Try adjusting your search or filters',
  variant: 'default'
})

const emit = defineEmits<{
  action: []
}>()

const variantText = computed(() => ({
  default: { title: 'No results found', desc: 'Try adjusting your search or filters' },
  search: { title: 'No matches', desc: 'We couldn\'t find any grants matching your criteria' },
  grants: { title: 'No grants yet', desc: 'Check back later for new opportunities' }
})[props.variant])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <!-- Sad Sunflower Illustration -->
    <div class="mb-8 animate-float">
      <img 
        :src="emptyStateImage" 
        alt="No results" 
        class="w-48 h-48 object-contain opacity-90"
      />
    </div>
    
    <!-- Text -->
    <h3 class="text-xl font-display font-semibold text-navy-800 mb-2">
      {{ title || variantText.title }}
    </h3>
    <p class="text-navy-600 max-w-sm mb-6">
      {{ description || variantText.desc }}
    </p>
    
    <!-- Action Button -->
    <button 
      v-if="actionText" 
      @click="emit('action')"
      class="btn-ukraine"
    >
      {{ actionText }}
    </button>
  </div>
</template>
