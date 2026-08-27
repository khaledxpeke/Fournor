import { mountLayout } from "./layout.js";
import { getLang } from "./i18n.js";
import { products, events, dosageMeta, partners, getProduct } from "./products.js";
import { t } from "./i18n.js";

const page = document.body.dataset.page || "home";
mountLayout(page === "produit" ? "gamme" : page);

const lang = () => getLang();

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

function productCard(p, { decoy = false } = {}) {
  const L = lang();
  const extra = decoy ? ' aria-hidden="true" tabindex="-1"' : "";
  return `<a class="p-card" href="/produit.html?id=${p.id}"${extra}>
    <div class="p-card-img">
      <img src="${p.image}" alt="${p.name[L]}" width="800" height="600" loading="lazy" decoding="async" />
      <span class="photo-badge">${p.dosage}%</span>
    </div>
    <div class="p-card-body">
      <span class="badge">${p.dosage}%</span>
      <h3>${p.name[L]}</h3>
      <p>${p.promise[L]}</p>
      <span class="more" data-i18n="gamme.more">${t("gamme.more", L)}</span>
    </div>
  </a>`;
}

function eventCard(e) {
  const L = lang();
  const d = new Intl.DateTimeFormat(L === "fr" ? "fr-TN" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(e.date));
  return `<article class="e-card">
    <div class="e-card-img"><img src="${e.image}" alt="${e.title[L]}" width="360" height="240" loading="lazy" decoding="async"/></div>
    <div>
      <p class="kicker">${d} · ${e.place[L]}</p>
      <h3>${e.title[L]}</h3>
      <p>${e.text[L]}</p>
    </div>
  </article>`;
}

function renderHome() {
  const L = lang();
  const rail = document.getElementById("atelier-rail");
  if (rail) {
    rail.innerHTML =
      products.map((p) => productCard(p)).join("") +
      products.map((p) => productCard(p, { decoy: true })).join("");
  }
  const news = document.getElementById("home-news");
  if (news) news.innerHTML = events.slice(0, 3).map(eventCard).join("");
  document.querySelectorAll("[data-dosage-label]").forEach((el) => {
    const d = Number(el.dataset.dosageLabel);
    el.textContent = dosageMeta[d].label[L];
  });
  document.querySelectorAll("[data-dosage-blurb]").forEach((el) => {
    const d = Number(el.dataset.dosageBlurb);
    el.textContent = dosageMeta[d].blurb[L];
  });
}

function fold(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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
      p.name.fr,
      p.name.en,
      p.promise.fr,
      p.promise.en,
      p.sensory.fr,
      p.sensory.en,
      p.target.fr,
      p.target.en,
    ].join(" ")
  );
  return query.split(/\s+/).every((word) => hay.includes(word));
}

function currentMix() {
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
  syncGammeView();
  if (isGammeHub()) return;
  const L = lang();
  const mix = currentMix();
  const query = fold(document.getElementById("gamme-search")?.value.trim());
  const list = products.filter((p) => p.mix === mix && matchesGammeQuery(p, query));
  grid.innerHTML = list.map(productCard).join("");
  const empty = document.getElementById("gamme-empty");
  if (empty) {
    empty.hidden = list.length > 0;
    empty.textContent = t("gamme.empty", L);
  }
  hydrateMedia(grid);
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

function renderProduit() {
  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id);
  const L = lang();
  const root = document.getElementById("produit");
  if (!root) return;
  document.title = `${p.name[L]} — Fourn’Or`;
  const videoBlock = p.video
    ? `<section class="prod-video" id="prod-video">
        <p class="kicker">${t("prod.video", L)}</p>
        <h2>${t("prod.videoTitle", L)}</h2>
        <div class="prod-video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${p.video}"
            title="${p.name[L]}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>`
    : "";
  const sheetBtn = p.sheet
    ? `<a class="btn btn-gold" href="${p.sheet}" target="_blank" rel="noopener noreferrer">
        <svg class="btn-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3.5h6.5L18.5 9v11.5H7V3.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M13.5 3.5V9H18.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
          <path d="M9.5 13.5h5M9.5 16.5h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
        ${t("prod.download", L)}
      </a>`
    : "";
  root.innerHTML = `
    <div class="prod-hero">
      <div class="prod-photo">
        <img src="${p.image}" alt="${p.name[L]}" width="900" height="900" fetchpriority="high" decoding="async" />
      </div>
      <div class="prod-intro">
        <p class="kicker" data-i18n="prod.kicker">${t("prod.kicker", L)}</p>
        <h1>${p.name[L]}</h1>
        <p class="sku">${p.sku}</p>
        <p class="lead">${p.promise[L]}</p>
        <div class="prod-mix">
          ${ringSvg(p.dosage)}
          <div>
            <p class="badge">${p.dosage}%</p>
            <p>${dosageMeta[p.dosage].blurb[L]}</p>
          </div>
        </div>
        <div class="prod-actions">
          ${sheetBtn}
          ${p.video ? `<a class="btn btn-ghost" href="#prod-video">${t("prod.watch", L)}</a>` : ""}
        </div>
      </div>
    </div>
    <div class="prod-specs">
      <div class="prod-spec-main">
        <article>
          <h3>${t("prod.composition", L)}</h3>
          <p>${p.composition[L]}</p>
        </article>
        <article class="prod-spec-weight">
          <h3>${t("prod.weight", L)}</h3>
          <p>${p.weight}</p>
        </article>
      </div>
      <div class="prod-spec-grid">
        <article><h3>${t("prod.adds", L)}</h3><p>${p.adds[L]}</p></article>
        <article><h3>${t("prod.sensory", L)}</h3><p>${p.sensory[L]}</p></article>
        <article><h3>${t("prod.target", L)}</h3><p>${p.target[L]}</p></article>
        <article><h3>${t("prod.usage", L)}</h3><p>${t("prod.usageText", L)}</p></article>
      </div>
    </div>
    ${videoBlock}
    <p><a class="btn btn-ghost" href="/gamme.html" data-i18n="prod.back">${t("prod.back", L)}</a></p>
    <h2 class="section-title" data-i18n="prod.other">${t("prod.other", L)}</h2>
    <div class="card-grid">${products.filter((x) => x.id !== p.id).slice(0, 3).map(productCard).join("")}</div>
  `;
}

