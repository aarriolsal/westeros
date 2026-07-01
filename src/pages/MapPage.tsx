import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { CHARS, HOUSES } from '../data/characters'

// ─── Region data ─────────────────────────────────────────────────────────────

const REGIONS = [
  {
    id: 'north',
    name: 'El Norte',
    color: '#2f363c',
    highlight: '#4a5568',
    tagline: 'Invernalia y los Stark',
    note: 'Vast territories beyond the Neck. Ancient kingdom of the First Men, now guarded by the Stark wardens.',
  },
  {
    id: 'riverlands',
    name: 'Tierras de los Ríos',
    color: '#244e85',
    highlight: '#3a6fb0',
    tagline: 'Los Tully y el Tridente',
    note: 'Fertile lands crisscrossed by rivers. Seat of House Tully, contested battleground during the War of Five Kings.',
  },
  {
    id: 'westerlands',
    name: 'Tierras del Oeste',
    color: '#7d1226',
    highlight: '#9b1b30',
    tagline: 'Roca Casterly y los Lannister',
    note: 'Rich gold mines under Casterly Rock. House Lannister rules the wealthiest lands in Westeros.',
  },
  {
    id: 'reach',
    name: 'El Dominio',
    color: '#1f5a32',
    highlight: '#2d7a45',
    tagline: 'Altojardín y los Tyrell',
    note: 'The most populous and fertile region. House Tyrell commands vast armies and grain supplies.',
  },
  {
    id: 'stormlands',
    name: 'Tierras de la Tormenta',
    color: '#161616',
    highlight: '#2a2a2a',
    tagline: 'Bastión de Tormentas y Baratheon',
    note: "Rugged coastal lands battered by storms. Birthplace of House Baratheon and Robert's rebellion.",
  },
  {
    id: 'dorne',
    name: 'Dorne',
    color: '#c2511c',
    highlight: '#e0681f',
    tagline: 'Lanza del Sol y los Martell',
    note: 'Desert kingdom never conquered by Aegon. Joined the realm through marriage, keeping its unique customs.',
  },
  {
    id: 'vale',
    name: 'El Valle',
    color: '#1f5fa0',
    highlight: '#2c7bc6',
    tagline: 'Nido de Águilas y los Arryn',
    note: 'Mountain kingdom with an impregnable fortress. House Arryn has held the Vale for thousands of years.',
  },
  {
    id: 'iron_islands',
    name: 'Islas del Hierro',
    color: '#14181c',
    highlight: '#1f2429',
    tagline: 'Pyke y los Greyjoy',
    note: 'Rocky islands of reavers and sailors. The Ironborn pay the iron price and bow to no king willingly.',
  },
  {
    id: 'crownlands',
    name: 'Las Coronas',
    color: '#0b0b0b',
    highlight: '#1a1a2e',
    tagline: 'Desembarco del Rey',
    note: 'Capital region around King\'s Landing. Seat of the Iron Throne and the royal court.',
  },
]

// ─── Region → house mapping ───────────────────────────────────────────────────

function getRegionHouseIds(regionId: string): string[] {
  const region = REGIONS.find(r => r.id === regionId)
  if (!region) return []
  const houses = HOUSES.filter(h => {
    const houseRegion = h.region.toLowerCase()
    const regionName = region.name.toLowerCase()
    // Direct match
    if (houseRegion === regionName) return true
    // Specific mappings for region ids
    if (regionId === 'north' && houseRegion === 'el norte') return true
    if (regionId === 'riverlands' && houseRegion === 'tierras de los ríos') return true
    if (regionId === 'westerlands' && houseRegion === 'tierras del oeste') return true
    if (regionId === 'reach' && houseRegion === 'el dominio') return true
    if (regionId === 'stormlands' && houseRegion === 'tierras de la tormenta') return true
    if (regionId === 'dorne' && houseRegion === 'dorne') return true
    if (regionId === 'vale' && houseRegion === 'el valle') return true
    if (regionId === 'iron_islands' && houseRegion === 'islas del hierro') return true
    if (regionId === 'crownlands' && houseRegion === 'las coronas') return true
    return false
  })
  return houses.map(h => h.id)
}

function getRegionChars(regionId: string) {
  const houseIds = getRegionHouseIds(regionId)
  return CHARS.filter(c => c.house && houseIds.includes(c.house))
}

// ─── SVG path data for each region ───────────────────────────────────────────
// viewBox: 0 0 600 900  (width x height)
// Simplified schematic shapes — not geographically accurate

