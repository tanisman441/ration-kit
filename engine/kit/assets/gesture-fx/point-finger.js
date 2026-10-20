// gesture-fx/point-finger — sağa işaret eden el; `at` anında parmak içeri basar, uçta halka flaşı patlar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bilek hizasıdır, parmak sağa uzar.
export default {
  name: 'point-finger',
  category: 'gesture-fx',
  desc: 'Sağa işaret eden el; tıklama anında parmak içeri basar, parmak ucunda halka flaşı patlar',
  tags: ['işaret', 'parmak', 'tıkla', 'tıklama', 'göster', 'point', 'finger', 'tap', 'click', 'indicate'],
  box: [-170, -95, 170, 95],
  bleed: 55,
  anchor: 'bilek hizası (0,0); parmak sağa uzar',
  points: { tip: [112, -18], wrist: [-150, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'el rengi' },
    at: { type: 'time', default: null, desc: 'tıklama anı: parmak basar + halka flaşı' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = 6, OUT = k.rgba('bg', 0.55);
    const sh = (n, f = 0.88) => { const c = k.col(n); return `rgb(${c.map(v => Math.max(0, Math.round(v * f))).join(',')})`; };
    const blob = (x, y, w, h, r, n) => {
      ctx.fillStyle = sh(n); ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = OUT; ctx.beginPath(); k.rrect(x - O / 2, y - O / 2, w + O, h + O, r + O / 2); ctx.fill();
      ctx.fillStyle = k.rgba(n); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, n) => {
      ctx.fillStyle = sh(n); ctx.beginPath(); ctx.ellipse(x + 6, y + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = OUT; ctx.beginPath(); ctx.ellipse(x, y, rx + O / 2, ry + O / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(n); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, n) => {
      ctx.strokeStyle = sh(n); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1 + 6, y1 + 6); ctx.lineTo(x2 + 6, y2 + 6); ctx.stroke();
      ctx.strokeStyle = OUT; ctx.lineWidth = w + O; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba(n); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const sheen = (x, y, rx, ry, a = 0.11) => {
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.4, 0, k.TAU); ctx.fill();
    };

    // ANİMASYON — idle: hafif nefes (±2.5); `at`: 0.12 sn'de parmak 10 birim içeri basar, yayla geri döner, uçta halka flaşı
    const d = p.at == null ? -1 : t - p.at;
    const bob = Math.sin(t * k.TAU / 2.4) * 2.5;
    let pressX = 0, ring = 0, flash = 0;
    if (d >= 0 && d < 0.7) {
      if (d < 0.12) pressX = -10 * (d / 0.12);
      else pressX = -10 * (1 - k.E.outBack((d - 0.12) / 0.58, 2));
      ring = Math.max(0, 1 - d / 0.5);
      flash = Math.max(0, 1 - d / 0.2);
    }

    const tipX = 112 + pressX, tipY = -18 + bob;

    blob(-170, -30 + bob, 62, 60, 14, 'panel2');   // kol manşeti
    blob(-112, -46 + bob, 100, 92, 26, p.color);   // avuç
    sheen(-72, -32 + bob, 26, 11);
    disc(4, 14 + bob, 12, 12, p.color);            // kıvrık parmak boğumları
    disc(30, 20 + bob, 12, 12, p.color);
    disc(56, 14 + bob, 12, 12, p.color);
    limb(-60, 28 + bob, -24, 42 + bob, 20, p.color); // başparmak
    limb(-16, -18 + bob, tipX - 16, -18 + bob, 24, p.color); // işaret parmağı
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-92, -44 + bob); ctx.quadraticCurveTo(-78, -20 + bob, -92, 6 + bob); ctx.stroke();

    if (flash > 0) k.glow(tipX, tipY, 40 * (1 - flash) + 22, 'accent', 0.5 * flash);
    if (ring > 0) {
      const g = 1 - ring;
      ctx.strokeStyle = k.rgba('accent', 0.85 * ring); ctx.lineWidth = 7 * ring + 2;
      ctx.beginPath(); ctx.arc(tipX, tipY, 20 + g * 44, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('accent', 0.5 * ring); ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        const a = -0.6 + i * 0.4, r0 = 30 + g * 44, r1 = r0 + 12;
        ctx.beginPath();
        ctx.moveTo(tipX + Math.cos(a) * r0, tipY + Math.sin(a) * r0);
        ctx.lineTo(tipX + Math.cos(a) * r1, tipY + Math.sin(a) * r1);
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
