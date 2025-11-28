<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
// import { useCustomer } from '~/composables/useCustomer'
// import { useAuthOverlay } from '~/composables/useAuthOverlay'
import { useAuthUI } from '~/composables/useAuthUI'

const { t } = useI18n()
// const localePath = useLocalePath()
// const router = useRouter()

// const { customer, isLoggedIn, loading, hydrate } = useCustomer()
// const { open: openAuth } = useAuthOverlay()

const {openDefault } = useAuthUI()

const props = defineProps<{
  to?: string     // ja no l'usem, però el deixem per no trencar API
  showBadge?: boolean
  badgeValue?: number | string | null
}>()

const hasBadge = computed(() => {
  if (props.showBadge === false) return false
  if (props.badgeValue === null || props.badgeValue === undefined) return false
  return true
})


function handlePrimaryClick() {
  console.log("Opening UserMenu")
  openDefault()
  close()

} 

// onMounted(() => {
//   // Hidratem estat de client des de /api/auth/me (mock)
//   hydrate()
// })

// defineExpose({ toggle })
</script>

<template>
  <button
    type="button"
    class="icon-button header-user-button"
    aria-label="User Account"
    @click="handlePrimaryClick"
  >
    <!-- Icona d’usuari -->
    <User class="icon" />
    <!-- Etiqueta (oculta en mòbil) -->
    <span class="header-user-button__label">
      {{ t('nav.account') }}
    </span>

    <!-- Badge (opcional) -->
    <span
      v-if="hasBadge"
      class="header-user-button__badge"
    >
      {{ badgeValue }}
    </span>
  </button>
</template>

<style scoped>
.user-menu-wrapper {
  position: relative;
}
.user-menu {
  position: absolute;
  right: 0;
  top: 110%;
  min-width: 180px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  padding: 0.35rem 0.35rem;
  z-index: 9999;
}
.user-menu__item,
.user-menu__link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  font-size: 0.82rem;
  border: none;
  background: none;
  cursor: pointer;
}
.user-menu__item:hover,
.user-menu__link:hover {
  background: #f2e7d8;
}

.user-menu-fade-enter-active,
.user-menu-fade-leave-active {
  transition: opacity .12s ease, transform .12s ease;
}
.user-menu-fade-enter-from,
.user-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
