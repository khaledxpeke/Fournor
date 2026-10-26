# Deploying FOURNOR

Hostinger shared hosting does not accept inbound WebSockets. Strapi's `strapi transfer` opens a WebSocket, so it cannot move content onto the server. There is no shell on the server either. Content moves as a MariaDB dump imported through phpMyAdmin. Local MariaDB is 11.8.9, the same series as production.

Do not commit the dump. It contains the super-admin password hash and the API token hash.

## Content migration

### 1. Create the empty production database

In phpMyAdmin, create the database before importing. Collation `utf8mb4_unicode_ci`, character set `utf8mb4`. The dump does not contain `CREATE DATABASE` or `USE`, so the import lands in whichever database you have selected.

### 2. Export `fournor_test`

Run this from `cms/` on the machine that holds the MariaDB copy. `--password` prompts; do not put the password in the command or in a file you commit. `--result-file` avoids PowerShell turning the dump into UTF-16.

```
"C:\Program Files\MariaDB 11.8\bin\mysqldump.exe" --host=127.0.0.1 --port=3306 --user=fournor --password --default-character-set=utf8mb4 --single-transaction --skip-lock-tables --no-tablespaces --hex-blob --ignore-table=fournor_test.strapi_sessions --result-file=fournor_test.sql fournor_test
```

`--single-transaction` is the consistent InnoDB snapshot. Sessions are left out on purpose.

Gzip it. phpMyAdmin imports `.sql.gz` directly. This rehearsal's dump was 939,696 bytes, and the gzip was 113,353 bytes.

```
node -e "const fs=require('fs');const z=require('zlib');fs.writeFileSync('fournor_test.sql.gz', z.gzipSync(fs.readFileSync('fournor_test.sql')))"
```

Delete `fournor_test.sql` and `fournor_test.sql.gz` from the project directory after the import. Both are gitignored.

### 3. Import through phpMyAdmin

Select the empty production database, then Import, and choose `fournor_test.sql.gz`.

If phpMyAdmin rejects the file, the limit is PHP's upload size, not MariaDB. In hPanel open the site's PHP configuration and raise `upload_max_filesize` and `post_max_size` above the gzip size, then import again. The current dump is about 111 KB, so this should not come up. Do not switch the import onto `fournor_test` on the laptop; that database is the source.

### 4. Tables that carry secrets

The dump includes these tables:

| Table | What it carries |
|---|---|
| `admin_users` | Super-admin password hash |
| `admin_users_roles_lnk` | That user's role |
| `strapi_api_tokens` | Read-only token hash (name `Astro`) |
| `strapi_api_token_permissions` | What that token can read |
| `strapi_api_token_permissions_token_lnk` | Permission link |
| `strapi_api_tokens_admin_user_owner_lnk` | Token owner |
| `strapi_transfer_tokens` | Transfer-token hash, if one exists |
| `strapi_transfer_token_permissions` | Transfer-token permissions |
| `strapi_transfer_token_permissions_token_lnk` | Transfer-token permission link |

`strapi transfer` is not used. Delete any transfer-token rows after import. Do not reuse the local admin password or the local API token on the server.

Immediately after the first successful start:

1. Open `https://cms.fournor.com/admin` and change the super-admin password.
2. Settings → API Tokens. Delete the token named `Astro`. Create a new read-only token with `find` on every content type, `findOne` on collection types only, and `api::produit.produit.searchIndex`. Single types have no `findOne`. Put the new value in the **site** app's `STRAPI_API_TOKEN`.
3. Call `https://cms.fournor.com/api/produits?locale=fr` with the old token. It must return 401. The same call with the new token must return 200.

The local rehearsal did this against the imported copy: the imported token returned 200, and after those four `strapi_api_token*` tables were emptied it returned 401. The source database on port 1337 still returned 200.

### 5. Order

