// food-fx-2/toast-pop — tost makinesi: idle'da ısı dalgası ve hafif sallantı; at anında tost yaylanarak fırlar, dönüp yuvaya düşer.
// NOT: canvas y-aşağıdır; tost yuvadan yukarı (negatif y) fırlar.
export default {
  name: 'toast-pop', category: 'food-fx-2',
  desc: 'Tost makinesi: at anında tost yaylanarak fırlar, havada dönüp yuvaya düşer; boşta ısı dalgası yükselir',
  tags: ['tost', 'tost makinesi', 'ekmek', 'kahvaltı', 'fırlama', 'toast', 'toaster', 'breakfast', 'bread', 'pop up'],
  box: [-140, -205, 140, 125],
  bleed: 60,
  anchor: 'tost makinesi tabanı (0,90)',
  points: { slot: [0, -28], toast: [0, -120], lever: [106, 30] },
  params: {
    at: { type: 'time', default: null, desc: 'fırlama anı (0.9 sn): tost fırlar, döner, yuvaya düşer' },
    brown: { type: 'number', default: 0.6, desc: 'kızarma derecesi 0–1: tostun rengi' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const brown = k.clamp(p.brown ?? 0.6, 0, 1);
    const d = p.at == null ? -1 : t - p.at;
    const popping = d >= 0 && d <= 0.9;
    const g = popping ? k.prog(d, 0, 0.9) : -1;

    // tost yüksekliği ve dönüşü
    const restY = -30;
    let ty = restY, rot = 0;
    if (popping) {
      const up = k.E.outCubic(k.prog(d, 0, 0.3));
      const down = k.E.inCubic(k.prog(d, 0.3, 0.75));
      ty = restY - 145 * up + 145 * down;
      if (d > 0.75) ty -= Math.sin(k.prog(d, 0.75, 0.9) * Math.PI) * 14; // iniş sekmesi
      rot = Math.sin(k.prog(d, 0, 0.9) * Math.PI * 2) * 0.28;
    }
    const idleBob = popping ? 0 : Math.sin(t * 2.1) * 2;
    ty += idleBob;

    // makine sallantısı (fırlamada)
    const shk = popping && d < 0.35 ? Math.sin(d * 60) * 3 * (1 - d / 0.35) : k.noise1(t * 1.8) * 0.8;
    ctx.save(); ctx.translate(shk, 0);

    // --- 1) tost (önce çizilir; gövde alt kısmını kapatır)
    ctx.save(); ctx.translate(0, ty); ctx.rotate(rot);
    const toastPath = () => { k.rrect(-42, 0, 84, 74, 20); };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); toastPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('yellow', 1);
    toastPath(); ctx.fill();
    // kızarma (red overlay)
    ctx.fillStyle = k.rgba('red', brown * 0.42);
    toastPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // iç yumuşak kısım
    ctx.fillStyle = k.rgba('yellow', 0.55);
    k.rrect(-30, 12, 60, 50, 14); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.13)';
    ctx.beginPath(); ctx.ellipse(-20, 18, 14, 8, -0.3, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 2) gövde
    const bodyPath = () => { k.rrect(-100, -20, 200, 110, 26); };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); bodyPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    bodyPath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // ayaklar
    for (let i = -1; i <= 1; i += 2) {
      ctx.fillStyle = k.rgba('ink', 1);
      k.rrect(i * 62 - 11, 90, 22, 16, 7); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    }
    // yuvalar (koyu)
    for (let i = -1; i <= 1; i += 2) {
      ctx.fillStyle = k.rgba('bg', 0.85);
      k.rrect(i * 38 - 31, -30, 62, 18, 8); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    }
    // gösterge ışığı (fırlamada yanar, boşta kırpışır)
    const ledOn = popping ? true : k.hash(Math.floor(t * 1.2)) > 0.45;
    ctx.fillStyle = k.rgba('red', 1);
    ctx.beginPath(); ctx.arc(-78, 52, 10, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = k.rgba('red', ledOn ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(-78, 52, 5, 0, k.TAU); ctx.fill();
    // gövde parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-62, 6, 24, 30, 0.15, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 3) kol (yanda; fırlamada yukarı atar)
    const leverY = popping ? 30 - 44 * k.E.outBack(k.prog(d, 0, 0.25)) : 30 + Math.sin(t * 2.1) * 1.5;
    ctx.fillStyle = k.rgba('bg', 0.7);
    k.rrect(100, -6, 10, 60, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(94, leverY - 9, 30, 18, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();

    // --- 4) idle ısı dalgaları (yuvalardan yükselir)
    if (!popping) {
      for (let i = 0; i < 3; i++) {
        const cyc = 2.6, ph = ((t + i * 0.9) % cyc) / cyc;
        const sx = -38 + i * 38;
        const y0 = -34 - ph * 60;
        const wob = k.noise1(t * 2 + i * 9) * 8;
        ctx.strokeStyle = k.rgba('ink', 0.45 * Math.sin(ph * Math.PI));
        ctx.lineWidth = 4.5 * (1 - ph * 0.5);
        ctx.beginPath();
        ctx.moveTo(sx, -34);
        ctx.bezierCurveTo(sx + wob - 8, y0 + 20, sx - wob + 8, y0 - 4, sx + wob * 0.5, y0 - 16);
        ctx.stroke();
      }
    }

    // --- 5) fırlama efektleri: halka + kırıntı + parıltı
    if (popping) {
      k.glow(0, -30, 60 * (1 - g * 0.5), 'yellow', 0.4 * (1 - k.prog(d, 0, 0.4)));
      const ri = k.prog(d, 0, 0.5);
      if (ri > 0) {
        ctx.strokeStyle = k.rgba('yellow', 0.7 * (1 - ri));
        ctx.lineWidth = 6 * (1 - ri) + 2;
        ctx.beginPath(); ctx.ellipse(0, -24, 40 + ri * 90, 14 + ri * 34, 0, 0, k.TAU); ctx.stroke();
      }
      for (let i = 0; i < 9; i++) {
        const cg = k.prog(d - k.hash(i * 5.5 + 1) * 0.2, 0, 0.6);
        if (cg <= 0) continue;
        const ang = -Math.PI / 2 + (k.hash(i * 3.3 + 4) - 0.5) * 2.4;
        const spd = 80 + k.hash(i * 7.7 + 6) * 120;
        const rise = spd * k.E.outCubic(Math.min(cg * 1.8, 1));
        const fall = 380 * Math.pow(Math.max(cg - 0.35, 0) / 0.65, 2);
        const px = Math.cos(ang) * rise;
        const py = -50 + Math.sin(ang) * rise + fall;
        const fade = 1 - k.prog(cg, 0.6, 1.0);
        if (fade <= 0) continue;
        ctx.fillStyle = k.rgba('yellow', 0.9 * fade);
        ctx.beginPath(); ctx.arc(px, py, 2.5 + k.hash(i * 2.2 + 3) * 3, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
