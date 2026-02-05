<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
    <div class="max-w-4xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          {{ $t('setup.welcomeTitle') }} 🎉
        </h1>
        <p class="text-lg text-gray-600">
          {{ $t('setup.welcomeSubtitle') }}
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
              {{ $t('setup.step1.title') }}
            </h2>
            <p class="text-gray-600">
              {{ $t('setup.step1.subtitle') }}
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step1.yourName') }} *
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
                {{ $t('setup.step1.email') }} *
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
                {{ $t('setup.step1.roleInOrg') }}
              </label>
              <select v-model="formData.role" class="input w-full">
                <option value="">{{ $t('setup.step1.selectRole') }}</option>
                <option value="director">{{ $t('setup.step1.executiveDirector') }}</option>
                <option value="program">{{ $t('setup.step1.programManager') }}</option>
                <option value="fundraising">{{ $t('setup.step1.fundraisingManager') }}</option>
                <option value="grants">{{ $t('setup.step1.grantsOfficer') }}</option>
                <option value="other">{{ $t('setup.step1.other') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step1.hearAboutUs') }}
              </label>
              <select v-model="formData.referralSource" class="input w-full">
                <option value="">{{ $t('setup.step1.selectSource') }}</option>
                <option value="search">{{ $t('setup.step1.googleSearch') }}</option>
                <option value="social">{{ $t('setup.step1.socialMedia') }}</option>
                <option value="colleague">{{ $t('setup.step1.colleagueRec') }}</option>
                <option value="conference">{{ $t('setup.step1.conferenceEvent') }}</option>
                <option value="other">{{ $t('setup.step1.other') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 2: Organization Info -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">
              {{ $t('setup.step2.title') }}
            </h2>
            <p class="text-gray-600">
              {{ $t('setup.step2.subtitle') }}
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step2.orgName') }} *
              </label>
              <input
                v-model="formData.orgName"
                type="text"
                :placeholder="$t('setup.step2.orgNamePlaceholder')"
                class="input w-full"
                required
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('setup.step2.orgType') }} *
                </label>
                <select v-model="formData.orgType" class="input w-full" required>
                  <option value="">{{ $t('setup.step2.selectType') }}</option>
                  <option value="ngo">{{ $t('setup.step2.ngo') }}</option>
                  <option value="foundation">{{ $t('setup.step2.foundation') }}</option>
                  <option value="association">{{ $t('setup.step2.association') }}</option>
                  <option value="cooperative">{{ $t('setup.step2.cooperative') }}</option>
                  <option value="social-enterprise">{{ $t('setup.step2.socialEnterprise') }}</option>
                  <option value="research">{{ $t('setup.step2.research') }}</option>
                  <option value="university">{{ $t('setup.step2.university') }}</option>
                  <option value="other">{{ $t('setup.step1.other') }}</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('setup.step2.regCountry') }} *
                </label>
                <select v-model="formData.country" class="input w-full" required>
                  <option value="">{{ $t('setup.step2.selectCountry') }}</option>
                  <option value="UA">Ukraine</option>
                  <option value="PL">Poland</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="other">{{ $t('setup.step1.other') }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step2.website') }}
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
              {{ $t('setup.step3.title') }}
            </h2>
            <p class="text-gray-600">
              {{ $t('setup.step3.subtitle') }}
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
              {{ $t('setup.step4.title') }}
            </h2>
            <p class="text-gray-600">
              {{ $t('setup.step4.subtitle') }}
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step4.annualBudget') }}
              </label>
              <select v-model="formData.annualBudget" class="input w-full">
                <option value="">{{ $t('setup.step4.selectBudget') }}</option>
                <option value="0-50000">{{ $t('setup.step4.under50k') }}</option>
                <option value="50000-200000">{{ $t('setup.step4.range50k200k') }}</option>
                <option value="200000-500000">{{ $t('setup.step4.range200k500k') }}</option>
                <option value="500000-1000000">{{ $t('setup.step4.range500k1m') }}</option>
                <option value="1000000+">{{ $t('setup.step4.over1m') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step4.staffMembers') }}
              </label>
              <select v-model="formData.staffCount" class="input w-full">
                <option value="">{{ $t('setup.step4.selectStaff') }}</option>
                <option value="1-5">{{ $t('setup.step4.staff1to5') }}</option>
                <option value="6-20">{{ $t('setup.step4.staff6to20') }}</option>
                <option value="21-50">{{ $t('setup.step4.staff21to50') }}</option>
                <option value="51-100">{{ $t('setup.step4.staff51to100') }}</option>
                <option value="100+">{{ $t('setup.step4.staff100plus') }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('setup.step4.grantExperience') }}
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
                {{ $t('setup.step4.preferredGrantSize') }}
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
              {{ $t('setup.step5.title') }} 🎊
            </h2>
            <p class="text-gray-600">
              {{ $t('setup.step5.subtitle') }}
            </p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-4">
                {{ $t('setup.step5.whatHelp') }}
              </label>
              <div class="space-y-3">
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="finding" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">{{ $t('setup.step5.findingGrants') }}</span>
                </label>
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="writing" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">{{ $t('setup.step5.writingProposals') }}</span>
                </label>
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="budget" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">{{ $t('setup.step5.creatingBudgets') }}</span>
                </label>
                <label class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" v-model="formData.helpNeeded" value="deadlines" class="w-5 h-5 text-primary-600 rounded" />
                  <span class="text-gray-900">{{ $t('setup.step5.trackingDeadlines') }}</span>
                </label>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="formData.createSampleData" class="w-5 h-5 text-primary-600 rounded" />
                <span class="text-gray-900">
                  {{ $t('setup.step5.addSampleData') }}
                </span>
              </label>
            </div>

            <div>
              <label class="flex items-center gap-3">
                <input type="checkbox" v-model="formData.emailNotifications" class="w-5 h-5 text-primary-600 rounded" />
                <span class="text-gray-900">
                  {{ $t('setup.step5.emailNotifications') }}
                </span>
              </label>
            </div>
          </div>

          <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
            <h3 class="font-semibold text-primary-900 mb-2">
              🎁 {{ $t('setup.step5.whatYouGet') }}
            </h3>
            <ul class="space-y-2 text-sm text-primary-800">
              <li>✓ {{ $t('setup.step5.benefit1') }}</li>
              <li>✓ {{ $t('setup.step5.benefit2') }}</li>
              <li>✓ {{ $t('setup.step5.benefit3') }}</li>
              <li>✓ {{ $t('setup.step5.benefit4') }}</li>
              <li>✓ {{ $t('setup.step5.benefit5') }}</li>
              <li v-if="formData.createSampleData">✓ {{ $t('setup.step5.benefitSample') }}</li>
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
            {{ $t('setup.back') }}
          </button>
          <div v-else></div>

          <div class="flex gap-3">
            <button
              v-if="currentStep < wizardSteps.length - 1"
              @click="nextStep"
              class="btn btn-primary"
              :disabled="!canProceed"
            >
              {{ $t('setup.continue') }}
            </button>
            <button
              v-else
              @click="completeSetup"
              class="btn btn-primary px-8"
              :disabled="loading"
            >
              <span v-if="loading">{{ $t('setup.creatingProfile') }}</span>
              <span v-else>{{ $t('setup.completeSetup') }} 🚀</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Help Text -->
      <div class="text-center mt-6 text-sm text-gray-600">
        {{ $t('setup.needHelp') }} <a href="#" class="text-primary-600 hover:underline">{{ $t('setup.contactSupport') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import api from '@/services/api'
import { useToast } from '@/lib/useToast'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()

const currentStep = ref(0)
const loading = ref(false)
const setupCompleted = ref(false)

// Unsaved form warning
const hasUnsavedChanges = computed(() => {
  if (setupCompleted.value) return false
  const d = formData.value
  return !!(d.fullName || d.email || d.orgName || d.selectedAreas.length > 0)
})

function beforeUnloadHandler(e: BeforeUnloadEvent) {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeRouteLeave(() => {
  if (hasUnsavedChanges.value) {
    return window.confirm(t('common.unsavedChanges'))
  }
  return true
})

const wizardSteps = computed(() => [
  { name: t('setup.steps.aboutYou') },
  { name: t('setup.steps.organization') },
  { name: t('setup.steps.focusAreas') },
  { name: t('setup.steps.budgetSize') },
  { name: t('setup.steps.preferences') }
])

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

const focusAreas = computed(() => [
  { value: 'democracy', label: t('setup.step3.democracy'), icon: '🗳️' },
  { value: 'human-rights', label: t('setup.step3.humanRights'), icon: '⚖️' },
  { value: 'civil-society', label: t('setup.step3.civilSociety'), icon: '🤝' },
  { value: 'education', label: t('setup.step3.education'), icon: '📚' },
  { value: 'health', label: t('setup.step3.health'), icon: '🏥' },
  { value: 'environment', label: t('setup.step3.environment'), icon: '🌱' },
  { value: 'gender', label: t('setup.step3.genderEquality'), icon: '♀️' },
  { value: 'youth', label: t('setup.step3.youth'), icon: '👦' },
  { value: 'media', label: t('setup.step3.mediaFreedom'), icon: '📰' },
  { value: 'arts', label: t('setup.step3.artsCulture'), icon: '🎨' },
  { value: 'peace', label: t('setup.step3.peaceBuilding'), icon: '🕊️' },
  { value: 'development', label: t('setup.step3.development'), icon: '📈' }
])

const experienceLevels = computed(() => [
  { value: 'beginner', label: t('setup.step4.beginner'), description: t('setup.step4.beginnerDesc') },
  { value: 'intermediate', label: t('setup.step4.intermediate'), description: t('setup.step4.intermediateDesc') },
  { value: 'experienced', label: t('setup.step4.experienced'), description: t('setup.step4.experiencedDesc') }
])

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
  if (canProceed.value && currentStep.value < wizardSteps.value.length - 1) {
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
    setupCompleted.value = true
    localStorage.setItem('onboarding_completed', 'true')
    localStorage.setItem('onboarding_data', JSON.stringify(formData.value))

    // Redirect to dashboard
    router.push('/dashboard?welcome=true')
  } catch (error) {
    console.error('Setup failed:', error)
    toast.error('Failed to complete setup. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