1. Create the empty production database (`utf8mb4` / `utf8mb4_unicode_ci`).
2. Import the dump into that database. Do not start Strapi against an empty database first: it would create its own schema and the import would then collide.
3. Set the CMS app's environment (see below). Do not set `PORT`.
4. Start Strapi with `node server.js`.
5. Confirm the log does not say `migrating`. The dump already contains `strapi_database_schema` and `strapi_migrations_internal`. On the rehearsal those were 1 row and 9 rows, `strapi_migrations` itself was empty, and the process started in about 2 seconds with no migration lines and no "table already exists" error.
6. Rotate the admin password and the API token, then check 401 as above.

### 6. Verification checklist

Counts from `fournor_test`, matched by the imported database before anything else was changed:

| Content | fr | en | ar |
|---|---:|---:|---:|
| Accueil | 2 | 2 | 2 |
| Produits | 20 | 20 | 20 |
| Expertises | 40 | 40 | 40 |
| Gammes | 8 | 8 | 8 |
| Familles d'ingrédients | 10 | 10 | 10 |
| Pages | 8 | 8 | 8 |
| Blocs publicitaires | 10 | 10 | 10 |
| Franchises | 6 | 6 | 6 |
| Paramètres globaux | 1 | 1 | 1 |
| Actualités | 0 | 0 | 0 |

- Locales present: `ar`, `en`, `fr`.
- Media: 39 rows, all `provider = cloudinary`, all URLs on `res.cloudinary.com`. None point at `/uploads/`.
- Every content table had the same row count as `fournor_test`. `strapi_sessions` is the only table intentionally absent.
- Frontend build against the import: 148 pages, byte-identical to the build against `fournor_test`, including the Accueil dynamic-zone order.

The laptop account `fournor` cannot `CREATE DATABASE`. The rehearsal therefore dropped the 81 tables in the already-granted `fournor_transfer` and imported there. Production still starts from a database you create in phpMyAdmin.

## Server environment

Node.js 24 for both projects (`engines` and `.nvmrc`). The CMS application runs on 24. The site build also runs on 24, then only the built files stay on the server.

The public site uses no Node application slot and no resident memory. Hostinger detects it as a static build and publishes `dist/` into `public_html`. LiteSpeed serves that directory. Only the CMS is a long-running Node application.

`PUBLIC_URL` must be set on the CMS application to `https://cms.fournor.com`. The startup banner prints `PUBLIC_URL`, not the port it bound. A local check with `PORT=4000` listened on 4000 while the banner still said `http://localhost:1337`, because that was `PUBLIC_URL`.

Do not set `PORT`. The host assigns it for the CMS.

`NODE_ENV=production` needs the admin build (`npm run build` in `cms/`) already done. That build is `cms/build`, 334 files, about 12 MB. Try that build on the server first. The fallback is the next section.

## Admin build fallback

`npm run build` in `cms/` is `strapi build`. It is the memory-heavy step on the 3 GB account. Leave the CMS build command as `npm run build` until that path fails.

A failure is a **Build failed** row under Deployments. The log stops during "Building admin panel", often because the process was killed. The previous CMS deployment stays current.

Then:

1. On this machine, with Node 24, from `cms/`: `npm run build`. That refreshes `cms/build/`.
2. Remove the `cms/build` line from `.gitignore`.
3. Commit `cms/build/` and push. Leave `cms/.env`, `node_modules`, and any SQL dump uncommitted.
4. In the CMS deployment settings, clear the build command and save. Hostinger already runs dependency installation before the build command. An empty build command means the install is the whole build phase. Redeploy the CMS by hand. Automatic deployment for the CMS stays off, so the push does not redeploy it.
5. Leave the entry file as `server.js` and leave the output directory empty. `cms/build` is the admin panel Strapi reads at startup. Hostinger's output directory is the folder it publishes as a static site. Set that field to `build` and the admin files are what gets published.

What else changes:

- The start command stays `node server.js`. `NODE_ENV=production` stays. Strapi serves the committed admin and does not build it on start.
- A change under `cms/src/admin`, or a Strapi upgrade, needs a new local `npm run build` and a new commit of `cms/build`. The server will not rebuild that folder while the build command is empty.
- Build it on Node 24, as above. The admin bundle talks to the host it is served from. Do not set `STRAPI_ADMIN_BACKEND_URL` for that build.
- The same push rebuilds fournor.com when it lands on the branch that site deploys. The CMS updates only on the manual redeploy.
- Those 334 files are the same set `strapi build` would have written on the server. The CMS inode count stays in the same range.
- Returning to the server build is the reverse: put `cms/build` back in `.gitignore`, set the build command back to `npm run build`, and redeploy the CMS by hand.

