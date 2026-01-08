<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-10 animate-fade-in">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full mb-6 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="text-display-sm font-display text-navy-900 mb-3">AI Smart Onboarding</h1>
        <p class="text-navy-600 text-lg">
          Just tell us your organization name - our AI will do the rest ✨
        </p>
      </div>

      <!-- Step 1: Minimal Form -->
      <div v-if="step === 'input'" class="card-premium p-8 animate-scale-in">
        <form @submit.prevent="generateProfile" class="space-y-6">
          <!-- Organization Name -->
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-2">
              Organization Name *
            </label>
            <input
              v-model="orgName"
              type="text"
              placeholder="e.g., Rebuild Ukraine Foundation"
              class="input-premium w-full text-lg py-3"
              :disabled="loading"
              required
            />
          </div>

          <!-- Website (Optional) -->
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-2">
              Website
              <span class="text-navy-400 font-normal">(optional - for better accuracy)</span>
            </label>
            <input
              v-model="website"
              type="url"
              placeholder="https://your-organization.org"
              class="input-premium w-full"
              :disabled="loading"
            />
          </div>

          <!-- Country -->
          <div>
            <label class="block text-sm font-medium text-navy-700 mb-2">
              Country
            </label>
            <select v-model="country" class="input-premium w-full" :disabled="loading">
              <option value="UA">🇺🇦 Ukraine</option>
              <option value="PL">🇵🇱 Poland</option>
              <option value="DE">🇩🇪 Germany</option>
              <option value="GE">🇬🇪 Georgia</option>
              <option value="MD">🇲🇩 Moldova</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn-ukraine w-full py-4 text-lg font-semibold flex items-center justify-center gap-3"
            :disabled="loading || !orgName.trim()"
          >
            <template v-if="loading">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              AI is analyzing...
            </template>
            <template v-else>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Profile with AI
            </template>
          </button>
        </form>

        <!-- Info Box -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex gap-3">
            <svg class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-blue-800">
              <p class="font-medium">How it works</p>
              <p class="mt-1 text-blue-600">
                Our AI will analyze your organization and automatically fill in focus areas,
                target groups, experience level, and more. You can review and edit before saving.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Preview Generated Profile -->
      <div v-else-if="step === 'preview' && generatedProfile" class="animate-fade-in">
        <!-- Confidence Badge -->
        <div class="flex justify-center mb-6">
          <div 
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            :class="confidenceBadgeClass"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clip-rule="evenodd" />
            </svg>
            {{ Math.round(confidence * 100) }}% AI Confidence
            <span class="text-xs opacity-75">({{ sourcesUsed.join(', ') }})</span>
          </div>
        </div>

        <!-- Profile Card -->
        <div class="card-premium p-8 mb-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-display font-bold text-navy-900">{{ generatedProfile.name }}</h2>
              <p class="text-navy-500">{{ generatedProfile.org_type }} • {{ generatedProfile.headquarters_country }}</p>
            </div>
            <span class="badge badge-success">Ready to save</span>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-navy-500 mb-2">Description</h3>
            <p class="text-navy-700">{{ generatedProfile.description }}</p>
          </div>

          <!-- Mission -->
          <div v-if="generatedProfile.mission_statement" class="mb-6">
            <h3 class="text-sm font-medium text-navy-500 mb-2">Mission</h3>
            <p class="text-navy-700 italic">{{ generatedProfile.mission_statement }}</p>
          </div>

          <!-- Focus Areas -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-navy-500 mb-2">Focus Areas</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="area in generatedProfile.focus_areas" 
                :key="area"
                class="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {{ area }}
              </span>
            </div>
          </div>

          <!-- Target Groups -->
          <div v-if="generatedProfile.target_groups?.length" class="mb-6">
            <h3 class="text-sm font-medium text-navy-500 mb-2">Target Groups</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="group in generatedProfile.target_groups" 
                :key="group"
                class="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium"
              >
                {{ group }}
              </span>
            </div>
          </div>

          <!-- Grid Info -->
          <div class="grid grid-cols-2 gap-4 pt-6 border-t border-navy-100">
            <div>
              <h3 class="text-xs font-medium text-navy-400 uppercase tracking-wide">Experience</h3>
              <p class="text-navy-900 font-medium">{{ generatedProfile.grant_experience_level }}</p>
            </div>
            <div>
              <h3 class="text-xs font-medium text-navy-400 uppercase tracking-wide">Budget Range</h3>
              <p class="text-navy-900 font-medium">{{ formatBudget(generatedProfile.estimated_budget_range) }}</p>
            </div>
            <div>
              <h3 class="text-xs font-medium text-navy-400 uppercase tracking-wide">Languages</h3>
              <p class="text-navy-900 font-medium">{{ generatedProfile.working_languages?.join(', ') }}</p>
            </div>
            <div>
              <h3 class="text-xs font-medium text-navy-400 uppercase tracking-wide">Operating In</h3>
              <p class="text-navy-900 font-medium">{{ generatedProfile.operating_countries?.join(', ') }}</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="step = 'input'"
            class="btn btn-secondary flex-1 py-3"
            :disabled="saving"
          >
            ← Go Back
          </button>
          <button
            @click="saveProfile"
            class="btn-ukraine flex-1 py-3 flex items-center justify-center gap-2"
            :disabled="saving"
          >
            <template v-if="saving">
              <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Saving...
            </template>
            <template v-else>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Save & Continue
            </template>
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import api from '@/services/api'

