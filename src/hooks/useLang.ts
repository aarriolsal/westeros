import { useAppStore } from '@/store/useAppStore'
import { LANG_OPTIONS } from '@/config/lang'

/**
 * Selected language, persisted to localStorage (see useAppStore's `persist`
 * config). Defaults to `es` on first visit; falls back to Spanish content
 * for any key missing from `en`/`hv` (see useDataStore).
 */
export function useLang() {
  const { lang, setLang, langOpen, toggleLangOpen, closeLangOpen } = useAppStore()
  const current = LANG_OPTIONS.find(o => o.id === lang) ?? LANG_OPTIONS[0]

  return { lang, setLang, current, options: LANG_OPTIONS, langOpen, toggleLangOpen, closeLangOpen }
}
