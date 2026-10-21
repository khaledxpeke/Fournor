export function productSearch(product) {
  const bits = [product.id, product.sku, product.family, product.mix, product.dosage, `${product.dosage}%`];
  for (const field of ["name", "promise", "sensory", "target"]) {
    const value = product[field];
    if (!value) continue;
    bits.push(value.fr, value.en, value.ar);
  }
  return bits.filter(Boolean).join(" ");
}

export function mixTitleKey(mix) {
  return {
    "premix-poudres": "gamme.filterPremix",
    "mix-poudres": "gamme.filterMix",
    "mix-graines": "gamme.filterGraines",
    "mix-liquides": "gamme.filterLiquid",
  }[mix];
}
