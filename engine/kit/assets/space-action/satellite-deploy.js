// space-action/satellite-deploy — ana gemiden uydu bırakma: `at` anında uydu kenetlenme
// noktasından ayrılıp sağa süzülürken güneş panelleri açılır, ayrılma kıvılcımı çıkar.
// NOT: canvas y-aşağıdır; (0,0) kenetlenme noktasıdır. Yukarı = negatif y.
export default {
  name: 'satellite-deploy',
  category: 'space-action',
  desc: 'Kenetli uydu anı gelince gemiden ayrılıp süzülürken güneş panellerini açar',
  tags: ['uydu', 'kenetlenme', 'ayrılma', 'güneş paneli', 'uzay gemisi', 'bırakma', 'satellite', 'deploy', 'separation', 'solar panel', 'spacecraft', 'docking'],
  box: [-180, -110, 180, 110],
  bleed: 70,
  anchor: 'kenetlenme noktası (0,0)',
  points: { dock: [-42, 0], sat: [86, 0], hull: [-150, 0] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'ana gövde rengi' },
    at: { type: 'time', default: null, desc: 'ayrılma anı: uydu kopar, paneller 1 sn içinde açılır' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const body = p.color;
    const OUT = 6;
    ctx.save();

    const e = d < 0 ? 0 : k.E.outCubic(k.clamp(d / 1.0));            // ayrılma ilerlemesi (0–1 sn)
    const pan = d < 0 ? 0 : k.E.outBack(k.prog(d, 0.25, 1.25), 1.8); // panel açılımı
    const recoil = 10 * e;                                          // gemi hafif geri teper
    const sx = -6 + 120 * e;                                        // uydu x konumu

    // --- ayrılma kıvılcımı (at'ten sonra 0.5 sn) ---
    if (d >= 0 && d < 0.5) {
      const pe = k.prog(d, 0, 0.5);
      k.glow(-40, 0, 60 * (1 - pe), k.col('yellow'), 0.5 * (1 - pe));
      for (let i = 0; i < 12; i++) {
        const h1 = k.hash(i * 7 + 3), h2 = k.hash(i * 13 + 11), h3 = k.hash(i * 29 + 23);
        const ang = h1 * k.TAU;
        const r = (8 + 70 * pe) * (0.6 + 0.4 * h2);
        ctx.fillStyle = k.rgba(h3 > 0.5 ? 'yellow' : 'cyan', 0.9 * (1 - pe));
        ctx.beginPath();
        ctx.arc(-40 + Math.cos(ang) * r, Math.sin(ang) * r * 0.8, (1.5 + 3.5 * h2) * (1 - pe), 0, k.TAU);
        ctx.fill();
      }
    }

    // --- ana gemi gövdesi (sol) ---
    const hx = -recoil;
    ctx.fillStyle = k.rgba(body, 1);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = OUT;
    k.rrect(hx - 170, -44, 122, 88, 18); ctx.fill(); ctx.stroke();
    // burun kısmı
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = OUT;
    k.rrect(hx - 60, -30, 26, 60, 10); ctx.fill(); ctx.stroke();
    // gövde panel çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.35);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(hx - 130, -44); ctx.lineTo(hx - 130, 44);
    ctx.moveTo(hx - 95, -44); ctx.lineTo(hx - 95, 44);
    ctx.stroke();
    // itici alevi (idle titreme)
    const flame = 0.7 + 0.3 * k.noise1(t * 11);
    k.glow(hx - 170, 0, 26 * flame, k.col('cyan'), 0.4);
    ctx.fillStyle = k.rgba('cyan', 0.75 * flame);
    ctx.beginPath();
    ctx.moveTo(hx - 170, -14);
    ctx.lineTo(hx - 170 - 34 * flame, 0);
    ctx.lineTo(hx - 170, 14);
    ctx.closePath(); ctx.fill();
    // kenetleme lambası (idle yanıp sönme)
    const led = 0.5 + 0.5 * Math.sin(t * 5);
    ctx.fillStyle = k.rgba('green', 0.35 + 0.65 * led);
    ctx.beginPath(); ctx.arc(hx - 40, -30, 6, 0, k.TAU); ctx.fill();
    k.glow(hx - 40, -30, 16, k.col('green'), 0.35 * led);
    // sol üst parlama (premium finish)
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(hx - 130, -24, 44, 18, -0.4, 0, k.TAU); ctx.fill();
    // sağ alt gölge (%12)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(hx - 95, 28, 40, 16, -0.4, 0, k.TAU); ctx.fill();

    // --- uydu ---
    ctx.save();
    ctx.translate(sx, 0);
    const bob = 3 * k.noise1(t * 2.2);                              // idle süzülüş
    ctx.translate(0, bob);
    // gövde
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.lineWidth = OUT;
    k.rrect(-28, -17, 56, 34, 10); ctx.fill(); ctx.stroke();
    // sensör penceresi
    ctx.fillStyle = k.rgba('ink', 0.75);
    ctx.beginPath(); ctx.arc(8, 0, 7, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.beginPath(); ctx.arc(8, 0, 4.5, 0, k.TAU); ctx.fill();
    // çanak anten (idle salınım)
    const sway = 0.25 * k.noise1(t * 1.6);
    ctx.strokeStyle = k.rgba('ink', 0.7);
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-20, -17); ctx.lineTo(-30, -34); ctx.stroke();
    ctx.save();
    ctx.translate(-30, -34); ctx.rotate(-0.5 + sway);
    ctx.fillStyle = k.rgba('cyan', 0.9);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 12, -0.4, Math.PI + 0.4); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    // sinyal lambası (idle blink)
    const blink = k.hash(Math.floor(t * 2)) > 0.5 ? 1 : 0.25;
    ctx.fillStyle = k.rgba('red', blink);
    ctx.beginPath(); ctx.arc(-20, 12, 4, 0, k.TAU); ctx.fill();
    // güneş panelleri (katlı → açık)
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * 28, 0);
      const fold = (1 - pan) * 1.35;                                // katlanma açısı
      ctx.rotate(side * fold);
      ctx.strokeStyle = k.rgba('ink', 0.7);
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(side * 6, 0); ctx.stroke();
      // panel
      ctx.fillStyle = k.rgba('cyan', 1);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      k.rrect(side > 0 ? 6 : -70, -13, 64, 26, 5); ctx.fill(); ctx.stroke();
      // panel hücre çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
      for (let c = 1; c < 4; c++) {
        const cx = side > 0 ? 6 + c * 16 : -70 + c * 16;
        ctx.beginPath(); ctx.moveTo(cx, -13); ctx.lineTo(cx, 13); ctx.stroke();
      }
      // parlama
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath();
      ctx.ellipse(side > 0 ? 20 : -56, -6, 16, 6, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
    }
    // gövde parlama + gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-12, -8, 16, 7, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(12, 9, 15, 6, -0.4, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- uydu iticisi: ayrılma sonrası küçük yanma ---
    if (d >= 0.15 && d < 1.1) {
      const pf = 0.6 + 0.4 * k.noise1(t * 15);
      k.glow(sx - 28, bob, 22 * pf, k.col('yellow'), 0.45);
      ctx.fillStyle = k.rgba('yellow', 0.8 * pf);
      ctx.beginPath();
      ctx.moveTo(sx - 28, bob - 8);
      ctx.lineTo(sx - 28 - 30 * pf, bob);
      ctx.lineTo(sx - 28, bob + 8);
      ctx.closePath(); ctx.fill();
    }

    ctx.restore();
  },
};
