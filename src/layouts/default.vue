<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from '~/components/AppHeader.vue';
import AppFooter from '~/components/AppFooter.vue';
import Sidebar from '~/components/Sidebar.vue';
import DevThemeSwitcher from '~/components/DevThemeSwitcher.client.vue';

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div class="app-layout">
    <AppHeader @toggle-sidebar="isSidebarOpen = !isSidebarOpen"/>

    <!-- <div class="app-body"> -->
      <!-- Tirador lateral -->
      <!--
      <button
        type="button"
        class="sidebar-trigger"
        :class="isSidebarOpen ? 'sidebar-trigger--open' : 'sidebar-trigger--closed'"
        @click="toggleSidebar"
        aria-label="Toggle sidebar"
      >
        <span class="trigger-icon">
          {{ isSidebarOpen ? '‹' : '›' }}
        </span>
      </button>
      -->
      <!-- Sidebar simple -->
      <Sidebar v-model:open="isSidebarOpen" />

      <main class="app-main-content">
        <slot />
      </main>
    <!-- </div> -->

    <DevThemeSwitcher />
    <AppFooter />
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
