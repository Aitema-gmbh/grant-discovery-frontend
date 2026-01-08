<template>
  <Menu as="div" class="relative">
    <MenuButton 
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-navy-600 hover:text-navy-900 hover:bg-stone-100 rounded-lg transition-colors"
    >
      <span class="text-lg">{{ currentFlag }}</span>
      <span class="hidden sm:inline">{{ currentLabel }}</span>
      <ChevronDownIcon class="w-4 h-4" />
    </MenuButton>
    
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems 
        class="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none p-1"
      >
        <MenuItem v-slot="{ active }">
          <button
            @click="switchLocale('en')"
            :class="[
              active ? 'bg-stone-100' : '',
              locale === 'en' ? 'bg-amber-50 text-amber-700' : 'text-navy-700',
              'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium'
            ]"
          >
            <span class="text-lg">🇬🇧</span>
            <span>English</span>
            <CheckIcon v-if="locale === 'en'" class="ml-auto w-4 h-4 text-amber-600" />
          </button>
        </MenuItem>
        <MenuItem v-slot="{ active }">
          <button
            @click="switchLocale('uk')"
            :class="[
              active ? 'bg-stone-100' : '',
              locale === 'uk' ? 'bg-amber-50 text-amber-700' : 'text-navy-700',
              'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium'
            ]"
          >
            <span class="text-lg">🇺🇦</span>
            <span>Українська</span>
            <CheckIcon v-if="locale === 'uk'" class="ml-auto w-4 h-4 text-amber-600" />
          </button>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/20/solid'
import { setLocale } from '@/i18n'

const { locale } = useI18n()

const currentFlag = computed(() => locale.value === 'uk' ? '🇺🇦' : '🇬🇧')
const currentLabel = computed(() => locale.value === 'uk' ? 'UK' : 'EN')

function switchLocale(newLocale: 'en' | 'uk') {
  setLocale(newLocale)
}
</script>
