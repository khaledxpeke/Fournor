import fs from "fs";

const files = [
  "index.html",
  "ingredients.html",
  "gamme.html",
  "formation.html",
  "solution.html",
  "xp.html",
  "partenaires.html",
  "maison.html",
  "actualites.html",
  "produit.html",
  "expertise.html",
  "contact.html",
];

for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  s = s
    .replaceAll("favicon.png?v=2", "favicon.png?v=3")
    .replaceAll('href="/apple-touch-icon.png"', 'href="/apple-touch-icon.png?v=3"');
  fs.writeFileSync(f, s);
}

fs.unlinkSync(".tmp-png.mjs");
console.log("updated", files.length);
