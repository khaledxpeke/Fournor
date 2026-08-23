import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  appType: "mpa",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        maison: resolve(root, "maison.html"),
        solution: resolve(root, "solution.html"),
        gamme: resolve(root, "gamme.html"),
        produit: resolve(root, "produit.html"),
        expertise: resolve(root, "expertise.html"),
        ingredients: resolve(root, "ingredients.html"),
        actualites: resolve(root, "actualites.html"),
        contact: resolve(root, "contact.html"),
      },
    },
  },
});
