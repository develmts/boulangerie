export default defineEventHandler((event) => {
  // Return a silent 204 to prevent H3Error logs.
  setResponseStatus(event, 204)
  return ''
})