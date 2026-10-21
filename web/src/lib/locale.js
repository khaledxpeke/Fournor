export const locales = ["fr", "en", "ar"];
export const defaultLocale = "fr";
export const site = "https://fournor.com";

export function localePath(locale, path = "/") {
  let clean = path.startsWith("/") ? path : `/${path}`;
  if (!clean.endsWith("/")) clean = `${clean}/`;
  if (!locale || locale === defaultLocale) return clean;
  if (clean === "/") return `/${locale}/`;
  return `/${locale}${clean}`;
}

export function localizeHref(locale, href) {
  if (!href || !href.startsWith("/") || href.startsWith("//")) return href;
  return localePath(locale, href);
}

export function loc(value, locale) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.fr ?? value.en ?? "";
}

export function absolute(path) {
  return new URL(path, `${site}/`).href;
}

export function alternates(path) {
  return {
    fr: localePath("fr", path),
    en: localePath("en", path),
    ar: localePath("ar", path),
  };
}
