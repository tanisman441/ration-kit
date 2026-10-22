// volcano-fx/steam-vent — kaya bacası; sürekli yükselen buhar + nefesli nabız;
// puff anında güçlü buhar patlaması.
// NOT: canvas y-aşağıdır; (0,0) = baca taban merkezi.
export default {
  name: 'steam-vent',
  category: 'volcano-fx',
  desc: 'Kaya bacasından nefes gibi nabızla yükselen buhar sütunu; puff anında güçlü buhar patlaması',
  tags: ['buhar', 'baca', 'steam', 'vent', 'gayzer', 'fümerol', 'buhar çıkışı', 'volkan'],
  box: [-120, -190, 120, 120],
  bleed: 70,
  anchor: 'baca taban merkezi (0,0)',
  points: { vent: [0, -70] },
  params: {
    puff: { type: 'time', default: null, desc: 'güçlü buhar patlaması anı' },
    density: { type: 'number', default: 1, desc: 'buhar yoğunluğu 0-1.5' },
  },
  draw(ctx, t, p, k) {
    const dens = Math.max(0.1, p.density);
    const breathe = 0.7 + 0.3 * Math.sin(t * (k.TAU / 3.1));   // nefesli nabız
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // 1) baca kaya gövdesi (dim, premium finish)
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath();
    ctx.moveTo(-52, 60);
    ctx.lineTo(-30, -60);
    ctx.lineTo(30, -60);
    ctx.lineTo(52, 60);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.10);
    ctx.beginPath(); ctx.ellipse(-22, -10, 14, 30, -0.25, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(28, 25, 16, 28, 0.25, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-52, 60); ctx.lineTo(-30, -60);
    ctx.lineTo(30, -60); ctx.lineTo(52, 60);
    ctx.stroke();

    // 2) baca ağzı — nefes nabzıyla kızaran iç (kızıl ısı)
    k.glow(0, -62, 34, 'red', 0.30 * breathe);
    ctx.fillStyle = k.rgba('red', 0.5 + 0.3 * breathe);
    ctx.beginPath(); ctx.ellipse(0, -60, 27, 9, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.5 * breathe);
    ctx.beginPath(); ctx.ellipse(0, -60, 13, 4.5, 0, 0, k.TAU); ctx.fill();

    // 3) sürekli yükselen buhar — döngüsel puflar (duman dim)
    const puffs = Math.round(8 * dens);
    for (let i = 0; i < puffs; i++) {
      const cyc = 2.6 + k.hash(i * 3 + 1) * 1.8;
      const ph = ((t * breathe + k.hash(i * 5 + 2) * cyc) % cyc) / cyc;   // nefesle senkron
      const px = (k.hash(i * 7 + 3) - 0.5) * 44 + k.noise1(i * 11 + t * 1.8) * 16 * ph;
      const py = -70 - ph * 130;
      const r = (9 + ph * 26) * (0.7 + dens * 0.3);
      ctx.fillStyle = k.rgba('dim', 0.42 * (1 - ph) * dens);
      ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.08 * (1 - ph));                      // parlama yansıması
      ctx.beginPath(); ctx.arc(px - r * 0.25, py - r * 0.3, r * 0.55, 0, k.TAU); ctx.fill();
    }

    // 4) bacadan yükselen ince ısı dalgası çizgileri (hava çizgisi, ink)
    ctx.strokeStyle = k.rgba('ink', 0.22); ctx.lineWidth = 3;
    for (let i = 0; i < 2; i++) {
      const hx = (i - 0.5) * 22;
      ctx.beginPath();
      for (let j = 0; j <= 8; j++) {
        const yy = -72 - j * 9;
        const xx = hx + Math.sin(j * 1.1 + t * 5 + i * 2.4) * 7;
        if (j === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }

    // 5) puff olayı — güçlü buhar patlaması 0–1.3 sn
    const d = p.puff == null ? -1 : t - p.puff;
    if (d >= 0 && d <= 1.3) {
      // ilk itki: parlak çekirdek
      if (d < 0.2) {
        const f = 1 - d / 0.2;
        k.glow(0, -60, 80, 'ink', 0.35 * f);
        ctx.fillStyle = k.rgba('dim', 0.55 * f);
        ctx.beginPath(); ctx.arc(0, -70, 20 * f, 0, k.TAU); ctx.fill();
      }
      // genişleyen buhar bulutu — 0.05–1.3 sn: yükselir, büyür, solar
      if (d > 0.05) {
        const g = k.prog(d, 0.05, 1.3);
        for (let i = 0; i < 9; i++) {
          const px = (k.hash(i * 13 + 4) - 0.5) * 90 * (1 + g) + k.noise1(i * 17 + t * 2) * 12;
          const py = -78 - g * (150 + k.hash(i * 19 + 5) * 90);
          const r = (12 + g * 34 + k.hash(i * 23 + 6) * 10);
          ctx.fillStyle = k.rgba('dim', 0.5 * (1 - g));
          ctx.beginPath(); ctx.arc(px, py, r, 0, k.TAU); ctx.fill();
          ctx.fillStyle = k.rgba('ink', 0.09 * (1 - g));
          ctx.beginPath(); ctx.arc(px - r * 0.25, py - r * 0.3, r * 0.55, 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
