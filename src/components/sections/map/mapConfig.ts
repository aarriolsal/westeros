import { CRS } from 'leaflet'

// Single source of truth for the map's tile provider. Swapping to a self-hosted
// static tile pyramid (see the change's fallback runbook) is a one-line edit here —
// nothing else in the map code needs to change, as long as the replacement covers
// the same z/x/y scheme and CRS.
export const TILE_URL = 'https://cartocdn-gusc.global.ssl.fastly.net/ramirocartodb/api/v1/map/named/tpl_756aec63_3adb_48b6_9d14_331c6cbc47cf/all/{z}/{x}/{y}.png'

// CRS matches the configuration used in production by the open-source "Atlas of
// Thrones" project, which this tile set was built for. Center/bounds below are
// NOT copied from that project — they were derived empirically by reading real
// tile imagery (see openspec/changes/add-map-and-genealogy-libraries/design.md
// §5): Atlas of Thrones' own hardcoded initial view doesn't land on the
// continent under a plain `L.CRS.EPSG4326` transform, so it's disregarded here
// in favor of coordinates verified against the actual tiles.
export const MAP_CRS = CRS.EPSG4326
export const MAP_CENTER: [number, number] = [2, -82]
export const MAP_MIN_ZOOM = 4
export const MAP_MAX_ZOOM = 8
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [35, -96],
  [-15, -50],
]

export const REGIONS_GEOJSON_URL = `${import.meta.env.BASE_URL}data/westeros-regions.geojson`
export const PLACES_GEOJSON_URL = `${import.meta.env.BASE_URL}data/westeros-places.geojson`
