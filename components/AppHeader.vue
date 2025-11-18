<!-- components/AppHeader.vue (Fragment Modificat) -->
<script setup lang="ts">
import LanguageSwitcher from './LanguageSwitcher.vue';
const { t, locale } = useI18n(); 
const localePath = useLocalePath(); 
</script>

<template>
  <header>
    <!-- 1. BOTÓ/ICON SIDEBAR (Placeholder per al N5) -->
    <button class="menu-button">☰</button>

    <!-- 2. LOGO/TÍTOL (Al centre o a l'esquerra) -->
    <div class="brand-identity-group">
        <!-- 2.1 LOGO (ÚNIC ENLLAÇ A INICI) -->
        <NuxtLink :to="localePath('/')" class="logo-link">
            <img src="/assets/images/logo.png" alt="Piella Logo" class="brand-logo" />
        </NuxtLink>
        
        <!-- 2.2 NOM DE LA MARCA (ESTÀTIC - SENSE ENLLAÇ) -->
        <h1 class="brand-name-title">
            {{ t('header.title') }}
        </h1>
    </div>
    
    <!-- 3. NAVEGACIÓ (La farem amagable per a la fase Mobile-First) -->
    <nav class="main-nav">
      <!-- <NuxtLink :to="localePath('/')">{{ t('nav.home') }}</NuxtLink>  -->
      <NuxtLink :to="localePath('/shop')">{{ t('nav.shop') }}</NuxtLink> 
      <NuxtLink :to="localePath('/contact')">{{ t('nav.contact') }}</NuxtLink> 
    </nav>
    
    <!-- 4. LANGUAGE SWITCHER (Posicionat a la dreta) -->
    <LanguageSwitcher class="switcher-inline" /> 
  </header>
</template>

<style scoped>
header {
  /* LAYOUT ESSENCIAL: MINIM ESPAI VERTICAL */
  position: sticky; 
  top: 0; 
  z-index: 100; 
  background-color: var(--color-surface); 
  box-shadow: 0 1px 5px rgba(0,0,0,0.08); 
  padding: 10px 20px; /* Reduïm el padding vertical */

  /* LAYOUT HORITZONTAL FLEXBOX */
  display: flex;
  justify-content: space-between; /* Distribueix espai */
  align-items: center; 
}


.header-title {
    font-size: 1.4rem; /* Reduïm la mida */
    margin: 0;
    line-height: 1; /* Eliminem espai extra de línia */
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
    /* Text estàtic (el títol) */
    font-family: var(--font-headings);
    font-size: 1.4rem;
    color: var(--color-primary);
    margin: 0; /* Important per mantenir la verticalitat */
}


/* NAVEGACIÓ (Només visible en Desktop, amagarem per Mobile en el N7) */
.main-nav a {
    margin: 0 10px;
    font-size: 0.9em;
}

/* BOTÓ DE MENÚ LATERAL (Serà invisible en Desktop, visible en Mobile - N7) */
.menu-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    color: var(--color-primary);
    /* De moment, el deixem visible per veure'l, però s'amagarà en desktop */
}

/* SWITCHER (Inline per defecte) */
.switcher-inline {
    /* El flexbox del header ja s'encarrega de posicionar-lo */
}
</style>