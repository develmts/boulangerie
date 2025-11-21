<script setup lang="ts">
import { type Locale } from '~/services/shopify'
import { getContentBySlug } from '~/services/contentful';

const { locale, t } = useI18n();

// Carreguem el bloc "about-page" del CMS mock
const { data: block, pending, error } = useAsyncData(
  `about-page-${locale.value}`,
  () => getContentBySlug('about-page', locale.value as Locale)
);

// SEO
useSeoMeta({
  title: () => block.value?.title ?? 'About',
  description: () => t('about.metaDescription'),
  ogTitle: () => block.value?.title,
  ogDescription: () => t('about.metaDescription'),
});


</script>

<template>
  <div class="page-container">
    <section class="about-page">
      <div class="about-container">

        <!-- Loading -->
        <div v-if="pending" class="loading-block">
          {{ t('loading', 'Carregant…') }}
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-block">
          {{ t('errors.contentNotFound', 'No s’ha pogut carregar el contingut.') }}
        </div>

        <!-- Contingut -->
        <div v-else class="about-content">
          <h1 class="about-title">{{ block?.title }}</h1>

          <article
            class="about-body"
            v-html="block?.body"
          />
        </div>

      </div>
    </section>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 20px;
}
.about-page {
  padding: 2rem 1.2rem;
  background: var(--color-bg-soft);
  min-height: 70vh;
}

.about-container {
  max-width: 900px;
  margin: 0 auto;
}

.about-title {
  font-size: 2rem;
  font-family: var(--font-headings);
  color: var(--color-primary);
  margin-bottom: 1.2rem;
}

.about-body :deep(p) {
  margin: 0 0 1rem;
  line-height: 1.6;
}

.about-body :deep(h2) {
  margin: 1.6rem 0 0.8rem;
  font-size: 1.4rem;
  color: var(--color-primary-strong);
}

.about-body :deep(h3) {
  margin: 1.3rem 0 0.5rem;
  font-size: 1.15rem;
  color: var(--color-primary);
}

.loading-block,
.error-block {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
