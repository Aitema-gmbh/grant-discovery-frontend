<template>
  <AppLayout>
    <div class="mb-8 animate-fade-in">
      <BreadcrumbNav :crumbs="[
        { label: $t('nav.proposals'), to: '/proposals' },
        { label: proposal?.title || $t('common.loading') }
      ]" />
      <h1 class="text-display-sm font-display text-navy-900 mb-2">
        {{ proposal?.title || $t('common.loading') }}
      </h1>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card-premium animate-pulse">
      <div class="h-6 bg-navy-200 rounded w-1/2 mb-4"></div>
      <div class="h-4 bg-navy-100 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-navy-100 rounded w-1/2"></div>
    </div>

    <!-- Proposal content -->
    <div v-else-if="proposal" class="space-y-6">
      <!-- Status card -->
      <div class="card-premium">
        <div class="flex items-center justify-between mb-4">
          <span :class="statusBadge(proposal.status)">{{ proposal.status }}</span>
          <span v-if="proposal.total_budget" class="font-semibold text-navy-900">
            {{ $t('proposalDetail.budget') }} €{{ proposal.total_budget?.toLocaleString() }}
          </span>
        </div>
        <p class="text-sm text-navy-600">
          {{ $t('proposalDetail.created') }} {{ formatDate(proposal.created_at) }}
        </p>
      </div>

      <!-- Outcome Recording (for submitted proposals) -->
      <div v-if="proposal.status === 'submitted'" class="card-premium border-2 border-amber-200 bg-amber-50">
        <h3 class="font-semibold text-navy-900 mb-4">📊 {{ $t('proposalDetail.recordOutcome') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-2">{{ $t('proposalDetail.outcome') }}</label>
            <select v-model="outcomeForm.outcome" class="input w-full">
              <option value="">{{ $t('proposalDetail.selectOutcome') }}</option>
              <option value="awarded">✅ {{ $t('proposalDetail.awarded') }}</option>
              <option value="shortlisted">📋 {{ $t('proposalDetail.shortlisted') }}</option>
              <option value="rejected">❌ {{ $t('proposalDetail.rejected') }}</option>
              <option value="withdrawn">🔙 {{ $t('proposalDetail.withdrawn') }}</option>
              <option value="pending">⏳ {{ $t('proposalDetail.pending') }}</option>
            </select>
          </div>
          <div v-if="outcomeForm.outcome === 'awarded'">
            <label class="block text-sm font-medium text-navy-700 mb-2">{{ $t('proposalDetail.amountAwarded') }}</label>
            <input v-model.number="outcomeForm.amountAwarded" type="number" class="input w-full" placeholder="50000" />
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-2">{{ $t('proposalDetail.feedbackFromFunder') }}</label>
            <textarea v-model="outcomeForm.feedbackFromFunder" class="input w-full" rows="2" :placeholder="$t('proposalDetail.feedbackPlaceholder')"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-2">{{ $t('proposalDetail.lessonsLearned') }}</label>
            <textarea v-model="outcomeForm.lessonsLearned" class="input w-full" rows="2" :placeholder="$t('proposalDetail.lessonsPlaceholder')"></textarea>
          </div>
          <button
            @click="submitOutcome"
            :disabled="!outcomeForm.outcome || submittingOutcome"
            class="btn btn-primary w-full"
            :class="{ 'opacity-50': !outcomeForm.outcome }"
          >
            {{ submittingOutcome ? $t('proposalDetail.savingOutcome') : $t('proposalDetail.saveOutcome') }}
          </button>
        </div>
      </div>

      <!-- Sections -->
      <div v-if="sections.length > 0" class="space-y-4">
        <h2 class="text-xl font-display font-semibold text-navy-900">{{ $t('proposalDetail.proposalSections') }}</h2>
        <div v-for="section in sections" :key="section.section_type" class="card-premium">
          <h3 class="font-semibold text-navy-900 mb-3 capitalize">{{ section.section_type.replace('_', ' ') }}</h3>
          <div class="prose prose-navy max-w-none text-sm" v-html="formatMarkdown(section.content)"></div>
          <div class="mt-4 pt-4 border-t border-navy-100 flex justify-between text-xs text-navy-500">
            <span>{{ section.word_count }} {{ $t('proposalDetail.words') }}</span>
            <span>{{ $t('proposalDetail.generatedBy') }} {{ section.ai_model_used }}</span>
          </div>
        </div>
      </div>

      <!-- No sections yet -->
      <div v-else class="card-premium text-center py-8">
        <p class="text-navy-600 mb-4">{{ $t('proposalDetail.noSectionsYet') }}</p>
        <button class="btn btn-primary">{{ $t('proposalDetail.generateAISections') }}</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import api from '@/services/api'
import { useFeedback } from '@/lib/useFeedback'
import { useToast } from '@/lib/useToast'

const route = useRoute()
const { trackPageView, recordOutcome } = useFeedback()
const toast = useToast()

const loading = ref(true)
const proposal = ref<any>(null)
const sections = ref<any[]>([])
const submittingOutcome = ref(false)

const outcomeForm = ref({
  outcome: '' as '' | 'awarded' | 'rejected' | 'shortlisted' | 'withdrawn' | 'pending',
  amountAwarded: null as number | null,
  feedbackFromFunder: '',
  lessonsLearned: ''
})

async function loadProposal() {
  loading.value = true
  try {
    const response = await api.get(`/api/proposals/${route.params.id}`)
    proposal.value = response.data.proposal
    sections.value = response.data.sections || []
  } catch (error) {
    console.error('Error loading proposal:', error)
  } finally {
    loading.value = false
  }
}

async function submitOutcome() {
  if (!outcomeForm.value.outcome || !proposal.value) return

  submittingOutcome.value = true
  try {
    await recordOutcome(proposal.value.id, outcomeForm.value.outcome as any, {
      amountAwarded: outcomeForm.value.amountAwarded || undefined,
      feedbackFromFunder: outcomeForm.value.feedbackFromFunder || undefined,
      lessonsLearned: outcomeForm.value.lessonsLearned || undefined
    })
    toast.success('Outcome saved successfully')
    // Reload to show updated status
    await loadProposal()
  } catch (error) {
    console.error('Error recording outcome:', error)
    toast.error('Failed to save outcome. Please try again.')
  } finally {
    submittingOutcome.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString()
}

function formatMarkdown(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

function statusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'draft': return 'badge'
    case 'in_review': return 'badge badge-info'
    case 'approved': return 'badge badge-success'
    case 'submitted': return 'badge badge-success'
    default: return 'badge'
  }
}

onMounted(() => {
  trackPageView('proposal_detail', 'proposal', route.params.id as string)
  loadProposal()
})
</script>
