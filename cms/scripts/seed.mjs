import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { createStrapi } = require('@strapi/strapi');

const cmsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const webSrc = path.resolve(cmsRoot, '..', 'web', 'src');
const seedData = path.resolve(cmsRoot, 'seed-data');
const publicRoot = path.resolve(cmsRoot, '..', 'web', 'public');
process.chdir(cmsRoot);

const { products, events } = await import(pathToFileURL(path.join(seedData, 'products.js')).href);
const { dict } = await import(pathToFileURL(path.join(webSrc, 'i18n.js')).href);
const { absolute, localePath } = await import(pathToFileURL(path.join(webSrc, 'lib', 'locale.js')).href);
const xp = await import(pathToFileURL(path.join(seedData, 'xp-data.js')).href);

const LOCALES = ['fr', 'en', 'ar'];
const XP = 'api::expertise.expertise';
const missingKeys = new Set();
const clipped = [];
const notes = [];

const mediaPublicIds = JSON.parse(fs.readFileSync(path.join(seedData, 'media-public-ids.json'), 'utf8'));
const cloudinary = require('cloudinary').v2;

const MIME = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
};

function text(key, locale) {
  const value = dict[locale]?.[key];
  if (value == null || value === '') {
    missingKeys.add(`${locale}:${key}`);
    return dict.fr?.[key] ?? '';
  }
  return value;
}

function loc(value, locale) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.fr || '';
}

function clip(value, max, label) {
  const clean = (value || '').trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;
  clipped.push(`${label} (${clean.length}>${max})`);
  return undefined;
}

function seo(locale, urlPath, title, description, image) {
  return compact({
    metaTitre: clip(title, 70, `metaTitre ${urlPath} ${locale}`),
    metaDescription: clip(description, 170, `metaDescription ${urlPath} ${locale}`),
    imagePartage: image,
    canonical: absolute(localePath(locale, urlPath)),
    noindex: false,
  });
}

function button(locale, labelKey, href, style = 'primaire') {
  const libelle = text(labelKey, locale);
  if (!libelle || !href) return undefined;
  return { libelle, lien: localePath(locale, href), style, nouvelOnglet: false };
}

function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

function lines(parts) {
  return parts.filter(Boolean).join('\n\n');
}

function fail(label, error) {
  const details = error?.details || error?.message || error;
  console.error(`FAIL ${label}`);
  console.error(typeof details === 'string' ? details : JSON.stringify(details, null, 2));
  throw error;
}

let app;

async function main() {
  app = await createStrapi().load();
  notes.push('Expertise self-relation was tested on one published entry. Publishing the child cleared its slug, so the menu tree uses parentSlug (same slug in fr, en, and ar) instead of a relation.');

  const files = await mediaStore();
  await seedGammes(files);
  await seedProduits(files);
  await seedFamilles(files);
  await seedExpertises(files);
  await seedFranchises(files);
  await seedAds(files);
  await seedParametres(files);
  await seedPages(files);
  await seedAccueil(files);
  await report(files);
}

function parseMeta(file) {
  const raw = file?.provider_metadata;
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }
  return { ...raw };
}

function configureCloudinary() {
  if (cloudinary.config().cloud_name) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
}

