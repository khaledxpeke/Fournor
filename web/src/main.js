import { mountLayout, fillNavLabels } from "./layout.js";
import { isRtl } from "./i18n.js";
import { products, events, getProduct } from "virtual:fournor-catalog";
import { dosageMeta, partners } from "./lib/local-meta.js";
import { t } from "./i18n.js";
import { displaySrc, srcsetFor, slots } from "./lib/images.js";
import {
  xpTree,
  xpNav,
  xpHref,
  getXpPage,
  getXpTitle,
  ingFamilies,
  ingFamilyPages,
  ingHref,
} from "virtual:fournor-catalog";

const page = document.body.dataset.page || "home";
mountLayout(page === "produit" ? "gamme" : page === "xp" ? "solution" : page);

const lang = () => {
  const value = document.documentElement.lang;
  return value === "en" || value === "ar" || value === "fr" ? value : "fr";
};
const loc = (obj, L = lang()) => obj?.[L] ?? obj?.fr ?? obj?.en ?? "";

function dateLocale(L = lang()) {
  return { fr: "fr-TN", en: "en-GB", ar: "ar-TN" }[L] || "fr-TN";
}

function ringSvg(pct) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return `<svg viewBox="0 0 100 100" aria-hidden="true">
    <circle class="ring-track" cx="50" cy="50" r="${r}"/>
    <circle class="ring-value" cx="50" cy="50" r="${r}"
      stroke-dasharray="${dash} ${c}" transform="rotate(-90 50 50)"/>
  </svg>`;
}

function mediaTag(url, { alt, width, height, slot, extra = "" }) {
  const preset = slots[slot];
  const src = displaySrc(url, preset.widths);
  const set = srcsetFor(url, preset.widths);
  const responsive = set ? ` srcset="${set}" sizes="${preset.sizes}"` : "";
  return `<img src="${src}"${responsive} alt="${alt}" width="${width}" height="${height}" ${extra} />`;
}

function productCard(p, { decoy = false } = {}) {
  const L = lang();
  const extra = decoy ? ' aria-hidden="true" tabindex="-1"' : "";
  return `<a class="p-card" href="/produit/${p.id}/"${extra}>
    <div class="p-card-img">
      ${mediaTag(p.image, { alt: loc(p.name, L), width: 800, height: 600, slot: "card", extra: 'loading="lazy" decoding="async"' })}
    </div>
    <div class="p-card-body">
      <h3>${loc(p.name, L)}</h3>
      <p>${loc(p.promise, L)}</p>
      <span class="more" data-i18n="gamme.more">${t("gamme.more", L)}</span>
    </div>
  </a>`;
}

function eventCard(e) {
  const L = lang();
  return `<article class="e-card">
    <div class="e-card-img">${mediaTag(e.image, { alt: loc(e.title, L), width: 800, height: 500, slot: "franchise", extra: 'loading="lazy" decoding="async"' })}</div>
    <div>
      <p class="kicker">${loc(e.place, L)}</p>
      <h3>${loc(e.title, L)}</h3>
      <p>${loc(e.text, L)}</p>
    </div>
  </article>`;
}

function renderHome() {
  if (document.querySelector("#atelier-rail .p-card") && document.querySelector("#home-news h3")) return;
  const L = lang();
  const rail = document.getElementById("atelier-rail");
  if (rail) {
    const cards = products.map((p) => productCard(p)).join("");
    const decoys = products.map((p) => productCard(p, { decoy: true })).join("");
    rail.innerHTML = `<div class="atelier-shift"><div class="atelier-track">${cards}${decoys}</div></div>`;
  }
  const news = document.getElementById("home-news");
  if (news && events.length) news.innerHTML = events.slice(0, 3).map(eventCard).join("");
  document.querySelectorAll("[data-dosage-label]").forEach((el) => {
    const d = Number(el.dataset.dosageLabel);
    el.textContent = loc(dosageMeta[d].label, L);
  });
  document.querySelectorAll("[data-dosage-blurb]").forEach((el) => {
    const d = Number(el.dataset.dosageBlurb);
    el.textContent = loc(dosageMeta[d].blurb, L);
  });
  renderMarquee();
}

