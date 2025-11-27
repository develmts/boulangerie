// plugins/counter.client.ts
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Si no hi ha ID, no fem res
  if (!config.public.counterId) {
    return
  }
  
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    console.info('[counter.dev] entorn no-producció, no s’injecta script.');
    return;
  }
  useHead({
    script: [
      {
        src: 'https://cdn.counter.dev/script.js',
        async: true,
        defer: true,
        'data-id': config.public.counterId,
        'data-utcoffset': config.public.counterUtcOffset || '1',
      } as any, // cast senzill per evitar problemes de tipus
    ],
  })
})
