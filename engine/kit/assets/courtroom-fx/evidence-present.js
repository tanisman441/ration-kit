// courtroom-fx/evidence-present — sunulan delil kutusu: at anında aşağıdan pop-in ile
// belirir (outBack büyüme + toz halkası); boştayken hafif salınım.
// NOT: canvas y-aşağıdır; kutu tabanı (0,70).
export default {
  name: 'evidence-present', category: 'courtroom-fx',
  desc: 'Delil kutusu; at anında öne uzatılırcasına pop-in ile belirir',
  tags: ['delil', 'kanıt', 'dosya', 'kutu', 'mahkeme', 'evidence', 'box', 'file', 'court', 'present', 'proof'],
  box: [-150, -130, 150, 120],
  bleed: 30,
  anchor: 'kutu tabanı (0,70)',
  points: { top: [0, -115], label: [0, 5] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'kutu rengi' },
    at: { type: 'time', default: null, desc: 'sunuş anı (pop-in + toz halkası)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6, line = k.rgba('bg', 0.55);
    const darkOf = c => { const v = k.col(c); return 'rgb(' + Math.round(v[0] * 0.88) + ',' + Math.round(v[1] * 0.88) + ',' + Math.round(v[2] * 0.88) + ')'; };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const gloss = (x, y, rx, ry, a) => {
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.4, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // pop-in: d<0 ve at verildiyse kutu henüz sahnede değil
    if (d < 0 && p.at != null) { ctx.restore(); return; }
    const pop = p.at == null ? 1 : k.E.outBack(k.prog(d, 0, 0.4), 1.8);
    const yoff = p.at == null ? 0 : 45 * (1 - k.prog(d, 0, 0.4));
    const bob = Math.sin(t * k.TAU / 2.8) * 2.5;

    ctx.save();
    ctx.translate(0, 70 + yoff + bob * (p.at == null ? 1 : 0.3));
    ctx.scale(pop, pop);
    ctx.translate(0, -70);

    // arka panel + belgeler
    blob(-100, -72, 200, 92, 14, 'panel2');
    const paper = (x, y, rot) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      blob(-30, -70, 60, 78, 8, 'ink');
      ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3.5;
      ctx.beginPath(); ctx.moveTo(-18, -44); ctx.lineTo(18, -44); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-18, -30); ctx.lineTo(10, -30); ctx.stroke();
      ctx.restore();
    };
    paper(-52, -66, -0.1);
    paper(38, -68, 0.12);

    // ön panel
    blob(-112, -42, 224, 112, 16, p.color);
    gloss(-80, -24, 32, 10, 0.10);

    // delil bandı (vurgu: yellow)
    blob(-112, -42, 224, 28, 12, 'yellow');
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3.5;
    for (let i = 0; i < 5; i++) {
      const bx = -96 + i * 44;
      ctx.beginPath(); ctx.moveTo(bx, -40); ctx.lineTo(bx + 14, -16); ctx.stroke();
    }

    // etiket
    blob(-58, -2, 116, 42, 9, 'yellow');
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-42, 12); ctx.lineTo(42, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-42, 26); ctx.lineTo(24, 26); ctx.stroke();
    ctx.restore();

    // sunuş tozu (0.5 sn)
    if (d >= 0 && d < 0.5) {
      const dg = k.prog(d, 0, 0.5);
      for (let i = 0; i < 8; i++) {
        const a = Math.PI + (i / 7) * Math.PI; // yana-yukarı
        const sp = 40 + dg * (60 + k.hash(i * 13 + 2) * 60);
        ctx.fillStyle = k.rgba('dim', 0.55 * (1 - dg));
        ctx.beginPath();
        ctx.arc(Math.cos(a) * sp, 70 + Math.sin(a) * sp * 0.5 - dg * 20, 3 + k.hash(i * 17 + 4) * 4 * (1 - dg * 0.5), 0, k.TAU);
        ctx.fill();
      }
      ctx.strokeStyle = k.rgba('dim', 0.5 * (1 - dg));
      ctx.lineWidth = 5 * (1 - dg) + 1;
      ctx.beginPath(); ctx.ellipse(0, 70, 30 + dg * 110, 10 + dg * 22, 0, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
