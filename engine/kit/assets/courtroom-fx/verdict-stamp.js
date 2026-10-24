// courtroom-fx/verdict-stamp — hüküm mührü: at anından 0.3 sn önce mühür yukarıdan iner,
// vuruşta kağıda kırmızı mühür izi basılır (genişleyen mürekkep halkası + yıldız mühür).
// Boştayken mühür hafifçe havada salınır.
// NOT: canvas y-aşağıdır; kağıt üst yüzeyi y=20.
export default {
  name: 'verdict-stamp', category: 'courtroom-fx',
  desc: 'Hüküm mührü; at anında kağıda basılır, kırmızı mürekkep izi bırakır',
  tags: ['mühür', 'hüküm', 'karar', 'damga', 'onay', 'mahkeme', 'kaşe', 'stamp', 'verdict', 'seal', 'court', 'approve'],
  box: [-160, -230, 160, 130],
  bleed: 30,
  anchor: 'kağıt üst yüzeyi (0,20)',
  points: { plate: [0, -54], seal: [0, 65] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'mühür rengi' },
    at: { type: 'time', default: null, desc: 'basılış anı (iniş + mürekkep izi)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6, line = k.rgba('bg', 0.55);
    const darkOf = c => { const v = k.col(c); return 'rgb(' + Math.round(v[0] * 0.88) + ',' + Math.round(v[1] * 0.88) + ',' + Math.round(v[2] * 0.88) + ')'; };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); ctx.ellipse(x + 6, y + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const gloss = (x, y, rx, ry, a) => {
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.4, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // kağıt
    blob(-95, 20, 190, 92, 10, 'panel2');
    gloss(-64, 32, 26, 8, 0.10);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3.5; // yazı çizgileri
    ctx.beginPath(); ctx.moveTo(-70, 48); ctx.lineTo(70, 48); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-70, 62); ctx.lineTo(40, 62); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-70, 90); ctx.lineTo(55, 90); ctx.stroke();

    // mühür izi (d>=0): kırmızı halka + yıldız
    if (d >= 0) {
      const s = k.E.outBack(k.prog(d, 0, 0.25), 2);
      ctx.save(); ctx.translate(0, 65); ctx.scale(s, s);
      ctx.strokeStyle = k.rgba('red', 0.95); ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(0, 0, 30, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = k.rgba('red', 0.9);
      ctx.beginPath();
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * k.TAU - Math.PI / 2;
        const r = i % 2 ? 8 : 18;
        const px = Math.cos(a) * r, py = Math.sin(a) * r;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
      if (d < 0.4) { // mürekkep halkası
        const g = k.prog(d, 0, 0.4);
        ctx.strokeStyle = k.rgba('red', 0.6 * (1 - g));
        ctx.lineWidth = 5 * (1 - g) + 1.5;
        ctx.beginPath(); ctx.arc(0, 65, 30 + g * 30, 0, k.TAU); ctx.stroke();
      }
      if (d < 0.5) { // mürekkep sıçramaları
        const dg = k.prog(d, 0, 0.5);
        for (let i = 0; i < 7; i++) {
          const a = k.hash(i * 23 + 4) * k.TAU;
          const sp = 34 + dg * (20 + k.hash(i * 29 + 8) * 30);
          ctx.fillStyle = k.rgba('red', 0.7 * (1 - dg));
          ctx.beginPath(); ctx.arc(Math.cos(a) * sp, 65 + Math.sin(a) * sp * 0.7, 2 + k.hash(i * 31 + 2) * 2.5, 0, k.TAU); ctx.fill();
        }
      }
    }

    // mühür gövdesi: hover → iniş (d in [-0.3,0]) → basılı
    let G;
    if (p.at == null) G = -10 + Math.sin(t * k.TAU / 2.4) * 5;
    else if (d < 0) G = k.lerp(-10, 74, k.E.inCubic(k.prog(d, -0.3, 0)));
    else G = 74 - 8 * Math.sin(d * 25) * Math.exp(-d * 7);
    ctx.save(); ctx.translate(0, G);
    disc(0, -170, 16, 16, p.color);          // topuz
    blob(-18, -158, 36, 66, 14, p.color);   // sap
    gloss(-8, -142, 6, 14, 0.10);
    blob(-60, -94, 120, 40, 10, p.color);   // taban plakası
    gloss(-36, -84, 18, 6, 0.11);
    ctx.fillStyle = k.rgba('red', d >= 0 ? 0.9 : 0.55); // mürekkep yüzeyi
    ctx.beginPath(); k.rrect(-52, -58, 104, 8, 4); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
