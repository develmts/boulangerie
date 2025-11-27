<script setup lang="ts">
import { createNavLinks } from '~/config/navLinks';

const props = defineProps<{
  open: boolean;
}>();
const emit = defineEmits(['update:open'])

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const links = computed(() => createNavLinks(t, localePath));
const pages = computed(() => [
  { key: 'about', to: localePath('/about'), label: t('nav.about') },
  { key: 'contact', to: localePath('/contact'), label: t('nav.contact') },
]); 

function closeMenu() {
  emit('update:open', false)
}
</script>

<template>
  <aside v-if="open" class="sidebar">
    <header class="sidebar-header">
      <h2 class="sidebar-title">
        {{ t('header.title') }}
      </h2>
    </header>

    <!-- Navegació -->
    <nav class="sidebar-nav">
      <ul>
        <li v-for="link in links" :key="link.key">
          <NuxtLink
            :to="link.to"
            class="sidebar-link"
            :class="{ 'sidebar-link--active': route.path === link.to }"
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Non Navigation links-->
    <nav class="sidebar-links">
      <ul>
        <li v-for="page in pages" :key="page.key">
          <NuxtLink
            :to="page.to"
            class="sidebar-link"
            :class="{ 'sidebar-link--active': route.path === page.to }"
            @click="closeMenu"
          >
            {{ page.label }}
          </NuxtLink>
        </li>

        <!-- 🔽 NOMÉS ESCRIPTORI (a partir d'ara: només mòbil o els reutilitzarem en header en desktop) -->
        <li class="sidebar-desktop-only">
          <NuxtLink :to="localePath('/legal')" @click="closeMenu">
            {{ t('nav.legal') }}
          </NuxtLink>
        </li>
        <li class="sidebar-desktop-only">
          <NuxtLink :to="localePath('/privacy')" @click="closeMenu">
            {{ t('nav.privacy') }}
          </NuxtLink>
        </li>      
        <li class="sidebar-desktop-only">
          <NuxtLink :to="localePath('/cookies')" @click="closeMenu">
            {{ t('nav.cookies') }}
          </NuxtLink>
        </li>      
      </ul>
    </nav> 

    <!-- Future extra content aquí -->
  </aside>
</template>

<style scoped>
/* Per defecte (desktop i pantalles grans): LA SIDEBAR NO ES MOSTRA */
.sidebar {
  display: none;
  box-shadow: 4px 0 12px rgba(0,0,0,0.12);
  /* border-right: 1px solid rgba(0,0,0,0.08); */
  /*     
    box-shadow: none;
    background:
      linear-gradient(to right,
        rgba(0,0,0,0.06) 0px,
        transparent 8px
      ),
      var(--color-surface);
  */
    
  backdrop-filter: blur(6px);
  /* background: color-mix(in srgb, var(-color--surface) 75%, transparent); */
  background: var(--color-surface);

}

/* NOMÉS MÒBIL / TABLET ESTRETA */
@media (max-width: 900px) {
  .sidebar {
    display: flex;
    position: fixed;

    /* Ajusta aquests valors segons alçada header/footer reals */
    top: 56px;     /* espai per al header fixed */
    left: 0;
    bottom: 56px;  /* espai per al footer fixed */

    width: var(--sidebar-width, 260px);
    max-width: 80vw;
    box-sizing: border-box;
    box-shadow: 4px 0 12px rgba(0,0,0,0.12);
    /* border-right: 1px solid rgba(0,0,0,0.08); */
    /*     
      box-shadow: none;
      background:
        linear-gradient(to right,
          rgba(0,0,0,0.06) 0px,
          transparent 8px
        ),
        var(--color-surface);
    */
      
    backdrop-filter: blur(6px);
    /* background: color-mix(in srgb, var(-color--surface) 75%, transparent); */
    background: var(-color--surface); 
    /* box-shadow: 4px 0 12px var(--shadow-soft); */
    padding: 1.25rem 1.5rem;
    z-index: 55;

    flex-direction: column;
    overflow-y: auto; /* si hi ha massa contingut, scroll intern */
  }
}

.sidebar-header {
  margin-bottom: 1rem;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-strong);
}

.sidebar-subtitle {
  margin: 0.1rem 0 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

/* Llista de navegació */
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li + li {
  margin-top: 0.4rem;
}

/* Extra links */
.sidebar-links ul {
  list-style: none;
  display: none;
  padding: 0;
  margin: 0;
}

.sidebar-links li + li {
  margin-top: 0.4rem;
}

/* Base link */
.sidebar-link {
  padding: 0.4rem 0.7rem;
  border-radius: 999px;
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--color-text);
  background: transparent;
  transition:
    background-color 0.15s ease,
    color 0.15s ease,
    transform 0.1s ease;
}

/* Hover highlight */
.sidebar-link:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-brand);
  transform: translateX(2px);
}

/* Active highlight */
.sidebar-link--active {
  background: var(--color-accent-soft);
  color: var(--color-text-brand);
  font-weight: 600;
}

.sidebar-desktop-only {
  display: none;
}

/* Si en algun moment vols mostrar algun d'aquests només en un breakpoint diferent, aquí ho modularem.
   De moment els deixo amagats per no liar més la UX en desktop. */
</style>
