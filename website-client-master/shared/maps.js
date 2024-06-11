export const GOOGLE_MAPS_KEY = process.env.NUXT_ENV_GOOGLE_MAPS_API

export const formatPropertyName = (propertyName) => {
  return propertyName.replace(' ', '+').toLowerCase()
}
