import { applyI18n, getLang, setLang, t } from "./i18n.js";
import { xpTree, xpNav, xpHref, ingFamilies, ingHref } from "./xp-data.js";

(function applyDesktopSiteViewport() {
  const ua = navigator.userAgent || "";
  const touch = navigator.maxTouchPoints > 1;
  const desktopUA = /Macintosh|Windows NT|X11|Linux x86_64/i.test(ua) && !/Mobile/i.test(ua);
  const phoneScreen = Math.min(screen.width, screen.height) < 600;
  if (!touch || !desktopUA || !phoneScreen) return;
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute("content", "width=1100");
})();

function locNav(id) {
  const lang = getLang();
  return xpNav[id]?.[lang] ?? xpNav[id]?.fr ?? id;
}

export function fillNavLabels() {
  document.querySelectorAll("[data-xp-nav]").forEach((el) => {
    el.textContent = locNav(el.dataset.xpNav);
  });
}

function megaRows(items) {
  return items
    .map((item) => {
      const hasKids = (item.children || []).length > 0;
      const kids = (item.children || [])
        .map((child) => `<a href="${child.href}" ${child.attr}></a>`)
        .join("");
      return `<div class="nav-mega-row${hasKids ? " has-kids" : ""}">
        <a class="nav-mega-head" href="${item.href}" ${item.attr}></a>
        ${hasKids ? `<div class="nav-mega-kids">${kids}</div>` : ""}
      </div>`;
    })
    .join("");
}

function megaPanel(href, titleKey, items) {
  return `<a class="nav-mega-title" href="${href}" data-i18n="${titleKey}"></a>
    <div class="nav-mega-cats">${megaRows(items)}</div>`;
}

function megaMenu() {
  return megaPanel(
    "/solution.html",
    "nav.solution",
    xpTree.map((col) => ({
      href: xpHref(col.id),
      attr: `data-xp-nav="${col.id}"`,
      children: (col.children || []).map((id) => ({
        href: xpHref(id),
        attr: `data-xp-nav="${id}"`,
      })),
    }))
  );
}

function mixMega() {
  return megaPanel("/gamme.html", "nav.melanges", [
    { href: "/gamme.html?mix=premix-poudres", attr: 'data-i18n="nav.premix"' },
    { href: "/gamme.html?mix=mix-poudres", attr: 'data-i18n="nav.mixpoudres"' },
    { href: "/gamme.html?mix=mix-liquides", attr: 'data-i18n="nav.mixliquides"' },
  ]);
}

function ingMega() {
  return megaPanel(
    "/ingredients.html",
    "nav.ingredients",
    ingFamilies.map((id) => ({
      href: ingHref(id),
      attr: `data-xp-nav="${id}"`,
    }))
  );
}

