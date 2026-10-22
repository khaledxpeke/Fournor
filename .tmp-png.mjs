import fs from "fs";
import zlib from "zlib";

function decodePng(buf) {
  let o = 8;
  const idats = [];
  let w = 0;
  let h = 0;
  while (o < buf.length) {
    const len = buf.readUInt32BE(o);
    o += 4;
    const type = buf.toString("ascii", o, o + 4);
    o += 4;
    const data = buf.subarray(o, o + len);
    o += len + 4;
    if (type === "IHDR") {
      w = data.readUInt32BE(0);
      h = data.readUInt32BE(4);
    } else if (type === "IDAT") {
      idats.push(data);
    } else if (type === "IEND") break;
  }
  const raw = zlib.inflateSync(Buffer.concat(idats));
  const bpp = 4;
  const stride = w * bpp;
  const out = Buffer.alloc(h * stride);
  let src = 0;
  let prev = Buffer.alloc(stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[src++];
    const row = Buffer.alloc(stride);
    for (let i = 0; i < stride; i++) {
      const x = raw[src++];
      const a = i >= bpp ? row[i - bpp] : 0;
      const b = prev[i];
      const c = i >= bpp ? prev[i - bpp] : 0;
      let v = x;
      if (filter === 1) v = (x + a) & 255;
      else if (filter === 2) v = (x + b) & 255;
      else if (filter === 3) v = (x + ((a + b) >> 1)) & 255;
      else if (filter === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        const pr = pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
        v = (x + pr) & 255;
      }
      row[i] = v;
    }
    row.copy(out, y * stride);
    prev = row;
  }
  return { w, h, out };
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function encodePng(w, h, rgba) {
  const stride = w * 4;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

function knockOutBlack(src) {
  const { w, h, out } = decodePng(src);
  const rgba = Buffer.from(out);
  const bg = new Uint8Array(w * h);
  const q = [];
  const dark = (i) => {
    const o = i * 4;
    return rgba[o] < 22 && rgba[o + 1] < 22 && rgba[o + 2] < 22;
  };
  const push = (i) => {
    if (bg[i] || !dark(i)) return;
    bg[i] = 1;
    q.push(i);
  };
  for (let x = 0; x < w; x++) {
    push(x);
    push((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    push(y * w);
    push(y * w + w - 1);
  }
  while (q.length) {
    const i = q.pop();
    const x = i % w;
    const y = (i - x) / w;
    if (x > 0) push(i - 1);
    if (x + 1 < w) push(i + 1);
    if (y > 0) push(i - w);
    if (y + 1 < h) push(i + w);
  }
  for (let i = 0; i < bg.length; i++) {
    if (bg[i]) rgba[i * 4 + 3] = 0;
  }
  for (let pass = 0; pass < 2; pass++) {
    const clear = [];
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        const o = i * 4;
        if (rgba[o + 3] === 0) continue;
        if (rgba[o] > 36 || rgba[o + 1] > 36 || rgba[o + 2] > 36) continue;
        const n =
          rgba[(i - 1) * 4 + 3] === 0 ||
          rgba[(i + 1) * 4 + 3] === 0 ||
          rgba[(i - w) * 4 + 3] === 0 ||
          rgba[(i + w) * 4 + 3] === 0;
        if (n) clear.push(i);
      }
    }
    for (const i of clear) rgba[i * 4 + 3] = 0;
  }
  return encodePng(w, h, rgba);
}

const logoIn =
  "C:/Users/Gaming Gear TN/.cursor/projects/d-Projects-fournor-Fournor/assets/c__Users_Gaming_Gear_TN_AppData_Roaming_Cursor_User_workspaceStorage_ecb7095054008df4adb7af42e234b4b4_images_Objet_dynamique_vectoriel-e112d868-bd1d-4d70-9ada-81a99f8ab16a.png";
const iconIn =
  "C:/Users/Gaming Gear TN/.cursor/projects/d-Projects-fournor-Fournor/assets/c__Users_Gaming_Gear_TN_AppData_Roaming_Cursor_User_workspaceStorage_ecb7095054008df4adb7af42e234b4b4_images_icon-11d774b2-3ccf-4e64-bb6a-2f97521bd9ab.png";

fs.writeFileSync("d:/Projects/fournor/Fournor/public/logo-footer.png", knockOutBlack(fs.readFileSync(logoIn)));
const icon = knockOutBlack(fs.readFileSync(iconIn));
fs.writeFileSync("d:/Projects/fournor/Fournor/public/favicon.png", icon);
fs.writeFileSync("d:/Projects/fournor/Fournor/public/apple-touch-icon.png", icon);
console.log("written", fs.statSync("d:/Projects/fournor/Fournor/public/logo-footer.png").size, fs.statSync("d:/Projects/fournor/Fournor/public/favicon.png").size);
