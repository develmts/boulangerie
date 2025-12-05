<!-- src/pages/analytics.vue -->
<script setup lang="ts">
const { t } = useI18n()

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

const {
  data,
  pending,
  error
} = await useAsyncData<AnalyticsResponse>('gc-analytics', () =>
  $fetch('/api/analytics/goatcounter')
)

const isLoading = computed(() => pending.value)
const hasError = computed(() => !!error.value)

const dailyStats = computed<Daily[]>(() => data.value?.daily ?? [])
const perPageStats = computed<PageStats[]>(() => data.value?.perPage ?? [])
const todayStats = computed<Daily | null>(() => data.value?.today ?? null)

const browserStats = computed<PlatformStat[]>(() => data.value?.browsers ?? [])
const systemStats = computed<PlatformStat[]>(() => data.value?.systems ?? [])

const totalViews = computed(() => data.value?.totalVisitors ?? 0)
const totalDays = computed(() => dailyStats.value.length)
const totalPagesTracked = computed(() => perPageStats.value.length)

/**
 * Line chart: daily totals
 */
const dailyChartOption = computed(() => {
  const days = dailyStats.value

  return {
    title: {
      text: t('analytics.daily_title') ?? 'Pageviews per day',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '8%',
      right: '4%',
      top: 50,
      bottom: 40
    },
    xAxis: {
      type: 'category',
      data: days.map((d) => d.date),
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: t('analytics.daily_series') ?? 'Pageviews',
        type: 'line',
        smooth: true,
        data: days.map((d) => d.total)
      }
    ]
  }
})

/**
 * Bar chart: total views per page
 */
const perPageChartOption = computed(() => {
  const stats = perPageStats.value
  const sorted = [...stats].sort((a, b) => b.views - a.views)

  return {
    title: {
      text: t('analytics.per_page_title') ?? 'Total views per page',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '8%',
      right: '4%',
      top: 50,
      bottom: 80
    },
    xAxis: {
      type: 'category',
      data: sorted.map((p) => p.path),
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: t('analytics.per_page_series') ?? 'Pageviews',
        type: 'bar',
        data: sorted.map((p) => p.views)
      }
    ]
  }
})

/**
 * Donut per Navegadors (desktop)
 */
const browsersDonutOption = computed(() => {
  const stats = browserStats.value
  if (!stats.length) return {}

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: {
        fontSize: 10
      }
    },
    series: [
      {
        name: t('analytics.browsers_title') || 'Navegadors',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: 'bold'
          }
        },
        data: stats.map((b) => ({
          name: b.name || '—',
          value: b.count
        }))
      }
    ]
  }
})

/**
 * Donut per Plataformes (desktop)
 */
const systemsDonutOption = computed(() => {
  const stats = systemStats.value
  if (!stats.length) return {}

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: {
        fontSize: 10
      }
    },
    series: [
      {
        name: t('analytics.systems_title') || 'Plataformes',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: 'bold'
          }
        },
        data: stats.map((s) => ({
          name: s.name || '—',
          value: s.count
        }))
      }
    ]
  }
})

/**
 * Dual donut Browsers + Systems (mobile)
 */
const platformDonutOption = computed(() => {
  const browsers = browserStats.value.slice(0, 5)
  const systems = systemStats.value.slice(0, 4)

  if (!browsers.length && !systems.length) {
    return {}
  }

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      textStyle: {
        fontSize: 10
      }
    },
    series: [
      {
        name: t('analytics.browsers_title') || 'Navegadors',
        type: 'pie',
        radius: ['25%', '45%'], // donut interior
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: 'bold'
          }
        },
        data: browsers.map((b) => ({
          name: b.name || '—',
          value: b.count
        }))
      },
      {
        name: t('analytics.systems_title') || 'Plataformes',
        type: 'pie',
        radius: ['55%', '75%'], // donut exterior
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 11,
            fontWeight: 'bold'
          }
        },
        data: systems.map((s) => ({
          name: s.name || '—',
          value: s.count
        }))
      }
    ]
  }
})
</script>

