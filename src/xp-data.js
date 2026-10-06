const L = (fr, en, ar) => ({ fr, en, ar });

export const xpTree = [
  {
    id: "metiers",
    children: ["rd", "artisan", "industriel", "patisserie", "snacking", "agro", "autres"],
  },
  {
    id: "xp-ingredient",
    children: ["parcours", "solutions-ing"],
  },
  {
    id: "formulation",
    children: ["sur-mesure", "analyses", "reponses"],
  },
  {
    id: "innovation-hub",
    children: ["innovation", "marketing", "collections"],
  },
  { id: "formation", children: [] },
  { id: "services", children: [] },
];

export const ingFamilies = ["poudre", "grains", "liquide", "sans-gluten", "divers"];

export const xpHref = (id) => `/xp.html?id=${id}`;
export const ingHref = (id) => `/ingredients.html?fam=${id}`;

export const xpNav = {
  metiers: L("Expertise métiers", "Craft expertise", "خبرة المهن"),
  rd: L("R&D", "R&D", "البحث والتطوير"),
  artisan: L("Boulangerie artisan", "Artisan bakery", "مخابز حرفية"),
  industriel: L("Boulangerie industrielle", "Industrial bakery", "مخابز صناعية"),
  patisserie: L("Boulangerie pâtisserie", "Bakery pastry", "مخابز وحلويات"),
  snacking: L("Snacking", "Snacking", "سناكينغ"),
  agro: L("Agro alimentaire", "Food industry", "الصناعة الغذائية"),
  autres: L("Autres industrielles", "Other industries", "صناعات أخرى"),
  "xp-ingredient": L("Expertise ingrédient", "Ingredient expertise", "خبرة المكوّنات"),
  parcours: L("Le parcours ingrédients", "The ingredient path", "مسار المكوّنات"),
  "solutions-ing": L("Nos solutions ingrédients", "Our ingredient solutions", "حلول المكوّنات"),
  formulation: L("Expertise formulation", "Formulation expertise", "خبرة الصياغة"),
  "sur-mesure": L("La formulation sur mesure", "Custom formulation", "الصياغة حسب الطلب"),
  analyses: L("Nos analyses spécifiques", "Specific analyses", "تحاليلنا الخاصة"),
  reponses: L("Des réponses ciblées", "Targeted answers", "إجابات موجّهة"),
  "innovation-hub": L("Innovation & tendances", "Innovation & trends", "الابتكار والاتجاهات"),
  innovation: L("Innovation", "Innovation", "الابتكار"),
  marketing: L("Stratégie marketing", "Marketing strategy", "استراتيجية التسويق"),
  collections: L("Collections", "Collections", "المجموعات"),
  formation: L("SATIA formation", "SATIA training", "تكوين SATIA"),
  services: L("Services & accompagnement", "Services & support", "خدمات ومرافقة"),
  poudre: L("Poudre", "Powder", "بودرة"),
  grains: L("Grains", "Grains", "حبوب"),
  liquide: L("Liquide", "Liquid", "سائل"),
  "sans-gluten": L("Produit sans gluten", "Gluten-free", "بدون غلوتين"),
  divers: L("Divers", "Other", "متنوّع"),
};