function fold(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "");
}

function matchesGammeQuery(p, query) {
  if (!query) return true;
  const hay = fold(
    [
      p.id,
      p.sku,
      p.family,
      p.mix,
      p.dosage,
      `${p.dosage}%`,
      loc(p.name, "fr"),
      loc(p.name, "en"),
      loc(p.name, "ar"),
      loc(p.promise, "fr"),
      loc(p.promise, "en"),
      loc(p.promise, "ar"),
      loc(p.sensory, "fr"),
      loc(p.sensory, "en"),
      loc(p.sensory, "ar"),
      loc(p.target, "fr"),
      loc(p.target, "en"),
      loc(p.target, "ar"),
    ].join(" ")
  );
  return query.split(/\s+/).every((word) => hay.includes(word));
}

function renderMarquee() {
  const track = document.querySelector(".marquee-track");
  if (!track || track.querySelector("span")) return;
  const L = lang();
  const items = products.map((p) => loc(p.name, L));
  const html = items.map((item) => `<span>${item}</span>`).join("");
  track.innerHTML = html + html;
}

function pathPart(index) {
  const parts = location.pathname.split("/").filter(Boolean);
  return parts[index] ? decodeURIComponent(parts[index]) : "";
}

function currentMix() {
  if (document.body.dataset.mix) return document.body.dataset.mix;
  if (pathPart(0) === "gamme" && pathPart(1)) return pathPart(1);
  return new URLSearchParams(location.search).get("mix");
}

function isGammeHub() {
  const mix = currentMix();
  return !mix || mix === "all";
}

function mixTitleKey(mix) {
  return {
    "premix-poudres": "gamme.filterPremix",
    "mix-poudres": "gamme.filterMix",
    "mix-graines": "gamme.filterGraines",
    "mix-liquides": "gamme.filterLiquid",
  }[mix];
}

function syncGammeView() {
  const hub = document.getElementById("mix-hub");
  const catalog = document.getElementById("gamme-catalog");
  const title = document.getElementById("gamme-title");
  const lead = document.getElementById("gamme-lead");
  const back = document.getElementById("gamme-back");
  if (!hub || !catalog) return;
  const hubMode = isGammeHub();
  const L = lang();
  hub.hidden = !hubMode;
  catalog.hidden = hubMode;
  if (lead) lead.hidden = !hubMode;
  if (back) back.hidden = hubMode;
  if (title) {
    const key = mixTitleKey(currentMix());
    title.textContent = key ? t(key, L) : t("gamme.hero", L);
    title.removeAttribute("data-i18n");
  }
  document.title = `${title?.textContent || t("gamme.hero", L)} — SATIA`;
}

function renderGamme() {
  const grid = document.getElementById("gamme-grid");
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".p-card")];
  const query = fold(document.getElementById("gamme-search")?.value.trim());
  let shown = 0;
  cards.forEach((card) => {
    const hay = fold(card.dataset.search || "");
    const ok = !query || query.split(/\s+/).filter(Boolean).every((word) => hay.includes(word));
    card.hidden = !ok;
    if (ok) shown += 1;
  });
  const empty = document.getElementById("gamme-empty");
  if (empty) empty.hidden = shown > 0;
}

function setupFilters() {
  syncGammeView();
}

function setupGammeSearch() {
  const input = document.getElementById("gamme-search");
  if (!input || input.dataset.ready) return;
  input.dataset.ready = "1";
  input.addEventListener("input", renderGamme);
  input.addEventListener("search", renderGamme);
}

function currentProductId() {
  if (document.body.dataset.product) return document.body.dataset.product;
  if (pathPart(0) === "produit" && pathPart(1)) return pathPart(1);
  return new URLSearchParams(location.search).get("id");
}

