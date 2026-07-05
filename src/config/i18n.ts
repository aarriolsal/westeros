import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import { LANG_OPTIONS, DEFAULT_LANG, translationNameSpace } from './lang'

// UI-chrome strings only (buttons, headers, nav, shared panels) — entity
// content (house/character/place text, etc.) has its own, separate i18n
// pipeline in public/data/i18n/<lang>/*.json, loaded by useDataStore.
void i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANG,
    fallbackLng: DEFAULT_LANG,
    supportedLngs: LANG_OPTIONS.map(o => o.id),
    ns: Object.values(translationNameSpace),
    defaultNS: translationNameSpace.common,
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export default i18n
