// sports-action/slam-dunk — basketbol smaçı. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) figürün ayakları, pota +x yönünde sağdadır.
export default {
  name: 'slam-dunk',
  category: 'sports-action',
  desc: 'Zıplayıp potaya smaç basan basketbolcu; time-param at anında yükselir, pota sallanır',
  tags: ['smaç', 'smac', 'basketbol', 'basket', 'pota', 'dunk', 'slam dunk', 'basketball', 'hoop', 'jump', 'zıplama'],
  box: [-170, -405, 170, 24],
  bleed: 40,
  anchor: 'figürün ayakları (0,0); pota +x yönünde sağda',
  points: { hoop: [112, -290] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'smaç anı: oyuncu yükselir, topu potaya basar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const easeOut = x => 1 - Math.pow(1 - x, 3);

    const olimb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const oblob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const odisc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;

    // --- pota ---
    const HX0 = 112, HY = -290;
    const swayT = d - 0.55;
    const rimX = swayT > 0 ? 7 * Math.sin(k.TAU * 2.6 * swayT) * Math.exp(-swayT * 2.5) : 0;
    const HX = HX0 + rimX;
    // pano
    oblob(140, -392, 18, 102, 6, k.rgba('panel'));
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.strokeRect(143, -382, 12, 34);
    // çember (kırmızı vurgu)
    ctx.strokeStyle = line; ctx.lineWidth = 7 + LW;
    ctx.beginPath(); ctx.ellipse(HX, HY, 34, 11, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('red'); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.ellipse(HX, HY, 34, 11, 0, 0, k.TAU); ctx.stroke();
    // file (ağ) — çemberle birlikte sallanır
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 2.5;
    for (let i = -1; i <= 1; i++) {
      const tx = HX + i * 22;
      ctx.beginPath(); ctx.moveTo(tx, HY + 8); ctx.quadraticCurveTo(tx * 0.9 + HX * 0.1 + rimX, HY + 52, HX + i * 10 + rimX * 1.4, HY + 64); ctx.stroke();
    }
    ctx.beginPath(); ctx.moveTo(HX - 22, HY + 8); ctx.lineTo(HX + 22, HY + 8); ctx.stroke();

    // --- zemin gölgesi ---
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(-40, -5, 54, 9, 0, 0, k.TAU); ctx.fill();

    // --- oyuncu ---
    // zıplama: 0–0.5s yükseliş (pota yönüne kayma ile), 1.2–1.8s iniş
    const dunkP = d < 0 ? 0 : easeOut(k.clamp(d / 0.5, 0, 1));
    let rise = 0, jx = 0;
    if (d >= 0) {
      if (d < 1.2) { rise = 110 * dunkP; jx = 70 * dunkP; }
      else { const q = easeOut(k.clamp((d - 1.2) / 0.6, 0, 1)); rise = 110 * (1 - q); jx = 70 * (1 - q); }
    }
    const crouch = d < 0 ? 10 * (0.5 + 0.5 * Math.sin((k.TAU * t) / 1.8)) : 0;
    const bob = d < 0 ? 2 * Math.sin((k.TAU * t) / 2.4) : 0;
    const px = -40;

    ctx.save();
    ctx.translate(jx, -rise + crouch * 0.4);
    // bacaklar (zıplamada dizler çekili)
    const kneeBend = 0.9 * dunkP;
    for (const s of [-1, 1]) {
      const hx = px + s * 13, hy = -128;
      const kx = hx + s * 6 + 46 * Math.sin(0.3 - kneeBend), ky = hy + 46 * Math.cos(0.3 - kneeBend);
      const fx = kx + 50 * Math.sin(-0.4 - kneeBend * 0.7), fy = ky + 50 * Math.cos(-0.4 - kneeBend * 0.7);
      olimb(hx, hy, kx, ky, 20, body);
      olimb(kx, ky, fx, fy, 17, body);
      oblob(fx - 14, fy - 13, 28, 13, 6, body);
    }
    // gövde (pota yönüne eğik)
    oblob(px - 31 + 14, -238 + bob, 62, 112, 28, body);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(px + 26, -158 + bob, 12, 40, 0.1, 0, k.TAU); ctx.fill();
    // sol kol (aşağıda, denge)
    olimb(px + 20, -198 + bob, px - 26, -150 + bob, 17, body);
    odisc(px - 26, -150 + bob, 10, 10, body);
    // sağ kol — idle'da aşağıda, smaçta çembere uzanır
    const landP = d < 1.2 ? 0 : easeOut(k.clamp((d - 1.2) / 0.6, 0, 1));
    const reach = dunkP * (1 - landP);
    const shX = px + 20, shY = -200 + bob;
    const dunkHX = (HX - 6) - (px + jx), dunkHY = (HY - 6) - (-rise + crouch * 0.4);
    const handLX = k.lerp(shX + 24, dunkHX, reach), handLY = k.lerp(shY + 42, dunkHY, reach);
    olimb(shX, shY, handLX, handLY, 18, body);
    odisc(handLX, handLY, 11, 11, body);

    // --- top (lokal koordinatlar) ---
    let bx, by;
    if (d < 0) {
      bx = px + 44 + 4 * Math.sin((k.TAU * t) / 2.4); by = shY + 44;
    } else if (d < 0.55) {
      const q = easeOut(k.clamp(d / 0.55, 0, 1));
      bx = k.lerp(px + 44, handLX, q); by = k.lerp(shY + 44, handLY, q);
    } else {
      const q = k.clamp((d - 0.55) / 0.45, 0, 1);
      bx = handLX + rimX * 1.4 + 8 * Math.sin(q * 3); by = k.lerp(handLY, handLY + 68, q * q);
    }
    odisc(bx, by, 13, 13, k.rgba('accent'));
    ctx.strokeStyle = inkC; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(bx - 13, by); ctx.lineTo(bx + 13, by); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bx, by - 13); ctx.lineTo(bx, by + 13); ctx.stroke();
    // baş
    const hbx = px + 14, hby = -246 + bob;
    odisc(hbx, hby, 36, 34, body);
    const blink = (t % 4.1) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = inkC;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 10 + hbx, hby - 2, 4, 4 * blink, 0, 0, k.TAU); ctx.fill(); }
    ctx.strokeStyle = inkC; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(hbx, hby + 12, 10, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hbx - 13, hby - 12, 13, 9, -0.4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(px - 2, -212 + bob, 9, 26, 0.12, 0, k.TAU); ctx.fill();
    ctx.restore();

    // smaç flaşı (mutlak koordinatlar)
    if (d >= 0.45 && d < 0.6) k.glow(HX, HY, 52, 'yellow', 0.55 * (1 - (d - 0.45) / 0.15));
  },
};
