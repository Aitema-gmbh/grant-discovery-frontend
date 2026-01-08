<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { toPng } from 'html-to-image'
import api from '../services/api'
import { useAuthStore } from '../stores/auth'

const emit = defineEmits<{
  close: []
}>()

const authStore = useAuthStore()

const title = ref('')
const description = ref('')
const screenshot = ref<string | null>(null)
const isSubmitting = ref(false)
const isCapturing = ref(false)
const submitStatus = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const analysisResult = ref<{
  ticketId: string
  category: string
  priority: string
  estimatedEffort: string
  aiSummary: string
  suggestedSolution: string
  clickupTask?: { id: string; url: string }
  githubIssue?: { number: number; url: string }
} | null>(null)

const handleScreenshot = async () => {
  try {
    isCapturing.value = true
    
    // Wait for Vue to update and hide modal
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 400))

    // Find main content area
    const mainContent = document.querySelector('main') || document.querySelector('#app') || document.body
    if (!mainContent) {
      throw new Error('No content element found')
    }

    // Capture using html-to-image (better SVG/chart support)
    const imageData = await toPng(mainContent as HTMLElement, {
      quality: 0.7,
      pixelRatio: 0.5,
      backgroundColor: '#ffffff',
      filter: (node: HTMLElement) => {
        if (node.classList?.contains('feedback-modal-overlay')) return false
        if (node.tagName === 'IFRAME') return false
        if (node.tagName === 'VIDEO') return false
        return true
      },
      skipFonts: false,
      cacheBust: true
    })

    isCapturing.value = false
    screenshot.value = imageData
    
  } catch (error: any) {
    console.error('Screenshot failed:', error)
    isCapturing.value = false
  }
}

const handleSubmit = async () => {
  if (!title.value.trim() || !description.value.trim()) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true
  submitStatus.value = 'idle'
  errorMessage.value = ''

  try {
    const response = await api.post('/api/tickets', {
      title: title.value,
      description: description.value,
      ...(screenshot.value && { screenshot: screenshot.value }),
      pageUrl: window.location.href,
      userAgent: navigator.userAgent
    }, {
      headers: {
        'x-user-id': authStore.user?.id || 'anonymous'
      }
    })

    if (response.data.success) {
      submitStatus.value = 'success'
      analysisResult.value = {
        ticketId: response.data.ticketId,
        category: response.data.category,
        priority: response.data.priority,
        estimatedEffort: response.data.estimatedEffort,
        aiSummary: response.data.aiSummary,
        suggestedSolution: response.data.suggestedSolution,
        clickupTask: response.data.clickupTask,
        githubIssue: response.data.githubIssue
      }

      // Auto-close after 5 seconds
      setTimeout(() => emit('close'), 5000)
    } else {
      throw new Error('Submission failed')
    }
  } catch (error: any) {
    console.error('Error submitting feedback:', error)
    submitStatus.value = 'error'
    errorMessage.value = error?.response?.data?.error || error?.message || 'Failed to submit feedback'
  } finally {
    isSubmitting.value = false
  }
}

const getPriorityClass = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800'
    case 'high': return 'bg-orange-100 text-orange-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-green-100 text-green-800'
  }
}

const getCategoryClass = (category: string) => {
  switch (category) {
    case 'bug': return 'bg-red-100 text-red-800'
    case 'feature': return 'bg-blue-100 text-blue-800'
    case 'ux': return 'bg-purple-100 text-purple-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div 
    class="feedback-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    :class="{ 'opacity-0 pointer-events-none': isCapturing }"
  >
    <div
      id="feedback-modal"
      class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Report Bug or Feedback</h2>
          <p class="text-sm text-gray-600 mt-1">Help us improve Grants Bridge Ukraine</p>
        </div>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600 transition p-2"
          aria-label="Close"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Success State with AI Analysis -->
      <div v-if="submitStatus === 'success' && analysisResult" class="p-6 bg-green-50 border-b border-green-200">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-green-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="font-bold text-green-900 mb-2">Feedback Submitted! 🎉</h3>
            <p class="text-sm text-green-800 mb-3">Thank you! Our AI has analyzed your feedback:</p>
            
            <div class="bg-white rounded-lg p-4 space-y-3 text-sm">
              <div class="flex justify-between items-center">
                <span class="font-medium">Ticket ID:</span>
                <span class="font-mono text-gray-600">#{{ analysisResult.ticketId }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Category:</span>
                <span class="px-2 py-1 rounded text-xs font-medium" :class="getCategoryClass(analysisResult.category)">
                  {{ analysisResult.category }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Priority:</span>
                <span class="px-2 py-1 rounded text-xs font-medium" :class="getPriorityClass(analysisResult.priority)">
                  {{ analysisResult.priority }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Estimated Effort:</span>
                <span class="text-gray-700">{{ analysisResult.estimatedEffort?.replace('_', ' ') }}</span>
              </div>
              
              <!-- Integration Links -->
              <div v-if="analysisResult.clickupTask || analysisResult.githubIssue" class="pt-3 border-t space-y-2">
                <a 
                  v-if="analysisResult.clickupTask" 
                  :href="analysisResult.clickupTask.url"
                  target="_blank"
                  class="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <span>📋</span> View in ClickUp
                </a>
                <a 
                  v-if="analysisResult.githubIssue" 
                  :href="analysisResult.githubIssue.url"
                  target="_blank"
                  class="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  <span>🐙</span> GitHub Issue #{{ analysisResult.githubIssue.number }}
                </a>
              </div>

              <div v-if="analysisResult.suggestedSolution" class="pt-3 border-t">
                <span class="font-medium block mb-1">AI Suggestion:</span>
                <p class="text-gray-700 italic">{{ analysisResult.suggestedSolution }}</p>
              </div>
            </div>

            <p class="text-xs text-green-700 mt-3">Closing automatically in 5 seconds...</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="title"
            type="text"
            placeholder="Brief summary of the issue or suggestion"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxlength="200"
            required
            :disabled="isSubmitting"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Description <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="description"
            placeholder="Detailed description. What happened? What did you expect to happen?"
            rows="6"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            :disabled="isSubmitting"
          />
        </div>

        <!-- Screenshot -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Screenshot (Optional)
          </label>

          <button
            v-if="!screenshot"
            type="button"
            @click="handleScreenshot"
            :disabled="isSubmitting || isCapturing"
            class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-wait text-gray-700 rounded-lg transition"
          >
            <template v-if="isCapturing">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Capturing...
            </template>
            <template v-else>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Capture Screenshot
            </template>
          </button>

          <div v-else class="relative">
            <img
              :src="screenshot"
              alt="Screenshot"
              class="w-full rounded-lg border border-gray-300"
            />
            <button
              type="button"
              @click="screenshot = null"
              class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition"
          >
            <template v-if="isSubmitting">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing with AI...
            </template>
            <template v-else>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Submit Feedback
            </template>
          </button>

          <button
            type="button"
            @click="emit('close')"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>

        <!-- Error State -->
        <div v-if="submitStatus === 'error'" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p class="font-medium">Failed to submit feedback</p>
          <p v-if="errorMessage" class="text-sm mt-1">{{ errorMessage }}</p>
          <p class="text-sm mt-2">Please try again or contact support.</p>
        </div>
      </form>
    </div>
  </div>
</template>
