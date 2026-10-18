export const products = [
  {
    id: "baguette-fournor",
    sku: "PREMIX BAGUETTE FOURN'OR 2%",
    dosage: 2,
    family: "tradition",
    mix: "mix-poudres",
    image: "/images/baguette-fournor.jpg",
    name: { fr: "Baguette Fournor", en: "Baguette Fournor", ar: "باغيت فورنور" },
    promise: {
      fr: "La baguette de tous les jours, régulière et croustillante.",
      en: "The everyday baguette — consistent, crisp, golden.",
      ar: "الباغيت اليومية، متجانسة ومقرمشة.",
    },
    sensory: {
      fr: "Croûte fine, mie crème, fermentation classique.",
      en: "Thin crust, cream crumb, classic fermentation.",
      ar: "قشرة رقيقة، لبّ كريمي، تخمير كلاسيكي.",
    },
    target: {
      fr: "Boulangerie artisanale et points chauds.",
      en: "Artisan bakeries and in-store bake-off.",
      ar: "المخابز الحرفية ونقاط الخبز الساخن.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de blé, farine de seigle, gluten de blé, farine d’orge malté torréfié, enzymes, agent de traitement de la farine E300.",
      en: "Wheat flour, rye flour, wheat gluten, roasted malted barley flour, enzymes, flour treatment agent E300.",
      ar: "دقيق القمح، دقيق الجاودار، غلوتين القمح، دقيق الشعير المنبّت المحمّص، إنزيمات، عامل معالجة الدقيق E300.",
    },
    sheet: "/fiches/baguette-fournor.pdf",
  },
  {
    id: "tradition",
    sku: "PREMIX TRADITION FOURN'OR 2%",
    dosage: 2,
    family: "tradition",
    mix: "mix-poudres",
    image: "/images/tradition.jpg",
    name: { fr: "Tradition", en: "Tradition", ar: "تراديسيون" },
    promise: {
      fr: "Le pain de tradition française, alvéolé et aromatique.",
      en: "French tradition bread — open crumb, aromatic crust.",
      ar: "خبز التقاليد الفرنسية، ذو لبّ مفتوح وعطر غني.",
    },
    sensory: {
      fr: "Notes de blé, croûte ambrée, mie irrégulière.",
      en: "Wheat notes, amber crust, irregular crumb.",
      ar: "نكهة القمح، قشرة كهرمانية، لبّ غير منتظم.",
    },
    target: {
      fr: "Boulangers attachés au pain de tradition.",
      en: "Bakers focused on traditional French bread.",
      ar: "الخبّازون المتمسكون بخبز التقاليد.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Protéines de blé (gluten), farine de maïs, sel, farine de blé, levain de seigle dévitalisé et déshydraté, enzymes, agent de traitement de la farine : E300.",
      en: "Wheat proteins (gluten), maize flour, salt, wheat flour, deactivated dehydrated rye sourdough, enzymes, flour treatment agent E300.",
      ar: "بروتينات القمح (غلوتين)، دقيق الذرة، ملح، دقيق القمح، خميرة الجاودار المعطّلة والمجفّفة، إنزيمات، عامل معالجة الدقيق: E300.",
    },
    sheet: "/fiches/tradition.pdf",
  },
  {
    id: "mix-farine-croissant",
    sku: "MIX FARINE CROISSANT FOURN'OR",
    dosage: 2,
    family: "viennoiserie",
    mix: "mix-poudres",
    image: "/images/mix-poudres.webp",
    name: { fr: "Mix croissant", en: "Mix croissant", ar: "خلطة الكرواسون" },
    promise: {
      fr: "Une farine de croissant prête à laminer, régulière au fournil.",
      en: "A croissant flour ready to laminate, consistent in the bakery.",
      ar: "دقيق كرواسون جاهز للطي، منتظم في الفرن.",
    },
    sensory: {
      fr: "Feuilletage franc, beurre bien tenu, dorure régulière.",
      en: "Clear layers, butter held in the dough, even colour.",
      ar: "طبقات واضحة، زبدة ثابتة في العجين، تحمير منتظم.",
    },
    target: {
      fr: "Viennoiserie artisanale et laboratoire.",
      en: "Artisan and lab viennoiserie.",
      ar: "المعجنات الحرفية والمخبر.",
    },
    adds: {
      fr: "Eau, beurre, levure",
      en: "Water, butter, yeast",
      ar: "ماء، زبدة، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de blé composée pour pâte à croissant.",
      en: "Compound wheat flour for croissant dough.",
      ar: "دقيق قمح مركّب لعجينة الكرواسون.",
    },
  },
  {
    id: "complet",
    sku: "PREMIX COMPLET FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    mix: "premix-poudres",
    image: "/images/complet.jpg",
    name: { fr: "Complet", en: "Wholemeal", ar: "كامل" },
    promise: {
      fr: "Un pain complet moelleux, riche en fibres et en goût.",
      en: "A soft wholemeal loaf, rich in fibre and flavour.",
      ar: "خبز كامل طري، غني بالألياف والنكهة.",
    },
    sensory: {
      fr: "Mie ambrée, grain présent, goût de son.",
      en: "Amber crumb, perceptible grain, bran flavour.",
      ar: "لبّ كهرماني، حبّة حاضرة، طعم النخالة.",
    },
    target: {
      fr: "Offre santé et pains de régime en boutique.",
      en: "Health-led bakery ranges.",
      ar: "عرض صحي وخبز الحمية في المتجر.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de blé, issues de blé, gluten de blé, sel, enzymes.",
      en: "Wheat flour, wheat offals, wheat gluten, salt, enzymes.",
      ar: "دقيق القمح، منتجات القمح الثانوية، غلوتين القمح، ملح، إنزيمات.",
    },
    sheet: "/fiches/complet.pdf",
  },
  {
    id: "campagne",
    sku: "PREMIX CAMPAGNE FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    mix: "premix-poudres",
    image: "/images/campagne.jpg",
    name: { fr: "Campagne", en: "Country loaf", ar: "كامبان" },
    promise: {
      fr: "Le pain de campagne rustique, à la croûte généreuse.",
      en: "A rustic country loaf with a generous crust.",
      ar: "خبز الريف الريفي، بقشرة وافرة.",
    },
    sensory: {
      fr: "Croûte épaisse, mie crème, profil céréalier.",
      en: "Thick crust, cream crumb, cereal profile.",
      ar: "قشرة سميكة، لبّ كريمي، طابع حبوي.",
    },
    target: {
      fr: "Boulangerie de village et restauration.",
      en: "Village bakeries and foodservice.",
      ar: "مخابز القرى والمطاعم.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de seigle, protéines de blé (gluten), sel, farine de blé, levain de seigle et de blé dévitalisés et déshydratés, issues de blé, farine d’orge malté torréfié, enzymes, agent de traitement de la farine : E300.",
      en: "Rye flour, wheat proteins (gluten), salt, wheat flour, deactivated dehydrated rye and wheat sourdough, wheat offals, roasted malted barley flour, enzymes, flour treatment agent E300.",
      ar: "دقيق الجاودار، بروتينات القمح (غلوتين)، ملح، دقيق القمح، خميرة الجاودار والقمح المعطّلة والمجفّفة، منتجات القمح الثانوية، دقيق الشعير المنبّت المحمّص، إنزيمات، عامل معالجة الدقيق: E300.",
    },
    sheet: "/fiches/campagne.pdf",
  },
  {
    id: "cereales-noir",
    sku: "PREMIX CEREALES NOIR FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    mix: "premix-poudres",
    image: "/images/cereales-noir.jpg",
    name: { fr: "Céréales noir", en: "Dark cereals", ar: "حبوب داكنة" },
    promise: {
      fr: "Un pain sombre, profond, aux céréales torréfiées.",
      en: "A dark loaf with roasted cereal depth.",
      ar: "خبز داكن وعميق، بحبوب محمّصة.",
    },
    sensory: {
      fr: "Couleur cacao, notes maltées, texture dense.",
      en: "Cocoa colour, malted notes, dense texture.",
      ar: "لون كاكاو، نكهات شعير محمّص، قوام كثيف.",
    },
    target: {
      fr: "Gamme pains spéciaux et sandwichs premium.",
      en: "Speciality breads and premium sandwiches.",
      ar: "مجموعة الخبز المميّز والسندويشات الفاخرة.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de blé, farine de seigle, gluten de blé, farine d’orge malté torréfié, enzymes, agent de traitement de la farine E300.",
      en: "Wheat flour, rye flour, wheat gluten, roasted malted barley flour, enzymes, flour treatment agent E300.",
      ar: "دقيق القمح، دقيق الجاودار، غلوتين القمح، دقيق الشعير المنبّت المحمّص، إنزيمات، عامل معالجة الدقيق E300.",
    },
    sheet: "/fiches/cereales-noir.pdf",
  },
  {
    id: "chia-quinoa",
    sku: "PREMIX CHIA QUINOA FOURN'OR 30%",
    dosage: 30,
    family: "caractere",
    mix: "premix-poudres",
    image: "/images/chia-quinoa.jpg",
    name: { fr: "Chia quinoa", en: "Chia quinoa", ar: "شيا وكينوا" },
    promise: {
      fr: "Nutrition visible : chia, quinoa, mie lumineuse.",
      en: "Visible nutrition — chia, quinoa, bright crumb.",
      ar: "تغذية ظاهرة: شيا، كينوا، لبّ مضيء.",
    },
    sensory: {
      fr: "Graines croquantes, goût délicat, mie souple.",
      en: "Crunchy seeds, delicate taste, supple crumb.",
      ar: "بذور مقرمشة، طعم رقيق، لبّ طري.",
    },
    target: {
      fr: "Clientèle nutrition et pains santé.",
      en: "Nutrition-led and wellness ranges.",
      ar: "زبائن التغذية والخبز الصحي.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Graines (chia, quinoa, tournesol, lin), protéines de blé (gluten), farine de seigle, sel, levain de seigle dévitalisé et déshydraté, farine d’orge malté torréfié, farine de blé, enzymes, agent de traitement de la farine : E300.",
      en: "Seeds (chia, quinoa, sunflower, linseed), wheat proteins (gluten), rye flour, salt, deactivated dehydrated rye sourdough, roasted malted barley flour, wheat flour, enzymes, flour treatment agent E300.",
      ar: "بذور (شيا، كينوا، دوّار الشمس، كتان)، بروتينات القمح (غلوتين)، دقيق الجاودار، ملح، خميرة الجاودار المعطّلة والمجفّفة، دقيق الشعير المنبّت المحمّص، دقيق القمح، إنزيمات، عامل معالجة الدقيق: E300.",
    },
    sheet: "/fiches/chia-quinoa.pdf",
  },
  {
    id: "maxi-graines",
    sku: "PREMIX MAXI GRAINES FOURN'OR 50%",
    dosage: 50,
    family: "graines",
    mix: "premix-poudres",
    image: "/images/maxi-graines.jpg",
    name: { fr: "Maxi graines", en: "Maxi seeds", ar: "ماكسي بذور" },
    promise: {
      fr: "Le pain le plus généreux en graines de la gamme.",
      en: "The most seed-forward loaf in the range.",
      ar: "أغنى خبز بالبذور في المجموعة.",
    },
    sensory: {
      fr: "Craquant, oléagineux, mie marbrée de graines.",
      en: "Crunch, oilseeds, crumb marbled with grain.",
      ar: "قرمشة، زيوت نباتية، لبّ مرقّط بالبذور.",
    },
    target: {
      fr: "Pains signature et offre premium en vitrine.",
      en: "Signature loaves and premium counters.",
      ar: "خبز التوقيع والعرض الفاخر في الواجهة.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de blé, graines (tournesol, lin, sésame, soja), son de seigle, gluten de blé, sel, farine d’orge malté torréfié, levain de seigle et de blé dévitalisés et déshydratés, farine de blé malté, émulsifiant E471, enzymes, agent de traitement de la farine E300.",
      en: "Wheat flour, seeds (sunflower, linseed, sesame, soya), rye bran, wheat gluten, salt, roasted malted barley flour, deactivated dehydrated rye and wheat sourdough, malted wheat flour, emulsifier E471, enzymes, flour treatment agent E300.",
      ar: "دقيق القمح، بذور (دوّار الشمس، كتان، سمسم، صويا)، نخالة الجاودار، غلوتين القمح، ملح، دقيق الشعير المنبّت المحمّص، خميرة الجاودار والقمح المعطّلة والمجفّفة، دقيق القمح المنبّت، مستحلب E471، إنزيمات، عامل معالجة الدقيق E300.",
    },
    sheet: "/fiches/maxi-graines.pdf",
  },
  {
    id: "multigrain",
    sku: "PREMIX MULTIGRAIN FOURN'OR 50%",
    dosage: 50,
    family: "graines",
    mix: "premix-poudres",
    image: "/images/multi-cereales.jpg",
    name: { fr: "Multi céréales", en: "Multi cereals", ar: "متعدد الحبوب" },
    promise: {
      fr: "L’équilibre des céréales, simple à réussir chaque jour.",
      en: "A balanced cereal loaf, easy to repeat daily.",
      ar: "توازن الحبوب، سهل النجاح كل يوم.",
    },
    sensory: {
      fr: "Mélange de flocons, mie moelleuse, croûte dorée.",
      en: "Flakes, soft crumb, golden crust.",
      ar: "مزيج رقائق، لبّ طري، قشرة ذهبية.",
    },
    target: {
      fr: "Volume quotidien et restauration rapide.",
      en: "Daily volume and foodservice.",
      ar: "الحجم اليومي والمطاعم السريعة.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Farine de blé, graines (tournesol, lin, sésame, soja concassé), farine de maïs, gluten de blé, sel, levain de seigle et de blé dévitalisés et déshydratés, farine de blé malté, émulsifiant E472e, enzymes.",
      en: "Wheat flour, seeds (sunflower, linseed, sesame, crushed soya), maize flour, wheat gluten, salt, deactivated dehydrated rye and wheat sourdough, malted wheat flour, emulsifier E472e, enzymes.",
      ar: "دقيق القمح، بذور (دوّار الشمس، كتان، سمسم، صويا مجروشة)، دقيق الذرة، غلوتين القمح، ملح، خميرة الجاودار والقمح المعطّلة والمجفّفة، دقيق القمح المنبّت، مستحلب E472e، إنزيمات.",
    },
    sheet: "/fiches/multi-cereales.pdf",
  },
  {
    id: "mais",
    sku: "PREMIX MAIS FOURN'OR 50%",
    dosage: 50,
    family: "graines",
    mix: "premix-poudres",
    image: "/images/mais.jpg",
    name: { fr: "Maïs", en: "Corn", ar: "ذرة" },
    promise: {
      fr: "Couleur soleil, mie tendre, un pain qui se distingue.",
      en: "Sun colour, tender crumb — a loaf that stands out.",
      ar: "لون الشمس، لبّ ناعم، خبز يتميّز.",
    },
    sensory: {
      fr: "Jaune lumineux, notes sucrées de maïs, mie fondante.",
      en: "Bright yellow, sweet corn notes, melting crumb.",
      ar: "أصفر مضيء، نكهة ذرة حلوة، لبّ ذائب.",
    },
    target: {
      fr: "Pains d’exception et restauration thématique.",
      en: "Speciality loaves and themed foodservice.",
      ar: "خبز الاستثناء والمطاعم الموضوعية.",
    },
    adds: {
      fr: "Farine, eau, sel, levure",
      en: "Flour, water, salt, yeast",
      ar: "دقيق، ماء، ملح، خميرة",
    },
    weight: "20 kg",
    composition: {
      fr: "Billes de maïs extrudés, protéines de blé (gluten), farine de maïs, sel, graines de tournesol, émulsifiant E472e, épices, farine d’orge malté torréfié, extrait d’épices, enzymes, agent de traitement de la farine : E300.",
      en: "Extruded maize pellets, wheat proteins (gluten), maize flour, salt, sunflower seeds, emulsifier E472e, spices, roasted malted barley flour, spice extract, enzymes, flour treatment agent E300.",
      ar: "حبّات ذرة مبثوقة، بروتينات القمح (غلوتين)، دقيق الذرة، ملح، بذور دوّار الشمس، مستحلب E472e، بهارات، دقيق الشعير المنبّت المحمّص، مستخلص بهارات، إنزيمات، عامل معالجة الدقيق: E300.",
    },
    sheet: "/fiches/mais.pdf",
  },
];

