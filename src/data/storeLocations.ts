export type StoreId = 'store-1' | 'store-2'

export interface StoreLocation {
  id: StoreId
  title: string
  address: string
  lat: number
  lng: number
}

/** Fixed catering locations — coordinates for distance checks (approximate building centers). */
export const CATERING_STORES: readonly StoreLocation[] = [
  {
    id: 'store-1',
    title: "Almaden Erik's DeliCafé",
    address: '4611 Almaden Expy, San Jose, CA 95118',
    lat: 37.26455,
    lng: -121.87745,
  },
  {
    id: 'store-2',
    title: "Campbell Erik's DeliCafé",
    address: '1777 S Bascom Ave, Campbell, CA 95008',
    lat: 37.29185,
    lng: -121.93155,
  },
] as const

export function storeById(id: StoreId): StoreLocation {
  const s = CATERING_STORES.find((x) => x.id === id)
  if (!s) throw new Error(`Unknown store ${id}`)
  return s
}
