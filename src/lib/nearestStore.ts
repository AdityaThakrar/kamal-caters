import { CATERING_STORES, type StoreId, type StoreLocation } from '../data/storeLocations'

const EARTH_MI = 3958.7613

function toRad(d: number): number {
  return (d * Math.PI) / 180
}

/** Great-circle distance in miles. */
export function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_MI * c
}

const TIE_BREAK_EPS_MI = 0.05

export interface NearestStoreResult {
  chosen: StoreId
  miles: Record<StoreId, number>
  /** Short copy for onboarding UI. */
  summary: string
}

export function pickNearestStore(userLat: number, userLng: number): NearestStoreResult {
  const stores = CATERING_STORES as readonly StoreLocation[]
  const m1 = haversineMiles(userLat, userLng, stores[0].lat, stores[0].lng)
  const m2 = haversineMiles(userLat, userLng, stores[1].lat, stores[1].lng)
  const miles: Record<StoreId, number> = { 'store-1': m1, 'store-2': m2 }

  let chosen: StoreId
  if (Math.abs(m1 - m2) <= TIE_BREAK_EPS_MI) {
    chosen = 'store-1'
  } else {
    chosen = m1 < m2 ? 'store-1' : 'store-2'
  }

  const s1 = stores[0]
  const s2 = stores[1]
  const closer =
    chosen === 'store-1'
      ? `${s1.title} is closest (~${m1.toFixed(1)} mi). ${s2.title} is ~${m2.toFixed(1)} mi.`
      : `${s2.title} is closest (~${m2.toFixed(1)} mi). ${s1.title} is ~${m1.toFixed(1)} mi.`

  const tieNote =
    Math.abs(m1 - m2) <= TIE_BREAK_EPS_MI
      ? ` Distances are essentially equal — we assigned ${s1.title} by default.`
      : ''

  return {
    chosen,
    miles,
    summary: `${closer}${tieNote}`,
  }
}
