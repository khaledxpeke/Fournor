# SATIA — fournor.com

French site for SATIA, with English at `/en/` and Arabic at `/ar/`. French URLs stay at the root.

```
web/    Astro site          http://localhost:4321
cms/    Strapi 5            http://localhost:1337
```

Node.js 24 (`.nvmrc` at the repo root, in `web/`, and in `cms/`).

## Site

```bash
cd web
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

The static build is `web/dist/`.

## CMS

```bash
cd cms
npm install
npm run develop
```

Copy `cms/.env.example` to `cms/.env` if the local file is missing. Cloudinary values stay empty until you paste them; `UPLOAD_PROVIDER` stays `local`. See `cms/README.md` for the startup file, the admin build, and the MariaDB variables.

The local `ADMIN_PASSWORD` and `STRAPI_API_TOKEN` must not be reused in production. Both are regenerated at deployment.

The content model lives in `cms/src`. `npm run seed` in `cms/` loads the French, English, and Arabic entries. Accueil is a single type: open it in the admin and drag a block to change the homepage order. The site reads that content from Strapi at build time.

## Hostinger

One repository, Node.js 24. Hostinger rebuilds from GitHub on push and has no deploy hook, so publishing in Strapi does not rebuild the site by itself.

The public site is a static build. Hostinger publishes `web/dist` into `public_html`, and LiteSpeed serves that directory. The site has no Node application slot and keeps no process in memory. Only cms.fournor.com is a Node application.

The CMS application has automatic deployment **off**. A push would redeploy it and wipe `cms/public/uploads` and the local database file. Redeploy the CMS by hand. The site stays on automatic deployment: the workflow below commits `web/.build-stamp` to the deployed branch, and that push is what rebuilds fournor.com.

There is nothing in the Astro config that requires the repository root. `npm run build` in `web/` writes `web/dist`. Hostinger’s root directory for the site is `web/`, the build command is `npm run build`, and the output directory is `dist`. `web/public/.htaccess` is copied into that output and published with it. The build reads `../cms/.env` only when that file exists beside `web/` (local). On Hostinger it is absent, so the site build needs its own variables.

| | fournor.com | cms.fournor.com |
|---|---|---|
| Root directory | `web/` | `cms/` |
| Node.js | 24, build only | 24, long-running |
| Build | `npm run build` | `npm run build` |
| Output / start | `dist`, published to `public_html` | start `node server.js` (`server.js`) |
| Automatic deployment | on | **off** |

`cms` `npm run build` builds the admin panel. That is the memory peak. Do not also run it from a start command.

### fournor.com

| Variable | Value |
|---|---|
| `PUBLIC_SITE_URL` | `https://fournor.com` |
| `STRAPI_URL` | `https://cms.fournor.com` |
| `STRAPI_API_TOKEN` | Read-only token created on the CMS. Not the local one. |

### cms.fournor.com

| Variable | Value |
|---|---|
| `HOST` | `0.0.0.0` |
| `PUBLIC_URL` | `https://cms.fournor.com` |
| `PROXY` | `true` |
| `APP_KEYS` | Four comma-separated random strings |
| `API_TOKEN_SALT` | Random string |
| `ADMIN_JWT_SECRET` | Random string |
| `TRANSFER_TOKEN_SALT` | Random string |
| `JWT_SECRET` | Random string |
| `ENCRYPTION_KEY` | Random string |
| `ADMIN_EMAIL` | First super-admin, only if that email does not exist yet |
| `ADMIN_PASSWORD` | New password. Not the local one. |
| `DATABASE_CLIENT` | `mysql` |
| `DATABASE_HOST` | MariaDB host |
| `DATABASE_PORT` | `3306` |
| `DATABASE_NAME` | Database name |
| `DATABASE_USERNAME` | Database user |
| `DATABASE_PASSWORD` | Database password |
| `DATABASE_SSL` | `false` unless the host requires it |
| `UPLOAD_PROVIDER` | `cloudinary` |
| `CLOUDINARY_NAME` | Cloudinary cloud name |
| `CLOUDINARY_KEY` | Cloudinary API key |
| `CLOUDINARY_SECRET` | Cloudinary API secret |
| `CLOUDINARY_FOLDER` | `fournor` |
| `WEBHOOK_URL` | `https://api.github.com/repos/OWNER/REPO/dispatches` |
| `WEBHOOK_TOKEN` | GitHub token allowed to send `repository_dispatch` |

Do not set `PORT` on the CMS. The host assigns it. `PUBLIC_URL` must be `https://cms.fournor.com`.

Publishing or unpublishing an entry waits 20 seconds, then posts `event_type: cms-publish` to `WEBHOOK_URL`. `.github/workflows/rebuild-frontend.yml` writes `web/.build-stamp` and pushes it to the deployed branch (`DEPLOY_BRANCH` in the repository variables, otherwise the default branch). The same workflow runs every night at 02:17 UTC so a banner whose `dateDebut` or `dateFin` has passed is included or dropped on the next build without a publish. Leave `WEBHOOK_URL` and `WEBHOOK_TOKEN` empty on a local machine.

## Old URL → new URL

| Old | New |
|---|---|
| `/` and `/index.html` | `/` |
| `/maison.html` | `/maison/` |
| `/solution.html` | `/solution/` |
| `/gamme.html` | `/gamme/` |
| `/gamme.html?mix=premix-poudres` | `/gamme/premix-poudres/` |
| `/gamme.html?mix=mix-poudres` | `/gamme/mix-poudres/` |
| `/gamme.html?mix=mix-graines` | `/gamme/mix-graines/` |
| `/gamme.html?mix=mix-liquides` | `/gamme/mix-liquides/` |
| `/produit.html?id={id}` | `/produit/{id}/` |
| `/expertise.html` | `/expertise/` |
| `/xp.html?id={id}` | `/xp/{id}/` |
| `/ingredients.html` | `/ingredients/` |
| `/ingredients.html?fam={id}` | `/ingredients/{id}/` |
| `/formation.html` | `/formation/` |
| `/partenaires.html` | `/partenaires/` |
| `/actualites.html` | `/actualites/` |
| `/contact.html` | `/contact/` |

English and Arabic use the same path with `/en` or `/ar` in front, for example `/en/gamme/premix-poudres/` and `/ar/produit/tradition/`.

Product ids: `baguette-fournor`, `tradition`, `mix-farine-croissant`, `complet`, `campagne`, `cereales-noir`, `chia-quinoa`, `maxi-graines`, `multigrain`, `mais`.

Expertise ids are every former `xp.html?id=` except `formation` (that page is `/formation/`). Ingredient family ids: `poudre`, `grains`, `liquide`, `sans-gluten`, `divers`.

## Contact form

The form posts in the browser to `https://formsubmit.co/ajax/contact@fournor.com`. There is no PHP handler.

## Environment

`web/.env.example` and `cms/.env.example` list every variable. Real `.env` files are not committed. On Hostinger, set the CMS variables in hPanel. The two apps do not share a `package.json`.
