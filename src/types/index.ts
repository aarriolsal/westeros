import { z } from 'zod'

// Domain model, defined as Zod schemas so the shapes fetched from
// public/data/*.json can be validated at runtime (see useDataStore.ts),
// not just type-checked at compile time. `z.infer` derives the exported
// TypeScript type from each schema, so there is a single source of truth.

export const SagaIdSchema = z.enum(['got', 'hotd', 'dunk', 'lore'])
export type SagaId = z.infer<typeof SagaIdSchema>

export const SectionSchema = z.enum(['home', 'encyclopedia', 'map', 'genealogy', 'timeline', 'curios'])
export type Section = z.infer<typeof SectionSchema>

export const LangSchema = z.enum(['es', 'en', 'hv'])
export type Lang = z.infer<typeof LangSchema>

export const EncTabSchema = z.enum(['characters', 'houses', 'places'])
export type EncTab = z.infer<typeof EncTabSchema>

export const CharacterStateSchema = z.enum(['alive', 'dead', 'future'])
export type CharacterState = z.infer<typeof CharacterStateSchema>

export const ProgModeSchema = z.enum(['serie', 'libros'])
export type ProgMode = z.infer<typeof ProgModeSchema>

// The schemas below describe the *hydrated* shape the app consumes at
// runtime (via useDataStore), after merging the language-agnostic structural
// JSON (public/data/*.json) with the active language's translated text
// (public/data/i18n/<lang>/*.json, falling back to `es` for missing keys).
// On disk the two halves are separate — see useDataStore.ts for their own
// (also Zod) schemas and the merge step.

export const HouseSchema = z.object({
  id: z.string(),
  name: z.string(),
  words: z.string(),
  seat: z.string(),
  region: z.string(),    // resolved display name for `regionId`, in the active language
  regionId: z.string(),   // stable id, matches public/data/map/regions.geojson feature ids
  animal: z.string(),
  c1: z.string(),   // dark color
  c2: z.string(),   // light color
  accent: z.string(),
  initial: z.string(),
  status: z.string(),
  summary: z.string(),
})
export type House = z.infer<typeof HouseSchema>

export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  house: z.string(),
  title: z.string(),
  status: z.enum(['alive', 'dead']),
  sagas: z.array(SagaIdSchema),
  culture: z.string(),
  bio: z.string(),
})
export type Character = z.infer<typeof CharacterSchema>

export const PlaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.string(),    // resolved display name for `regionId`, in the active language
  regionId: z.string(),
  kind: z.string(),
  desc: z.string(),
})
export type Place = z.infer<typeof PlaceSchema>

export const RegionSchema = z.object({
  id: z.string(),
  name: z.string(),
  // Only the 10 clickable map regions have these; e.g. `essos` (used by
  // Place.regionId for Braavos/Meereen) is a label only, not on the map.
  tagline: z.string().optional(),
  note: z.string().optional(),
  color: z.string().optional(),
  highlight: z.string().optional(),
})
export type Region = z.infer<typeof RegionSchema>

export const CurioSchema = z.object({
  id: z.string(),
  cat: z.string(),
  q: z.string(),
  a: z.string(),
})
export type Curio = z.infer<typeof CurioSchema>

export const TimelineEventSchema = z.object({
  id: z.string(),
  era: z.string(),
  year: z.string(),
  saga: SagaIdSchema,
  title: z.string(),
  desc: z.string(),
})
export type TimelineEvent = z.infer<typeof TimelineEventSchema>

export const FamilyMemberSchema = z.object({
  id: z.string(),            // stable id within this tree; matches Character.id when inCast is true
  name: z.string(),
  house: z.string(),          // house id for node theming; '' when the house isn't tracked
  generation: z.number(),      // 0-based rank, used as a layout hint for the tree layout engine
  parents: z.array(z.string()).optional(),  // FamilyMember ids, within the same tree
  spouses: z.array(z.string()).optional(),  // FamilyMember ids, within the same tree
  inCast: z.boolean(),         // true if `id` matches an entry in characters.json
}).catchall(z.unknown())       // satisfies React Flow's Node<T extends Record<string, unknown>>
export type FamilyMember = z.infer<typeof FamilyMemberSchema>

export const FamilyTreeDataSchema = z.object({
  label: z.string(),
  note: z.string(),
  members: z.array(FamilyMemberSchema),
})
export type FamilyTreeData = z.infer<typeof FamilyTreeDataSchema>

export const ProgressPointSchema = z.object({
  id: z.string(),
  saga: SagaIdSchema,
  label: z.string(),
  rank: z.number(),
})
export type ProgressPoint = z.infer<typeof ProgressPointSchema>

export const AllPointSchema = z.object({
  id: z.string(),
  label: z.string(),
  rank: z.number(),
})
export type AllPoint = z.infer<typeof AllPointSchema>

export const SagaMetaSchema = z.object({
  label: z.string(),
  color: z.string(),
})
export type SagaMeta = z.infer<typeof SagaMetaSchema>

export const CharRankEntrySchema = z.object({
  a: z.number(),  // appears at rank
  d: z.number(),  // dies at rank
})
export type CharRankEntry = z.infer<typeof CharRankEntrySchema>

export const EncSelectionSchema = z.object({
  type: z.enum(['char', 'house', 'place']),
  id: z.string(),
})
export type EncSelection = z.infer<typeof EncSelectionSchema>

export const ThroneInfoSchema = z.object({
  h: z.string(),
  who: z.string(),
})
export type ThroneInfo = z.infer<typeof ThroneInfoSchema>
