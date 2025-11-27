<!-- src/pages/cookies.vue -->
<script setup lang="ts">
import { type Locale } from '~/services/shopify'
import { type CmsPage , getCmsPage} from '~/services/cms/'

definePageMeta({
  layout: 'default',
})

const { t, locale } = useI18n()

const loading = ref(true)
const content = ref<CmsPage | null>(null)

const slug = 'cookies'

async function loadData(currentLocale: Locale) {
  loading.value = true
  try {
    const block = await getCmsPage(slug, currentLocale)
    // console.log("got content for",slug, locale.value, block?.nuxtContentDoc)
    content.value = block
  } catch (err) {
    console.error('Error carregant Política de cookies:', err)
    content.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData(locale.value as Locale)
})

watch(locale, newLocale => {
  loadData(newLocale as Locale)
})
</script>

<template>
  <div class="maqueta-container legal-page">
    <div v-if="loading" class="loading-message">
      <!-- {{ t('sections.loading') }} -->
      <ActionFeedback 
        mode="text"
        text-variant="reveal"
        :size="128"
        :text="t('sections.loading')"
        :loop="true"
      />         
    </div>

    <div v-else>
      <section v-if="content" class="legal-section">
        <div class="blog-content">
          <h1 class="blog-title">{{ content?.title }}</h1>

          <article class="blog-body">
            <CmsRichText v-if="content" :block="content"></CmsRichText>
          </article>
        </div>
      </section>

      <section v-else class="legal-section">
        <h1 class="legal-title">
          {{ t('legal.cookies_fallback_title', 'Política de cookies') }}
        </h1>
        <p class="legal-body">
          {{ t('legal.cookies_fallback_body', 'El contingut de la política de cookies no està disponible en aquests moments.') }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.legal-page {
  padding: 40px 0;
}

.legal-section {
  max-width: 900px;
  margin: 0 auto;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  padding: 24px 20px;
}

.legal-title {
  font-size: 1.6rem;
  margin-bottom: 16px;
  color: var(--color-primary);
}

.legal-body :deep(p) {
  margin-bottom: 12px;
  line-height: 1.6;
}

.legal-body :deep(h2),
.legal-body :deep(h3) {
  margin-top: 20px;
  margin-bottom: 8px;
}

.legal-body :deep(ul),
.legal-body :deep(ol) {
  margin-left: 1.2rem;
  margin-bottom: 12px;
}
</style>
