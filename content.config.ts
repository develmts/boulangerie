// content.config.ts
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['**/blog/**'],
      },
      schema: z.object({
        title: z.string().optional()
      })
    }),    
    blog: defineCollection({
      type: 'page',

       source: '**/blog/*.md',
      schema: z.object({
        title: z.string(),
        // molt recomanable coerce per passar de string del front-matter a Date
        date: z.coerce.date().optional(),
        excerpt: z.string().optional(),
        readingTime: z.number().optional(),
        locale: z.string().optional(),
        // afegeix aquí la resta de camps que facis servir al template
      })
    })
  }
})
