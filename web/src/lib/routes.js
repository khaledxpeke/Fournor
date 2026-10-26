import { products, ingSlugs, xpSlugs, cmsPages, actualites } from "virtual:fournor-catalog";

export const mixes = ["premix-poudres", "mix-poudres", "mix-graines", "mix-liquides"];

const reserved = new Set([
  "",
  "maison",
  "solution",
  "gamme",
  "expertise",
  "ingredients",
  "formation",
  "partenaires",
  "actualites",
  "contact",
]);

export function contentPaths() {
  const paths = [
    "",
    "maison",
    "solution",
    "gamme",
    "expertise",
    "ingredients",
    "formation",
    "partenaires",
    "actualites",
    "contact",
    ...mixes.map((mix) => `gamme/${mix}`),
    ...products.map((product) => `produit/${product.id}`),
    ...xpSlugs.map((id) => `xp/${id}`),
    ...ingSlugs.map((id) => `ingredients/${id}`),
  ];
  for (const page of cmsPages) {
    if (page?.slug && !reserved.has(page.slug) && !paths.includes(page.slug)) paths.push(page.slug);
  }
  for (const item of actualites) {
    const path = item?.slug ? `actualites/${item.slug}` : "";
    if (path && !paths.includes(path)) paths.push(path);
  }
  return paths;
}
