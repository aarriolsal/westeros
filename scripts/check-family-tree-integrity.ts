// Data-integrity check: every FamilyMember flagged `inCast: true` must have a
// matching entry in CHARS, otherwise the genealogy tree would silently fail to
// open a detail view (or open the wrong one) for that node.
// Run with: node scripts/check-family-tree-integrity.ts

import { FAMILY_TREES } from '../src/data/familyTrees.ts'
import { CHARS } from '../src/data/characters.ts'

const charIds = new Set(CHARS.map(c => c.id))
const errors: string[] = []

for (const [houseId, tree] of Object.entries(FAMILY_TREES)) {
  for (const member of tree.members) {
    if (member.inCast && !charIds.has(member.id)) {
      errors.push(`[${houseId}] "${member.name}" has inCast: true but id "${member.id}" is not in CHARS`)
    }
  }
}

if (errors.length > 0) {
  console.error(`Family tree integrity check failed (${errors.length} issue(s)):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log('Family tree integrity check passed: every inCast member matches a CHARS entry.')
