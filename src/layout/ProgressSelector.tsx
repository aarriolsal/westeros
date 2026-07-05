import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
import { useProgress } from '@/hooks/useProgress'
import { useDataStore } from '@/store/useDataStore'
import { PROG_MODE_OPTIONS } from '@/config/progress'
import { translationNameSpace } from '@/config/lang'
import type { ProgressPoint } from '@/types/index.ts'

export function ProgressSelector() {
  const { t } = useTranslation(translationNameSpace.common)
  const { progress, progMode, progOpen, setProgress, setProgMode, toggleProgOpen } = useAppStore()
  const { SAGA_META } = useProgress()
  const { pointsSerie: POINTS_SERIE, pointsLibros: POINTS_LIBROS, allPoint: ALL_POINT } = useDataStore()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        if (progOpen) toggleProgOpen()
      }
    }
    if (progOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [progOpen, toggleProgOpen])

  const modePoints: ProgressPoint[] = progMode === 'libros' ? POINTS_LIBROS : POINTS_SERIE

  function selectPoint(id: string) {
    setProgress(id)
    toggleProgOpen()
  }

  const isAll = progress === '' || progress === ALL_POINT.id

  return (
    <AnimatePresence>
      {progOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 64,
            right: 16,
            width: 300,
            background: '#1c1610',
            border: '1px solid #3a2f1c',
            borderRadius: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,.6)',
            zIndex: 200,
            overflow: 'hidden',
          }}
          aria-label={t('progress.ariaSelector', 'Selector de punto de la saga')}
        >
          {/* Panel header */}
          <div
            style={{
              padding: '14px 16px 10px',
              borderBottom: '1px solid #3a2f1c',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-cinzel)',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-gold)',
                marginBottom: 3,
              }}
            >
              {t('progress.title', 'Punto de la saga')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: 'var(--color-text-dim)',
                letterSpacing: '0.01em',
              }}
            >
              {t('progress.subtitle', '¿Hasta dónde has visto/leído?')}
            </div>
          </div>

          {/* Mode tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #3a2f1c',
              background: 'var(--color-bg)',
            }}
          >
            {PROG_MODE_OPTIONS.map(tab => {
              const active = progMode === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setProgMode(tab.id)}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: active
                      ? '2px solid var(--color-gold)'
                      : '2px solid transparent',
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: 10,
                    letterSpacing: '0.08em',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--color-gold)' : 'var(--color-text-dim)',
                    cursor: 'pointer',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                >
                  {t(tab.labelKey)}
                </button>
              )
            })}
          </div>

          {/* Options list */}
          <div
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              padding: '6px 0',
            }}
          >
            {/* "Todo (sin spoilers)" at top */}
            <ProgressOption
              id={ALL_POINT.id}
              label={ALL_POINT.label}
              dotColor="var(--color-gold-dim)"
              isActive={isAll}
              onSelect={selectPoint}
              isAll
            />

            {/* Divider */}
            <div
              style={{
                margin: '4px 16px',
                borderTop: '1px solid #2e2618',
              }}
            />

            {modePoints.map(point => {
              const meta = SAGA_META[point.saga]
              const active = progress === point.id
              return (
                <ProgressOption
                  key={point.id}
                  id={point.id}
                  label={point.label}
                  dotColor={meta?.color ?? 'var(--color-gold-dim)'}
                  isActive={active}
                  onSelect={selectPoint}
                />
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/* Sub-component: a single selectable progress option                  */
/* ------------------------------------------------------------------ */

interface ProgressOptionProps {
  id: string
  label: string
  dotColor: string
  isActive: boolean
  onSelect: (id: string) => void
  isAll?: boolean
}

function ProgressOption({ id, label, dotColor, isActive, onSelect, isAll }: ProgressOptionProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        padding: '7px 16px',
        background: 'transparent',
        border: 'none',
        borderLeft: isActive ? '2px solid var(--color-gold)' : '2px solid transparent',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,164,76,0.05)'
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
        }
      }}
    >
      {/* Colored dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: isActive ? dotColor : 'transparent',
          border: `1.5px solid ${isActive ? dotColor : 'color-mix(in srgb, ' + dotColor + ' 50%, transparent)'}`,
          flexShrink: 0,
          transition: 'background 0.15s, border-color 0.15s',
          boxShadow: isActive ? `0 0 5px ${dotColor}66` : 'none',
        }}
      />
      {/* Label */}
      <span
        style={{
          fontFamily: isAll ? 'var(--font-body)' : 'var(--font-body)',
          fontSize: 12,
          letterSpacing: '0.01em',
          color: isActive
            ? 'var(--color-text)'
            : 'var(--color-text-dim)',
          fontStyle: isAll ? 'italic' : 'normal',
          fontWeight: isActive ? 500 : 400,
          lineHeight: 1.3,
          transition: 'color 0.15s',
        }}
      >
        {label}
      </span>
    </button>
  )
}