function renderProduit() {
  const root = document.getElementById("produit");
  if (!root || root.querySelector("h1")) return;
  const id = currentProductId();
  const p = getProduct(id);
  const L = lang();
  document.title = `${loc(p.name, L)} — Fourn’Or`;
  const videoBlock = p.video
    ? `<section class="prod-video" id="prod-video">
        <p class="kicker">${t("prod.video", L)}</p>
        <h2>${t("prod.videoTitle", L)}</h2>
        <div class="prod-video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${p.video}"
            title="${loc(p.name, L)}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>`
    : "";
  const watchBtn = p.video
    ? `<a class="btn btn-ghost" href="#prod-video">${t("prod.watch", L)}</a>`
    : "";
  const sheetBtn = p.sheet
    ? `<a class="btn btn-ghost" href="${p.sheet}" rel="noopener">${t("prod.download", L)}</a>`
    : "";
  const actions = watchBtn || sheetBtn ? `<div class="prod-actions">${watchBtn}${sheetBtn}</div>` : "";
  root.innerHTML = `
    <div class="prod-hero">
      <div class="prod-photo">
        ${mediaTag(p.image, { alt: loc(p.name, L), width: 900, height: 900, slot: "product", extra: 'fetchpriority="high" decoding="async"' })}
      </div>
      <div class="prod-intro">
        <p class="kicker" data-i18n="prod.kicker">${t("prod.kicker", L)}</p>
        <h1>${loc(p.name, L)}</h1>
        <p class="sku">${p.sku}</p>
        <p class="lead">${loc(p.promise, L)}</p>
        ${actions}
      </div>
    </div>
    <div class="prod-specs">
      <div class="prod-spec-main">
        <article>
          <h2>${t("prod.composition", L)}</h2>
          <p>${loc(p.composition, L)}</p>
        </article>
        <article class="prod-spec-weight">
          <h2>${t("prod.weight", L)}</h2>
          <p>${p.weight}</p>
        </article>
      </div>
      <div class="prod-spec-grid">
        <article><h2>${t("prod.adds", L)}</h2><p>${loc(p.adds, L)}</p></article>
        <article><h2>${t("prod.sensory", L)}</h2><p>${loc(p.sensory, L)}</p></article>
        <article><h2>${t("prod.target", L)}</h2><p>${loc(p.target, L)}</p></article>
        <article><h2>${t("prod.usage", L)}</h2><p>${t("prod.usageText", L)}</p></article>
      </div>
    </div>
    ${videoBlock}
    <p><a class="btn btn-ghost" href="/gamme/" data-i18n="prod.back">${t("prod.back", L)}</a></p>
    <h2 class="section-title" data-i18n="prod.other">${t("prod.other", L)}</h2>
    <div class="card-grid">${products.filter((x) => x.id !== p.id).slice(0, 3).map(productCard).join("")}</div>
  `;
}

function composerLabel(p, L) {
  return loc(p.name, L);
}

function closeComposerSelect() {
  const wrap = document.getElementById("composer-select");
  if (!wrap) return;
  wrap.classList.remove("is-open");
  const trigger = wrap.querySelector(".fo-select-trigger");
  const list = wrap.querySelector(".fo-select-list");
  trigger?.setAttribute("aria-expanded", "false");
  if (list) list.hidden = true;
}

function openComposerSelect() {
  const wrap = document.getElementById("composer-select");
  if (!wrap) return;
  wrap.classList.add("is-open");
  const trigger = wrap.querySelector(".fo-select-trigger");
  const list = wrap.querySelector(".fo-select-list");
  trigger?.setAttribute("aria-expanded", "true");
  if (list) list.hidden = false;
  const selected = list?.querySelector('[aria-selected="true"]') || list?.querySelector("[role='option']");
  list?.querySelectorAll("[role='option']").forEach((opt) => opt.classList.remove("is-active"));
  selected?.classList.add("is-active");
  selected?.scrollIntoView({ block: "nearest" });
}

function moveComposerActive(delta) {
  const list = document.querySelector("#composer-select .fo-select-list");
  if (!list || list.hidden) return;
  const options = [...list.querySelectorAll("[role='option']")];
  const current = options.findIndex((opt) => opt.classList.contains("is-active"));
  const next = options[(Math.max(current, 0) + delta + options.length) % options.length];
  options.forEach((opt) => opt.classList.remove("is-active"));
  next.classList.add("is-active");
  next.scrollIntoView({ block: "nearest" });
}

