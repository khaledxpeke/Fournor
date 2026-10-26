import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
const { v2: cloudinary } = require("cloudinary");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(root, ".env"), "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    })
);

const folder = env.CLOUDINARY_FOLDER || "fournor";
if (!env.CLOUDINARY_NAME || !env.CLOUDINARY_KEY || !env.CLOUDINARY_SECRET) {
  throw new Error("Cloudinary credentials are missing. Refusing to migrate.");
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
  secure: true,
});

const uploadsDir = path.join(root, "public", "uploads");
function mediaFiles() {
  if (!fs.existsSync(uploadsDir)) return [];
  return fs.readdirSync(uploadsDir).filter((name) => name !== ".gitkeep");
}

const db = new Database(path.join(root, ".tmp", "data.db"));
const rows = db.prepare("SELECT id, name, hash, ext, mime, url, provider FROM files ORDER BY id").all();
const local = rows.filter((row) => row.provider !== "cloudinary" || !(row.url || "").includes("res.cloudinary.com"));
console.log(`library before: ${rows.length} (${local.length} local, ${rows.length - local.length} cloudinary)`);
console.log(`uploads before: ${mediaFiles().length}`);

let migrated = 0;
for (const file of local) {
  const relative = (file.url || "").replace(/^\//, "");
  const source = path.join(root, "public", relative);
  if (!file.hash) throw new Error(`File ${file.id} has no hash`);
  if (!fs.existsSync(source)) throw new Error(`Missing local file for ${file.name}`);
  const image = await cloudinary.uploader.upload(source, {
    resource_type: "auto",
    public_id: file.hash,
    folder,
    overwrite: true,
    filename: `${file.hash}${file.ext || ""}`,
  });
  if (!image?.secure_url || !image.public_id) throw new Error(`Cloudinary did not return a URL for ${file.name}`);
  db.prepare(
    `UPDATE files
     SET url = ?, provider = 'cloudinary', provider_metadata = ?, formats = NULL, preview_url = NULL,
         width = COALESCE(?, width), height = COALESCE(?, height), size = COALESCE(?, size), updated_at = ?
     WHERE id = ?`
  ).run(
    image.secure_url,
    JSON.stringify({ public_id: image.public_id, resource_type: image.resource_type || "image" }),
    image.width || null,
    image.height || null,
    image.bytes ? Math.round((image.bytes / 1024) * 100) / 100 : null,
    new Date().toISOString(),
    file.id
  );
  migrated += 1;
  console.log(`migrated ${migrated}/${local.length} ${file.name}`);
}

const after = db.prepare("SELECT provider, url FROM files").all();
const stillLocal = after.filter((row) => row.provider !== "cloudinary" || !(row.url || "").includes("res.cloudinary.com"));
if (stillLocal.length) throw new Error(`${stillLocal.length} files are still local. Uploads were left in place.`);

for (const name of mediaFiles()) fs.rmSync(path.join(uploadsDir, name), { force: true });
const left = mediaFiles();
console.log(`library after: ${after.length} cloudinary, ${stillLocal.length} local`);
console.log(`uploads after: ${left.length}`);
if (left.length) throw new Error(`Uploads directory still has ${left.length} files`);
db.close();
