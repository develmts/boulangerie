<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { DailyStats, PageStats } from '@/services/goatcounter'
import {
  fetchTodayStats,
  fetchTotalViewsPerPage,
  fetchGoatCounterMock,
} from '@/services/goatcounter'

const today = ref<DailyStats | null>(null)
const weeklyTotals = ref<PageStats[]>([])
const week = ref<DailyStats[]>([])
const selectedPeriod = ref<'today' | 'week'>('week')

const visitsToday = computed(() => today.value?.total ?? 0)

// KPI's
const weeklyTotal = computed(() =>
  week.value.reduce((sum, day) => sum + day.total, 0)
)

const weeklyAverage = computed(() => {
  if (!week.value.length) return 0
  return weeklyTotal.value / week.value.length
})

const topPage = computed(() => {
  if (!weeklyTotals.value.length) return null
  const sorted = [...weeklyTotals.value].sort((a, b) => b.views - a.views)
  return sorted[0]
})

const growthPercent = computed(() => {
  if (week.value.length < 2) return null
  const last = week.value[week.value.length - 1]
  const prev = week.value[week.value.length - 2]
  if (prev.total === 0) return null
  return ((last.total - prev.total) / prev.total) * 100
})


onMounted(async () => {
  today.value = await fetchTodayStats()
  weeklyTotals.value = await fetchTotalViewsPerPage()
  week.value = await fetchGoatCounterMock()
})

const filteredDays = computed(() => {
  if (selectedPeriod.value === 'today') {
    return today.value ? [today.value] : []
  }
  return week.value
})

// BAR CHART (top 5)
const barChartOptions = computed(() => {
  const sorted = [...weeklyTotals.value].sort((a, b) => b.views - a.views).slice(0, 5)

  return {
    title: { text: 'Top 5 pàgines (setmana)', left: 'center' },
    tooltip: {},
    grid: { left: 40, right: 20, top: 40, bottom: 80 },
    xAxis: {
      type: 'category',
      data: sorted.map((p) => p.path),
      axisLabel: { interval: 0, rotate: 30 },
    },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: sorted.map((p) => p.views),
        itemStyle: { color: '#c85b63' },
      },
    ],
  }
})

// LINE CHART (visites per dia)
const lineChartOptions = computed(() => {
  const days = filteredDays.value

  return {
    title: { text: 'Visites per dia', left: 'center' },
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: { type: 'category', data: days.map((d) => d.date) },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Visites',
        type: 'line',
        data: days.map((d) => d.total),
        smooth: true,
        lineStyle: { width: 3, color: '#c85b63' },
        itemStyle: { color: '#c85b63' },
      },
    ],
  }
})

const dailyBarChartOptions = computed(() => {
  const days = filteredDays.value

  return {
    title: { text: 'Totals per dia', left: 'center' },
    tooltip: { trigger: 'axis' },
    grid: { left: 40, right: 20, top: 40, bottom: 40 },
    xAxis: {
      type: 'category',
      data: days.map((d) => d.date),
      axisLabel: {
        rotate: 30,
      },
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Visites',
        type: 'bar',
        data: days.map((d) => d.total),
        itemStyle: { color: '#c85b63' },
      },
    ],
  }
})

</script>

<template>
  <div class="analytics-container">
    <header class="mb-8">
      <h1 class="title">Analytics (mock setmana)</h1>
      <p class="subtitle">
        Visualització d'una setmana de visites generades com a mock.
      </p>
    </header>

    <!-- Targetes KPI -->
    <section class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Visites avui</div>
        <div class="kpi-value">{{ visitsToday }}</div>
        <div class="kpi-help"> segons mock (últim dia registrat) </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">Mitjana diària (setmana)</div>
        <div class="kpi-value">
          {{ weeklyAverage.toFixed(1) }}
        </div>
        <div class="kpi-help">
          visites/dia
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">Pàgina més vista</div>
        <div class="kpi-value small">
          <span v-if="topPage">
            {{ topPage.path }}
          </span>
          <span v-else>—</span>
        </div>
        <div class="kpi-help" v-if="topPage">
          {{ topPage.views }} visites setmanals
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">Canvi vs. dia anterior</div>
        <div class="kpi-value" v-if="growthPercent !== null">
          {{ growthPercent.toFixed(1) }}%
        </div>
        <div class="kpi-value" v-else>—</div>
        <div class="kpi-help">
          positiu = creix, negatiu = baixa
        </div>
      </div>
    </section>


    <!-- Selector de període -->
    <section class="mb-6">
      <label class="label">Període:</label>
      <select v-model="selectedPeriod" class="select">
        <option value="today">Avui (mock)</option>
        <option value="week">Última setmana</option>
      </select>
    </section>

    <!-- Resum d'avui -->
    <section v-if="today" class="card">
      <h2 class="section-title">Resum d'avui</h2>
      <p class="text-lg">
        Total visites: <strong>{{ today.total }}</strong>
      </p>
      <ul class="list">
        <li v-for="page in today.pages" :key="page.path">
          <code>{{ page.path }}</code> — {{ page.views }} visites
        </li>
      </ul>
    </section>

    <!-- Gràfic barres -->
    <section>
      <h2 class="section-title">Top 5 pàgines més vistes (setmana)</h2>
      <div class="chart-container">
        <VChart :option="barChartOptions" autoresize />
      </div>
    </section>

    <!-- Gràfic línia -->
    <section>
      <h2 class="section-title">Visites per dia</h2>
      <div class="chart-container">
        <VChart :option="lineChartOptions" autoresize />
      </div>
    </section>

    <!-- Llista simple -->
    <section>
      <h2 class="section-title">Totals per dia</h2>
      <div class="chart-container">
        <VChart :option="dailyBarChartOptions" autoresize />
      </div>
    </section>

  </div>
</template>

<style scoped>
.analytics-container {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
}

.subtitle {
  color: #666;
}

.label {
  font-weight: 500;
}

.select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.list li {
  font-size: 0.9rem;
  padding: 0.2rem 0;
}

.chart-container {
  width: 100%;
  height: 340px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0.5rem;
  background: #fff;
  margin-bottom: 2rem;
}

.days-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  border-bottom: 1px solid #eee;
}

.total {
  font-weight: 600;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.kpi-card {
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 0.9rem 1rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.kpi-label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #888;
  margin-bottom: 0.4rem;
}

.kpi-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #c85b63;
  margin-bottom: 0.3rem;
  word-break: break-word;
}

.kpi-value.small {
  font-size: 1rem;
}

.kpi-help {
  font-size: 0.8rem;
  color: #777;
}

</style>
