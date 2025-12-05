// server/routes/health.get.ts
export default defineEventHandler((event) => {
  // Evita qualsevol procés de SSR o Nuxt Rendering
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store')

  return 'OK'
})
