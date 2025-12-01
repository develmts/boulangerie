<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import Sidebar from '~/components/Sidebar.vue';
import AuthOverlay from '~/components/AuthOverlay.vue';
import ThemeSwitcher from '~/components/ThemeSwitcher.client.vue';
import ErrorCard from '~/components/ErrorCard.vue';
import { useAppError } from '~/composables/useAppError';
import { useConsentScriptLoader }  from  '~/composables/UseConsentScriptLoader'

const { loadScript } = useConsentScriptLoader()

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const { error, isVisible, clearError } = useAppError()

onMounted(() => {
  //loadScript('analytics', 'https://www.googletagmanager.com/gtag/js?id=G-XXXX')
})

</script>

<template>
  <div class="app-layout">
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen"/>
      <CookieBanner />
      <Sidebar v-model:open="isSidebarOpen" />

      <main class="app-main-content">
        <slot />
      </main>
      <AuthOverlay />


    <AppFooter />
    <!-- 🔔 Error d’aplicació en mode modal (overlay + blur) -->
    <ErrorCard
      v-if="isVisible && error"
      mode="modal"
      :status-code="error.statusCode ?? undefined"
      :title="error.title"
      :description="error.description"
      @primary="clearError"
    >
    </ErrorCard>
    <ThemeSwitcher />
    <MiniCartDrawer />
    <ProductOverlay />
  </div>

</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-body {
  position: relative;
  flex: 1;
  /* Amplada compartida per sidebar i tirador quan està oberta */
  --sidebar-width: 260px;
}

.app-main-content {
  padding: 1.5rem 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Tirador base */
.sidebar-trigger {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 60;
  background: var(--color-surface);
  border: 1px solid var(--color-border-subtle);
  border-left: none;
  border-radius: 0 999px 999px 0;
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  box-shadow: var(--shadow-soft);
}

/* TANCADA: enganxat al marge esquerre del cos */
.sidebar-trigger--closed {
  left: 0;
}

/* OBERTA: enganxat exactament al marge dret de la sidebar */
.sidebar-trigger--open {
  left: var(--sidebar-width);
}

/* Icona del tirador */
.trigger-icon {
  display: block;
  font-size: 0.9rem;
  line-height: 1;
}
</style>
