import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { useProgress } from '../hooks/useProgress'
import type { Section } from '../types/index.ts'

// ─── Feature card data ────────────────────────────────────────────────────────

interface FeatureCard {
  icon: string
  title: string
  desc: string
  section: Section
  ariaLabel: string
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: '📜',
    title: 'Enciclopedia',
    desc: 'Personajes, casas y lugares de las tres sagas.',
    section: 'encyclopedia',
    ariaLabel: 'Ir a la Enciclopedia',
  },
  {
    icon: '🌳',
    title: 'Genealogía',
    desc: 'Árboles genealógicos de las grandes casas.',
    section: 'tree',
    ariaLabel: 'Ir a Genealogía',
  },
  {
    icon: '🗺️',
    title: 'Mapa',
    desc: 'Las regiones de Poniente, interactivas.',
    section: 'map',
    ariaLabel: 'Ir al Mapa',
  },
  {
    icon: '🕰️',
    title: 'Cronología',
    desc: 'Ocho mil años de historia.',
    section: 'timeline',
    ariaLabel: 'Ir a la Cronología',
  },
  {
    icon: '✨',
    title: 'Curiosidades',
    desc: 'Secretos, mitos y datos ocultos.',
    section: 'curios',
    ariaLabel: 'Ir a Curiosidades',
  },
]

// ─── Hexagon sigil SVG ────────────────────────────────────────────────────────