## Inodes

Only the CMS installs `node_modules` as a long-lived deployment. After `npm run build`, `cms/` was 69,887 files and 598 MB. `node_modules` was 69,453 of those files. Hostinger runs `npm install` for the CMS, so that application lands near 70,000 inodes. The account allowance is 600,000.

The public site does not keep a `node_modules` tree. What reaches `public_html` is the built files in `dist/`. Check the account-wide count in hPanel before deploying.

## MariaDB code changes

Two changes were required before Strapi would boot on MariaDB. Both are in the tree:

- `cms/config/database.js` does not send a charset or a collation. MariaDB rejects `CHARACTER SET utf8mb4_unicode_ci` (that string is a collation), and `mysql2` rejects a `collate` option. The database must be created as `utf8mb4` / `utf8mb4_unicode_ci`. Tables then inherit it. A first boot also prints one Knex warning per table, `Transaction was implicitly committed, do not mix transactions and DDL with MySQL (#805)`. The tables still commit. Later restarts do not repeat the warning.
- `cms/src/index.js` gives single types (`Accueil`, `Paramètres globaux`) `find` only. Collection types still get `find` and `findOne`. A fresh database refused to create the read-only token when the single types were given `findOne`.

## Old URLs

Hostinger confirmed the serving model. LiteSpeed serves `public_html`. The site is a static deployment: `dist/` is published there and does not run as a Node process. `.htaccess` is honoured in `public_html`. `public_html` is replaced on each successful deployment, so the file has to be part of the build output.

`web/public/.htaccess` is the only redirect mechanism. Astro copies it to the root of `dist/` on every build, and that copy is what reaches `public_html`.

After the site is deployed, from `web/`:

```
node scripts/test-redirects.mjs https://www.fournor.com
```

All 52 old URLs must return 301 to the path the script expects, including `?mix=`, `?id=`, and `?fam=`. This is the definitive check. It has not been run against a real web server. If `www` only forwards to `https://fournor.com` and the 301 you see is that forward, run the same command against `https://fournor.com`.

## Rollback

Hostinger keeps no previous build you can switch back to. Each successful deploy writes `hbuilds/versions/{build-id}` and points `current` at it. The file-structure doc (23 September 2026) says older versions are then removed. A failed build does not move `current`. Their support article says the previous version stays live. Restoring an older version means a new deploy that succeeds.

### CMS deploy fails

Read Deployments before changing anything.

**Build failed.** The previous CMS process is still the live one. Put back the settings this attempt changed (build command, Node version, environment variables). Leave the database alone. A failed build does not change MariaDB.

**Build succeeded, then `node server.js` crashes.** That deploy is current, and the previous CMS files are already gone. Read the runtime log. The usual missing values are `PUBLIC_URL`, the `DATABASE_*` variables, and the secrets in the server-environment table. `PORT` stays unset. Fix those and restart. If the code itself is the problem, revert that commit and redeploy the CMS by hand.

Stop the CMS application in the dashboard before a drop or a re-import. A running process can recreate tables during the import.

fournor.com is a separate application. A CMS failure leaves it where it was.

### Frontend build fails after the branch is live

**Build failed.** `public_html` is still the last successful publish. Hostinger builds into a new `hbuilds/versions/{build-id}` folder and syncs `public_html` from the live build only after success. Confirm the failed row is not marked Current. Revert the bad commit on the branch the site deploys, and push. The site changes only when a later build succeeds.

**Build succeeded, and the new site is wrong.** `public_html` has been replaced. Push a revert of that commit to the same branch and wait for a successful deployment. That publishes the previous site from git.

The HTML site that was on fournor.com before the first successful publish is not in git. Download `public_html`, or take an hPanel backup, before that first success. Restoring the pre-cutover site is a restore of that backup.

