import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useDataStore } from '@/store/useDataStore'
import { useProgress } from '@/hooks/useProgress'
import { useAppStore } from '@/store/useAppStore'
import { translationNameSpace } from '@/config/lang'

export default function CuriosPage() {
  const { t } = useTranslation(translationNameSpace.curios)
  const { curioOpen, toggleCurioOpen } = useAppStore()
  const { isCurioLocked } = useProgress()
  const { curios: CURIOS } = useDataStore()
  const [catFilter, setCatFilter] = useState<string | null>(null)

  const allCats = Array.from(new Set(CURIOS.map(c => c.cat)))

  const filtered = CURIOS
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => catFilter === null || c.cat === catFilter)

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
          {t('kicker', 'Curiosidades')}
        </p>
        <h1 style={{
          fontFamily: 'Cinzel, serif',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: 'var(--color-gold)',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.15,
        }}>
          {t('title', 'Secretos del Reino')}
        </h1>
      </div>

      {/* Category filter chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.4rem',
        marginBottom: '2.5rem',
      }}>
        <button
          onClick={() => setCatFilter(null)}
          style={chipStyle(catFilter === null)}
        >
          {t('allCategories', 'Todas')}
        </button>
        {allCats.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat === catFilter ? null : cat)}
            style={chipStyle(catFilter === cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map(({ c, i }) => {
          const isOpen = !!curioOpen[i]
          const locked = isCurioLocked(i)

          return (
            <div
              key={i}
              style={{
                background: 'var(--color-bg-card)',
                border: `1px solid ${isOpen ? 'var(--color-gold-dim)' : 'var(--color-border)'}`,
                borderRadius: 6,
                overflow: 'hidden',
                transition: 'border-color 0.2s',
                opacity: locked ? 0.65 : 1,
              }}
            >
              {/* Header / trigger */}
              <button
                onClick={() => toggleCurioOpen(i)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  textAlign: 'left',
                }}
              >
                {/* Category chip */}
                <span style={{
                  flexShrink: 0,
                  fontSize: '0.62rem',
                  fontFamily: 'Cinzel, serif',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-gold)',
                  background: 'var(--color-gold)' + '18',
                  border: '1px solid var(--color-gold-dim)',
                  borderRadius: 3,
                  padding: '0.18rem 0.5rem',
                  whiteSpace: 'nowrap',
                  marginTop: '0.1rem',
                }}>
                  {c.cat}
                </span>

                {/* Question */}
                <span style={{
                  flex: 1,
                  fontSize: '0.9rem',
                  color: locked ? 'var(--color-text-dim)' : 'var(--color-text)',
                  fontWeight: 500,
                  lineHeight: 1.45,
                }}>
                  {c.q}
                </span>

                {/* Chevron */}
                <span style={{
                  flexShrink: 0,
                  color: 'var(--color-gold-dim)',
                  fontSize: '0.75rem',
                  marginTop: '0.1rem',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s',
                  display: 'inline-block',
                }}>
                  ▼
                </span>
              </button>

              {/* Body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      padding: '0 1.1rem 1.1rem 1.1rem',
                      borderTop: '1px solid var(--color-border)',
                      paddingTop: '0.9rem',
                    }}>
                      {locked ? (
                        <p style={{
                          margin: 0,
                          fontSize: '0.82rem',
                          color: 'var(--color-gold-dim)',
                          fontStyle: 'italic',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}>
                          <span>🔒</span>
                          <span>{t('spoilerHint', 'Spoiler — avanza tu punto de la saga para desbloquear esta curiosidad.')}</span>
                        </p>
                      ) : (
                        <p style={{
                          margin: 0,
                          fontSize: '0.85rem',
                          color: 'var(--color-text-muted)',
                          lineHeight: 1.65,
                        }}>
                          {c.a}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p style={{
          color: 'var(--color-text-dim)',
          textAlign: 'center',
          marginTop: '3rem',
          fontSize: '0.9rem',
        }}>
          {t('noResults', 'No hay curiosidades para esta categoría.')}
        </p>
      )}
    </section>
  )
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    fontFamily: 'Cinzel, serif',
    fontSize: '0.72rem',
    letterSpacing: '0.04em',
    padding: '0.4rem 0.9rem',
    border: `1px solid ${active ? 'var(--color-gold)' : 'var(--color-border)'}`,
    borderRadius: 4,
    background: active ? 'var(--color-gold)' + '22' : 'transparent',
    color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
}