function stablePublicId(seedKey) {
  const body = seedKey.replace(/^\//, '').replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9/._-]+/g, '_');
  return `fournor/${body}`;
}

async function findRemote(publicId) {
  configureCloudinary();
  let lastError;
  for (const resource_type of ['image', 'raw', 'video']) {
    try {
      return await cloudinary.api.resource(publicId, { resource_type });
    } catch (error) {
      const code = error?.error?.http_code || error?.http_code;
      if (code === 404) {
        lastError = null;
        continue;
      }
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

async function registerRemote(clean, alt, image) {
  const ext = path.extname(clean).toLowerCase();
  const created = await strapi.db.query('plugin::upload.file').create({
    data: {
    name: path.basename(clean),
    alternativeText: alt || path.basename(clean),
    caption: clean,
    folderPath: '/',
    hash: String(image.public_id).split('/').pop(),
    ext,
    mime: MIME[ext] || 'application/octet-stream',
    size: Number(image.bytes || 0) / 1024,
    width: image.width || null,
    height: image.height || null,
    url: image.secure_url,
    provider: 'cloudinary',
    provider_metadata: {
      public_id: image.public_id,
      resource_type: image.resource_type,
      seedKey: clean,
    },
  },
  });
  return created.id;
}

function mediaStore() {
  const cache = new Map();
  const stats = { reused: 0, uploaded: 0, stamped: 0 };
  let index;
  async function loadIndex() {
    if (index) return index;
    const rows = await strapi.db.query('plugin::upload.file').findMany();
    index = new Map();
    for (const file of rows) {
      const meta = parseMeta(file);
      let key = typeof meta.seedKey === 'string' ? meta.seedKey : '';
      if (!key && typeof file.caption === 'string' && file.caption.split('?')[0].startsWith('/')) {
        key = file.caption.split('?')[0];
        await strapi.db.query('plugin::upload.file').update({
          where: { id: file.id },
          data: { provider_metadata: { ...meta, seedKey: key } },
        });
        stats.stamped += 1;
      }
      if (key && !index.has(key)) index.set(key, file.id);
    }
    return index;
  }
  return {
    stats,
    async id(src, alt = '') {
      if (!src) return undefined;
      const clean = src.split('?')[0];
      if (cache.has(clean)) return cache.get(clean);
      const priorId = (await loadIndex()).get(clean);
      if (priorId) {
        cache.set(clean, priorId);
        stats.reused += 1;
        return priorId;
      }
      const abs = path.join(publicRoot, clean.replace(/^\//, ''));
      if (!fs.existsSync(abs)) throw new Error(`Missing file ${clean}`);
      const knownId = mediaPublicIds[clean];
      const remote = await findRemote(knownId || stablePublicId(clean));
      if (remote) {
        const reusedId = await registerRemote(clean, alt, remote);
        index.set(clean, reusedId);
        cache.set(clean, reusedId);
        stats.reused += 1;
        return reusedId;
      }
      if (knownId) throw new Error(`Cloudinary is missing ${knownId} for ${clean}`);
      const ext = path.extname(clean).toLowerCase();
      const fileData = {
        name: path.basename(clean),
        alternativeText: alt || path.basename(clean),
        caption: clean,
        folderPath: '/',
        hash: stablePublicId(clean).replace(/[^\w]+/g, '_').slice(-80),
        ext,
        mime: MIME[ext] || 'application/octet-stream',
        size: fs.statSync(abs).size / 1024,
        buffer: fs.readFileSync(abs),
      };
      await strapi.plugin('upload').provider.upload(fileData, {
        public_id: stablePublicId(clean),
        overwrite: false,
        unique_filename: false,
        use_filename: false,
        resource_type: 'auto',
      });
      fileData.provider = 'cloudinary';
      fileData.provider_metadata = { ...fileData.provider_metadata, seedKey: clean };
      delete fileData.buffer;
      const created = await strapi.db.query('plugin::upload.file').create({ data: fileData });
      index.set(clean, created.id);
      cache.set(clean, created.id);
      stats.uploaded += 1;
      return created.id;
    },
  };
}

async function save(uid, { slug, filters, fr, localized, single = false }) {
  const docs = strapi.documents(uid);
  const publish = strapi.getModel(uid).options.draftAndPublish !== false;
  const status = publish ? { status: 'published' } : {};
  const lookup = single
    ? { locale: 'fr' }
    : { filters: filters || { slug: { $eq: slug } }, locale: 'fr' };
  const found = await docs.findFirst(lookup);
  const frData = slug ? { ...fr, slug } : fr;
  let documentId;
  try {
    if (!found) {
      const created = await docs.create({ locale: 'fr', ...status, data: frData });
      documentId = created.documentId;
    } else {
      documentId = found.documentId;
      await docs.update({ documentId, locale: 'fr', ...status, data: frData });
    }
    for (const locale of ['en', 'ar']) {
      const data = await localized(locale);
      if (slug) data.slug = slug;
      await docs.update({ documentId, locale, ...status, data });
    }
  } catch (error) {
    fail(`${uid} ${slug || 'single'}`, error);
  }
  return documentId;
}

const GAMMES = [
  ['premix-poudres', 'nav.premix', 'ad.a.lead', '/images/mix-premix.webp', 1],
  ['mix-poudres', 'nav.mixpoudres', 'ad.c.lead', '/images/mix-poudres.webp', 2],
  ['mix-graines', 'nav.mixgraines', 'ad.g.lead', '/images/maxi-graines.jpg', 3],
  ['mix-liquides', 'nav.mixliquides', 'ad.b.lead', '/images/mix-liquides.webp', 4],
];

async function seedGammes(files) {
  const ids = {};
  for (const [slug, nameKey, descKey, image, ordre] of GAMMES) {
    const imageId = await files.id(image, text(nameKey, 'fr'));
    ids[slug] = await save('api::gamme.gamme', {
      slug,
      fr: {
        nom: text(nameKey, 'fr'),
        description: text(descKey, 'fr'),
        image: imageId,
        ordre,
        seo: seo('fr', `/gamme/${slug}/`, `${text(nameKey, 'fr')} — SATIA`, text('meta.desc.gamme', 'fr'), imageId),
      },
      localized: (locale) => ({
        nom: text(nameKey, locale),
        description: text(descKey, locale),
        seo: seo(locale, `/gamme/${slug}/`, `${text(nameKey, locale)} — SATIA`, text('meta.desc.gamme', locale), imageId),
      }),
    });
  }
  const used = new Set(products.map((item) => item.mix));
  for (const [slug] of GAMMES) {
    if (!used.has(slug)) notes.push(`Gamme ${slug} has no product in products.js.`);
  }
  const unknown = [...used].filter((mix) => !ids[mix]);
  if (unknown.length) notes.push(`Products use unknown mix values: ${unknown.join(', ')}`);
  files.gammes = ids;
}

async function seedProduits(files) {
  notes.push('Product family codes are stored on famille for the gamme search index. They are private, so the public API does not return them. dosage is stored as the percentage string (2%, 30%, 50%).');
  for (const [index, product] of products.entries()) {
    const imageId = await files.id(product.image, loc(product.name, 'fr'));
    let sheetId;
    if (product.sheet) {
      const abs = path.join(publicRoot, product.sheet.replace(/^\//, '').split('?')[0]);
      if (fs.existsSync(abs)) sheetId = await files.id(product.sheet, loc(product.name, 'fr'));
      else notes.push(`Missing sheet for ${product.id}: ${product.sheet}`);
    }
    const gammeId = files.gammes[product.mix];
    const dosage = `${product.dosage}%`;
    await save('api::produit.produit', {
      slug: product.id,
      fr: {
        nom: loc(product.name, 'fr'),
        gamme: gammeId,
        dosage,
        chapo: loc(product.promise, 'fr'),
        description: loc(product.composition, 'fr'),
        applications: loc(product.target, 'fr'),
        reference: product.sku,
        poids: product.weight,
        ajout: loc(product.adds, 'fr'),
        profilSensoriel: loc(product.sensory, 'fr'),
        famille: product.family,
        images: imageId ? [imageId] : [],
        ficheTechnique: sheetId,
        miseEnAvant: false,
        ordre: index,
        seo: seo('fr', `/produit/${product.id}/`, `${loc(product.name, 'fr')} — Fourn’Or`, text('meta.desc.produit', 'fr'), imageId),
      },
      localized: (locale) => ({
        nom: loc(product.name, locale),
        dosage,
        chapo: loc(product.promise, locale),
        description: loc(product.composition, locale),
        applications: loc(product.target, locale),
        reference: product.sku,
        poids: product.weight,
        ajout: loc(product.adds, locale),
        profilSensoriel: loc(product.sensory, locale),
        famille: product.family,
        seo: seo(locale, `/produit/${product.id}/`, `${loc(product.name, locale)} — Fourn’Or`, text('meta.desc.produit', locale), imageId),
      }),
    });
  }
}

async function seedFamilles(files) {
  for (const slug of xp.ingFamilies) {
    const page = xp.ingFamilyPages[slug];
    const imageId = await files.id(page.image, loc(xp.xpNav[slug], 'fr'));
    const href = page.cta?.href;
    const key = page.cta?.key;
    await save('api::famille-ingredient.famille-ingredient', {
      slug,
      fr: familyData('fr', slug, page, imageId, href, key),
      localized: (locale) => familyData(locale, slug, page, imageId, href, key),
    });
  }
}

function familyData(locale, slug, page, imageId, href, key) {
  const titre = loc(xp.xpNav[slug], locale);
  const data = {
    titre,
    accroche: loc(page.tag, locale),
    chapo: loc(page.lead, locale),
    texte: loc(page.text, locale),
    bouton: href && key ? button(locale, key, href) : undefined,
    seo: seo(locale, `/ingredients/${slug}/`, `${titre} — SATIA`, loc(page.lead, locale) || text('meta.desc.ingredients', locale), imageId),
  };
  if (locale === 'fr') data.image = imageId;
  return compact(data);
}

async function seedExpertises(files) {
  const parentOf = {};
  const ordered = [];
  for (const node of xp.xpTree) {
    if (xp.xpSlugs.includes(node.id)) ordered.push(node.id);
    for (const child of node.children || []) {
      parentOf[child] = node.id;
      if (xp.xpSlugs.includes(child)) ordered.push(child);
    }
  }
  for (const id of xp.xpSlugs) if (!ordered.includes(id)) ordered.push(id);

  for (const id of ordered) {
    const column = xp.xpTree.some((node) => node.id === id);
    const parentSlug = parentOf[id] || (column ? undefined : "solution");
    await saveExpertise(files, id, ordered.indexOf(id), parentSlug);
  }
}

async function saveExpertise(files, id, ordre, parentSlug) {
  const page = xp.getXpPage(id);
  const imageId = page?.image ? await files.id(page.image, loc(xp.xpNav[id], 'fr')) : undefined;
  const href = page?.cta?.href;
  const key = page?.cta?.key;
  return save(XP, {
    slug: id,
    fr: compact({
      ...expertiseData('fr', id, page, href, key),
      image: imageId,
      ordre,
      parentSlug,
    }),
    localized: (locale) => compact({ ...expertiseData(locale, id, page, href, key), parentSlug }),
  });
}

function expertiseData(locale, id, page, href, key) {
  const titre = loc(xp.xpNav[id], locale);
  const lead = page ? loc(page.lead, locale) : '';
  return compact({
    titre,
    accroche: page ? loc(page.tag, locale) : undefined,
    chapo: lead || undefined,
    texte: page ? loc(page.text, locale) : undefined,
    notes: (page?.notes || []).map((note) => ({
      titre: loc(note.title, locale),
      texte: loc(note.text, locale),
    })),
    bouton: href && key ? button(locale, key, href) : undefined,
    seo: seo(locale, `/xp/${id}/`, `${titre} — SATIA`, lead || text('meta.desc.xp', locale)),
  });
}

async function seedFranchises(files) {
  notes.push('Franchise source data has no street address, phone, opening date, or coordinates. Those fields are empty. The card sentence is the SEO description.');
  for (const event of events) {
    const photo = await files.id(event.image, loc(event.title, 'fr'));
    await save('api::franchise.franchise', {
      slug: event.id,
      fr: {
        nom: loc(event.title, 'fr'),
        ville: loc(event.place, 'fr'),
        photos: photo ? [photo] : [],
        seo: seo('fr', '/actualites/', loc(event.title, 'fr'), loc(event.text, 'fr'), photo),
      },
      localized: (locale) => ({
        nom: loc(event.title, locale),
        ville: loc(event.place, locale),
        seo: seo(locale, '/actualites/', loc(event.title, locale), loc(event.text, locale), photo),
      }),
    });
  }
  notes.push('No Actualité entries: the source has no dated news articles. The homepage news slot is the Actualités récentes block, which stays empty until a real article exists.');
}

const ADS = [
  ['ad.sol.title', '/images/ad-sol.webp', '/solution/', 'accueil-bandeau', 1],
  ['ad.a.title', '/images/ad-home-1.webp', '/gamme/premix-poudres/', 'accueil-grille', 1],
  ['ad.c.title', '/images/ad-home-2.webp', '/gamme/mix-poudres/', 'accueil-grille', 2],
  ['ad.b.title', '/images/ad-home-3.webp', '/gamme/mix-liquides/', 'accueil-grille', 3],
  ['ad.g.title', '/images/maxi-graines.jpg', '/gamme/mix-graines/', 'accueil-grille', 4],
];

async function seedAds(files) {
  for (const [altKey, image, href, emplacement, ordre] of ADS) {
    const imageId = await files.id(image, text(altKey, 'fr'));
    const titre = text(altKey, 'fr');
    await save('api::bloc-publicitaire.bloc-publicitaire', {
      filters: { titre: { $eq: titre }, emplacement: { $eq: emplacement }, ordre: { $eq: ordre } },
      fr: {
        titre,
        image: imageId,
        texteAlternatif: titre,
        lien: localePath('fr', href),
        emplacement,
        ordre,
        actif: true,
      },
      localized: (locale) => ({
        titre,
        image: imageId,
        texteAlternatif: text(altKey, locale),
        lien: localePath(locale, href),
        emplacement,
        ordre,
        actif: true,
      }),
    });
  }
}

async function seedParametres(files) {
  const logo = await files.id('/logo-satia.webp', 'SATIA');
  const favicon = await files.id('/favicon.png', 'SATIA');
  const imageHubExpertise = await files.id('/images/expertise.webp', text('nav.solution', 'fr'));
  const imageHubIngredients = await files.id('/images/maison.webp', text('fournil.kicker', 'fr'));
  const menu = [
    ['nav.home', '/'],
    ['nav.maison', '/maison/'],
    ['nav.solution', '/solution/'],
    ['nav.melanges', '/gamme/'],
    ['nav.ingredients', '/ingredients/'],
    ['nav.formation', '/formation/'],
    ['nav.partners', '/partenaires/'],
    ['nav.news', '/actualites/'],
    ['nav.contact', '/contact/'],
  ];
  const footer = [
    [loc(xp.xpNav.metiers, 'fr'), '/xp/metiers/'],
    [loc(xp.xpNav['xp-ingredient'], 'fr'), '/xp/xp-ingredient/'],
    [loc(xp.xpNav.formulation, 'fr'), '/xp/formulation/'],
  ];
  const social = [
    { reseau: 'facebook', url: 'https://www.facebook.com/profile.php?id=61595196575088' },
    { reseau: 'instagram', url: 'https://www.instagram.com/fournor.officielle?cplk=MTR4dXFkcnMwbGhvZw%3D%3D' },
  ];
  notes.push('Paramètres globaux gained titreContact and introductionContact. The provided single type had address and phone, and no field for the contact intro.');
  notes.push('imageHubExpertise and imageHubIngredients live on Paramètres globaux, next to the logo. The expertise hub and the ingredients index read those fields.');

  await save('api::parametres-globaux.parametres-globaux', {
    single: true,
    fr: {
      nomSite: 'SATIA',
      logo,
      favicon,
      imageHubExpertise,
      imageHubIngredients,
      email: 'contact@fournor.com',
      telephone: '+216 98 692 222',
      adresse: text('footer.address', 'fr'),
      titreContact: text('contact.hero', 'fr'),
      introductionContact: text('contact.lead', 'fr'),
      reseaux: social,
      menuPrincipal: menu.map(([key, href], index) => ({
        libelle: text(key, 'fr'),
        lien: localePath('fr', href),
        ordre: index,
      })),
      menuPiedDePage: footer.map(([label, href], index) => ({
        libelle: label,
        lien: localePath('fr', href),
        ordre: index,
      })),
      seoParDefaut: seo('fr', '/', text('meta.home', 'fr'), text('meta.desc.home', 'fr'), await files.id('/images/banner.webp')),
    },
    localized: (locale) => ({
      nomSite: 'SATIA',
      telephone: '+216 98 692 222',
      adresse: text('footer.address', locale),
      titreContact: text('contact.hero', locale),
      introductionContact: text('contact.lead', locale),
      reseaux: social,
      menuPrincipal: menu.map(([key, href], index) => ({
        libelle: text(key, locale),
        lien: localePath(locale, href),
        ordre: index,
      })),
      menuPiedDePage: [
        [loc(xp.xpNav.metiers, locale), '/xp/metiers/'],
        [loc(xp.xpNav['xp-ingredient'], locale), '/xp/xp-ingredient/'],
        [loc(xp.xpNav.formulation, locale), '/xp/formulation/'],
      ].map(([label, href], index) => ({
        libelle: label,
        lien: localePath(locale, href),
        ordre: index,
      })),
      seoParDefaut: seo(locale, '/', text('meta.home', locale), text('meta.desc.home', locale)),
    }),
  });
}

async function seedPages(files) {
  const logo = await files.id('/logo-satia-clear.webp', 'SATIA');
  const expertise = await files.id('/images/expertise.webp', text('nav.solution', 'fr'));
  const partner = await files.id('/images/partner-artesienne.png', 'Artésienne de Minoterie');
  const pages = [
    ['maison', 'meta.maison', 'meta.desc.maison', '/maison/', (locale) => maison(locale, logo)],
    ['solution', 'meta.solution', 'meta.desc.solution', '/solution/', (locale) => solution(locale)],
    ['formation', 'meta.formation', 'meta.desc.formation', '/formation/', (locale) => formation(locale, expertise)],
    ['partenaires', 'meta.partenaires', 'meta.desc.partenaires', '/partenaires/', (locale) => partenaires(locale, partner)],
  ];
  notes.push('Text-only columns on Présentation, Solution and Formation use the Texte section. The closing contact band stays an Appel à l’action.');
  for (const [slug, titleKey, descKey, urlPath, sectionsFor] of pages) {
    await save('api::page.page', {
      slug,
      fr: {
        titre: text(titleKey, 'fr'),
        sections: await sectionsFor('fr'),
        seo: seo('fr', urlPath, text(titleKey, 'fr'), text(descKey, 'fr')),
      },
      localized: async (locale) => ({
        titre: text(titleKey, locale),
        sections: await sectionsFor(locale),
        seo: seo(locale, urlPath, text(titleKey, locale), text(descKey, locale)),
      }),
    });
  }
}

function maison(locale, logo) {
  return [
    compact({
      __component: 'sections.image-texte',
      image: logo,
      positionImage: 'gauche',
      surtitre: text('page.kicker', locale),
      titre: text('maison.hero', locale),
      chapo: text('maison.lead', locale),
      texte: text('hero.quote', locale),
    }),
    texteBlock(locale, 'sol.hero', lines([text('sol.title', locale), text('sol.lead', locale), text('sol.text', locale)]), 'pillars.seeSol', '/solution/'),
    texteBlock(locale, 'atelier.kicker', lines([text('atelier.title', locale), text('atelier.lead', locale), text('maison.mixExtra', locale)]), 'pillars.seeMix', '/gamme/'),
    texteBlock(locale, 'ing.hero', lines([text('ing.title', locale), text('ing.lead', locale), text('ing.text', locale)]), 'pillars.seeIng', '/ingredients/'),
    band(locale),
  ];
}

function solution(locale) {
  const blocks = [
    texteBlock(locale, 'nav.solution', text('sol.hubLead', locale)),
  ];
  for (const node of xp.xpTree) {
    const page = xp.getXpPage(node.id);
    const kids = (node.children || []).map((id) => loc(xp.xpNav[id], locale));
    blocks.push(texteBlock(
      locale,
      null,
      lines([page ? loc(page.tag, locale) : '', page ? loc(page.lead, locale) : '', kids.join('\n')]),
      'metier.more',
      xp.xpHref(node.id),
      loc(xp.xpNav[node.id], locale),
    ));
  }
  blocks.push(band(locale));
  return blocks;
}

function formation(locale, image) {
  const caps = [
    ['formation.cap1', 'formation.cap1tag', 'formation.cap1obj', 'formation.cap1out'],
    ['formation.cap2', 'formation.cap2tag', 'formation.cap2obj', 'formation.cap2out'],
    ['formation.cap3', 'formation.cap3tag', 'formation.cap3obj', 'formation.cap3out'],
  ];
  return [
    compact({
      __component: 'sections.image-texte',
      image,
      positionImage: 'gauche',
      surtitre: text('page.kicker', locale),
      titre: text('formation.hero', locale),
      chapo: text('formation.tag', locale),
      texte: text('formation.lead', locale),
      bouton: button(locale, 'formation.cta', '/contact/'),
    }),
    ...caps.map(([title, tag, objective, outcome]) => texteBlock(
      locale,
      title,
      lines([text(tag, locale), text('formation.obj', locale), text(objective, locale), text('formation.out', locale), text(outcome, locale)]),
    )),
    texteBlock(locale, 'formation.why', lines([text('formation.why1', locale), text('formation.why2', locale), text('formation.why3', locale)])),
    band(locale),
  ];
}

function partenaires(locale, image) {
  return [
    compact({
      __component: 'sections.image-texte',
      image,
      positionImage: 'gauche',
      surtitre: text('part.kicker', locale),
      titre: text('part.hero', locale),
      chapo: text('part.lead', locale),
      texte: text('part.artesienne', locale),
    }),
  ];
}

function texteBlock(locale, titleKey, texte, buttonKey, href, titleOverride) {
  return compact({
    __component: 'sections.texte',
    titre: titleOverride || (titleKey ? text(titleKey, locale) : undefined),
    texte,
    bouton: buttonKey ? button(locale, buttonKey, href) : undefined,
  });
}

function cta(locale, titleKey, texte, buttonKey, href, titleOverride) {
  return compact({
    __component: 'sections.cta',
    titre: titleOverride || text(titleKey, locale),
    texte,
    bouton: buttonKey ? button(locale, buttonKey, href) : undefined,
  });
}

function band(locale) {
  return cta(locale, 'cta.title', text('cta.text', locale), 'cta.btn', '/contact/');
}

async function seedAccueil(files) {
  const banner = await files.id('/images/banner.webp', text('hero.title', 'fr'));
  const sections = async (locale) => [
    compact({
      __component: 'sections.hero',
      image: banner,
      titre: text('hero.title', locale),
    }),
    {
      __component: 'sections.bandeau-defilant',
      elements: products.map((product) => ({ texte: loc(product.name, locale) })),
      vitesse: 'normale',
    },
    compact({
      __component: 'sections.image-texte',
      image: await files.id('/images/expertise.webp', text('nav.solution', locale)),
      positionImage: 'gauche',
      titre: text('nav.solution', locale),
      chapo: text('maison.titleFit', locale) + text('maison.titleRest', locale),
      texte: text('maison.text', locale),
      bouton: button(locale, 'maison.more', '/solution/'),
    }),
    {
      __component: 'sections.grille-ads',
      titre: text('ad.sol.title', locale),
      emplacement: 'accueil-bandeau',
      nombreMax: 1,
      colonnes: 1,
    },
    compact({
      __component: 'sections.image-texte',
      image: await files.id('/images/mix-intro.webp', text('atelier.kicker', locale)),
      positionImage: 'droite',
      titre: text('atelier.kicker', locale),
      chapo: text('atelier.titleFit', locale) + text('atelier.titleRest', locale),
      texte: text('atelier.lead', locale),
      bouton: button(locale, 'atelier.all', '/gamme/', 'secondaire'),
    }),
    {
      __component: 'sections.liste-produits',
      titre: text('atelier.kicker', locale),
      nombreMax: products.length,
      affichage: 'carrousel',
    },
    {
      __component: 'sections.grille-ads',
      emplacement: 'accueil-grille',
      nombreMax: 4,
      colonnes: 4,
    },
    compact({
      __component: 'sections.image-texte',
      image: await files.id('/images/maison.webp', text('fournil.kicker', locale)),
      positionImage: 'gauche',
      titre: text('fournil.kicker', locale),
      chapo: text('fournil.titleFit', locale) + text('fournil.titleRest', locale),
      texte: text('fournil.text', locale),
      bouton: button(locale, 'fournil.cta', '/ingredients/'),
    }),
    {
      __component: 'sections.actualites-recentes',
      titre: text('news.title', locale),
      nombreMax: 3,
    },
    band(locale),
  ];

  await save('api::accueil.accueil', {
    single: true,
    fr: {
      titre: 'Accueil',
      sections: await sections('fr'),
      seo: seo('fr', '/', text('meta.home', 'fr'), text('meta.desc.home', 'fr'), banner),
    },
    localized: async (locale) => ({
      titre: 'Accueil',
      sections: await sections(locale),
      seo: seo(locale, '/', text('meta.home', locale), text('meta.desc.home', locale), banner),
    }),
  });

  for (const locale of LOCALES) {
    const home = await strapi.documents('api::accueil.accueil').findFirst({
      locale,
      status: 'published',
      populate: ['sections'],
    });
    const order = (home?.sections || []).map((section) => section.__component).join(' > ');
    console.log(`accueil ${locale}: ${order}`);
    if ((home?.sections || []).length !== 10) {
      throw new Error(`Accueil ${locale} has ${home?.sections?.length ?? 0} sections, expected 10`);
    }
  }
}

async function report(files) {
  for (const key of Object.keys(dict.fr || {})) {
    for (const locale of ['en', 'ar']) {
      if (dict[locale]?.[key] == null || dict[locale][key] === '') missingKeys.add(`${locale}:${key}`);
    }
  }
  console.log('--- seed report ---');
  console.log(`media reused: ${files.stats.reused}, uploaded: ${files.stats.uploaded}, seed keys stamped: ${files.stats.stamped}`);
  console.log(`missing EN/AR keys: ${missingKeys.size ? [...missingKeys].sort().join(', ') : 'none'}`);
  console.log(`seo fields left empty because they exceed the schema limit: ${clipped.length ? clipped.join(', ') : 'none'}`);
  for (const line of notes) console.log(line);
}

try {
  await main();
} catch (error) {
  console.error(error?.message || error);
  if (error?.details) console.error(JSON.stringify(error.details, null, 2));
  if (error?.stack) console.error(error.stack);
  process.exitCode = process.exitCode || 1;
} finally {
  if (app) await app.destroy();
}
