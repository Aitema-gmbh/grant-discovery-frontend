<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          Welcome to Grant Discovery! 🎉
        </h1>
        <p class="text-lg text-gray-600">
          Let's get you set up in just a few minutes
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div
            v-for="(step, index) in wizardSteps"
            :key="index"
            class="flex-1 flex items-center"
          >
            <div class="flex flex-col items-center flex-1">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all"
                :class="getStepClass(index)"
              >
                <span v-if="index < currentStep">✓</span>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span class="text-xs mt-2 text-gray-600">{{ step.name }}</span>
            </div>
            <div
              v-if="index < wizardSteps.length - 1"
              class="flex-1 h-1 mx-2"
              :class="index < currentStep ? 'bg-primary-600' : 'bg-gray-300'"
            ></div>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-2xl shadow-2xl p-8">
        <!-- Step 1: Basic Info -->
        <div v-if="currentStep === 0" class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Tell us about yourself
            </h2>
            <p class="text-gray-600">
              We'll use this to personalize your experience
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                v-model="formData.fullName"
                type="text"
                placeholder="John Doe"
                class="input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="john@example.org"
                class="input w-full"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Role in Organization
              </label>
              <select v-model="formData.role" class="input w-full">
                <option value="">Select your role</option>
                <option value="director">Executive Director</option>
                <option value="program">Program Manager</option>
                <option value="fundraising">Fundraising Manager</option>
                <option value="grants">Grants Officer</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                How did you hear about us?
              </label>
              <select v-model="formData.referralSource" class="input w-full">
                <option value="">Select source</option>
                <option value="search">Google Search</option>
                <option value="social">Social Media</option>
                <option value="colleague">Colleague Recommendation</option>
                <option value="conference">Conference/Event</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 2: Organization Info -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              About your organization
            </h2>
            <p class="text-gray-600">
              This helps us find the most relevant grants for you
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <input
                v-model="formData.orgName"
                type="text"
                placeholder="e.g., Ukrainian Democracy Foundation"
                class="input w-full"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type *
                </label>
                <select v-model="formData.orgType" class="input w-full" required>
                  <option value="">Select type</option>
                  <option value="ngo">Non-Governmental Organization (NGO)</option>
                  <option value="foundation">Foundation</option>
                  <option value="association">Association</option>
                  <option value="cooperative">Cooperative</option>
                  <option value="social-enterprise">Social Enterprise</option>
                  <option value="research">Research Institution</option>
                  <option value="university">University</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Registration Country *
                </label>
                <select v-model="formData.country" class="input w-full" required>
                  <option value="">Select country</option>
                  <option value="UA">Ukraine</option>
                  <option value="PL">Poland</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Website (optional)
              </label>
              <input
                v-model="formData.website"
                type="url"
                placeholder="https://www.example.org"
                class="input w-full"
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Focus Areas -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              What areas do you work in?
            </h2>
            <p class="text-gray-600">
              Select all that apply - this helps us match you with relevant grants
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label
              v-for="area in focusAreas"
              :key="area.value"
              class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300"
              :class="formData.selectedAreas.includes(area.value) ? 'border-primary-600 bg-primary-50' : 'border-gray-200'"
            >
              <input
                type="checkbox"
                :value="area.value"
                v-model="formData.selectedAreas"
                class="w-5 h-5 text-primary-600 rounded"
              />
              <div>
                <div class="font-medium text-gray-900">{{ area.icon }} {{ area.label }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 4: Budget & Size -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Organization size & budget
            </h2>
            <p class="text-gray-600">
              This helps us recommend grants that fit your capacity
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Annual Budget (EUR)
              </label>
              <select v-model="formData.annualBudget" class="input w-full">
                <option value="">Select budget range</option>
                <option value="0-50000">Under €50,000</option>
                <option value="50000-200000">€50,000 - €200,000</option>
                <option value="200000-500000">€200,000 - €500,000</option>
                <option value="500000-1000000">€500,000 - €1,000,000</option>
                <option value="1000000+">Over €1,000,000</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Number of Staff Members
              </label>
              <select v-model="formData.staffCount" class="input w-full">
                <option value="">Select staff size</option>
                <option value="1-5">1-5 people</option>
                <option value="6-20">6-20 people</option>
                <option value="21-50">21-50 people</option>
                <option value="51-100">51-100 people</option>
                <option value="100+">Over 100 people</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Grant Experience Level
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label
                  v-for="level in experienceLevels"
                  :key="level.value"
                  class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary-300"
                  :class="formData.experienceLevel === level.value ? 'border-primary-600 bg-primary-50' : 'border-gray-200'"
                >
                  <input
                    type="radio"
                    :value="level.value"
                    v-model="formData.experienceLevel"
                    class="w-5 h-5 text-primary-600"
                  />
                  <div>
                    <div class="font-medium text-gray-900">{{ level.label }}</div>
                    <div class="text-xs text-gray-500">{{ level.description }}</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Preferred Grant Size Range (EUR)
              </label>
              <div class="grid grid-cols-2 gap-4">
                <input
                  v-model.number="formData.grantSizeMin"
                  type="number"
                  placeholder="Min (e.g., 50000)"
                  class="input w-full"
                />
                <input
                  v-model.number="formData.grantSizeMax"
                  type="number"
                  placeholder="Max (e.g., 500000)"
                  class="input w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Preferences -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              Almost done! 🎊
            </h2>
            <p class="text-gray-600">
              Just a few more preferences to personalize your experience
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                What would you like help with? (Select all that apply)
              </label>
              <div class="space-y-3">
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="finding" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">Finding relevant grants</span>
                </label>
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="writing" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">Writing proposals</span>
                </label>
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="budget" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">Creating budgets</span>
                </label>
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="deadlines" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">Tracking deadlines</span>
                </label>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="formData.createSampleData" class="w-5 h-5 text-primary-600 rounded" />
                <span class="text-gray-900">
                  Add sample data to explore features (recommended for first-time users)
                </span>
              </label>
            </div>

            <div>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="formData.emailNotifications" class="w-5 h-5 text-primary-600 rounded" />
                <span class="text-gray-900">
                  Send me email notifications about new matching grants
                </span>
              </label>
            </div>
          </div>

          <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 class="font-semibold text-primary-900 mb-2">
              🎁 What you'll get after setup:
            </h3>
            <ul class="space-y-2 text-sm text-primary-800">
              <li>✓ Personalized grant recommendations based on your profile</li>
              <li>✓ Access to 12+ international grant sources</li>
              <li>✓ AI-powered matching with detailed scores</li>
              <li>✓ Proposal writing tools and templates</li>
              <li>✓ Deadline tracking and notifications</li>
              <li v-if="formData.createSampleData">✓ Sample grants and proposals to explore</li>
            </ul>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 pt-6 border-t">
          <button
            v-if="currentStep > 0"
            @click="previousStep"
            class="btn btn-outline"
          >
            ← Back
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              v-if="currentStep < wizardSteps.length - 1"
              @click="nextStep"
              class="btn btn-primary"
              :disabled="!canProceed"
            >
              Continue →
            </button>
            <button
              v-else
              @click="completeSetup"
              class="btn btn-primary px-8"
              :disabled="loading"
            >
              <span v-if="loading">Creating your profile...</span>
              <span v-else>Complete Setup 🚀</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Help Text -->
      <div class="text-center mt-6 text-sm text-gray-600">
        Need help? <a href="#" class="text-primary-600 hover:underline">Contact Support</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const currentStep = ref(0)
const loading = ref(false)

const wizardSteps = [
  { name: 'About You' },
  { name: 'Organization' },
  { name: 'Focus Areas' },
  { name: 'Budget & Size' },
  { name: 'Preferences' }
]

const formData = ref({
  // Step 1
  fullName: '',
  email: '',
  role: '',
  referralSource: '',

  // Step 2
  orgName: '',
  orgType: '',
  country: '',
  website: '',

  // Step 3
  selectedAreas: [] as string[],

  // Step 4
  annualBudget: '',
  staffCount: '',
  experienceLevel: 'intermediate',
  grantSizeMin: 50000,
  grantSizeMax: 500000,

  // Step 5
  helpNeeded: [] as string[],
  createSampleData: true,
  emailNotifications: true
})

const focusAreas = [
  { value: 'democracy', label: 'Democracy', icon: '🗳️' },
  { value: 'human-rights', label: 'Human Rights', icon: '⚖️' },
  { value: 'civil-society', label: 'Civil Society', icon: '🤝' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'environment', label: 'Environment', icon: '🌱' },
  { value: 'gender', label: 'Gender Equality', icon: '♀️' },
  { value: 'youth', label: 'Youth', icon: '👦' },
  { value: 'media', label: 'Media Freedom', icon: '📰' },
  { value: 'arts', label: 'Arts & Culture', icon: '🎨' },
  { value: 'peace', label: 'Peace Building', icon: '🕊️' },
  { value: 'development', label: 'Development', icon: '📈' }
]

const experienceLevels = [
  { value: 'beginner', label: 'Beginner', description: 'First grants' },
  { value: 'intermediate', label: 'Intermediate', description: '1-5 grants' },
  { value: 'experienced', label: 'Experienced', description: '5+ grants' }
]

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0:
      return formData.value.fullName && formData.value.email
    case 1:
      return formData.value.orgName && formData.value.orgType && formData.value.country
    case 2:
      return formData.value.selectedAreas.length > 0
    case 3:
      return true
    case 4:
      return true
    default:
      return false
  }
})

