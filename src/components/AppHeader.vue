<script setup lang="ts">
import LanguageSwitcher from './LanguageSwitcher.vue';
import { createNavLinks } from '~/config/navLinks';

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const { t } = useI18n(); 
const localePath = useLocalePath(); 
const route = useRoute();

const links = computed(() => createNavLinks(t, localePath));

function handleLogoClick() {
  emit('toggle-sidebar')
}

</script>

<template>
  <header>
    <!-- LOGO + TÍTOL -->
    <!-- 
    <div class="brand-identity-group">
      <NuxtLink :to="localePath('/')" class="logo-link">
        <img src="/assets/images/logo.png" alt="Piella Logo" class="brand-logo" />
      </NuxtLink>
      
      <h1 class="brand-name-title">
        {{ t('header.title') }}
      </h1>
    </div>
    -->
    <!-- El logo deixa de ser "Home" i passa a ser tirador -->
    <button class="header-logo-button" type="button" @click="handleLogoClick">
      <!-- aquí pots tenir logo, nom, etc. -->
      <img src="/assets/images/logo.png" alt="Piella Logo" class="brand-logo" /> 
      <!-- <span class="header-logo-text">
        {{ t('header.title') }}
      </span> -->
    </button>
    <h1 class="brand-name-title">
        {{ t('header.title') }}
     </h1>


    <!-- NAVEGACIÓ (desktop) -->
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
    
    <!-- LANGUAGE SWITCHER -->
    <LanguageSwitcher class="switcher-inline" /> 
  </header>
</template>

<style scoped>
/* header {
  position: sticky; 
  top: 0; 
  z-index: 100; 
  background-color: var(--color-surface); 
  box-shadow: 0 1px 5px rgba(0,0,0,0.08); 
  padding: 10px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center; 
} */

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

/* ----------------------------------------------------- */
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

/* NAVEGACIÓ (Desktop) */
.main-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Base link */
.nav-link {
  position: relative;
  margin: 0 8px;
  font-size: 0.9em;
  text-decoration: none;
  color: var(--color-text, #333);
  padding: 0.2rem 0;
  transition: color 0.15s ease;
}

/* Subratllat suau en hover/active */
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

/* Hover highlight */
.nav-link:hover {
  color: var(--color-primary, #c26a3d);
}

.nav-link:hover::after {
  opacity: 0.5;
  transform: scaleX(1);
}

/* Active highlight */
.nav-link--active {
  color: var(--color-primary, #c26a3d);
  font-weight: 600;
}

.nav-link--active::after {
  opacity: 1;
  transform: scaleX(1);
}

/* BOTÓ DE MENÚ LATERAL (placeholder si mai el recuperes) */
.menu-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: var(--color-primary);
}

/* SWITCHER (Inline per defecte) */
.switcher-inline {
  /* El flexbox del header ja s'encarrega de posicionar-lo */
}

/* 📱 VISTA MÒBIL: només LOGO + LANGUAGE SWITCHER */
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
