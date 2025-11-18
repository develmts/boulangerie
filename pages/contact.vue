<!-- pages/contact.vue -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
</script>

<template>
  <div class="page-container">
    <h1>{{ t('nav.contact') }}</h1>
    <p>Utilizaremos esta página para el formulario de contacto con un servicio SaaS de backend (como SendGrid/Formspree) para garantizar la entrega de correos electrónicos.</p>
    
    <div class="contact-info">
      <h2>Información de la Panadería</h2>
      <p>Dirección: Calle Falsa 123, 08001 Barcelona</p>
      <p>Teléfono: +34 93 XXX XX XX</p>
      <p>Email: info@panaderia.com</p>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
}
h1 {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 10px;
}
.contact-info {
    margin-top: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}
</style>