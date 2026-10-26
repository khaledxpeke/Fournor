import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { attachmentHref } from "./images.js";

export type Locale = "fr" | "en" | "ar";

const LOCALES: Locale[] = ["fr", "en", "ar"];
const webRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

type Dict = Record<Locale, string>;

export type ProductRecord = {
  id: string;
  sku: string;
  dosage: number;
  family: string;
  mix: string;
  image: string;
  name: Dict;
  promise: Dict;
  sensory: Dict;
  target: Dict;
  adds: Dict;
  weight: string;
  composition: Dict;
  sheet?: string;
};

export type EventRecord = {
  id: string;
  image: string;
  title: Dict;
  place: Dict;
  text: Dict;
};

export type XpPageRecord = {
  image?: string;
  tag?: Dict;
  lead?: Dict;
  text?: Dict;
  notes?: { title: Dict; text: Dict }[];
  cta?: { href: string; label: Dict };
};

export type NavLink = { label: string; href: string };

export type AdRecord = {
  href: string;
  image: string;
  alt: Dict;
  starts?: string;
  ends?: string;
};

function bannerIsLive(ad: { starts?: string; ends?: string }, now = Date.now()) {
  const start = ad.starts ? Date.parse(ad.starts) : NaN;
  const end = ad.ends ? Date.parse(ad.ends) : NaN;
  if (!Number.isNaN(start) && now < start) return false;
  if (!Number.isNaN(end) && now > end) return false;
  return true;
}

export type GammeRecord = {
  slug: string;
  image: string;
  name: Dict;
};

export type SiteCatalog = {
  products: ProductRecord[];
  events: EventRecord[];
  xpTree: { id: string; children: string[] }[];
  xpNav: Record<string, Dict>;
  xpPages: Record<string, XpPageRecord>;
  ingFamilies: string[];
  ingFamilyPages: Record<string, XpPageRecord>;
  pages: { slug: string; titre: Dict; sections: unknown[] }[];
  actualites: { slug: string; titre: Dict; extrait?: Dict; contenu?: Dict; date?: string; image?: string }[];
  home: {
    hero: string;
    solution: string;
    atelier: string;
    fournil: string;
    band: AdRecord[];
    grid: AdRecord[];
  };
  gammes: GammeRecord[];
  pageImages: Record<string, string>;
  navigation: Record<Locale, { main: NavLink[]; footer: NavLink[] }>;
};

function envFile(file: string) {
  if (!fs.existsSync(file)) return {} as Record<string, string>;
  return Object.fromEntries(
    fs
      .readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
      })
  );
}

function config() {
  const cms = envFile(path.join(webRoot, "../cms/.env"));
  const web = envFile(path.join(webRoot, ".env"));
  const token = process.env.STRAPI_API_TOKEN || web.STRAPI_API_TOKEN || cms.STRAPI_API_TOKEN;
  const base = (process.env.STRAPI_URL || web.STRAPI_URL || cms.PUBLIC_URL || "http://127.0.0.1:1337").replace(/\/$/, "");
  if (!token) {
    throw new Error("Strapi is required to build the site. STRAPI_API_TOKEN is missing.");
  }
  return { token, base };
}