function getStepClass(index: number) {
  if (index < currentStep.value) {
    return 'bg-primary-600 text-white'
  } else if (index === currentStep.value) {
    return 'bg-primary-100 text-primary-600 border-2 border-primary-600'
  } else {
    return 'bg-gray-200 text-gray-600'
  }
}

function nextStep() {
  if (canProceed.value && currentStep.value < wizardSteps.length - 1) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

async function completeSetup() {
  loading.value = true

  try {
    // Create CSO profile
    const csoData = {
      name: formData.value.orgName,
      org_type: formData.value.orgType,
      registration_country: formData.value.country,
      headquarters_country: formData.value.country,
      operating_countries: [formData.value.country],
      focus_areas: formData.value.selectedAreas,
      target_groups: [],
      thematic_keywords: formData.value.selectedAreas,
      staff_count: parseInt(formData.value.staffCount?.split('-')[0] || '0'),
      annual_budget_eur: parseInt(formData.value.annualBudget?.split('-')[0] || '0'),
      grant_experience_level: formData.value.experienceLevel,
      preferred_grant_size_min: formData.value.grantSizeMin,
      preferred_grant_size_max: formData.value.grantSizeMax,
      eligible_for_eu_funding: true,
      eligible_for_us_funding: false,
      min_match_score: 0.4
    }

    await api.post('/api/cso', csoData)

    // Create sample data if requested
    if (formData.value.createSampleData) {
      // TODO: Create sample proposals, matches, etc.
    }

    // Mark onboarding as complete
    localStorage.setItem('onboarding_completed', 'true')
    localStorage.setItem('onboarding_data', JSON.stringify(formData.value))

    // Redirect to dashboard
    router.push('/dashboard?welcome=true')
  } catch (error) {
    console.error('Setup failed:', error)
    alert('Failed to complete setup. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
