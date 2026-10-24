// shop-display-fx/price-pop — fiyat etiketi; `at` anında zıplayarak belirir, yıldızlar saçar.
// NOT: canvas y-aşağıdır. Idle: hafif yaylanma (2.4 sn); at olayı ~1.2 sn sürer.
export default {
  name: 'price-pop', category: 'shop-display-fx',
  desc: 'İpten sarkan fiyat etiketi; belirme anında zıplar ve etrafına yıldızlar saçar',
  tags: ['fiyat', 'etiket', 'indirim', 'belirme', 'pop', 'price', 'tag', 'discount', 'sale', 'shop', 'offer'],
  box: [-120, -110, 120, 110],
  bleed: 60,
  anchor: 'etiketin merkezi',
  points: { hole: [-62, 0], tag: [0, 0], string: [0, -110] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'belirme anı: etiket zıplayarak büyür + yıldız patlaması (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const bob = 2.5 * Math.sin(t * k.TAU / 2.4);
    // belirme ölçeği: öncesinde %85, at anında outBack ile 1.18'e zıplar, 1'e oturur
    const pop = d < 0 ? 0.85 : 1 + 0.18 * k.E.outBack(k.prog(d, 0, 0.45), 2.2) * (d < 0.45 ? 1 : Math.exp(-(d - 0.45) * 3));
    // ip (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -110); ctx.lineTo(0, -62); ctx.stroke();
    ctx.save();
    ctx.translate(0, bob);
    ctx.scale(pop, pop);
    // etiket gövdesi (sol sivri, sağ yuvarlak)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-88, -56); ctx.lineTo(72, -56); ctx.quadraticCurveTo(96, -56, 96, 0);
    ctx.quadraticCurveTo(96, 56, 72, 56); ctx.lineTo(-88, 56); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath();
    ctx.moveTo(-80, -48); ctx.lineTo(66, -48); ctx.quadraticCurveTo(88, -48, 88, 0);
    ctx.quadraticCurveTo(88, 48, 66, 48); ctx.lineTo(-80, 48); ctx.closePath(); ctx.fill();
    // sağ alt gölge tonu
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath(); ctx.moveTo(30, 48); ctx.quadraticCurveTo(88, 48, 88, 0); ctx.lineTo(88, 48); ctx.closePath(); ctx.fill();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-48, -32, 36, 9, -0.3, 0, k.TAU); ctx.fill();
    // delik + halka
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(-62, 0, 11, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(-62, 0, 11, 0, k.TAU); ctx.stroke();
    // fiyat yazısı
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('ink');
    ctx.font = '800 46px system-ui, sans-serif';
    ctx.fillText('%50', 8, 0);
    ctx.restore();
    // yıldız patlaması (at sonrası 0.1–1.2 sn)
    if (d >= 0.1 && d < 1.2) {
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * k.TAU + k.hash(i * 2.3) * 0.5;
        const pr = k.prog(d, 0.1 + k.hash(i * 5.1) * 0.2, 1.2);
        if (pr <= 0 || pr >= 1) continue;
        const r = 60 + k.E.outCubic(pr) * 70;
        const sx = Math.cos(a) * r, sy = Math.sin(a) * r * 0.8;
        const ss = (1 - pr) * 9 + 2;
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - pr));
        ctx.beginPath();
        ctx.moveTo(sx, sy - ss); ctx.lineTo(sx + ss * 0.3, sy - ss * 0.3); ctx.lineTo(sx + ss, sy);
        ctx.lineTo(sx + ss * 0.3, sy + ss * 0.3); ctx.lineTo(sx, sy + ss); ctx.lineTo(sx - ss * 0.3, sy + ss * 0.3);
        ctx.lineTo(sx - ss, sy); ctx.lineTo(sx - ss * 0.3, sy - ss * 0.3); ctx.closePath(); ctx.fill();
      }
      k.glow(0, 0, 70, p.color, 0.4 * (1 - k.prog(d, 0.1, 0.8)));
    }
    ctx.restore();
  },
};
