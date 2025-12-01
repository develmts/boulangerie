<!-- src/pages/analytics.vue -->
<script setup lang="ts">
import type { DailyStats, PageStats } from '~/services/goatcounter'
import {
  fetchGoatCounterMock,
  fetchTotalViewsPerPage,
  fetchTodayStats
} from '~/services/goatcounter'

const { t } = useI18n()

/**
 * IMPORTANT
 * Fem servir useAsyncData a nivell de setup (SSR + client hydration).
 * - En SSR: si NUXT_GOATCOUNTER_MODE = "api" i config és correcta,
 *   goatcounter.ts farà servir l'API real.
 * - En client: reutilitza les dades serialitzades (no torna a trucar l'API).
 */
const {
  data: dailyStats,
  pending: pendingDaily,
  error: errorDaily
} = await useAsyncData<DailyStats[]>(
  'gc-daily-stats',
  () => fetchGoatCounterMock()
)

const {
  data: perPageStats,
  pending: pendingPages,
  error: errorPages
} = await useAsyncData<PageStats[]>(
  'gc-per-page-stats',
  () => fetchTotalViewsPerPage()
)

const {
  data: todayStats
} = await useAsyncData<DailyStats | null>(
  'gc-today-stats',
  () => fetchTodayStats()
)

const isLoading = computed(() => pendingDaily.value || pendingPages.value)
const hasError = computed(() => !!errorDaily.value || !!errorPages.value)

const totalViews = computed(() =>
  (dailyStats.value ?? []).reduce((sum, day) => sum + day.total, 0)
)

const totalDays = computed(() => (dailyStats.value ?? []).length)

const totalPagesTracked = computed(() => (perPageStats.value ?? []).length)

/**
 * Line chart: daily totals
 */
const dailyChartOption = computed(() => {
  const days = dailyStats.value ?? []

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
  const stats = perPageStats.value ?? []
  // Ordenem de més vist a menys vist
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
        <div class="analytics-mode">
          <!-- Petit indicador de mode, opcional -->
          <span class="mode-pill">
            <!-- No podem saber 100% el mode des d'aquí sense exposar-ho,
                 però com a mínim informem que pot estar usant mock. -->
            {{ t('analytics.mode') || 'Dades possibles: mock o API segons config' }}
          </span>
        </div>
      </header>

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

        <!-- GRÀFICS -->
        <div class="analytics-charts">
          <div class="chart-card">
            <ClientOnly>
              <VChart
                v-if="dailyStats && dailyStats.length"
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

          <div class="chart-card">
            <ClientOnly>
              <VChart
                v-if="perPageStats && perPageStats.length"
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
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.analytics-page {
  --bg: #f9f4ec;
  --card-bg: #ffffff;
  --border-subtle: #e5ddd0;
  --text-main: #2b2620;
  --text-muted: #7a6f63;
  --accent: #c26a3d;
  --radius-lg: 16px;
  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.05);

  background: radial-gradient(circle at top left, #fdf6ea 0, #f9f4ec 40%, #f7f0e4 100%);
  padding: 2.2rem 1.25rem 3rem;
  color: var(--text-main);
}

.analytics-inner {
  max-width: 1120px;
  margin: 0 auto;
}

.analytics-header {
  display: flex;
  flex-direction: column;
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

.analytics-mode {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.mode-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  background: #f2e7d8;
  border: 1px solid rgba(0, 0, 0, 0.03);
  font-size: 0.78rem;
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
  grid-template-columns: minmax(0, 1fr);
  gap: 1.2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 0.75rem;
  box-shadow: var(--shadow-soft);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.chart {
  width: 100%;
  height: 280px;
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

/* RESPONSIVE */
@media (min-width: 720px) {
  .analytics-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .analytics-summary {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .analytics-charts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chart {
    height: 320px;
  }
}
</style>
