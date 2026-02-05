<template>
  <AppLayout>
    <div class="mb-8 animate-fade-in">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-display-sm font-display text-navy-900 mb-2">{{ $t('proposals.title') }}</h1>
          <p class="text-navy-600">{{ $t('proposals.subtitle') }}</p>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="card-premium animate-pulse">
        <div class="flex items-center justify-between mb-4">
          <div class="h-5 bg-navy-200 rounded w-2/5"></div>
          <div class="h-6 bg-amber-100 rounded-full w-20"></div>
        </div>
        <div class="h-4 bg-navy-100 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-navy-100 rounded w-1/2 mb-3"></div>
        <div class="flex items-center gap-4">
          <div class="h-3 bg-navy-100 rounded w-24"></div>
          <div class="h-3 bg-navy-100 rounded w-20"></div>
        </div>
      </div>
    </div>

    <!-- Proposals List -->
    <div v-else-if="proposals.length > 0" class="space-y-4">
      <div
        v-for="proposal in proposals"
        :key="proposal.id"
        class="card-premium hover:shadow-lg cursor-pointer transition-all"
        @click="viewProposal(proposal)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-navy-900 font-display mb-1">
              {{ proposal.title }}
            </h3>
            <p class="text-sm text-navy-600 mb-3">
              {{ $t('proposals.created') }} {{ formatDate(proposal.created_at) }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span :class="statusBadge(proposal.status)">
                {{ proposal.status }}
              </span>
              <span v-if="proposal.total_budget" class="badge">
                €{{ proposal.total_budget.toLocaleString() }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click.stop="generateSections(proposal.id)"
              class="btn btn-outline btn-sm"
            >
              {{ $t('proposals.aiGenerate') }}
            </button>
            <button
              @click.stop="viewProposal(proposal)"
              class="btn btn-primary btn-sm"
            >
              {{ $t('proposals.view') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-navy-100 rounded-full mb-6">
        <svg class="w-10 h-10 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-2xl font-display font-semibold text-navy-900 mb-2">{{ $t('proposals.noProposals') }}</h3>
      <p class="text-navy-600 mb-6 max-w-md mx-auto">
        {{ $t('proposals.noProposalsDesc') }}
      </p>
      <router-link to="/grants" class="btn btn-primary">
        {{ $t('proposals.browseGrants') }}
      </router-link>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'

const router = useRouter()
const toast = useToast()
const loading = ref(true)
const proposals = ref<any[]>([])

async function loadProposals() {
  loading.value = true
  try {
    const response = await api.get('/api/proposals')
    proposals.value = response.data.proposals || []
  } catch (error) {
    console.error('Error loading proposals:', error)
    toast.error('Failed to load proposals. Please try again.')
    proposals.value = []
  } finally {
    loading.value = false
  }
}

function viewProposal(proposal: any) {
  router.push(`/proposals/${proposal.id}`)
}

function generateSections(proposalId: string) {
  // TODO: Open modal to select section types and generate
  console.log('Generate sections for', proposalId)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function statusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'draft':
      return 'badge'
    case 'in_review':
      return 'badge badge-info'
    case 'approved':
      return 'badge badge-success'
    case 'submitted':
      return 'badge badge-success'
    case 'rejected':
      return 'px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700'
    default:
      return 'badge'
  }
}

onMounted(() => {
  loadProposals()
})
</script>
