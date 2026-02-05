<template>
  <AppLayout>
    <div class="max-w-3xl mx-auto">
      <div class="mb-8 animate-fade-in">
        <BreadcrumbNav :crumbs="[
          { label: $t('nav.organizations'), to: '/cso' },
          { label: $t('csoCreate.title') }
        ]" />
        <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('csoCreate.title') }}</h1>
        <p class="text-navy-600">{{ $t('csoCreate.subtitle') }}</p>
      </div>

      <!-- Option Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        <!-- Smart Onboarding -->
        <router-link
          to="/cso/smart"
          class="card-premium hover:shadow-lg transition-all group cursor-pointer border-2 border-transparent hover:border-amber-300"
        >
          <div class="flex flex-col items-center text-center py-4">
            <div class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-2">{{ $t('csoCreate.smartTitle') }}</h3>
            <p class="text-sm text-navy-600 mb-3">{{ $t('csoCreate.smartDesc') }}</p>
            <span class="badge badge-warning">{{ $t('csoCreate.recommended') }}</span>
          </div>
        </router-link>

        <!-- Manual Setup -->
        <router-link
          to="/onboarding/setup"
          class="card-premium hover:shadow-lg transition-all group cursor-pointer border-2 border-transparent hover:border-navy-300"
        >
          <div class="flex flex-col items-center text-center py-4">
            <div class="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-2">{{ $t('csoCreate.manualTitle') }}</h3>
            <p class="text-sm text-navy-600">{{ $t('csoCreate.manualDesc') }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/AppLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
</script>
