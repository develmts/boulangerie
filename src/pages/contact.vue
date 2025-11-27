<script setup lang="ts">
const config = useRuntimeConfig();
const { t } = useI18n();

import { reactive, ref } from 'vue'
import {
  validateContactForm,
  type ContactFormData,
  type ContactValidationErrors,
} from '~/utils/contactValidation'

useSeoMeta({
  title: () => t('contact.metaTitle') as string,
  ogTitle: () => t('contact.metaTitle') as string,
  description: () => t('contact.metaDescription') as string,
  ogDescription: () => t('contact.metaDescription') as string,
});



/* ---------------------------------------------
   SEO + JSON-LD
--------------------------------------------- */
// definePageMeta(() => ({
//   title: t('contact.metaTitle'),
//   meta: [
//     { name: 'description', content: t('contact.metaDescription') },
//     { property: 'og:title', content: t('contact.metaTitle') },
//     { property: 'og:description', content: t('contact.metaDescription') }
//   ],
//   script: [
//     {
//       type: 'application/ld+json',
//       children: JSON.stringify({
//         "@context": "https://schema.org",
//         "@type": "ContactPage",
//         "name": t('contact.metaTitle'),
//         "description": t('contact.metaDescription'),
//         "url": "https://pastisseriapiella.cat/contact",
//         "about": {
//           "@type": "Bakery",
//           "name": "Pastisseria Piella",
//           "address": {
//             "@type": "PostalAddress",
//             "streetAddress": config.public.contactAddress || "",
//             "addressLocality": config.public.contactCity || "",
//             "addressCountry": "ES"
//           },
//           "telephone": config.public.contactPhone || "",
//           "sameAs": [
//             config.public.socialInstagram || null,
//             config.public.socialFacebook || null,
//             config.public.socialTiktok || null
//           ].filter(Boolean)
//         }
//       })
//     }
//   ]
// }));
useHead(() => {
  const title = t('contact.metaTitle') as string;
  const description = t('contact.metaDescription') as string;

  return {
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": title,
          "description": description,
          "url": "https://pastisseriapiella.cat/contact", // ajusta domini quan toqui
          "about": {
            "@type": "Bakery",
            "name": "Pastisseria Piella",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": config.public.contactAddress || "",
              "addressLocality": config.public.contactCity || "",
              "addressCountry": "ES"
            },
            "telephone": config.public.contactPhone || "",
            "sameAs": [
              config.public.socialInstagram || null,
              config.public.socialFacebook || null,
              config.public.socialTiktok || null,
            ].filter(Boolean),
          }
        }),
      },
    ],
  };
});




/* ---------------------------------------------
   DADES DEL CONTACTE DES DE .env
--------------------------------------------- */
const contact = computed(() => ({
  address: config.public.contactAddress as string | undefined,
  city: config.public.contactCity as string | undefined,
  phone: config.public.contactPhone as string | undefined,
  email: config.public.contactEmail as string | undefined,
  hours: config.public.contactHours as string | undefined,
  instagram: config.public.socialInstagram as string | undefined,
  facebook: config.public.socialFacebook as string | undefined,
  tiktok: config.public.socialTiktok as string | undefined,
}));

/* ---------------------------------------------
   FORMULARI (dummy)
--------------------------------------------- */
const name = ref('');
const email = ref('');
const message = ref('');
const isSubmitting = ref(false);
const submitted = ref(false);


const handleSubmit = async () => {
  isSubmitting.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  submitted.value = true;
  isSubmitting.value = false;

  name.value = '';
  email.value = '';
  message.value = '';
};
</script>

