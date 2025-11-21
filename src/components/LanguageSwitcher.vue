<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

// Normalitzar locales: accepta string[] o objectes amb .code
const normalizedLocales = computed(() => {
  const value = locales?.value ?? locales;

  if (!Array.isArray(value)) return [];

  return value.map((loc: any) => {
    if (typeof loc === 'string') {
      return { code: loc };
    }
    return loc;
  });
});

const isActive = (code: string) => code === locale.value;
</script>

<template>
  <div class="language-switcher">
    <NuxtLink
      v-for="loc in normalizedLocales"
      :key="loc.code"
      :to="switchLocalePath(loc.code)"
      :class="['lang-link', { 'lang-link--active': isActive(loc.code) }]"
    >
      {{ loc.code.toUpperCase() }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.language-switcher {
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

/* Actiu (classe nova) */
.lang-link--active {
  font-weight: bold;
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-accent);
}
</style>
