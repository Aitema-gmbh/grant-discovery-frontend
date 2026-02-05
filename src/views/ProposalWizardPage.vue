<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto">
      <!-- Header with Progress -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('proposalWizard.title') }}</h1>
        <p class="text-gray-600 mb-6">{{ grantTitle }}</p>

        <!-- Progress Steps -->
        <div class="flex items-center gap-4">
          <div v-for="(stepName, index) in steps" :key="index" class="flex items-center">
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                currentStep > index ? 'bg-primary-600 text-white' :
                currentStep === index ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600' :
                'bg-gray-200 text-gray-600'
              ]"
            >
              <svg v-if="currentStep > index" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span
              :class="['ml-2 text-sm font-medium', currentStep >= index ? 'text-gray-900' : 'text-gray-500']"
            >
              {{ stepName }}
            </span>
            <svg v-if="index < steps.length - 1" class="w-5 h-5 mx-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Step 1: Select CSO -->
      <div v-if="currentStep === 0" class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('proposalWizard.step1.title') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('proposalWizard.step1.subtitle') }}</p>

        <div v-if="loadingCsos" class="animate-pulse space-y-3">
          <div class="h-20 bg-gray-200 rounded-lg"></div>
          <div class="h-20 bg-gray-200 rounded-lg"></div>
        </div>

        <div v-else-if="csos.length === 0" class="text-center py-8">
          <p class="text-gray-600 mb-4">{{ $t('proposalWizard.step1.noCSOProfiles') }}</p>
          <router-link to="/cso/create" class="btn btn-primary">{{ $t('proposalWizard.step1.createCSOProfile') }}</router-link>
        </div>

        <div v-else class="space-y-3">
          <label
            v-for="cso in csos"
            :key="cso.id"
            :class="[
              'block p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedCsoId === cso.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="radio"
              :value="cso.id"
              v-model="selectedCsoId"
              class="sr-only"
              :aria-label="cso.name"
            />
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium text-gray-900">{{ cso.name }}</h3>
                <p class="text-sm text-gray-600">{{ cso.org_type }} - {{ cso.headquarters_country }}</p>
              </div>
              <div v-if="selectedCsoId === cso.id" class="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
          </label>
        </div>

        <div class="flex justify-end mt-6">
          <button
            @click="nextStep"
            :disabled="!selectedCsoId"
            class="btn btn-primary"
          >
            {{ $t('proposalWizard.step1.continue') }}
          </button>
        </div>
      </div>

      <!-- Step 2: Select Sections -->
      <div v-if="currentStep === 1" class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('proposalWizard.step2.title') }}</h2>
        <p class="text-gray-600 mb-6">{{ $t('proposalWizard.step2.subtitle') }}</p>

        <div class="space-y-3">
          <label
            v-for="section in availableSections"
            :key="section.type"
            :class="[
              'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all',
              selectedSections.includes(section.type) ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
            ]"
          >
            <input
              type="checkbox"
              :value="section.type"
              v-model="selectedSections"
              class="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              :aria-label="section.label"
            />
            <div class="ml-4 flex-1">
              <h3 class="font-medium text-gray-900">{{ section.label }}</h3>
              <p class="text-sm text-gray-600">{{ section.description }}</p>
            </div>
            <span
              v-if="section.recommended"
              class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded"
            >
              {{ $t('proposalWizard.step2.recommended') }}
            </span>
          </label>
        </div>

        <div class="flex justify-between mt-6">
          <button @click="prevStep" class="btn btn-outline">{{ $t('proposalWizard.step2.back') }}</button>
          <button
            @click="startGeneration"
            :disabled="selectedSections.length === 0"
            class="btn btn-primary"
          >
            {{ $t('proposalWizard.step2.generateSections', { count: selectedSections.length }) }}
          </button>
        </div>
      </div>

      <!-- Step 3: Generation -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('proposalWizard.step3.title') }}</h2>
          <p class="text-gray-600 mb-6">
            {{ $t('proposalWizard.step3.subtitle') }}
          </p>

          <!-- Overall Progress -->
          <div class="mb-6">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-600">{{ $t('proposalWizard.step3.overallProgress') }}</span>
              <span class="font-medium">{{ completedSections.length }} / {{ selectedSections.length }}</span>
            </div>
            <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" :aria-valuenow="completedSections.length" :aria-valuemax="selectedSections.length" aria-valuemin="0" :aria-label="$t('proposalWizard.step3.overallProgress')">
              <div
                class="h-full bg-primary-600 transition-all duration-500"
                :style="{ width: `${(completedSections.length / selectedSections.length) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Section Cards -->
        <div v-for="sectionType in selectedSections" :key="sectionType" class="card">
          <div class="flex items-center gap-3 mb-4">
            <!-- Status Icon -->
            <div v-if="completedSections.includes(sectionType)" class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div v-else-if="currentGeneratingSection === sectionType" class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div v-else class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
            </div>

            <div>
              <h3 class="font-medium text-gray-900">{{ getSectionLabel(sectionType) }}</h3>
              <p class="text-sm text-gray-500">
                <span v-if="completedSections.includes(sectionType)">{{ $t('proposalWizard.step3.complete') }}</span>
                <span v-else-if="currentGeneratingSection === sectionType">{{ $t('proposalWizard.step3.generating') }}</span>
                <span v-else>{{ $t('proposalWizard.step3.waiting') }}</span>
              </p>
            </div>
          </div>

          <!-- Streaming Content -->
          <div
            v-if="currentGeneratingSection === sectionType || completedSections.includes(sectionType)"
            class="prose max-w-none bg-gray-50 rounded-lg p-4 text-sm"
          >
            <div v-html="formatContent(generatedContent[sectionType] || '')"></div>
            <span v-if="currentGeneratingSection === sectionType" class="inline-block w-2 h-4 bg-primary-600 animate-pulse ml-1"></span>
          </div>
        </div>

        <!-- Completion Actions -->
        <div v-if="generationComplete" class="card bg-green-50 border-green-200">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('proposalWizard.step3.generationComplete') }}</h3>
              <p class="text-gray-600">{{ $t('proposalWizard.step3.generationCompleteDesc') }}</p>
            </div>
            <button @click="viewProposal" class="btn btn-primary">
              {{ $t('proposalWizard.step3.viewProposal') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppLayout from '@/components/AppLayout.vue'
import { useToast } from '@/lib/useToast'
import { csoApi, grantsApi, proposalsApi, type SectionType } from '@/services/api'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()

// Wizard state
const steps = computed(() => [t('proposalWizard.steps.selectOrg'), t('proposalWizard.steps.chooseSections'), t('proposalWizard.steps.generate')])
const currentStep = ref(0)

// Data
const grantId = ref('')
const grantTitle = ref(t('common.loading'))
const csos = ref<any[]>([])
const loadingCsos = ref(true)
const selectedCsoId = ref('')
const proposalId = ref('')

// Section selection
const availableSections = computed(() => [
  { type: 'objectives' as SectionType, label: t('proposalWizard.step2.objectives'), description: t('proposalWizard.step2.objectivesDesc'), recommended: true },
  { type: 'methodology' as SectionType, label: t('proposalWizard.step2.methodology'), description: t('proposalWizard.step2.methodologyDesc'), recommended: true },
  { type: 'impact' as SectionType, label: t('proposalWizard.step2.impact'), description: t('proposalWizard.step2.impactDesc'), recommended: true },
  { type: 'work_plan' as SectionType, label: t('proposalWizard.step2.workPlan'), description: t('proposalWizard.step2.workPlanDesc'), recommended: true },
  { type: 'budget_narrative' as SectionType, label: t('proposalWizard.step2.budgetNarrative'), description: t('proposalWizard.step2.budgetNarrativeDesc'), recommended: false },
  { type: 'sustainability' as SectionType, label: t('proposalWizard.step2.sustainability'), description: t('proposalWizard.step2.sustainabilityDesc'), recommended: false },
  { type: 'background' as SectionType, label: t('proposalWizard.step2.background'), description: t('proposalWizard.step2.backgroundDesc'), recommended: false },
  { type: 'partners' as SectionType, label: t('proposalWizard.step2.partners'), description: t('proposalWizard.step2.partnersDesc'), recommended: false },
])

const selectedSections = ref<SectionType[]>(['objectives', 'methodology', 'impact', 'work_plan'])

// Generation state
const currentGeneratingSection = ref<SectionType | null>(null)
const completedSections = ref<SectionType[]>([])
const generatedContent = ref<Record<string, string>>({})
const generationComplete = computed(() => completedSections.value.length === selectedSections.value.length && selectedSections.value.length > 0)

// Unsaved form warning
const isGenerating = computed(() => currentGeneratingSection.value !== null)

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (isGenerating.value || (currentStep.value > 0 && !generationComplete.value)) {
    e.preventDefault()
  }
}

onBeforeRouteLeave(() => {
  if (isGenerating.value) {
    return window.confirm(t('common.generationInProgress'))
  }
  if (currentStep.value > 0 && !generationComplete.value) {
    return window.confirm(t('common.unsavedChanges'))
  }
  return true
})

// Methods
function nextStep() {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function getSectionLabel(type: string): string {
  return availableSections.value.find(s => s.type === type)?.label || type
}

function formatContent(content: string): string {
  // Simple markdown-like formatting
  return content
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

async function startGeneration() {
  currentStep.value = 2

  try {
    // Create the proposal first
    const createResult = await proposalsApi.create({
      grant_id: grantId.value,
      cso_id: selectedCsoId.value,
    })
    proposalId.value = createResult.proposal_id

    // Generate sections sequentially with streaming
    for (const sectionType of selectedSections.value) {
      currentGeneratingSection.value = sectionType
      generatedContent.value[sectionType] = ''

      try {
        const response = await proposalsApi.generateSectionStream(proposalId.value, sectionType)

        if (response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            // Parse SSE events
            const lines = chunk.split('\n')
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue
                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    generatedContent.value[sectionType] += parsed.content
                  }
                } catch {
                  // Plain text chunk
                  generatedContent.value[sectionType] += data
                }
              }
            }
          }
        } else {
          // Fallback to non-streaming if stream not available
          const result = await proposalsApi.generateSection(proposalId.value, sectionType)
          generatedContent.value[sectionType] = result.section.content
        }

        completedSections.value.push(sectionType)
      } catch (error) {
        console.error(`Error generating ${sectionType}:`, error)
        generatedContent.value[sectionType] = `Error generating this section. Please try again.`
        completedSections.value.push(sectionType)
      }

      currentGeneratingSection.value = null
    }
  } catch (error) {
    console.error('Error creating proposal:', error)
    toast.error('Failed to create proposal. Please try again.')
  }
}

function viewProposal() {
  router.push(`/proposals/${proposalId.value}`)
}

onMounted(async () => {
  window.addEventListener('beforeunload', beforeUnloadHandler)

  // Get grant ID from query
  grantId.value = route.query.grantId as string

  if (!grantId.value) {
    router.push('/grants')
    return
  }

  // Load grant details
  try {
    const grantResult = await grantsApi.getById(grantId.value)
    grantTitle.value = grantResult.grant.title
  } catch (error) {
    console.error('Error loading grant:', error)
    grantTitle.value = 'Grant Application'
  }

  // Load CSO profiles
  try {
    const csoResult = await csoApi.getAll()
    csos.value = csoResult.csos
    if (csos.value.length === 1) {
      selectedCsoId.value = csos.value[0].id
    }
  } catch (error) {
    console.error('Error loading CSOs:', error)
    toast.error('Failed to load organizations.')
  } finally {
    loadingCsos.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})
</script>