function mountComposerSelect(wrap) {
  wrap.dataset.value = wrap.dataset.value || products[0].id;
  if (wrap.dataset.bound) return;
  wrap.dataset.bound = "1";
  if (!wrap.querySelector(".fo-select-trigger")) wrap.innerHTML = `
    <button type="button" class="fo-select-trigger" id="composer-trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="composer-label composer-value" aria-controls="composer-list">
      <span class="fo-select-value" id="composer-value"></span>
      <svg class="fo-select-chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <ul class="fo-select-list" role="listbox" id="composer-list" aria-labelledby="composer-label" hidden></ul>
  `;

  const trigger = wrap.querySelector(".fo-select-trigger");
  const list = wrap.querySelector(".fo-select-list");

  trigger.addEventListener("click", () => {
    if (wrap.classList.contains("is-open")) closeComposerSelect();
    else openComposerSelect();
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!wrap.classList.contains("is-open")) openComposerSelect();
      moveComposerActive(event.key === "ArrowDown" ? 1 : -1);
    }
    if (event.key === "Enter" || event.key === " ") {
      if (wrap.classList.contains("is-open")) {
        event.preventDefault();
        const active = list.querySelector(".is-active");
        if (active) {
          wrap.dataset.value = active.dataset.value;
          closeComposerSelect();
          renderComposer();
        }
      }
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeComposerSelect();
    }
  });

  list.addEventListener("click", (event) => {
    const option = event.target.closest("[role='option']");
    if (!option) return;
    wrap.dataset.value = option.dataset.value;
    closeComposerSelect();
    renderComposer();
  });

  if (!window.__foSelectBound) {
    window.__foSelectBound = true;
    document.addEventListener("click", (event) => {
      if (!event.target.closest("#composer-select")) closeComposerSelect();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeComposerSelect();
    });
  }
}

function renderComposer() {
  const wrap = document.getElementById("composer-select");
  const visual = document.getElementById("composer-visual");
  if (!wrap || !visual) return;
  const L = lang();
  if (!wrap.dataset.ready) {
    mountComposerSelect(wrap);
    wrap.dataset.ready = "1";
  }
  const current = wrap.dataset.value || products[0].id;
  wrap.dataset.value = current;
  const list = wrap.querySelector(".fo-select-list");
  if (list) {
    list.innerHTML = products
      .filter((p) => p.dosage > 0)
      .map(
        (p) =>
          `<li role="option" data-value="${p.id}" id="composer-opt-${p.id}" aria-selected="${p.id === current ? "true" : "false"}">${composerLabel(p, L)}</li>`
      )
      .join("");
  }
  const valueEl = wrap.querySelector(".fo-select-value");
  const p = getProduct(current);
  if (valueEl) valueEl.textContent = composerLabel(p, L);
  const flour = 100 - p.dosage;
  visual.innerHTML = `
    <div class="mix-readout">
      <div class="mix-stat">
        <b>${p.dosage}%</b>
        <span>${t("exp.premix", L)}</span>
      </div>
      <div class="mix-stat">
        <b>${flour}%</b>
        <span>${t("exp.flour", L)}</span>
      </div>
    </div>
    <div class="mix-bar" role="img" aria-label="${p.dosage}% ${t("exp.premix", L)}, ${flour}% ${t("exp.flour", L)}">
      <span class="mix-premix" style="flex:${p.dosage} 0 ${p.dosage < 12 ? "12px" : "0"}"></span>
      <span class="mix-flour" style="flex:${flour} 1 0"></span>
    </div>
    <p class="mix-plus">${t("exp.plus", L)}</p>
    <p class="mix-note">${loc(p.promise, L)}</p>
  `;
}

function renderNews() {
  const list = document.getElementById("news-list");
  if (!list || list.querySelector("h3")) return;
  list.innerHTML = events.map(eventCard).join("");
}

