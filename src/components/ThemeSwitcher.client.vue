<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
const config= useRuntimeConfig()

const isDemo = config.public.optionMode == 'demo'

const themes = [
  { id: "base", label: "Base" },
  { id: "artisanal-warm", label: "Artisanal Warm" },
  { id: "french-minimal", label: "French Minimal" },
  { id: "pa-i-dolcos", label: "Pa i Dolços" },
];

const current = ref<string>("base");

const applyTheme = (id: string) => {
  const root = document.documentElement;

  if (id === "base") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", id);
  }

  current.value = id;
  localStorage.setItem("dev-theme", id);
};

onMounted(() => {
  if (!isDemo) return;

  const saved = localStorage.getItem("dev-theme");
  if (saved && themes.some(t => t.id === saved)) {
    applyTheme(saved);
  }
});

// Quan canvies el select, apliquem el tema
watch(current, (val) => {
  if (!isDemo) return;
  applyTheme(val);
});
</script>

<template>
  <div v-if="isDemo" class="theme-switcher">
    <select v-model="current">
      <option
        v-for="theme in themes"
        :key="theme.id"
        :value="theme.id"
      >
        {{ theme.label }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: fixed;
  right: 1rem;
  bottom: 0.5rem;
  z-index: 9999;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  background: var(--color-bg);
  color:  var(--color-text-muted);
  font-size: 0.75rem;
  backdrop-filter: blur(6px);
}

.theme-switcher select {
  /* background: rgba(255, 255, 255, 0.95); */
  background: var( --color-bg);
  border: none;
  color:  var(--color-text-brand); 
  font: inherit;
  outline: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 0.15rem 0.6rem;
}
</style>
