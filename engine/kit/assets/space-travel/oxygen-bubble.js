// space-travel/oxygen-bubble — hortum ağzından yükselen oksijen kabarcıkları:
// sürekli yükselen kabarcıklar + hafif titreşim, oksijen akış hissi (canlı idle).
// NOT: canvas y-aşağıdır; (0,0) hortum ağzıdır (kabarcıkların çıktığı nokta).
export default {
  name: 'oxygen-bubble', category: 'space-travel',
  desc: 'Hortumdan yükselen oksijen kabarcıkları: titreşimli akış ve patlayan baloncuklar',
  tags: ['oksijen', 'kabarcık', 'hava', 'solunum', 'hortum', 'uzay', 'oxygen', 'bubble', 'air', 'breath', 'hose', 'baloncuk'],
  box: [-130, -230, 130, 130],
  bleed: 30,
  anchor: 'hortum ağzı (0,0)',
  points: { nozzle: [0, 0], top: [0, -200] },
  params: {
    flow: { type: 'number', default: 0.6, desc: '0-1: oksijen akış yoğunluğu' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const flow = k.clamp(p.flow, 0, 1);
    const LW = 8;
    const line = k.rgba('bg', 0.55);
    const hoseC = k.rgba(p.color);
    ctx.save();

    // hortum: sol alttan kıvrılıp ağza gelir (havada asılı kısım ink değil, gövdeli)
    const hosePath = () => {
      ctx.beginPath(); ctx.moveTo(-108, 118);
      ctx.quadraticCurveTo(-84, 60, -40, 44);
      ctx.quadraticCurveTo(-14, 34, -6, 12);
    };
    ctx.strokeStyle = line; ctx.lineWidth = 26 + LW; ctx.lineCap = 'round';
    hosePath(); ctx.stroke();
    ctx.strokeStyle = hoseC; ctx.lineWidth = 26;
    hosePath(); ctx.stroke();
    // hortum çizgileri (iç ayrım)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-96, 96); ctx.quadraticCurveTo(-76, 58, -44, 46); ctx.stroke();
    // premium parlama (sol üst, alfa 0.10)
    ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-92, 78); ctx.quadraticCurveTo(-74, 52, -48, 42); ctx.stroke();

    // ağızlık (nozul)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-17 - LW / 2, -26 - LW / 2, 34 + LW, 30 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); k.rrect(-17, -26, 34, 30, 10); ctx.fill();
    // ağız içi parlama: akış göstergesi (canlı idle nabız)
    const np = 0.5 + 0.5 * Math.sin(t * 6);
    k.glow(0, -22, 26, 'cyan', 0.25 + 0.35 * flow * np);
    ctx.fillStyle = k.rgba('cyan', 0.3 + 0.6 * flow * np);
    ctx.beginPath(); ctx.ellipse(0, -20, 10, 6, 0, 0, k.TAU); ctx.fill();

    // akış çizgileri: yukarı doğru akan hava (canlı idle)
    ctx.strokeStyle = k.rgba('cyan', 0.25 + 0.2 * flow); ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 14]);
    ctx.lineDashOffset = -t * 46;
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(s * 26, -30);
      ctx.quadraticCurveTo(s * 44, -110, s * 20, -196); ctx.stroke();
    }
    ctx.setLineDash([]);

    // kabarcıklar: yükselir, yalpalayıp titrer, tepede patlar (canlı idle)
    const N = 12;
    for (let i = 0; i < N; i++) {
      const ph = k.hash(i * 7.31);
      if (ph > flow + 0.15) continue;             // akış azsa daha az kabarcık
      const rate = 0.28 + 0.4 * flow * (0.5 + ph);
      const c = (t * rate + ph) % 1;             // yaşam döngüsü 0→1
      const y = k.lerp(-24, -204, c);
      // yalpalama + hafif titreşim (noise1)
      const x = Math.sin(c * 8 + ph * 20) * (7 + c * 18) + k.noise1(t * 3 + i * 5) * 3;
      const grow = 1 + c * 0.7;
      const sz = (4.5 + ph * 5) * grow * (c > 0.92 ? (1 - c) / 0.08 : 1);  // tepede patlama
      if (sz <= 0.5) continue;
      const a = 0.9 * (1 - c * 0.45);
      // baloncuk gövdesi
      ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = k.rgba('cyan', 0.10 * a);
      ctx.beginPath(); ctx.arc(x, y, sz, 0, k.TAU); ctx.fill();
      // üst-sol parlama (baloncuk yansıması)
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(x, y, sz * 0.62, Math.PI * 1.05, Math.PI * 1.45); ctx.stroke();
    }
    // ağız çevresi mini kabarcıklar
    for (let i = 0; i < 4; i++) {
      const wob = k.noise1(t * 4 + i * 9) * 4;
      ctx.strokeStyle = k.rgba('cyan', 0.6); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(-14 + i * 9 + wob, -34 - (i % 2) * 6, 3.2, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
