// plugins/goatcounter.client.ts
// plugins/goatcounter.client.ts
// export default defineNuxtPlugin(() => {
//   if (process.client) {
//     const script = document.createElement('script')
//     script.setAttribute('src', 'https://gc.zgo.at/count.js')
//     script.setAttribute('async', '')
//     script.setAttribute('data-goatcounter', 'https://niko-dev.goatcounter.com/count')
//     document.head.appendChild(script)
//   }
// })


// plugins/goatcounter.client.ts (ampliat)
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    if (window && (window as any).goatcounter) {
      (window as any).goatcounter.count({
        path: location.pathname + location.search,
        title: document.title,
        referrer: document.referrer,
      });
    }
  });
});
