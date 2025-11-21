// export const cdnBase = "https://develmts.github.io/dev-cdn/projects";
// import { useAppConfig } from "#imports";
// const config = useRuntimeConfig();
// const project="boulangeire"
// const cdnBase = config.public.mockCdnBaseUrl

// function cdnUrl(projId: string, path: string) {
//   return `${cdnBase}/project/${projId}/${path.replace(/^\/+/, "")}`;
// }

// const projId = "boulangerie"

// export const cdn = (projId:string,path: string) => {
//   return cdnUrl(projId, path);
// }
  
// /uils/
export interface CdnHelper {
  cdn(path: string): string;
  cdnFor(project: string, path: string): string;
}

/**
 * Crea un helper de CDN a partir d'una base absoluta.
 *
 * Exemple:
 *   const cdn = createCdnHelper("https://develmts.github.io/dev-cdn/projects");
 *   cdn.cdnFor("boulangerie", "products/baguette.jpg");
 */
export function createCdnHelper(cdnBase: string): CdnHelper {
  const normalizedBase = cdnBase.replace(/\/+$/, ""); // sense barra final

  const cdnFor = (project: string, path: string): string => {
    const cleanProject = project.replace(/^\/+|\/+$/g, "");
    const cleanPath = path.replace(/^\/+/, "");
    return `${normalizedBase}/${cleanProject}/${cleanPath}`;
  };

  const cdn = (path: string): string => {
    // versió "sense projecte" per si algun dia tens paths directes
    const cleanPath = path.replace(/^\/+/, "");
    return `${normalizedBase}/${cleanPath}`;
  };

  return { cdn, cdnFor };
}
