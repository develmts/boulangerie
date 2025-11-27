<script setup lang="ts">
import { type Locale } from '~/services/shopify'
import { getCmsPage } from '~/services/cms';

const { locale, t } = useI18n();
const route = useRoute();

// Carreguem contingut del CMS mock
const { data: block, pending, error } = useAsyncData(
  `blog-${locale.value}`,
  () => getCmsPage('blog', locale.value as Locale )
);

// SEO
useSeoMeta({
  title: () => block.value?.title ?? 'Blog',
  description: () => t('blog.metaDescription', 'Històries, curiositats i informació del nostre obrador.'),
  ogTitle: () => block.value?.title,
  ogDescription: () => t('blog.metaDescription', 'Històries i novetats de la pastisseria.'),
});
</script>

<template>
  <div class="page-container">
    <section class="blog-page">
      <div class="blog-container">
        <!-- Loading -->
        <div v-if="pending" class="loading-block">
          <ActionFeedback 
            mode="text"
            text-variant="reveal"
            :size="128"
            :text="t('sections.loading')"
            :loop="true"
          /> 
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error-block">
          {{ t('errors.contentNotFound') }}
        </div>

        <!-- Contingut -->
        <div v-else class="blog-content">
          <h1 class="blog-title">{{ block?.title }}</h1>

          <article class="blog-body">
            <CmsRichText v-if="block" :block="block"></CmsRichText>
          </article>
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
.blog-page {
  padding: 2rem 1.2rem;
  background: var(--color-bg-soft);
  min-height: 70vh;
}

.blog-container {
  max-width: 900px;
  margin: 0 auto;
}

.blog-title {
  font-size: 2rem;
  font-family: var(--font-headings);
  color: var(--color-primary);
  margin-bottom: 1.2rem;
}

.blog-body :deep(p) {
  margin: 0 0 1rem;
  line-height: 1.6;
}

.blog-body :deep(h2) {
  margin: 1.6rem 0 0.8rem;
  font-size: 1.4rem;
  color: var(--color-primary-strong);
}

.blog-body :deep(h3) {
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
