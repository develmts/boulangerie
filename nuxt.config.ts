// nuxt.config.ts
// Fix: Import `defineNuxtConfig` from 'nuxt/config' to resolve TypeScript error.
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Nunito:wght@400;700&display=swap' }
      ]
    }
  },
  devtools: { enabled: true },
  typescript: {
    strict: true 
  },
  css: ['@/assets/css/main.css'], 
  
  nitro: {
    preset: 'node-server' 
  },

  modules: ['@nuxtjs/i18n'], // <-- HABILITAR MÓDULO
  i18n: {
    locales: [ // Definición de locales (rutas /es/, /en/)
      { code: 'ca', file: 'ca.json' },
      { code: 'es', file: 'es.json' },
      { code: 'en', file: 'en.json' }
    ],
    lazy: true,
    langDir: 'locales', // Directori donde se almacenan los ficheros de traducción
    defaultLocale: 'ca', // Idioma por defecto
    strategy: 'prefix_except_default', // Estrategia de URL: /en/page (pero /page per catala)

    detectBrowserLanguage: false
  } ,
  // Configuración Vite para HMR en desarrollo local
  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        // Forçar a usar localhost (la majoria d'errors de 'refused' són per 'undefined' IP)
        host: 'localhost', 
      }
    }
  },
})