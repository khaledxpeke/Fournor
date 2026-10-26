import type { Plugin } from "vite";
import { catalogModule, loadSiteCatalog } from "./src/lib/strapi";

const VIRTUAL_ID = "virtual:fournor-catalog";
const RESOLVED = "\0virtual:fournor-catalog";

export function fournorCatalog(): Plugin {
  let pending: Promise<string> | null = null;
  const load = () => {
    pending ??= loadSiteCatalog()
      .then(catalogModule)
      .catch((error) => {
        pending = null;
        throw error;
      });
    return pending;
  };
  return {
    name: "fournor-catalog",
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED;
    },
    load(id) {
      if (id === RESOLVED) return load();
    },
  };
}
