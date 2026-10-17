// engine/kit/film.js — a film described as data instead of drawing code.
//
//   export default film({ theme, brand, lines, scenes: [{ name, from, cues: [{ do: 'icon', ... }] }] })
//
// `lines` is the narration (shown as captions; timed from the voice-over when `timing` is given, otherwise
// estimated from reading speed). Each scene starts at its first line (`from`) and its cues are timed against
// the scene: `at: 0.4` (seconds into the scene), `at: 'kelime'` (when the narration says that word),
// `at: 'kelime+0.3'`, `at: '#id'` / `'#id.end'` (another cue), `at: 'end-0.5'`, `at: '@12'` (absolute).
// Verbs and their props are documented in engine/kit/KIT.md. Everything stays a pure function of t.
import { TAU, clamp, lerp, prog, rgba, hex, E, setFont, rrect, vignette, check, hash, noise1 } from '../core.js';
import { transition, flash, shockRing, glitch, aberrate, aberrationAt, bloom, hud, fitFont } from '../fx.js';

export const THEMES = {
  night: { bg: [10, 11, 20], panel: [22, 24, 40], panel2: [38, 41, 66], ink: [238, 240, 248], dim: [130, 134, 164],
    red: [255, 64, 84], cyan: [64, 212, 255], yellow: [255, 208, 64], green: [74, 232, 144], purple: [168, 120, 255] },
  paper: { bg: [241, 236, 226], panel: [255, 252, 245], panel2: [225, 218, 204], ink: [22, 22, 26], dim: [112, 106, 98],
    red: [230, 58, 46], cyan: [31, 99, 200], yellow: [236, 170, 0], green: [32, 150, 90], purple: [120, 70, 200] },
  mono: { bg: [12, 12, 14], panel: [24, 24, 28], panel2: [44, 44, 52], ink: [240, 240, 236], dim: [128, 128, 136],
    red: [255, 106, 61], cyan: [120, 200, 255], yellow: [255, 214, 90], green: [120, 230, 160], purple: [190, 150, 255] },
};
const FONTS = { disp: "'Archivo Black'", cond: "'Barlow Condensed'", mono: "'JetBrains Mono'", body: "'Inter'" };
const WEIGHT = { disp: 400, cond: 900, mono: 700, body: 700 };
const TRANS = [['bars', 'red'], ['wipe', 'bg'], ['disc', 'cyan'], ['wipe', 'bg'], ['bars', 'yellow'], ['wipe', 'bg']];
const EASES = { out: E.outExpo, inOut: E.inOutCubic, linear: x => x, back: x => E.outBack(x, 1.8) };
const HIT_VERBS = { flash: 0.8, ring: 0.6, shake: 1, hit: 0.7, glitch: 0.9 };

