import { motion } from 'framer-motion'
import { TIMELINE } from '../data/lore'
import { SAGA_META } from '../data/progress'
import { useProgress } from '../hooks/useProgress'
import { useAppStore } from '../store/useAppStore'

type FilterId = 'all' | 'got' | 'hotd' | 'dunk' | 'lore'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'got', label: 'Juego de Tronos' },
  { id: 'hotd', label: 'La Casa del Dragón' },
  { id: 'dunk', label: 'El Caballero' },
  { id: 'lore', label: 'Historia antigua' },
]

export default function TimelinePage() {
  const { tlFilter, setTlFilter } = useAppStore()
  const { isTimelineLocked } = useProgress()
  const activeFilter: FilterId = (tlFilter as FilterId) || 'all'

  const visible = TIMELINE.filter(ev =>
    activeFilter === 'all' ? true : ev.saga === activeFilter
  )

  // Map back to original indices for lock checks
  const visibleWithIndex = TIMELINE
    .map((ev, i) => ({ ev, i }))
    .filter(({ ev }) => activeFilter === 'all' ? true : ev.saga === activeFilter)

  return (
    <section style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
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
          Cronología
        </p>
        <h1 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: 'var(--color-gold)',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.15,
        }}>
          A través de las Eras
        </h1>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
        marginBottom: '2.75rem',
      }}>
        {FILTERS.map(f => {
          const isActive = f.id === activeFilter
          const sagaColor = f.id !== 'all' ? SAGA_META[f.id]?.color : undefined
          return (
            <button
              key={f.id}
              onClick={() => setTlFilter(f.id)}
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
                padding: '0.45rem 1rem',
                border: `1px solid ${isActive ? (sagaColor ?? 'var(--color-gold)') : 'var(--color-border)'}`,
                borderRadius: 4,
                background: isActive ? (sagaColor ?? 'var(--color-gold)') + '22' : 'transparent',
                color: isActive ? (sagaColor ?? 'var(--color-gold)') : 'var(--color-text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Timeline entries */}
      <div style={{ position: 'relative' }}>
        {/* Vertical dashed gold line */}
        <div style={{
          position: 'absolute',
          left: 88,
          top: 0,
          bottom: 0,
          width: 1,
          borderLeft: '1px dashed var(--color-gold-dim)',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {visibleWithIndex.map(({ ev, i }, listIdx) => {
            const locked = isTimelineLocked(i)
            const sagaColor = SAGA_META[ev.saga]?.color ?? 'var(--color-gold)'
            const sagaLabel = SAGA_META[ev.saga]?.label ?? ev.saga

            return (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: listIdx * 0.06, ease: 'easeOut' }}
                style={{
                  display: 'flex',
                  gap: '0',
                  position: 'relative',
                  paddingBottom: '2rem',
                }}
              >
                {/* Left: era + year */}
                <div style={{
                  width: 88,
                  flexShrink: 0,
                  paddingRight: '1rem',
                  paddingTop: '0.15rem',
                  textAlign: 'right',
                }}>
                  <div style={{
                    fontSize: '0.68rem',
                    color: 'var(--color-gold)',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    lineHeight: 1.3,
                    marginBottom: '0.2rem',
                  }}>
                    {ev.year}
                  </div>
                  <div style={{
                    fontSize: '0.62rem',
                    color: 'var(--color-text-dim)',
                    lineHeight: 1.3,
                  }}>
                    {ev.era}
                  </div>
                </div>

                {/* Dot on the line */}
                <div style={{
                  position: 'absolute',
                  left: 84,
                  top: 6,
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  background: sagaColor,
                  border: '2px solid var(--color-bg)',
                  zIndex: 1,
                  flexShrink: 0,
                }} />

                {/* Right: content */}
                <div style={{
                  flex: 1,
                  paddingLeft: '1.25rem',
                }}>
                  <div style={{
                    background: 'var(--color-bg-card)',
                    border: `1px solid var(--color-border)`,
                    borderRadius: 6,
                    padding: '1rem 1.1rem',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Top accent bar */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: sagaColor,
                      opacity: 0.6,
                    }} />

                    {/* Saga tag */}
                    <div style={{
                      display: 'inline-block',
                      fontSize: '0.6rem',
                      fontFamily: 'Cinzel, serif',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: sagaColor,
                      background: sagaColor + '18',
                      border: `1px solid ${sagaColor}44`,
                      borderRadius: 3,
                      padding: '0.15rem 0.55rem',
                      marginBottom: '0.55rem',
                    }}>
                      {sagaLabel}
                    </div>

                    {locked ? (
                      <>
                        <div style={{
                          fontSize: '0.95rem',
                          fontFamily: 'Cinzel, serif',
                          color: 'var(--color-text-dim)',
                          marginBottom: '0.4rem',
                          filter: 'blur(4px)',
                          userSelect: 'none',
                        }}>
                          {ev.title}
                        </div>
                        <div style={{
                          fontSize: '0.82rem',
                          color: 'var(--color-text-muted)',
                          lineHeight: 1.55,
                          filter: 'blur(5px)',
                          userSelect: 'none',
                          marginBottom: '0.5rem',
                        }}>
                          {ev.desc}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-gold-dim)',
                          fontStyle: 'italic',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}>
                          <span>🔒</span>
                          <span>Spoiler — avanza tu punto de la saga</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontFamily: 'Cinzel, serif',
                          fontSize: '0.95rem',
                          color: 'var(--color-text)',
                          fontWeight: 600,
                          marginBottom: '0.4rem',
                          lineHeight: 1.35,
                        }}>
                          {ev.title}
                        </div>
                        <p style={{
                          fontSize: '0.84rem',
                          color: 'var(--color-text-muted)',
                          lineHeight: 1.6,
                          margin: 0,
                        }}>
                          {ev.desc}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {visible.length === 0 && (
        <p style={{
          color: 'var(--color-text-dim)',
          textAlign: 'center',
          marginTop: '3rem',
          fontSize: '0.9rem',
        }}>
          No hay eventos para este filtro.
        </p>
      )}
    </section>
  )
}