export const dosageMeta = {
  2: {
    label: { fr: "Correcteurs de tradition", en: "Tradition correctors", ar: "مصحّحات التقاليد" },
    blurb: {
      fr: "2 % de prémix dans la farine. Le geste du boulanger reste intact.",
      en: "2% premix in the flour. The baker’s craft stays intact.",
      ar: "2٪ من الخلطة في الدقيق. تبقى يد الخبّاز كما هي.",
    },
    flour: 98,
  },
  30: {
    label: { fr: "Pains de caractère", en: "Character breads", ar: "خبز الشخصية" },
    blurb: {
      fr: "30 % de prémix. Goût, couleur et régularité, sans recette complexe.",
      en: "30% premix. Taste, colour and consistency — without a complex recipe.",
      ar: "30٪ خلطة. طعم ولون وانتظام، دون وصفة معقّدة.",
    },
    flour: 70,
  },
  50: {
    label: { fr: "Riches en graines", en: "Seed-rich loaves", ar: "غني بالبذور" },
    blurb: {
      fr: "50 % de prémix. La richesse du grain, déjà dosée.",
      en: "50% premix. The richness of the grain, already dosed.",
      ar: "50٪ خلطة. ثراء الحبوب، بجرعة جاهزة.",
    },
    flour: 50,
  },
};

