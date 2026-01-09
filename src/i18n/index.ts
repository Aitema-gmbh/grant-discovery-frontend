/**
 * Vue I18n Configuration
 * English / Ukrainian / German language support
 */
import { createI18n } from 'vue-i18n'
import en from './locales/en'
import uk from './locales/uk'
import de from './locales/de'

export type SupportedLocale = 'en' | 'uk' | 'de'

// Detect browser language
function detectBrowserLanguage(): SupportedLocale {
    const stored = localStorage.getItem('locale')
    if (stored === 'en' || stored === 'uk' || stored === 'de') return stored

    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith('uk')) return 'uk'
    if (browserLang.startsWith('de')) return 'de'
    return 'en'
}

const i18n = createI18n({
    legacy: false, // Use Composition API
    locale: detectBrowserLanguage(),
    fallbackLocale: 'en',
    messages: {
        en,
        uk,
        de
    }
})

// Helper to switch language
export function setLocale(locale: SupportedLocale) {
    i18n.global.locale.value = locale
    localStorage.setItem('locale', locale)
    document.documentElement.lang = locale
}

export function getLocale(): SupportedLocale {
    return i18n.global.locale.value as SupportedLocale
}

export default i18n
