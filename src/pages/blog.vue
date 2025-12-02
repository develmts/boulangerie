<script setup lang="ts">
const { locale, t } = useI18n()

// Estat global compartit per totes les llengües (ID curt del post, ex: "20250110-001")
const globalOpenPostId = useState<string | null>('blogOpenPostId', () => null)

// Carreguem les entrades del blog des de Nuxt Content
const { data: posts, pending, error } = await useAsyncData(
  `blog-${locale.value}`,
  () =>
    queryContent(`${locale.value}/blog`)
      .where({ _type: 'markdown' }) // només markdown
      .where({ _path: { $ne: `/${locale.value}/blog` } }) // excloem el blog.md vell
      .sort({ date: -1 })
      .find()
)

// Estat local de l'acordió: quina entrada està oberta (per _path complet)
const openId = ref<string | null>(null)

// Títol principal del blog
const mainTitle = computed(() =>
  t('blog.pageTitle', 'Blog')
)

// Obtenim l'ID "global" estable d'un post (últim segment del path, ex: "20250110-001")
function getGlobalId(post: any): string {
  const path = (post._path as string) || ''
  const segments = path.split('/')
  return segments[segments.length - 1] || path
}

// Quan canvien els posts (p. ex. per canvi d'idioma), intentem reobrir el que hi havia a l'estat global
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
    openId.value = match ? (match._path as string) : null
  },
  { immediate: true }
)

// Toggle de l'entrada (acordió + actualització d'estat global)
function toggleEntry(post: any) {
  const fullId = post._path as string
  const globalId = getGlobalId(post)

  if (openId.value === fullId) {
    // Si cliquem la que ja està oberta, la tanquem i netegem estat global
    openId.value = null
    globalOpenPostId.value = null
  } else {
    // Si cliquem una altra, tanquem l’anterior i obrim aquesta, guardant l'ID global
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
              :key="post._path"
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
                      {{ new Date(post.date).toLocaleDateString(locale) }}
                    </span>
                    <span v-if="post.readingTime">
                      · {{ post.readingTime }} {{ t('blog.readingMinutes', 'min') }}
                    </span>
                  </p>
                </div>

                <span
                  class="blog-entry-indicator"
                  :class="{ 'is-open': openId === post._path }"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </button>

              <transition name="blog-entry-collapse">
                <div
                  v-if="openId === post._path"
                  class="blog-entry-body"
                >
                  <ContentRenderer :value="post" />
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
  font-family: var(--font-headings);
  color: var(--color-primary);
  margin-bottom: 1.2rem;
}

/* Acordió */
.blog-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.blog-entry {
  border-radius: 0.75rem;
  background: var(--color-surface, #fff);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  overflow: hidden;
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
  font-family: var(--font-headings);
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
