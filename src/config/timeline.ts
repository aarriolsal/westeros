export type TimelineFilterId = 'all' | 'got' | 'hotd' | 'dunk' | 'lore'

export interface TimelineFilter {
  id: TimelineFilterId
  labelKey: string  // key under timeline.json's "filters" namespace
}

// Deliberately shorter than the saga names in progress/saga-meta.json (e.g.
// "El Caballero" vs. "El Caballero de los 7 Reinos") — these are compact tab
// labels, not the canonical saga name, so kept as their own translation keys.
export const TIMELINE_FILTERS: TimelineFilter[] = [
  { id: 'all', labelKey: 'filters.all' },
  { id: 'got', labelKey: 'filters.got' },
  { id: 'hotd', labelKey: 'filters.hotd' },
  { id: 'dunk', labelKey: 'filters.dunk' },
  { id: 'lore', labelKey: 'filters.lore' },
]
