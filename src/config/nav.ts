import type { Section } from '@/types/index.ts'

export interface NavItem {
  labelKey: string  // key under common.json's "nav" namespace, e.g. t(`nav.${section}`)
  section: Section
  route: string
}

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home',        section: 'home',         route: '/' },
  { labelKey: 'nav.encyclopedia', section: 'encyclopedia', route: '/encyclopedia' },
  { labelKey: 'nav.timeline',    section: 'timeline',     route: '/timeline' },
  { labelKey: 'nav.genealogy',   section: 'genealogy',    route: '/genealogy' },
  { labelKey: 'nav.map',         section: 'map',          route: '/map' },
  { labelKey: 'nav.curios',      section: 'curios',       route: '/curios' },
]
