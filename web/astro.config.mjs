import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { fournorCatalog } from "./catalog-plugin";

export default defineConfig({
  site: "https://fournor.com",
  trailingSlash: "always",
  compressHTML: true,
  devToolbar: { enabled: false },
  i18n: {
    defaultLocale: "fr",
    locales: ["fr", "en", "ar"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [fournorCatalog()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "fr",
        locales: {
          fr: "fr",
          en: "en",
          ar: "ar",
        },
      },
    }),
  ],
  build: {
    format: "directory",
  },
});
