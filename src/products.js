export const products = [
  {
    id: "banette",
    sku: "PREMIX BANETTE FOURN'OR 2%",
    dosage: 2,
    family: "tradition",
    image: "/images/banette.png",
    name: { fr: "Banette", en: "Banette" },
    promise: {
      fr: "La baguette de tous les jours, régulière et croustillante.",
      en: "The everyday baguette — consistent, crisp, golden.",
    },
    sensory: {
      fr: "Croûte fine, mie crème, fermentation classique.",
      en: "Thin crust, cream crumb, classic fermentation.",
    },
    target: {
      fr: "Boulangerie artisanale et points chauds.",
      en: "Artisan bakeries and in-store bake-off.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "tradition",
    sku: "PREMIX TRADITION FOURN'OR 2%",
    dosage: 2,
    family: "tradition",
    image: "/images/tradition.webp",
    name: { fr: "Tradition", en: "Tradition" },
    promise: {
      fr: "Le pain de tradition française, alvéolé et aromatique.",
      en: "French tradition bread — open crumb, aromatic crust.",
    },
    sensory: {
      fr: "Notes de blé, croûte ambrée, mie irrégulière.",
      en: "Wheat notes, amber crust, irregular crumb.",
    },
    target: {
      fr: "Boulangers attachés au pain de tradition.",
      en: "Bakers focused on traditional French bread.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "complet",
    sku: "PREMIX COMPLET FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    image: "/images/complet.png",
    name: { fr: "Complet", en: "Wholemeal" },
    promise: {
      fr: "Un pain complet moelleux, riche en fibres et en goût.",
      en: "A soft wholemeal loaf, rich in fibre and flavour.",
    },
    sensory: {
      fr: "Mie ambrée, grain présent, goût de son.",
      en: "Amber crumb, perceptible grain, bran flavour.",
    },
    target: {
      fr: "Offre santé et pains de régime en boutique.",
      en: "Health-led bakery ranges.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "campagne",
    sku: "PREMIX CAMPAGNE FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    image: "/images/campagne2.webp",
    name: { fr: "Campagne", en: "Country loaf" },
    promise: {
      fr: "Le pain de campagne rustique, à la croûte généreuse.",
      en: "A rustic country loaf with a generous crust.",
    },
    sensory: {
      fr: "Croûte épaisse, mie crème, profil céréalier.",
      en: "Thick crust, cream crumb, cereal profile.",
    },
    target: {
      fr: "Boulangerie de village et restauration.",
      en: "Village bakeries and foodservice.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "cereales-noir",
    sku: "PREMIX CEREALES NOIR FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    image: "/images/noir.png",
    name: { fr: "Céréales noir", en: "Dark cereals" },
    promise: {
      fr: "Un pain sombre, profond, aux céréales torréfiées.",
      en: "A dark loaf with roasted cereal depth.",
    },
    sensory: {
      fr: "Couleur cacao, notes maltées, texture dense.",
      en: "Cocoa colour, malted notes, dense texture.",
    },
    target: {
      fr: "Gamme pains spéciaux et sandwichs premium.",
      en: "Speciality breads and premium sandwiches.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "scandinave",
    sku: "PREMIX SCANDINAVE FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    image: "/images/scandinave.png",
    name: { fr: "Scandinave", en: "Scandinavian" },
    promise: {
      fr: "Inspiration nordique : seigle, graines, caractère.",
      en: "Nordic character — rye, seeds, depth.",
    },
    sensory: {
      fr: "Acidité légère, graines, mie serrée.",
      en: "Gentle acidity, seeds, tight crumb.",
    },
    target: {
      fr: "Pains de caractère et petit-déjeuner.",
      en: "Character breads and breakfast service.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "chia-quinoa",
    sku: "PREMIX CHIA QUINOA FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    image: "/images/quinoa.webp",
    name: { fr: "Chia quinoa", en: "Chia quinoa" },
    promise: {
      fr: "Nutrition visible : chia, quinoa, mie lumineuse.",
      en: "Visible nutrition — chia, quinoa, bright crumb.",
    },
    sensory: {
      fr: "Graines croquantes, goût délicat, mie souple.",
      en: "Crunchy seeds, delicate taste, supple crumb.",
    },
    target: {
      fr: "Clientèle nutrition et pains santé.",
      en: "Nutrition-led and wellness ranges.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "maxi-graines",
    sku: "PREMIX MAXI GRAINES FOURN'OR 50%",
    dosage: 50,
    family: "graines",
    image: "/images/viking.png",
    name: { fr: "Maxi graines", en: "Maxi seeds" },
    promise: {
      fr: "Le pain le plus généreux en graines de la gamme.",
      en: "The most seed-forward loaf in the range.",
    },
    sensory: {
      fr: "Craquant, oléagineux, mie marbrée de graines.",
      en: "Crunch, oilseeds, crumb marbled with grain.",
    },
    target: {
      fr: "Pains signature et offre premium en vitrine.",
      en: "Signature loaves and premium counters.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "multigrain",
    sku: "PREMIX MULTIGRAIN FOURN'OR 50%",
    dosage: 50,
    family: "graines",
    image: "/images/multigrain.png",
    name: { fr: "Multigrain", en: "Multigrain" },
    promise: {
      fr: "L’équilibre des céréales, simple à réussir chaque jour.",
      en: "A balanced cereal loaf, easy to repeat daily.",
    },
    sensory: {
      fr: "Mélange de flocons, mie moelleuse, croûte dorée.",
      en: "Flakes, soft crumb, golden crust.",
    },
    target: {
      fr: "Volume quotidien et restauration rapide.",
      en: "Daily volume and foodservice.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
  {
    id: "mais",
    sku: "PREMIX MAIS FOURN'OR 50%",
    dosage: 50,
    family: "graines",
    image: "/images/mais.webp",
    name: { fr: "Maïs", en: "Corn" },
    promise: {
      fr: "Couleur soleil, mie tendre, un pain qui se distingue.",
      en: "Sun colour, tender crumb — a loaf that stands out.",
    },
    sensory: {
      fr: "Jaune lumineux, notes sucrées de maïs, mie fondante.",
      en: "Bright yellow, sweet corn notes, melting crumb.",
    },
    target: {
      fr: "Pains d’exception et restauration thématique.",
      en: "Speciality loaves and themed foodservice.",
    },
    adds: { fr: "Farine, eau, sel, levure", en: "Flour, water, salt, yeast" },
  },
];

export const dosageMeta = {
  2: {
    label: { fr: "Correcteurs de tradition", en: "Tradition correctors" },
    blurb: {
      fr: "2 % de prémix dans la farine. Le geste du boulanger reste intact.",
      en: "2% premix in the flour. The baker’s craft stays intact.",
    },
    flour: 98,
  },
  30: {
    label: { fr: "Pains de caractère", en: "Character breads" },
    blurb: {
      fr: "30 % de prémix. Goût, couleur et régularité, sans recette complexe.",
      en: "30% premix. Taste, colour and consistency — without a complex recipe.",
    },
    flour: 70,
  },
  50: {
    label: { fr: "Riches en graines", en: "Seed-rich loaves" },
    blurb: {
      fr: "50 % de prémix. La richesse du grain, déjà dosée.",
      en: "50% premix. The richness of the grain, already dosed.",
    },
    flour: 50,
  },
};

export const events = [
  {
    id: "lancement-premix",
    date: "2024-02-01",
    image: "/images/event22.png",
    title: { fr: "Lancement de la gamme de Prémix", en: "Premix range launch" },
    place: { fr: "STD, Tunis", en: "STD, Tunis" },
    text: {
      fr: "Présentation de la gamme Fourn’Or pour la fabrication des pains spéciaux.",
      en: "Introduction of the Fourn’Or range for speciality breads.",
    },
  },
  {
    id: "masterclass",
    date: "2023-11-12",
    image: "/images/event-a.png",
    title: { fr: "Masterclass à STD", en: "Masterclass at STD" },
    place: { fr: "Fournil d’essai, Tunis", en: "Test bakery, Tunis" },
    text: {
      fr: "Formation des boulangers partenaires autour des prémix et de la régularité au fournil.",
      en: "Training partner bakers on premixes and bakery consistency.",
    },
  },
  {
    id: "fete-culinaire",
    date: "2023-09-20",
    image: "/images/event3.png",
    title: { fr: "La Fête Culinaire", en: "Culinary Festival" },
    place: { fr: "Tunis", en: "Tunis" },
    text: {
      fr: "Dégustation de pains spéciaux et rencontre avec les professionnels.",
      en: "Speciality bread tasting and meetings with professionals.",
    },
  },
  {
    id: "rupture",
    date: "2023-04-08",
    image: "/images/event-b.png",
    title: { fr: "Rupture du jeûne", en: "Iftar gathering" },
    place: { fr: "Tunis", en: "Tunis" },
    text: {
      fr: "Un moment de partage autour du pain, avec nos partenaires.",
      en: "A moment of sharing around bread, with our partners.",
    },
  },
  {
    id: "degustation",
    date: "2023-06-15",
    image: "/images/event2.png",
    title: { fr: "Dégustation d’une variété de pains", en: "Bread tasting" },
    place: { fr: "Tunis", en: "Tunis" },
    text: {
      fr: "Une table de pains Fourn’Or pour faire goûter la gamme.",
      en: "A Fourn’Or bread table to taste the range.",
    },
  },
  {
    id: "ecole",
    date: "2023-05-04",
    image: "/images/event1.png",
    title: { fr: "Animation dans une école", en: "School workshop" },
    place: { fr: "Tunis", en: "Tunis" },
    text: {
      fr: "Sensibiliser les plus jeunes au grain, au pain et au métier de boulanger.",
      en: "Introducing children to grain, bread and the baker’s craft.",
    },
  },
];

export const partners = [
  { name: "Bagatelle", city: "Tunis" },
  { name: "Ô Blé d’art", city: "Korba" },
  { name: "Ô Blé d’art", city: "El Mida" },
  { name: "Barouny’s", city: "Djerba" },
  { name: "Pain du fort", city: "Kélibia" },
];

export function getProduct(id) {
  return products.find((p) => p.id === id) || products[0];
}