function renderPartners() {
  const wrap = document.getElementById("partners");
  if (!wrap) return;
  wrap.innerHTML = partners
    .map((p) => `<li><strong>${p.name}</strong><span>${p.city}</span></li>`)
    .join("");
}

function setupContact() {
  const form = document.getElementById("contact-form");
  if (!form || form.dataset.ready) return;
  form.dataset.ready = "1";
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const L = lang();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.message.value.trim();
    const note = document.getElementById("form-note");
    const button = form.querySelector("button[type=submit]");
    const valid = name && msg && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      note.textContent = t("contact.error", L);
      note.className = "form-note is-err";
      return;
    }
    if (button) button.disabled = true;
    note.textContent = "";
    note.className = "form-note";
    try {
      const res = await fetch("https://formsubmit.co/ajax/contact.satia@fournor.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message: msg,
          _subject: "Message depuis le site SATIA",
          _replyto: email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false || data.success === "false") throw new Error("send");
      note.textContent = t("contact.ok", L);
      note.className = "form-note is-ok";
      form.reset();
    } catch {
      note.textContent = t("contact.fail", L);
      note.className = "form-note is-err";
    } finally {
      if (button) button.disabled = false;
    }
  });
}

let atelierGoTo = () => {};
let atelierDotRaf = 0;

function setupAtelierNav() {
  const rail = document.getElementById("atelier-rail");
  const prev = document.getElementById("atelier-prev");
  const next = document.getElementById("atelier-next");
  const dots = document.getElementById("atelier-dots");
  if (!rail || !prev || !next) return;

  const L = lang();
  const rtl = isRtl(L);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count = products.length;
  prev.setAttribute("aria-label", t("atelier.prev", L));
  next.setAttribute("aria-label", t("atelier.next", L));
  prev.textContent = rtl ? "›" : "‹";
  next.textContent = rtl ? "‹" : "›";
  prev.disabled = false;
  next.disabled = false;
  rail.classList.toggle("is-static", reduceMotion);

  if (dots) {
    dots.setAttribute("aria-label", t("atelier.dots", L));
    dots.innerHTML = products
      .map(
        (p, i) =>
          `<button type="button" class="atelier-dot" data-index="${i}" aria-label="${loc(p.name, L)}"></button>`
      )
      .join("");
  }

  const shift = () => rail.querySelector(".atelier-shift");
  const cards = () => [...rail.querySelectorAll(".p-card")];
  const step = () => {
    const card = rail.querySelector(".p-card");
    return (card?.getBoundingClientRect().width || 240) + 18;
  };

  const go = (dir) => {
    const el = shift();
    if (!el) return;
    const jump = Number(rail.dataset.jump || 0) + (rtl ? 1 : -1) * dir * step() * 2;
    rail.dataset.jump = String(jump);
    el.style.transform = `translateX(${jump}px)`;
  };

  const goTo = (index) => {
    const el = shift();
    const list = cards();
    if (!el || !list.length) return;
    const railBox = rail.getBoundingClientRect();
    const start = rtl ? railBox.right : railBox.left;
    const pick = [list[index], list[index + count]].filter(Boolean).reduce((best, card) => {
      const box = card.getBoundingClientRect();
      const edge = rtl ? box.right : box.left;
      const dist = Math.abs(edge - start);
      if (!best || dist < best.dist) return { card, dist };
      return best;
    }, null);
    if (!pick) return;
    const box = pick.card.getBoundingClientRect();
    const edge = rtl ? box.right : box.left;
    const delta = edge - start;
    const jump = Number(rail.dataset.jump || 0) + (rtl ? delta : -delta);
    rail.dataset.jump = String(jump);
    el.style.transform = `translateX(${jump}px)`;
  };

  const syncDots = () => {
    if (!dots) return;
    const list = cards();
    if (list.length < count) return;
    const railBox = rail.getBoundingClientRect();
    const start = rtl ? railBox.right : railBox.left;
    let active = 0;
    let best = Infinity;
    for (let i = 0; i < count; i += 1) {
      const pair = [list[i], list[i + count]].filter(Boolean);
      const dist = Math.min(
        ...pair.map((card) => {
          const box = card.getBoundingClientRect();
          const edge = rtl ? box.right : box.left;
          return Math.abs(edge - start);
        })
      );
      if (dist < best) {
        best = dist;
        active = i;
      }
    }
    dots.querySelectorAll(".atelier-dot").forEach((dot, i) => {
      dot.classList.toggle("is-on", i === active);
      dot.setAttribute("aria-current", i === active ? "true" : "false");
    });
  };

  atelierGoTo = goTo;

  if (!rail.dataset.navReady) {
    rail.dataset.navReady = "1";
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    rail.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(rtl ? -1 : 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(rtl ? 1 : -1);
      }
    });
    dots?.addEventListener("click", (e) => {
      const btn = e.target.closest(".atelier-dot");
      if (!btn) return;
      atelierGoTo(Number(btn.dataset.index));
    });
  }

  if (atelierDotRaf) cancelAnimationFrame(atelierDotRaf);
  const tick = () => {
    syncDots();
    atelierDotRaf = requestAnimationFrame(tick);
  };
  atelierDotRaf = requestAnimationFrame(tick);
}

