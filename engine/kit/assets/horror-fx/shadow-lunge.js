// horror-fx/shadow-lunge — karanlıkta çömelmiş gölge figürün kameraya hamlesi.
// NOT: canvas y-aşağıdır; (0,0) figürün tabanıdır. Hamle = büyüme + yaklaşma.
export default {
  name: 'shadow-lunge', category: 'horror-fx',
  desc: 'Karanlıkta çömelmiş gölge figür: at anında 0.9 sn içinde büyüyerek kameraya hamle yapar, kırmızı gözleri parlar',
  tags: ['gölge', 'hamle', 'korku', 'canavar', 'karanlık figür', 'kırmızı göz', 'shadow', 'lunge', 'horror', 'dark figure', 'monster'],
  box: [-160, -180, 160, 90],
  bleed: 45,
  anchor: 'figürün tabanı (0,0)',
  points: { eyes: [0, -172], hands: [128, -52], head: [0, -170] },
  params: {
    color: { type: 'color', default: 'ink' },
    at: { type: 'time', default: null, desc: 'hamle anı: 0.9 sn ileri atılma, 0.4 sn bekleme, 0.3 sn geri çekilme' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();

    // --- poz: idle (geride çömelmiş) / hamle (büyüyerek yaklaşma) / geri çekilme ---
    let sx = -70, s = 0.6, shake = 0, lungeG = 0;
    if (d < 0) {
      sx = -70 + 6 * k.noise1(t * 0.8);                    // canlı idle: hafif salınım
      s = 0.6 + 0.02 * Math.sin(t * 2.1);                  // nefes
    } else if (d < 0.9) {
      const e = 1 - Math.pow(1 - k.prog(d, 0, 0.9), 3);    // ease-out hamle
      sx = -70 + 70 * e; s = 0.6 + 0.85 * e; lungeG = e;
    } else if (d < 1.3) {
      sx = 0; s = 1.45; lungeG = 1; shake = 2.5;            // üstüne çullanma: titreme
    } else if (d < 1.6) {
      const e = k.prog(d, 1.3, 1.6);
      sx = -70 * e; s = 1.45 - 0.85 * e; lungeG = 1 - e;    // hızlı geri çekilme
    } else {
      sx = -70; s = 0.6;
    }
    const ox = sx + (shake ? k.noise1(t * 55) * shake : 0);

    // --- hamle hız çizgileri (figürün arkasında) ---
    if (lungeG > 0 && d < 1.3) {
      ctx.strokeStyle = k.rgba('dim', 0.45 * (1 - lungeG * 0.5));
      ctx.lineWidth = 4; ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const yy = -110 + i * 34 + k.noise1(i * 9 + t * 20) * 8;
        const len = (30 + 40 * k.hash(i * 13 + 2)) * (1 - lungeG * 0.4);
        ctx.beginPath();
        ctx.moveTo(ox - 60 - len, yy); ctx.lineTo(ox - 60, yy);
        ctx.stroke();
      }
    }

    // --- gölge figür (tek transform altında) ---
    ctx.translate(ox, 0); ctx.scale(s, s);
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // bacakları eriyen alt kısım: dalgalı uzantılar
    ctx.strokeStyle = k.rgba(p.color, 0.85); ctx.lineWidth = 7;
    for (let i = 0; i < 5; i++) {
      const wx = -26 + i * 13;
      const sway = k.noise1(t * 2.5 + i * 4) * 10;
      ctx.beginPath();
      ctx.moveTo(wx, -18);
      ctx.quadraticCurveTo(wx + sway * 0.5, 6, wx + sway, 22 + 6 * k.hash(i * 7));
      ctx.stroke();
    }

    // gövde + baş: gölge + ana form
    ctx.fillStyle = darker(p.color);
    k.rrect(-28 + 6, -100 + 6, 56, 88, 20); ctx.fill();
    ctx.beginPath(); ctx.arc(6, -112, 23, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    k.rrect(-28, -100, 56, 88, 20); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5;
    k.rrect(-28, -100, 56, 88, 20); ctx.stroke();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, -118, 23, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.beginPath(); ctx.arc(0, -118, 23, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';               // sol üst parlama (premium finish)
    ctx.beginPath(); ctx.ellipse(-9, -128, 10, 6, -0.5, 0, k.TAU); ctx.fill();

    // kollar: öne uzanmış + pençeler
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 11;
    for (const side of [-1, 1]) {
      const reach = 40 + lungeG * 26;
      const hx = side * (24 + reach), hy = -52 + lungeG * 14;
      ctx.beginPath(); ctx.moveTo(side * 22, -78); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.lineWidth = 4; ctx.strokeStyle = k.rgba('bg', 0.6);
      for (let f = 0; f < 3; f++) {
        const fy = hy - 6 + f * 6;
        ctx.beginPath(); ctx.moveTo(hx, fy); ctx.lineTo(hx + side * 14, fy + 3); ctx.stroke();
      }
      ctx.lineWidth = 11; ctx.strokeStyle = k.rgba(p.color);
    }

    // gözler: idle'da loş nabız, hamlede tam parlak kırmızı
    const eyeA = lungeG > 0 ? 1 : 0.45 + 0.25 * Math.sin(t * 2.6);
    for (const side of [-1, 1]) {
      const ex = side * 9, ey = -120;
      k.glow(ex, ey, 10 + lungeG * 8, k.col('red'), (0.25 + 0.35 * lungeG) * eyeA);
      ctx.fillStyle = k.rgba('red', eyeA);
      ctx.beginPath(); ctx.arc(ex, ey, 3.4 + lungeG * 1.6, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
