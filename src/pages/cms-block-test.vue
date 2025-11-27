<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'nuxt/app'
import { getCmsBlock } from '~/services/cms/blocks'
import type { Locale } from '~/services/shopify'

// Llegeix parametres opcionalment via query string
// Exemples:
//   /dev/cms-block-test?slug=prova-cms&locale=ca
//   /dev/cms-block-test?slug=avis-legal&locale=es
const route = useRoute()

const slug = ref<string>((route.query.slug as string) || 'prova-cms')
const locale = ref<Locale>((route.query.locale as Locale) || 'ca')

// Fem la crida real al CMS (via getCmsBlock)
const { data, pending, error } = await useAsyncData(
//    () => `cms-block-${locale.value}-${slug.value}`,
   'cms-block-test',
  () => getCmsBlock(slug.value, locale.value),
)

const json = computed(() =>
  data.value ? JSON.stringify(data.value, null, 2) : '',
)
</script>

<template>
  <div class="p-6 space-y-4">
    <h1 class="text-xl font-semibold">Debug getCmsBlock()</h1>

    <div class="text-gray-700">
      <p><strong>Slug:</strong> {{ slug }}</p>
      <p><strong>Locale:</strong> {{ locale }}</p>
    </div>

    <hr />

    <div v-if="pending">
      <p>Carregant…</p>
    </div>

    <div v-else-if="error">
      <p class="text-red-600">
        Error: {{ error }}
      </p>
    </div>

    <div v-else-if="!data">
      <p>Cap bloc retornat (data és null)</p>
    </div>

    <div v-else>
      <p><strong>Title:</strong> {{ data.title }}</p>

      <p><strong>Body (raw string):</strong></p>
      <pre class="bg-gray-100 text-sm p-2 rounded">{{ data.body }}</pre>

      <!-- <p class="text-xs text-gray-500">
        * Nota: el body pot sortir buit si el .md no tè camp "body".
        Després adaptarem això a &lt;ContentRenderer&gt;.
      </p> -->
      <p><strong>Bloc sencer (JSON):</strong></p>
      <pre class="bg-gray-100 text-xs p-2 rounded">
{{ json }}
      </pre>
    </div>
  </div>
</template>
