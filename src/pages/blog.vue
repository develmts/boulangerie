<script setup lang="ts">
import { getCmsPage, listCmsEntries } from '~/services/cms'
import type { CmsPage, CmsListItem } from '~/services/cms'
import type { Locale } from '~/services/shopify'

const { locale, t } = useI18n()

// Tipus curt per als items de blog retornats per listCmsEntries
type BlogItem = CmsListItem & {
  readingTime?: number
}

// ✅ Carreguem la pàgina CMS "blog" igual que l'about (títol, intro, etc.)
const { data: cmsPage } = await useAsyncData<CmsPage | null>(
  () => `cms-page-blog-${locale.value}`,
  () => getCmsPage('blog', locale.value as Locale)
)

// Estat global compartit per totes les llengües (ID curt del post, ex: "20250110-001")
const globalOpenPostId = useState<string | null>(
  'blogOpenPostId',
  () => null
)

// ✅ Carreguem les entrades del blog a través de l’API CMS unificada
const { data: posts, pending, error } = await useAsyncData<BlogItem[]>(
  () => `blog-${locale.value}`,
  () =>
    listCmsEntries({
      collection: 'blog',
      locale: locale.value as Locale,
      sort: { field: 'date', direction: 'desc' },
      limit: null,
      offset: null,
      filters: null
    })
)

// Estat local de l'acordió: quina entrada està oberta (per `id` de l’item)
const openId = ref<string | null>(null)

// Títol principal del blog: primer el title del CMS, si no hi és, fallback de i18n
const mainTitle = computed(() =>
  cmsPage.value?.title ?? t('blog.pageTitle', 'Blog')
)

// Helper per formatar dates de forma robusta
function formatPostDate(date: BlogItem['date'], localeCode: string): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) {
    return ''
  }

  return d.toLocaleDateString(localeCode)
}

// ID "global" estable d'un post (últim segment del path, ex: "20250110-001")
function getGlobalId(post: BlogItem): string | null {
  const path = post.path || ''
  const segments = path.split('/').filter(Boolean)

  if (segments.length > 0) {
    return segments[segments.length - 1] || null
  }

  return post.slug || path || post.id
}

// Quan canvien els posts (p. ex. canvi d'idioma), intentem reobrir el que hi havia obert
watch(
  () => posts.value,
  (list) => {
    if (!list || !list.length) {
      openId.value = null
      return
    }

    const currentGlobalId = globalOpenPostId.value
    if (!currentGlobalId) {
      openId.value = null
      return
    }

    const match = list.find(post => getGlobalId(post) === currentGlobalId)
    openId.value = match ? match.id : null
  },
  { immediate: true }
)

// Toggle de l'entrada (acordió + estat global)
function toggleEntry(post: BlogItem) {
  const fullId = post.id
  const globalId = getGlobalId(post)

  if (!fullId) {
    return
  }

  if (openId.value === fullId) {
    // Tanquem i netegem estat global
    openId.value = null
    globalOpenPostId.value = null
  } else {
    // Obrim aquesta i guardem l'ID global per reobrir-la en altres locales
    openId.value = fullId
    globalOpenPostId.value = globalId
  }
}
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
          <h1 class="blog-title">
            {{ mainTitle }}
          </h1>

          <div v-if="posts?.length" class="blog-accordion">
            <article
              v-for="post in posts"
              :key="post.id"
              class="blog-entry"
            >
              <button
                type="button"
                class="blog-entry-header"
                @click="toggleEntry(post)"
              >
                <div class="blog-entry-header-text">
                  <h2 class="blog-entry-title">
                    {{ post.title }}
                  </h2>
                  <p v-if="post.excerpt" class="blog-entry-excerpt">
                    {{ post.excerpt }}
                  </p>
                  <p class="blog-entry-meta">
                    <span v-if="post.date">
                      {{ formatPostDate(post.date, locale) }}
                    </span>
                    <span v-if="post.readingTime">
                      · {{ post.readingTime }} {{ t('blog.readingMinutes', 'min') }}
                    </span>
                  </p>
                </div>

                <span
                  class="blog-entry-indicator"
                  :class="{ 'is-open': openId === post.id }"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              <transition name="blog-entry-collapse">
                <div
                  v-if="openId === post.id"
                  class="blog-entry-body"
                >
                  <ContentRenderer :value="post.doc ?? post" />
                </div>
              </transition>
            </article>
          </div>

          <p v-else class="blog-empty">
            {{ t('blog.empty', 'Encara no hi ha entrades al blog.') }}
          </p>
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
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-bottom: 1.2rem;
}

/* Acordió */
.blog-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  /* ens assegurem que els elements ocupen tota l'amplada disponible per defecte */
  align-items: stretch;
}

.blog-entry {
  border-radius: 0.75rem;
  background: var(--color-surface, #fff);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;

  /* 🔹 Amplada controlada per viewport */
  width: 100%;
  box-sizing: border-box;
}

/* 🔹 Desktop: amplada fixa dels "cards" i centrats */
@media (min-width: 1024px) {
  .blog-accordion {
    align-items: center; /* centra els cards dins del contenidor */
  }

  .blog-entry {
    width: 810px; /* ajusta aquest valor si vols més o menys ample */
    max-width: 810px;
  }
}

.blog-entry-header {
  width: 100%;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.blog-entry-header:hover {
  background: rgba(0, 0, 0, 0.02);
}

.blog-entry-header-text {
  flex: 1;
}

.blog-entry-title {
  font-size: 1.2rem;
  margin: 0 0 0.25rem;
  font-family: var(--font-heading);
  color: var(--color-primary-strong, var(--color-primary));
}

.blog-entry-excerpt {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.blog-entry-meta {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.blog-entry-indicator {
  font-size: 0.9rem;
  transform: rotate(-90deg);
  transition: transform 0.15s ease;
  margin-top: 0.2rem;
}

.blog-entry-indicator.is-open {
  transform: rotate(0deg);
}

/* Cos de l'entrada */
.blog-entry-body {
  padding: 0 1.1rem 1.1rem;
}

.blog-entry-body :deep(p) {
  margin: 0 0 1rem;
  line-height: 1.6;
}

.blog-entry-body :deep(h2) {
  margin: 1.6rem 0 0.8rem;
  font-size: 1.4rem;
  color: var(--color-primary-strong);
}

.blog-entry-body :deep(h3) {
  margin: 1.3rem 0 0.5rem;
  font-size: 1.15rem;
  color: var(--color-primary);
}

.blog-empty {
  margin-top: 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

/* Transició de l'acordió */
.blog-entry-collapse-enter-active,
.blog-entry-collapse-leave-active {
  transition: max-height 0.2s ease, opacity 0.2s ease, padding-top 0.2s ease;
}
.blog-entry-collapse-enter-from,
.blog-entry-collapse-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
}

.loading-block,
.error-block {
  padding: 1rem;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
