// health/ambulance — yandan görünüm ambulans (sağa bakar); kırmızı haç, şerit ve yanıp sönen tepe lambası.
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; zemin (0,0), gövde yukarı uzar.
export default {
  name: 'ambulance', category: 'health',
  desc: 'Yandan ambulans; tepe lambası dönüşümlü yanıp söner, siren anında hızlı flaş + ses dalgaları yayar',
  tags: ['ambulans', 'acil', '112', 'sağlık', 'ambulance', 'emergency', 'siren', 'hastane', 'ilk yardım'],
  box: [-170, -150, 170, 15],
  bleed: 80,
  anchor: 'zemin merkezi (0,0); gövde yukarı uzar',
  points: { front: [115, -55], top: [0, -132], light: [-40, -126] },
  params: {
    color: { type: 'color', default: 'red', desc: 'haç, şerit ve tepe lambası rengi' },
    siren: { type: 'time', default: null, desc: 'siren anı: hızlı flaş + ses dalgaları (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const glass = k.rgba('bg', 0.9);
    const d = p.siren == null ? -1 : t - p.siren;
    const g = d < 0 ? 0 : k.prog(d, 0, 1.2);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const bob = k.noise1(t * 1.2) * 1.5;

    ctx.save();
    ctx.translate(0, bob);

    // gövde
    blob(-150, -105, 265, 85, 12, k.rgba('panel2'));
    // renk şeridi
    ctx.fillStyle = k.rgba(p.color, 0.85);
    ctx.beginPath(); k.rrect(-150, -48, 265, 13, 6); ctx.fill();
    // ön cam (eğimli) + yan cam
    ctx.fillStyle = glass;
    ctx.beginPath();
    ctx.moveTo(62, -95); ctx.lineTo(98, -95); ctx.lineTo(108, -60); ctx.lineTo(62, -60);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); k.rrect(24, -95, 30, 32, 6); ctx.fill();
    // kırmızı haç (yan)
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-92, -92, 26, 58, 5); ctx.fill();
    ctx.beginPath(); k.rrect(-108, -76, 58, 26, 5); ctx.fill();
    // far + stop
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(106, -52, 10, 9, 4); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); k.rrect(-156, -50, 7, 9, 3); ctx.fill();

    // tekerlekler
    const base = k.col('dim');
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.55))).join(',')})`;
    for (const wx of [-100, 70]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(wx, -12, 21 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath(); ctx.arc(wx, -12, 21, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2 + 0.4;
        ctx.beginPath(); ctx.moveTo(wx, -12);
        ctx.lineTo(wx + Math.cos(a) * 12, -12 + Math.sin(a) * 12); ctx.stroke();
      }
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(wx, -12, 5, 0, k.TAU); ctx.fill();
    }

    // tepe lambası: taban + iki kubbe (dönüşümlü flaş)
    blob(-72, -122, 64, 12, 6, k.rgba('dim'));
    const sirenOn = g > 0;
    const phase = sirenOn ? Math.floor(t * 14) % 2 : Math.floor(t * 3) % 2;
    const flash = sirenOn ? 0.35 : 0.3;
    for (const [dx, on] of [[-56, phase === 0], [-24, phase === 1]]) {
      const a = on ? 1 : flash;
      ctx.fillStyle = k.rgba(p.color, a);
      ctx.beginPath(); ctx.arc(dx, -128, 10, 0, k.TAU); ctx.fill();
      if (on) k.glow(dx, -128, 30, p.color, sirenOn ? 0.5 : 0.35);
    }

    // premium parlama (gövde sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-142, -101, 70, 10, 5); ctx.fill();

    ctx.restore();

    // siren ses dalgaları (ön taraftan yayılır)
    if (g > 0) {
      for (let i = 0; i < 3; i++) {
        const gg = k.prog(g, i * 0.22, 1);
        if (gg <= 0) continue;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - gg));
        ctx.lineWidth = 6 * (1 - gg) + 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(118, -58 + bob, 22 + gg * 75, -0.9, 0.9); ctx.stroke();
      }
    }
  },
};
