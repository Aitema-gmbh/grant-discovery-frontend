<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">{{ $t('notFound.title') }}</h1>
      <p class="text-xl text-gray-600 mb-8">{{ $t('notFound.message') }}</p>
      <router-link to="/" class="btn btn-primary">
        {{ $t('notFound.goHome') }}
      </router-link>
    </div>
  </div>
</template>
