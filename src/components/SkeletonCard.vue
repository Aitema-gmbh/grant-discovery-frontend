<template>
  <div class="bg-white rounded-2xl p-6 border border-navy-100 animate-pulse">
    <!-- Category strip -->
    <div class="absolute top-0 left-0 w-1 h-full bg-navy-200 rounded-l-2xl"></div>

    <!-- Title -->
    <div class="h-5 bg-navy-200 rounded w-4/5 mb-3"></div>
    <div class="h-4 bg-navy-100 rounded w-2/5 mb-4"></div>

    <!-- Description -->
    <div class="space-y-2 mb-4">
      <div class="h-3 bg-navy-100 rounded w-full"></div>
      <div class="h-3 bg-navy-100 rounded w-11/12"></div>
      <div class="h-3 bg-navy-100 rounded w-3/4"></div>
    </div>

    <!-- Metadata -->
    <div class="space-y-2 mb-4">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-amber-200 rounded"></div>
        <div class="h-3 bg-amber-100 rounded w-1/3"></div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-navy-200 rounded"></div>
        <div class="h-3 bg-navy-100 rounded w-2/5"></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="pt-4 border-t border-navy-100 flex items-center justify-between">
      <div class="h-6 bg-sage-100 rounded-full w-16"></div>
      <div class="h-6 bg-navy-100 rounded-full w-24"></div>
    </div>
  </div>
</template>
