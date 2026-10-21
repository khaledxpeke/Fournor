# SATIA — fournor.com

French site for SATIA (Société Tayara Distribution), with English at `/en/` and Arabic at `/ar/`. French URLs stay at the root.

The site lives in `web/` (Astro, static). `cms/` is reserved for Strapi and is not installed yet. Cloudinary settings are empty placeholders in `cms/.env` — paste the cloud name, API key, and API secret there. `UPLOAD_PROVIDER` stays `local` until those values are set. Existing images in `web/public/` are not moved to Cloudinary.

## Run

Node.js 22 (`.nvmrc` at the repo root and in `web/`).

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:4321`. French is the default. The header links go to the same page in FR, EN, or AR.

```bash
npm run build
npm run preview
```

The static build is `web/dist/`.

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

The form posts in the browser to `https://formsubmit.co/ajax/contact@fournor.com`. There is no PHP handler. This phase does not change that.

## Phase

Phase 1.5 renders FR, EN, and AR in the HTML. Strapi is not started.