async function strapiGet(pathname: string, params: Record<string, string> = {}) {
  const { token, base } = config();
  const url = new URL(pathname, `${base}/`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  let response: Response;
  try {
    response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  } catch (error) {
    throw new Error(`Strapi is unreachable at ${base}. Start it before building the site. (${(error as Error).message})`);
  }
  if (!response.ok) {
    throw new Error(`Strapi ${response.status} for ${pathname}. The site was not built.`);
  }
  if (pathname === "/_health") return null;
  return response.json();
}

async function fetchAll(pathname: string, params: Record<string, string>) {
  const rows: any[] = [];
  let page = 1;
  for (;;) {
    const body = await strapiGet(pathname, {
      ...params,
      "pagination[page]": String(page),
      "pagination[pageSize]": "100",
      status: "published",
    });
    const data = Array.isArray(body.data) ? body.data : [];
    rows.push(...data);
    const pageCount = body.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount) break;
    page += 1;
  }
  return rows;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function mediaUrl(file: any) {
  if (!file) return "";
  const media = Array.isArray(file) ? file[0] : file;
  if (!media) return "";
  const url = text(media.url);
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${config().base}${url}`;
  return url;
}

function entryOf(body: any) {
  if (!body) return {};
  if (body.data && !Array.isArray(body.data)) return body.data;
  return body;
}

function blocksNamed(sections: any[], name: string) {
  return (Array.isArray(sections) ? sections : []).filter((block) => block?.__component === name);
}

function navLinks(list: any[]) {
  return (Array.isArray(list) ? list : [])
    .slice()
    .sort((a, b) => (a?.ordre ?? 0) - (b?.ordre ?? 0))
    .map((item) => ({ label: text(item?.libelle), href: text(item?.lien) }))
    .filter((item) => item.label && item.href);
}

function barePath(lien: string) {
  if (!lien) return "";
  const withSlash = lien.endsWith("/") ? lien : `${lien}/`;
  if (withSlash.startsWith("/en/") || withSlash.startsWith("/ar/")) return withSlash.slice(3);
  return withSlash;
}

function dict(rows: Record<Locale, any>, read: (row: any) => string): Dict {
  return {
    fr: read(rows.fr) || "",
    en: read(rows.en) || read(rows.fr) || "",
    ar: read(rows.ar) || read(rows.fr) || "",
  };
}

function groupByDocument(byLocale: Record<Locale, any[]>) {
  const ids = new Map<string, Record<Locale, any>>();
  for (const locale of LOCALES) {
    for (const row of byLocale[locale]) {
      const id = row.documentId || row.slug;
      if (!ids.has(id)) ids.set(id, { fr: null, en: null, ar: null });
      ids.get(id)![locale] = row;
    }
  }
  return [...ids.values()];
}

async function localizedCollection(pathname: string, params: Record<string, string> = {}) {
  const byLocale = {} as Record<Locale, any[]>;
  for (const locale of LOCALES) {
    byLocale[locale] = await fetchAll(pathname, { ...params, locale });
  }
  return groupByDocument(byLocale);
}

const DZ = [
  "sections.hero",
  "sections.bandeau-defilant",
  "sections.image-texte",
  "sections.grille-ads",
  "sections.liste-produits",
  "sections.actualites-recentes",
  "sections.cta",
  "sections.texte",
];

function sectionPopulate() {
  const params: Record<string, string> = {};
  for (const uid of DZ) params[`populate[sections][on][${uid}][populate]`] = "*";
  return params;
}

function buttonOf(row: any) {
  const bouton = row?.bouton;
  if (!bouton?.lien && !bouton?.libelle) return undefined;
  return bouton;
}

function pageRecord(rows: Record<Locale, any>): XpPageRecord {
  const fr = rows.fr || rows.en || rows.ar || {};
  const record: XpPageRecord = {
    image: mediaUrl(fr.image),
    tag: dict(rows, (row) => text(row?.accroche)),
    lead: dict(rows, (row) => text(row?.chapo)),
    text: dict(rows, (row) => text(row?.texte)),
  };
  const notes = fr.notes || [];
  if (notes.length) {
    record.notes = notes.map((_: unknown, index: number) => ({
      title: dict(rows, (row) => text(row?.notes?.[index]?.titre)),
      text: dict(rows, (row) => text(row?.notes?.[index]?.texte)),
    }));
  }
  const href = barePath(text(buttonOf(fr)?.lien));
  if (href) {
    record.cta = {
      href,
      label: dict(rows, (row) => text(buttonOf(row)?.libelle)),
    };
  }
  return record;
}

export function getProduits() {
  return localizedCollection("/api/produits", {
    "populate[images]": "true",
    "populate[ficheTechnique]": "true",
    "populate[gamme][fields][0]": "slug",
    "sort[0]": "ordre:asc",
  });
}

export function getIndexRecherche() {
  return strapiGet("/api/produits/index-recherche");
}

export function getGammes() {
  return localizedCollection("/api/gammes", { "populate[image]": "true", "sort[0]": "ordre:asc" });
}

export function getFranchises() {
  return localizedCollection("/api/franchises", { "populate[photos]": "true", "populate[seo]": "true" });
}

export function getExpertises() {
  return localizedCollection("/api/expertises", {
    "populate[image]": "true",
    "populate[notes]": "true",
    "populate[bouton]": "true",
    "sort[0]": "ordre:asc",
  });
}

export function getPages() {
  return localizedCollection("/api/pages", { ...sectionPopulate(), "sort[0]": "slug:asc" });
}

export function getActualites() {
  return localizedCollection("/api/actualites", {
    "populate[image]": "true",
    "populate[seo]": "true",
    "sort[0]": "date:desc",
  });
}

export function getFamillesIngredient() {
  return localizedCollection("/api/famille-ingredients", {
    "populate[image]": "true",
    "populate[bouton]": "true",
  });
}

export function getAccueil(locale: Locale = "fr") {
  return strapiGet("/api/accueil", { locale, status: "published", ...sectionPopulate() });
}

export function getParametres(locale: Locale = "fr") {
  return strapiGet("/api/parametres-globaux", {
    locale,
    "populate[menuPrincipal]": "true",
    "populate[menuPiedDePage]": "true",
    "populate[imageHubExpertise]": "true",
    "populate[imageHubIngredients]": "true",
  });
}

export function getBlocs() {
  return localizedCollection("/api/blocs-publicitaires", {
    "populate[image]": "true",
    "filters[actif][$eq]": "true",
    "sort[0]": "ordre:asc",
  });
}

async function loadNavigation() {
  const navigation = {} as SiteCatalog["navigation"];
  let imageHubExpertise = "";
  let imageHubIngredients = "";
  for (const locale of LOCALES) {
    const data = entryOf(await getParametres(locale));
    if (locale === "fr") {
      imageHubExpertise = mediaUrl(data.imageHubExpertise);
      imageHubIngredients = mediaUrl(data.imageHubIngredients);
    }
    navigation[locale] = {
      main: navLinks(data.menuPrincipal),
      footer: navLinks(data.menuPiedDePage),
    };
  }
  return { navigation, imageHubExpertise, imageHubIngredients };
}

export async function loadSiteCatalog(): Promise<SiteCatalog> {
  const { base } = config();
  try {
    await strapiGet("/_health");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      message.includes("Strapi") ? message : `Strapi is unreachable at ${base}. Start it before building the site.`
    );
  }

  const [productRows, families, franchiseRows, expertiseRows, pageRows, newsRows, gammeRows, adRows, accueilBody, settings] =
    await Promise.all([
      getProduits(),
      getIndexRecherche(),
      getFranchises(),
      getExpertises(),
      getPages(),
      getActualites(),
      getGammes(),
      getBlocs(),
      getAccueil("fr"),
      loadNavigation(),
    ]);
  const navigation = settings.navigation;

  const familleBySlug = new Map<string, string>(
    (families.data || []).map((row: { slug: string; famille: string }) => [row.slug, row.famille || ""])
  );

  const products: ProductRecord[] = productRows
    .map((rows) => {
      const fr = rows.fr || {};
      const id = text(fr.slug);
      const dosage = Number.parseInt(text(fr.dosage), 10) || 0;
      return {
        id,
        sku: text(fr.reference),
        dosage,
        family: familleBySlug.get(id) || "",
        mix: text(fr.gamme?.slug),
        image: mediaUrl(fr.images),
        name: dict(rows, (row) => text(row?.nom)),
        promise: dict(rows, (row) => text(row?.chapo)),
        sensory: dict(rows, (row) => text(row?.profilSensoriel)),
        target: dict(rows, (row) => text(row?.applications)),
        adds: dict(rows, (row) => text(row?.ajout)),
        weight: text(fr.poids),
        composition: dict(rows, (row) => text(row?.description)),
        sheet: attachmentHref(mediaUrl(fr.ficheTechnique), `fiche-technique-${id}`) || undefined,
      };
    })
    .filter((product) => product.id);

  products.sort((a, b) => {
    const left = productRows.findIndex((rows) => rows.fr?.slug === a.id);
    const right = productRows.findIndex((rows) => rows.fr?.slug === b.id);
    return left - right;
  });

  const events: EventRecord[] = franchiseRows
    .slice()
    .sort((a, b) => String(a.fr?.createdAt || a.fr?.slug || "").localeCompare(String(b.fr?.createdAt || b.fr?.slug || "")))
    .map((rows) => {
    const fr = rows.fr || {};
    const image = mediaUrl(fr.photos);
    return {
      id: text(fr.slug),
      image,
      title: dict(rows, (row) => text(row?.nom)),
      place: dict(rows, (row) => text(row?.ville)),
      text: dict(rows, (row) => text(row?.seo?.metaDescription)),
    };
  });

  const expertises = expertiseRows
    .map((rows) => ({ rows, fr: rows.fr || {} }))
    .filter((entry) => entry.fr.slug)
    .sort((a, b) => (a.fr.ordre ?? 0) - (b.fr.ordre ?? 0));

  const xpNav: Record<string, Dict> = {};
  const xpPages: Record<string, XpPageRecord> = {};
  for (const entry of expertises) {
    xpNav[entry.fr.slug] = dict(entry.rows, (row) => text(row?.titre));
    xpPages[entry.fr.slug] = pageRecord(entry.rows);
  }

  const children = new Map<string, string[]>();
  const roots: string[] = [];
  for (const entry of expertises) {
    const parent = text(entry.fr.parentSlug);
    if (!parent) roots.push(entry.fr.slug);
    else {
      if (!children.has(parent)) children.set(parent, []);
      children.get(parent)!.push(entry.fr.slug);
    }
  }
  const xpTree = roots.map((id) => ({ id, children: children.get(id) || [] }));

  const familyRows = await getFamillesIngredient();
  const order = ["poudre", "grains", "liquide", "sans-gluten", "divers"];
  familyRows.sort((a, b) => {
    const rank = (slug: string) => {
      const index = order.indexOf(slug);
      return index < 0 ? order.length : index;
    };
    return rank(a.fr?.slug) - rank(b.fr?.slug);
  });
  const ingFamilies = familyRows.map((rows) => text(rows.fr?.slug)).filter(Boolean);
  const ingFamilyPages: Record<string, XpPageRecord> = {};
  for (const rows of familyRows) {
    const slug = text(rows.fr?.slug);
    if (!slug) continue;
    xpNav[slug] = dict(rows, (row) => text(row?.titre));
    ingFamilyPages[slug] = pageRecord(rows);
  }

  const accueil = entryOf(accueilBody);
  const accueilSections = accueil.sections || [];
  const imageText = blocksNamed(accueilSections, "sections.image-texte");
  const home = {
    hero: mediaUrl(blocksNamed(accueilSections, "sections.hero")[0]?.image),
    solution: mediaUrl(imageText[0]?.image),
    atelier: mediaUrl(imageText[1]?.image),
    fournil: mediaUrl(imageText[2]?.image),
    band: [] as AdRecord[],
    grid: [] as AdRecord[],
  };
  if (!home.hero) {
    throw new Error("Accueil hero image is missing from Strapi. The site was not built.");
  }

  const ads = adRows
    .map((rows) => {
      const fr = rows.fr || {};
      return {
        href: barePath(text(fr.lien)) || "/",
        image: mediaUrl(fr.image),
        alt: dict(rows, (row) => text(row?.texteAlternatif)),
        emplacement: text(fr.emplacement),
        ordre: Number(fr.ordre) || 0,
        starts: text(fr.dateDebut),
        ends: text(fr.dateFin),
      };
    })
    .filter((ad) => ad.image && bannerIsLive(ad))
    .sort((a, b) => a.ordre - b.ordre)
    .map(({ href, image, alt, emplacement }) => ({ href, image, alt, emplacement }));
  home.band = ads.filter((ad) => ad.emplacement === "accueil-bandeau");
  home.grid = ads.filter((ad) => ad.emplacement === "accueil-grille");

  const pageImages: Record<string, string> = {};
  for (const rows of pageRows) {
    const slug = text(rows.fr?.slug);
    if (!slug) continue;
    const block = (rows.fr?.sections || []).find((section: any) => section?.image);
    const image = mediaUrl(block?.image);
    if (image) pageImages[slug] = image;
  }
  pageImages.expertise = settings.imageHubExpertise;
  pageImages.ingredients = settings.imageHubIngredients;
  if (!pageImages.expertise || !pageImages.ingredients) {
    throw new Error("Paramètres globaux is missing imageHubExpertise or imageHubIngredients.");
  }

  const gammes = gammeRows
    .map((rows) => ({
      slug: text(rows.fr?.slug),
      image: mediaUrl(rows.fr?.image),
      name: dict(rows, (row) => text(row?.nom)),
      ordre: Number(rows.fr?.ordre) || 0,
    }))
    .filter((gamme) => gamme.slug)
    .sort((a, b) => a.ordre - b.ordre)
    .map(({ slug, image, name }) => ({ slug, image, name }));

  return {
    products,
    events,
    xpTree,
    xpNav,
    xpPages,
    ingFamilies,
    ingFamilyPages,
    pages: pageRows.map((rows) => ({
      slug: text(rows.fr?.slug),
      titre: dict(rows, (row) => text(row?.titre)),
      sections: rows.fr?.sections || [],
    })),
    actualites: newsRows
      .filter((rows) => rows.fr?.slug)
      .map((rows) => ({
        slug: text(rows.fr?.slug),
        titre: dict(rows, (row) => text(row?.titre)),
        extrait: dict(rows, (row) => text(row?.extrait)),
        contenu: dict(rows, (row) => text(row?.contenu)),
        date: text(rows.fr?.date),
        image: mediaUrl(rows.fr?.image),
      })),
    home,
    gammes,
    pageImages,
    navigation,
  };
}

export function catalogModule(catalog: SiteCatalog) {
  return `export const products = ${JSON.stringify(catalog.products)};
export const events = ${JSON.stringify(catalog.events)};
export const xpTree = ${JSON.stringify(catalog.xpTree)};
export const xpNav = ${JSON.stringify(catalog.xpNav)};
export const xpPages = ${JSON.stringify(catalog.xpPages)};
export const ingFamilies = ${JSON.stringify(catalog.ingFamilies)};
export const ingFamilyPages = ${JSON.stringify(catalog.ingFamilyPages)};
export const cmsPages = ${JSON.stringify(catalog.pages)};
export const actualites = ${JSON.stringify(catalog.actualites)};
export const home = ${JSON.stringify(catalog.home)};
export const gammes = ${JSON.stringify(catalog.gammes)};
export const pageImages = ${JSON.stringify(catalog.pageImages)};
export const navigation = ${JSON.stringify(catalog.navigation)};
export function getProduct(id) {
  return products.find((item) => item.id === id) || products[0];
}
export function getXpPage(id) {
  return xpPages[id] || null;
}
export function getXpTitle(id, lang) {
  return xpNav[id]?.[lang] || xpNav[id]?.fr || id;
}
export const xpHref = (id) => (id === "formation" ? "/formation/" : \`/xp/\${id}/\`);
export const ingHref = (id) => \`/ingredients/\${id}/\`;
export const xpSlugs = Object.keys(xpPages).filter((id) => id !== "formation");
export const ingSlugs = Object.keys(ingFamilyPages);
`;
}
