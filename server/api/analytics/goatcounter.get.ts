// server/api/analytics/goatcounter.get.ts
import { defineEventHandler, createError } from 'h3'

/**
 * Tipus de domini que retornarà aquest endpoint
 */
type Daily = {
  date: string
  total: number
}

type PageStats = {
  path: string
  views: number
}

type PlatformStat = {
  name: string
  count: number
}

type AnalyticsResponse = {
  daily: Daily[]
  perPage: PageStats[]
  today: Daily | null
  totalVisitors: number
  meta: {
    start: string
    end: string
  }
  browsers: PlatformStat[]
  systems: PlatformStat[]
}

/**
 * Tipus alineats amb l’API de GoatCounter
 * (modelats a partir del seu OpenAPI / codi font).
 */
type TotalStat = {
  day: string
  hourly: number[]
  daily: number
}

type TotalResponse = {
  total: number
  total_events: number
  total_utc: number
  stats: TotalStat[]
}

type HitListStat = {
  day: string
  hourly: number[]
  daily: number
}

type HitList = {
  path: string
  count: number
  max: number
  stats: HitListStat[]
}

type HitsResponse = {
  hits: HitList[]
  total: number
  more: boolean
}

type StatsItem = {
  id: string
  name: string
  count: number
}

type StatsResponse = {
  stats: StatsItem[]
  more: boolean
}

/**
 * Helpers de rang
 */
function roundToHour(d: Date): string {
  const copy = new Date(d)
  copy.setMinutes(0, 0, 0)
  return copy.toISOString()
}

function getDefaultRange() {
  const end = new Date()
  const start = new Date(end.getTime() - 6 * 24 * 60 * 60 * 1000) // últims 7 dies
  return {
    start: roundToHour(start),
    end: roundToHour(end)
  }
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    if (typeof value === 'boolean') {
      q.set(key, value ? 'true' : 'false')
    } else {
      q.set(key, String(value))
    }
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

/**
 * Handler principal: sempre retorna AnalyticsResponse
 */
export default defineEventHandler(async (): Promise<AnalyticsResponse> => {
  // Llegim directament de process.env, res de runtimeConfig
  const baseUrlRaw =
    process.env.GOATCOUNTER_BASE_URL ||
    (process.env.GOATCOUNTER_SITE ? `https://${process.env.GOATCOUNTER_SITE}.goatcounter.com` : '')

  const apiKey = process.env.GOATCOUNTER_API_KEY || ''

  if (!baseUrlRaw || !apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'GoatCounter API not configured (GOATCOUNTER_BASE_URL / GOATCOUNTER_SITE / GOATCOUNTER_API_KEY)'
    })
  }

  const baseUrl = baseUrlRaw.replace(/\/+$/, '')
  const apiBase = `${baseUrl}/api/v0`

  const { start, end } = getDefaultRange()

  async function callGoat<T>(
    path: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<T> {
    const query = buildQuery(params)
    const url = `${apiBase}${path}${query}`

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    })

    if (!res.ok) {
      const body = await res.text()
      console.error('[GoatCounter]', path, res.status, body)
      throw createError({
        statusCode: res.status,
        statusMessage: `GoatCounter ${path} error ${res.status}: ${body}`
      })
    }

    return (await res.json()) as T
  }

  // 1) Totals globals per dia: /stats/total  (NO accepta "daily")
  const totalRes = await callGoat<TotalResponse>('/stats/total', {
    start,
    end
  })

  const daily: Daily[] = (totalRes.stats || []).map((s) => ({
    date: s.day,
    total: s.daily
  }))

  const today: Daily | null = daily.length ? daily[daily.length - 1] : null

  // 2) Stats per pàgina: /stats/hits  (AQUÍ SÍ admet "daily")
  const hitsRes = await callGoat<HitsResponse>('/stats/hits', {
    start,
    end,
    daily: true,
    limit: 100
  })

  const perPage: PageStats[] = (hitsRes.hits || []).map((hit) => ({
    path: hit.path,
    views: hit.count
  }))

  // 3) Navegadors: /stats/browsers
  const browsersRes = await callGoat<StatsResponse>('/stats/browsers', {
    start,
    end,
    limit: 10
  })

  const browsers: PlatformStat[] = (browsersRes.stats || []).map((s) => ({
    name: s.name,
    count: s.count
  }))

  // 4) Sistemes / plataformes: /stats/systems
  const systemsRes = await callGoat<StatsResponse>('/stats/systems', {
    start,
    end,
    limit: 10
  })

  const systems: PlatformStat[] = (systemsRes.stats || []).map((s) => ({
    name: s.name,
    count: s.count
  }))

  return {
    daily,
    perPage,
    today,
    totalVisitors: totalRes.total,
    meta: {
      start,
      end
    },
    browsers,
    systems
  }
})
