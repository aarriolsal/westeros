import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet'
import type { Layer, GeoJSON as LeafletGeoJSON, StyleFunction } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppStore } from '../store/useAppStore'
import { CHARS, HOUSES, PLACES } from '../data/characters'
import { useGeoData } from '../components/sections/map/useGeoData'
import { MAP_CRS, MAP_CENTER, MAP_MIN_ZOOM, MAP_MAX_ZOOM, MAP_BOUNDS, TILE_URL } from '../components/sections/map/mapConfig'

// ─── Region metadata (presentation only — geometry lives in public/data/*.geojson) ──

interface RegionMeta {
  id: string
  name: string
  tagline: string
  note: string
  color: string
  highlight: string
}

const REGION_META: RegionMeta[] = [
  { id: 'beyond', name: 'Más allá del Muro', tagline: 'Tierras salvajes al norte del Muro', note: 'Territorio helado y hostil, hogar del Pueblo Libre, los gigantes y, en las profundidades, de los Caminantes Blancos.', color: '#3f5560', highlight: '#5c7784' },
  { id: 'north', name: 'El Norte', tagline: 'Invernalia y los Stark', note: 'Vastos territorios más allá del Cuello. Antiguo reino de los Primeros Hombres, hoy guardado por los Stark.', color: '#2f363c', highlight: '#4a5568' },
  { id: 'iron', name: 'Islas del Hierro', tagline: 'Pyke y los Greyjoy', note: 'Islas rocosas de saqueadores y navegantes. Los Hombres del Hierro pagan el precio del hierro y no se arrodillan de buen grado.', color: '#14181c', highlight: '#1f2429' },
  { id: 'riverlands', name: 'Tierras de los Ríos', tagline: 'Los Tully y el Tridente', note: 'Tierras fértiles surcadas de ríos. Sede de la Casa Tully, campo de batalla constante durante la Guerra de los Cinco Reyes.', color: '#244e85', highlight: '#3a6fb0' },
  { id: 'vale', name: 'El Valle', tagline: 'Nido de Águilas y los Arryn', note: 'Reino de montaña con una fortaleza inexpugnable. La Casa Arryn ha guardado el Valle durante miles de años.', color: '#1f5fa0', highlight: '#2c7bc6' },
  { id: 'westerlands', name: 'Tierras del Oeste', tagline: 'Roca Casterly y los Lannister', note: 'Ricas minas de oro bajo Roca Casterly. La Casa Lannister gobierna las tierras más ricas de Poniente.', color: '#7d1226', highlight: '#9b1b30' },
  { id: 'crownlands', name: 'Las Coronas', tagline: 'Desembarco del Rey', note: 'Región capital en torno a Desembarco del Rey. Sede del Trono de Hierro y la corte real.', color: '#0b0b0b', highlight: '#1a1a2e' },
  { id: 'stormlands', name: 'Tierras de la Tormenta', tagline: 'Bastión de Tormentas y Baratheon', note: 'Costas escarpadas azotadas por tormentas. Cuna de la Casa Baratheon y de la rebelión de Robert.', color: '#161616', highlight: '#2a2a2a' },
  { id: 'reach', name: 'El Dominio', tagline: 'Altojardín y los Tyrell', note: 'La región más poblada y fértil. La Casa Tyrell dispone de ejércitos numerosos y graneros sin fin.', color: '#1f5a32', highlight: '#2d7a45' },
  { id: 'dorne', name: 'Dorne', tagline: 'Lanza del Sol y los Martell', note: 'Reino desértico jamás conquistado por Aegon. Se unió al reino por matrimonio y conserva sus propias costumbres.', color: '#c2511c', highlight: '#e0681f' },
]

function getRegionMeta(id: string) {
  return REGION_META.find(r => r.id === id)
}

function getRegionHouses(id: string) {
  const meta = getRegionMeta(id)
  if (!meta) return []
  return HOUSES.filter(h => h.region === meta.name)
}

