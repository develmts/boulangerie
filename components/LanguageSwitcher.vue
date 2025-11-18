<!-- components/LanguageSwitcher.vue -->
<script setup lang="ts">
// Importar els composables de Nuxt i i18n
const { locale, locales } = useI18n(); 
const switchLocalePath = useSwitchLocalePath();

// Funció per determinar si un idioma és l'actiu
const isActive = (code: string) => code === locale.value;
</script>

<template>
  <div class="language-switcher">
    <NuxtLink 
        v-for="loc in locales" 
        :key="loc.code" 
        :to="switchLocalePath(loc.code)" 
        :class="{ active: isActive(loc.code) }"
        class="lang-link"
    >
      {{ loc.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<style scoped>
/* Estils específics del component (podeu moure'ls al CSS global si voleu) */
.language-switcher {
    display: flex;
    gap: 10px;
}
.lang-link {
    text-decoration: none;
    font-size: 0.9em;
    font-weight: normal;
    color: #888;
    transition: color 0.2s;
    padding: 2px 5px;
}
.lang-link:hover {
    color: var(--color-primary);
}
.lang-link.active {
    font-weight: bold;
    color: var(--color-primary);
    border-bottom: 2px solid var(--color-accent);
}
</style>