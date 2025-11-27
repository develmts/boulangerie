<!--
  ---------------------------------------------------------------------------
  ActionFeedback.vue
  ---------------------------------------------------------------------------

  A small UI utility component used to indicate loading or pending actions.
  It supports three visual modes: spinner, dots animation, and text reveal.
  The goal is to provide a unified and flexible feedback element for pages
  that need to show a “loading”, “processing”, or “please wait” state.

  ---------------------------------------------------------------------------
  PROPS
  ---------------------------------------------------------------------------
  mode: "spinner" | "dots" | "text" | "svg"
      - spinner : simple rotating circle, minimal and neutral.
      - dots    : text-based “...” animation (frames: ., .., ...).
      - text    : animated display of characters over time.
      - svg     : svg-based loader (inline default or external via svgSrc).

  text: string
      - Only used in “text” mode.
      - The string is progressively revealed or animated depending on
        the chosen textVariant.

  textVariant: "reveal" | "dots"
      - reveal : characters appear one by one (typewriter-style).
      - dots   : keeps the text fixed and animates dots after it.

  intervalMs: number
      - Time (ms) between animation steps.
      - Default: 120ms.

  loop: boolean
      - If true, the animation restarts automatically.
      - If false, the animation stops when the end of the sequence is reached.
        (spinner always loops by design.)

  size: number
      - Size of the spinner / svg (px).

  svgSrc: string
      - If provided and mode === "svg", this image is rendered instead of the
        default inline SVG loader.

  ---------------------------------------------------------------------------
  EXAMPLES
  ---------------------------------------------------------------------------

  <ActionFeedback mode="spinner" />

  <ActionFeedback mode="dots" />

  <ActionFeedback
      mode="text"
      text="Loading"
      text-variant="reveal"
      :interval-ms="90"
  />

  <ActionFeedback
      mode="text"
      text="Loading"
      text-variant="dots"
      :loop="true"
  />

  <ActionFeedback
      mode="svg"
      svg-src="/assets/loaders/bakery.svg"
      :size="40"
  />

  ---------------------------------------------------------------------------
  NOTES
  ---------------------------------------------------------------------------
  - No external libraries are used.
  - All animations rely on lightweight timers.
  - This component is intentionally “dumb”: it does not manage loading state
    itself. The parent component controls when it appears.
  - Styles are scoped to avoid CSS collisions.

  ---------------------------------------------------------------------------
-->

<script setup lang="ts">
import { ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  mode: { type: String, default: 'spinner' }, // spinner | dots | text | svg
  text: { type: String, default: '' },
  textVariant: { type: String, default: 'dots' }, // reveal | dots
  intervalMs: { type: Number, default: 120 },
  loop: { type: Boolean, default: true },
  size: { type: Number, default: 32 },
  svgSrc: { type: String, default: '' },
})

const frame = ref(0)
let timer: number | null = null

// --------------------------------------------
// Text / dots animation
// --------------------------------------------
function startTextAnimation() {
  if (!import.meta.client) return; // ⬅ PREVENT SSR

  stop()
  frame.value = 0

  timer = window.setInterval(() => {
    frame.value++

    const max =
      props.textVariant === 'reveal'
        ? props.text.length
        : 3 // 1 to 3 dots

    if (frame.value >= max) {
      if (props.loop) {
        frame.value = 0
      } else {
        stop()
      }
    }
  }, props.intervalMs)
}

function stop() {
  if (timer) clearInterval(timer)
  timer = null
}

onMounted(() => {
  if (props.mode === 'text' || props.mode === 'dots') {
    startTextAnimation()
  }
})

onBeforeUnmount(stop)

watchEffect(() => {
  if (!import.meta.client) return; // ⬅ PREVENT SSR

  if (props.mode === 'text' || props.mode === 'dots') {
    startTextAnimation()
  } else {
    stop()
  }
})
</script>

<template>
  <div class="action-feedback">
    <!-- Spinner mode (CSS only) -->
    <div
      v-if="mode === 'spinner'"
      class="spinner"
      :style="{ width: size + 'px', height: size + 'px' }"
    />

    <!-- Dots mode -->
    <div v-else-if="mode === 'dots'" class="dots">
      <span v-if="frame === 0">.</span>
      <span v-else-if="frame === 1">..</span>
      <span v-else>...</span>
    </div>

    <!-- Text animation mode -->
    <div v-else-if="mode === 'text' " class="text">
      <template v-if="textVariant === 'reveal'">
        {{ text.slice(0, frame) }}
      </template>

      <template v-else-if="textVariant === 'dots'">
        {{ text }}
        <span v-if="frame === 0">.</span>
        <span v-else-if="frame === 1">..</span>
        <span v-else>...</span>
      </template>
    </div>

    <!-- SVG mode -->

    <div
      v-else-if="mode === 'svg'"
      class="svg-wrapper"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <img
        v-if="svgSrc"
        :src="svgSrc"
        :style="{ width: '100%', height: '100%' }"
        alt="loading svg"
      />
      <svg v-else viewBox="0 0 50 50" class="default-svg">
        <circle
          class="spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
        />
      </svg>
    </div>

    <!-- Optional fallback -->
    <div v-else class="text">
      {{ text || 'Loading…' }}
    </div>
  </div>
</template>

<style scoped>
.action-feedback {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: var(--color-text);
}

/* ------------------------------------------
   CSS Spinner
------------------------------------------- */
.spinner {
  border: 3px solid #ccc;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.text {
  font-weight: 500;
  letter-spacing: 0.04em;
}

.dots {
  font-size: 1.2rem;
  letter-spacing: 2px;
}

/* SVG loader */

.svg-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.default-svg {
  width: 100%;
  height: 100%;
}

/* cercla que gira */
.spinner-circle {
  stroke: var(--color-primary);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 100 60;      /* fa un arc, no un cercle complet */
  transform-box: fill-box;       /* molt important per SVG */
  transform-origin: 50% 50%;     /* centre del cercle */
  animation: spinner-rotate 0.9s linear infinite;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


</style>
