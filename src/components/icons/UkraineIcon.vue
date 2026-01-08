<script setup lang="ts">
/**
 * UkraineIcons - Custom Ukraine-themed icon library
 * Colors: Ukraine Blue (#0057B7) and Gold (#FFD700)
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  name: 'grant' | 'match' | 'organization' | 'calendar' | 'euro' | 'search' | 'sunflower' | 'dashboard' | 'success' | 'arrow-right'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'gold' | 'gradient' | 'current'
}>(), {
  size: 'md',
  color: 'gradient'
})

const sizeClasses = computed(() => ({
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
})[props.size])

const colorClass = computed(() => ({
  blue: 'text-ukraine-blue-500',
  gold: 'text-ukraine-gold-500',
  gradient: '',
  current: 'text-current'
})[props.color])
</script>

<template>
  <svg 
    :class="[sizeClasses, colorClass]" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Grant Icon: Document with wheat -->
    <template v-if="name === 'grant'">
      <defs v-if="color === 'gradient'">
        <linearGradient id="grant-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0057B7"/>
          <stop offset="100%" stop-color="#FFD700"/>
        </linearGradient>
      </defs>
      <path 
        d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" 
        :fill="color === 'gradient' ? 'url(#grant-gradient)' : 'currentColor'"
      />
      <path d="M14 2v6h6" stroke="white" stroke-width="1.5"/>
      <path d="M12 11c0-2 1-3 2-4M12 11c0-2-1-3-2-4M12 11v5" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
    </template>

    <!-- Match Icon: Handshake -->
    <template v-else-if="name === 'match'">
      <defs v-if="color === 'gradient'">
        <linearGradient id="match-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0057B7"/>
          <stop offset="100%" stop-color="#FFD700"/>
        </linearGradient>
      </defs>
      <path 
        d="M2 11l4-4 3 3 2-2 4 4M22 11l-4-4-3 3-2-2" 
        stroke-width="2" 
        stroke-linecap="round"
        :stroke="color === 'gradient' ? 'url(#match-gradient)' : 'currentColor'"
      />
      <path 
        d="M7 18h2l6-5-3-3-5 5v3z" 
        :fill="color === 'gradient' ? '#0057B7' : 'currentColor'"
      />
      <path 
        d="M17 18h-2l-4-3 2-2 4 3v2z" 
        :fill="color === 'gradient' ? '#FFD700' : 'currentColor'"
      />
    </template>

    <!-- Organization Icon: Building -->
    <template v-else-if="name === 'organization'">
      <defs v-if="color === 'gradient'">
        <linearGradient id="org-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0057B7"/>
          <stop offset="100%" stop-color="#FFD700"/>
        </linearGradient>
      </defs>
      <path 
        d="M3 21V9a2 2 0 012-2h14a2 2 0 012 2v12" 
        :fill="color === 'gradient' ? 'url(#org-gradient)' : 'currentColor'"
      />
      <path d="M12 7V3l-2 2h4l-2-2" :fill="color === 'gradient' ? '#FFD700' : 'currentColor'"/>
      <rect x="6" y="11" width="3" height="3" fill="white"/>
      <rect x="10.5" y="11" width="3" height="3" fill="white"/>
      <rect x="15" y="11" width="3" height="3" fill="white"/>
      <rect x="10.5" y="16" width="3" height="5" fill="white"/>
    </template>

    <!-- Calendar Icon: with sunflower -->
    <template v-else-if="name === 'calendar'">
      <rect x="3" y="5" width="18" height="16" rx="2" :fill="color === 'gradient' ? '#0057B7' : 'currentColor'"/>
      <path d="M3 10h18" stroke="white" stroke-width="1"/>
      <path d="M7 3v4M17 3v4" stroke-width="2" stroke-linecap="round" :stroke="color === 'gradient' ? '#0057B7' : 'currentColor'"/>
      <circle cx="12" cy="15" r="3" :fill="color === 'gradient' ? '#FFD700' : 'currentColor'"/>
      <path d="M12 11l.5 1-.5.5-.5-.5.5-1zM15 15l-1 .5-.5-.5.5-.5 1 .5zM12 19l-.5-1 .5-.5.5.5-.5 1zM9 15l1-.5.5.5-.5.5-1-.5z" :fill="color === 'gradient' ? '#FFD700' : 'currentColor'"/>
    </template>

    <!-- Euro Icon: with glow -->
    <template v-else-if="name === 'euro'">
      <defs v-if="color === 'gradient'">
        <radialGradient id="euro-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD700"/>
          <stop offset="100%" stop-color="#FFA500"/>
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" :fill="color === 'gradient' ? 'url(#euro-glow)' : 'currentColor'" opacity="0.2"/>
      <circle cx="12" cy="12" r="8" :fill="color === 'gradient' ? 'url(#euro-glow)' : 'currentColor'"/>
      <path d="M15 8c-1.5-1.5-4.5-1.5-5.5 0s-1 4-.5 5.5 2 3 4 3 3-1 3.5-2M8 10h6M8 13h5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </template>

    <!-- Search Icon: globe -->
    <template v-else-if="name === 'search'">
      <circle cx="11" cy="11" r="7" stroke-width="2" :stroke="color === 'gradient' ? '#0057B7' : 'currentColor'" fill="none"/>
      <path d="M21 21l-4-4" stroke-width="2" stroke-linecap="round" :stroke="color === 'gradient' ? '#B8860B' : 'currentColor'"/>
      <ellipse cx="11" cy="11" rx="3" ry="6" stroke-width="1" :stroke="color === 'gradient' ? '#FFD700' : 'currentColor'" fill="none"/>
      <path d="M5 11h12" stroke-width="1" :stroke="color === 'gradient' ? '#FFD700' : 'currentColor'"/>
    </template>

    <!-- Sunflower Icon -->
    <template v-else-if="name === 'sunflower'">
      <circle cx="12" cy="12" r="4" :fill="color === 'gradient' ? '#8B4513' : 'currentColor'"/>
      <g :fill="color === 'gradient' ? '#FFD700' : 'currentColor'">
        <ellipse cx="12" cy="4" rx="2" ry="3"/>
        <ellipse cx="12" cy="20" rx="2" ry="3"/>
        <ellipse cx="4" cy="12" rx="3" ry="2"/>
        <ellipse cx="20" cy="12" rx="3" ry="2"/>
        <ellipse cx="6.3" cy="6.3" rx="2" ry="3" transform="rotate(-45 6.3 6.3)"/>
        <ellipse cx="17.7" cy="17.7" rx="2" ry="3" transform="rotate(-45 17.7 17.7)"/>
        <ellipse cx="17.7" cy="6.3" rx="2" ry="3" transform="rotate(45 17.7 6.3)"/>
        <ellipse cx="6.3" cy="17.7" rx="2" ry="3" transform="rotate(45 6.3 17.7)"/>
      </g>
    </template>

    <!-- Dashboard Icon -->
    <template v-else-if="name === 'dashboard'">
      <rect x="3" y="3" width="8" height="8" rx="1" :fill="color === 'gradient' ? '#0057B7' : 'currentColor'"/>
      <rect x="13" y="3" width="8" height="5" rx="1" :fill="color === 'gradient' ? '#FFD700' : 'currentColor'"/>
      <rect x="13" y="10" width="8" height="11" rx="1" :fill="color === 'gradient' ? '#0057B7' : 'currentColor'"/>
      <rect x="3" y="13" width="8" height="8" rx="1" :fill="color === 'gradient' ? '#FFD700' : 'currentColor'"/>
    </template>

    <!-- Success Icon: Checkmark with wreath -->
    <template v-else-if="name === 'success'">
      <circle cx="12" cy="12" r="10" :fill="color === 'gradient' ? '#FFD700' : 'currentColor'" opacity="0.2"/>
      <circle cx="12" cy="12" r="8" :fill="color === 'gradient' ? '#10b981' : 'currentColor'"/>
      <path d="M8 12l3 3 5-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </template>

    <!-- Arrow Right -->
    <template v-else-if="name === 'arrow-right'">
      <path 
        d="M5 12h14M13 6l6 6-6 6" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        :stroke="color === 'gradient' ? '#0057B7' : 'currentColor'"
      />
    </template>
  </svg>
</template>