const REGION_PATHS: Record<string, string> = {
  // The North — large upper territory, roughly occupies y 40–370
  north:
    'M 90,50 L 510,50 L 510,80 L 530,100 L 530,200 L 510,220 L 500,260 L 490,300 ' +
    'L 470,320 L 440,340 L 400,360 L 370,370 L 320,370 L 280,360 L 240,350 ' +
    'L 200,340 L 170,310 L 150,280 L 140,250 L 120,230 L 100,200 L 90,160 Z',

  // Riverlands — central-left middle band
  riverlands:
    'M 170,370 L 320,370 L 340,385 L 350,400 L 345,430 L 330,450 ' +
    'L 310,465 L 280,470 L 250,465 L 220,450 L 200,430 L 185,405 L 170,385 Z',

  // Westerlands — western coast, mid-height
  westerlands:
    'M 90,370 L 170,370 L 185,405 L 200,430 L 220,450 L 200,470 ' +
    'L 180,490 L 160,500 L 100,500 L 80,480 L 75,440 L 80,400 Z',

  // Reach — large south-western region
  reach:
    'M 100,500 L 160,500 L 180,490 L 200,470 L 220,450 L 250,465 ' +
    'L 280,470 L 290,490 L 300,510 L 295,540 L 280,560 L 260,580 ' +
    'L 240,600 L 200,620 L 160,630 L 120,620 L 90,600 L 80,560 L 82,520 Z',

  // Stormlands — south-eastern coast
  stormlands:
    'M 370,370 L 400,360 L 440,340 L 470,360 L 490,390 L 510,430 ' +
    'L 520,470 L 510,510 L 490,540 L 470,555 L 450,560 L 420,555 ' +
    'L 395,545 L 380,520 L 360,490 L 345,460 L 345,430 L 350,400 L 340,385 Z',

  // Dorne — southernmost territory (below Reach + Stormlands)
  dorne:
    'M 110,635 L 160,630 L 200,625 L 240,622 L 280,622 L 320,622 ' +
    'L 360,622 L 395,612 L 420,602 L 448,588 L 450,560 L 420,555 ' +
    'L 395,545 L 380,520 L 360,490 L 345,460 L 310,465 L 280,470 ' +
    'L 290,492 L 300,512 L 295,542 L 278,562 L 258,582 L 238,602 ' +
    'L 195,622 L 155,632 L 120,640 L 100,665 L 105,695 ' +
    'L 160,710 L 240,716 L 320,714 L 390,705 L 440,688 ' +
    'L 455,668 L 455,640 L 448,588 Z',

  // The Vale — eastern mountain kingdom
  vale:
    'M 470,320 L 500,260 L 510,220 L 530,200 L 540,240 L 545,280 ' +
    'L 540,320 L 530,350 L 510,370 L 490,380 L 470,370 L 455,355 Z',

  // Iron Islands — small western archipelago
  iron_islands:
    'M 55,390 L 70,385 L 78,390 L 75,400 L 65,405 L 55,400 Z ' +
    'M 45,415 L 62,410 L 70,415 L 68,425 L 55,430 L 44,425 Z ' +
    'M 55,440 L 70,436 L 76,442 L 73,452 L 60,456 L 52,450 Z',

  // Crownlands — small region around King's Landing
  crownlands:
    'M 345,430 L 360,420 L 370,430 L 380,450 L 380,470 L 370,480 ' +
    'L 360,490 L 345,460 Z',
}

