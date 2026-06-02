/**
 * Geocode helpers for onboarding (browser fetch).
 * Pickup: US ZIP via Zippopotam (no key).
 * Delivery: OpenStreetMap Nominatim (free; requires descriptive User-Agent), then ZIP fallback.
 */

const NOMINATIM_UA = 'CorporateCateringDemo/1.0 (internal demo; not for bulk use)'

export async function geocodeUsZip(zip: string): Promise<{ lat: number; lng: number } | null> {
  const z = zip.replace(/\D/g, '').slice(0, 5)
  if (z.length !== 5) return null
  const res = await fetch(`https://api.zippopotam.us/us/${z}`)
  if (!res.ok) return null
  const data: { places?: { latitude: string; longitude: string }[] } = await res.json()
  const p = data.places?.[0]
  if (!p) return null
  const lat = Number.parseFloat(p.latitude)
  const lng = Number.parseFloat(p.longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

export async function geocodeStreetAddress(
  line1: string,
  city: string,
  state: string,
  zip: string,
): Promise<{ lat: number; lng: number } | null> {
  const q = `${line1}, ${city}, ${state} ${zip}, USA`.trim()
  if (q.length < 8) return null

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'en',
        'User-Agent': NOMINATIM_UA,
      },
    })
    if (!res.ok) return null
    const data: { lat?: string; lon?: string }[] = await res.json()
    const hit = data[0]
    if (!hit?.lat || !hit?.lon) return null
    const lat = Number.parseFloat(hit.lat)
    const lng = Number.parseFloat(hit.lon)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
    return { lat, lng }
  } catch {
    return null
  }
}
