// nuxt.config.ts
// Fix: Import `defineNuxtConfig` from 'nuxt/config' to resolve TypeScript error.
import { defineNuxtConfig } from 'nuxt/config'
import path from 'path';

const isDev = true

export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Nunito:wght@400;700&display=swap' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
      ], 
      script: [
        {
          src: 'https://gc.zgo.at/count.js',
          async: true,
          'data-goatcounter': 'https://tu-compte.goatcounter.com/count',
        }
      ]
    }
  },
  appConfig: {
    CDN_BASE: 'https://develmts.github.io/dev-cdn/',
  },
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },
  devtools: { enabled: false },

  css: [
    "@/assets/css/tokens.css",
    "@/assets/css/theme.base.css",
    ... ( isDev
      ? [
          "@/assets/css/theme.french-minimal.css",
          "@/assets/css/theme.artisanal-warm.css",
          "@/assets/css/theme.pa-i-dolcos.css",
        ]
      : []), 
    "@/assets/css/main.css",
  ],
  experimental: {
    payloadExtraction: false,
  },
  i18n: {
      defaultLocale: 'ca',
      locales: [
          { code: 'ca', file: 'ca.json' },
          { code: 'es', file: 'es.json' },
          { code: 'en', file: 'en.json' },
      ],
      langDir: 'locales',
      strategy: 'prefix_except_default',
      detectBrowserLanguage: false,
  },
  
  nitro: {
    preset: 'node-server' ,
    compatibilityDate: '2025-11-18',
  },

  modules: [
    '@nuxt/content',
    '@nuxtjs/i18n'
  ], 

  runtimeConfig: {
    public: {
      mockCdnBaseUrl:
        process.env.NUXT_PUBLIC_MOCK_CDN_BASE_URL ||
        'https://develmts.github.io/dev-cdn/',
      // contact data
      contactAddress: process.env.NUXT_PUBLIC_CONTACT_ADDRESS,
      contactCity: process.env.NUXT_PUBLIC_CONTACT_CITY,
      contactPhone: process.env.NUXT_PUBLIC_CONTACT_PHONE,
      contactEmail: process.env.NUXT_PUBLIC_CONTACT_EMAIL,
      contactHours: process.env.NUXT_PUBLIC_CONTACT_HOURS,
      socialInstagram: process.env.NUXT_PUBLIC_SOCIAL_INSTAGRAM,
      socialFacebook: process.env.NUXT_PUBLIC_SOCIAL_FACEBOOK,
      socialTiktok: process.env.NUXT_PUBLIC_SOCIAL_TIKTOK,
      cmsSource:  process.env.NUXT_PUBLIC_CMS_SOURCE || 'content',
      serverMode: process.env.SERVER_MODE || 'serverless'
    },
  },  
  srcDir: 'src/',
  typescript: {
    strict: true 
  },
  // Configuración Vite para HMR en desarrollo local
  vite: {
    define: {
      'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(process.env.GEMINI_API_KEY)
    }, 
    // 👇 Equivalent al "resolve.alias"
    resolve: {
      alias: {
        // si el teu codi assumeix que @ apunta a src, jo ho deixaria així:
        '@': path.resolve(__dirname, './src')
      }
    },       
    server: {
      hmr: {
        protocol: 'ws',
        // Forçar a usar localhost (la majoria d'errors de 'refused' són per 'undefined' IP)
        host: '192.168.1.16', 
        port: 3000,
        clientPort: 3000,
      }

    }
  },
})