function fitPillarHeadings() {
  const headings = [...document.querySelectorAll(".pillar-heading")];
  if (!headings.length) return;

  headings.forEach((heading) => {
    heading.style.fontSize = "";
  });

  if (window.matchMedia("(max-width: 900px)").matches) return;

  const source =
    document.querySelector(".sol-intro .pillar-heading") || headings[0];
  const ref = source.closest(".mix-copy")?.querySelector(".pillar-fit-ref");
  if (!ref) return;

  const parent = source.parentElement;
  const probe = source.cloneNode(false);
  probe.className = source.className;
  probe.textContent = t("maison.kicker", "fr");
  probe.style.cssText =
    'position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;width:max-content;font-size:inherit;font-family:"Cormorant Garamond",Georgia,serif;letter-spacing:-0.02em;';

  const refStyle = getComputedStyle(ref);
  const refProbe = document.createElement("span");
  refProbe.textContent = t("maison.titleFit", "fr");
  refProbe.style.cssText = `position:absolute;left:0;top:0;visibility:hidden;pointer-events:none;white-space:nowrap;width:max-content;font-family:Montserrat,system-ui,sans-serif;font-size:${refStyle.fontSize};font-weight:${refStyle.fontWeight};letter-spacing:0;`;
  parent.append(probe, refProbe);

  const target = refProbe.getBoundingClientRect().width;
  const current = probe.getBoundingClientRect().width;
  const size = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  refProbe.remove();

  if (target && current && size) {
    const maxW = source.parentElement?.clientWidth || target;
    const shared = `${((size * Math.min(target, maxW)) / current).toFixed(2)}px`;
    headings.forEach((heading) => {
      heading.style.fontSize = shared;
    });
  }
}

function xpCta(page) {
  if (!page?.cta) return "";
  const L = lang();
  const label = loc(page.cta.label, L) || (page.cta.key ? t(page.cta.key, L) : "");
  return `<a class="btn btn-gold" href="${page.cta.href}">${label}</a>`;
}

function xpNotes(page) {
  if (!page?.notes?.length) return "";
  const L = lang();
  return `<section class="section" style="padding-top:0">
    <div class="wrap page-notes">
      ${page.notes
        .map(
          (note) => `<article class="reveal">
        <h2>${loc(note.title, L)}</h2>
        <p>${loc(note.text, L)}</p>
      </article>`
        )
        .join("")}
    </div>
  </section>`;
}

function xpChildCards(id) {
  const col = xpTree.find((c) => c.id === id);
  if (!col?.children?.length) return "";
  const L = lang();
  return `<section class="section" style="padding-top:0">
    <div class="wrap xp-children">
      ${col.children
        .map((cid) => {
          const child = getXpPage(cid);
          return `<a class="xp-child reveal" href="${xpHref(cid)}">
            <h2>${getXpTitle(cid, L)}</h2>
            <p class="pillar-tagline">${child ? loc(child.tag, L) : ""}</p>
            <p>${child ? loc(child.lead, L) : ""}</p>
            <span class="more">${t("metier.more", L)}</span>
          </a>`;
        })
        .join("")}
    </div>
  </section>`;
}

