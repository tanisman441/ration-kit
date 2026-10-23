// music-perform/guitar-shred — elektro gitarla solo atan gitarist: shred anında hızlı pençe + nota fışkırması.
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'guitar-shred', category: 'music-perform',
  desc: 'Elektro gitarla solo atan gitarist; shred anında kol hızlı çalar, notalar fışkırır',
  tags: ['gitar', 'gitarist', 'solo', 'konser', 'müzik', 'elektro gitar', 'guitar', 'guitarist', 'solo', 'shred', 'concert', 'music'],
  box: [-170, -290, 170, 14],
  bleed: 80,
  anchor: 'ayaklar (0,0); gitaristin ortası',
  points: { head: [8, -218], guitar: [36, -120] },
  params: {
    color: { type: 'color', default: 'dim' },
    shred: { type: 'time', default: null, desc: 'shred anı: pençe hızlı çalar, 8 nota fışkırır (~0.9 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const acc = k.rgba('purple');
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const note = (x, y, s, a) => {
      ctx.fillStyle = k.rgba('purple', a);
      ctx.beginPath(); ctx.ellipse(x, y, 7 * s, 5 * s, -0.3, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('purple', a); ctx.lineWidth = 3 * s;
      ctx.beginPath(); ctx.moveTo(x + 6 * s, y - 2 * s); ctx.lineTo(x + 6 * s, y - 22 * s); ctx.stroke();
      ctx.fillStyle = k.rgba('purple', a);
      ctx.beginPath();
      ctx.moveTo(x + 6 * s, y - 22 * s);
      ctx.quadraticCurveTo(x + 16 * s, y - 20 * s, x + 15 * s, y - 10 * s);
      ctx.lineTo(x + 11 * s, y - 11 * s);
      ctx.quadraticCurveTo(x + 11 * s, y - 16 * s, x + 6 * s, y - 17 * s);
      ctx.closePath(); ctx.fill();
    };

    const d = p.shred == null ? -1 : t - p.shred;
    const shredOn = d >= 0 && d < 0.9;
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;          // nefes
    const blink = (((t + 1.3) % 4.1) < 0.12);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 62, 9, 0, 0, k.TAU); ctx.fill();

    // bacaklar
    limb(-8, -88, -20, -12, 12, body);
    limb(8, -88, 22, -12, 12, body);
    blob(-30, -13, 24, 13, 6, body);
    blob(12, -13, 24, 13, 6, body);

    // gövde (baş genişliği 40 → gövde boyu 104, oran 1:2.6)
    const ty = -192 - br * 0.4;
    blob(-15, ty, 30, 104, 13, body);
    // gölge (sağ alt %12) + parlama (sol üst %10)
    const bcol = k.col(p.color);
    ctx.fillStyle = `rgba(0,0,0,0.12)`;
    ctx.beginPath(); k.rrect(-15 + 20, ty + 104 - 26, 12, 22, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-7, ty + 16, 7, 14, 0.15, 0, k.TAU); ctx.fill();

    // gitar (dönecek, sola doğru boynu uzanır)
    const gw = Math.sin(t * 1.3) * 2;                    // hafif salınım
    ctx.save();
    ctx.translate(36, -118 + gw);
    ctx.rotate(-0.5);
    blob(-26, -28, 52, 58, 16, acc);                     // gövde (vurgu)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-12, -14, 8, 16, -0.2, 0, k.TAU); ctx.fill();
    blob(-16, -104, 16, 82, 7, k.rgba('panel2'));        // boyun
    blob(-22, -116, 28, 16, 6, acc);                    // kafa
    const strumY = shredOn ? Math.sin(d * 90) * 9 : Math.sin(t * 4) * 2;
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(0, -10 + strumY, 10, 12, 0, 0, k.TAU); ctx.fill();  // delik
    ctx.restore();

    // sol kol: boyuna uzanır
    limb(-6, -176, -44, -150, 11, body);
    limb(-44, -150, -62, -182, 9, body);
    disc(-62, -182, 8, 8, body);

    // sağ kol: pençe — shred'de hızlı çalar
    const shoX = 12, shoY = -176 - br * 0.4;
    const hx = 34 + (shredOn ? Math.sin(d * 90) * 8 : 0);
    const hy = -118 + strumY + (shredOn ? Math.cos(d * 90) * 6 : 0);
    limb(shoX, shoY, 26, -148, 11, body);
    limb(26, -148, hx, hy, 9, body);
    disc(hx, hy, 8, 8, body);
    if (shredOn) {
      k.glow(hx, hy, 22, 'purple', 0.4 * (1 - d / 0.9));
      ctx.strokeStyle = k.rgba('purple', 0.5 * (1 - d / 0.9)); ctx.lineWidth = 3;
      for (const s of [-1, 1]) {
        ctx.beginPath(); ctx.arc(hx + s * 12, hy, 10 + d * 26, -0.6, 0.6); ctx.stroke();
        ctx.beginPath(); ctx.arc(hx, hy + s * 12, 10 + d * 26, 1.1, 2.0); ctx.stroke();
      }
    }

    // baş
    const hxx = 8, hyy = -218 - br * 0.5;
    disc(hxx, hyy, 20, 19, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hxx - 7, hyy - 7, 6.5, 4.5, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkC;
    const ey = blink ? 0.8 : 3;
    ctx.beginPath(); ctx.ellipse(hxx - 9, hyy - 2, 3, ey, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hxx + 9, hyy - 2, 3, ey, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hxx, hyy + 6, 7, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();  // coşkulu gülümseme

    // nota fışkırması: shred'de 0.9 sn'de yükselip söner
    if (shredOn) {
      const g = d / 0.9;
      for (let i = 0; i < 8; i++) {
        const h1 = k.hash(i * 7 + 3), h2 = k.hash(i * 13 + 7), h3 = k.hash(i * 29 + 1);
        const rise = (20 + h2 * 70) * k.prog(g);
        const px = 36 + (h1 - 0.5) * 90 + Math.sin(d * 8 + i) * 8;
        const py = -150 - rise;
        note(px, py, 0.8 + h3 * 0.5, 0.95 * (1 - g));
      }
    } else {
      // boştayken tek tek yavaşça yükselen notalar (canlı his)
      for (let i = 0; i < 3; i++) {
        const a = ((t * 0.35 + i * 0.33) % 1);
        const px = 36 + (k.hash(i * 5) - 0.5) * 70 + Math.sin(t * 2 + i * 2) * 6;
        const py = -150 - a * 90;
        note(px, py, 0.7, 0.55 * (1 - a));
      }
    }
  },
};
