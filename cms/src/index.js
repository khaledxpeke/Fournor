'use strict';

const fs = require('fs');
const path = require('path');

const LOCALES = [
  { name: 'French (fr)', code: 'fr' },
  { name: 'English (en)', code: 'en' },
  { name: 'Arabic (ar)', code: 'ar' },
];

async function ensureLocales(strapi) {
  const locales = strapi.plugin('i18n').service('locales');
  const current = await locales.find();
  for (const locale of LOCALES) {
    if (!current.some((item) => item.code === locale.code)) {
      await locales.create(locale);
    }
  }
  await locales.setDefaultLocale({ code: 'fr' });
}

async function ensureEditorRole(strapi) {
  const roleService = strapi.service('admin::role');
  let role = await roleService.findOne({ code: 'editeur' });
  if (!role) {
    role = await roleService.create({
      name: 'Éditeur',
      code: 'editeur',
      description:
        'Création, modification, publication et suppression du contenu. Pas de réglages, pas de constructeur de types.',
    });
  }

  const contentActions = strapi
    .service('admin::permission')
    .actionProvider.values()
    .filter((action) => action.section === 'contentTypes');
  const hidden = Object.values(strapi.contentTypes)
    .filter((contentType) => contentType?.pluginOptions?.['content-manager']?.visible === false)
    .map((contentType) => contentType.uid);
  const contentPermissions = strapi.service('admin::content-type').getPermissionsWithNestedFields(contentActions, {
    restrictedSubjects: ['plugin::users-permissions.user', ...hidden],
  });
  const uploadPermissions = [
    'plugin::upload.read',
    'plugin::upload.configure-view',
    'plugin::upload.assets.create',
    'plugin::upload.assets.update',
    'plugin::upload.assets.download',
    'plugin::upload.assets.copy-link',
  ].map((action) => ({ action }));

  await roleService.assignPermissions(role.id, [...contentPermissions, ...uploadPermissions]);
}

async function ensureAdminUser(strapi) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;

  const existing = await strapi.db.query('admin::user').findOne({ where: { email } });
  if (existing) return;

  const superAdmin = await strapi.service('admin::role').getSuperAdmin();
  await strapi.service('admin::user').create({
    firstname: 'SATIA',
    lastname: 'Admin',
    email,
    password,
    isActive: true,
    roles: [superAdmin.id],
  });
}

function rememberToken(strapi, accessKey) {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const current = fs.readFileSync(envPath, 'utf8');
  if (/^STRAPI_API_TOKEN=.+/m.test(current)) return;
  const next = current.replace(/^STRAPI_API_TOKEN=.*$/m, `STRAPI_API_TOKEN=${accessKey}`);
  fs.writeFileSync(envPath, next === current ? `${current.trimEnd()}\nSTRAPI_API_TOKEN=${accessKey}\n` : next);
  strapi.log.info('Read-only API token saved to cms/.env as STRAPI_API_TOKEN.');
}

function contentReadActions(strapi) {
  return Object.values(strapi.contentTypes)
    .filter((contentType) => String(contentType.uid).startsWith('api::'))
    .flatMap((contentType) =>
      contentType.kind === 'singleType'
        ? [`${contentType.uid}.find`]
        : [`${contentType.uid}.find`, `${contentType.uid}.findOne`]
    );
}

async function ensureReadToken(strapi) {
  const service = strapi.service('admin::api-token');
  const permissions = [...contentReadActions(strapi), 'api::produit.produit.searchIndex'];
  const existing = await strapi.db.query('admin::api-token').findOne({ where: { name: 'Astro' } });
  if (!existing) {
    const token = await service.create({
      name: 'Astro',
      description: 'Lecture seule des types de contenu du site.',
      type: 'custom',
      permissions,
      lifespan: null,
    });
    if (token?.accessKey) rememberToken(strapi, token.accessKey);
    return;
  }

  const rows = await strapi.db.query('admin::api-token-permission').findMany({
    where: { token: existing.id },
  });
  const have = new Set(rows.map((row) => row.action));
  for (const action of have) {
    if (!permissions.includes(action)) {
      await strapi.db.query('admin::api-token-permission').delete({
        where: { action, token: existing.id },
      });
    }
  }
  for (const action of permissions) {
    if (!have.has(action)) {
      await strapi.db.query('admin::api-token-permission').create({
        data: { action, token: existing.id },
      });
    }
  }
}

const ENTRY_TITLES = {
  'api::accueil.accueil': 'titre',
  'api::page.page': 'titre',
  'api::produit.produit': 'nom',
  'api::gamme.gamme': 'nom',
  'api::franchise.franchise': 'nom',
  'api::actualite.actualite': 'titre',
  'api::bloc-publicitaire.bloc-publicitaire': 'titre',
  'api::parametres-globaux.parametres-globaux': 'nomSite',
  'api::expertise.expertise': 'titre',
  'api::famille-ingredient.famille-ingredient': 'titre',
};

const LIST_COLUMNS = {
  'api::produit.produit': ['nom', 'gamme'],
  'api::actualite.actualite': ['titre', 'date'],
  'api::bloc-publicitaire.bloc-publicitaire': ['titre', 'emplacement', 'actif'],
};

let publishTimer = null;

function schedulePublishDispatch(strapi) {
  const url = process.env.WEBHOOK_URL;
  const token = process.env.WEBHOOK_TOKEN;
  if (!url || !token) return;

  if (publishTimer) clearTimeout(publishTimer);
  publishTimer = setTimeout(() => {
    publishTimer = null;
    sendPublishDispatch(strapi, url, token).catch((error) => {
      strapi.log.warn(`CMS publish webhook failed: ${error.message}`);
    });
  }, 20000);
  publishTimer.unref?.();
}

async function sendPublishDispatch(strapi, url, token) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      event_type: 'cms-publish',
      client_payload: { source: 'strapi' },
    }),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 180);
    throw new Error(`HTTP ${response.status}${detail ? ` ${detail}` : ''}`);
  }
  strapi.log.info('CMS publish webhook sent.');
}

function watchPublications(strapi) {
  if (!process.env.WEBHOOK_URL || !process.env.WEBHOOK_TOKEN) return;
  strapi.documents.use(async (context, next) => {
    const result = await next();
    if (context.action === 'publish' || context.action === 'unpublish') {
      schedulePublishDispatch(strapi);
    }
    return result;
  });
}

async function ensureContentManagerViews(strapi) {
  const contentTypes = strapi.plugin('content-manager').service('content-types');
  for (const [uid, mainField] of Object.entries(ENTRY_TITLES)) {
    const model = contentTypes.findContentType(uid);
    if (!model?.attributes?.[mainField]) continue;
    const configuration = await contentTypes.findConfiguration(model);
    configuration.settings.mainField = mainField;
    configuration.settings.defaultSortBy = mainField;
    configuration.settings.defaultSortOrder = 'ASC';
    if (LIST_COLUMNS[uid]) {
      configuration.layouts.list = LIST_COLUMNS[uid];
    }
    const gammeLabel = configuration.metadatas?.gamme?.edit;
    if (gammeLabel) gammeLabel.mainField = 'nom';
    await contentTypes.updateConfiguration(model, configuration);
  }
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await ensureLocales(strapi);
    await ensureEditorRole(strapi);
    await ensureAdminUser(strapi);
    await ensureReadToken(strapi);
    await ensureContentManagerViews(strapi);
    watchPublications(strapi);
  },
};
