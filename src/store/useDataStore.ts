import { create } from 'zustand'
import { z } from 'zod'
import { CharRankEntrySchema, SagaIdSchema } from '@/types/index.ts'
import type {
  House, Character, Place, Region, TimelineEvent, Curio, FamilyTreeData, FamilyMember,
  CharRankEntry, ProgressPoint, AllPoint, SagaMeta, Lang,
} from '@/types/index.ts'

// ─── On-disk shapes ─────────────────────────────────────────────────────────
// Each domain is split across two files: a structural, language-agnostic one
// (public/data/*.json — ids, colors, relationships, numbers) and a per-language
// content bundle (public/data/i18n/<lang>/*.json — the human-readable text),
// keyed by id. Missing keys/languages fall back to the `es` bundle, which is
// always fetched as the baseline. Every shape is a Zod schema so malformed
// data is caught (with a clear message) at fetch time, not as a silent `any`.

const HouseStructSchema = z.object({
  id: z.string(), c1: z.string(), c2: z.string(), accent: z.string(), initial: z.string(), regionId: z.string(),
})

const HouseContentSchema = z.object({
  name: z.string(), words: z.string(), seat: z.string(), animal: z.string(), status: z.string(), summary: z.string(),
})

const CharacterStructSchema = z.object({
  id: z.string(), house: z.string(), sagas: z.array(SagaIdSchema), alive: z.boolean(),
})

const CharacterContentSchema = z.object({
  name: z.string(), title: z.string(), bio: z.string(), culture: z.string(),
})

const PlaceStructSchema = z.object({ id: z.string(), regionId: z.string() })

const PlaceContentSchema = z.object({ name: z.string(), kind: z.string(), desc: z.string() })

const RegionStructSchema = z.object({
  id: z.string(), color: z.string().optional(), highlight: z.string().optional(),
})

const RegionContentSchema = z.object({
  name: z.string(), tagline: z.string().optional(), note: z.string().optional(),
})

const TimelineStructSchema = z.object({ id: z.string(), saga: SagaIdSchema })

const TimelineContentSchema = z.object({
  era: z.string(), year: z.string(), title: z.string(), desc: z.string(),
})

const CurioStructSchema = z.object({ id: z.string() })

const CurioContentSchema = z.object({ cat: z.string(), q: z.string(), a: z.string() })

const FamilyMemberStructSchema = z.object({
  id: z.string(), house: z.string(), generation: z.number(),
  parents: z.array(z.string()).optional(), spouses: z.array(z.string()).optional(),
  inCast: z.boolean(),
})

const FamilyTreeStructSchema = z.object({ members: z.array(FamilyMemberStructSchema) })

const FamilyTreeContentSchema = z.object({
  label: z.string(),
  note: z.string(),
  members: z.record(z.string(), z.object({ name: z.string() })),
})

const ProgressPointStructSchema = z.object({ id: z.string(), saga: SagaIdSchema, rank: z.number() })

const AllPointStructSchema = z.object({ id: z.string(), rank: z.number() })

// `en`/`hv` progress.json scaffolds are `{}` until translated — every field
// defaults to empty so a partial (or absent) bundle still parses cleanly.
const ProgressContentSchema = z.object({
  points: z.record(z.string(), z.object({ label: z.string() })).default({}),
  allPoint: z.object({ label: z.string() }).default({ label: '' }),
  sagaMeta: z.record(z.string(), z.object({ label: z.string() })).default({}),
})

const StructuralDataSchema = z.object({
  houses: z.array(HouseStructSchema),
  characters: z.array(CharacterStructSchema),
  places: z.array(PlaceStructSchema),
  regions: z.array(RegionStructSchema),
  timeline: z.array(TimelineStructSchema),
  curios: z.array(CurioStructSchema),
  familyTrees: z.record(z.string(), FamilyTreeStructSchema),
  charRank: z.record(z.string(), CharRankEntrySchema),
  timelineRank: z.array(z.number()),
  curioRank: z.array(z.number()),
  pointsSerie: z.array(ProgressPointStructSchema),
  pointsLibros: z.array(ProgressPointStructSchema),
  allPoint: AllPointStructSchema,
  sagaMetaColors: z.record(z.string(), z.object({ color: z.string() })),
})
type StructuralData = z.infer<typeof StructuralDataSchema>