<template>
  <section class="contact-page">
    <div class="contact-inner">
      
      <!-- HEADER -->
      <header class="contact-header">
        <h1 class="contact-title">{{ t('contact.title') }}</h1>
        <p class="contact-subtitle">{{ t('contact.subtitle') }}</p>
      </header>

      <!-- GRID PRINCIPAL -->
      <div class="contact-grid">
        
        <!-- COL·UMNA ESQUERRA -->
        <div class="contact-column contact-column--info">

          <div class="contact-card">
            <h2 class="card-title">{{ t('contact.infoTitle') }}</h2>

            <ul class="info-list">
              <!-- ADREÇA -->
              <li v-if="contact.address || contact.city">
                <span class="info-label">{{ t('contact.addressLabel') }}</span>
                <span class="info-value">
                  {{ contact.address }}<br v-if="contact.city" />
                  {{ contact.city }}
                </span>
              </li>

              <!-- TELÈFON -->
              <li v-if="contact.phone">
                <span class="info-label">{{ t('contact.phoneLabel') }}</span>
                <a
                  class="info-value"
                  :href="`tel:${contact.phone}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ contact.phone }}
                </a>
              </li>

              <!-- EMAIL -->
              <li v-if="contact.email">
                <span class="info-label">{{ t('contact.emailLabel') }}</span>
                <a
                  class="info-value"
                  :href="`mailto:${contact.email}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ contact.email }}
                </a>
              </li>

              <!-- HORARI -->
              <li v-if="contact.hours">
                <span class="info-label">{{ t('contact.hoursLabel') }}</span>
                <span class="info-value">{{ contact.hours }}</span>
              </li>
            </ul>
          </div>

          <!-- XARXES SOCIALS -->
          <div class="contact-card contact-card--social">
            <h2 class="card-title">{{ t('contact.socialTitle') }}</h2>

            <div class="social-row">
              
              <!-- INSTAGRAM -->
              <a
                v-if="contact.instagram"
                class="social-pill social-pill--instagram"
                :href="contact.instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/icons/social/instagram.svg" class="social-icon-img" alt="Instagram" />
                <span class="social-text">Instagram</span>
              </a>

              <!-- FACEBOOK -->
              <a
                v-if="contact.facebook"
                class="social-pill social-pill--facebook"
                :href="contact.facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/icons/social/facebook.svg" class="social-icon-img" alt="Facebook" />
                <span class="social-text">Facebook</span>
              </a>

              <!-- TIKTOK -->
              <a
                v-if="contact.tiktok"
                class="social-pill social-pill--tiktok"
                :href="contact.tiktok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/assets/icons/social/tiktok.svg" class="social-icon-img" alt="TikTok" />
                <span class="social-text">TikTok</span>
              </a>

            </div>
          </div>
        </div>

        <!-- COL·UMNA DRETA (FORMULARI) -->

        <div class="contact-column contact-column--form">
          <div class="contact-card contact-card--form">
            <h2 class="card-title">{{ t('contact.formTitle') }}</h2>
            <!--             
            <form class="contact-form" @submit.prevent="handleSubmit">
              
              <div class="form-row">
                <label class="form-label" for="name">{{ t('contact.formName') }}</label>
                <input id="name" v-model="name" type="text" required class="form-input" />
              </div>

              <div class="form-row">
                <label class="form-label" for="email">{{ t('contact.formEmail') }}</label>
                <input id="email" v-model="email" type="email" required class="form-input" />
              </div>

              <div class="form-row">
                <label class="form-label" for="message">{{ t('contact.formMessage') }}</label>
                <textarea id="message" v-model="message" rows="4" required class="form-textarea" />
              </div>

              <div class="form-actions">
                <button type="submit" class="form-submit" :disabled="isSubmitting">
                  <span v-if="!isSubmitting">{{ t('contact.formSubmit') }}</span>
                  <span v-else>...</span>
                </button>

                <p v-if="submitted" class="form-feedback">
                  {{ t('contact.formFeedback') }}
                </p>
              </div>

            </form> -->
            <ContactForm />
          </div>
        </div> 

      </div>
    </div>
  </section>
</template>

