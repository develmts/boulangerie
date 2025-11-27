<!-- components/HeaderUserButton.vue -->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthUI } from '~/composables/useAuthUI'

const { t } = useI18n()

// Orquestra auth + overlay + customer
const {
  openDefault,
  hydrate,
  isLoggedIn,
  customer,
} = useAuthUI()

const props = defineProps<{
  to?: string
  showBadge?: boolean
  badgeValue?: number | string | null
}>()

const hasBadge = computed(() => {
  if (props.showBadge === false) return false
  if (props.badgeValue === null || props.badgeValue === undefined) return false
  return true
})

// --------------------------------------------------------
// Helpers per nom / email
// --------------------------------------------------------
const emailDomain = computed(() => {
  const email = customer.value?.email
  if (!email) return null
  const parts = email.split('@')
  if (parts.length !== 2) return null
  return parts[1].toLowerCase()
})

const genericEmailDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'yopmail.com',
]

const isCorporateEmail = computed(() => {
  const domain = emailDomain.value
  if (!domain) return false
  return !genericEmailDomains.includes(domain)
})

const avatarInitials = computed(() => {
  if (!isLoggedIn.value) return '•'

  if (customer.value?.firstName && customer.value.firstName.length > 0) {
    return customer.value.firstName[0]!.toUpperCase()
  }

  if (customer.value?.lastName && customer.value.lastName.length > 0) {
    return customer.value.lastName[0]!.toUpperCase()
  }

  if (customer.value?.email && customer.value.email.length > 0) {
    return customer.value.email[0]!.toUpperCase()
  }

  return '?'
})

// Nom “bonic” per mostrar al botó
const displayName = computed(() => {
  if (!isLoggedIn.value) return t('nav.login')

  const first = customer.value?.firstName?.trim() || ''
  const last = customer.value?.lastName?.trim() || ''
  const email = customer.value?.email || ''

  // Cas ideal: nom + cognom → "Nom C."
  if (first && last) {
    const initial = last[0]!.toUpperCase()
    return `${first} ${initial}.`
  }

  // Nom sense cognom
  if (first) return first

  // Nom buid, però cognom present → cognom
  if (last) return last

  // Sense nom: fem servir part de l'email abans de l'@
  if (email) {
    const prefix = email.split('@')[0] || email
    return prefix.length > 14 ? prefix.slice(0, 14) + '…' : prefix
  }

  // Fallback final
  return t('nav.account')
})

// Clau per animar el canvi de label
const labelKey = computed(() => {
  return isLoggedIn.value ? `user-${displayName.value}` : 'guest-login'
})

function handleClick() {
  openDefault()
}

onMounted(() => {
  hydrate()
})
</script>

<template>
  <button
    type="button"
    class="icon-button"
    :aria-label="isLoggedIn ? t('nav.account') : t('nav.login')"
    @click="handleClick"
  >
    <span class="icon-badge-wrapper">
      <span class="avatar">
        <span class="avatar-initial">
          {{ avatarInitials }}
        </span>
      </span>

      <span v-if="hasBadge"
        class="badge"
      >
        {{ badgeValue }}
      </span>
    </span>

    <span class="icon-label-wrapper">
      <!-- Label amb transició suau login ↔ nom -->
      <transition name="fade-slide" mode="out-in">
        <span
          :key="labelKey"
          class="icon-label header-user-button__label"
        >
          {{ displayName }}
        </span>
      </transition>

      <!-- Subtext amb domini si sembla correu corporatiu -->
      <!-- <span
        v-if="isLoggedIn && isCorporateEmail && emailDomain"
        class="icon-subtext"
      >
        @{{ emailDomain }}
      </span> -->
    </span>
  </button>
</template>

<style scoped>
/* Només icona (sense text) a mobile */
@media (max-width: 640px) {
  .icon-label-wrapper {
    display: none;
  }
}

/* Botó base */
.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  
  /* min-height: 36px;*/       /* igual que HeaderCartButton */
  line-height: 1;          /* evitar desalineació vertical */
  padding-top: 0.2rem;   /* pots ajustar segons calgui */
  padding-bottom: 0.12rem;

  border-radius: 999px;
  border: 1px solid transparent;
  padding-left: 0.6rem;
  padding-right: 0.6rem;

  background: #f2e7d8;
  cursor: pointer;
  font-size: 0.78rem;
  color: var(--shop-text-main);
}

.icon-button:hover {
  background: #ecdcc8;
}

/* Contenidor de l’avatar + badge */
.icon-badge-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.25rem;
}

.avatar {
  width: 16px;   /* mida nova */
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;

  background: var(--color-accent);
  color: var(--color-surface);
  box-shadow: var(--shadow-soft, 0 1px 3px rgba(0,0,0,0.18));
}

.avatar-initial {
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
}

.icon-label-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  white-space: nowrap;
}

.icon-label {
  white-space: nowrap;
}

/* .icon-subtext {
  font-size: 0.7rem;
  opacity: 0.75;
  line-height: 1.1;
} */

/* Badge numèric opcional */
.badge {
  position: absolute;
  top: -0.25rem;
  right: -0.35rem;
  min-width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  background: var(--shop-accent);
  color: var(--color-surfacet);
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Transició label login ↔ nom */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(2px);
}
</style>