function HexSigil() {
  // Flat-top hexagon, 60px radius
  const r = 60
  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${r * Math.cos(angle)},${r * Math.sin(angle)}`
  }).join(' ')

  return (
    <svg
      viewBox="-68 -68 136 136"
      width="136"
      height="136"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* Outer glow ring */}
      <polygon
        points={points}
        fill="none"
        stroke="#c9a44c"
        strokeWidth="1"
        opacity="0.25"
        transform="scale(1.15)"
      />
      {/* Main hexagon */}
      <polygon
        points={points}
        fill="rgba(201,164,76,0.06)"
        stroke="#c9a44c"
        strokeWidth="1.5"
      />
      {/* W letterform */}
      <text
        x="0"
        y="1"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#c9a44c"
        fontFamily="'Cinzel', Georgia, serif"
        fontWeight="700"
        fontSize="42"
        letterSpacing="2"
      >
        W
      </text>
    </svg>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function StatsRow() {
  const stats = [
    { value: '12+', label: 'Grandes Casas' },
    { value: '38+', label: 'Personajes' },
    { value: '3', label: 'Sagas' },
    { value: '8000+', label: 'Años de historia' },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: '0',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        width: '100%',
        maxWidth: '640px',
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '16px 8px',
            borderLeft: i > 0 ? '1px solid var(--color-border)' : 'none',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 700,
              fontSize: '1.35rem',
              color: 'var(--color-gold)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Progress Banner ──────────────────────────────────────────────────────────

function ProgressBanner() {
  const { curPoint, SAGA_META } = useProgress()

  if (curPoint.id === 'all') return null

  const sagaId = (curPoint as { saga?: string }).saga
  const sagaColor = sagaId && SAGA_META[sagaId] ? SAGA_META[sagaId].color : 'var(--color-gold)'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        marginTop: '24px',
        maxWidth: '640px',
        width: '100%',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: sagaColor,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        Punto de la saga:
      </span>
      <span
        style={{
          fontSize: '0.8rem',
          color: 'var(--color-text)',
          fontFamily: 'var(--font-cinzel)',
        }}
      >
        {curPoint.label}
      </span>
    </div>
  )
}

// ─── Feature card ─────────────────────────────────────────────────────────────

function Card({ card, onClick }: { card: FeatureCard; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={card.ariaLabel}
      onClick={onClick}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: '4px',
        padding: '28px 24px',
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'border-color 0.2s ease, background 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        color: 'inherit',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor =
          'var(--color-gold)'
        ;(e.currentTarget as HTMLButtonElement).style.background =
          'var(--color-bg-raised)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor =
          'var(--color-border)'
        ;(e.currentTarget as HTMLButtonElement).style.background =
          'var(--color-bg-card)'
      }}
      onFocus={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.outline =
          '2px solid var(--color-gold)'
        ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px'
      }}
      onBlur={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.outline = 'none'
      }}
    >
      <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden="true">
        {card.icon}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-cinzel)',
          fontWeight: 600,
          fontSize: '1rem',
          color: 'var(--color-text)',
          letterSpacing: '0.04em',
        }}
      >
        {card.title}
      </span>
      <span
        style={{
          fontSize: '0.82rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}
      >
        {card.desc}
      </span>
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HomePage() {
  const navigate = useNavigate()
  const { navigate: storeNavigate } = useAppStore()

  function goTo(section: Section) {
    storeNavigate(section)
    navigate(`/${section === 'home' ? '' : section}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px 60px',
          textAlign: 'center',
          gap: '0',
        }}
      >
        {/* Sigil */}
        <div style={{ marginBottom: '28px' }}>
          <HexSigil />
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 6vw, 4rem)',
            color: 'var(--color-text)',
            letterSpacing: '0.15em',
            margin: '0 0 6px',
            textWrap: 'balance',
            lineHeight: 1,
          }}
        >
          WESTEROS
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '0.78rem',
            letterSpacing: '14px',
            color: 'var(--color-gold-dim)',
            textTransform: 'uppercase',
            margin: '0 0 28px',
          }}
        >
          ENCICLOPEDIA
        </p>

        {/* Divider */}
        <div
          style={{
            width: '120px',
            height: '1px',
            background:
              'linear-gradient(to right, transparent, var(--color-gold-dim), transparent)',
            marginBottom: '24px',
          }}
          aria-hidden="true"
        />

        {/* Tagline */}
        <p
          style={{
            fontSize: '0.83rem',
            color: 'var(--color-text-dim)',
            letterSpacing: '0.06em',
            margin: '0 0 40px',
            fontStyle: 'italic',
          }}
        >
          Canción de Hielo y Fuego &middot; Poniente y Essos
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            marginBottom: '48px',
          }}
        >
          <button
            type="button"
            onClick={() => goTo('encyclopedia')}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #c9a44c 0%, #a87d2e 100%)',
              border: 'none',
              borderRadius: '3px',
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: '#14100b',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.opacity = '1'
            }}
            onFocus={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.outline =
                '2px solid var(--color-gold)'
              ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '3px'
            }}
            onBlur={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.outline = 'none'
            }}
          >
            Explorar la enciclopedia
          </button>

          <button
            type="button"
            onClick={() => goTo('map')}
            style={{
              padding: '12px 28px',
              background: 'transparent',
              border: '1px solid var(--color-gold-dim)',
              borderRadius: '3px',
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, color 0.15s ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--color-gold)'
              ;(e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-text)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--color-gold-dim)'
              ;(e.currentTarget as HTMLButtonElement).style.color =
                'var(--color-gold)'
            }}
            onFocus={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.outline =
                '2px solid var(--color-gold)'
              ;(e.currentTarget as HTMLButtonElement).style.outlineOffset = '3px'
            }}
            onBlur={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.outline = 'none'
            }}
          >
            Ver el mapa
          </button>
        </div>

        {/* Stats */}
        <StatsRow />

        {/* Progress banner */}
        <ProgressBanner />
      </section>

      {/* ── Feature cards ─────────────────────────────────────────────────── */}
      <section
        aria-label="Secciones de la enciclopedia"
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        {/* Section heading */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'var(--color-border)',
            }}
            aria-hidden="true"
          />
          <h2
            style={{
              fontFamily: 'var(--font-cinzel)',
              fontWeight: 400,
              fontSize: '0.7rem',
              letterSpacing: '0.2em',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Explorar
          </h2>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'var(--color-border)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '16px',
          }}
        >
          {FEATURE_CARDS.map((card) => (
            <Card
              key={card.section}
              card={card}
              onClick={() => goTo(card.section)}
            />
          ))}
        </div>
      </section>
    </motion.div>
  )
}

export default HomePage