const pages = {
  metiers: {
    image: "/images/expertise.webp",
    tag: L("Pour chaque métier", "For every craft", "لكل مهنة"),
    lead: L(
      "SATIA intervient auprès des métiers de la filière : du fournil artisanal à la ligne industrielle, de la pâtisserie au snacking.",
      "SATIA works with every craft in the chain: from the artisan bakery to the industrial line, from pastry to snacking.",
      "تعمل SATIA مع مهن السلسلة: من الفرن الحرفي إلى الخط الصناعي، من الحلويات إلى السناكينغ."
    ),
    text: L(
      "L’expérience acquise autour des solutions, mélanges FOURN’OR et ingrédients nous permet d’accompagner chaque métier avec des formulations adaptées, un fournil d’essai et une équipe technico-commerciale.",
      "Experience around solutions, FOURN’OR blends and ingredients lets us support each craft with the right formulations, a test bakery and a technical-sales team.",
      "الخبرة حول الحلول وخلطات FOURN’OR والمكوّنات تتيح مرافقة كل مهنة بصيغ مناسبة وفرن تجربة وفريق تقني-تجاري."
    ),
  },
  rd: {
    image: "/images/fournil.webp",
    tag: L("Rechercher, tester, formuler", "Research, test, formulate", "بحث، تجربة، صياغة"),
    lead: L(
      "Le fournil d’essai SATIA est le lieu de la recherche, du développement et de l’innovation produit — au service de vos cahiers des charges.",
      "The SATIA test bakery is where product research, development and innovation happen — against your specifications.",
      "فرن التجربة SATIA هو مكان البحث والتطوير وابتكار المنتج — في خدمة دفاتر شروطكم."
    ),
    text: L(
      "Une équipe dédiée analyse de nouveaux ingrédients, produits et technologies : nouvelles saveurs, régularité, naturalité, adaptation au process. Les boulangers-formateurs SATIA testent, ajustent et transmettent le geste, de l’essai à la mise en production.",
      "A dedicated team studies new ingredients, products and technologies: new flavours, consistency, naturalness, process fit. SATIA baker-trainers test, adjust and pass on the craft, from the trial to production.",
      "فريق مخصّص يحلّل مكوّنات ومنتجات وتقنيات جديدة: نكهات جديدة، انتظام، طبيعية، ملاءمة العملية. خبّازو التكوين في SATIA يجرّبون ويضبطون وينقلون الإيماءة، من التجربة إلى الإنتاج."
    ),
    notes: [
      {
        title: L("Fournil d’essai", "Test bakery", "فرن التجربة"),
        text: L(
          "Recherche, développement et démonstration à Soliman, au plus près de vos recettes.",
          "Research, development and demonstration in Soliman, close to your recipes.",
          "بحث وتطوير وعرض في سليمان، قرب وصفاتكم."
        ),
      },
      {
        title: L("Boulangers-formateurs", "Baker-trainers", "خبّازون مكوِّنون"),
        text: L(
          "Former, accompagner et conseiller vos équipes, du fournil artisanal à l’unité industrielle.",
          "Train, support and advise your teams, from the artisan bakery to the industrial plant.",
          "تكوين ومرافقة ونصح فرقكم، من الفرن الحرفي إلى الوحدة الصناعية."
        ),
      },
    ],
  },
  artisan: {
    image: "/images/mix-premix.webp?v=4",
    tag: L("Un fournil régulier, chaque jour", "A consistent bakery, every day", "فرن منتظم، كل يوم"),
    lead: L(
      "Sous la marque FOURN’OR, nos prémix panification et viennoiserie sécurisent le résultat sans retirer au métier du boulanger.",
      "Under the FOURN’OR brand, our bread and viennoiserie premixes steady the result without taking the craft from the baker.",
      "تحت علامة FOURN’OR، تؤمّن خلطات الخبز والفينوازري النتيجة دون أن تنقص من مهنة الخبّاز."
    ),
    text: L(
      "Banette, Tradition, Complet, Campagne, graines… le boulanger complète avec sa farine, l’eau, le sel et la levure. Objectif : clarifier la recette, tenir la régularité, ouvrir la vitrine — du fournil artisanal au point chaud.",
      "Banette, Tradition, Complet, Campagne, seeds… the baker completes with flour, water, salt and yeast. The aim: clarify the recipe, hold consistency, open the counter — from the artisan bakery to in-store bake-off.",
      "بانيت، تراديسيون، كامل، كامبان، بذور… يكمّل الخبّاز بدقيقه والماء والملح والخميرة. الهدف: توضيح الوصفة، حفظ الانتظام، فتح الواجهة — من الفرن الحرفي إلى نقطة الخبز الساخن."
    ),
    cta: { href: "/gamme.html?mix=premix-poudres", key: "ad.a.cta" },
  },
  industriel: {
    image: "/images/maison.webp",
    tag: L("Cadence, régularité, process", "Throughput, consistency, process", "إيقاع، انتظام، عملية"),
    lead: L(
      "Pour la boulangerie et la viennoiserie industrielles, SATIA conçoit des mélanges et un accompagnement adaptés aux lignes automatisées.",
      "For industrial bread and viennoiserie, SATIA designs blends and support suited to automated lines.",
      "لمخابز وفينوازري الصناعة، تصمّم SATIA خلطات ومرافقة تناسب الخطوط المؤتمتة."
    ),
    text: L(
      "Pain de mie, buns, baguettes, viennoiserie… nous travaillons avec vos équipes R&D et production : dosage, machinabilité, durée de vie, texture. Mix poudres, mix liquides et prémix FOURN’OR s’intègrent à vos diagrammes, de l’essai à la cadence.",
      "Sandwich bread, buns, baguettes, viennoiserie… we work with your R&D and production teams: dosage, machinability, shelf life, texture. Powder mixes, liquid mixes and FOURN’OR premixes fit your diagrams, from the trial to throughput.",
      "خبز التوست، بانز، باغيت، فينوازري… نعمل مع فرق البحث والإنتاج لديكم: الجرعة، قابلية الآلة، مدة الحياة، القوام. خلطات البودرة والسائلة وخلطات FOURN’OR تدخل في مخططاتكم، من التجربة إلى الإيقاع."
    ),
    cta: { href: "/gamme.html", key: "pillars.seeMix" },
  },
  patisserie: {
    image: "/images/mix-liquides.webp?v=4",
    tag: L("Texture, goût, praticité", "Texture, flavour, ease", "قوام، نكهة، سهولة"),
    lead: L(
      "Mix poudres et mix liquides SATIA pour les créations pâtissières et les process qui demandent une texture déjà dosée.",
      "SATIA powder and liquid mixes for pastry creations and processes that need a texture already dosed.",
      "خلطات SATIA البودرة والسائلة لإبداعات الحلويات وللعمليات التي تحتاج قواماً بجرعة جاهزة."
    ),
    text: L(
      "Génoises, garnitures, pâtes jaunes, gâteaux de conservation… SATIA réunit des mélanges déjà dosés et l’ensemble des ingrédients nécessaires. Objectif : simplifier la mise en œuvre, tenir le goût et la texture, de l’atelier artisanal à la ligne.",
      "Sponges, fillings, yellow doughs, long-life cakes… SATIA brings together ready-dosed blends and all the ingredients production needs. The aim: simpler make-up, held flavour and texture, from the craft workshop to the line.",
      "جينواز، حشوات، عجائن صفراء، كعكات حفظ… تجمع SATIA خلطات جاهزة الجرعة وكل المكوّنات اللازمة. الهدف: تبسيط التحضير والحفاظ على الطعم والقوام، من الورشة الحرفية إلى الخط."
    ),
    cta: { href: "/gamme.html?mix=mix-liquides", key: "ad.b.cta" },
  },
  snacking: {
    image: "/images/mix-intro.webp?v=2",
    tag: L("Formats nomades, occasions nouvelles", "On-the-go formats, new occasions", "أشكال متنقّلة، مناسبات جديدة"),
    lead: L(
      "Le snacking demande des produits pratiques, réguliers, adaptés à une consommation individuelle — SATIA formule dans ce sens.",
      "Snacking needs practical, consistent products for individual consumption — SATIA formulates to that brief.",
      "السناكينغ يطلب منتجات عملية ومنتظمة تناسب الاستهلاك الفردي — وتصوغ SATIA في هذا الاتجاه."
    ),
    text: L(
      "Buns, pains plats, viennoiserie de caisse, portions individuelles : nous travaillons texture, fraîcheur et process pour des produits qui tiennent le poste et le transport. Mélanges, ingrédients et emballage sous une seule enseigne.",
      "Buns, flatbreads, counter viennoiserie, individual portions: we work texture, freshness and process for products that hold at the station and in transit. Blends, ingredients and packaging under one name.",
      "بانز، خبز مسطّح، فينوازري الصندوق، حصص فردية: نعمل القوام والطزاجة والعملية لمنتجات تصمد في المنصب والنقل. خلطات ومكوّنات وتعبئة تحت علامة واحدة."
    ),
  },
  agro: {
    image: "/images/maison.webp",
    tag: L("Du concept au produit fini", "From concept to finished product", "من الفكرة إلى المنتج النهائي"),
    lead: L(
      "SATIA accompagne les industriels de l’agroalimentaire dans leurs projets de développement produit et d’optimisation des lignes.",
      "SATIA supports food manufacturers on product development and production-line optimisation.",
      "ترافق SATIA صناعيي الأغذية في تطوير المنتجات وتحسين خطوط الإنتاج."
    ),
    text: L(
      "Lancement de nouvelles références, amélioration de recettes, mise aux normes ou innovation : l’équipe technico-commerciale travaille avec vos équipes R&D et production. Solutions sur mesure, mélanges dosés, ingrédients et emballage — adaptés à vos contraintes industrielles.",
      "New launches, recipe improvement, compliance or innovation: the technical-sales team works with your R&D and production teams. Tailored solutions, dosed blends, ingredients and packaging — fitted to your industrial constraints.",
      "إطلاق مراجع جديدة، تحسين وصفات، مطابقة أو ابتكار: يعمل الفريق التقني-التجاري مع فرق البحث والإنتاج لديكم. حلول مفصّلة وخلطات بجرعة ومكوّنات وتعبئة — تلائم قيودكم الصناعية."
    ),
  },
  autres: {
    image: "/images/gal1.webp",
    tag: L("D’autres industries, le même interlocuteur", "Other industries, the same partner", "صناعات أخرى، المحاور نفسه"),
    lead: L(
      "D’autres industries agroalimentaires s’appuient sur les mélanges et ingrédients SATIA dès qu’une formulation céréalière ou une texture dosée est requise.",
      "Other food industries rely on SATIA blends and ingredients whenever a cereal formulation or a dosed texture is required.",
      "تستند صناعات غذائية أخرى إلى خلطات ومكوّنات SATIA كلما لزم صياغة حبوب أو قوام بجرعة."
    ),
    text: L(
      "Biscuits, pâtes, préparations, produits laitiers… nous n’inventons pas un laboratoire universel : nous mettons un réseau d’approvisionnement, une expertise formulation et un suivi qualité au service de cahiers des charges précis, avec traçabilité et disponibilité.",
      "Biscuits, pasta, preparations, dairy… we do not claim a universal lab: we put a supply network, formulation expertise and quality follow-up behind precise specifications, with traceability and availability.",
      "بسكويت، معكرونة، محضّرات، ألبان… لا ندّعي مختبراً شاملاً: نضع شبكة توريد وخبرة صياغة ومتابعة جودة في خدمة دفاتر شروط دقيقة، مع التتبع والتوفّر."
    ),
  },
  "xp-ingredient": {
    image: "/images/maison.webp",
    tag: L("Toute la matière première", "Every raw material", "كل المواد الأولية"),
    lead: L(
      "SATIA fournit matières premières, mélanges spécifiques et solutions d’emballage, avec qualité et traçabilité.",
      "SATIA supplies raw materials, specific blends and packaging, with quality and traceability.",
      "توفّر SATIA المواد الأولية والخلطات الخاصة وحلول التعبئة، بجودة وتتبع."
    ),
    text: L(
      "Un parcours d’approvisionnement exigeant, puis des solutions ingrédients — poudres, grains, liquides, sans gluten, divers — pour l’industrie, la pâtisserie et la boulangerie.",
      "A demanding supply path, then ingredient solutions — powders, grains, liquids, gluten-free, other — for industry, pastry and bakery.",
      "مسار توريد صارم، ثم حلول مكوّنات — بودرة، حبوب، سوائل، بدون غلوتين، متنوّع — للصناعة والحلويات والمخابز."
    ),
  },
  parcours: {
    image: "/images/mix-poudres.webp?v=4",
    tag: L("Sourcer, qualifier, livrer", "Source, qualify, deliver", "توريد، تأهيل، تسليم"),
    lead: L(
      "Chaque matière première suit un parcours : origine, qualité, formulation, disponibilité — pour entrer dans vos productions en confiance.",
      "Every raw material follows a path: origin, quality, formulation, availability — so it can enter your production with confidence.",
      "كل مادة أولية تسلك مساراً: المنشأ، الجودة، الصياغة، التوفّر — لتدخل إنتاجكم بثقة."
    ),
    text: L(
      "SATIA s’appuie sur un réseau d’approvisionnement et sur des partenaires meuniers de référence, dont Artésienne de Minoterie. Objectif : qualité, traçabilité, prix et performance, du sourcing à la livraison à Soliman.",
      "SATIA works with a supply network and reference milling partners, including Artésienne de Minoterie. The aim: quality, traceability, price and performance, from sourcing to delivery in Soliman.",
      "تعتمد SATIA على شبكة توريد وشركاء مطاحن مرجعيين، منهم Artésienne de Minoterie. الهدف: جودة وتتبع وسعر وأداء، من التوريد إلى التسليم في سليمان."
    ),
    cta: { href: "/partenaires.html", key: "nav.partners" },
  },
  "solutions-ing": {
    image: "/images/mix-intro.webp?v=2",
    tag: L("Poudre, grains, liquide, plus", "Powder, grains, liquid, more", "بودرة، حبوب، سائل، وأكثر"),
    lead: L(
      "Notre offre ingrédients couvre les familles dont vos métiers ont besoin — standard ou sur mesure.",
      "Our ingredient offer covers the families your crafts need — standard or custom.",
      "يغطي عرض المكوّنات العائلات التي تحتاجها مهنكم — معيارياً أو حسب الطلب."
    ),
    text: L(
      "Poudres (prémix, mix, farines), grains et inclusions, mix liquides, études sans gluten, emballage et divers : un seul interlocuteur pour qualifier, doser et livrer. Que vous recherchiez un ingrédient catalogue ou une formulation dédiée, le réseau SATIA garantit suivi et disponibilité.",
      "Powders (premixes, mixes, flours), grains and inclusions, liquid mixes, gluten-free studies, packaging and other: one partner to qualify, dose and deliver. Whether you need a catalogue ingredient or a dedicated formula, the SATIA network guarantees follow-up and availability.",
      "بودرة (خلطات جاهزة وخلطات ودقيق)، حبوب وإضافات، خلطات سائلة، دراسات بدون غلوتين، تعبئة ومتنوّع: محاور واحد للتأهيل والجرعة والتسليم. سواء بحثتم عن مكوّن كتالوج أو صياغة مخصّصة، تضمن شبكة SATIA المتابعة والتوفّر."
    ),
    cta: { href: "/ingredients.html", key: "pillars.seeIng" },
  },
  formulation: {
    image: "/images/expertise.webp",
    tag: L("La synergie des ingrédients", "The synergy of ingredients", "تكامل المكوّنات"),
    lead: L(
      "Au cœur du savoir-faire SATIA : comprendre le rôle de chaque ingrédient et les synergies dans la recette, pour vos process et vos farines.",
      "At the heart of SATIA’s craft: understanding each ingredient’s role and the synergies in the recipe, for your process and your flours.",
      "في صميم خبرة SATIA: فهم دور كل مكوّن والتكامل في الوصفة، لعملياتكم ودقيقكم."
    ),
    text: L(
      "Formulation sur mesure, analyses au fournil, réponses ciblées : l’équipe technico-commerciale SATIA travaille avec vos équipes R&D pour ajuster dosages, combinaisons et contraintes industrielles.",
      "Custom formulation, bakery analyses, targeted answers: SATIA’s technical-sales team works with your R&D teams to adjust dosages, combinations and industrial constraints.",
      "صياغة حسب الطلب، تحاليل في الفرن، إجابات موجّهة: يعمل الفريق التقني-التجاري SATIA مع فرق البحث لديكم لضبط الجرعات والتوليفات والقيود الصناعية."
    ),
  },
  "sur-mesure": {
    image: "/images/expertise.webp",
    tag: L("Diagnostic, conception, contrôle", "Diagnose, design, check", "تشخيص، تصميم، ضبط"),
    lead: L(
      "Après avoir défini votre besoin — application, farine, process, contraintes — nous testons et répétons jusqu’à la formule qui tient votre cahier des charges.",
      "Once your need is defined — application, flour, process, constraints — we test and repeat until the formula holds your specification.",
      "بعد تحديد حاجتكم — التطبيق، الدقيق، العملية، القيود — نجرّب ونكرّر حتى الصيغة التي تفي دفتر شروطكم."
    ),
    text: L(
      "Lancement de références, amélioration de recettes existantes, mise aux normes ou innovation : chaque étape fait l’objet d’un suivi. SATIA préconise la solution la plus adaptée à vos objectifs de marché et à vos lignes.",
      "New launches, existing-recipe improvement, compliance or innovation: each step is followed through. SATIA recommends the solution that best fits your market aims and your lines.",
      "إطلاق مراجع، تحسين وصفات قائمة، مطابقة أو ابتكار: كل مرحلة موضع متابعة. توصي SATIA بالحل الأنسب لأهداف سوقكم وخطوطكم."
    ),
  },
  analyses: {
    image: "/images/fournil.webp",
    tag: L("Le fournil comme laboratoire", "The bakery as laboratory", "الفرن كمختبر"),
    lead: L(
      "Les essais de panification et de pâtisserie au fournil SATIA mesurent ce qui compte : comportement pâte, texture, goût, régularité.",
      "Bread and pastry trials in the SATIA test bakery measure what matters: dough behaviour, texture, flavour, consistency.",
      "تجارب الخبز والحلويات في فرن SATIA تقيس ما يهم: سلوك العجين، القوام، الطعم، الانتظام."
    ),
    text: L(
      "Nous n’affichons pas une batterie d’acronymes de laboratoire : nous faisons des essais selon vos diagrammes, de l’artisanat à la ligne, et nous ajustons. Les boulangers-formateurs commentent le résultat avec vos équipes.",
      "We do not parade a bank of lab acronyms: we run trials to your diagrams, from craft to line, and we adjust. Baker-trainers review the result with your teams.",
      "لا نعرض ترسانة اختصارات مختبرية: نجري تجارب حسب مخططاتكم، من الحرفة إلى الخط، ونضبط. ويعلّق خبّازو التكوين على النتيجة مع فرقكم."
    ),
  },
  reponses: {
    image: "/images/maison.webp",
    tag: L("Vos objectifs, nos leviers", "Your aims, our levers", "أهدافكم، روافعنا"),
    lead: L(
      "Régularité, coût, naturalité, nouvelles textures, adaptation réglementaire : vos impératifs dictent la formule.",
      "Consistency, cost, naturalness, new textures, regulatory fit: your constraints dictate the formula.",
      "انتظام، تكلفة، طبيعية، قوام جديد، ملاءمة تنظيمية: إكراهاتكم تفرض الصيغة."
    ),
    text: L(
      "SATIA formule des mélanges et sélectionne des ingrédients pour répondre à des briefs précis — sans promettre des allégations que nous ne tenons pas. L’accompagnement va de la farine et du prémix jusqu’à l’emballage.",
      "SATIA formulates blends and selects ingredients for precise briefs — without claims we cannot hold. Support runs from flour and premix through to packaging.",
      "تصوغ SATIA خلطات وتختار مكوّنات لملفات دقيقة — دون ادّعاءات لا نقدر عليها. والمرافقة تمتد من الدقيق والخلطة الجاهزة إلى التعبئة."
    ),
  },
  "innovation-hub": {
    image: "/images/mix-intro.webp?v=2",
    tag: L("Veille, idées, collections", "Watch, ideas, collections", "رصد، أفكار، مجموعات"),
    lead: L(
      "SATIA aide à faire évoluer les gammes : nouvelles références FOURN’OR, textures, formats, et lectures de marché pour vos métiers.",
      "SATIA helps ranges evolve: new FOURN’OR references, textures, formats, and market readings for your crafts.",
      "تساعد SATIA على تطوير المجموعات: مراجع FOURN’OR جديدة، قوام، أشكال، وقراءات سوق لمهنكم."
    ),
    text: L(
      "Innovation produit, stratégie d’offre et collections de prémix : trois leviers pour rester aligné avec les attentes — régularité, gourmandise, praticité — sans quitter le fournil.",
      "Product innovation, offer strategy and premix collections: three levers to stay aligned with demand — consistency, indulgence, ease — without leaving the bakery.",
      "ابتكار المنتج واستراتيجية العرض ومجموعات الخلطات الجاهزة: ثلاث روافع للبقاء مع الطلب — انتظام، لذّة، سهولة — دون مغادرة الفرن."
    ),
  },
  innovation: {
    image: "/images/gal2.webp",
    tag: L("Faire émerger le produit suivant", "Bring the next product through", "إبراز المنتج التالي"),
    lead: L(
      "Du sourcing à la caractéristique du produit fini, SATIA cherche l’idée utile : identité, process, gamme, attente consommateur.",
      "From sourcing to the finished product’s character, SATIA looks for the useful idea: identity, process, range, consumer demand.",
      "من التوريد إلى صفة المنتج النهائي، تبحث SATIA عن الفكرة المفيدة: هوية، عملية، مجموعة، طلب المستهلك."
    ),
    text: L(
      "Révéler le potentiel d’une farine, simplifier un diagramme, signer un pain ou une viennoiserie, ouvrir un format snacking : le fournil d’essai et les prémix FOURN’OR servent ces développements, en lien avec vos équipes.",
      "Reveal a flour’s potential, simplify a diagram, sign a loaf or a viennoiserie, open a snacking format: the test bakery and FOURN’OR premixes serve those developments, with your teams.",
      "إبراز إمكان الدقيق، تبسيط مخطط، توقيع خبز أو فينوازري، فتح شكل سناكينغ: يخدم فرن التجربة وخلطات FOURN’OR هذه التطويرات مع فرقكم."
    ),
  },
  marketing: {
    image: "/images/gal1.webp",
    tag: L("Lire le marché, cadrer l’offre", "Read the market, frame the offer", "قراءة السوق، تأطير العرض"),
    lead: L(
      "Nous ne remplaçons pas une agence : nous partageons une lecture métier — artisanat, industrie, pâtisserie, snacking — pour cibler les solutions qui aident vos gammes.",
      "We do not replace an agency: we share a craft reading — artisan, industry, pastry, snacking — to target the solutions that help your ranges.",
      "لسنا بديلاً عن وكالة: نشارك قراءة مهنية — حرفة، صناعة، حلويات، سناكينغ — لاستهداف الحلول التي تساعد مجموعاتكم."
    ),
    text: L(
      "Naturalité, praticité, plaisir, nutrition, régularité : ces axes orientent formulations et collections FOURN’OR. L’équipe SATIA relie le brief marketing au possible au fournil.",
      "Naturalness, ease, pleasure, nutrition, consistency: these axes guide FOURN’OR formulations and collections. The SATIA team links the marketing brief to what the bakery can hold.",
      "طبيعية، سهولة، لذّة، تغذية، انتظام: هذه المحاور توجّه صياغات ومجموعات FOURN’OR. وتربط فرق SATIA ملف التسويق بما يمكن في الفرن."
    ),
  },
  collections: {
    image: "/images/mix-premix.webp?v=4",
    tag: L("Des références pour inspirer la vitrine", "References to inspire the counter", "مراجع لإلهام الواجهة"),
    lead: L(
      "Les prémix FOURN’OR — Banette, Tradition, Complet, Campagne, graines, céréales — forment une collection vivante pour le fournil.",
      "FOURN’OR premixes — Banette, Tradition, Complet, Campagne, seeds, cereals — form a living collection for the bakery.",
      "خلطات FOURN’OR الجاهزة — بانيت، تراديسيون، كامل، كامبان، بذور، حبوب — تشكّل مجموعة حيّة للفرن."
    ),
    text: L(
      "Chaque référence est un point de départ : dosage 2 %, 30 % ou 50 %, usage artisanal ou point chaud. SATIA fait évoluer cette collection avec vous — nouvelles saveurs, nouveaux formats — sans standardiser le goût.",
      "Each reference is a starting point: 2%, 30% or 50% dosage, artisan or bake-off use. SATIA evolves this collection with you — new flavours, new formats — without flattening taste.",
      "كل مرجع نقطة انطلاق: جرعة 2٪ أو 30٪ أو 50٪، استخدام حرفي أو نقطة ساخنة. تطوّر SATIA هذه المجموعة معكم — نكهات وأشكال جديدة — دون تسطيح الطعم."
    ),
    cta: { href: "/gamme.html?mix=premix-poudres", key: "atelier.all" },
  },
  formation: {
    image: "/images/expertise.webp",
    tag: L("Transmettre le geste", "Pass on the craft", "نقل الإيماءة"),
    lead: L(
      "SATIA met à disposition des boulangers-formateurs et démonstrateurs pour former, accompagner et conseiller.",
      "SATIA provides baker-trainers and demonstrators to train, support and advise.",
      "تضع SATIA خبّازين مكوِّنين وعارضين للتكوين والمرافقة والنصح."
    ),
    text: L(
      "Au fournil d’essai de Soliman, les équipes apprennent la mise en œuvre des prémix FOURN’OR et des mélanges SATIA : pétrissage, fermentation, cuisson, régularité. La formation est un levier de l’accompagnement, pas un catalogue de stages figé.",
      "In the Soliman test bakery, teams learn how to run FOURN’OR premixes and SATIA blends: mixing, fermentation, baking, consistency. Training is a support lever, not a frozen course catalogue.",
      "في فرن التجربة بسليمان، تتعلّم الفرق تطبيق خلطات FOURN’OR وخلطات SATIA: عجن، تخمير، خبز، انتظام. التكوين رافعة للمرافقة، لا كتالوج دورات جامد."
    ),
    cta: { href: "/contact.html", key: "cta.btn" },
  },
  services: {
    image: "/images/maison.webp",
    tag: L("Un interlocuteur, toute la chaîne", "One partner, the whole chain", "محاور واحد، السلسلة كلها"),
    lead: L(
      "Solution, mélange, ingrédient : SATIA accompagne du brief à la livraison, avec un suivi technico-commercial.",
      "Solution, blend, ingredient: SATIA supports from brief to delivery, with technical-sales follow-up.",
      "حلّ، خلطة، مكوّن: ترافق SATIA من الملف إلى التسليم، بمتابعة تقنية-تجارية."
    ),
    text: L(
      "Diagnostic, formulation, essais au fournil, formation, logistique et emballage : l’accompagnement s’adapte à l’industriel comme à l’artisan. Un projet à lancer ? Les équipes sont à Soliman, à l’écoute.",
      "Diagnosis, formulation, bakery trials, training, logistics and packaging: support fits industry and craft. A project to launch? Teams are in Soliman, ready to listen.",
      "تشخيص، صياغة، تجارب في الفرن، تكوين، لوجستيك وتعبئة: تتكيّف المرافقة مع الصناعي كما مع الحرفي. مشروع تريدون إطلاقه؟ الفرق في سليمان، على الاستماع."
    ),
    cta: { href: "/contact.html", key: "cta.btn" },
  },
};

