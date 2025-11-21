<script setup lang="ts">
import { computed } from 'vue';

const { t } = useI18n();

// Llista de FAQ multilingüe
const faqs = computed(() => [
  {
    id: 'orders-time',
    question: t('faq.ordersTimeQuestion'),
    answer: t('faq.ordersTimeAnswer'),
  },
  {
    id: 'custom-cakes',
    question: t('faq.customCakesQuestion'),
    answer: t('faq.customCakesAnswer'),
  },
  {
    id: 'delivery-area',
    question: t('faq.deliveryAreaQuestion'),
    answer: t('faq.deliveryAreaAnswer'),
  },
  {
    id: 'allergens',
    question: t('faq.allergensQuestion'),
    answer: t('faq.allergensAnswer'),
  },
  {
    id: 'pickup-time',
    question: t('faq.pickupTimeQuestion'),
    answer: t('faq.pickupTimeAnswer'),
  },
  {
    id: 'changes-cancellations',
    question: t('faq.changesQuestion'),
    answer: t('faq.changesAnswer'),
  },
]);

// SEO bàsic
useSeoMeta({
  title: () => t('faq.metaTitle') as string,
  ogTitle: () => t('faq.metaTitle') as string,
  description: () => t('faq.metaDescription') as string,
  ogDescription: () => t('faq.metaDescription') as string,
});

// JSON-LD de tipus FAQPage
useHead(() => ({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.value.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }),
    },
  ],
}));
</script>

<template>
  <div class="page-container">
    <section class="faq-page">
      <div class="faq-inner">
        <header class="faq-header">
          <h1 class="faq-title">{{ t('faq.title') }}</h1>
          <p class="faq-subtitle">
            {{ t('faq.subtitle') }}
          </p>
        </header>

        <div class="faq-list">
          <details
            v-for="item in faqs"
            :key="item.id"
            class="faq-item"
          >
            <summary class="faq-question">
              {{ item.question }}
            </summary>
            <div class="faq-answer">
              <p>
                {{ item.answer }}
              </p>
            </div>
          </details>
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
/* PAGE WRAPPER – estil coherent amb contact/hero, mobile-first */
.faq-page {
  background: radial-gradient(
    circle at top left,
    #fdf6ea 0,
    #f9f4ec 40%,
    #f7f0e4 100%
  );
  padding: 2.25rem 1.25rem 3rem;
  color: var(--color-text, #2b2620);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
    sans-serif;
}

.faq-inner {
  max-width: 900px;
  margin: 0 auto;
}

/* HEADER */
.faq-header {
  text-align: left;
  margin-bottom: 1.75rem;
}

.faq-title {
  font-family: var(--font-headings, system-ui, sans-serif);
  font-size: 2rem;
  line-height: 1.2;
  margin: 0 0 0.35rem;
  color: var(--color-primary, #3b2a1a);
}

.faq-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted, #7a6f63);
}

/* LLISTA FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/* ITEM */
.faq-item {
  background: var(--color-surface, #ffffff);
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
  padding: 0.75rem 1rem;
}

/* SUMMARY (pregunta) */
.faq-question {
  list-style: none; /* amaga la fletxa per defecte en alguns navegadors */
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-primary, #3b2a1a);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-question::-webkit-details-marker {
  display: none;
}

/* Icona simple + animació fletxa */
.faq-question::after {
  content: '▾';
  font-size: 0.8rem;
  margin-left: 0.75rem;
  color: var(--color-text-muted, #8a7c6b);
  transition: transform 0.15s ease-out;
}

/* Contingut (resposta) */
.faq-answer {
  margin-top: 0.55rem;
  padding-top: 0.55rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.faq-answer p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-soft, #5f5248);
  line-height: 1.5;
}

/* Estat obert: girem la fletxa */
.faq-item[open] .faq-question::after {
  transform: rotate(180deg);
}

/* RESPONSIVE */
@media (min-width: 900px) {
  .faq-page {
    padding: 2.5rem 1.5rem 3.25rem;
  }

  .faq-title {
    font-size: 2.2rem;
  }
}
</style>
