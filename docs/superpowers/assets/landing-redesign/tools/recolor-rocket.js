// Recolor Max (rocket mascot) for the dark theme: remove paw pads, hue-shift body, add a light sticker border.
const sharp = require('sharp');
const fs = require('fs');
const SRC = process.argv[2] || '../../images/2.webp';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
function rgb2hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return [h, mx ? d / mx : 0, mx];
}
function hsv2rgb(h, s, v) {
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

let B;
async function prepare() {
  const { data: rgba, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const data = Buffer.alloc(N * 3); const transparent = new Uint8Array(N);
  for (let i = 0; i < N; i++) { // composite over white so colors are what the artist saw
    const a = rgba[i * 4 + 3] / 255; if (a < 0.04) transparent[i] = 1;
    for (let k = 0; k < 3; k++) data[i * 3 + k] = Math.round(rgba[i * 4 + k] * a + 255 * (1 - a));
  }
  const L = new Float32Array(N), S = new Float32Array(N), Hh = new Float32Array(N), V = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    L[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    const [h, s, v] = rgb2hsv(r, g, b); Hh[i] = h; S[i] = s; V[i] = v;
  }
  const isPink = (i) => S[i] >= 0.07 && L[i] >= 150 && (Hh[i] < 25 || Hh[i] > 320);
  const isYellow = (i) => S[i] >= 0.25 && L[i] >= 150 && Hh[i] > 30 && Hh[i] < 70;
  const bg = new Uint8Array(N); const stack = [];
  for (let i = 0; i < N; i++) if (transparent[i]) { bg[i] = 1; stack.push(i); }
  const push = (x, y) => { const i = y * W + x; if (!bg[i] && L[i] >= 205 && S[i] < 0.14) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
  for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
  while (stack.length) {
    const i = stack.pop(), x = i % W, y = (i / W) | 0;
    if (x > 0) push(x - 1, y); if (x < W - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < H - 1) push(x, y + 1);
  }
  const depth = new Uint8Array(N).fill(99); let q = [];
  for (let i = 0; i < N; i++) if (bg[i]) { depth[i] = 0; q.push(i); }
  for (let d = 1; d <= 4; d++) {
    const nq = [];
    for (const i of q) { const x = i % W, y = (i / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (depth[j] === 99) { depth[j] = d; nq.push(j); } } }
    q = nq;
  }
  // pink components: floating hearts touch the background; paw pads are enclosed
  const lab = new Int32Array(N).fill(-1); const padPx = new Uint8Array(N); const heartPx = new Uint8Array(N);
  for (let s = 0; s < N; s++) {
    if (lab[s] !== -1 || bg[s] || !isPink(s)) continue;
    const px = [s]; lab[s] = 1;
    for (let k = 0; k < px.length; k++) { const i = px[k], x = i % W, y = (i / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (lab[j] === -1 && !bg[j] && isPink(j)) { lab[j] = 1; px.push(j); } } }
    const touches = px.some((i) => depth[i] <= 3);
    px.forEach((i) => { if (touches) heartPx[i] = 1; else padPx[i] = 1; });
  }
  const padZone = new Uint8Array(N); q = [];
  for (let i = 0; i < N; i++) if (padPx[i]) { padZone[i] = 1; q.push(i); }
  for (let d = 0; d < 4; d++) { const nq = [];
    for (const i of q) { const x = i % W, y = (i / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (!padZone[j] && !bg[j]) { padZone[j] = 1; nq.push(j); } } }
    q = nq; }
  const decorZone = new Uint8Array(N); q = [];
  for (let i = 0; i < N; i++) if ((isYellow(i) && S[i] >= 0.4) || heartPx[i]) { decorZone[i] = 1; q.push(i); }
  for (let d = 0; d < 5; d++) { const nq = [];
    for (const i of q) { const x = i % W, y = (i / W) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (!decorZone[j] && !bg[j] && L[j] >= 150) { decorZone[j] = 1; nq.push(j); } } }
    q = nq; }
  // rocket core = blue body/fins plus enclosed holes (eye, mouth, highlights); used to crop away the exhaust
  const blue = new Uint8Array(N);
  for (let i = 0; i < N; i++) blue[i] = !bg[i] && Hh[i] > 190 && Hh[i] < 245 && S[i] >= 0.4 && L[i] >= 115 ? 1 : 0;
  for (let it = 0; it < 3; it++) { // erode so thin anti-aliasing rings do not count as body
    const e = new Uint8Array(blue);
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x;
      if (blue[i] && !(blue[i - 1] && blue[i + 1] && blue[i - W] && blue[i + W])) e[i] = 0; }
    blue.set(e);
  }
  const reach = new Uint8Array(N); const st2 = [];
  const pushR = (x, y) => { const i = y * W + x; if (!reach[i] && !blue[i]) { reach[i] = 1; st2.push(i); } };
  for (let x = 0; x < W; x++) { pushR(x, 0); pushR(x, H - 1); }
  for (let y = 0; y < H; y++) { pushR(0, y); pushR(W - 1, y); }
  while (st2.length) { const i = st2.pop(), x = i % W, y = (i / W) | 0;
    if (x > 0) pushR(x - 1, y); if (x < W - 1) pushR(x + 1, y); if (y > 0) pushR(x, y - 1); if (y < H - 1) pushR(x, y + 1); }
  const coreDist = new Float32Array(N);
  for (let i = 0; i < N; i++) coreDist[i] = blue[i] || !reach[i] ? 0 : 1e9;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; let v = coreDist[i];
    if (x > 0) v = Math.min(v, coreDist[i - 1] + 1); if (y > 0) { v = Math.min(v, coreDist[i - W] + 1); if (x > 0) v = Math.min(v, coreDist[i - W - 1] + 1.414); if (x < W - 1) v = Math.min(v, coreDist[i - W + 1] + 1.414); } coreDist[i] = v; }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const i = y * W + x; let v = coreDist[i];
    if (x < W - 1) v = Math.min(v, coreDist[i + 1] + 1); if (y < H - 1) { v = Math.min(v, coreDist[i + W] + 1); if (x < W - 1) v = Math.min(v, coreDist[i + W + 1] + 1.414); if (x > 0) v = Math.min(v, coreDist[i + W - 1] + 1.414); } coreDist[i] = v; }
  B = { data, W, H, N, L, S, Hh, V, bg, depth, isPink, isYellow, padPx, heartPx, padZone, decorZone, coreDist };
}