<template>
  <section class="analytics-page">
    <div class="analytics-inner">
      <header class="analytics-header">
        <div>
          <h1 class="analytics-title">
            {{ t('analytics.title') || 'Analítiques' }}
          </h1>
          <p class="analytics-subtitle">
            {{ t('analytics.subtitle') || 'Visites segons GoatCounter' }}
          </p>
        </div>
      </header>

      <p v-if="error && error.message" class="analytics-error-detail">
        {{ error.message }}
      </p>

      <!-- ESTAT DE CÀRREGA / ERROR -->
      <div v-if="isLoading" class="analytics-state">
        <p>{{ t('analytics.loading') || 'Carregant analítiques…' }}</p>
      </div>

      <div v-else-if="hasError" class="analytics-state analytics-state--error">
        <p>
          {{ t('analytics.error') || 'Error carregant dades d’analítiques.' }}
        </p>
      </div>

      <template v-else>
        <!-- SUMMARY CARDS -->
        <div class="analytics-summary">
          <div class="summary-card">
            <div class="summary-label">
              {{ t('analytics.cards.totalViews') || 'Total de pàgines vistes' }}
            </div>
            <div class="summary-value">
              {{ totalViews }}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              {{ t('analytics.cards.totalDays') || 'Dies en el rang' }}
            </div>
            <div class="summary-value">
              {{ totalDays }}
            </div>
          </div>

          <div class="summary-card">
            <div class="summary-label">
              {{ t('analytics.cards.pagesTracked') || 'Pàgines diferents' }}
            </div>
            <div class="summary-value">
              {{ totalPagesTracked }}
            </div>
          </div>

          <div class="summary-card" v-if="todayStats">
            <div class="summary-label">
              {{ t('analytics.cards.today') || 'Avui' }}
            </div>
            <div class="summary-value">
              {{ todayStats.total }}
            </div>
            <div class="summary-sub">
              {{ todayStats.date }}
            </div>
          </div>
        </div>

        <!-- GRÀFICS PRINCIPALS -->
        <div class="analytics-charts">
          <!-- Daily line -->
          <div class="chart-card">
            <ClientOnly>
              <VChart
                v-if="dailyStats.length"
                class="chart"
                :option="dailyChartOption"
                autoresize
              />
              <template #fallback>
                <div class="chart-fallback">
                  {{ t('analytics.chart_loading') || 'Carregant gràfic…' }}
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Per-page bars -->
          <div class="chart-card">
            <ClientOnly>
              <VChart
                v-if="perPageStats.length"
                class="chart"
                :option="perPageChartOption"
                autoresize
              />
              <template #fallback>
                <div class="chart-fallback">
                  {{ t('analytics.chart_loading') || 'Carregant gràfic…' }}
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- MOBILE ONLY: dual donut (browsers + systems) -->
          <div
            class="chart-card chart-card--mobile-only"
            v-if="browserStats.length || systemStats.length"
          >
            <ClientOnly>
              <VChart
                class="chart chart--platforms"
                :option="platformDonutOption"
                autoresize
              />
              <template #fallback>
                <div class="chart-fallback">
                  {{ t('analytics.chart_loading') || 'Carregant gràfic…' }}
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- DESKTOP ONLY: donut Navegadors -->
          <div
            class="chart-card chart-card--desktop-only"
            v-if="browserStats.length"
          >
            <ClientOnly>
              <VChart
                class="chart"
                :option="browsersDonutOption"
                autoresize
              />
              <template #fallback>
                <div class="chart-fallback">
                  {{ t('analytics.chart_loading') || 'Carregant gràfic…' }}
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- DESKTOP ONLY: donut Plataformes -->
          <div
            class="chart-card chart-card--desktop-only"
            v-if="systemStats.length"
          >
            <ClientOnly>
              <VChart
                class="chart"
                :option="systemsDonutOption"
                autoresize
              />
              <template #fallback>
                <div class="chart-fallback">
                  {{ t('analytics.chart_loading') || 'Carregant gràfic…' }}
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- DESGLOSSAMENT PER NAVEGADOR / SISTEMA (llistes de suport) -->
        <div
          class="analytics-platforms"
          v-if="browserStats.length || systemStats.length"
        >
          <div class="platform-card" v-if="browserStats.length">
            <h2 class="platform-title">
              {{ t('analytics.browsers_title') || 'Navegadors principals' }}
            </h2>
            <ul class="platform-list">
              <li
                v-for="b in browserStats.slice(0, 6)"
                :key="b.name"
                class="platform-row"
              >
                <span class="platform-name">{{ b.name || '—' }}</span>
                <span class="platform-count">{{ b.count }}</span>
              </li>
            </ul>
          </div>

          <div class="platform-card" v-if="systemStats.length">
            <h2 class="platform-title">
              {{ t('analytics.systems_title') || 'Plataformes / sistemes' }}
            </h2>
            <ul class="platform-list">
              <li
                v-for="s in systemStats.slice(0, 6)"
                :key="s.name"
                class="platform-row"
              >
                <span class="platform-name">{{ s.name || '—' }}</span>
                <span class="platform-count">{{ s.count }}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.analytics-page {
  --bg: #f9f4ec;
  --card-bg: var(--color-surface);
  --border-subtle: #e5ddd0;
  --text-main: #2b2620;
  --text-muted: #7a6f63;
  --accent: #c26a3d;
  --radius-lg: 16px;
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.05);

  background: radial-gradient(circle at top left, #fdf6ea 0, #f9f4ec 40%, #f7f0e4 100%);
  padding: 2.2rem 1.25rem 3rem;
  color: var(--text-main);
  display: flex;
  justify-content: center;

  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.analytics-inner {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
}

.analytics-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.analytics-title {
  font-family: var(--font-headings, system-ui, sans-serif);
  font-size: 1.9rem;
  margin: 0 0 0.4rem;
  letter-spacing: 0.02em;
}

.analytics-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
}

