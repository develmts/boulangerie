<script setup lang="ts">
import { computed } from 'vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import HeaderCartButton from '~/components/HeaderCartButton.vue'
import HeaderUserButton from '~/components/HeaderUserButton.vue'

import { createNavLinks } from '~/config/navLinks'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const links = computed(() => createNavLinks(t, localePath))

function handleLogoClick() {
  emit('toggle-sidebar')
}
</script>

<template>
  <header>
    <button class="header-logo-button" type="button" @click="handleLogoClick">
      <img src="/assets/images/logo.png" alt="Piella Logo" class="brand-logo" />
    </button>

    <h1 class="brand-name-title">
      {{ t('header.title') }}
    </h1>

    <nav class="main-nav">
      <NuxtLink
        v-for="link in links"
        :key="link.key"
        :to="link.to"
        class="nav-link"
        :class="{ 'nav-link--active': route.path === link.to }"
      >
        {{ link.label }}
      </NuxtLink>
    </nav>

    <div class="app-header-right">
      <HeaderUserButton />
      <HeaderCartButton />
    </div>

    <!-- LANGUAGE SWITCHER -->
    <LanguageSwitcher class="switcher-inline" />
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
}

.header-logo-button {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.header-logo-text {
  font-weight: 600;
  font-size: 1rem;
}

.logo-link {
  color: var(--color-primary);
  text-decoration: none;
}

.brand-logo {
  height: 40px;
  width: auto;
}

.brand-identity-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-name-title {
  font-family: var(--font-headings);
  font-size: 1.4rem;
  color: var(--color-primary);
  margin: 0;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.nav-link {
  position: relative;
  margin: 0 8px;
  font-size: 0.9em;
  text-decoration: none;
  color: var(--color-text, #333);
  padding: 0.2rem 0;
  transition: color 0.15s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  border-radius: 999px;
  background: var(--color-primary, #c26a3d);
  opacity: 0;
  transform: scaleX(0.6);
  transform-origin: center;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.nav-link:hover {
  color: var(--color-primary, #c26a3d);
}

.nav-link:hover::after {
  opacity: 0.5;
  transform: scaleX(1);
}

.nav-link--active {
  color: var(--color-primary, #c26a3d);
  font-weight: 600;
}

.nav-link--active::after {
  opacity: 1;
  transform: scaleX(1);
}

.app-header-right {
  display: flex;
  align-items: center;  /* 📌 clau: els centra verticalment */
  gap: 0.5rem;          /* separació entre botó d’usuari i cistella */
}

.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: var(--color-primary);
}

/* .switcher-inline {} */

@media (max-width: 768px) {
  header {
    padding: 8px 12px;
  }

  .brand-name-title {
    display: none;
  }

  .main-nav {
    display: none;
  }
}
</style>
