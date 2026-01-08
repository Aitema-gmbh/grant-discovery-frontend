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
          class="h-full bg-primary-600 transition-all duration-300"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>

      <div class="p-6">
        <!-- Step Number -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-semibold text-primary-600">
            Step {{ currentStepIndex + 1 }} of {{ steps.length }}
          </span>
          <button
            @click="skip"
            class="text-sm text-gray-500 hover:text-gray-700"
          >
            Skip tour
          </button>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 mb-3">
          {{ currentStep.title }}
        </h3>

        <!-- Description -->
        <p class="text-gray-600 mb-6">
          {{ currentStep.description }}
        </p>

        <!-- Image/GIF (optional) -->
        <div v-if="currentStep.image" class="mb-6 rounded-lg overflow-hidden">
          <img :src="currentStep.image" :alt="currentStep.title" class="w-full">
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center">
          <button
            v-if="currentStepIndex > 0"
            @click="previousStep"
            class="btn btn-outline"
          >
            Back
          </button>
          <div v-else></div>

          <div class="flex gap-2">
            <button
              v-if="currentStepIndex < steps.length - 1"
              @click="nextStep"
              class="btn btn-primary"
            >
              Next
            </button>
            <button
              v-else
              @click="complete"
              class="btn btn-primary"
            >
              Get Started! 🚀
            </button>
          </div>
        </div>

        <!-- Dots Navigation -->
        <div class="flex justify-center gap-2 mt-6">
          <button
            v-for="(_step, index) in steps"
            :key="index"
            @click="goToStep(index)"
            class="w-2 h-2 rounded-full transition-all"
            :class="index === currentStepIndex ? 'bg-primary-600 w-6' : 'bg-gray-300'"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface TourStep {
  title: string
  description: string
  target?: string  // CSS selector of element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right'
  image?: string
  action?: () => void
}

const isActive = ref(false)
const currentStepIndex = ref(0)

const steps = ref<TourStep[]>([
  {
    title: '👋 Welcome to Grant Discovery!',
    description: 'Your AI-powered platform for discovering and applying to funding opportunities. Let\'s take a quick tour to get you started.',
    position: 'bottom'
  },
  {
    title: '🎯 Create Your Organization Profile',
    description: 'First, we\'ll help you create your CSO profile. This helps us match you with the most relevant grants based on your mission, location, and expertise.',
    target: '[data-tour="cso-profile"]',
    position: 'right'
  },
  {
    title: '🔍 Discover Grants',
    description: 'Browse thousands of funding opportunities from 12+ sources including EU, US, and international foundations. Use advanced filters to find exactly what you need.',
    target: '[data-tour="grants"]',
    position: 'right'
  },
  {
    title: '✨ AI-Powered Matching',
    description: 'Our AI analyzes grants and scores them based on 5 dimensions: semantic similarity, eligibility, thematic fit, budget match, and geography. Get personalized recommendations!',
    target: '[data-tour="matches"]',
    position: 'right'
  },
  {
    title: '📝 Write Proposals with AI',
    description: 'Use our proposal writing suite with AI-powered section generation, budget calculator, and compliance checking to create winning applications.',
    target: '[data-tour="proposals"]',
    position: 'right'
  },
  {
    title: '📅 Track Deadlines',
    description: 'Never miss a deadline! Our calendar and notification system keeps you on track with all your applications.',
    target: '[data-tour="deadlines"]',
    position: 'right'
  },
  {
    title: '🚀 Ready to Get Started?',
    description: 'You\'re all set! Let\'s create your organization profile so we can start finding perfect grants for you.',
    position: 'bottom'
  }
])

const currentStep = computed(() => steps.value[currentStepIndex.value])
const progress = computed(() => ((currentStepIndex.value + 1) / steps.value.length) * 100)

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
    // Center on screen
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
  const position = currentStep.value.position || 'bottom'

  switch (position) {
    case 'bottom':
      return {
        top: `${rect.bottom + 20}px`,
        left: `${rect.left}px`
      }
    case 'top':
      return {
        bottom: `${window.innerHeight - rect.top + 20}px`,
        left: `${rect.left}px`
      }
    case 'right':
      return {
        top: `${rect.top}px`,
        left: `${rect.right + 20}px`
      }
    case 'left':
      return {
        top: `${rect.top}px`,
        right: `${window.innerWidth - rect.left + 20}px`
      }
  }
})

function nextStep() {
  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++
    if (currentStep.value?.action) {
      currentStep.value.action()
    }
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
  // Redirect to CSO profile creation
  router.push('/onboarding/setup')
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
  // Auto-start tour for new users
  setTimeout(() => {
    startTour()
  }, 500)
})
</script>
