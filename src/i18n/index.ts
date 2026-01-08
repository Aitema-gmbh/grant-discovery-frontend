/**
 * Vue I18n Configuration
 * English / Ukrainian language support
 */
import { createI18n } from 'vue-i18n'
import en from './locales/en'
import uk from './locales/uk'

// Detect browser language
function detectBrowserLanguage(): 'en' | 'uk' {
    const stored = localStorage.getItem('locale')
    if (stored === 'en' || stored === 'uk') return stored

    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('uk')) return 'uk'
    return 'en'
}

const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: detectBrowserLanguage(),
    fallbackLocale: 'en',
    messages: {
        en,
        uk
    }
})

// Helper to switch language
export function setLocale(locale: 'en' | 'uk') {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
}

export function getLocale(): 'en' | 'uk' {
    return i18n.global.locale.value as 'en' | 'uk'
}

export default i18n
