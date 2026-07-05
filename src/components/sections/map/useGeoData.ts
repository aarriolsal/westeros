import { useEffect, useState } from 'react'
import { REGIONS_GEOJSON_URL, PLACES_GEOJSON_URL } from '@/config/map'

export function useGeoData() {
  const [regions, setRegions] = useState<GeoJSON.FeatureCollection | null>(null)
  const [places, setPlaces] = useState<GeoJSON.FeatureCollection | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(REGIONS_GEOJSON_URL).then(r => r.json()),
      fetch(PLACES_GEOJSON_URL).then(r => r.json()),
    ]).then(([regionsData, placesData]) => {
      if (cancelled) return
      setRegions(regionsData)
      setPlaces(placesData)
    })
    return () => { cancelled = true }
  }, [])

  return { regions, places, loading: !regions || !places }
}
