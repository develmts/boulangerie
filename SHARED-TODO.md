  
# Boulangerie — Llista Persistent de Pendents

## 1. Next Major Upgrade
- [ ] Afegir selector de rang temporal (7 / 30 / 90 dies, etc.) a la pàgina d’analítiques.
- [ ] Afegir comparatives de períodes (aquesta setmana vs l’anterior).
- [ ] Afegir polling d’actualització periòdica per analítiques.
- [ ] Afegir gràfic circular (o similar) per desglossament de navegadors / plataformes.

---

## 2. Obligatori – No urgent
- [ ] Migrar el projecte a l’estructura canònica de Nuxt 4 (`app/`).
- [ ] Restringir l’accés a la pàgina d’analítiques només per a usuaris autenticats (idealment admin).

---

## 3. CMS / Content Editor
- [ ] Revisar i unificar l’esquema del blog a `content.config.ts` per alinear-lo amb el model final (FAQ, col·leccions, frontmatter).
- [ ] Afegir a col·leccions CMS el camp `rawbody` i mapear-lo a `CmsPage.body`.
- [ ] OR: mantenir la regla d’arquitectura que `rawbody` sempre s’ha de poder recuperar com a Markdown.
- [ ] Implementar pipeline: quan un document de Sanity canviï (sobretot `rawBody`), el backend ha de regenerar el HTML renderitzat i escriure’l al camp `render` (readOnly al Studio).

---

## 4. Store / Shopify / Mock
- [ ] Moure tota la lògica de botiga a `/services/store/`.
- [ ] Dividir en:
  - `localStore.ts`
  - `storeApi.ts`
  - `shopifyStore.ts`
- [ ] Mantenir compatibilitat amb l’API pública del frontend.
- [ ] Separar mocks de Shopify a `mock-data/shopify`.

---

## 5. Testing
- [ ] Afegir `data-testid` als components requerits:
  - ProductCard (`product-image`)
  - Product detail overlay (`product-detail-overlay`)
  - MiniCartDrawer
  - CartReviewOverlay
  - LanguageSwitcher
  - ErrorCard
  - Blog
- [ ] Implementar el pack complet de tests E2E (IMPORTANT).

---

## 6. Analytics
- [x] Gràfic circular separat a desktop (fet).
- [ ] Fusionar columnes segons maqueta (només si es reprèn).
- [ ] Millorar vista mobile i desktop (pendent revisió contínua).

---

## 7. Disseny & UX
- [x] Review de tipografies per títols i CTA (fet).
- [x] Estàndard de botons amb `--button-font` (fet).
- [x] ProductCard variant “basic” (fet).
- [x] Custom error system: ErrorCard, useAppError, error.vue, integració a layout (fet).

---

## 8. Legal / Footer / Pages
- [x] Tota la secció Legal completada (fet).
- [x] Pàgines extra (FAQ, Contacte, etc.) completades (fet).

---

## 9. Mock-V2
- [ ] Sistema d’auth mock amb rols (user/admin).
- [ ] Taula d’usuaris en memòria.
- [ ] Dataset mock per:
  - Productes (`/prodmgm`)
  - Comandes (`/orders`)
  - Analytics (`/analytics`)
- [ ] Rutes admin només per rols admin.

---

## 10. Cart & Checkout
- [ ] Convertir `cart-review` en un modal (CartReviewOverlay) centrat.
- [ ] Reutilitzar `useCart` (enrichedLines, totals).
- [ ] Integració amb MiniCartDrawer: botó “Comprar” → obrir modal.
- [ ] Preparar botó de confirmació per futur checkout real Shopify.

---

## 11. Locales & i18n
- [ ] Refactorització completa de fitxers de locales.
- [ ] Divisió per dominis (cart/blog/layout/general).
- [ ] Eliminació de claus duplicades.
- [ ] Normalització d’accents i typos.
- [ ] Revisió `shop.cart` vs `cart`.
- [ ] Possibilitat de split en fitxers separats.

---

## 12. Blog / Contingut
- [ ] Integrar camp `rawbody` a tots els documents CMS.
- [ ] Assegurar que `nuxtContentDoc` no s’utilitza per recuperar markdown.
- [ ] Adaptar MarkdownEditor al nou Content Editor modal.

---

## 13. Admin / Content Editor
- [ ] Implementar layout admin amb header / sidebar / footer.
- [ ] Sidebar amb menú d’acordió.
- [ ] Modal d’edició fullscreen (MarkdownEditor).
- [ ] Flux de creació / edició / esborrat per:
  - Blog
  - FAQ
  - Pàgines
  - Home blocks

---

## 14. Variables d’entorn / Config
- [ ] Mantenir només secrets crítics a `.env`.
- [ ] Migrar resta de configuració a fitxers TypeScript:
  - `app.config.ts`
  - `config/envProfiles.ts`
- [ ] Unificar tractament d’entorns (local/dev/prod).

