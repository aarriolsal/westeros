import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { DEFAULT_LANG } from '@/config/lang'
import type { Section, Lang, EncTab, ProgMode, EncSelection } from '@/types/index'

interface AppStore {
  // State
  section: Section
  lang: Lang
  langOpen: boolean
  encTab: EncTab
  encSearch: string
  encHouse: string
  encSel: EncSelection | null
  genealogyHouse: string
  region: string | null
  tlFilter: string
  progress: string
  progMode: ProgMode
  progOpen: boolean
  curioOpen: Record<number, boolean>

  // Actions
  navigate: (section: Section) => void
  setLang: (lang: Lang) => void
  toggleLangOpen: () => void
  closeLangOpen: () => void
  setEncTab: (tab: EncTab) => void
  setEncSearch: (search: string) => void
  setEncHouse: (house: string) => void
  setEncSel: (sel: EncSelection | null) => void
  setGenealogyHouse: (house: string) => void
  setRegion: (region: string | null) => void
  setTlFilter: (filter: string) => void
  setProgress: (progress: string) => void
  setProgMode: (mode: ProgMode) => void
  toggleProgOpen: () => void
  toggleCurioOpen: (index: number) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Initial state
      section: 'home',
      lang: DEFAULT_LANG,
      langOpen: false,
      encTab: 'characters',
      encSearch: '',
      encHouse: 'all',
      encSel: null,
      genealogyHouse: '',
      region: null,
      tlFilter: '',
      progress: '',
      progMode: 'serie',
      progOpen: false,
      curioOpen: {},

      // Actions
      navigate: (section) => {
        try {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch {
          // scrollTo not available (e.g. SSR or test environment)
        }
        set({ section })
      },

      setLang: (lang) => set({ lang }),

      toggleLangOpen: () => set((state) => ({ langOpen: !state.langOpen })),

      closeLangOpen: () => set({ langOpen: false }),

      setEncTab: (tab) => set({ encTab: tab }),

      setEncSearch: (search) => set({ encSearch: search }),

      setEncHouse: (house) => set({ encHouse: house }),

      setEncSel: (sel) => set({ encSel: sel }),

      setGenealogyHouse: (house) => set({ genealogyHouse: house }),

      setRegion: (region) => set({ region }),

      setTlFilter: (filter) => set({ tlFilter: filter }),

      setProgress: (progress) => set({ progress }),

      setProgMode: (mode) => set({ progMode: mode }),

      toggleProgOpen: () => set((state) => ({ progOpen: !state.progOpen })),

      toggleCurioOpen: (index) =>
        set((state) => ({
          curioOpen: {
            ...state.curioOpen,
            [index]: !state.curioOpen[index],
          },
        })),
    }),
    {
      name: 'westeros-preferences',
      storage: createJSONStorage(() => localStorage),
      // Only these survive a reload — everything else (open panels, search
      // text, current selection) is session-only UI state.
      partialize: (state) => ({
        lang: state.lang,
        progress: state.progress,
        progMode: state.progMode,
      }),
    }
  )
)
