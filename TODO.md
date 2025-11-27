# TODO List — Boulangerie Project (v1.0, updated)

## 1. Base Structure
### 1.1. Sidebar ✅ Completed
- ✅Implement responsive sidebar
- ✅Auto-close when selecting any option
- ✅Sticky/fixed behavior depending on device
- ✅Mobile/desktop variants defined
- ✅Extra links shown conditionally based on platform

### 1.2. Footer ✅ Completed
- ✅Sticky on desktop
- ✅Sticky on mobile as well
- ✅Add legal links (desktop only)
- ✅Final unified styling, inverted colors, correct layout

## 2. Content
### 2.1. Legal ✅ Completed
- ✅Privacy Policy page
- ✅Legal Notice / Terms of Use page
- ✅Cookies Policy page
- ✅Full multilingual support (ca/es/en)
- ✅Integrated with Contentful mock
- ✅Integrated with Nuxt Content

### 2.2. Other Pages ✅ Completed
- ✅About page
- ✅Contact page
- ✅Multilingual integration
- ✅Navigation via Contentful mock

## 3. Shopify Mock API
### 3.1. Products ✅ Completed
- Define final product set for demo
- ✅Standardize multilingual names (ca/es/en)
- ✅Final mock images with consistent CDN paths

### 3.2. Cart
- ✅ Full mock functions (createCart, getCart, add, update, remove, clear)
- ✅ Add a useCart() composable for unified UI access
- ✅ Component showing cart item count
- Mock complert per la cistella

## 3.3 Integrations
### 3.3.1 dev-cdn  ✅ Completed
### 3.3.2 Shopify
- 
-
-
-
### 3.3.3 MailJet
### 3.3.4 goatCounter
### 3.3.5 CMS
#### 3.3.5.1 Local contentful ✅ Completed
#### 3.3.5.2 Local nuxt Content
#### 3.3.5.3 Sanity

### 3.4. Future Integration
- Document Shopify vs App responsibilities
- Prepare structure for migration to real Shopify Storefront API

## 4. Contact Form
### 4.1. Frontend
- ✅Complete ContactForm.vue
- Add visual feedback (success / error / loading) to the button
- Add robust client-side validation

### 4.2. Backend (Nitro)
- ✅/api/send-email via Mailjet
- Email logging to file or Supabase (optional)
- Add simple rate-limiting (security)
- Optional: auto-reply email to the user


## 5. Design & UX
- Finalize the color palette
- ✅Review typography for all titles and CTAs
- ✅Create ProductCard layout variations for future listings
- Review responsive behavior of Hero and Product Grid
- Anitmated SVG for AÇctionFeedback

## 6. Optimization
- Enable lazy-loading of images
- Optional blur placeholder
- Review mock image weights
- Add a /health middleware (optional but elegant)

## 7 Monitoring
- ✅ Create a mocked service to goatCounter
- ✅ Minimal DashBoard /analytics
- Afegir segmnentacio per dispositiu
- Filtres avançats

## 10. Documentation
- Main project README
- Folder tree explanation
- Local installation guide
- Deployment guide for Render
- Guide: “mock vs real Shopify”
