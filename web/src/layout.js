import { t } from "./i18n.js";
import { xpNav } from "./xp-data.js";

(function applyDesktopSiteViewport() {
  const ua = navigator.userAgent || "";
  const touch = navigator.maxTouchPoints > 1;
  const desktopUA = /Macintosh|Windows NT|X11|Linux x86_64/i.test(ua) && !/Mobile/i.test(ua);
  const phoneScreen = Math.min(screen.width, screen.height) < 600;
  if (!touch || !desktopUA || !phoneScreen) return;
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute("content", "width=1100");
})();

function pageLang() {
  const value = document.documentElement.lang;
  return value === "en" || value === "ar" || value === "fr" ? value : "fr";
}

function locNav(id) {
  const lang = pageLang();
  return xpNav[id]?.[lang] ?? xpNav[id]?.fr ?? id;
}

export function fillNavLabels() {
  document.querySelectorAll("[data-xp-nav]").forEach((el) => {
    el.textContent = locNav(el.dataset.xpNav);
  });
}

function mountHead() {
  if (document.querySelector("meta[property='og:title']")) return;
  const page = document.body.dataset.page || "home";
  const lang = pageLang();
  const title = t(`meta.${page}`, lang);
  const desc = t(`meta.desc.${page}`, lang);
  const origin = window.location.origin;
  const url = `${origin}${window.location.pathname}`;
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

export function mountLayout() {
  mountHead();

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  const navItems = [...(nav?.querySelectorAll(".nav-item") || [])];
  const isMobileNav = () => window.matchMedia("(max-width: 1100px)").matches;
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

  if (!window.__foNavBound) {
    window.__foNavBound = true;

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

    document.querySelectorAll("[data-set-lang]").forEach((link) => {
      link.addEventListener("click", () => {
        localStorage.setItem("fournor-lang", link.dataset.setLang);
      });
    });
  }

  fillNavLabels();
}