interface GeneratedProfile {
  name: string
  org_type: string
  headquarters_country: string
  operating_countries: string[]
  focus_areas: string[]
  target_groups: string[]
  thematic_keywords: string[]
  description: string
  mission_statement: string
  estimated_budget_range: string
  grant_experience_level: string
  working_languages: string[]
  website: string
}

const router = useRouter()

// Form state
const step = ref<'input' | 'preview'>('input')
const orgName = ref('')
const website = ref('')
const country = ref('UA')
const loading = ref(false)
const saving = ref(false)
const error = ref('')

// Generated profile
const generatedProfile = ref<GeneratedProfile | null>(null)
const confidence = ref(0)
const sourcesUsed = ref<string[]>([])
const createdCsoId = ref<string | null>(null)

const confidenceBadgeClass = computed(() => {
  if (confidence.value >= 0.8) return 'bg-green-100 text-green-700'
  if (confidence.value >= 0.5) return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-700'
})

function formatBudget(range: string): string {
  const map: Record<string, string> = {
    'under_10k': '< €10k',
    '10k_50k': '€10k - €50k',
    '50k_200k': '€50k - €200k',
    '200k_1m': '€200k - €1M',
    'over_1m': '> €1M'
  }
  return map[range] || range
}

async function generateProfile() {
  loading.value = true
  error.value = ''

  try {
    const response = await api.post('/api/cso/smart-onboard', {
      org_name: orgName.value.trim(),
      website: website.value.trim() || undefined,
      country: country.value
    })

    if (response.data.success && response.data.profile) {
      generatedProfile.value = response.data.profile
      confidence.value = response.data.confidence || 0.5
      sourcesUsed.value = response.data.sources_used || []
      step.value = 'preview'
    } else {
      error.value = response.data.error || 'Failed to generate profile'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to generate profile. Please try again.'
    console.error('Smart onboard error:', err)
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  if (!generatedProfile.value) return

  saving.value = true
  error.value = ''

  try {
    const response = await api.post('/api/cso/smart-onboard?auto_create=true', {
      org_name: generatedProfile.value.name,
      website: generatedProfile.value.website || undefined,
      country: generatedProfile.value.headquarters_country
    })

    if (response.data.success && response.data.cso_id) {
      createdCsoId.value = response.data.cso_id
      // Redirect to matches page for this CSO
      router.push(`/matches?cso=${response.data.cso_id}`)
    } else {
      error.value = response.data.error || 'Failed to save profile'
    }
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to save profile. Please try again.'
    console.error('Save profile error:', err)
  } finally {
    saving.value = false
  }
}
</script>
