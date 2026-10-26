# cms.fournor.com

Strapi 5.59, community edition. Local database is SQLite. Production is MariaDB (`DATABASE_CLIENT=mysql`), charset `utf8mb4_unicode_ci`.

## Local

```bash
cd cms
npm install
npm run develop
```

Admin: `http://localhost:1337/admin`. The interface opens in French. The super-admin email and password are in `cms/.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`). That file is not committed.

The local `ADMIN_PASSWORD` and `STRAPI_API_TOKEN` are for this machine only. Generate new values when the CMS is deployed. Do not copy them into hPanel.

`UPLOAD_PROVIDER=local` stores new media in `cms/public/uploads`. Set `UPLOAD_PROVIDER=cloudinary` and fill `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, and `CLOUDINARY_SECRET` to switch. No code change. Files already in `web/public` stay there.

## Production start (do not run the admin build on the server)

Build the admin on a machine with enough memory, then deploy the built project:

```bash
npm run build
```

Hostinger startup file for the CMS: `server.js`. The public site is static and has no startup file.

That file uses the Strapi 5 programmatic API (`createStrapi().start()`), documented at <https://docs.strapi.io/cms/deployment>. `npm start` runs the same file. The host assigns `PORT`; do not set it. `config/server.js` reads `HOST` and `PORT` from the environment. Set `PUBLIC_URL` to `https://cms.fournor.com`. Node.js 24.

Every variable in `.env.example` must be set in hPanel. Do not rely on a `.env` file in production. The root README lists them for both Hostinger apps. Automatic deployment stays off for this app.

`WEBHOOK_URL` and `WEBHOOK_TOKEN` are empty locally. On the server they send a GitHub `repository_dispatch` named `cms-publish` after an entry is published or unpublished. The token is not written into the repository.

Do not enable Strapi cron. Hostinger does not run background workers. The admin does not open an inbound WebSocket.

`public/robots.txt` disallows the CMS host. A `noindex` response header for `cms.fournor.com` is still to be set on the host when it is deployed.

## Content model

Content types from the ZIP are in `src/api` and `src/components`, with two additions: Expertise (menu pages, optional sections, `parentSlug`) and Famille d'ingredient. Notes use the shared component `shared.note`. `parametres-globaux` also has `titreContact` and `introductionContact`, because the provided single type had address and phone but no field for the contact intro.

```bash
npm run seed
```

That loads French, English, and Arabic from the site copy and publishes it. Run it again after a content change in the source files; existing entries are updated by slug. Accueil is the single type to reorder: open it in the admin and drag a block.

Locales `fr` (default), `en`, and `ar` are created on boot. The **Éditeur** role can create, edit, publish, and delete content and media. It cannot open settings or the content-type builder. The API token named Astro is a custom token limited to `find` and `findOne` on the site content types. Its value is written to `STRAPI_API_TOKEN` in `.env` once. Generate a new one for production.
