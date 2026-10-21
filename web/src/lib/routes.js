import { products } from "../products.js";
import { ingSlugs, xpSlugs } from "../xp-data.js";

export const mixes = ["premix-poudres", "mix-poudres", "mix-graines", "mix-liquides"];

export function contentPaths() {
  return [
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
}
