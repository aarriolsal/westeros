import { create } from 'zustand'
import type { Section, Lang, EncTab, ProgMode, EncSelection } from '../types/index'

interface AppStore {
  // State
  section: Section
  lang: Lang
  langOpen: boolean
  encTab: EncTab
  encSearch: string
  encHouse: string
  encSel: EncSelection | null
  treeHouse: string
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
  setTreeHouse: (house: string) => void
  setRegion: (region: string | null) => void
  setTlFilter: (filter: string) => void
  setProgress: (progress: string) => void
  setProgMode: (mode: ProgMode) => void
  toggleProgOpen: () => void
  toggleCurioOpen: (index: number) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Initial state
  section: 'home',
  lang: 'en',
  langOpen: false,
  encTab: 'characters',
  encSearch: '',
  encHouse: '',
  encSel: null,
  treeHouse: '',
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
    } catch (_) {
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

  setTreeHouse: (house) => set({ treeHouse: house }),

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
}))