// opts: { hue|null, sk, vk, sFloor }  -> returns {full, bodyOnly} raw RGBA buffers
function render(opts) {
  const { data, W, H, N, L, S, Hh, V, bg, depth, isYellow, padPx, heartPx, padZone, decorZone } = B;
  const full = Buffer.alloc(N * 4), body = Buffer.alloc(N * 4);
  const NAVY = [14, 42, 92], YEL = [252, 196, 48], PINK = [250, 140, 160], WHITE = [253, 253, 251];
  const put = (buf, i, c, a) => { buf[i * 4] = c[0]; buf[i * 4 + 1] = c[1]; buf[i * 4 + 2] = c[2]; buf[i * 4 + 3] = Math.round(clamp(a) * 255); };
  for (let i = 0; i < N; i++) {
    if (bg[i]) continue; // alpha 0
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const decor = isYellow(i) || heartPx[i];
    if (depth[i] <= 3) { // fringe against white background: unmix to a pure color + alpha
      let F = NAVY;
      if (decorZone[i]) F = heartPx[i] || (Hh[i] > 300 || Hh[i] < 25) && S[i] > 0.05 ? PINK : YEL;
      else if (isYellow(i) || (S[i] > 0.2 && L[i] >= 150 && Hh[i] > 30 && Hh[i] < 70)) F = YEL;
      else if (heartPx[i] || (S[i] >= 0.07 && L[i] >= 150 && (Hh[i] < 25 || Hh[i] > 320))) F = PINK;
      const dx = [F[0] - 255, F[1] - 255, F[2] - 255];
      const a = clamp(((r - 255) * dx[0] + (g - 255) * dx[1] + (b - 255) * dx[2]) / (dx[0] ** 2 + dx[1] ** 2 + dx[2] ** 2));
      const isDecor = F !== NAVY;
      put(full, i, F, a); if (!isDecor) put(body, i, F, a);
      continue;
    }
    let c = [r, g, b];
    if ((padPx[i] || (padZone[i] && L[i] >= 185)) && !heartPx[i]) { const t = Math.max(padPx[i] ? clamp((S[i] - 0.03) / 0.08) : 0, padZone[i] && L[i] >= 185 ? clamp((L[i] - 185) / 25) : 0); c = [lerp(r, WHITE[0], t), lerp(g, WHITE[1], t), lerp(b, WHITE[2], t)]; }
    else if (opts.hue != null && !decor && Hh[i] > 190 && Hh[i] < 245 && S[i] >= 0.2) {
      const w = clamp((L[i] - 60) / 50);
      const sh = hsv2rgb(opts.hue, clamp(Math.max(S[i] * opts.sk, opts.sFloor ?? 0), 0, 0.86), clamp(V[i] * opts.vk));
      c = [lerp(r, sh[0], w), lerp(g, sh[1], w), lerp(b, sh[2], w)];
    }
    put(full, i, c, 1); if (!decor) put(body, i, c, 1);
  }
  return { full, body };
}