function getRegionChars(id: string) {
  const houseIds = getRegionHouses(id).map(h => h.id)
  return CHARS.filter(c => c.house && houseIds.includes(c.house))
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapPage() {
  const { region, setRegion } = useAppStore()
  const { regions, places } = useGeoData()
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null)
  const [regionVersion, setRegionVersion] = useState(0) // bump to force GeoJSON restyle on selection change

  const activeMeta = region ? getRegionMeta(region) : null
  const activeHouses = region ? getRegionHouses(region) : []
  const activeChars = region ? getRegionChars(region) : []

  function handleRegionClick(id: string) {
    setRegion(id === region ? null : id)
    setRegionVersion(v => v + 1)
  }

  const regionStyle: StyleFunction = useMemo(() => (feature) => {
    const id = feature?.properties?.id as string
    const meta = getRegionMeta(id)
    const isActive = region === id
    return {
      color: isActive ? '#c9a44c' : '#1a2030',
      weight: isActive ? 2 : 1,
      fillColor: meta?.color ?? '#333',
      fillOpacity: isActive ? 0.75 : 0.55,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, regionVersion])

  function onEachRegion(feature: GeoJSON.Feature, layer: Layer) {
    const id = feature.properties?.id as string
    const meta = getRegionMeta(id)
    layer.on({
      click: () => handleRegionClick(id),
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 0.85, fillColor: meta?.highlight ?? meta?.color })
      },
      mouseout: () => {
        geoJsonRef.current?.resetStyle(layer as never)
      },
    })
  }

  const placeById = useMemo(() => new Map<string, typeof PLACES[number]>(PLACES.map(p => [p.id, p])), [])
  const houseById = useMemo(() => new Map<string, typeof HOUSES[number]>(HOUSES.map(h => [h.id, h])), [])

  return (
    <section style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Page header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{
          fontFamily: 'var(--font-cinzel)',
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-gold-dim)',
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
          Explora el mapa: arrastra y haz zoom, y selecciona una región para ver sus señores, casas y personajes.
        </p>
      </div>

      {/* Main layout: map + panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: activeMeta ? 'minmax(0, 1fr) minmax(0, 380px)' : '1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }}>
        {/* Leaflet map */}
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
          borderRadius: 6,
          overflow: 'hidden',
          height: '70vh',
          minHeight: 420,
        }}>
          <MapContainer
            crs={MAP_CRS}
            center={MAP_CENTER}
            zoom={MAP_MIN_ZOOM}
            minZoom={MAP_MIN_ZOOM}
            maxZoom={MAP_MAX_ZOOM}
            maxBounds={MAP_BOUNDS}
            style={{ height: '100%', width: '100%', background: '#0a1628' }}
          >
            <TileLayer url={TILE_URL} attribution="Tiles: Atlas of Thrones basemap" />

            {regions && (
              <GeoJSON
                ref={geoJsonRef}
                data={regions}
                style={regionStyle}
                onEachFeature={onEachRegion}
              />
            )}

            {places && places.features.map((feature) => {
              const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates
              const props = feature.properties as { kind: 'place' | 'houseSeat'; id: string }
              if (props.kind === 'place') {
                const place = placeById.get(props.id)
                if (!place) return null
                return (
                  <CircleMarker
                    key={props.id}
                    center={[lat, lng]}
                    radius={5}
                    pathOptions={{ color: '#c9a44c', weight: 1.5, fillColor: '#c9a44c', fillOpacity: 0.9 }}
                  >
                    <Popup>
                      <strong>{place.name}</strong>
                      <br />
                      <em>{place.kind} · {place.region}</em>
                      <p style={{ margin: '4px 0 0' }}>{place.desc}</p>
                    </Popup>
                  </CircleMarker>
                )
              }
              const house = houseById.get(props.id)
              if (!house) return null
              return (
                <CircleMarker
                  key={props.id}
                  center={[lat, lng]}
                  radius={5}
                  pathOptions={{ color: house.accent, weight: 1.5, fillColor: house.accent, fillOpacity: 0.9 }}
                >
                  <Popup>
                    <strong>{house.seat}</strong>
                    <br />
                    <em>Sede de la Casa {house.name}</em>
                    <p style={{ margin: '4px 0 0' }}>{house.summary}</p>
                  </Popup>
                </CircleMarker>
              )
            })}
          </MapContainer>
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {activeMeta && (
            <motion.div
              key={activeMeta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              {/* Region title card */}
              <div style={{
                background: 'var(--color-bg-card)',
                border: `1px solid ${activeMeta.highlight}55`,
                borderLeft: `3px solid ${activeMeta.highlight}`,
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
                      {activeMeta.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => { setRegion(null); setRegionVersion(v => v + 1) }}
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
                  color: activeMeta.highlight,
                  margin: '0 0 0.75rem',
                  fontStyle: 'italic',
                }}>
                  {activeMeta.tagline}
                </p>
                <p style={{
                  color: 'var(--color-text)',
                  fontSize: '0.88rem',
                  margin: 0,
                  lineHeight: 1.65,
                }}>
                  {activeMeta.note}
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
                      <div key={house.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              {activeChars.length > 0 && (
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
                    {activeChars.map(char => (
                      <div key={char.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
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
                            background: char.status === 'Vivo' ? '#5aa86a22' : '#9b3b3b22',
                            color: char.status === 'Vivo' ? 'var(--color-alive)' : 'var(--color-dead)',
                            border: `1px solid ${char.status === 'Vivo' ? '#5aa86a44' : '#9b3b3b44'}`,
                            fontVariantNumeric: 'tabular-nums',
                          }}>
                            {char.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-dim)', margin: 0, lineHeight: 1.55 }}>
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
    </section>
  )
}
