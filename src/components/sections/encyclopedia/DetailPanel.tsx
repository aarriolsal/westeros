import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { EncDetail } from '@/hooks/useEncyclopedia'
import { useDataStore } from '@/store/useDataStore'
import { translationNameSpace } from '@/config/lang'
import HouseInitial from '@/components/common/HouseInitial'
import StatusBadge from '@/components/common/StatusBadge'
import SagaTag from '@/components/common/SagaTag'

interface DetailPanelProps {
  detail: EncDetail
  onClose: () => void
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, paddingBottom: 10 }}>
      <dt
        style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-text-dim)',
          flexShrink: 0,
          width: 72,
          paddingTop: 2,
          lineHeight: 1.6,
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          margin: 0,
          fontSize: 12,
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {value}
      </dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-gold-dim)',
          }}
        >
          {title}
        </span>
        <div
          aria-hidden="true"
          style={{
            flex: 1,
            height: 1,
            background: 'var(--color-border)',
            opacity: 0.7,
          }}
        />
      </div>
      {children}
    </div>
  )
}

export default function DetailPanel({ detail, onClose }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { sagaMeta: SAGA_META } = useDataStore()
  const { t } = useTranslation(translationNameSpace.common)

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Trap focus loosely — move focus into panel on open
  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  // Determine header data
  let name = ''
  let subtitle = ''
  let initial = '?'
  let accent = 'var(--color-gold)'
  let c1 = '#1c1610'
  let statusLabel = ''
  let statusColor = 'var(--color-text-dim)'

  if (detail.type === 'char') {
    const { char, house, stateLabel, stateColor, isFuture } = detail
    name = isFuture ? '???' : char.name
    subtitle = isFuture ? t('detail.notAppearedYet', 'Aún no aparece en la saga') : char.title
    initial = house?.initial ?? char.name[0]
    accent = house?.accent ?? '#c9a44c'
    c1 = house?.c1 ?? '#1c1610'
    statusLabel = stateLabel
    statusColor = stateColor
  } else if (detail.type === 'house') {
    const { house } = detail
    name = house.name
    subtitle = house.words
    initial = house.initial
    accent = house.accent
    c1 = house.c1
    statusLabel = house.status
    statusColor = '#8a7a5c'
  } else {
    const { place } = detail
    name = place.name
    subtitle = place.region
    initial = place.name[0]
    accent = '#c9a44c'
    c1 = '#14100b'
    statusLabel = place.kind
    statusColor = '#8a7a5c'
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 60,
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        key="panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('detail.ariaDetails', { name, defaultValue: `Detalles de ${name}` })}
        tabIndex={-1}
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 40, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.32, 0, 0.18, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(380px, 100vw)',
          background: 'var(--color-bg-card)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 61,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          outline: 'none',
          boxShadow: '-12px 0 48px rgba(0,0,0,0.6)',
        }}
      >
        {/* Accent top stripe */}
        <div
          aria-hidden="true"
          style={{ height: 3, background: `linear-gradient(to right, ${accent}, ${accent}44)`, flexShrink: 0 }}
        />

        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={t('detail.close', 'Cerrar')}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 2,
              color: 'var(--color-text-dim)',
              cursor: 'pointer',
              fontSize: 14,
              lineHeight: 1,
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-hover)'
              e.currentTarget.style.color = 'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-text-dim)'
            }}
          >
            ✕
          </button>

          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', paddingRight: 36 }}>
            <HouseInitial initial={initial} accent={accent} c1={c1} size="lg" />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  lineHeight: 1.25,
                  textWrap: 'balance',
                }}
              >
                {name}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: 'var(--color-text-dim)',
                  lineHeight: 1.45,
                }}
              >
                {subtitle}
              </p>
              <div>
                <StatusBadge label={statusLabel} color={statusColor} />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto' }}>
          {detail.type === 'char' && (() => {
            const { char, house, isFuture } = detail
            if (isFuture) {
              return (
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-dim)',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    margin: 0,
                  }}
                >
                  {t('detail.futureCharacter', 'Este personaje aún no ha aparecido según tu punto de progreso actual.')}
                </p>
              )
            }
            return (
              <>
                {house && (
                  <Section title={t('detail.house', 'Casa')}>
                    <dl style={{ margin: 0 }}>
                      <Row label={t('detail.house', 'Casa')} value={house.name} />
                      <Row label={t('detail.motto', 'Lema')} value={house.words} />
                      {char.culture && <Row label={t('detail.culture', 'Cultura')} value={char.culture} />}
                    </dl>
                  </Section>
                )}
                {!house && char.culture && (
                  <Section title={t('detail.origin', 'Origen')}>
                    <dl style={{ margin: 0 }}>
                      <Row label={t('detail.culture', 'Cultura')} value={char.culture} />
                    </dl>
                  </Section>
                )}

                {char.bio && (
                  <Section title={t('detail.biography', 'Biografía')}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      {char.bio}
                    </p>
                  </Section>
                )}

                {char.sagas && char.sagas.length > 0 && (
                  <Section title={t('detail.appearsIn', 'Aparece en')}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {char.sagas.map((s) => {
                        const meta = SAGA_META[s]
                        return meta ? (
                          <SagaTag key={s} label={meta.label} color={meta.color} />
                        ) : null
                      })}
                    </div>
                  </Section>
                )}
              </>
            )
          })()}

          {detail.type === 'house' && (() => {
            const { house, members } = detail
            return (
              <>
                <Section title={t('detail.data', 'Datos')}>
                  <dl style={{ margin: 0 }}>
                    <Row label={t('detail.motto', 'Lema')} value={house.words} />
                    <Row label={t('detail.seat', 'Sede')} value={house.seat} />
                    <Row label={t('detail.region', 'Región')} value={house.region} />
                    <Row label={t('detail.emblem', 'Emblema')} value={house.animal} />
                    <Row label={t('detail.status', 'Estado')} value={house.status} />
                  </dl>
                </Section>

                <Section title={t('detail.history', 'Historia')}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    {house.summary}
                  </p>
                </Section>

                {members.length > 0 && (
                  <Section title={t('detail.membersCount', { count: members.length, defaultValue: `Miembros (${members.length})` })}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {members.map((m, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 12,
                            color: 'var(--color-text-muted)',
                            paddingLeft: 10,
                            borderLeft: `2px solid ${house.accent}55`,
                            lineHeight: 1.5,
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}
              </>
            )
          })()}

          {detail.type === 'place' && (() => {
            const { place } = detail
            return (
              <>
                <Section title={t('detail.data', 'Datos')}>
                  <dl style={{ margin: 0 }}>
                    <Row label={t('detail.region', 'Región')} value={place.region} />
                    <Row label={t('detail.type', 'Tipo')} value={place.kind} />
                  </dl>
                </Section>

                <Section title={t('detail.description', 'Descripción')}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.7,
                    }}
                  >
                    {place.desc}
                  </p>
                </Section>
              </>
            )
          })()}
        </div>
      </motion.div>
    </>
  )
}