/** Helpers handed to asset draw functions: local coordinates, colours by theme name. Also used by tools/kit-asset.mjs. */
export function assetKitFor(ctx, pal) {
  const col = v => (v == null ? pal.ink : Array.isArray(v) ? v : typeof v === 'string' && v[0] === '#' ? hex(v) : pal[v] ?? pal.accent ?? pal.ink);
  const glow = (x, y, r, c, a) => {
    if (a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col(c), a)); g.addColorStop(1, rgba(col(c), 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  };
  return { pal, col, rgba: (c, a = 1) => rgba(col(c), a), E, hash, noise1, lerp, clamp, prog, TAU, rrect: (x, y, w, h, r) => rrect(ctx, x, y, w, h, r), glow };
}

/** Caption timing from reading speed (cps characters/s) when there is no voice-over timing yet. */
export function narrationTiming(spec) {
  const cps = spec.cps ?? 15, out = []; let t = 0.35;
  spec.lines.forEach((text, i) => {
    if (i && spec.scenes.some(s => s.from === i)) t += 0.2;
    const d = Math.max(1.2, text.length / cps);
    out.push({ t0: t, t1: t + d, text }); t += d + (spec.gap ?? 0.3);
  });
  return out;
}

export function film(spec) {
  const pal = { ...(THEMES[spec.theme] ?? THEMES[spec.theme?.base] ?? THEMES.night), ...(typeof spec.theme === 'object' ? spec.theme : {}) };
  pal.accent ??= pal.red;
  let W = 1080, H = 1920, api = null, LINES = [], SC = [], CAPS = [], HITS = [], ICONS = {}, ASSETS = {};
  const byId = new Map();

  // ───────────── colours, text, small drawing helpers
  const col = v => (v == null ? pal.ink : Array.isArray(v) ? v : typeof v === 'string' && v[0] === '#' ? hex(v) : pal[v] ?? pal.ink);
  const font = f => FONTS[f] ?? f ?? FONTS.disp;
  function T(ctx, s, x, y, { size = 40, f = 'mono', a = 'left', fill = 'ink', stroke = null, lw = 8, alpha = 1 } = {}) {
    setFont(ctx, WEIGHT[f] ?? 700, size, font(f), 0); ctx.textAlign = a; ctx.textBaseline = 'alphabetic';
    ctx.save(); ctx.globalAlpha *= alpha;
    if (stroke) { ctx.lineWidth = lw; ctx.strokeStyle = rgba(col(stroke)); ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
    if (fill) { ctx.fillStyle = rgba(col(fill)); ctx.fillText(s, x, y); }
    ctx.restore();
  }
  const tw = (ctx, s, size, f = 'mono') => { setFont(ctx, WEIGHT[f] ?? 700, size, font(f), 0); return ctx.measureText(s).width; };
  const fit = (ctx, s, maxW, maxPx, f = 'disp') => Math.min(maxPx, fitFont(ctx, s, maxW, maxPx, WEIGHT[f] ?? 400, font(f), 0));
  const typed = (s, t, t0, cps = 32) => s.slice(0, clamp(Math.floor((t - t0) * cps), 0, s.length));
  function glow(ctx, x, y, r, c, a) {
    if (a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col(c), a)); g.addColorStop(1, rgba(col(c), 0));
    ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  function grid(ctx, t, bg, kind = 'grid', g = 90) {
    ctx.fillStyle = rgba(bg); ctx.fillRect(0, 0, W, H);
    if (kind === 'plain') return;
    const light = bg[0] + bg[1] + bg[2] > 380, ln = light ? 'rgba(10,11,20,' : 'rgba(238,240,248,', off = (t * 10) % g;
    if (kind === 'grid') {
      ctx.strokeStyle = ln + (light ? '0.06)' : '0.04)'); ctx.lineWidth = 1.5; ctx.beginPath();
      for (let x = -off; x < W + g; x += g) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = -off; y < H + g; y += g) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();
    }
    ctx.strokeStyle = ln + (light ? '0.2)' : '0.13)'); ctx.lineWidth = 2; ctx.beginPath();
    for (let x = -off; x < W + g; x += g) for (let y = -off; y < H + g; y += g) { ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.moveTo(x, y - 6); ctx.lineTo(x, y + 6); }
    ctx.stroke();
  }
  function pill(ctx, x, y, text, { bg = 'accent', fg = null, size = 28, p = 1, a = 'left', alpha = 1 } = {}) {
    if (p <= 0 || alpha <= 0) return;
    const b = col(bg), f = fg ?? (b[0] * 0.3 + b[1] * 0.59 + b[2] * 0.11 > 150 ? pal.bg : pal.ink);
    const w = tw(ctx, text, size) + 44, h = size + 26, x0 = a === 'center' ? x - w / 2 : a === 'right' ? x - w : x;
    ctx.save(); ctx.globalAlpha *= clamp(p * 3) * alpha; ctx.translate(x0 + w / 2, y); const sc = 0.6 + 0.4 * E.outBack(clamp(p), 2.2); ctx.scale(sc, sc);
    ctx.fillStyle = rgba(b); rrect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.fill();
    T(ctx, text, 0, size * 0.36, { size, a: 'center', fill: f }); ctx.restore();
  }
  function rise(ctx, s, x, base, size, p, q, opt = {}) {
    if (p <= 0 || q >= 1) return;
    ctx.save(); ctx.beginPath(); ctx.rect(0, base - size * 1.1, W, size * 1.45); ctx.clip();
    T(ctx, s, x, base + (1 - p) * size * 1.2 - E.inBack(q, 1.2) * size * 1.3, { size, ...opt }); ctx.restore();
  }
  function iconPath(ctx, name, x, y, size, c, { p = 1, draw = false, lw = 2, fill = null } = {}) {
    const ic = ICONS[name]; if (!ic) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24); ctx.translate(-12, -12);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (fill) { ctx.fillStyle = rgba(col(fill)); ctx.fill(ic.path); }
    if (draw) { ctx.setLineDash([ic.len * clamp(p), ic.len + 1]); }
    ctx.lineWidth = lw + 1.6; ctx.strokeStyle = rgba(pal.bg, 0.55); ctx.stroke(ic.path);
    ctx.lineWidth = lw; ctx.strokeStyle = rgba(col(c)); ctx.stroke(ic.path);
    ctx.restore();
  }
  // (x, y) = feet; height ≈ 330·s
  function person(ctx, x, y, s, c, a = 1, outline = false) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath();
    ctx.roundRect(-44, -132, 38, 132, 14); ctx.roundRect(6, -132, 38, 132, 14); ctx.roundRect(-60, -252, 120, 134, 30);
    ctx.moveTo(38, -292); ctx.arc(0, -292, 38, 0, TAU);
    if (outline) { ctx.setLineDash([12, 10]); ctx.lineWidth = 4 / s; ctx.strokeStyle = rgba(col(c)); ctx.stroke(); }
    else { ctx.fillStyle = rgba(col(c)); ctx.fill(); }
    ctx.restore();
  }
  function hitmark(ctx, x, y, p, c = 'ink', s = 1) {
    if (p <= 0 || p >= 1) return;
    const r0 = (12 + 10 * E.outExpo(p)) * s, r1 = r0 + 24 * s;
    ctx.save(); ctx.globalAlpha *= 1 - E.inCubic(p); ctx.strokeStyle = rgba(col(c)); ctx.lineWidth = 6 * s; ctx.lineCap = 'round'; ctx.beginPath();
    for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { ctx.moveTo(x + dx * r0 * 0.707, y + dy * r0 * 0.707); ctx.lineTo(x + dx * r1 * 0.707, y + dy * r1 * 0.707); }
    ctx.stroke(); ctx.restore();
  }
  const along = (P, u) => {
    const seg = []; let L = 0;
    for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(u) * L;
    for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? d / seg[i] : 0; return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)]; } d -= seg[i]; }
    return P[P.length - 1];
  };

  // ───────────── time
  function sayAt(sc, word) {
    const w = word.toLocaleLowerCase('tr-TR'), pools = [sc.lines, LINES.map((_, i) => i)];
    for (const pool of pools) for (const i of pool) {
      const l = LINES[i], k = l.text.toLocaleLowerCase('tr-TR').indexOf(w);
      if (k >= 0) return l.t0 + (l.t1 - l.t0) * k / l.text.length;
    }
    console.error(`kit: "${word}" not found in narration (scene ${sc.name})`);
    return sc.start;
  }
  function time(v, sc) {
    if (v == null) return null;
    if (typeof v === 'number') return sc.start + v;
    const m = String(v).trim().match(/^(.*?)\s*([+-]\s*\d+(?:\.\d+)?)?$/), base = m[1], off = m[2] ? parseFloat(m[2].replace(/\s/g, '')) : 0;
    if (base === '') return sc.start + off;
    if (base[0] === '@') return parseFloat(base.slice(1)) + off;
    if (base === 'start') return sc.start + off;
    if (base === 'end') return sc.end + off;
    if (base[0] === '#') {
      const [id, part] = base.slice(1).split('.'), c = byId.get(id);
      if (!c) { console.error(`kit: unknown cue #${id}`); return sc.start + off; }
      return (part === 'end' ? c.at + (c.dur ?? 0.6) : part === 'out' ? c.out ?? sc.end : c.at) + off;
    }
    return sayAt(sc, base) + off;
  }

  // ───────────── actors
  const IN = { title: 0.45, text: 0.4, tag: 0.35, step: 0.35, icon: 0.45, figure: 0.45, card: 0.5, list: 0.4, bar: 0.4, counter: 0.3, link: 0.5, track: 0.4, split: 0.5 };
  const vis = (c, t) => {
    const p = prog(t, c.at, c.at + (IN[c.do] ?? 0.4)), q = c.out != null ? prog(t, c.out, c.out + 0.3) : 0;
    return [p, q];
  };
  function posOf(ref, t) {
    if (Array.isArray(ref)) return ref;
    const [id, point] = String(ref).split('.'), c = byId.get(id); if (!c) return [W / 2, H / 2];
    let p = [c.x ?? W / 2, c.y ?? H / 2];
    for (const m of c.moves) { const k = (EASES[m.ease] ?? E.inOutCubic)(prog(t, m.at, m.at + m.dur)); p = [lerp(p[0], m.to[0], k), lerp(p[1], m.to[1], k)]; }
    // 'gun.muzzle' → an asset's named attach point, in frame coordinates
    const a = point && c.do === 'asset' && ASSETS[c.name], pt = a?.points?.[point];
    if (pt) {
      const s = assetScale(c, a) * scaleOf(c, t), r = c.rot ?? 0, fx = c.flip ? -1 : 1, lx = pt[0] * s * fx, ly = pt[1] * s;
      p = [p[0] + lx * Math.cos(r) - ly * Math.sin(r), p[1] + lx * Math.sin(r) + ly * Math.cos(r)];
    }
    return p;
  }
  const assetBox = a => a.box ?? [-100, -100, 100, 100];
  const assetScale = (c, a) => (c.size ?? 300) / (assetBox(a)[2] - assetBox(a)[0]);
  const here = (c, t) => (c.id ? posOf(c.id, t) : [c.x ?? W / 2, c.y ?? H / 2]);
  function scaleOf(c, t) {
    let s = 1;
    for (const m of c.scales) s = lerp(s, m.to, E.inOutCubic(prog(t, m.at, m.at + m.dur)));
    for (const pt of c.pulses) { const d = t - pt; if (d > 0 && d < 0.6) s *= 1 + 0.18 * Math.sin(Math.PI * d / 0.6) * Math.exp(-d * 3); }
    return s;
  }
  function colorOf(c, t, fallback) {
    let k = col(c.color ?? fallback);
    for (const m of c.tints) { const p = prog(t, m.at, m.at + 0.25); if (p > 0) k = [lerp(k[0], col(m.color)[0], p), lerp(k[1], col(m.color)[1], p), lerp(k[2], col(m.color)[2], p)]; }
    return k;
  }
  const flashColor = (c, t) => c.pulses.some(pt => t > pt && t < pt + 0.12);

  const DRAW = {
    title(ctx, c, t) {
      const [p, q] = vis(c, t), rows = String(c.text).split('\n'), center = c.align === 'center';
      const size = c.size ?? Math.min(...rows.map(r => fit(ctx, r, W - 168, rows.length > 1 ? 150 : 120)));
      rows.forEach((r, i) => rise(ctx, r, center ? W / 2 : c.x ?? 84, (c.y ?? 470) + i * size * 1.08, size,
        E.outExpo(prog(t, c.at + i * 0.12, c.at + i * 0.12 + 0.45)), q, { f: 'disp', a: center ? 'center' : 'left', fill: colorOf(c, t, 'ink') }));
    },
    text(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const f = c.font ?? 'mono', size = c.w ? Math.min(c.size ?? 40, fit(ctx, c.text, c.w, c.size ?? 40, f)) : c.size ?? 40, a = c.align ?? 'left';
      const [x, y] = here(c, t), fill = colorOf(c, t, 'ink'), stroke = c.stroke ? 'bg' : null;
      if (c.anim === 'rise') return rise(ctx, c.text, x, y, size, E.outExpo(p), q, { f, a, fill, stroke, lw: size * 0.18 });
      if (c.anim === 'type') return T(ctx, typed(c.text, t, c.at), x, y, { size, f, a, fill, stroke, alpha: 1 - q });
      ctx.save();
      if (c.anim === 'pop') { const s = lerp(0.6, 1, E.outBack(p, 2)) * scaleOf(c, t); ctx.translate(x, y - size * 0.35); ctx.scale(s, s); ctx.translate(-x, -(y - size * 0.35)); }
      else ctx.translate(0, 18 * (1 - E.outExpo(p)));
      T(ctx, c.text, x, y, { size, f, a, fill, stroke, lw: size * 0.18, alpha: clamp(p * 2) * (1 - q) });
      ctx.restore();
    },
    tag(ctx, c, t) {
      const [p, q] = vis(c, t), [x, y] = here(c, t);
      pill(ctx, x, y, c.text, { bg: colorOf(c, t, 'accent'), fg: c.fg ? col(c.fg) : null, size: c.size ?? 28, p, a: c.align ?? 'left', alpha: 1 - q });
    },
    step(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0) return;
      pill(ctx, 84, 300, c.num, { bg: c.color ?? 'accent', size: 26, p, alpha: 1 - q });
      T(ctx, c.label ?? '', 84 + tw(ctx, c.num, 26) + 64, 310, { size: 28, fill: 'dim', alpha: clamp(p * 2) * (1 - q) });
    },
    icon(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const [x, y] = here(c, t), size = c.size ?? 160, k = colorOf(c, t, 'ink');
      const s = (c.anim === 'pop' || !c.anim ? E.outBack(p, 1.8) : 1) * scaleOf(c, t);
      ctx.save(); ctx.globalAlpha *= (c.anim === 'fade' ? p : 1) * (1 - q);
      const g = typeof c.glow === 'number' ? c.glow : c.glow ? 0.35 : 0;
      glow(ctx, x, y, size * 1.1, k, g + c.pulses.reduce((a, pt) => a + 0.4 * clamp(1 - (t - pt) / 0.7) * (t > pt ? 1 : 0), 0));
      if (c.badge) {
        const b = size * 1.3;
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        ctx.fillStyle = rgba(pal.panel); ctx.strokeStyle = rgba(k); ctx.lineWidth = 5; rrect(ctx, -b / 2, -b / 2, b, b, b * 0.22); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      if (s > 0) iconPath(ctx, c.name, x, y, size * s * (c.badge ? 0.72 : 1), flashColor(c, t) ? pal.ink : k, { p: c.anim === 'draw' ? E.inOutCubic(prog(t, c.at, c.at + 0.9)) : 1, draw: c.anim === 'draw', lw: c.lw ?? 2 });
      if (c.label) T(ctx, c.label, x, y + size * (c.badge ? 0.65 : 0.5) + 52, { size: 28, a: 'center', fill: c.labelColor ?? (c.badge ? k : 'dim'), alpha: clamp(p * 2) });
      ctx.restore();
    },
    figure(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const [x, y] = here(c, t), s = (c.size ?? 330) / 330 * scaleOf(c, t);
      person(ctx, x, y + 40 * (1 - E.outExpo(p)), s, flashColor(c, t) ? pal.ink : colorOf(c, t, 'red'), clamp(p * 2) * (1 - q) * (c.alpha ?? 1), c.outline);
    },
    card(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const [x, y] = here(c, t), w = c.w ?? 860, rows = c.rows ?? [], h = 64 + rows.length * 74 + 30, k = colorOf(c, t, 'cyan');
      const s = lerp(0.85, 1, E.outBack(p, 1.6)) * scaleOf(c, t);
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= clamp(p * 2) * (1 - q);
      ctx.fillStyle = rgba(pal.panel); rrect(ctx, -w / 2, -h / 2, w, h, 30); ctx.fill(); ctx.strokeStyle = rgba(k, 0.7); ctx.lineWidth = 4; ctx.stroke();
      ctx.fillStyle = rgba(k); rrect(ctx, -w / 2, -h / 2, w, 64, [30, 30, 0, 0]); ctx.fill();
      T(ctx, c.title ?? '', -w / 2 + 30, -h / 2 + 44, { size: 26, fill: 'bg' });
      if (c.note) T(ctx, c.note, w / 2 - 30, -h / 2 + 44, { size: 24, a: 'right', fill: 'bg' });
      rows.forEach(([key, val, rc], i) => {
        const r0 = c.rowTimes[i], rp = E.outExpo(prog(t, r0 - 0.1, r0 + 0.3)); if (rp <= 0) return;
        const yy = -h / 2 + 124 + i * 74;
        ctx.save(); ctx.globalAlpha *= rp; ctx.translate(-40 * (1 - rp), 0);
        T(ctx, key, -w / 2 + 40, yy, { size: 30, fill: 'dim' });
        T(ctx, val, -w / 2 + 40 + (c.keyW ?? 220), yy, { size: 32, fill: rc ?? 'ink' });
        ctx.restore();
      });
      ctx.restore();
    },
    list(ctx, c, t) {
      const [, q] = vis(c, t); if (q >= 1) return;
      const x = c.x ?? 84, w = c.w ?? W - 168, rh = c.rowH ?? 108;
      c.items.forEach((s, i) => {
        const t0 = c.itemTimes[i], p = E.outExpo(prog(t, t0 - 0.2, t0 + 0.25)); if (p <= 0) return;
        const y = (c.y ?? 670) + i * (rh + 20);
        ctx.save(); ctx.globalAlpha *= p * (1 - q); ctx.translate(60 * (1 - p), 0);
        ctx.fillStyle = rgba(pal.panel); rrect(ctx, x, y, w, rh, 24); ctx.fill();
        const k = colorOf(c, t, 'accent');
        if (c.num !== false) T(ctx, String(i + 1).padStart(2, '0'), x + 28, y + rh * 0.7, { size: 64, f: 'cond', fill: k });
        T(ctx, s, x + (c.num !== false ? 116 : 36), y + rh * 0.61, { size: c.size ?? 32, fill: 'ink' });
        const cp = c.check ? E.outBack(prog(t, t0 + 0.5, t0 + 0.8), 2) : 0;
        if (cp > 0) { ctx.save(); ctx.translate(x + w - 52, y + rh / 2); ctx.scale(cp, cp); ctx.fillStyle = rgba(pal.green); ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fill(); check(ctx, 0, 0, 13, pal.bg, 6); ctx.restore(); }
        ctx.restore();
      });
    },
    bar(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const x = c.x ?? 240, y = c.y ?? 820, w = c.w ?? 600, h = c.h ?? 40, max = c.max ?? 100;
      const k = E.outExpo(prog(t, c.changeAt, c.changeAt + (c.dur ?? 0.8))), v = lerp(c.from ?? max, c.to ?? c.from ?? max, k);
      const ghost = lerp(c.from ?? max, c.to ?? c.from ?? max, E.inOutCubic(prog(t, c.changeAt + 0.45, c.changeAt + 1.1)));
      ctx.save(); ctx.globalAlpha *= clamp(p * 2) * (1 - q);
      T(ctx, `${c.label ?? ''} ${Math.round(v)}${c.suffix ?? ''}`.trim(), x, y - 24, { size: 40, fill: 'ink' });
      if (c.note) T(ctx, c.note, x + w, y - 24, { size: 24, a: 'right', fill: 'dim' });
      ctx.fillStyle = rgba(pal.panel2); rrect(ctx, x, y, w, h, 12); ctx.fill();
      ctx.fillStyle = rgba(pal.ink, 0.8); rrect(ctx, x, y, Math.max(h, w * ghost / max), h, 12); ctx.fill();
      ctx.fillStyle = rgba(c.color ? colorOf(c, t) : v / max > 0.5 ? pal.green : pal.red); rrect(ctx, x, y, Math.max(h, w * v / max * E.outExpo(p)), h, 12); ctx.fill();
      const d = (c.from ?? max) - (c.to ?? max), fp = prog(t, c.changeAt, c.changeAt + 1.2);
      if (d && fp > 0 && fp < 1) T(ctx, `${d > 0 ? '−' : '+'}${Math.abs(Math.round(d))}`, x + w * 0.8, y + h + 150 - 60 * E.outExpo(fp), { size: 80, f: 'cond', fill: d > 0 ? 'red' : 'green', stroke: 'bg', lw: 10, alpha: 1 - E.inCubic(fp) });
      ctx.restore();
    },
    counter(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const v = lerp(c.from ?? 0, c.to ?? 0, E.outExpo(prog(t, c.at, c.at + (c.dur ?? 1))));
      const [x, y] = here(c, t), s = scaleOf(c, t), size = c.size ?? 140;
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      T(ctx, `${c.prefix ?? ''}${v.toFixed(c.decimals ?? 0)}${c.suffix ?? ''}`, 0, 0, { size, f: c.font ?? 'cond', a: c.align ?? 'center', fill: colorOf(c, t, 'ink'), alpha: clamp(p * 3) * (1 - q) });
      ctx.restore();
    },
    link(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const P = [posOf(c.from, t), ...(c.via ?? []), posOf(c.to, t)], k = colorOf(c, t, 'dim'), u = E.outExpo(p);
      ctx.save(); ctx.globalAlpha *= (c.alpha ?? 0.6) * (1 - q); ctx.strokeStyle = rgba(k); ctx.lineWidth = c.lw ?? 4;
      if (c.dashed !== false) { ctx.setLineDash([12, 12]); ctx.lineDashOffset = c.flow === false ? 0 : -t * 50; }
      ctx.beginPath(); ctx.moveTo(...P[0]);
      const end = along(P, u);
      let acc = 0, L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      for (let i = 1; i < P.length; i++) { acc += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (acc / L <= u) ctx.lineTo(...P[i]); else { ctx.lineTo(...end); break; } }
      ctx.stroke(); ctx.setLineDash([]);
      if (c.nodes !== false) for (const [x, y] of c.via ?? []) {
        ctx.fillStyle = rgba(pal.panel2); ctx.beginPath(); ctx.arc(x, y, 26, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(k); ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = rgba(k); ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
      }
      if (c.label) { const [lx, ly] = along(P, 0.5); T(ctx, c.label, lx, ly + 70, { size: 28, a: 'center', fill: 'dim' }); }
      ctx.restore();
    },
    packet(ctx, c, t) {
      const fl = prog(t, c.at, c.at + (c.dur ?? 0.8)), P = [posOf(c.from, t), ...(c.via ?? []), posOf(c.to, t)], k = colorOf(c, t, 'cyan');
      if (fl > 0 && fl < 1) { const [x, y] = along(P, E.inOutCubic(fl)); glow(ctx, x, y, 70, k, 0.5); ctx.fillStyle = rgba(k); rrect(ctx, x - 16, y - 16, 32, 32, 8); ctx.fill(); if (c.label) T(ctx, c.label, x, y - 40, { size: 24, a: 'center', fill: k }); }
      if (c.ring !== false) shockRing(ctx, ...P[P.length - 1], t, c.at + (c.dur ?? 0.8), { color: k, radius: 240, width: 18 });
    },
    beam(ctx, c, t) {
      const d = t - c.at, life = c.dur ?? 0.9; if (d < 0 || d > life) return;
      const a = posOf(c.from, t), b = posOf(c.to, t), u = E.outExpo(clamp(d / 0.2)), fade = 1 - clamp((d - 0.25) / (life - 0.25)), k = colorOf(c, t, 'yellow');
      ctx.save(); ctx.globalAlpha *= fade; ctx.lineCap = 'round';
      ctx.strokeStyle = rgba(k, 0.35); ctx.lineWidth = (c.lw ?? 6) * 3; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(lerp(a[0], b[0], u), lerp(a[1], b[1], u)); ctx.stroke();
      ctx.strokeStyle = rgba(k); ctx.lineWidth = c.lw ?? 6; ctx.stroke(); ctx.restore();
    },
    asset(ctx, c, t) {
      const a = ASSETS[c.name]; if (!a) return;
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const [x, y] = here(c, t), k0 = c.anim === 'fade' || c.anim === 'none' ? 1 : E.outBack(p, 1.6), s = assetScale(c, a) * k0 * scaleOf(c, t);
      ctx.save(); ctx.globalAlpha *= (c.anim === 'fade' ? p : clamp(p * 3)) * (1 - q);
      ctx.translate(x, y); ctx.rotate(c.rot ?? 0); ctx.scale(s * (c.flip ? -1 : 1), s);
      a.draw(ctx, t - c.at, c.params, assetKit(ctx));
      ctx.restore();
    },
    hit(ctx, c, t) { const [x, y] = here(c, t); hitmark(ctx, x + (c.dx ?? 0), y + (c.dy ?? 0), prog(t, c.at, c.at + 0.6), c.color ?? 'ink', c.size ?? 1.4); },
    ring(ctx, c, t) { const [x, y] = here(c, t); shockRing(ctx, x, y, t, c.at, { color: col(c.color ?? 'accent'), radius: c.radius ?? 320, width: c.width ?? 22 }); },
    track(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const x = c.x ?? 84, y = c.y ?? 1100, w = c.w ?? W - 168, n = c.n ?? 8, k = colorOf(c, t, 'cyan'), step = c.step ?? 0.08;
      ctx.save(); ctx.globalAlpha *= 1 - q;
      ctx.strokeStyle = rgba(pal.dim, 0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w * E.outExpo(p), y); ctx.stroke();
      for (let i = 0; i < n; i++) {
        const tp = E.outBack(prog(t, c.at + 0.2 + i * step, c.at + 0.45 + i * step), 2); if (tp <= 0) continue;
        const xx = x + (n > 1 ? w * i / (n - 1) : w / 2), mk = c.marks?.find(m => m.i === i), mc = mk ? col(mk.color ?? 'yellow') : k;
        ctx.fillStyle = rgba(mc); ctx.fillRect(xx - 4, y - 26 * tp, 8, 52 * tp);
        if (mk?.label) T(ctx, mk.label, xx, y - 50, { size: 24, a: 'center', fill: mc, alpha: tp });
      }
      if (c.label) T(ctx, c.label, x, y + 70, { size: 28, fill: 'dim', alpha: p });
      if (c.cursor) { const u = clamp((t - time(c.cursor.from ?? 0, c.sc)) / (c.cursor.dur ?? 2)); ctx.fillStyle = rgba(pal.ink); rrect(ctx, x + w * u - 3, y - 44, 6, 88, 3); ctx.fill(); }
      ctx.restore();
    },
    split(ctx, c, t) {
      const [p, q] = vis(c, t); if (p <= 0 || q >= 1) return;
      const y0 = c.y ?? 640, y1 = c.y1 ?? 1420, [l, r] = c.labels ?? ['', ''];
      ctx.save(); ctx.globalAlpha *= 1 - q;
      ctx.strokeStyle = rgba(pal.dim, 0.4); ctx.lineWidth = 3; ctx.setLineDash([10, 12]); ctx.beginPath(); ctx.moveTo(W / 2, y0); ctx.lineTo(W / 2, lerp(y0, y1, E.outExpo(p))); ctx.stroke(); ctx.setLineDash([]);
      pill(ctx, W / 4, y0 + 10, l, { bg: c.colors?.[0] ?? 'panel2', size: 26, p, a: 'center' });
      pill(ctx, W * 3 / 4, y0 + 10, r, { bg: c.colors?.[1] ?? 'cyan', size: 26, p: prog(t, c.at + 0.15, c.at + 0.5), a: 'center' });
      ctx.restore();
    },
    draw(ctx, c, t) {
      if (t < c.at || (c.out != null && t > c.out + 0.3)) return;
      c.fn(ctx, { t, at: c.at, p: clamp((t - c.at) / (c.dur ?? 1)), scene: c.sc, W, H, pal, col, text: T, icon: (name, x, y, size, color, o) => iconPath(ctx, name, x, y, size, color, o), pill: (x, y, s, o) => pill(ctx, x, y, s, o), person: (x, y, s, color, a, o) => person(ctx, x, y, s, color, a, o), glow: (x, y, r, color, a) => glow(ctx, x, y, r, color, a), E, prog, lerp, clamp, rgba: (c, a = 1) => rgba(col(c), a), posOf: ref => posOf(ref, t) });
    },
  };
  const assetKit = ctx => assetKitFor(ctx, pal);

  // verbs that change other actors instead of drawing
  const MODIFIERS = new Set(['move', 'scale', 'pulse', 'tint', 'hide']);
  const FRAME_FX = new Set(['flash', 'shake', 'glitch']);

  // ───────────── compile
  function buildCaps(c) {
    setFont(c, 700, 32, FONTS.mono, 0); CAPS = [];
    LINES.forEach(ln => {
      const words = ln.text.split(' '), rows = []; let cur = '';
      for (const w of words) { const s = cur ? cur + ' ' + w : w; if (c.measureText(s).width > W - 200 && cur) { rows.push(cur); cur = w; } else cur = s; }
      rows.push(cur);
      const n = ln.text.length; let acc = 0;
      for (let i = 0; i < rows.length; i += 2) {
        const ch = rows.slice(i, i + 2), len = ch.join(' ').length + 1, t0 = ln.t0 + (ln.t1 - ln.t0) * acc / n; acc += len;
        CAPS.push({ t0, t1: i + 2 >= rows.length ? ln.t1 + 0.3 : ln.t0 + (ln.t1 - ln.t0) * acc / n, rows: ch, first: i === 0 });
      }
    });
  }
  function captions(ctx, t) {
    const cp = CAPS.find(c => t >= c.t0 && t < c.t1); if (!cp) return;
    const p = cp.first ? E.outExpo(prog(t, cp.t0, cp.t0 + 0.25)) : 1, lh = 46, h = cp.rows.length * lh + 34, cy = spec.captionY ?? H * 0.8125, y0 = cy - h / 2 + 10 * (1 - p);
    ctx.save(); ctx.globalAlpha = p;
    ctx.fillStyle = rgba(pal.bg, 0.84); rrect(ctx, 70, y0, W - 140, h, 22); ctx.fill();
    ctx.fillStyle = rgba(pal.accent); rrect(ctx, 70, y0, 10, h, 5); ctx.fill();
    cp.rows.forEach((s, i) => T(ctx, s, W / 2 + 5, y0 + 49 + i * lh, { size: 32, a: 'center', fill: 'ink' }));
    ctx.restore();
  }

  async function setup(a) {
    api = a; W = a.W; H = a.H;
    LINES = spec.timing ?? narrationTiming(spec);
    spec.scenes.forEach((s, i) => {
      const prev = i ? spec.scenes[i - 1].from ?? 0 : -1;
      if (!Number.isInteger(s.from ?? 0) || (s.from ?? 0) < 0 || (s.from ?? 0) >= LINES.length || (s.from ?? 0) <= prev)
        throw new Error(`kit: scene "${s.name}" has from=${s.from}; it must be the index of its first line in lines (0…${LINES.length - 1}), increasing scene by scene`);
    });
    const starts = spec.scenes.map((s, i) => s.at ?? (i === 0 ? 0 : LINES[s.from].t0 - 0.3));
    const dur = spec.duration ?? a.duration;
    SC = spec.scenes.map((s, i) => ({ ...s, i, start: starts[i], end: i + 1 < starts.length ? starts[i + 1] : dur,
      lines: LINES.map((_, k) => k).filter(k => k >= (s.from ?? 0) && k < (spec.scenes[i + 1]?.from ?? LINES.length)) }));

    // icons: only the ones this film uses; length measured once for draw-on
    const all = await (await fetch('/engine/kit/icons.json')).json(), used = new Set();
    const walk = o => { if (o && typeof o === 'object') { if (o.do === 'icon' && o.name) used.add(o.name); Object.values(o).forEach(walk); } };
    walk(spec.scenes); (spec.icons ?? []).forEach(n => used.add(n));
    const usedAssets = new Set(), walkA = o => { if (o && typeof o === 'object') { if (o.do === 'asset' && o.name) usedAssets.add(o.name); Object.values(o).forEach(walkA); } };
    walkA(spec.scenes);
    for (const n of usedAssets) {
      try { ASSETS[n] = (await import(`/engine/kit/assets/${n}.js`)).default; }
      catch (e) { console.error(`kit: unknown asset "${n}" (${e.message})`); }
    }
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    for (const n of used) {
      if (!all[n]) { console.error(`kit: unknown icon "${n}"`); continue; }
      svg.setAttribute('d', all[n]); ICONS[n] = { path: new Path2D(all[n]), len: svg.getTotalLength() };
    }

    // cues: resolve times in order, so '#id' can only point backwards (keeps it simple and predictable)
    for (const sc of SC) {
      sc.cues = (sc.cues ?? []).map(c => ({ ...c, sc, moves: [], scales: [], pulses: [], tints: [] }));
      for (const c of sc.cues) {
        c.at = time(c.at ?? 0, sc);
        if (c.id) byId.set(c.id, c);
        if (c.out != null) c.out = time(c.out, sc);
        if (c.do === 'card') c.rowTimes = (c.rows ?? []).map((_, i) => c.rowsAt?.[i] != null ? time(c.rowsAt[i], sc) : c.at + 0.35 + i * (c.step ?? 0.35));
        if (c.do === 'list') c.itemTimes = c.items.map((_, i) => c.itemsAt?.[i] != null ? time(c.itemsAt[i], sc) : c.at + i * (c.step ?? 0.5));
        if (c.do === 'asset' && ASSETS[c.name]) {
          const P = ASSETS[c.name].params ?? {};
          c.params = Object.fromEntries(Object.entries(P).map(([key, d]) => [key, c.params?.[key] ?? d.default]));
          for (const [key, d] of Object.entries(P)) if (d.type === 'time' && c.params[key] != null) c.params[key] = time(c.params[key], sc) - c.at;
        }
        if (c.do === 'bar') c.changeAt = c.changeAt != null ? time(c.changeAt, sc) : c.at + 0.4;
        const target = c.target && byId.get(c.target);
        if (MODIFIERS.has(c.do) && !target) console.error(`kit: ${c.do} → unknown target ${c.target}`);
        if (c.do === 'move' && target) target.moves.push({ at: c.at, dur: c.dur ?? 0.6, to: c.to, ease: c.ease });
        if (c.do === 'scale' && target) target.scales.push({ at: c.at, dur: c.dur ?? 0.5, to: c.to });
        if (c.do === 'pulse' && target) target.pulses.push(c.at);
        if (c.do === 'tint' && target) target.tints.push({ at: c.at, color: c.color });
        if (c.do === 'hide' && target) target.out = c.at;
        if (HIT_VERBS[c.do] && c.shake !== false) HITS.push([c.at, (c.strength ?? 1) * HIT_VERBS[c.do]]);
      }
      // a title leaves when the next title of the scene arrives
      const titles = sc.cues.filter(c => c.do === 'title');
      titles.forEach((c, i) => { if (c.out == null && titles[i + 1]) c.out = titles[i + 1].at - 0.2; });
      HITS.push([sc.start + 0.3, 0.5]);
    }
    buildCaps(document.createElement('canvas').getContext('2d'));
  }

  const sceneAt = t => { let s = SC[0]; for (const x of SC) if (t >= x.start) s = x; return s; };
  function camera(t) {
    let s = 1, dx = 0, dy = 0, r = 0;
    for (const [t0, str] of HITS) {
      const d = t - t0; if (d < 0 || d > 0.7) continue;
      const k = Math.exp(-d * 9) * str;
      s += 0.03 * k; dx += Math.sin(d * 97 + t0 * 5.1) * 14 * k; dy += Math.cos(d * 83 + t0 * 3.7) * 12 * k; r += Math.sin(d * 61 + t0) * 0.006 * k;
    }
    return { s, dx, dy, r };
  }

  return {
    spec,
    /** suggested project duration: last narration line + a short tail */
    duration: () => { const L = spec.timing ?? narrationTiming(spec); return Math.ceil((L[L.length - 1].t1 + (spec.tail ?? 2.5)) * 4) / 4; },
    setup,
    draw(ctx, t) {
      const sc = sceneAt(t), cam = camera(t), bg = col(sc.bg && sc.bg !== 'grid' && sc.bg !== 'dots' && sc.bg !== 'plain' ? sc.bg : 'bg');
      ctx.fillStyle = rgba(bg); ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(W / 2 + cam.dx, H / 2 + cam.dy); ctx.rotate(cam.r); ctx.scale(cam.s, cam.s); ctx.translate(-W / 2, -H / 2);
      grid(ctx, t, bg, sc.pattern ?? (sc.bg === 'dots' || sc.bg === 'plain' ? sc.bg : 'grid'));
      for (const [x, y, c, r] of sc.glow ?? []) glow(ctx, x, y, r ?? 480, c, 0.12);
      for (const c of sc.cues) if (DRAW[c.do] && !MODIFIERS.has(c.do)) DRAW[c.do](ctx, c, t);
      ctx.restore();
      for (const s of SC.slice(1)) {
        if (s.transition === 'none') continue;
        const [kind, color] = s.transition ? [s.transition, s.tcolor ?? 'accent'] : TRANS[(s.i - 1) % TRANS.length];
        const k = kind === 'disc' ? 'disc' : kind === 'bars' ? 'bars' : 'skew';
        transition(ctx, W, H, t, { mid: s.start, color: col(color), stripe: kind === 'wipe' ? col('accent') : null,
          cover: { kind: k, dur: 0.3, dir: s.i % 2 ? 1 : -1 }, reveal: { kind: k === 'disc' ? 'skew' : k, axis: k === 'disc' ? 'y' : 'x', dir: k === 'disc' ? -1 : s.i % 2 ? 1 : -1, dur: 0.4 } });
      }
      for (const s of SC) for (const c of s.cues) {
        if (c.do === 'flash') flash(ctx, W, H, t, c.at, c.peak ?? 0.35, 0.06, col(c.color ?? 'yellow'));
        if (c.do === 'glitch') glitch(ctx, W, H, t, c.at, { colors: [pal.accent, pal.ink] });
      }
    },
    post(ctx, t, a) {
      const sc = sceneAt(t), light = (b => b[0] + b[1] + b[2] > 380)(col(sc.bg && !['grid', 'dots', 'plain'].includes(sc.bg) ? sc.bg : 'bg'));
      if (spec.captions !== false) captions(ctx, t);
      if (spec.brand) hud(ctx, a, t, { theme: light ? 'light' : 'dark', accent: pal.accent, brand: spec.brand, scene: sc.label ?? sc.name.toLocaleUpperCase('tr-TR'), spec: `${W}×${H} · ${a.fps} FPS` });
      bloom(ctx, W, H, { alpha: 0.12 });
      aberrate(ctx, W, H, aberrationAt(t, HITS.filter(h => h[1] >= 0.8)));
      vignette(ctx, W, H, 0.35);
    },
  };
}
