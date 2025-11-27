<script setup lang="ts">
const { data } = await useAsyncData('content-playground', () =>
  queryContent().limit(10).find()
)
</script>

<template>
  <div class="p-6">
    <h1>Content playground</h1>
    <p>Primeres 10 entrades trobades a /content:</p>

    <pre v-if="data">
        {{ data }}
    </pre>

    <p v-else>Sense resultats.</p>
  </div>
</template>
