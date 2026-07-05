// Data-integrity check: every FamilyMember flagged `inCast: true` must have a
// matching entry in characters.json, otherwise the genealogy tree would
// silently fail to open a detail view (or open the wrong one) for that node.
// Also checks that every member referenced has a translated name in the `es`
// content bundle (the baseline language), since a missing key there can't
// fall back to anything.
// Run with: node scripts/check-family-tree-integrity.ts

import { readFileSync } from 'node:fs'

const DATA = new URL('../public/data/', import.meta.url)

function readJson(path: string) {
  return JSON.parse(readFileSync(new URL(path, DATA), 'utf-8'))
}

const familyTrees = readJson('family-trees.json')
const characters = readJson('characters.json')
const familyTreesEs = readJson('i18n/es/family-trees.json')

const charIds = new Set(characters.map((c: { id: string }) => c.id))
const errors: string[] = []

for (const [houseId, tree] of Object.entries(familyTrees) as [string, { members: { id: string; inCast: boolean }[] }][]) {
  const content = familyTreesEs[houseId]
  for (const member of tree.members) {
    if (member.inCast && !charIds.has(member.id)) {
      errors.push(`[${houseId}] member "${member.id}" has inCast: true but is not in characters.json`)
    }
    if (!content?.members?.[member.id]?.name) {
      errors.push(`[${houseId}] member "${member.id}" has no Spanish name in i18n/es/family-trees.json`)
    }
  }
}

if (errors.length > 0) {
  console.error(`Family tree integrity check failed (${errors.length} issue(s)):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log('Family tree integrity check passed: every inCast member matches a character, every member has a Spanish name.')
