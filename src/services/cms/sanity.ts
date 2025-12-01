// src/services/cms/sanity.ts
import {
  createClient,
  type SanityClient,
  type ClientConfig,
} from '@sanity/client'

/**
 * Config bàsica de Sanity.
 * IMPORTANT:
 * - projectId i dataset han d'estar definits a .env
 * - apiVersion ha de ser una data fixa (YYYY-MM-DD)
 * - useCdn:
 *    - true en producció per a lectura pública (més ràpid, cachejat)
 *    - false en dev o quan necessitis dades molt fresques
 */
const sanityConfig: ClientConfig = {
  projectId: process.env.NUXT_SANITY_PROJECT_ID || '',
  dataset: process.env.NUXT_SANITY_DATASET || '',
  apiVersion: process.env.NUXT_SANITY_API_VERSION || '2024-02-01',
  useCdn: process.env.NODE_ENV === 'production',
  
  // Token opcional: només cal si vols llegir drafts o dades privades
  token: process.env.NUXT_SANITY_READ_TOKEN || undefined,
  
  // Amb client-side rendering cal vigilar molt on exposem el token.
  // Aquí assumim que aquest client es fa servir principalment en entorn server.
}

let _sanityClient: SanityClient | null = null

/**
 * Singleton del client de Sanity.
 * Si falta configuració bàsica, el client seguirà existint,
 * però qualsevol crida real fallarà (com és d’esperar).
 */
export function getSanityClient(): SanityClient {
  if (!_sanityClient) {
    if (!sanityConfig.projectId || !sanityConfig.dataset) {
      console.warn(
        '[sanity] Missing projectId or dataset – el client no està connectat a cap projecte real.',
      )
    }

    if (!sanityConfig.apiVersion) {
      console.warn(
        '[sanity] Missing apiVersion – usa una data fixa tipus "2024-02-01".',
      )
    }

    _sanityClient = createClient(sanityConfig)
  }

  return _sanityClient
}

/* -------------------------------------------------------------------------- */
/*  FETCH GROQ (lectura)                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Helper tipus wrapper per fer fetch GROQ.
 * - T: tipus de retorn esperat (pots tipar els teus DTOs)
 * - query: string GROQ
 * - params: objecte de paràmetres (opcions)
 *
 * Gestiona mínimament errors per tenir logs útils en dev.
 */
export async function sanityFetch<T = unknown>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const client = getSanityClient()

  try {
    const result = await client.fetch<T>(query, params as any)
    return result
  } catch (error) {
    console.error('[sanity] fetch error', {
      query,
      params,
      error,
    })
    throw error
  }
}

/* -------------------------------------------------------------------------- */
/*  LECTURA DIRECTA PER ID                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Obté un document pel seu _id exact (sense GROQ).
 */
export async function sanityGetDocument<T = unknown>(
  id: string,
): Promise<T | null> {
  const client = getSanityClient()

  try {
    const doc = await client.getDocument(id)
    return (doc as T) ?? null
  } catch (error) {
    console.error('[sanity] getDocument error', { id, error })
    throw error
  }
}

/**
 * Obté múltiples documents per id.
 */
export async function sanityGetDocuments<T = unknown>(
  ids: string[],
): Promise<(T | null)[]> {
  const client = getSanityClient()

  try {
    const docs = await client.getDocuments(ids)
    return docs as (T | null)[]
  } catch (error) {
    console.error('[sanity] getDocuments error', { ids, error })
    throw error
  }
}

/* -------------------------------------------------------------------------- */
/*  ESCRIPTURA / MUTACIONS                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Verifica si tenim token per fer mutacions.
 */
function ensureWriteToken(): void {
  if (!sanityConfig.token) {
    console.warn(
      '[sanity] write operation requested but no token is configured. ' +
      'Revisa NUXT_SANITY_READ_TOKEN (hauria de ser un token amb permisos d’escriptura si vols fer mutacions).',
    )
  }
}

/**
 * Crea un document nou.
 * ATENCIÓ:
 * - Només s’hauria d’usar des de context servidor (Nitro / API routes)
 * - Necessita token amb permisos d’escriptura
 */
export async function sanityCreate(
  doc: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  ensureWriteToken()

  const client = getSanityClient()

  try {
    const created = await client.create(doc as any)
    return created as Record<string, unknown>
  } catch (error) {
    console.error('[sanity] create error', { doc, error })
    throw error
  }
}

/**
 * Retorna un patch builder per fer actualitzacions.
 * Exemple d’ús (en entorn servidor):
 *
 *   await sanityPatch(id)
 *     .set({ title: 'New title' })
 *     .commit()
 */
export function sanityPatch(id: string) {
  ensureWriteToken()
  const client = getSanityClient()
  return client.patch(id)
}

/**
 * Elimina un document per id.
 * Igual que create/patch, això és per ús server-side.
 */
export async function sanityDelete(id: string): Promise<unknown> {
  ensureWriteToken()

  const client = getSanityClient()

  try {
    const result = await client.delete(id as any)
    return result
  } catch (error) {
    console.error('[sanity] delete error', { id, error })
    throw error
  }
}

// Re-export de tipus, per si els vols fer servir
export type { SanityClient, ClientConfig }
