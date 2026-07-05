import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import type { Layer, GeoJSON as LeafletGeoJSON, StyleFunction } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAppStore } from '@/store/useAppStore'
import { useDataStore } from '@/store/useDataStore'
import { useGeoData } from '@/components/sections/map/useGeoData'
import { MAP_CRS, MAP_CENTER, MAP_MIN_ZOOM, MAP_MAX_ZOOM, MAP_BOUNDS, TILE_URL } from '@/config/map'
import { translationNameSpace } from '@/config/lang'

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapPage() {
  const { t } = useTranslation(translationNameSpace.map)
  const { t: tCommon } = useTranslation(translationNameSpace.common)
  const { region, setRegion } = useAppStore()
  const { regions: regionsGeo, places } = useGeoData()
  const { houses: HOUSES, characters: CHARS, places: PLACES, regions: REGION_META } = useDataStore()
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null)
  const [regionVersion, setRegionVersion] = useState(0) // bump to force GeoJSON restyle on selection change

  function getRegionMeta(id: string) {
    return REGION_META.find(r => r.id === id)
  }

  function getRegionHouses(id: string) {
    return HOUSES.filter(h => h.regionId === id)
  }

  function getRegionChars(id: string) {
    const houseIds = getRegionHouses(id).map(h => h.id)
    return CHARS.filter(c => c.house && houseIds.includes(c.house))
  }

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

  const placeById = useMemo(() => new Map<string, typeof PLACES[number]>(PLACES.map(p => [p.id, p])), [PLACES])
  const houseById = useMemo(() => new Map<string, typeof HOUSES[number]>(HOUSES.map(h => [h.id, h])), [HOUSES])

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
          {t('kicker', 'Geografía')}
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
          {t('title', 'El Continente Poniente')}
        </h1>
        <p style={{
          color: 'var(--color-text-dim)',
          fontSize: '0.88rem',
          margin: '0.6rem 0 0',
          lineHeight: 1.6,
        }}>
          {t('hint', 'Explora el mapa: arrastra y haz zoom, y selecciona una región para ver sus señores, casas y personajes.')}
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

            {regionsGeo && (
              <GeoJSON
                ref={geoJsonRef}
                data={regionsGeo}
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
                    <em>{t('placeSeatOf', { house: house.name, defaultValue: `Sede de la Casa ${house.name}` })}</em>
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
                      {t('regionLabel', 'Región')}
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
                    aria-label={t('closePanelAria', 'Cerrar panel')}
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
                    {t('housesHeading', 'Casas')}
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
                    {t('notableCharactersHeading', 'Personajes notables')}
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
                            background: char.status === 'alive' ? '#5aa86a22' : '#9b3b3b22',
                            color: char.status === 'alive' ? 'var(--color-alive)' : 'var(--color-dead)',
                            border: `1px solid ${char.status === 'alive' ? '#5aa86a44' : '#9b3b3b44'}`,
                            fontVariantNumeric: 'tabular-nums',
                          }}>
                            {char.status === 'alive' ? tCommon('progress.stateAlive', 'Vivo') : tCommon('progress.stateDead', 'Muerto')}
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
