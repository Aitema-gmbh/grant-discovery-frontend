<template>
  <div v-if="isActive" class="fixed inset-0 z-50">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"></div>

    <!-- Spotlight -->
    <div
      v-if="currentStep"
      class="absolute pointer-events-none"
      :style="spotlightStyle"
    >
      <div class="absolute inset-0 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
    </div>

    <!-- Tour Card -->
    <div
      v-if="currentStep"
      class="absolute z-10 bg-white rounded-lg shadow-2xl max-w-md"
      :style="cardStyle"
    >
      <!-- Progress Bar -->
      <div class="h-1 bg-gray-200">
        <div
          class="h-full bg-amber-500 transition-all duration-300"
          :style="{ width: `${progress}%` }"
          role="progressbar"
          :aria-valuenow="currentStepIndex + 1"
          :aria-valuemax="tourSteps.length"
        ></div>
      </div>

      <div class="p-6">
        <!-- Step Number -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-semibold text-amber-600">
            {{ $t('onboarding.stepOf', { current: currentStepIndex + 1, total: tourSteps.length }) }}
          </span>
          <button
            @click="skip"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            {{ $t('onboarding.skipTour') }}
          </button>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 mb-3 font-display">
          {{ currentStep.title }}
        </h3>

        <!-- Description -->
        <p class="text-gray-600 mb-6">
          {{ currentStep.description }}
        </p>

        <!-- Actions -->
        <div class="flex justify-between items-center">
          <button
            v-if="currentStepIndex > 0"
            @click="previousStep"
            class="btn btn-outline"
          >
            {{ $t('common.back') }}
          </button>
          <div v-else></div>

          <div class="flex gap-2">
            <button
              v-if="currentStepIndex < tourSteps.length - 1"
              @click="nextStep"
              class="btn btn-primary"
            >
              {{ $t('common.next') }}
            </button>
            <button
              v-else
              @click="complete"
              class="btn btn-secondary"
            >
              {{ $t('onboarding.getStarted') }}
            </button>
          </div>
        </div>

        <!-- Dots Navigation -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_step, index) in tourSteps"
            :key="index"
            @click="goToStep(index)"
            class="w-2 h-2 rounded-full transition-all"
            :class="index === currentStepIndex ? 'bg-amber-500 w-6' : 'bg-gray-300'"
            :aria-label="$t('onboarding.goToStep', { step: index + 1 })"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

interface TourStep {
  title: string
  description: string
  target?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const isActive = ref(false)
const currentStepIndex = ref(0)

const tourSteps = computed<TourStep[]>(() => [
  {
    title: t('onboarding.steps.welcome.title'),
    description: t('onboarding.steps.welcome.desc'),
    position: 'bottom'
  },
  {
    title: t('onboarding.steps.profile.title'),
    description: t('onboarding.steps.profile.desc'),
    target: '[data-tour="cso-profile"]',
    position: 'bottom'
  },
  {
    title: t('onboarding.steps.grants.title'),
    description: t('onboarding.steps.grants.desc'),
    target: '[data-tour="grants"]',
    position: 'bottom'
  },
  {
    title: t('onboarding.steps.matches.title'),
    description: t('onboarding.steps.matches.desc'),
    target: '[data-tour="matches"]',
    position: 'bottom'
  },
  {
    title: t('onboarding.steps.ready.title'),
    description: t('onboarding.steps.ready.desc'),
    position: 'bottom'
  }
])

const currentStep = computed(() => tourSteps.value[currentStepIndex.value])
const progress = computed(() => ((currentStepIndex.value + 1) / tourSteps.value.length) * 100)

const spotlightStyle = computed(() => {
  if (!currentStep.value?.target) {
    return { display: 'none' }
  }

  const element = document.querySelector(currentStep.value.target)
  if (!element) {
    return { display: 'none' }
  }

  const rect = element.getBoundingClientRect()
  return {
    top: `${rect.top - 8}px`,
    left: `${rect.left - 8}px`,
    width: `${rect.width + 16}px`,
    height: `${rect.height + 16}px`,
    borderRadius: '8px'
  }
})

const cardStyle = computed(() => {
  if (!currentStep.value?.target) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const element = document.querySelector(currentStep.value.target)
  if (!element) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const rect = element.getBoundingClientRect()
  return {
    top: `${rect.bottom + 20}px`,
    left: `${Math.max(16, rect.left - 100)}px`
  }
})

function nextStep() {
  if (currentStepIndex.value < tourSteps.value.length - 1) {
    currentStepIndex.value++
  }
}

function previousStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

function goToStep(index: number) {
  currentStepIndex.value = index
}

function skip() {
  isActive.value = false
  localStorage.setItem('onboarding_completed', 'skipped')
}

function complete() {
  isActive.value = false
  localStorage.setItem('onboarding_completed', 'true')
  router.push('/cso/create')
}

function startTour() {
  const completed = localStorage.getItem('onboarding_completed')
  if (!completed) {
    isActive.value = true
  }
}

defineExpose({
  startTour,
  isActive
})

onMounted(() => {
  setTimeout(() => {
    startTour()
  }, 500)
})
</script>
