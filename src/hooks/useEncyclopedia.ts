import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useDataStore } from '@/store/useDataStore'
import { useProgress } from './useProgress'
import { translationNameSpace } from '@/config/lang'
import type { House, Character, Place } from '@/types/index.ts'

export interface EncItem {
  id: string
  name: string
  subtitle: string
  accent: string
  initial: string
  status: string
  statusColor: string
  tags: Array<{ label: string; color: string }>
  open: () => void
}

export interface CharDetail {
  type: 'char'
  char: Character
  house: House | undefined
  stateLabel: string
  stateColor: string
  isFuture: boolean
  members?: never
  desc?: never
  kind?: never
}

export interface HouseDetail {
  type: 'house'
  house: House
  members: string[]
  stateLabel?: never
  stateColor?: never
  isFuture?: never
  char?: never
  desc?: never
  kind?: never
}

export interface PlaceDetail {
  type: 'place'
  place: Place
  stateLabel?: never
  stateColor?: never
  isFuture?: never
  char?: never
  members?: never
}

export type EncDetail = CharDetail | HouseDetail | PlaceDetail

export function useEncyclopedia() {
  const { t: tCommon } = useTranslation(translationNameSpace.common)
  const { t: tEnc } = useTranslation(translationNameSpace.encyclopedia)
  const { encTab, encSearch, encHouse, encSel, setEncSel } = useAppStore()
  const { houses: HOUSES, characters: CHARS, places: PLACES } = useDataStore()
  const { charState, stateMeta, SAGA_META } = useProgress()

  const q = encSearch.trim().toLowerCase()

  let items: EncItem[] = []

  if (encTab === 'characters') {
    items = CHARS
      .filter(c => (encHouse === 'all' || c.house === encHouse) &&
        (!q || c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.bio.toLowerCase().includes(q)))
      .map(c => {
        const h = HOUSES.find(h => h.id === c.house)
        const cs = charState(c.id)
        const m = stateMeta(cs)
        const isFuture = cs === 'future'
        return {
          id: c.id,
          name: isFuture ? '???' : c.name,
          subtitle: isFuture ? tCommon('detail.notAppearedYet', 'Aún no aparece en la saga') : c.title,
          accent: h?.accent ?? '#c9a44c',
          initial: h?.initial ?? '?',
          status: m.label,
          statusColor: m.color,
          tags: (c.sagas ?? []).map(s => ({ label: SAGA_META[s].label, color: SAGA_META[s].color })),
          open: () => setEncSel({ type: 'char', id: c.id }),
        }
      })
  } else if (encTab === 'houses') {
    items = HOUSES
      .filter(h => !q || h.name.toLowerCase().includes(q) || h.words.toLowerCase().includes(q) || h.summary.toLowerCase().includes(q))
      .map(h => ({
        id: h.id,
        name: h.name,
        subtitle: h.words,
        accent: h.accent,
        initial: h.initial,
        status: h.status,
        statusColor: '#8a7a5c',
        tags: [],
        open: () => setEncSel({ type: 'house', id: h.id }),
      }))
  } else {
    items = PLACES
      .filter(p => !q || p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      .map(p => ({
        id: p.id,
        name: p.name,
        subtitle: p.region,
        accent: '#c9a44c',
        initial: p.name[0],
        status: p.kind,
        statusColor: '#8a7a5c',
        tags: [],
        open: () => setEncSel({ type: 'place', id: p.id }),
      }))
  }

  let detail: EncDetail | null = null
  if (encSel) {
    if (encSel.type === 'char') {
      const c = CHARS.find(x => x.id === encSel.id)
      if (c) {
        const h = HOUSES.find(x => x.id === c.house)
        const cs = charState(c.id)
        const m = stateMeta(cs)
        detail = { type: 'char', char: c, house: h, stateLabel: m.label, stateColor: m.color, isFuture: cs === 'future' }
      }
    } else if (encSel.type === 'house') {
      const h = HOUSES.find(x => x.id === encSel.id)
      if (h) {
        const members = CHARS.filter(c => c.house === h.id).map(c => c.name)
        detail = { type: 'house', house: h, members }
      }
    } else {
      const p = PLACES.find(x => x.id === encSel.id)
      if (p) detail = { type: 'place', place: p }
    }
  }

  const houseChips = [{ id: 'all', name: tEnc('allHouses', 'Todas'), active: encHouse === 'all' }, ...HOUSES.map(h => ({ id: h.id, name: h.name, active: encHouse === h.id }))]

  return { items, detail, houseChips, hasDetail: !!detail }
}
