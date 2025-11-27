<script setup lang="ts">
import { computed } from 'vue'
import type { ContentBlock } from '~/services/cms' 

const props = defineProps<{
  block: ContentBlock | null
}>()

// Si ve de Nuxt Content, esperem que tingui nuxtContentDoc
const hasNuxtDoc = computed(() => {
  return !!props.block?.nuxtContentDoc
})

// console.log("Rich Text", props.block)
</script>

<template>
  <div class="cms-rich-text">
    <!-- Nuxt Content -->
    <ContentRenderer
      v-if="hasNuxtDoc"
      :value="block?.nuxtContentDoc"
    />

    <!-- standard HTML  -->
    <div
      v-else
      v-html="block?.body || ''"
    />
  </div>
</template>

<style scoped>
.cms-rich-text :deep(p) {
  margin-bottom: 12px;
  line-height: 1.6;
}

.cms-rich-text :deep(h2),
.cms-rich-text :deep(h3) {
  margin-top: 20px;
  margin-bottom: 8px;
}

.cms-rich-text :deep(ul),
.cms-rich-text :deep(ol) {
  margin-left: 1.2rem;
  margin-bottom: 12px;
}
</style>