/* STATES */
.analytics-state {
  padding: 1.5rem 0.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.analytics-state--error {
  color: #b3261e;
}

.analytics-error-detail {
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #b3261e;
  opacity: 0.8;
}

/* SUMMARY CARDS */
.analytics-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1.7rem;
}

.summary-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 0.9rem 1rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.summary-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 0.3rem;
}

.summary-value {
  font-size: 1.4rem;
  font-weight: 600;
}

.summary-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* CHARTS */
.analytics-charts {
  display: grid;
  grid-template-columns: minmax(0, 1fr); /* mòbil: una columna */
  gap: 1.2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* visibilitat responsive */
.chart-card--mobile-only {
  display: block;
}

.chart-card--desktop-only {
  display: none;
}

.chart {
  width: 100%;
  height: 280px;
}

/* donut dual per navegadors + plataformes (mòbil) */
.chart.chart--platforms {
  height: 260px;
}

.chart-fallback {
  width: 100%;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* BREAKDOWN PER PLATFORM */
.analytics-platforms {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.platform-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 0.9rem 1rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.platform-title {
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
}

.platform-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.platform-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.85rem;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.04);
}

.platform-row:last-child {
  border-bottom: none;
}

.platform-name {
  color: var(--text-main);
}

.platform-count {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

/* RESPONSIVE */
@media (min-width: 720px) {
  .analytics-page {
    padding: 1.5rem 1rem 2rem;
  }

  .analytics-inner {
    max-width: 960px;
  }

  .analytics-header {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .analytics-summary {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .analytics-charts {
    grid-template-columns: repeat(2, minmax(0, 1fr)); /* desktop: 2 columnes */
  }

  .chart {
    height: 320px;
  }

  /* desktop: només es veuen els donuts separats */
  .chart-card--mobile-only {
    display: none;
  }

  .chart-card--desktop-only {
    display: block;
  }

  .analytics-platforms {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