One case is not in the docs. They describe `public_html` once this deployment layout is in use. They do not say whether a failed first build touches a `public_html` that still holds the current site. Ask Hostinger that, if the existing site has to survive a failed first deploy.

### Redirects wrong after cutover

Edit `web/public/.htaccess`, commit, and push to the branch the site deploys. That is the fix that is still there after the next deploy. An edit made in File Manager is overwritten on the next successful publish. When Deployments shows that build as Current, run:

```
node scripts/test-redirects.mjs https://www.fournor.com
```

### Content import wrong

The dump drops each table before it creates it (`mysqldump` writes `DROP TABLE IF EXISTS` unless told not to). Importing it again into the same database replaces the tables.

1. Stop the CMS application.
2. In phpMyAdmin, select the production database. The dump has no `USE` statement, so the selected database is the one that changes.
3. Import `fournor_test.sql.gz` again.
4. Check the verification counts, the locales `ar`, `en`, and `fr`, the 39 Cloudinary rows, and the Accueil section order.
5. Start the CMS. The log must not say `migrating`.
6. The dump puts the local super-admin password hash and the local API token hash back. Change the password again, delete the token named `Astro`, create a new read-only token, and store it in the site's `STRAPI_API_TOKEN`. Confirm the old token returns 401. Redeploy the site after that, so the site build uses the new token.

If the import stops halfway, import the same file again from the start, with the production database selected. If it landed in the wrong database, drop the tables it created there and repeat with the right one selected. Leave `fournor_test` untouched. Leave Strapi stopped until the import has finished.

## Media

`cms/seed-data/media-public-ids.json` maps each seed path to the Cloudinary public id that `fournor_test` uses. A seed whose media library is empty looks those ids up and registers them. It does not upload a third copy. A known id that is missing on Cloudinary stops the seed instead of uploading. A path that is not in the map uploads once under a stable public id, `fournor/` plus the file path, and the next fresh seed finds that id.

Keep the `fournor_test` set. Those are the public ids in `cms/seed-data/media-public-ids.json`, and they are the ids stored in the dump. Delete the other set (the original SQLite upload). Do not delete the `fournor_test` ids: the dump's `files` rows point at them.

In the Cloudinary media library, folder `fournor`, delete only these public ids. They were all readable as `resource_type` `image`, including the PDFs. If a delete says the asset is missing, try `raw` before assuming it is already gone.

```
fournor/favicon_8fb6a9de03
fournor/baguette_fournor_5e23e50358
fournor/campagne_6049787a3c
fournor/cereales_noir_c1ab5d1c53
fournor/chia_quinoa_cd23cef4bc
fournor/complet_32ffeca01c
fournor/mais_1f62022b9c
fournor/maxi_graines_f539bc6a00
fournor/multi_cereales_78ace363ef
fournor/tradition_62b2db645d
fournor/ad_home_1_6db132f562
fournor/ad_home_2_62a89e2da1
fournor/ad_home_3_d039ee6691
fournor/ad_sol_9731820dfc
fournor/baguette_fournor_2f2150f6b9
fournor/banner_a13ef6852d
fournor/campagne_c534c4c408
fournor/cereales_noir_c457cbe7fe
fournor/chia_quinoa_1d4add1d2e
fournor/complet_efdc670d8d
fournor/expertise_39455000e6
fournor/fournil_cc0c32d5fd
fournor/franchise_beni_khalled_dfe84027f0
fournor/franchise_ezzahra_09325080be
fournor/franchise_korba_ad253b2791
fournor/gal1_8be3321440
fournor/gal2_6aec36c85d
fournor/mais_9db22a3e92
fournor/maison_ee17399470
fournor/maxi_graines_f06e2e639b
fournor/mix_intro_366a12402c
fournor/mix_liquides_2ae8297ecc
fournor/mix_poudres_bb833ec2ed
fournor/mix_premix_3e380b2089
fournor/multi_cereales_b4bacd5f0f
fournor/partner_artesienne_141412ef87
fournor/tradition_3c61e74e17
fournor/logo_satia_clear_6b6252a026
fournor/logo_satia_07e3de7658
```
