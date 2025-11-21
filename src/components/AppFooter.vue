<!-- components/AppFooter.vue -->
<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
      <p class="footer-copy">
        &copy; {{ new Date().getFullYear() }}
        {{ t('header.title') }}.
        {{ t('footer.copyright') }}.
      </p>

      <!-- Enllaços legals: només mòbil (es control·la per CSS) -->
      <nav class="footer-links">
        <NuxtLink :to="localePath('/legal')">
          {{ t('nav.legal', 'Avís legal') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/privacy')">
          {{ t('nav.privacy', 'Privacitat') }}
        </NuxtLink>
        <NuxtLink :to="localePath('/cookies')">
          {{ t('nav.cookies', 'Cookies') }}
        </NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--color-text);      /* Fons fosc */
  color: var(--color-background);           /* Lletra clara */
  padding: 15px 0;

  margin-top: auto;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  font-size: 0.85em;
}

.footer-copy {
  margin: 0;
}
/* footer legal Links */
.footer-links {
  margin-top: 8px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

.footer-links a {
  color: var(--color-background);
  text-decoration: none;
  opacity: 0.85;
  font-size: 0.8em;
}

.footer-links a:hover {
  text-decoration: underline;
  opacity: 1;
}




/* MÒBIL: mostrem links legals i fem la barra una mica més compacta */
@media (max-width: 768px) {
  .app-footer {
    padding: 8px 12px;
    background-color: rgba(20, 20, 20, 0.96);
    backdrop-filter: blur(6px);
  }

  .footer-container {
    padding: 0 10px;
  }

  /* Per defecte, els enllaços legals s’amaguen en desktop . JA NO APLIQUEN */  
  .footer-links-mobile {
  display: none;
}


  .footer-links-mobile {
    margin-top: 4px;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    font-size: 0.75em;
  }

  .footer-links-mobile a {
    color: var(--color-background);
    text-decoration: none;
    opacity: 0.9;
  }

  .footer-links-mobile a:hover {
    text-decoration: underline;
    opacity: 1;
  }
}

/* Reservem espai perquè el footer fixed no tapi el contingut */
:global(body) {
  /* ajusta l’alçada si canvies padding del footer */
  padding-bottom: 56px;
}

@media (max-width: 768px) {
  :global(body) {
    padding-bottom: 64px;
  }
}
</style>
