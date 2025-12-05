<script setup lang="ts">
// IMPORTANT: al mòbil aquest switcher és intencionadament minimalista.
// Quan es fa clic al badge actual, es despleguen tots els idiomes com
// una llista vertical de NuxtLinks, sense blur ni fons, exactament
// sobre el mateix badge. No convertir en <button> ni afegir decoracions.

const { locale, locales } = useI18n()
const rawSwitchLocalePath = useSwitchLocalePath()
const route = useRoute()

// Wrapper per normalitzar el path i, en el cas del blog, treure el hash
const switchLocalePath = (code: any) => {
  const targetCode =
    typeof code === 'string'
      ? code
      : typeof code === 'object' && code !== null && 'code' in code
        ? (code.code as string)
        : String(code)

  const raw = rawSwitchLocalePath(targetCode as "ca" | "es" | "en")

  // Al blog, evitem el hash per no causar hydration mismatch
  if (route.path === '/blog' || route.path.startsWith('/blog/')) {
    return raw.split('#')[0]
  }

  return raw
}

const isOpen = ref(false)

// Normalitzar locales: accepta string[] o objectes amb .code
const normalizedLocales = computed(() => {
  const value = locales?.value ?? locales

  if (!Array.isArray(value)) return []

  return value.map((loc: any) => {
    if (typeof loc === 'string') {
      return { code: loc }
    }
    return loc
  })
})

const panelLocales = computed(() => {
  const activeCode = locale.value
  const list = normalizedLocales.value.slice()

  // Posem sempre la llengua activa al principi
  list.sort((a, b) => {
    if (a.code === activeCode && b.code !== activeCode) return -1
    if (b.code === activeCode && a.code !== activeCode) return 1
    return 0 // la resta mantenen l'ordre original entre elles
  })

  return list
})

const isActive = (code: string) => code === locale.value

const close = () => {
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>


<template>
  <div class="language-switcher">
    <!-- Llista horitzontal per desktop (com abans) -->
    <div class="lang-inline-list lang-desktop-only">
      <NuxtLink
        v-for="loc in normalizedLocales"
        :key="loc.code"
        :to="switchLocalePath(loc.code)"
        :class="['lang-link', { 'lang-link--active': isActive(loc.code) }]"
        data-testid="`lang-${loc-code}`"
      >
        {{ loc.code.toUpperCase() }}
      </NuxtLink>
    </div>

    <!-- Mobil Trigger mòbil: + panell vertical transparent -->
    <div class="lang-mobile-only">
      <NuxtLink
        :to="switchLocalePath(locale)"
        :class="['lang-link', { 'lang-link--active': isActive(locale) }]"
        @click="toggle"
        data-testid="`lang-${loc-code}`"
      >
        {{ locale.toUpperCase() }}
      </NuxtLink>

      <!-- Overlay flotant mòbil -->
      <transition name="lang-overlay-fade">
        <div
          v-if="isOpen"
          class="lang-overlay"
          @click.self="close"
        >
          <div class="lang-panel">
            <NuxtLink
              v-for="loc in panelLocales"
              :key="loc.code"
              :to="switchLocalePath(loc.code)"
              class="lang-panel-link"
              :class="{ 'lang-panel-link--active': isActive(loc.code) }"
              @click="close"
            >
              {{ loc.code.toUpperCase() }}
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: flex;
  align-items: center;
}

/* ---------- DESKTOP (llista horitzontal com abans) ---------- */

.lang-inline-list {
  display: flex;
  gap: 10px;
}

.lang-link {
  text-decoration: none;
  font-size: 0.9em;
  font-weight: normal;
  color: var(--color-text-muted);
  transition: color 0.2s, border-color 0.2s, background-color 0.2s;
  padding: 2px 5px;
  border-radius: 999px;
}

.lang-link:hover {
  color: var(--color-primary);
  background-color: rgba(0, 0, 0, 0.03);
}

/* Actiu */
.lang-link--active {
  font-weight: bold;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-accent);
}

/* ---------- TRIGGER MÒBIL + OVERLAY ---------- */

.lang-trigger {
  border: 1px solid var(--color-border-subtle, rgba(0, 0, 0, 0.1));
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-text-muted);
  border-radius: 999px;
  padding: 2px 5px;
  font-size: 0.9em;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.lang-trigger:hover {
  background-color: rgba(0, 0, 0, 0.03);
  color: var(--color-primary);
}

/* Només mòbil mostra trigger, desktop amaga */
.lang-trigger--mobile {
  display: none;
}

@media (max-width: 640px) {
  .lang-inline-list {
    display: none; /* amaguem llista horitzontal al mòbil */
  }

  .lang-trigger--mobile {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

/* Overlay flotant (mòbil) */

.lang-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  /* background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px); */
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

/* Panel ajustat EXACTAMENT al contingut (amplada ≈ badges) */
.lang-panel {
  margin-top: 12px; /* ajusta segons alçada del header */
  margin-right: 4px; 
  /* background: var(--color-surface);  */
  /* border-radius: 12px; */
  padding: 4px 6px;
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  width: auto;      /* clau: no forcem amplada */
  min-width: 0;
  max-width: none;  /* per no limitar-la artificialment */
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); */
}

/* Llista vertical de badges: l'alçada és exactament la de la llista */
.lang-panel-link {
  text-decoration: none;
  font-size: 0.9em;
  padding: 4px 6px;
  border-radius: 999px;
  color: var(--color-text-muted);
  transition: background-color 0.2s, color 0.2s;
  white-space: nowrap; /* mantenim badge compacte */
}

.lang-panel-link + .lang-panel-link {
  margin-top: 6px;
}

.lang-panel-link:hover {
  background-color: rgba(0, 0, 0, 0.04);
  color: var(--color-primary);
}

.lang-panel-link--active {
  font-weight: bold;
  color: var(--color-primary);
  background-color: rgba(0, 0, 0, 0.06);
}

/* Animació suau de l'overlay */
.lang-overlay-fade-enter-active,
.lang-overlay-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lang-overlay-fade-enter-from,
.lang-overlay-fade-leave-to {
  opacity: 0;
}

/* Per defecte, tot amagat (decidirem per media queries) */
.lang-desktop-only {
  display: none;
}

.lang-mobile-only {
  display: none;
}

/* DESKTOP (>= 640px): només llista horitzontal */
@media (min-width: 640px) {
  .lang-desktop-only {
    display: flex;
    gap: 10px;
  }

  .lang-mobile-only {
    display: none;
  }
}

/* MÒBIL (< 640px): només trigger + panell */
@media (max-width: 639px) {
  .lang-desktop-only {
    display: none;
  }

  .lang-mobile-only {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
}

</style>
