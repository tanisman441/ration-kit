// observatory-fx/moon-phases — `phase` paramıyla ay evresi: yeni ay → dolunay → son dördün; evre halkası ilerlemeyi gösterir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ay diskinin merkezi.
export default {
  name: 'moon-phases', category: 'observatory-fx',
  desc: 'Ay evreleri: phase 0-1 arasında ayın aydınlık kısmı değişir, çevresindeki halka evreyi gösterir, yıldızlar yanıp söner',
  tags: ['ay', 'ay evresi', 'dolunay', 'hilal', 'dördün', 'moon', 'moon phase', 'full moon', 'crescent', 'lunar'],
  box: [-120, -110, 120, 110],
  bleed: 30,
  anchor: 'ay diskinin merkezi (0,0)',
  points: { moon: [0, 0], indicator: [0, 78] },
  params: {
    color: { type: 'color', default: 'yellow' },
    phase: { type: 'number', default: 0.5, desc: 'ay evresi 0-1: 0 yeni ay, 0.25 ilk dördün, 0.5 dolunay, 0.75 son dördün' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const R = 56;
    // hafif salınım (idle): ay nefes alır gibi ±2 birim yüzer
    const bob = Math.sin(t * k.TAU / 3) * 2;
    const cy = bob;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // arka plan yıldızları: yanıp söner (idle)
    for (let i = 0; i < 10; i++) {
      const sx = -112 + k.hash(i * 3 + 1) * 224;
      const sy = -102 + k.hash(i * 3 + 2) * 190;
      if (Math.abs(sx) < 70 && Math.abs(sy - cy) < 70) continue; // ayın üstüne düşmesin
      const a = 0.25 + 0.6 * Math.abs(Math.sin(t * (0.7 + k.hash(i * 5)) + k.hash(i) * k.TAU));
      ctx.fillStyle = k.rgba('panel2', a);
      ctx.beginPath(); ctx.arc(sx, sy, 1.6 + k.hash(i * 7) * 2, 0, k.TAU); ctx.fill();
    }

    const ph = k.clamp(p.phase ?? 0.5, 0, 1);
    const lit = (1 - Math.cos(2 * Math.PI * ph)) / 2; // aydınlık oran 0-1
    const waxing = ph < 0.5;
    // gölge dairesi: aydınlık azaldıkça ayın üstüne kayar (sol = büyüyen, sağ = küçülen evre)
    const shadowX = (waxing ? -1 : 1) * 2 * R * (1 - lit);

    // ay halesi: dolunaya yaklaştıkça güçlenir
    if (lit > 0.1) k.glow(0, cy, 95, 'yellow', 0.3 * lit);

    // evre halkası: ayın çevresinde phase kadar ilerleyen yay
    ctx.strokeStyle = k.rgba('cyan', 0.75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, cy, R + 16, -Math.PI / 2, -Math.PI / 2 + ph * k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, cy, R + 16, -Math.PI / 2 + ph * k.TAU, -Math.PI / 2 + k.TAU); ctx.stroke();

    // ay diski: gölge + parlama
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.arc(4, cy + 5, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, cy, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.arc(0, cy, R, 0, k.TAU); ctx.fill();
    // kraterler (gölge altında kalacaklar önce çizilir)
    ctx.fillStyle = k.rgba('dim', 0.45);
    for (let i = 0; i < 5; i++) {
      const cx = (k.hash(i + 40) - 0.5) * 64;
      const cyy = cy + (k.hash(i + 50) - 0.5) * 64;
      ctx.beginPath(); ctx.arc(cx, cyy, 4 + k.hash(i) * 5, 0, k.TAU); ctx.fill();
    }
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, cy - 26, 14, 9, -0.5, 0, k.TAU); ctx.fill();

    // gölge: ay diskiyle kırpılır, aydınlık kısım ortaya çıkar
    if (lit < 0.999) {
      ctx.save();
      ctx.beginPath(); ctx.arc(0, cy, R, 0, k.TAU); ctx.clip();
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath(); ctx.arc(shadowX, cy, R, 0, k.TAU); ctx.fill();
      ctx.restore();
      // terminatör çizgisi: aydınlık-karanlık sınırı
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, cy, R, 0, k.TAU); ctx.stroke();
    }
  },
};