function header(active) {
  const item = (id, href, key) =>
    `<a class="nav-link${active === id ? " is-active" : ""}" href="${href}" data-i18n="${key}"></a>`;
  const mixActive = active === "gamme" || active === "produit";
  const solActive = active === "solution";
  const ingActive = active === "ingredients";
  return `
<header class="site-header">
  <a class="brand" href="/index.html" aria-label="SATIA">
    <img class="logo-satia" src="/logo-satia.webp" alt="SATIA" width="220" height="126" draggable="false" />
  </a>
  <nav class="nav" id="site-nav" aria-label="Primary">
    ${item("home", "/index.html", "nav.home")}
    ${item("maison", "/maison.html", "nav.maison")}
    <div class="nav-item nav-item-mega${solActive ? " is-active" : ""}">
      <a class="nav-link${solActive ? " is-active" : ""}" href="/solution.html" data-i18n="nav.solution" aria-haspopup="true" aria-expanded="false"></a>
      <div class="nav-mega">${megaMenu()}</div>
    </div>
    <div class="nav-item nav-item-mega${mixActive ? " is-active" : ""}">
      <a class="nav-link${mixActive ? " is-active" : ""}" href="/gamme.html" data-i18n="nav.melanges" aria-haspopup="true" aria-expanded="false"></a>
      <div class="nav-mega nav-mega-simple">${mixMega()}</div>
    </div>
    <div class="nav-item nav-item-mega${ingActive ? " is-active" : ""}">
      <a class="nav-link${ingActive ? " is-active" : ""}" href="/ingredients.html" data-i18n="nav.ingredients" aria-haspopup="true" aria-expanded="false"></a>
      <div class="nav-mega nav-mega-simple">${ingMega()}</div>
    </div>
    ${item("partenaires", "/partenaires.html", "nav.partners")}
    ${item("contact", "/contact.html", "nav.contact")}
  </nav>
  <div class="header-tools">
    <div class="lang" role="group" data-i18n-aria="nav.lang" aria-label="Langue">
      <button type="button" data-lang="fr">FR</button>
      <button type="button" data-lang="en">EN</button>
      <button type="button" data-lang="ar">AR</button>
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
    <div class="footer-about">
      <p class="footer-brand">SATIA</p>
      <p data-i18n="footer.about"></p>
    </div>
    <div class="footer-logo">
      <img class="footer-mark" src="/logo-satia.webp" alt="SATIA" width="220" height="126" draggable="false" />
    </div>
    <div class="footer-xp">
      <p class="footer-label" data-i18n="footer.expertises"></p>
      <a href="${xpHref("metiers")}" data-xp-nav="metiers"></a>
      <a href="${xpHref("xp-ingredient")}" data-xp-nav="xp-ingredient"></a>
      <a href="${xpHref("formulation")}" data-xp-nav="formulation"></a>
    </div>
    <div class="footer-contact">
      <p class="footer-label" data-i18n="footer.contact"></p>
      <p data-i18n="footer.address"></p>
      <p>
        <a class="contact-line" href="tel:+21698692222">
          <span data-i18n="footer.phone"></span>
          <span dir="ltr">+216 98 692 222</span>
        </a>
      </p>
      <p class="social">
        <a href="https://www.facebook.com/profile.php?id=100088082392675" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.instagram.com/stdtayara.tn/" target="_blank" rel="noopener noreferrer">Instagram</a>
      </p>
    </div>
  </div>
</footer>`;
}

function pagePath(page) {
  const paths = {
    home: "/index.html",
    maison: "/maison.html",
    solution: "/solution.html",
    gamme: "/gamme.html",
    produit: "/produit.html",
    expertise: "/expertise.html",
    xp: "/xp.html",
    ingredients: "/ingredients.html",
    partenaires: "/partenaires.html",
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
  const image = `${origin}/images/banner.webp?v=2`;
  const esc = (value) => String(value).replace(/"/g, "&quot;");

  if (!document.querySelector("meta[name='description']")) {
    document.head.insertAdjacentHTML("beforeend", `<meta name="description" content="${esc(desc)}">`);
  }
  if (!document.querySelector("meta[name='theme-color']")) {
    document.head.insertAdjacentHTML("beforeend", `<meta name="theme-color" content="#f4efe6">`);
  }
  document.head.insertAdjacentHTML(
    "beforeend",
    `<meta property="og:site_name" content="SATIA">
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
    name: "SATIA",
    legalName: "Société Tayara Distribution",
    url: origin,
    telephone: "+21698692222",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Route de Korbous km 2",
      postalCode: "8020",
      addressLocality: "Soliman",
      addressRegion: "Nabeul",
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
  const navItems = [...(nav?.querySelectorAll(".nav-item") || [])];
  const isMobileNav = () => window.matchMedia("(max-width: 960px)").matches;
  const topLink = (item) => item.querySelector(":scope > .nav-link");

  const closeSubs = () => {
    navItems.forEach((item) => {
      item.classList.remove("is-open");
      topLink(item)?.setAttribute("aria-expanded", "false");
    });
  };

  const closeNav = () => {
    nav?.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
    closeSubs();
  };

  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) closeSubs();
  });

  navItems.forEach((item) => {
    const link = topLink(item);
    link?.addEventListener("click", (event) => {
      if (!isMobileNav()) return;
      event.preventDefault();
      const willOpen = !item.classList.contains("is-open");
      closeSubs();
      if (willOpen) {
        item.classList.add("is-open");
        link.setAttribute("aria-expanded", "true");
      }
    });
  });

  nav?.querySelectorAll(".nav-mega-row.has-kids > .nav-mega-head").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!isMobileNav()) return;
      const row = link.closest(".nav-mega-row");
      if (!row.classList.contains("is-open")) {
        event.preventDefault();
        nav.querySelectorAll(".nav-mega-row").forEach((r) => r.classList.remove("is-open"));
        row.classList.add("is-open");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 961px)").matches) closeNav();
  });

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  applyI18n(getLang());
  fillNavLabels();
}
