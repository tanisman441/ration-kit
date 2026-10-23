// music-perform/dj-scratch — plak çizdiren DJ: scratch anında plak ileri-geri fırlar, el savrulur.
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'dj-scratch', category: 'music-perform',
  desc: 'Plak çizdiren DJ; scratch anında plak ileri geri fırlar, ses zigzagları çıkar',
  tags: ['dj', 'plak', 'scratch', 'pikab', 'turntable', 'konser', 'müzik', 'dj scratch', 'vinyl', 'concert', 'music'],
  box: [-180, -250, 180, 14],
  bleed: 50,
  anchor: 'zemin (0,0); masanın ortası',
  points: { head: [0, -232], vinyl: [-72, -138] },
  params: {
    color: { type: 'color', default: 'dim' },
    scratch: { type: 'time', default: null, desc: 'scratch anı: plak fırlar, el savrulur (~0.8 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const inkC = k.rgba('ink', 0.8);
    const body = k.rgba(p.color);
    const acc = k.rgba('cyan');
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

    const d = p.scratch == null ? -1 : t - p.scratch;
    const scOn = d >= 0 && d < 0.8;
    const br = Math.sin(t * k.TAU / 2.4) * 1.6;          // nefes
    const blink = (((t + 0.7) % 4.6) < 0.12);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 140, 11, 0, 0, k.TAU); ctx.fill();

    // ---- masa ----
    blob(-150, -112, 300, 22, 8, k.rgba('panel2'));
    limb(-130, -90, -130, -8, 12, k.rgba('panel2'));
    limb(130, -90, 130, -8, 12, k.rgba('panel2'));

    // plak: normalde yavaş döner, scratch'te ileri-geri fırlar
    const vx = -72, vy = -138;
    const spin = t * 2.2;
    const jerk = scOn ? Math.sin(d * 55) * 1.4 * (1 - d / 0.8) : 0;
    ctx.save(); ctx.translate(vx, vy); ctx.rotate(jerk * 0.25);
    ctx.beginPath(); ctx.ellipse(0, 0, 42, 42, 0, 0, k.TAU); ctx.fillStyle = line; ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 0, 39, 39, 0, 0, k.TAU); ctx.fillStyle = k.rgba('ink', 0.92); ctx.fill();
    // yivler
    ctx.strokeStyle = k.rgba('panel', 0.7); ctx.lineWidth = 1.6;
    for (const r of [30, 24, 18]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, k.TAU); ctx.stroke(); }
    // etiket: vurgu rengi, dönme yönünü gösterir
    ctx.save(); ctx.rotate(spin + jerk);
    ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(0, 0, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 1.5); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();
    if (scOn) k.glow(vx, vy, 56, 'cyan', 0.35 * (1 - d / 0.8));

    // mikser: sağda düğmeler + seviye ışıkları
    blob(24, -142, 96, 54, 8, k.rgba('panel'));
    for (let i = 0; i < 4; i++) {
      disc(44 + i * 26, -124, 8, 8, k.rgba('panel2'));
    }
    // seviye çubuğu: scratch'te dans eder
    for (let i = 0; i < 6; i++) {
      const lv = scOn ? Math.abs(Math.sin(d * 22 + i * 1.3)) : (0.3 + 0.25 * Math.sin(t * 6 + i));
      ctx.fillStyle = k.rgba(i < 4 ? 'green' : 'red', 0.9);
      ctx.beginPath(); k.rrect(32 + i * 15, -104 - lv * 34, 10, lv * 34 + 4, 3); ctx.fill();
    }

    // ---- DJ ----
    const hipX = 0, hipY = -96;
    // bacaklar (masanın arkasında, kısmi)
    limb(hipX - 10, hipY, -24, -12, 12, body);
    limb(hipX + 10, hipY, 24, -12, 12, body);
    // gövde
    const ty = -200 - br * 0.4;
    blob(-15, ty, 30, 104, 13, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-7, ty + 16, 7, 14, 0.15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-15 + 20, ty + 104 - 26, 12, 22, 6); ctx.fill();
    // baş
    const hxx = 0, hyy = -232 - br * 0.5;
    disc(hxx, hyy, 20, 19, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(hxx - 7, hyy - 7, 6.5, 4.5, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkC;
    const ey = blink ? 0.8 : 3;
    ctx.beginPath(); ctx.ellipse(hxx - 9, hyy - 2, 3, ey, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hxx + 9, hyy - 2, 3, ey, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = inkC; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(hxx, hyy + 5, 7, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
    // kulaklık (vurgu)
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.arc(hxx, hyy - 3, 24, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.strokeStyle = acc; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(hxx, hyy - 3, 24, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    blob(hxx - 27, hyy - 14, 13, 28, 6, acc);
    blob(hxx + 14, hyy - 14, 13, 28, 6, acc);

    // sol kol: plak üstünde — scratch'te sağa sola savrulur
    const shoX = -13, shoY = -182 - br * 0.4;
    const sway = scOn ? Math.sin(d * 55) * 22 * (1 - d / 0.8) : Math.sin(t * 1.8) * 4;
    const handX = vx + sway, handY = vy - 34;
    limb(shoX, shoY, -42, -164, 11, body);
    limb(-42, -164, handX, handY, 9, body);
    disc(handX, handY, 8.5, 8.5, body);
    // sağ kol: havada salınır
    const rSway = scOn ? 0.4 : Math.sin(t * 1.8 + 1) * 0.25;
    limb(13, shoY, 44, -158 + rSway * 20, 11, body);
    limb(44, -158 + rSway * 20, 62, -186 + rSway * 30, 9, body);
    disc(62, -186 + rSway * 30, 8.5, 8.5, body);

    // ses zigzagları: scratch'te plaktan fırlar
    if (scOn) {
      const g = d / 0.8;
      ctx.strokeStyle = k.rgba('cyan', 0.85 * (1 - g)); ctx.lineWidth = 4;
      for (const s of [-1, 1]) {
        const x0 = vx + s * 46, w = 16 + g * 44;
        ctx.beginPath();
        ctx.moveTo(x0, vy - 20);
        ctx.lineTo(x0 + s * w, vy - 44);
        ctx.lineTo(x0, vy - 68);
        ctx.lineTo(x0 + s * (w + 14), vy - 92);
        ctx.stroke();
      }
    }
  },
};