export const events = [
  {
    id: "korba",
    image: "/images/franchise-korba.webp?v=2",
    title: { fr: "FOURN’OR Korba", en: "FOURN’OR Korba", ar: "FOURN’OR قربة" },
    place: { fr: "Korba", en: "Korba", ar: "قربة" },
    text: {
      fr: "Pains spéciaux, pâtisserie, viennoiserie et café.",
      en: "Speciality breads, pastry, viennoiserie and café.",
      ar: "خبز مميّز وحلويات وفينوازري ومقهى.",
    },
  },
  {
    id: "ezzahra",
    image: "/images/franchise-ezzahra.webp?v=2",
    title: { fr: "FOURN’OR Ezzahra", en: "FOURN’OR Ezzahra", ar: "FOURN’OR الزهراء" },
    place: { fr: "Ezzahra", en: "Ezzahra", ar: "الزهراء" },
    text: {
      fr: "Pains spéciaux, pâtisserie, viennoiserie et café.",
      en: "Speciality breads, pastry, viennoiserie and café.",
      ar: "خبز مميّز وحلويات وفينوازري ومقهى.",
    },
  },
  {
    id: "beni-khalled",
    image: "/images/franchise-beni-khalled.webp?v=2",
    title: { fr: "FOURN’OR Beni Khalled", en: "FOURN’OR Beni Khalled", ar: "FOURN’OR بني خلاد" },
    place: { fr: "Beni Khalled", en: "Beni Khalled", ar: "بني خلاد" },
    text: {
      fr: "Pains spéciaux, pâtisserie, sandwicherie et traiteur.",
      en: "Speciality breads, pastry, sandwiches and catering.",
      ar: "خبز مميّز وحلويات وساندويتشات وتموين.",
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
