import { applyI18n, getLang, setLang, t } from "./i18n.js";

const LOGO = `
<svg class="logo-mark" width="44" height="44" viewBox="0 0 200 200" aria-hidden="true">
  <circle cx="100" cy="100" r="100" fill="#88857E"/>
  <g fill="#F0C667">
    <ellipse cx="100" cy="46" rx="9" ry="15"/>
    <ellipse cx="84" cy="64" rx="9" ry="15" transform="rotate(-30 84 64)"/>
    <ellipse cx="116" cy="64" rx="9" ry="15" transform="rotate(30 116 64)"/>
    <ellipse cx="82" cy="86" rx="9" ry="15" transform="rotate(-34 82 86)"/>
    <ellipse cx="118" cy="86" rx="9" ry="15" transform="rotate(34 118 86)"/>
    <ellipse cx="84" cy="108" rx="9" ry="15" transform="rotate(-38 84 108)"/>
    <ellipse cx="116" cy="108" rx="9" ry="15" transform="rotate(38 116 108)"/>
  </g>
  <rect x="97.5" y="50" width="5" height="64" rx="2" fill="#F7F4ED"/>
  <text x="100" y="152" text-anchor="middle" fill="#F7F4ED" font-family="Georgia, serif" font-size="22" font-weight="700" letter-spacing="2.4">FOURN'OR</text>
</svg>`;

function header(active) {
  const item = (id, href, key) =>
    `<a class="nav-link${active === id ? " is-active" : ""}" href="${href}" data-i18n="${key}"></a>`;
  return `
<header class="site-header">
  <a class="brand" href="/index.html" aria-label="Fourn’Or">
    ${LOGO}
    <span class="brand-text">
      <span class="brand-name">Fourn’Or</span>
      <span class="brand-legal" data-i18n="brand.legal"></span>
    </span>
  </a>
  <nav class="nav" id="site-nav" aria-label="Primary">
    ${item("home", "/index.html", "nav.home")}
    ${item("maison", "/maison.html", "nav.maison")}
    ${item("gamme", "/gamme.html", "nav.gamme")}
    ${item("expertise", "/expertise.html", "nav.expertise")}
    ${item("actualites", "/actualites.html", "nav.news")}
    ${item("contact", "/contact.html", "nav.contact")}
  </nav>
  <div class="header-tools">
    <div class="lang" role="group" aria-label="Language">
      <button type="button" data-lang="fr">FR</button>
      <button type="button" data-lang="en">EN</button>
    </div>
    <button class="nav-toggle" type="button" data-i18n-aria="nav.open" aria-expanded="false" aria-controls="site-nav">
      <span></span><span></span>
    </button>
  </div>
</header>`;
}

function footer() {
  return `
<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <p class="footer-brand">Fourn’Or</p>
      <p data-i18n="footer.about"></p>
      <p class="muted" data-i18n="brand.tag"></p>
    </div>
    <div>
      <p class="footer-label" data-i18n="footer.products"></p>
      <a href="/gamme.html">Banette · Tradition · Complet</a>
      <a href="/gamme.html">Campagne · Céréales noir · Scandinave</a>
      <a href="/gamme.html">Maxi graines · Multigrain · Maïs · Chia quinoa</a>
    </div>
    <div>
      <p class="footer-label" data-i18n="footer.contact"></p>
      <p data-i18n="footer.address"></p>
      <p><a href="tel:+21671100797" data-i18n="footer.phone"></a></p>
      <p data-i18n="footer.fax"></p>
      <p class="social">
        <a href="https://www.facebook.com/profile.php?id=100088082392675" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.instagram.com/stdtayara.tn/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </p>
    </div>
  </div>
  <div class="footer-bar">
    <span data-i18n="footer.copy"></span>
    <span data-i18n="footer.photo"></span>
  </div>
</footer>`;
}

function pagePath(page) {
  const paths = {
    home: "/index.html",
    maison: "/maison.html",
    gamme: "/gamme.html",
    produit: "/produit.html",
    expertise: "/expertise.html",
    actualites: "/actualites.html",
    contact: "/contact.html",
  };
  return paths[page] || "/index.html";
}

function mountHead() {
  if (document.querySelector("meta[property='og:title']")) return;
  const page = document.body.dataset.page || "home";
  const lang = getLang();
  const title = t(`meta.${page}`, lang);
  const desc = t(`meta.desc.${page}`, lang);
  const origin = window.location.origin;
  const url = `${origin}${pagePath(page)}${window.location.search}`;
  const image = `${origin}/images/banner.webp`;
  const esc = (value) => String(value).replace(/"/g, "&quot;");

  if (!document.querySelector("meta[name='description']")) {
    document.head.insertAdjacentHTML("beforeend", `<meta name="description" content="${esc(desc)}">`);
  }
  if (!document.querySelector("meta[name='theme-color']")) {
    document.head.insertAdjacentHTML("beforeend", `<meta name="theme-color" content="#f4efe6">`);
  }
  document.head.insertAdjacentHTML(
    "beforeend",
    `<meta property="og:site_name" content="Fourn’Or">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(image)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">`
  );

  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fourn’Or",
    legalName: "Société Tayara Distribution",
    url: origin,
    telephone: "+21671100797",
    address: {
      "@type": "PostalAddress",
      streetAddress: "01 rue du Nil, Sidi Fathallah Djebel Djelloud",
      postalCode: "2023",
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
  });
  document.head.appendChild(ld);
}

export function mountLayout(active) {
  mountHead();
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<a class="skip" href="#content" data-i18n="skip">${t("skip")}</a>` + header(active)
  );
  document.body.insertAdjacentHTML("beforeend", footer());
  document.querySelector("main")?.setAttribute("id", "content");

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const closeNav = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1181px)").matches) closeNav();
  });

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  applyI18n(getLang());
}