export const ingFamilyPages = {
  poudre: {
    image: "/images/mix-poudres.webp?v=4",
    tag: L("Farines, prémix, mix poudres", "Flours, premixes, powder mixes", "دقيق، خلطات جاهزة، خلطات بودرة"),
    lead: L(
      "La famille poudre rassemble farines, prémix FOURN’OR et mix poudres dosés pour le fournil et l’industrie.",
      "The powder family brings together flours, FOURN’OR premixes and powder mixes dosed for bakery and industry.",
      "تجمع عائلة البودرة الدقيق وخلطات FOURN’OR الجاهزة وخلطات البودرة بجرعات للفرن والصناعة."
    ),
    text: L(
      "Que vous travailliez un pain de tradition ou une ligne industrielle, SATIA fournit la matière poudre avec traçabilité — et les formulations qui tiennent votre process.",
      "Whether you run a tradition loaf or an industrial line, SATIA supplies powder materials with traceability — and formulations that hold your process.",
      "سواء عملتم خبز تقاليد أو خطاً صناعياً، توفّر SATIA مادة البودرة مع التتبع — والصياغات التي تصمد لعمليتكم."
    ),
    cta: { href: "/gamme.html?mix=mix-poudres", key: "ad.c.cta" },
  },
  grains: {
    image: "/images/mix-premix.webp?v=4",
    tag: L("Graines, céréales, inclusions", "Seeds, cereals, inclusions", "بذور، حبوب، إضافات"),
    lead: L(
      "Complet, céréales, quinoa, maxi graines… les références FOURN’OR et les ingrédients grains signent pains et viennoiseries de caractère.",
      "Wholemeal, cereals, quinoa, maxi seeds… FOURN’OR references and grain ingredients sign character breads and viennoiserie.",
      "كامل، حبوب، كينوا، بذور ماكسي… مراجع FOURN’OR ومكوّنات الحبوب توقّع خبزاً وفينوازري ذات طابع."
    ),
    text: L(
      "Inclusions, flocons, graines : SATIA sélectionne pour le goût, la texture et la régularité au pétrin, avec le partenaire meunier quand la farine le demande.",
      "Inclusions, flakes, seeds: SATIA selects for flavour, texture and consistency at the mixer, with the milling partner when the flour requires it.",
      "إضافات، رقائق، بذور: تختار SATIA للطعم والقوام والانتظام في العجّانة، مع شريك المطاحن عندما يطلب الدقيق ذلك."
    ),
    cta: { href: "/gamme.html?mix=premix-poudres", key: "ad.a.cta" },
  },
  liquide: {
    image: "/images/mix-liquides.webp?v=4",
    tag: L("La texture, déjà dosée", "Texture, already dosed", "القوام، بجرعة جاهزة"),
    lead: L(
      "Les mix liquides SATIA simplifient le poste pâtisserie et certains process industriels qui demandent une phase liquide maîtrisée.",
      "SATIA liquid mixes simplify the pastry station and industrial processes that need a controlled liquid phase.",
      "تبسّط خلطات SATIA السائلة منصب الحلويات وبعض العمليات الصناعية التي تحتاج طوراً سائلاً مضبوطاً."
    ),
    text: L(
      "Dosage, hygiène de poste, reproductibilité : la famille liquide complète les poudres et les ingrédients bruts, sous la même enseigne.",
      "Dosage, station hygiene, repeatability: the liquid family completes powders and raw ingredients, under the same name.",
      "جرعة، نظافة المنصب، قابلية التكرار: تكمّل عائلة السائل البودرة والمواد الخام، تحت العلامة نفسها."
    ),
    cta: { href: "/gamme.html?mix=mix-liquides", key: "ad.b.cta" },
  },
  "sans-gluten": {
    image: "/images/maison.webp",
    tag: L("Études et formulations dédiées", "Dedicated studies and formulas", "دراسات وصياغات مخصّصة"),
    lead: L(
      "SATIA n’affiche pas une gamme sans gluten catalogue : nous étudions avec vous les formulations possibles, selon votre cahier des charges et vos lignes.",
      "SATIA does not parade a catalogue gluten-free range: we study possible formulations with you, to your specification and your lines.",
      "لا تعرض SATIA مجموعة بدون غلوتين في الكتالوج: ندرس معكم الصياغات الممكنة حسب دفتر شروطكم وخطوطكم."
    ),
    text: L(
      "Allégations, process et risques de contamination croisée demandent un travail sérieux. Parlez-en à l’équipe : R&D, fournil d’essai et sourcing peuvent cadrer un projet, sans promettre ce qui n’est pas encore tenu.",
      "Claims, process and cross-contamination risk need serious work. Talk to the team: R&D, the test bakery and sourcing can frame a project, without promising what is not yet held.",
      "الادّعاءات والعملية ومخاطر التلوث المتبادل تحتاج عملاً جدياً. حدّثوا الفريق: يمكن للبحث وفرن التجربة والتوريد تأطير مشروع، دون وعد بما لم يُنجز بعد."
    ),
    cta: { href: "/contact.html", key: "cta.btn" },
  },
  divers: {
    image: "/images/maison.webp",
    tag: L("Emballage et matières complémentaires", "Packaging and complementary materials", "تعبئة ومواد مكمّلة"),
    lead: L(
      "Au-delà des farines et mélanges, SATIA fournit les solutions d’emballage et d’autres matières premières utiles à vos productions.",
      "Beyond flours and blends, SATIA supplies packaging and other raw materials useful to your production.",
      "إضافة إلى الدقيق والخلطات، توفّر SATIA حلول التعبئة ومواد أولية أخرى تفيد إنتاجكم."
    ),
    text: L(
      "Un seul interlocuteur pour compléter le fournil et la ligne : qualité, traçabilité, disponibilité. Dites-nous le besoin, nous cadrons l’approvisionnement.",
      "One partner to complete the bakery and the line: quality, traceability, availability. Tell us the need, we frame the supply.",
      "محاور واحد لاستكمال الفرن والخط: جودة، تتبع، توفّر. قولوا الحاجة، نؤطّر التوريد."
    ),
    cta: { href: "/contact.html", key: "cta.btn" },
  },
};

export function getXpPage(id) {
  return pages[id] || null;
}

export function getXpTitle(id, lang) {
  return xpNav[id]?.[lang] || xpNav[id]?.fr || id;
}