// Label positions for each region (cx, cy)
const REGION_LABELS: Record<string, { x: number; y: number; size?: number }> = {
  north:        { x: 300, y: 210 },
  riverlands:   { x: 260, y: 420 },
  westerlands:  { x: 135, y: 440 },
  reach:        { x: 185, y: 565 },
  stormlands:   { x: 440, y: 470 },
  dorne:        { x: 295, y: 680 },
  vale:         { x: 510, y: 310 },
  iron_islands: { x: 58,  y: 470, size: 7 },
  crownlands:   { x: 363, y: 455, size: 7 },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapPage() {
  const { region, setRegion } = useAppStore()
  const [hovered, setHovered] = useState<string | null>(null)

  const activeRegion = REGIONS.find(r => r.id === region) ?? null
  const regionChars = region ? getRegionChars(region) : []
  const activeHouseIds = region ? getRegionHouseIds(region) : []
  const activeHouses = HOUSES.filter(h => activeHouseIds.includes(h.id))

  function handleRegionClick(id: string) {
    setRegion(id === region ? null : id)
  }

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 4rem' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-gold-dim)',
          marginBottom: '0.4rem',
          margin: '0 0 0.4rem',
        }}>
          Geografía
        </p>
        <h1 style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
          color: 'var(--color-gold)',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.15,
          textWrap: 'balance',
        }}>
          El Continente Poniente
        </h1>
        <p style={{
          color: 'var(--color-text-dim)',
          fontSize: '0.88rem',
          margin: '0.6rem 0 0',
          lineHeight: 1.6,
        }}>
          Selecciona una región para explorar sus señores, casas y personajes.
        </p>
      </div>

      {/* ── Main layout: map + panel ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeRegion ? 'minmax(0, 420px) 1fr' : '1fr',
        gap: '2rem',
        alignItems: 'start',
      }}>

        {/* ── SVG Map ── */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          overflow: 'hidden',
          position: 'relative',
        }}>
          <svg
            viewBox="0 0 600 760"
            width="100%"
            preserveAspectRatio="xMidYMid meet"
            style={{ display: 'block' }}
            role="img"
            aria-label="Mapa esquemático de Poniente"
          >
            {/* Water background */}
            <rect width="600" height="760" fill="#0a1628" />

            {/* Subtle water texture — horizontal wave lines */}
            {Array.from({ length: 28 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1={20 + i * 26}
                x2="600"
                y2={20 + i * 26}
                stroke="#0d1e38"
                strokeWidth="1"
              />
            ))}

            {/* ── Region paths ── */}
            {REGIONS.map(r => {
              const isActive = region === r.id
              const isHovered = hovered === r.id
              const fill = isActive ? r.highlight : isHovered ? r.highlight : r.color
              const strokeColor = isActive
                ? 'var(--color-gold)'
                : isHovered
                ? '#c9a44c88'
                : '#1a2030'
              const strokeW = isActive ? 2 : 1

              return (
                <path
                  key={r.id}
                  d={REGION_PATHS[r.id]}
                  fill={fill}
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  strokeLinejoin="round"
                  style={{ cursor: 'pointer', transition: 'fill 0.18s, stroke 0.18s' }}
                  onClick={() => handleRegionClick(r.id)}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  role="button"
                  aria-label={r.name}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleRegionClick(r.id) }}
                />
              )
            })}

            {/* ── The Wall ── */}
            <line
              x1="90" y1="50"
              x2="510" y2="50"
              stroke="#a0c8e8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="8 4"
            />
            <text
              x="300" y="44"
              textAnchor="middle"
              fill="#a0c8e8"
              fontSize="8"
              fontFamily="Cinzel, Georgia, serif"
              letterSpacing="3"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
              ─── EL MURO ───
            </text>

            {/* ── Region labels ── */}
            {REGIONS.map(r => {
              const pos = REGION_LABELS[r.id]
              if (!pos) return null
              const fontSize = pos.size ?? 9
              const isActive = region === r.id
              const labelColor = isActive ? '#c9a44c' : '#d0c8b0'

              if (r.id === 'iron_islands') {
                return (
                  <text
                    key={r.id}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    fill={labelColor}
                    fontSize={fontSize}
                    fontFamily="Cinzel, Georgia, serif"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                    transform={`rotate(-90, ${pos.x}, ${pos.y})`}
                  >
                    ISLAS DEL HIERRO
                  </text>
                )
              }

              const shortNames: Record<string, string[]> = {
                north:       ['EL NORTE'],
                riverlands:  ['TIERRAS', 'DE LOS RÍOS'],
                westerlands: ['TIERRAS', 'DEL OESTE'],
                reach:       ['EL', 'DOMINIO'],
                stormlands:  ['TIERRAS DE', 'LA TORMENTA'],
                dorne:       ['DORNE'],
                vale:        ['EL', 'VALLE'],
                crownlands:  ['CORONAS'],
              }

              const lines = shortNames[r.id] ?? [r.name.toUpperCase()]

              return (
                <text
                  key={r.id}
                  x={pos.x}
                  y={pos.y - (lines.length - 1) * (fontSize * 0.65)}
                  textAnchor="middle"
                  fill={labelColor}
                  fontSize={fontSize}
                  fontFamily="Cinzel, Georgia, serif"
                  letterSpacing="1.5"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {lines.map((line, li) => (
                    <tspan key={li} x={pos.x} dy={li === 0 ? 0 : fontSize * 1.3}>
                      {line}
                    </tspan>
                  ))}
                </text>
              )
            })}

            {/* ── Capital marker: King's Landing ── */}
            <circle cx="362" cy="452" r="4" fill="none" stroke="#c9a44c" strokeWidth="1.5" />
            <circle cx="362" cy="452" r="1.5" fill="#c9a44c" />

            {/* ── Compass rose (bottom-right) ── */}
            <g transform="translate(560, 720)">
              <circle r="16" fill="#0a1628" stroke="#1a2a40" strokeWidth="1" />
              <text y="-8" textAnchor="middle" fill="#7a8fa8" fontSize="7" fontFamily="Cinzel, serif">N</text>
              <text y="13" textAnchor="middle" fill="#4a5f78" fontSize="6" fontFamily="Cinzel, serif">S</text>
              <text x="-9" y="3" textAnchor="middle" fill="#4a5f78" fontSize="6" fontFamily="Cinzel, serif">O</text>
              <text x="9" y="3" textAnchor="middle" fill="#4a5f78" fontSize="6" fontFamily="Cinzel, serif">E</text>
              <line y1="-5" y2="5" stroke="#3a4f68" strokeWidth="0.5" />
              <line x1="-5" x2="5" stroke="#3a4f68" strokeWidth="0.5" />
            </g>
          </svg>

          {/* Hint when nothing selected */}
          {!region && (
            <p style={{
              textAlign: 'center',
              color: 'var(--color-text-dim)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-cinzel)',
              letterSpacing: '0.05em',
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--color-border)',
              margin: 0,
            }}>
              Toca una región para saber más
            </p>
          )}
        </div>

        {/* ── Info panel ── */}
        <AnimatePresence>
          {activeRegion && (
            <motion.div
              key={activeRegion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              {/* Region title card */}
              <div style={{
                background: 'var(--color-bg-card)',
                border: `1px solid ${activeRegion.highlight}55`,
                borderLeft: `3px solid ${activeRegion.highlight}`,
                borderRadius: 6,
                padding: '1.25rem 1.5rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  marginBottom: '0.6rem',
                }}>
                  <div>
                    <p style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--color-gold-dim)',
                      margin: '0 0 0.35rem',
                    }}>
                      Región
                    </p>
                    <h2 style={{
                      fontFamily: 'var(--font-cinzel)',
                      fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                      color: 'var(--color-gold)',
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.2,
                      textWrap: 'balance',
                    }}>
                      {activeRegion.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setRegion(null)}
                    aria-label="Cerrar panel"
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 4,
                      color: 'var(--color-text-dim)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      padding: '0.25rem 0.55rem',
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
                <p style={{
                  fontFamily: 'var(--font-cinzel)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  color: activeRegion.highlight,
                  margin: '0 0 0.75rem',
                  fontStyle: 'italic',
                }}>
                  {activeRegion.tagline}
                </p>
                <p style={{
                  color: 'var(--color-text)',
                  fontSize: '0.88rem',
                  margin: 0,
                  lineHeight: 1.65,
                }}>
                  {activeRegion.note}
                </p>
              </div>

              {/* Houses in region */}
              {activeHouses.length > 0 && (
                <div style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: '1.1rem 1.4rem',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-dim)',
                    margin: '0 0 0.9rem',
                    fontWeight: 600,
                  }}>
                    Casas
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {activeHouses.map(house => (
                      <div
                        key={house.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 4,
                          background: house.c1,
                          border: `1px solid ${house.accent}66`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontFamily: 'var(--font-cinzel)',
                          fontSize: '0.8rem',
                          color: house.accent,
                          fontWeight: 700,
                        }}>
                          {house.initial}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'var(--font-cinzel)',
                            fontSize: '0.84rem',
                            color: 'var(--color-text)',
                            fontWeight: 600,
                          }}>
                            {house.name}
                          </div>
                          <div style={{
                            fontSize: '0.76rem',
                            color: 'var(--color-text-dim)',
                            fontStyle: 'italic',
                          }}>
                            {house.words}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notable characters */}
              {regionChars.length > 0 && (
                <div style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  padding: '1.1rem 1.4rem',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-cinzel)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--color-gold-dim)',
                    margin: '0 0 0.9rem',
                    fontWeight: 600,
                  }}>
                    Personajes notables
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {regionChars.map(char => (
                      <div key={char.id}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-cinzel)',
                            fontSize: '0.84rem',
                            color: 'var(--color-text)',
                            fontWeight: 600,
                          }}>
                            {char.name}
                          </span>
                          <span style={{
                            fontSize: '0.7rem',
                            padding: '0.1rem 0.45rem',
                            borderRadius: 3,
                            background: char.status === 'Vivo'
                              ? '#5aa86a22'
                              : '#9b3b3b22',
                            color: char.status === 'Vivo'
                              ? 'var(--color-alive)'
                              : 'var(--color-dead)',
                            border: `1px solid ${char.status === 'Vivo' ? '#5aa86a44' : '#9b3b3b44'}`,
                            fontVariantNumeric: 'tabular-nums',
                          }}>
                            {char.status}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.78rem',
                          color: 'var(--color-text-dim)',
                          margin: 0,
                          lineHeight: 1.55,
                        }}>
                          {char.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Responsive: on narrow screens, panel appears below the map ── */}
      <style>{`
        @media (max-width: 680px) {
          /* Grid is already single-column by default due to minmax logic;
             ensure the panel stacks naturally */
        }
      `}</style>
    </section>
  )
}
