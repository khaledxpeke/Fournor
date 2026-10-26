export const slots = {
  hero: {
    widths: [640, 720, 960, 1280, 1774],
    sizes: "(max-width: 1872px) calc(100vw - 2rem), 1840px",
    width: 1774,
    height: 887,
  },
  card: {
    widths: [320, 480, 800],
    sizes: "(max-width: 700px) 70vw, 280px",
    width: 800,
    height: 600,
  },
  product: {
    widths: [480, 720, 960, 1200],
    sizes: "(max-width: 860px) 92vw, 480px",
    width: 900,
    height: 900,
  },
  tile: {
    widths: [320, 496, 800],
    sizes: "(max-width: 720px) 80vw, 280px",
    width: 496,
    height: 744,
  },
  page: {
    widths: [480, 800, 1200, 1600],
    sizes: "(max-width: 860px) 92vw, 26rem",
    width: 1600,
    height: 1200,
  },
  pillar: {
    widths: [480, 720, 960],
    sizes: "(max-width: 860px) 92vw, 40vw",
    width: 960,
    height: 720,
  },
  mix: {
    widths: [480, 800, 1200, 1400],
    sizes: "(max-width: 860px) 92vw, 40vw",
    width: 1400,
    height: 932,
  },
  adBand: {
    widths: [640, 1200, 1800, 2400],
    sizes: "(max-width: 1872px) calc(100vw - 2rem), 1840px",
    width: 3500,
    height: 420,
  },
  adTile: {
    widths: [480, 800, 1200, 1920],
    sizes: "(max-width: 800px) 92vw, 25vw",
    width: 1920,
    height: 800,
  },
  adPhoto: {
    widths: [400, 600, 800],
    sizes: "(max-width: 800px) 92vw, 25vw",
    width: 800,
    height: 600,
  },
  franchise: {
    widths: [400, 640, 800],
    sizes: "(max-width: 720px) 92vw, 360px",
    width: 800,
    height: 500,
  },
  partner: {
    widths: [480, 800, 1024],
    sizes: "(max-width: 720px) 80vw, 640px",
    width: 1024,
    height: 341,
  },
  logoClear: {
    widths: [320, 480, 640],
    sizes: "(max-width: 860px) 70vw, 16rem",
    width: 640,
    height: 366,
  },
};

export function isCloudinaryImage(url) {
  return typeof url === "string" && url.includes("/image/upload/") && !/\.pdf(?:$|\?)/i.test(url);
}

export function attachmentHref(url, name) {
  if (!url || !name) return url || "";
  const marker = "/upload/";
  const index = url.indexOf(marker);
  if (index < 0 || !url.includes("://res.cloudinary.com/")) return url;
  const rest = url.slice(index + marker.length);
  if (/(^|\/)fl_attachment:/.test(rest)) return url;
  const filename = String(name)
    .replace(/\.pdf$/i, "")
    .replace(/[^A-Za-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${url.slice(0, index)}${marker}fl_attachment:${filename}/${rest}`;
}

export function cloudinarySrc(url, width) {
  if (!isCloudinaryImage(url)) return url || "";
  const marker = "/image/upload/";
  const index = url.indexOf(marker);
  const rest = url.slice(index + marker.length).replace(/^(?:[a-z]+_[^/,]+,)*[a-z]+_[^/,]+\//, "");
  const transform = width ? `f_auto,q_auto,c_limit,w_${width}` : "f_auto,q_auto";
  return `${url.slice(0, index)}${marker}${transform}/${rest}`;
}

export function srcsetFor(url, widths) {
  if (!isCloudinaryImage(url) || !widths?.length) return undefined;
  return widths.map((width) => `${cloudinarySrc(url, width)} ${width}w`).join(", ");
}

export function displaySrc(url, widths) {
  if (!url) return "";
  if (!isCloudinaryImage(url) || !widths?.length) return url;
  return cloudinarySrc(url, widths[widths.length - 1]);
}

export function preloadFor(url, slotName) {
  const slot = slots[slotName];
  if (!url || !slot) return { href: url || "", srcset: undefined, sizes: undefined };
  return {
    href: displaySrc(url, slot.widths),
    srcset: srcsetFor(url, slot.widths),
    sizes: slot.sizes,
  };
}
