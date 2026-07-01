import { Handle, Position, type NodeProps } from '@xyflow/react'
import { HOUSES, CHARS } from '../../../data/characters'
import type { FamilyFlowNode } from './buildTreeGraph'

export default function FamilyNode({ data: member }: NodeProps<FamilyFlowNode>) {
  const house = HOUSES.find(h => h.id === member.house)
  const accent = house?.accent ?? 'var(--color-text-dim)'
  const character = member.inCast ? CHARS.find(c => c.id === member.id) : undefined
  const statusColor = character
    ? (character.status === 'Vivo' ? 'var(--color-alive)' : 'var(--color-dead)')
    : 'transparent'

  return (
    <div
      style={{
        width: 190,
        minHeight: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        borderRadius: 6,
        background: 'var(--color-bg-card)',
        border: `1px solid ${accent}`,
        boxShadow: character ? `0 0 0 2px ${statusColor}33` : 'none',
        cursor: member.inCast ? 'pointer' : 'default',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <span
        aria-hidden="true"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          background: statusColor,
          border: character ? 'none' : `1px solid ${accent}88`,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 11.5,
            lineHeight: 1.3,
            color: 'var(--color-text)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={member.name}
        >
          {member.name}
        </div>
        {house && (
          <div
            style={{
              fontSize: 9,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: accent,
              marginTop: 2,
            }}
          >
            {house.name}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  )
}
