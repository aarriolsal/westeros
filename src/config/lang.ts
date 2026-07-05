import type { Lang } from '@/types/index.ts'

export interface LangOption {
  id: Lang
  label: string
  flag: string
  code: string
}

export const LANG_OPTIONS: LangOption[] = [
  { id: 'es', label: 'Español', flag: '🇪🇸', code: 'ES' },
  { id: 'en', label: 'English', flag: '🇬🇧', code: 'EN' },
  { id: 'hv', label: 'Valyrio', flag: '🐉', code: 'VAL' },
]

export const DEFAULT_LANG: Lang = 'es'

// One JSON file per namespace, per language, under public/locales/<lang>/<ns>.json.
// `common` holds UI chrome shared across routes (nav, header, shared panels);
// every other key here is a route and has its own file. Pass these — never a
// raw string — to `useTranslation()` so a typo in a namespace name is a
// compile error, not a silent missing-translation fallback.
export const translationNameSpace = {
  common: 'common',
  home: 'home',
  encyclopedia: 'encyclopedia',
  map: 'map',
  genealogy: 'genealogy',
  timeline: 'timeline',
  curios: 'curios',
} as const

export type TranslationNamespace = typeof translationNameSpace[keyof typeof translationNameSpace]