const ContentBundleSchema = z.object({
  houses: z.record(z.string(), HouseContentSchema),
  characters: z.record(z.string(), CharacterContentSchema),
  places: z.record(z.string(), PlaceContentSchema),
  regions: z.record(z.string(), RegionContentSchema),
  timeline: z.record(z.string(), TimelineContentSchema),
  curios: z.record(z.string(), CurioContentSchema),
  familyTrees: z.record(z.string(), FamilyTreeContentSchema),
  progress: ProgressContentSchema,
})
type ContentBundle = z.infer<typeof ContentBundleSchema>

const BASE = `${import.meta.env.BASE_URL}data/`

async function fetchJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(BASE + path)
  if (!res.ok) throw new Error(`No se pudo cargar ${path} (${res.status})`)
  const json = await res.json()
  const result = schema.safeParse(json)
  if (!result.success) {
    throw new Error(`Datos inválidos en ${path}: ${result.error.message}`)
  }
  return result.data
}

async function fetchStructural(): Promise<StructuralData> {
  const [
    houses, characters, places, regions, timeline, curios, familyTrees,
    charRank, timelineRank, curioRank, pointsSerie, pointsLibros, allPoint, sagaMetaColors,
  ] = await Promise.all([
    fetchJson('houses.json', z.array(HouseStructSchema)),
    fetchJson('characters.json', z.array(CharacterStructSchema)),
    fetchJson('places.json', z.array(PlaceStructSchema)),
    fetchJson('regions.json', z.array(RegionStructSchema)),
    fetchJson('timeline.json', z.array(TimelineStructSchema)),
    fetchJson('curios.json', z.array(CurioStructSchema)),
    fetchJson('family-trees.json', z.record(z.string(), FamilyTreeStructSchema)),
    fetchJson('progress/char-rank.json', z.record(z.string(), CharRankEntrySchema)),
    fetchJson('progress/timeline-rank.json', z.array(z.number())),
    fetchJson('progress/curio-rank.json', z.array(z.number())),
    fetchJson('progress/points-serie.json', z.array(ProgressPointStructSchema)),
    fetchJson('progress/points-libros.json', z.array(ProgressPointStructSchema)),
    fetchJson('progress/all-point.json', AllPointStructSchema),
    fetchJson('progress/saga-meta.json', z.record(z.string(), z.object({ color: z.string() }))),
  ])
  // Re-validated as a whole, not just per-file: catches drift between files
  // (e.g. a domain added to one fetch but forgotten in this assembled object).
  return StructuralDataSchema.parse({
    houses, characters, places, regions, timeline, curios, familyTrees,
    charRank, timelineRank, curioRank, pointsSerie, pointsLibros, allPoint, sagaMetaColors,
  })
}

async function fetchContent(lang: Lang): Promise<ContentBundle> {
  const [houses, characters, places, regions, timeline, curios, familyTrees, progress] = await Promise.all([
    fetchJson(`i18n/${lang}/houses.json`, z.record(z.string(), HouseContentSchema)),
    fetchJson(`i18n/${lang}/characters.json`, z.record(z.string(), CharacterContentSchema)),
    fetchJson(`i18n/${lang}/places.json`, z.record(z.string(), PlaceContentSchema)),
    fetchJson(`i18n/${lang}/regions.json`, z.record(z.string(), RegionContentSchema)),
    fetchJson(`i18n/${lang}/timeline.json`, z.record(z.string(), TimelineContentSchema)),
    fetchJson(`i18n/${lang}/curios.json`, z.record(z.string(), CurioContentSchema)),
    fetchJson(`i18n/${lang}/family-trees.json`, z.record(z.string(), FamilyTreeContentSchema)),
    fetchJson(`i18n/${lang}/progress.json`, ProgressContentSchema),
  ])
  return ContentBundleSchema.parse({ houses, characters, places, regions, timeline, curios, familyTrees, progress })
}

/** Merges `es` (baseline) with the active language, key by key, so a partial
 * translation (e.g. High Valyrian) silently falls back to Spanish per-field. */
function pick<C extends object>(es: Record<string, C>, lang: Record<string, C>, id: string): C {
  return { ...(es[id] ?? {}), ...(lang[id] ?? {}) } as C
}

