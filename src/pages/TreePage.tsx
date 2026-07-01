import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactFlow, Background, Controls, type NodeMouseHandler } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { FAMILY_TREES } from '../data/familyTrees'
import { HOUSES } from '../data/characters'
import { useAppStore } from '../store/useAppStore'
import { useEncyclopedia } from '../hooks/useEncyclopedia'
import DetailPanel from '../components/sections/encyclopedia/DetailPanel'
import FamilyNode from '../components/sections/tree/FamilyNode'
import { buildTreeGraph, type FamilyFlowNode } from '../components/sections/tree/buildTreeGraph'

const TREE_HOUSE_IDS = ['targaryen', 'stark', 'lannister', 'baratheon', 'tully', 'martell', 'greyjoy'] as const

const nodeTypes = { familyMember: FamilyNode }

function getHouseMeta(id: string) {
  return HOUSES.find(h => h.id === id)
}

export default function TreePage() {
  const { treeHouse, setTreeHouse, setEncSel } = useAppStore()
  const { detail } = useEncyclopedia()
  const activeId = treeHouse || 'targaryen'
  const tree = FAMILY_TREES[activeId]
  const houseMeta = getHouseMeta(activeId)
  const accentColor = houseMeta?.accent ?? 'var(--color-gold)'

  const { nodes, edges } = useMemo(() => (tree ? buildTreeGraph(tree) : { nodes: [], edges: [] }), [tree])

  const handleNodeClick: NodeMouseHandler<FamilyFlowNode> = (_event, node) => {
    if (node.data.inCast) setEncSel({ type: 'char', id: node.data.id })
  }

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-gold-dim)',
          marginBottom: '0.4rem',
        }}>
          Genealogía
        </p>
        <h1 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: 'var(--color-gold)',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.15,
        }}>
          Linajes y Sangre
        </h1>
      </div>

      {/* House tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
        marginBottom: '1.5rem',
      }}>
        {TREE_HOUSE_IDS.map(id => {
          const meta = getHouseMeta(id)
          const isActive = id === activeId
          return (
            <button
              key={id}
              onClick={() => setTreeHouse(id)}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                padding: '0.45rem 1rem',
                border: `1px solid ${isActive ? (meta?.accent ?? 'var(--color-gold)') : 'var(--color-border)'}`,
                borderRadius: 4,
                background: isActive ? (meta?.accent ?? 'var(--color-gold)') + '22' : 'transparent',
                color: isActive ? (meta?.accent ?? 'var(--color-gold)') : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {meta?.name ?? id}
            </button>
          )
        })}
      </div>

      {/* Tree content */}
      <AnimatePresence mode="wait">
        {tree && (
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {/* House title card */}
            <div style={{
              background: 'var(--color-bg-card)',
              border: `1px solid ${accentColor}55`,
              borderLeft: `3px solid ${accentColor}`,
              borderRadius: 6,
              padding: '1.25rem 1.5rem',
              marginBottom: '1.25rem',
            }}>
              <h2 style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.25rem',
                color: accentColor,
                margin: '0 0 0.5rem',
                fontWeight: 700,
              }}>
                {tree.label}
              </h2>
              <p style={{
                color: 'var(--color-text-dim)',
                fontSize: '0.9rem',
                margin: 0,
                lineHeight: 1.6,
              }}>
                {tree.note}
              </p>
            </div>

            {/* Genealogical graph */}
            <div
              style={{
                height: '65vh',
                minHeight: 420,
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: 6,
                overflow: 'hidden',
              }}
            >
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodeClick={handleNodeClick}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable
                fitView
                fitViewOptions={{ padding: 0.2 }}
                proOptions={{ hideAttribution: true }}
                colorMode="dark"
              >
                <Background color="var(--color-border)" gap={24} />
                <Controls showInteractive={false} />
              </ReactFlow>
            </div>

            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-dim)',
              marginTop: '0.75rem',
              lineHeight: 1.5,
            }}>
              Línea sólida: relación de padre/madre a hijo. Línea discontinua dorada: matrimonio.
              Los nombres resaltados con un punto de color son personajes con ficha propia — haz clic para verla.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel (shared with the Encyclopedia) */}
      <AnimatePresence>
        {detail && (
          <DetailPanel key="detail" detail={detail} onClose={() => setEncSel(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
