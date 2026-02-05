<template>
  <nav class="flex items-center gap-2 text-sm text-navy-500 mb-6 animate-fade-in" aria-label="Breadcrumb">
    <router-link to="/dashboard" class="hover:text-navy-900 transition-colors">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
      </svg>
    </router-link>
    <template v-for="(crumb, index) in crumbs" :key="index">
      <svg class="w-3.5 h-3.5 text-navy-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
      </svg>
      <router-link
        v-if="crumb.to"
        :to="crumb.to"
        class="hover:text-navy-900 transition-colors font-medium"
      >
        {{ crumb.label }}
      </router-link>
      <span v-else class="text-navy-900 font-medium truncate max-w-xs">
        {{ crumb.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
interface Crumb {
  label: string
  to?: string
}

defineProps<{
  crumbs: Crumb[]
}>()
</script>