async function sticker(rgba, crop, borderPx, noTail = false) {
  const { W, H } = B;
  const p = Math.ceil(borderPx * 1.6) + 4;
  const ext = { top: p, bottom: p, left: p, right: p, background: { r: 0, g: 0, b: 0, alpha: 0 } };
  const rawOpt = { raw: { width: W, height: H, channels: 4 } };
  const T = Math.round(crop.height * 0.030) + 4;
  const cut = (buf) => { const o = Buffer.alloc(crop.width * crop.height * 4);
    for (let y = 0; y < crop.height; y++) for (let x = 0; x < crop.width; x++) {
      const si = (crop.top + y) * W + crop.left + x, di = y * crop.width + x;
      buf.copy(o, di * 4, si * 4, si * 4 + 4);
      if (noTail && B.coreDist[si] > T && !B.decorZone[si]) o[di * 4 + 3] = 0; }
    return o; };
  const rawC = { raw: { width: crop.width, height: crop.height, channels: 4 } };
  const fullC = await sharp(cut(rgba.full), rawC).extend(ext).png().toBuffer();
  const bodyC = await sharp(cut(rgba.body), rawC).extend(ext).png().toBuffer();
  const w = crop.width + 2 * p, h = crop.height + 2 * p;
  const { data: bd } = await sharp(bodyC).raw().toBuffer({ resolveWithObject: true });
  const d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = bd[i * 4 + 3] > 20 ? 0 : 1e9;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; let v = d[i];
    if (x > 0) v = Math.min(v, d[i - 1] + 1); if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + 1.414); if (x < w - 1) v = Math.min(v, d[i - w + 1] + 1.414); } d[i] = v; }
  for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) { const i = y * w + x; let v = d[i];
    if (x < w - 1) v = Math.min(v, d[i + 1] + 1); if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + 1.414); if (x > 0) v = Math.min(v, d[i + w - 1] + 1.414); } d[i] = v; }
  const bl = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) { bl[i * 4] = 242; bl[i * 4 + 1] = 242; bl[i * 4 + 2] = 238; bl[i * 4 + 3] = Math.round(clamp(borderPx + 0.5 - d[i]) * 255); }
  const border = await sharp(bl, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  const out = await sharp(border).composite([{ input: fullC }]).png().toBuffer();
  return sharp(out).trim({ threshold: 4 }).png();
}

const CROPS = {
  main: { left: 100, top: 135, width: 520, height: 640 },
  smile: { left: 695, top: 95, width: 240, height: 255 },
  idle: { left: 970, top: 95, width: 225, height: 255 },
  wink: { left: 690, top: 380, width: 245, height: 250 },
  wow: { left: 970, top: 380, width: 245, height: 250 },
  love: { left: 695, top: 655, width: 245, height: 250 },
  back: { left: 975, top: 655, width: 220, height: 250 },
};
const MAXV = {
  lime: { hue: 73, sk: 1.05, vk: 0.99, sFloor: 0.60 },
  blue: { hue: null, sk: 1, vk: 1 },
};
const CAST = {
  writer: { v: { hue: null, sk: 1, vk: 1 }, from: 'idle' },
  runner: { v: { hue: 28, sk: 1.25, vk: 0.99, sFloor: 0.68 }, from: 'wink' },
  detective: { v: { hue: 265, sk: 1.0, vk: 0.9, sFloor: 0.45 }, from: 'wow' },
  scribe: { v: { hue: 172, sk: 1.0, vk: 0.92, sFloor: 0.55 }, from: 'smile' },
  reporter: { v: { hue: 322, sk: 1.0, vk: 0.98, sFloor: 0.5 }, from: 'love' },
  guard: { v: { hue: 0, sk: 0.1, vk: 0.9, sFloor: 0 }, from: 'idle' },
  pass: { v: { hue: 135, sk: 1.0, vk: 0.92, sFloor: 0.55 }, from: 'smile' },
  fail: { v: { hue: 6, sk: 1.25, vk: 1.0, sFloor: 0.68 }, from: 'wow' },
};

(async () => {
  await prepare();
  console.log('size', B.W, B.H);
  fs.mkdirSync('out2', { recursive: true });
  for (const [vn, v] of Object.entries(MAXV)) {
    const rgba = render(v);
    for (const [cn, c] of Object.entries(CROPS)) {
      const bp = Math.max(4, Math.round(c.height * 0.022));
      await (await sticker(rgba, c, bp)).toFile(`out2/${vn}-${cn}.png`);
    }
  }
  for (const [role, c] of Object.entries(CAST)) {
    const rgba = render(c.v); const crop = CROPS[c.from];
    const bp = Math.max(4, Math.round(crop.height * 0.022));
    await (await sticker(rgba, crop, bp)).toFile(`out2/cast-${role}.png`);
    await (await sticker(rgba, crop, bp, true)).toFile(`out2/cast-${role}-noexhaust.png`);
  }
  {
    const rgba = render(MAXV.lime);
    for (const [cn, c] of Object.entries(CROPS)) {
      await (await sticker(rgba, c, Math.max(4, Math.round(c.height * 0.022)), true)).toFile(`out2/lime-${cn}-noexhaust.png`);
    }
  }
  console.log('done');
})();
