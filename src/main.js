import "./styles/main.css";
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

function productCard(p) {
  const L = lang();
  return `<a class="p-card" href="/produit.html?id=${p.id}">
    <div class="p-card-img">
      <img src="${p.image}" alt="${p.name[L]}" />
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
    <div class="e-card-img"><img src="${e.image}" alt="${e.title[L]}"/></div>
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
  if (rail) rail.innerHTML = products.map(productCard).join("");
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

function renderGamme() {
  const grid = document.getElementById("gamme-grid");
  if (!grid) return;
  const L = lang();
  const current = document.querySelector(".filters [aria-pressed='true']")?.dataset.filter || "all";
  const query = fold(document.getElementById("gamme-search")?.value.trim());
  const list = products.filter((p) => {
    const byDose = current === "all" || String(p.dosage) === current;
    return byDose && matchesGammeQuery(p, query);
  });
  grid.innerHTML = list.map(productCard).join("");
  const empty = document.getElementById("gamme-empty");
  if (empty) {
    empty.hidden = list.length > 0;
    empty.textContent = t("gamme.empty", L);
  }
}

function setupFilters() {
  document.querySelectorAll(".filters [data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters [data-filter]").forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      renderGamme();
    });
  });
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
  root.innerHTML = `
    <div class="prod-hero">
      <div class="prod-photo">
        <img src="${p.image}" alt="${p.name[L]}" />
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
      </div>
    </div>
    <div class="prod-grid">
      <article><h2 data-i18n="prod.adds">${t("prod.adds", L)}</h2><p>${p.adds[L]}</p></article>
      <article><h2 data-i18n="prod.sensory">${t("prod.sensory", L)}</h2><p>${p.sensory[L]}</p></article>
      <article><h2 data-i18n="prod.target">${t("prod.target", L)}</h2><p>${p.target[L]}</p></article>
      <article><h2 data-i18n="prod.usage">${t("prod.usage", L)}</h2><p data-i18n="prod.usageText">${t("prod.usageText", L)}</p></article>
    </div>
    <p><a class="btn btn-ghost" href="/gamme.html" data-i18n="prod.back">${t("prod.back", L)}</a></p>
    <h2 class="section-title" data-i18n="prod.other">${t("prod.other", L)}</h2>
    <div class="card-grid">${products.filter((x) => x.id !== p.id).slice(0, 3).map(productCard).join("")}</div>
  `;
}

function renderComposer() {
  const select = document.getElementById("composer-select");
  const visual = document.getElementById("composer-visual");
  if (!select || !visual) return;
  const L = lang();
  if (!select.dataset.ready) {
    select.innerHTML = products
      .map((p) => `<option value="${p.id}">${p.name.fr} · ${p.dosage}%</option>`)
      .join("");
    select.dataset.ready = "1";
    select.addEventListener("change", renderComposer);
  }
  const p = getProduct(select.value);
  const flour = 100 - p.dosage;
  select.querySelectorAll("option").forEach((opt) => {
    const prod = getProduct(opt.value);
    opt.textContent = `${prod.name[L]} · ${prod.dosage}%`;
  });
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
  if (!rail || !prev || !next) return;

  const L = lang();
  prev.setAttribute("aria-label", t("atelier.prev", L));
  next.setAttribute("aria-label", t("atelier.next", L));

  const step = () => {
    const card = rail.querySelector(".p-card");
    return (card?.getBoundingClientRect().width || 240) + 20;
  };

  const update = () => {
    const max = rail.scrollWidth - rail.clientWidth - 4;
    prev.disabled = rail.scrollLeft <= 4;
    next.disabled = rail.scrollLeft >= max;
  };

  if (!rail.dataset.navReady) {
    rail.dataset.navReady = "1";
    prev.addEventListener("click", () => {
      rail.scrollBy({ left: -step() * 2, behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      rail.scrollBy({ left: step() * 2, behavior: "smooth" });
    });
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    rail.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        rail.scrollBy({ left: step() * 2, behavior: "smooth" });
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        rail.scrollBy({ left: -step() * 2, behavior: "smooth" });
      }
    });
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
    el.classList.add("reveal");
    if (reduce) {
      el.classList.add("is-in");
      return;
    }
    window.__foIo.observe(el);
  });
}
