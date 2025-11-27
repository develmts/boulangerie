<!-- components/CartBadge.vue -->
<script setup lang="ts">
const props = defineProps<{
  count: number
  hideIfZero?: boolean
  loading?: boolean
}>()

const showBadge = computed(() => {
  if (props.loading) return true
  if (props.hideIfZero) return props.count > 0
  return true
})
</script>

<template>
  <ClientOnly>
  <span v-if="showBadge" class="cart-badge">
    <span v-if="loading" class="cart-badge__dot"></span>
    <span v-else>{{ count }}</span>
  </span>
  </ClientOnly>
</template>

<style scoped>
.cart-badge {
  min-width: 1.4rem;
  height: 1rem;
  padding: 0 0.3rem;

  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-surface);

  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--button-font, var(--font-body));
  display: inline-flex;
  align-items: center;
  justify-content: center;

  margin-left: 0.4rem;
}

/* petit indicador "pulsant" quan loading = true */
.cart-badge__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: var(--color-surface);
  opacity: 0.9;
  animation: cart-badge-pulse 0.9s ease-in-out infinite;
}

@keyframes cart-badge-pulse {
  0% { transform: scale(0.8); opacity: 0.7; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.7; }
}
</style>
