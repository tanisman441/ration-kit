// courtroom-fx/objection-point — itiraz işareti: at anında el aşağıdan hızla fırlayıp
// yukarı işaret eder; ünlem efektleri patlar. Boştayken hafif salınım.
// NOT: canvas y-aşağıdır; bilek çevresi (0,-30).
export default {
  name: 'objection-point', category: 'courtroom-fx',
  desc: 'İtiraz eden el; at anında fırlayıp yukarı işaret eder, ünlem efektleri patlar',
  tags: ['itiraz', 'el', 'işaret', 'parmak', 'mahkeme', 'objection', 'point', 'hand', 'finger', 'court', 'raise', 'protest'],
  box: [-150, -220, 150, 170],
  bleed: 40,
  anchor: 'bilek çevresi (0,-30)',
  points: { tip: [-20, -145], wrist: [-20, -30] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'el rengi' },
    at: { type: 'time', default: null, desc: 'itiraz anı (elin fırlayışı + ünlemler)' },
  },
  draw(ctx, t, p, k) {
    const LW = 6, line = k.rgba('bg', 0.55);
    const darkOf = c => { const v = k.col(c); return 'rgb(' + Math.round(v[0] * 0.88) + ',' + Math.round(v[1] * 0.88) + ',' + Math.round(v[2] * 0.88) + ')'; };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = darkOf(c); ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = k.rgba(c); ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const shLimb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = darkOf(c); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1 + 5, y1 + 5); ctx.lineTo(x2 + 5, y2 + 5); ctx.stroke();
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = k.rgba(c); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const gloss = (x, y, rx, ry, a) => {
      ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(2) + ')';
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, -0.4, 0, k.TAU); ctx.fill();
    };
    const exclaim = (x, y, s, a) => {
      ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
      ctx.strokeStyle = k.rgba('yellow', a); ctx.lineWidth = 9; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, -26); ctx.lineTo(0, 6); ctx.stroke();
      ctx.fillStyle = k.rgba('yellow', a);
      ctx.beginPath(); ctx.arc(0, 20, 7, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // fırlayış: d<0'da el altta bekler, d>=0'da yukarı fırlar
    let yoff;
    if (p.at == null) yoff = 0;
    else if (d < 0) yoff = 60;
    else yoff = 60 * (1 - k.E.outExpo(k.prog(d, 0, 0.28)));
    const sway = k.noise1(t * 5 + 7) * 3;

    ctx.save(); ctx.translate(sway, yoff);

    // ön kol (alttan girer)
    shLimb(-88, 118, -44, 40, 36, p.color);
    // manşet
    blob(-112, 68, 64, 44, 12, 'panel2');
    gloss(-96, 78, 16, 6, 0.10);
    // yumruk
    blob(-48, -86, 56, 52, 16, p.color);
    gloss(-32, -74, 12, 6, 0.11);
    // işaret parmağı (yukarı)
    shLimb(-20, -80, -20, -140, 19, p.color);
    // başparmak (yana)
    shLimb(-44, -66, -66, -84, 15, p.color);
    ctx.restore();

    // bilek şok halkası (0.35 sn)
    if (d >= 0 && d < 0.35) {
      const g = k.prog(d, 0, 0.35);
      ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - g));
      ctx.lineWidth = 6 * (1 - g) + 1.5;
      ctx.beginPath(); ctx.ellipse(sway - 20, -30 + yoff, 34 + g * 60, 20 + g * 34, 0, 0, k.TAU); ctx.stroke();
    }

    // ünlem efektleri: kademeli patlama
    const marks = [[-84, -186, 0], [-20, -202, 0.1], [44, -186, 0.2]];
    for (const [mx, my, lag] of marks) {
      const dd = d - lag;
      if (dd < 0 || dd > 0.7) continue;
      const g = k.prog(dd, 0, 0.7);
      const s = k.E.outBack(k.prog(dd, 0, 0.22), 2);
      const yy = my - g * 26;
      exclaim(sway + mx, yy, s, 0.95 * (1 - g * 0.7));
    }
    ctx.restore();
  },
};
