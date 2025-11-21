<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  imageSrc: string;
  imageAlt?: string;
}>();


   
</script>

<template>
  <section class="hero">
    <div class="hero-inner">
      <!-- Bloc de text -->
      <div class="hero-content">
        <p class="hero-kicker">
          <!-- Aquí pots posar algo curt tipus “Pastisseria Artesanal” si vols via slot futur -->
        </p>

        <h1 class="hero-title">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="hero-subtitle">
          {{ subtitle }}
        </p>

        <div class="hero-actions">
          <NuxtLink
            v-if="primaryLabel && primaryTo"
            :to="primaryTo"
            class="hero-btn hero-btn--primary"
          >
            {{ primaryLabel }}
          </NuxtLink>

          <NuxtLink
            v-if="secondaryLabel && secondaryTo"
            :to="secondaryTo"
            class="hero-btn hero-btn--secondary"
          >
            {{ secondaryLabel }}
          </NuxtLink>
        </div>
      </div>

      <!-- Bloc d’imatge -->
      <div class="hero-media">
        <div class="hero-image-wrapper">
          <img
            :src="imageSrc"
            :alt="imageAlt || title"
            class="hero-image"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* MOBILE FIRST */
.hero {
  /* Pots lligar-ho al sistema de temes global si vols */
  background: linear-gradient(
    135deg,
    #fdf6ea 0%,
    #f9f2e6 40%,
    #f7eee2 100%
  );
  padding: 1.75rem 1.25rem 2.5rem;
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;         /* MOBILE: columna */
  gap: 1.5rem;
}

/* TEXT */
.hero-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-kicker {
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted, #8a7c6b);
  margin: 0;
}

.hero-title {
  font-family: var(--font-headings, system-ui, sans-serif);
  font-size: 2.1rem;
  line-height: 1.15;
  margin: 0;
  color: var(--color-primary, #3b2a1a);
}

.hero-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  max-width: 32rem;
  color: var(--color-text-soft, #6c5a4a);
}

.hero-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

/* BOTONS */
.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.08s ease-out, box-shadow 0.08s ease-out,
    background-color 0.12s ease-out, color 0.12s ease-out;
}

.hero-btn--primary {
  background: var(--color-accent, #c26a3d);
  color: #ffffff;
  border-color: var(--color-accent, #c26a3d);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.hero-btn--primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
}

.hero-btn--secondary {
  background: transparent;
  color: var(--color-accent, #c26a3d);
  border-color: rgba(0, 0, 0, 0.08);
}

.hero-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.7);
}

/* IMATGE */
/* .hero-media { */
  /* A mobile va sota, amb amplada 100% */
/* } */

.hero-image-wrapper {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.18);
  background: #00000010;
}

.hero-image {
  display: block;
  width: 100%;
  height: 230px;
  object-fit: cover;
}

/* DESKTOP / TABLET GRAN: layout 2 columnes */
@media (min-width: 900px) {
  .hero {
    padding: 2.5rem 1.5rem 3rem;
  }

  .hero-inner {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

  .hero-content {
    flex: 1.1;
  }

  .hero-media {
    flex: 1;
  }

  .hero-title {
    font-size: 2.6rem;
  }

  .hero-image {
    height: 320px;
  }
}

/* PANTALLES MÉS GRANS */
@media (min-width: 1200px) {
  .hero-title {
    font-size: 2.9rem;
  }

  .hero-image {
    height: 360px;
  }
}
</style>
