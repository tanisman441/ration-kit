// arcade-fx/highscore-pop — yeni rekor madalyonu: at anında (0.55 sn) outBack
// yaylanmasıyla belirir, ışınlar + kıvılcımlar saçar (0.9 sn). Sonra ve
// at=null iken hafifçe süzülür. at set edilip d<0 iken görünmez.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) madalyon merkezidir.
export default {
  name: 'highscore-pop', category: 'arcade-fx',
  desc: 'Yaylanarak beliren yeni rekor madalyonu; yıldız + REKOR kurdelesi',
  tags: ['rekor', 'yüksek skor', 'madalya', 'ödül', 'yeni rekor', 'high score', 'new record', 'medal', 'trophy', 'award'],
  box: [-150, -150, 150, 150],
  bleed: 45,
  anchor: 'madalyon merkezi (0,0)',
  points: { centre: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'rekorun belirme anı (0.55 sn yaylanma + 0.9 sn ışıma)' },
    color: { type: 'color', default: 'yellow', desc: 'madalyon rengi' },
  },
  draw(ctx, t, p, k) {
    const armed = p.at != null;
    const d = armed ? t - p.at : 1e9;
    if (armed && d < 0) return;                    // henüz belirmedi
    ctx.save();

    // ölçek + hafif dönüş
    let sc, rot = 0, fy = 0;
    const event = d >= 0 && d < 0.9;
    if (armed && d < 0.55) {
      sc = Math.max(0.001, k.E.outBack(Math.min(1, d / 0.55)));
      const dd = Math.max(0, d);
      rot = Math.exp(-6 * dd) * Math.sin(20 * dd) * 0.22;
    } else {
      sc = 1;
      fy = Math.sin(t * k.TAU / 2.4) * 3;         // süzülme
    }

    // === ışınlar (olayda) ===
    if (event) {
      const q = d / 0.9;
      ctx.strokeStyle = k.rgba(p.color, (1 - q) * 0.8); ctx.lineWidth = 6; ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        const ang = i * k.TAU / 8 + 0.2;
        const r0 = 82, r1 = r0 + 16 + q * 34;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * r0, Math.sin(ang) * r0);
        ctx.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
        ctx.stroke();
      }
      // kıvılcımlar
      const fq = k.E.outCubic(Math.min(1, d / 0.9));
      for (let i = 0; i < 10; i++) {
        const ang = k.hash(i * 1.3 + 0.7) * k.TAU;
        const dist = (60 + k.hash(i * 3.7) * 80) * fq;
        const sz = (1 - Math.min(1, d / 0.9)) * 9;
        ctx.save();
        ctx.translate(Math.cos(ang) * dist, Math.sin(ang) * dist);
        ctx.rotate(d * 4 * (i % 2 ? 1 : -1));
        ctx.fillStyle = i % 2 ? k.rgba(p.color, 1 - fq * 0.7) : `rgba(255,255,255,${1 - fq * 0.7})`;
        ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      }
      if (d < 0.55) k.glow(0, fy, 120 * sc, p.color, 0.35 * (1 - d / 0.55));
    }

    ctx.translate(0, fy); ctx.scale(sc, sc); ctx.rotate(rot);

    // kurdele (arkada): bant + yan çentikler
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-70, 40, 140, 44, 8); ctx.fill();
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(s * 70, 40); ctx.lineTo(s * 94, 62); ctx.lineTo(s * 70, 84);
      ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); k.rrect(-70, 40, 140, 44, 8); ctx.fill();

    // madalyon
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.arc(0, 0, 76, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, 70, 0, k.TAU); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-25, -30, 28, 18, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(30, 34, 34, 0, k.TAU); ctx.fill();
    ctx.restore();

    // yıldız
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 34 : 15;
      const ang = -Math.PI / 2 + i * Math.PI / 5;
      const x = Math.cos(ang) * r, y = -12 + Math.sin(ang) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();

    // REKOR yazısı
    ctx.font = `700 30px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('bg', 0.95);
    ctx.fillText('REKOR', 0, 62);

    ctx.restore();
  },
};
