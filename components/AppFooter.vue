<!-- components/AppFooter.vue -->
<script setup lang="ts">
// No necessita lògica. És un component de presentació.
  const { t, locale } = useI18n(); 
  const localePath = useLocalePath(); 
</script>

<template>
  <footer class="app-footer">
    <div class="footer-container">
        <!-- <p>&copy; {{ new Date().getFullYear() }} {{ t('title') }} Fleca Artesana. Tots els drets reservats.</p> -->
        <p>&copy; {{ new Date().getFullYear() }} {{ t('header.title') }}. {{ t('footer.copyright') }}.</p>        
        <!-- <p>{{ new Date().toDateString() }}</p> -->
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
    /* Ús de variables normalitzades */
    background-color: var(--color-text-main); /* Fons Fosc */
    color: var(--color-background); /* Lletra Clara */
    padding: 15px 0;
    margin-top: auto; /* CRUCIAL per al sticky footer amb Flexbox */
}
.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    text-align: center;
    font-size: 0.85em;
}
</style>