function composerLabel(p, L) {
  return `${p.name[L]} · ${p.dosage}%`;
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
  wrap.innerHTML = `
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
    <p class="mix-note">${p.promise[L]}</p>
  `;
}

function renderNews() {
  const list = document.getElementById("news-list");
  if (list) list.innerHTML = events.map(eventCard).join("");
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
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const L = lang();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const msg = form.message.value.trim();
    const note = document.getElementById("form-note");
    const ok = name && msg && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    note.textContent = ok ? t("contact.ok", L) : t("contact.error", L);
    note.className = ok ? "form-note is-ok" : "form-note is-err";
    if (ok) form.reset();
  });
}

function setupAtelierNav() {
  const rail = document.getElementById("atelier-rail");
  const prev = document.getElementById("atelier-prev");
  const next = document.getElementById("atelier-next");
  const stage = rail?.closest(".atelier-stage");
  if (!rail || !prev || !next) return;

  const L = lang();
  prev.setAttribute("aria-label", t("atelier.prev", L));
  next.setAttribute("aria-label", t("atelier.next", L));

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const looping = !reduceMotion && rail.querySelectorAll(".p-card").length > products.length;

  const step = () => {
    const card = rail.querySelector(".p-card");
    return (card?.getBoundingClientRect().width || 240) + 20;
  };

  const wrapScroll = () => {
    if (!looping) return;
    const loop = rail.scrollWidth / 2;
    if (loop <= 0) return;
    if (rail.scrollLeft >= loop) rail.scrollLeft -= loop;
    else if (rail.scrollLeft < 0) rail.scrollLeft += loop;
  };

  const update = () => {
    wrapScroll();
    if (looping) {
      prev.disabled = false;
      next.disabled = false;
      return;
    }
    const max = rail.scrollWidth - rail.clientWidth - 4;
    prev.disabled = rail.scrollLeft <= 4;
    next.disabled = rail.scrollLeft >= max;
  };

  if (!rail.dataset.navReady) {
    rail.dataset.navReady = "1";

    const go = (dir) => {
      rail.classList.add("is-manual");
      rail.scrollBy({ left: dir * step() * 2, behavior: "smooth" });
      window.setTimeout(() => rail.classList.remove("is-manual"), 700);
    };

    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    rail.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    });

    if (!reduceMotion) {
      rail.classList.add("is-autoplay");
      let paused = false;
      let inView = true;
      let resumeAt = 0;
      let last = 0;
      const speed = 42;

      const hold = (ms = 4500) => {
        paused = true;
        resumeAt = performance.now() + ms;
      };

      const tick = (now) => {
        if (!last) last = now;
        const dt = Math.min(now - last, 48);
        last = now;
        if (paused && now >= resumeAt && !stage?.matches(":hover") && !rail.matches(":focus-within")) {
          paused = false;
        }
        if (!paused && inView && !document.hidden && !rail.classList.contains("is-manual")) {
          rail.scrollLeft += (speed * dt) / 1000;
          wrapScroll();
        }
        requestAnimationFrame(tick);
      };

      stage?.addEventListener("mouseenter", () => hold(999999));
      stage?.addEventListener("mouseleave", () => hold(400));
      rail.addEventListener("pointerdown", () => hold(5000));
      rail.addEventListener("wheel", () => hold(5000), { passive: true });
      prev.addEventListener("click", () => hold(5000));
      next.addEventListener("click", () => hold(5000));
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) hold(999999);
        else hold(600);
      });

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
          },
          { threshold: 0.12 }
        );
        io.observe(rail);
      }

      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(update);
}

function paint() {
  renderHome();
  renderGamme();
  renderProduit();
  renderComposer();
  renderNews();
  renderPartners();
  setupAtelierNav();
  setupMotion();
  hydrateMedia();
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
setupFilters();
setupGammeSearch();
setupContact();
paint();

document.querySelectorAll(".ring").forEach((el) => {
  if (el.querySelector("svg")) return;
  const pct = Number(el.dataset.pct);
  el.insertAdjacentHTML("afterbegin", ringSvg(pct));
});

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
