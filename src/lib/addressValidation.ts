export const DELIVERY_CITY_REGEX = /^[A-Za-z\s.'-]+$/
export const DELIVERY_STATE_REGEX = /^[A-Za-z]{2}$/
export const ZIP_5_REGEX = /^\d{5}$/

export function isDeliveryAddressValid(fields: {
  deliveryLine1: string
  deliveryCity: string
  deliveryState: string
  deliveryZip: string
}): boolean {
  const street = fields.deliveryLine1.trim()
  const city = fields.deliveryCity.trim()
  const state = fields.deliveryState.trim()
  const zip = fields.deliveryZip.replace(/\D/g, '')

  return (
    street.length >= 5 &&
    city.length >= 3 &&
    DELIVERY_CITY_REGEX.test(city) &&
    DELIVERY_STATE_REGEX.test(state) &&
    ZIP_5_REGEX.test(zip)
  )
}

export function isPickupZipValid(zip: string): boolean {
  return ZIP_5_REGEX.test(zip.replace(/\D/g, ''))
}

/** Short kitchen label from store title, e.g. "Almaden Erik's DeliCafé" → "Almaden". */
export function kitchenShortName(storeTitle: string): string {
  return storeTitle.replace(/\s+Erik'?s DeliCaf[eé]$/i, '').trim() || storeTitle
}
