import dagre from 'dagre'
import type { Node, Edge } from '@xyflow/react'
import type { FamilyTreeData, FamilyMember } from '@/types/index.ts'

export const NODE_WIDTH = 190
export const NODE_HEIGHT = 60

export interface GenealogyEdgeData {
  kind: 'parent' | 'spouse'
  [key: string]: unknown
}

export type FamilyFlowNode = Node<FamilyMember, 'familyMember'>

/**
 * Converts a house's FamilyTreeData into React Flow nodes/edges, with positions
 * computed by dagre (top-to-bottom, ranked by real parent→child relationships).
 *
 * Members without a `parents` link ("roots") aren't automatically ordered by
 * dagre relative to roots from other eras (each disconnected root defaults to
 * rank 0). An invisible spine chain — one link per distinct `generation` value
 * among roots — anchors them in the right relative order without appearing in
 * the rendered output.
 */
export function buildGenealogyGraph(tree: FamilyTreeData): { nodes: FamilyFlowNode[]; edges: Edge<GenealogyEdgeData>[] } {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 32, ranksep: 80, marginx: 24, marginy: 24 })

  const memberIds = new Set(tree.members.map(m => m.id))
  tree.members.forEach(m => g.setNode(m.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))

  const edges: Edge<GenealogyEdgeData>[] = []
  const seenSpouse = new Set<string>()

  for (const m of tree.members) {
    for (const parentId of m.parents ?? []) {
      if (!memberIds.has(parentId)) continue // cross-tree reference; not renderable here
      g.setEdge(parentId, m.id, { minlen: 1, weight: 2 })
      edges.push({
        id: `parent-${parentId}-${m.id}`,
        source: parentId,
        target: m.id,
        type: 'smoothstep',
        style: { stroke: 'var(--color-text-dim)', strokeWidth: 1.5 },
        data: { kind: 'parent' },
      })
    }
    for (const spouseId of m.spouses ?? []) {
      if (!memberIds.has(spouseId)) continue
      const key = [m.id, spouseId].sort().join('::')
      if (seenSpouse.has(key)) continue
      seenSpouse.add(key)
      g.setEdge(m.id, spouseId, { minlen: 0, weight: 1 })
      edges.push({
        id: `spouse-${key}`,
        source: m.id,
        target: spouseId,
        type: 'straight',
        style: { stroke: 'var(--color-gold-dim)', strokeWidth: 1.5, strokeDasharray: '4 3' },
        data: { kind: 'spouse' },
      })
    }
  }

  // Anchor rootless members (no parents in this tree) to their authored `generation`
  // so eras without a direct link (e.g. distant ancestors) land in a sensible row.
  const rootless = tree.members.filter(m => (m.parents ?? []).length === 0)
  const anchorGenerations = [...new Set(rootless.map(m => m.generation))].sort((a, b) => a - b)
  if (anchorGenerations.length > 1) {
    anchorGenerations.forEach((gen, i) => {
      const spineId = `__spine_${gen}__`
      g.setNode(spineId, { width: 1, height: 1 })
      if (i > 0) {
        const prevGen = anchorGenerations[i - 1]
        g.setEdge(`__spine_${prevGen}__`, spineId, { minlen: Math.max(1, gen - prevGen), weight: 0 })
      }
      rootless
        .filter(m => m.generation === gen)
        .forEach(m => g.setEdge(spineId, m.id, { minlen: 1, weight: 0 }))
    })
  }

  dagre.layout(g)

  const nodes: FamilyFlowNode[] = tree.members.map(m => {
    const pos = g.node(m.id)
    return {
      id: m.id,
      type: 'familyMember',
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      data: m,
      draggable: false,
    }
  })

  return { nodes, edges }
}