function hydrate(structural: StructuralData, es: ContentBundle, lang: ContentBundle) {
  const regionName = (regionId: string) => pick(es.regions, lang.regions, regionId).name ?? regionId

  const regions: Region[] = structural.regions.map(r => ({
    ...r,
    ...pick(es.regions, lang.regions, r.id),
  }))

  const houses: House[] = structural.houses.map(h => ({
    ...h,
    ...pick(es.houses, lang.houses, h.id),
    region: regionName(h.regionId),
  }))

  const characters: Character[] = structural.characters.map(c => ({
    id: c.id,
    house: c.house,
    sagas: c.sagas,
    status: c.alive ? 'alive' : 'dead',
    ...pick(es.characters, lang.characters, c.id),
  }))

  const places: Place[] = structural.places.map(p => ({
    ...p,
    ...pick(es.places, lang.places, p.id),
    region: regionName(p.regionId),
  }))

  const timeline: TimelineEvent[] = structural.timeline.map(ev => ({
    ...ev,
    ...pick(es.timeline, lang.timeline, ev.id),
  }))

  const curios: Curio[] = structural.curios.map(c => ({
    ...c,
    ...pick(es.curios, lang.curios, c.id),
  }))

  const familyTrees: Record<string, FamilyTreeData> = Object.fromEntries(
    Object.entries(structural.familyTrees).map(([houseId, tree]) => {
      const treeContent = pick(es.familyTrees, lang.familyTrees, houseId)
      const members: FamilyMember[] = tree.members.map(m => ({
        ...m,
        name: treeContent.members?.[m.id]?.name ?? es.familyTrees[houseId]?.members?.[m.id]?.name ?? m.id,
      }))
      return [houseId, { label: treeContent.label, note: treeContent.note, members }]
    })
  )

  const pointLabel = (id: string) => (lang.progress.points[id] ?? es.progress.points[id])?.label ?? id
  const pointsSerie: ProgressPoint[] = structural.pointsSerie.map(p => ({ ...p, label: pointLabel(p.id) }))
  const pointsLibros: ProgressPoint[] = structural.pointsLibros.map(p => ({ ...p, label: pointLabel(p.id) }))
  const allPoint: AllPoint = {
    ...structural.allPoint,
    label: (lang.progress.allPoint.label || es.progress.allPoint.label),
  }
  const sagaMeta: Record<string, SagaMeta> = Object.fromEntries(
    Object.entries(structural.sagaMetaColors).map(([id, { color }]) => [
      id,
      { color, label: (lang.progress.sagaMeta[id] ?? es.progress.sagaMeta[id])?.label ?? id },
    ])
  )

  return {
    houses, characters, places, regions, timeline, curios, familyTrees,
    charRank: structural.charRank,
    timelineRank: structural.timelineRank,
    curioRank: structural.curioRank,
    pointsSerie, pointsLibros, allPoint, sagaMeta,
  }
}

interface DataState {
  houses: House[]
  characters: Character[]
  places: Place[]
  regions: Region[]
  timeline: TimelineEvent[]
  curios: Curio[]
  familyTrees: Record<string, FamilyTreeData>
  charRank: Record<string, CharRankEntry>
  timelineRank: number[]
  curioRank: number[]
  pointsSerie: ProgressPoint[]
  pointsLibros: ProgressPoint[]
  allPoint: AllPoint
  sagaMeta: Record<string, SagaMeta>
  status: 'idle' | 'loading' | 'loaded' | 'error'
  error: string | null
  loadedLang: Lang | null
  _structural: StructuralData | null
  _contentByLang: Partial<Record<Lang, ContentBundle>>
  load: (lang: Lang) => Promise<void>
}

export const useDataStore = create<DataState>((set, get) => ({
  houses: [],
  characters: [],
  places: [],
  regions: [],
  timeline: [],
  curios: [],
  familyTrees: {},
  charRank: {},
  timelineRank: [],
  curioRank: [],
  pointsSerie: [],
  pointsLibros: [],
  allPoint: { id: 'all', label: '', rank: 0 },
  sagaMeta: {},
  status: 'idle',
  error: null,
  loadedLang: null,
  _structural: null,
  _contentByLang: {},

  load: async (lang) => {
    const state = get()
    if (state.status === 'loading') return
    if (state.status === 'loaded' && state.loadedLang === lang) return
    set({ status: 'loading', error: null })
    try {
      const structural = state._structural ?? await fetchStructural()
      const contentByLang = { ...state._contentByLang }
      if (!contentByLang.es) contentByLang.es = await fetchContent('es')
      if (!contentByLang[lang]) contentByLang[lang] = lang === 'es' ? contentByLang.es : await fetchContent(lang)

      const hydrated = hydrate(structural, contentByLang.es, contentByLang[lang]!)
      set({
        ...hydrated,
        status: 'loaded',
        loadedLang: lang,
        _structural: structural,
        _contentByLang: contentByLang,
      })
    } catch (err) {
      set({ status: 'error', error: err instanceof Error ? err.message : String(err) })
    }
  },
}))
