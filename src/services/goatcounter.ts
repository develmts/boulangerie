// src/services/goatcounter.ts

/**
 * Local domain model used by the app
 */
export type PageStats = {
  path: string
  views: number
}

export type DailyStats = {
  date: string       // YYYY-MM-DD
  total: number      // total pageviews that day
  pages: PageStats[] // per-page breakdown for that day
}

/* -------------------------------------------------------------------------- */
/*  MOCK DATA (current UI uses this)                                          */
/* -------------------------------------------------------------------------- */

import rawAnalytics from '~/data/analytics_mock_goatcounter_week.json'

type RawDay = {
  date: string
  total: number
  pages: Record<string, number>
}

const analytics = rawAnalytics as RawDay[]

function mapMockDays(): DailyStats[] {
  return analytics.map((day) => ({
    date: day.date,
    total: day.total,
    pages: Object.entries(day.pages).map(([path, views]) => ({
      path,
      views,
    })),
  }))
}

/* -------------------------------------------------------------------------- */
/*  RUNTIME CONFIG & MODE SELECTION                                           */
/* -------------------------------------------------------------------------- */

/**
 * Environment-driven configuration.
 * You can control behaviour with:
 *
 *   NUXT_GOATCOUNTER_MODE = "api" | "mock"
 *   GOATCOUNTER_SITE      = "mysite"      (subdomain)
 *   GOATCOUNTER_API_KEY   = "secret"      (API token)
 */
const GOATCOUNTER_MODE =
  process.env.NUXT_GOATCOUNTER_MODE === 'mock' ? 'mock' : 'api'

const GOATCOUNTER_SITE =
  process.env.GOATCOUNTER_SITE || process.env.NUXT_GOATCOUNTER_SITE || ''

const GOATCOUNTER_API_KEY =
  process.env.GOATCOUNTER_API_KEY || process.env.NUXT_GOATCOUNTER_API_KEY || ''

const GOATCOUNTER_API_BASE = GOATCOUNTER_SITE
  ? `https://${GOATCOUNTER_SITE}.goatcounter.com/api/v0`
  : ''

function isServer() {
  return typeof window === 'undefined'
}

function hasApiConfig() {
  return !!(GOATCOUNTER_API_BASE && GOATCOUNTER_API_KEY)
}

/**
 * Final decision: should we use real API or fallback to mock?
 * - Only uses API if:
 *   - mode is "api"
 *   - we are on server
 *   - site + apiKey are properly configured
 */
function shouldUseApi(): boolean {
  return GOATCOUNTER_MODE === 'api' && isServer() && hasApiConfig()
}

console.log(`NUXT_GOATCOUNTER_MODE: ${GOATCOUNTER_MODE}`)
console.log(`GOATCOUNTER_SITE: ${GOATCOUNTER_SITE}`)
console.log(`GOATCOUNTER_API_KEY: ${GOATCOUNTER_API_KEY}`)
console.log(`GOATCOUNTER_API_BASE: ${GOATCOUNTER_API_BASE}`)
console.log(`Is Server: ${isServer()}`)
console.log(`Has Api: ${hasApiConfig()}`)
console.log(`shouldUseApi: ${shouldUseApi()}`)

/* -------------------------------------------------------------------------- */
/*  PUBLIC API (AUTO: API vs MOCK)                                            */
/*  These are the functions that analytics.vue is already using.              */
/* -------------------------------------------------------------------------- */

/**
 * Unified: return a list of days.
 * - If API is available and allowed → GoatCounter API
 * - Otherwise → local mock week
 */
export async function fetchGoatCounterMock(): Promise<DailyStats[]> {
  if (shouldUseApi()) {
    return fetchGoatCounterStatsFromAPI()
  }
  return mapMockDays()
}

/**
 * ✅ Nova funció: alias perquè analytics.vue pugui cridar fetchDailyStats()
 *    sense trencar res. Reutilitza tota la lògica API/mock de dalt.
 */
export async function fetchDailyStats(): Promise<DailyStats[]> {
  return fetchGoatCounterMock()
}

/**
 * Unified: total views per page over the period.
 * - If API is available and allowed → GoatCounter API
 * - Otherwise → local mock week
 */
export async function fetchTotalViewsPerPage(): Promise<PageStats[]> {
  if (shouldUseApi()) {
    return fetchTotalViewsPerPageFromAPI()
  }

  const allDays = mapMockDays()
  const pageMap: Record<string, number> = {}

  for (const day of allDays) {
    for (const page of day.pages) {
      pageMap[page.path] = (pageMap[page.path] ?? 0) + page.views
    }
  }

  return Object.entries(pageMap).map(([path, views]) => ({ path, views }))
}

/**
 * Unified "today":
 * - If API is available and allowed → last day from real stats
 * - Otherwise → last day from mock
 */