<style scoped>
/* =====================================================
   CONTACT PAGE
===================================================== */
.contact-page {
  --contact-bg: #f9f4ec;
  --contact-card-bg: #ffffff;
  --contact-border-subtle: #e5ddd0;
  --contact-accent: #c26a3d;
  --contact-accent-soft: rgba(194, 106, 61, 0.08);
  --contact-text-main: #2b2620;
  --contact-text-muted: #7a6f63;
  --contact-radius-lg: 16px;
  --contact-radius-pill: 999px;
  --contact-shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.06);

  background: radial-gradient(circle at top left, #fdf6ea 0, #f9f4ec 40%, #f7f0e4 100%);
  padding: 2.5rem 1.25rem 3rem;
  color: var(--contact-text-main);
  font-family: system-ui, sans-serif;
}

.contact-inner {
  max-width: 1100px;
  margin: 0 auto;
}

/* HEADER */
.contact-header {
  text-align: left;
  margin-bottom: 2rem;
}

.contact-title {
  font-size: 2rem;
  margin: 0 0 0.5rem;
}

.contact-subtitle {
  color: var(--contact-text-muted);
}

/* GRID */
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

/* A partir de 900px → dues columnes (info + formulari) */
@media (min-width: 900px) {
  .contact-grid {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1.3fr);
  }
}


/* COLUMNS */
.contact-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* CARDS */
.contact-card {
  background: var(--contact-card-bg);
  border-radius: var(--contact-radius-lg);
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--contact-border-subtle);
  box-shadow: var(--contact-shadow-soft);
}

.contact-card--form {
  height: 100%;
}

.card-title {
  margin: 0 0 1rem;
  font-weight: 600;
}

/* INFO LIST */
.info-list {
  display: grid;
  gap: 0.75rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.info-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--contact-text-muted);
}

.info-value {
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--contact-text-main);
  padding: 0.6rem 0.75rem;
}

.info-value:hover {
  text-decoration: underline;
}

/* SOCIAL BUTTONS */
.contact-card--social {
  background: var(--contact-accent-soft);
  border: none;
}

.social-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.social-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: var(--contact-radius-pill);
  text-decoration: none;
  font-weight: 600;
  color:-var(--color-button);
}

/* Colors per servei */
.social-pill--instagram {
  /* background: radial-gradient(circle at 30% 30%, #fdf497 0, #fd5949 45%, #d6249f 70%, #285aeb 100%); */
  background: transparent

}

.social-pill--facebook {
  background: transparent;
}

.social-pill--tiktok {
  background: transparent;
}

/* Icones */
.social-icon-img {
  width: 1rem;
  height: 1rem;
}

.social-text {
  font-size: 0.8rem;
}

/* FORM */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-inline: 0.5rem;
}

/* Per defecte (mòbil): label a sobre, camp a sota */
.form-row {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--contact-text-muted);
}

.form-input,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid var(--contact-border-subtle);
  padding: 0.6rem 0.75rem;
  font-size: 0.9rem;
  font-family: var(--contact-font-body, system-ui, sans-serif);
  outline: none;
  background: #fffdf8;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--contact-accent);
  box-shadow: 0 0 0 1px rgba(194, 106, 61, 0.15);
}

.form-textarea {
  resize: none;
}


.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.form-submit {
  border-radius: var(--contact-radius-pill);
  background: var(--contact-accent);
  color: white;
  padding: 0.5rem 1.3rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.form-submit:disabled {
  opacity: 0.7;
}

.form-feedback {
  font-size: 0.8rem;
  color: var(--contact-text-muted);
}

/* RESPONSIVE */
/* Desktop / pantalles mitjanes: label a l'esquerra, camp a la dreta */
@media (min-width: 768px) {
  .form-row {
    display: grid;
    grid-template-columns: 160px minmax(0, 1fr);
    column-gap: 1rem;
    align-items: flex-start;
  }

  .form-label {
    margin-top: 0.3rem; /* alineació superior amb el camp */
    text-align: left;
  }
}

</style>
