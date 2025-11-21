// composables/useCdn.ts


export function useCdn() {
  const runtimeConfig = useRuntimeConfig();
  const baseFromConfig = runtimeConfig.public?.cdnBase as string | undefined;
// Fallback al teu GitHub Pages multi-tenant
  const CDN_BASE = baseFromConfig ?? "https://develmts.github.io/dev-cdn/projects";
  /**
   * Retorna una URL absoluta al CDN, donat un projecte i un path.
   *
   * @example cdnUrl('boulangerie', 'products/baguette.jpg')
   */
  const cdnUrl = (project: string, path: string): string => {
    return `${CDN_BASE}/${project}/${path.replace(/^\/+/, "")}`;
  };

  return {
    cdnUrl,
  };
}