export async function fetchTodayStats(): Promise<DailyStats | null> {
  if (shouldUseApi()) {
    return fetchTodayStatsFromAPI()
  }

  const all = mapMockDays()
  if (!all.length) return null
  return all[all.length - 1]
}

/* -------------------------------------------------------------------------- */
/*  REAL GOATCOUNTER API (server-side only)                                   */
/* -------------------------------------------------------------------------- */

export type GoatCounterRange = {
  start?: string // ISO datetime rounded to hour
  end?: string   // ISO datetime rounded to hour
}

type GoatCounterTotalResponse = {
  total: number
  total_events: number
  stats: {
    day: string // "YYYY-MM-DD"
    daily: number
    hourly: number[]
  }[]
}

type GoatCounterHitsResponse = {
  hits: {
    path: string
    title?: string
    // count total de visites en el rang per aquest path
    count: number
    max: number
    stats: {
      day: string
      daily: number
      hourly: number[]
    }[]
  }[]
  total: number
  more: boolean
}

function toHourISO(d: Date): string {
  const copy = new Date(d)
  copy.setMinutes(0, 0, 0)
  return copy.toISOString()
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000)
  return {
    start: toHourISO(start),
    end: toHourISO(end),
  }
}

function assertServerSide() {
  if (!isServer()) {
    throw new Error('GoatCounter API must be called from server-side only')
  }
}

/**
 * Low-level: fetches day-by-day stats from GoatCounter and maps to DailyStats.
 * Not used directly in the current UI — called via the unified functions above.
 */
export async function fetchGoatCounterStatsFromAPI(
  range?: GoatCounterRange,
): Promise<DailyStats[]> {
  assertServerSide()

  if (!hasApiConfig()) {
    throw new Error(
      'GoatCounter API not configured. Set GOATCOUNTER_SITE and GOATCOUNTER_API_KEY.',
    )
  }

  const { start, end } = (() => {
    const r = getDefaultRange()
    return {
      start: range?.start ?? r.start,
      end: range?.end ?? r.end,
    }
  })()

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${GOATCOUNTER_API_KEY}`,
  }

  const [totalResp, hitsResp] = await Promise.all([
    fetch(
      `${GOATCOUNTER_API_BASE}/stats/total?start=${encodeURIComponent(
        start,
      )}&end=${encodeURIComponent(end)}&daily=true`,
      { headers },
    ),
    fetch(
      `${GOATCOUNTER_API_BASE}/stats/hits?start=${encodeURIComponent(
        start,
      )}&end=${encodeURIComponent(
        end,
      )}&daily=true&path_by_name=true&limit=100`,
      { headers },
    ),
  ])

  if (!totalResp.ok) {
    const text = await totalResp.text()
    throw new Error(`GoatCounter /stats/total error: ${totalResp.status} ${text}`)
  }

  if (!hitsResp.ok) {
    const text = await hitsResp.text()
    throw new Error(`GoatCounter /stats/hits error: ${hitsResp.status} ${text}`)
  }

  const totalJson = (await totalResp.json()) as GoatCounterTotalResponse
  const hitsJson = (await hitsResp.json()) as GoatCounterHitsResponse

  const byDay: Record<string, DailyStats> = {}
   // Enrich with per-page breakdown
  for (const item of hitsJson.hits) {
    const path = item.path
    for (const stat of item.stats) {
      const day = stat.day
      const views = stat.daily

      if (!byDay[day]) {
        byDay[day] = {
          date: day,
          total: views,
          pages: [],
        }
      }

      byDay[day].pages.push({ path, views })
    }
  }



  // Base per-day totals
  for (const stat of totalJson.stats) {
    byDay[stat.day] = {
      date: stat.day,
      total: stat.daily,
      pages: [],
    }
  }

  // Enrich with per-page breakdown
  for (const item of hitsJson.hits) {
    const path = item.path
    for (const stat of item.stats) {
      const day = stat.day
      const views = stat.daily

      if (!byDay[day]) {
        byDay[day] = {
          date: day,
          total: views,
          pages: [],
        }
      }

      byDay[day].pages.push({ path, views })
    }
  }

  return Object.values(byDay).sort((a, b) => (a.date < b.date ? -1 : 1))
}

export async function fetchTotalViewsPerPageFromAPI(
  range?: GoatCounterRange,
): Promise<PageStats[]> {
  const days = await fetchGoatCounterStatsFromAPI(range)
  const pageMap: Record<string, number> = {}

  for (const day of days) {
    for (const page of day.pages) {
      pageMap[page.path] = (pageMap[page.path] ?? 0) + page.views
    }
  }

  return Object.entries(pageMap).map(([path, views]) => ({ path, views }))
}

export async function fetchTodayStatsFromAPI(
  range?: GoatCounterRange,
): Promise<DailyStats | null> {
  const days = await fetchGoatCounterStatsFromAPI(range)
  if (!days.length) return null
  return days[days.length - 1]
}
