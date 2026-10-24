// courtroom-fx/gavel-bang — hâkim tokmağı: at anında kalkık tokmak hızla iner,
// vuruş anında şok halkaları + sarı flaş + blokta titreşim; boştayken hafif sallantı.
// NOT: canvas y-aşağıdır; vuruş noktası (0,0), blok üst yüzeyi.
export default {
  name: 'gavel-bang', category: 'courtroom-fx',
  desc: 'Hâkim tokmağı; at anında vurur, darbe dalgası ve blok titreşimi çıkarır',
  tags: ['tokmak', 'vuruş', 'mahkeme', 'hâkim', 'hüküm', 'karar', 'gavel', 'court', 'judge', 'verdict', 'bang'],
  box: [-180, -210, 180, 120],
  bleed: 40,
  anchor: 'vuruş noktası (0,0) — blok üst yüzeyi',
  points: { strike: [0, 0], grip: [0, 96] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'tokmak rengi' },
    at: { type: 'time', default: null, desc: 'vuruş anı (iniş + dalga + titreşim)' },
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
    const shLimb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = darkOf(c); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1 + 5, y1 + 5); ctx.lineTo(x2 + 5, y2 + 5); ctx.stroke();
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba(c); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); ctx.ellipse(x + 6, y + 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // blok titreşimi (vuruş sonrası 0.5 sn)
    const shake = d >= 0 && d < 0.5 ? Math.sin(d * 55) * 5 * Math.exp(-d * 9) : 0;
    ctx.save(); ctx.translate(shake, 0);

    // ses bloğu
    blob(-110, 0, 220, 64, 14, 'panel2');
    gloss(-78, 16, 30, 9, 0.10);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-70, 42); ctx.lineTo(70, 42); ctx.stroke();
    ctx.restore();

    // tokmak dönüşü: vuruş öncesi kalkık (-0.55 rad), vuruşta 0
    let rot, gy = 0;
    if (d < 0) {
      const raise = p.at == null ? 0 : k.clamp((0.35 + d) / 0.35, 0, 1); // vuruş öncesi gerilme
      rot = -0.55 - 0.18 * raise + Math.sin(t * k.TAU / 2.2) * 0.045;
      gy = Math.sin(t * k.TAU / 2.6) * 3;
    } else {
      const g = k.prog(d, 0, 0.12);
      rot = k.lerp(-0.73, 0, k.E.outCubic(g)) + (d < 0.6 ? Math.sin(d * 30) * 4 * Math.exp(-d * 8) * 0.012 : 0);
    }
    const Wx = 0, Wy = 96; // bilek pivotu
    ctx.save(); ctx.translate(Wx, Wy + gy); ctx.rotate(rot); ctx.translate(-Wx, -Wy);
    shLimb(0, -34, 0, 96, 22, p.color);                    // sap
    disc(0, 100, 13, 13, p.color);                         // topuz
    blob(-75, -80, 150, 46, 16, p.color);                  // kafa
    gloss(-46, -68, 22, 7, 0.11);
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4; // kafa bantları
    ctx.beginPath(); ctx.moveTo(-42, -78); ctx.lineTo(-42, -36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(42, -78); ctx.lineTo(42, -36); ctx.stroke();
    ctx.restore();

    // vuruş efektleri
    if (d >= 0 && d < 0.9) {
      if (d < 0.14) {
        const f = 1 - d / 0.14;
        k.glow(0, -12, 90 * f + 20, 'yellow', 0.5 * f);
        ctx.fillStyle = 'rgba(255,255,255,' + (0.7 * f).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(0, -8, 20 * f + 5, 0, k.TAU); ctx.fill();
      }
      for (let r = 0; r < 2; r++) {
        const dd = d - r * 0.09;
        if (dd < 0) continue;
        const g = k.prog(dd, 0, 0.55);
        ctx.strokeStyle = k.rgba('yellow', (r === 0 ? 0.75 : 0.45) * (1 - g));
        ctx.lineWidth = (r === 0 ? 8 : 5) * (1 - g * 0.6) + 1.5;
        ctx.beginPath(); ctx.arc(0, -6, 16 + 110 * k.E.outExpo(g), 0, k.TAU); ctx.stroke();
      }
      if (d < 0.6) {
        const dg = k.prog(d, 0, 0.6);
        for (let i = 0; i < 10; i++) {
          const a = k.hash(i * 31 + 5) * k.TAU;
          const sp = (60 + k.hash(i * 37 + 9) * 110) * (1 - Math.pow(1 - dg, 2));
          ctx.fillStyle = k.rgba(i % 2 ? 'yellow' : p.color, 0.8 * (1 - dg));
          ctx.beginPath();
          ctx.arc(Math.cos(a) * sp, -10 + Math.sin(a) * sp * 0.6 - dg * dg * 50, 2.5 + k.hash(i * 41 + 3) * 3, 0, k.TAU);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  },
};