function xpCtaBand() {
  const L = lang();
  return `<section class="section" style="padding-top:0">
    <div class="cta-band reveal">
      <div>
        <h2>${t("cta.title", L)}</h2>
        <p>${t("cta.text", L)}</p>
      </div>
      <a class="btn btn-gold" href="/contact/">${t("cta.btn", L)}</a>
    </div>
  </section>`;
}

function parentOf(id) {
  return xpTree.find((col) => col.id === id || col.children.includes(id));
}

function renderXp() {
  const root = document.getElementById("xp-root");
  if (!root || root.querySelector("h1")) return;
  const id = document.body.dataset.xp || (pathPart(0) === "xp" ? pathPart(1) : "") || new URLSearchParams(location.search).get("id");
  if (id === "formation") {
    location.replace("/formation/");
    return;
  }
  const pageData = getXpPage(id);
  if (!id || !pageData) {
    location.replace("/solution/");
    return;
  }
  const L = lang();
  const title = getXpTitle(id, L);
  const parent = parentOf(id);
  const parentId = parent && parent.id !== id ? parent.id : "solution";
  const parentHref = parentId === "solution" ? "/solution/" : xpHref(parentId);
  const parentLabel = parentId === "solution" ? t("nav.solution", L) : getXpTitle(parentId, L);
  document.title = `${title} — SATIA`;
  const desc = document.querySelector("meta[name='description']");
  if (desc) desc.setAttribute("content", loc(pageData.lead, L));

  root.innerHTML = `
    <section class="page-open wrap">
      <figure class="page-open-photo">
        ${mediaTag(pageData.image, { alt: title, width: 1600, height: 1200, slot: "page", extra: 'fetchpriority="high" decoding="async"' })}
      </figure>
      <div class="page-open-copy">
        <p class="kicker"><a href="${parentHref}">${parentLabel}</a></p>
        <h1>${title}</h1>
        <p class="lead pillar-tagline">${loc(pageData.tag, L)}</p>
        <p>${loc(pageData.lead, L)}</p>
        <p>${loc(pageData.text, L)}</p>
        ${xpCta(pageData)}
      </div>
    </section>
    ${xpNotes(pageData)}
    ${xpChildCards(id)}
    ${xpCtaBand()}`;
}

function renderSolutionHub() {
  const hub = document.getElementById("xp-hub");
  if (!hub || hub.querySelector("article")) return;
  const L = lang();
  hub.innerHTML = xpTree
    .map((col) => {
      const pageData = getXpPage(col.id);
      const kids = (col.children || [])
        .map((cid) => `<a href="${xpHref(cid)}">${getXpTitle(cid, L)}</a>`)
        .join("");
      return `<article class="xp-pillar reveal">
        <h2><a href="${xpHref(col.id)}">${getXpTitle(col.id, L)}</a></h2>
        <p class="pillar-tagline">${pageData ? loc(pageData.tag, L) : ""}</p>
        <p>${pageData ? loc(pageData.lead, L) : ""}</p>
        ${kids ? `<div class="xp-pillar-links">${kids}</div>` : ""}
        <a class="btn btn-gold" href="${xpHref(col.id)}">${t("metier.more", L)}</a>
      </article>`;
    })
    .join("");
}

