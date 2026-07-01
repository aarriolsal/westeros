export type SagaId = 'got' | 'hotd' | 'dunk' | 'lore'
export type Section = 'home' | 'encyclopedia' | 'map' | 'tree' | 'timeline' | 'curios'
export type Lang = 'es' | 'en' | 'hv'
export type EncTab = 'characters' | 'houses' | 'places'
export type CharacterState = 'alive' | 'dead' | 'future'
export type ProgMode = 'serie' | 'libros'

export interface House {
  id: string
  name: string
  words: string
  seat: string
  region: string
  animal: string
  c1: string   // dark color
  c2: string   // light color
  accent: string
  initial: string
  status: string
  summary: string
}

export interface Character {
  id: string
  name: string
  house: string
  title: string
  status: 'Vivo' | 'Muerto'
  sagas: SagaId[]
  culture: string
  bio: string
}

export interface Place {
  id: string
  name: string
  region: string
  kind: string
  desc: string
}

export interface Curio {
  cat: string
  q: string
  a: string
}

export interface TimelineEvent {
  era: string
  year: string
  saga: SagaId
  title: string
  desc: string
}

export interface FamilyMember {
  id: string            // stable id within this tree; matches Character.id when inCast is true
  name: string
  house: string          // house id for node theming; '' when the house isn't tracked (see HOUSES)
  generation: number      // 0-based rank, used as a layout hint for the tree layout engine
  parents?: string[]      // FamilyMember ids, within the same tree
  spouses?: string[]      // FamilyMember ids, within the same tree
  inCast: boolean         // true if `id` matches an entry in CHARS (enables opening its detail view)
  [key: string]: unknown  // satisfies React Flow's Node<T extends Record<string, unknown>> constraint
}

export interface FamilyTreeData {
  label: string
  note: string
  members: FamilyMember[]
}

export interface ProgressPoint {
  id: string
  saga: SagaId
  label: string
  rank: number
}

export interface AllPoint {
  id: string
  label: string
  rank: number
}

export interface SagaMeta {
  label: string
  color: string
}

export interface CharRankEntry {
  a: number  // appears at rank
  d: number  // dies at rank
}

export interface EncSelection {
  type: 'char' | 'house' | 'place'
  id: string
}

export interface ThroneInfo {
  h: string
  who: string
}
