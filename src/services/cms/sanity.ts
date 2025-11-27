// src/services/cms/sanity.ts
import {
  createClient,
  type SanityClient,
  type ClientConfig,
} from '@sanity/client'

/**
 * Config bàsica de Sanity.
 * Quan tinguis projecte real, omplirem aquestes variables a .env
 */
const sanityConfig: ClientConfig = {
  projectId: process.env.NUXT_SANITY_PROJECT_ID || '',
  dataset: process.env.NUXT_SANITY_DATASET || '',
  // Data fixa no futura (format YYYY-MM-DD)
  apiVersion: '2024-02-01',
  useCdn: true,
}

let _sanityClient: SanityClient | null = null

/**
 * Singleton del client de Sanity.
 */
export function getSanityClient(): SanityClient {
  if (!_sanityClient) {
    if (!sanityConfig.projectId || !sanityConfig.dataset) {
      console.warn(
        '[sanity] Missing projectId or dataset – funcionant en MOCK MODE (el client no pot parlar amb cap projecte real).',
      )
    }

    _sanityClient = createClient(sanityConfig)
  }

  return _sanityClient
}

/**
 * Helper per fer fetch GROQ. Ara no l’estàs usant, però queda preparat.
 */
export function sanityFetch<T = unknown>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  return getSanityClient().fetch(query, params as any) as Promise<T>
}

/**
 * Helpers addicionals, per si algun dia els necessites des de backend/admin.
 */
export function sanityGetDocument<T = unknown>(
  id: string,
): Promise<T | null> {
  return getSanityClient().getDocument(id) as Promise<T | null>
}

export function sanityGetDocuments<T = unknown>(
  ids: string[],
): Promise<(T | null)[]> {
  return getSanityClient().getDocuments(ids) as Promise<(T | null)[]>
}

export function sanityCreate(
  doc: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return getSanityClient().create(doc as any) as Promise<
    Record<string, unknown>
  >
}

export function sanityPatch(id: string): any {
  return getSanityClient().patch(id)
}

export function sanityDelete(id: string): Promise<unknown> {
  return getSanityClient().delete(id as any) as Promise<unknown>
}

// Re-export de tipus, per si els vols fer servir
export type { SanityClient, ClientConfig }
