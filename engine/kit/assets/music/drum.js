// music/drum — trampet davul: silindirik kasnak, üst deri, gergi cıvataları,
// üstte çapraz iki baget; hit anında deri çöker + dalga yayılır, bagetler vurur.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kasnağın merkezidir.
export default {
  name: 'drum', category: 'music',
  desc: 'Trampet davul; hit anında bagetler vurur, deride dalga yayılır',
  tags: ['davul', 'trampet', 'vurmalı', 'baget', 'drum', 'snare', 'percussion', 'ritim', 'rhythm'],
  box: [-135, -110, 135, 100],
  bleed: 55,
  anchor: 'kasnağın merkezi (0,0)',
  points: { head: [0, -18], rim: [105, -18], body: [0, 20] },
  params: {
    color: { type: 'color', default: 'panel2' },
    hit: { type: 'time', default: null, desc: 'vuruş anı: deri dalgası + baget hareketi (0.5 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), acc = k.rgba('red', 0.9);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();

    const d = p.hit == null ? -1 : t - p.hit;
    const hitting = d >= 0 && d < 0.5;
    // vuruş darbesi: 0→1→0 eğrisi
    const pulse = hitting ? Math.sin(Math.min(d / 0.5, 1) * Math.PI) : 0;

    // ---- kasnak gövdesi (dikdörtgen + alt elips kenarı)
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-105 + 6, -18 + 6, 210, 78, 10); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-105 - LW / 2, -18 - LW / 2, 210 + LW, 78 + LW, 10); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); k.rrect(-105, -18, 210, 78, 8); ctx.fill();
    // gövde parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, 2, 22, 12, -0.4, 0, k.TAU); ctx.fill();

    // alt kenar çizgisi
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.ellipse(0, 60, 105, 26, 0, 0.15, Math.PI - 0.15); ctx.stroke();

    // ---- gergi cıvataları (lug): 5 adet dikey
    for (let i = 0; i < 5; i++) {
      const x = -84 + i * 42;
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - 9, -8, 18, 58, 7); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); k.rrect(x - 6, -5, 12, 52, 5); ctx.fill();
      ctx.fillStyle = acc;
      ctx.beginPath(); ctx.arc(x, 21, 4, 0, k.TAU); ctx.fill();
    }

    // ---- üst kasnak halkası (hoop)
    ctx.strokeStyle = line; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.ellipse(0, -18, 105, 28, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(0, -18, 105, 28, 0, 0, k.TAU); ctx.stroke();

    // ---- üst deri: vuruşta hafifçe çöker (ry kısalır)
    const squash = 1 - 0.18 * pulse;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, -18, 100 + LW / 2, 24 * squash + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.ellipse(0, -18, 100, 24 * squash, 0, 0, k.TAU); ctx.fill();
    // deri parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-55, -26, 30, 7, -0.3, 0, k.TAU); ctx.fill();

    // vuruş: deriden yayılan dalga halkaları + merkez flaşı
    if (hitting) {
      for (let i = 0; i < 2; i++) {
        const ph = d * 2.2 - i * 0.14;
        if (ph < 0) continue;
        const r = 18 + ph * 150;
        const a = k.clamp(1 - ph / 0.6, 0, 1) * 0.65;
        ctx.strokeStyle = k.rgba('red', a); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.ellipse(0, -18, r, r * 0.32, 0, 0, k.TAU); ctx.stroke();
      }
      k.glow(0, -18, 44, 'red', 0.4 * (1 - d / 0.5));
    }

    // ---- bagetler: çapraz iki çizgi; vuruşta aşağı iner
    const dip = pulse * 16;
    const stick = (x1, y1, x2, y2) => {
      ctx.strokeStyle = line; ctx.lineWidth = 13;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.85); ctx.lineWidth = 9;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      // uç topu
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(x2, y2, 9, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); ctx.arc(x2, y2, 6.5, 0, k.TAU); ctx.fill();
    };
    stick(-78, -100 + dip, 24, -44 + dip);
    stick(78, -100 + dip, -24, -44 + dip);

    ctx.restore();
  },
};