function renderIngredients() {
  if (document.body.dataset.page !== "ingredients") return;
  if (document.querySelector("#ing-families a, #ing-detail h1")) return;
  const L = lang();
  const fam =
    document.body.dataset.fam ||
    (pathPart(0) === "ingredients" ? pathPart(1) : "") ||
    new URLSearchParams(location.search).get("fam");
  const intro = document.getElementById("ing-intro");
  const detail = document.getElementById("ing-detail");
  const grid = document.getElementById("ing-families");
  const list = document.getElementById("ing-family-list");
  const onFamily = Boolean(fam && ingFamilyPages[fam]);
  if (onFamily) {
    const pageData = ingFamilyPages[fam];
    const title = getXpTitle(fam, L);
    document.title = `${title} — SATIA`;
    if (intro) intro.hidden = true;
    if (list) list.hidden = true;
    if (detail) {
      detail.hidden = false;
      detail.innerHTML = `
      <section class="page-open wrap">
        <figure class="page-open-photo">
          ${mediaTag(pageData.image, { alt: title, width: 1600, height: 1200, slot: "page", extra: 'fetchpriority="high" decoding="async"' })}
        </figure>
        <div class="page-open-copy">
          <p class="kicker"><a href="/ingredients/">${t("ing.hero", L)}</a></p>
          <h1>${title}</h1>
          <p class="lead pillar-tagline">${loc(pageData.tag, L)}</p>
          <p>${loc(pageData.lead, L)}</p>
          <p>${loc(pageData.text, L)}</p>
          ${xpCta(pageData)}
        </div>
      </section>`;
    }
    if (grid) grid.innerHTML = "";
    return;
  }
  if (intro) intro.hidden = false;
  if (list) list.hidden = false;
  if (detail) {
    detail.hidden = true;
    detail.innerHTML = "";
  }
  if (grid) {
    grid.innerHTML = ingFamilies
      .map((id) => {
        const pageData = ingFamilyPages[id];
        return `<a class="xp-child reveal" href="${ingHref(id)}">
          <h2>${getXpTitle(id, L)}</h2>
          <p class="pillar-tagline">${pageData ? loc(pageData.tag, L) : ""}</p>
          <p>${pageData ? loc(pageData.lead, L) : ""}</p>
          <span class="more">${t("metier.more", L)}</span>
        </a>`;
      })
      .join("");
  }
}

function paint() {
  fillNavLabels();
  renderHome();
  renderGamme();
  renderProduit();
  renderComposer();
  renderNews();
  renderPartners();
  renderXp();
  renderSolutionHub();
  renderIngredients();
  setupAtelierNav();
  setupMotion();
  hydrateMedia();
  requestAnimationFrame(fitPillarHeadings);
}

function hydrateMedia(root = document) {
  root.querySelectorAll("img").forEach((img) => {
    const show = (cached) => {
      if (cached) img.classList.add("is-cached");
      img.classList.add("is-loaded");
    };
    if (img.complete && img.naturalWidth > 0) {
      show(true);
      return;
    }
    img.addEventListener("load", () => show(false), { once: true });
    img.addEventListener("error", () => show(false), { once: true });
  });
}

window.addEventListener("fournor:lang", paint);
window.addEventListener("resize", fitPillarHeadings);
if (document.fonts?.ready) document.fonts.ready.then(fitPillarHeadings);
setupFilters();
setupGammeSearch();
setupContact();
setupHeroVideo();
paint();

document.querySelectorAll(".ring").forEach((el) => {
  if (el.querySelector("svg")) return;
  const pct = Number(el.dataset.pct);
  el.insertAdjacentHTML("afterbegin", ringSvg(pct));
});

function setupHeroVideo() {
  const video = document.querySelector("video.hero-bg");
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const play = () => {
    if (reduce.matches) return;
    video.play().catch(() => {});
  };
  const pause = () => video.pause();

  const applyPref = () => {
    if (reduce.matches) pause();
    else play();
  };

  applyPref();
  if (typeof reduce.addEventListener === "function") {
    reduce.addEventListener("change", applyPref);
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else pause();
      },
      { threshold: 0.15 }
    );
    io.observe(video);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
    else play();
  });
}

function setupMotion() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.__foIo && !reduce) {
    window.__foIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            window.__foIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }
  document.querySelectorAll(".reveal, .p-card, .e-card, .value, .partner-list li").forEach((el) => {
    if (el.closest("#atelier-rail")) return;
    el.classList.add("reveal");
    if (reduce) {
      el.classList.add("is-in");
      return;
    }
    window.__foIo.observe(el);
  });
}
