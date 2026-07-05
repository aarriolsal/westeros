import { motion } from 'framer-motion'
import HouseInitial from '@/components/common/HouseInitial'
import StatusBadge from '@/components/common/StatusBadge'
import SagaTag from '@/components/common/SagaTag'
import type { EncItem } from '@/hooks/useEncyclopedia'

interface EncItemCardProps {
  item: EncItem
}

export default function EncItemCard({ item }: EncItemCardProps) {
  return (
    <motion.article
      layout
      onClick={item.open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') item.open() }}
      whileHover={{ borderColor: 'var(--color-border-hover)', y: -1 }}
      style={{
        display: 'flex',
        gap: 12,
        padding: 16,
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'border-color 0.18s, box-shadow 0.18s',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-gold)'
        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(201,164,76,0.18)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* House accent line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: item.accent,
          opacity: 0.6,
        }}
      />

      {/* Left: House initial */}
      <div style={{ paddingLeft: 4, flexShrink: 0, alignSelf: 'flex-start', paddingTop: 2 }}>
        <HouseInitial
          initial={item.initial}
          accent={item.accent}
          c1={item.accent + '18'}
          size="md"
        />
      </div>

      {/* Right: content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text)',
              lineHeight: 1.3,
              textWrap: 'balance',
            }}
          >
            {item.name}
          </span>
          <div style={{ flexShrink: 0 }}>
            <StatusBadge label={item.status} color={item.statusColor} />
          </div>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: 11,
            color: 'var(--color-text-dim)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.subtitle}
        </span>

        {/* Saga tags */}
        {item.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
            {item.tags.map((tag, i) => (
              <SagaTag key={i} label={tag.label} color={tag.color} />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  )
}
