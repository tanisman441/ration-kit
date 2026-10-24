// courtroom-fx/scales-tip — adalet terazisi: tilt (-1..1) kirişi eğer, kefeler zincirle
// dikey asılı kalır; boştayken hafif salınım. Vurgu: denge ibresi (yellow).
// NOT: canvas y-aşağıdır; kaide tabanı (0,44).
export default {
  name: 'scales-tip', category: 'courtroom-fx',
  desc: 'Adalet terazisi; tilt ile kefeler eğilir, zincirler dikey salınır',
  tags: ['terazi', 'adalet', 'denge', 'tartı', 'mahkeme', 'hukuk', 'scales', 'justice', 'balance', 'court', 'law'],
  box: [-195, -240, 195, 60],
  bleed: 25,
  anchor: 'kaide tabanı (0,44)',
  points: { panL: [-108, -84], panR: [108, -84], top: [0, -196] },
  params: {
    color: { type: 'color', default: 'dim', desc: 'terazi rengi' },
    tilt: { type: 'number', default: 0, desc: 'kefe eğimi (-1..1)' },
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
    const tilt = k.clamp(p.tilt, -1, 1);
    const sway = Math.sin(t * k.TAU / 3.2) * 0.035; // canlı salınım
    const rot = tilt * 0.35 + sway;

    // kaide + sütun
    blob(-72, 10, 144, 34, 12, 'panel2');
    gloss(-48, 18, 20, 7, 0.10);
    shLimb(0, 12, 0, -168, 16, p.color);
    disc(0, -184, 10, 10, p.color); // tepe topuzu

    // kiriş (pivot: (0,-160))
    const P = [0, -160];
    const beamEnd = ex => [P[0] + ex * Math.cos(rot), P[1] + ex * Math.sin(rot)];
    ctx.save(); ctx.translate(P[0], P[1]); ctx.rotate(rot);
    shLimb(-112, 0, 112, 0, 12, 'ink');
    disc(0, 0, 13, 13, 'ink'); // merkez mafsal
    for (const s of [-1, 1]) disc(s * 108, 0, 7, 7, 'ink'); // uç askılar
    // denge ibresi (vurgu: yellow) — kirişle birlikte döner
    ctx.save(); ctx.rotate(-rot * 2.2); // ibre daha hızlı sallanır
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.moveTo(-5, -12); ctx.lineTo(5, -12); ctx.lineTo(0, -34); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.restore();

    // kefeler: zincirlerle dikey asılı
    for (const s of [-1, 1]) {
      const [ex, ey] = beamEnd(s * 108);
      const swing = Math.sin(t * k.TAU / 2.6 + s * 1.4) * 4; // zincir salınımı
      const px = ex + swing, py = ey + 66;
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3.5; // zincirler
      for (const cx of [-24, 0, 24]) {
        ctx.beginPath(); ctx.moveTo(ex, ey + 4); ctx.lineTo(px + cx, py - 6); ctx.stroke();
      }
      blob(px - 36, py - 8, 72, 26, 13, p.color); // kefe
      gloss(px - 20, py - 2, 14, 5, 0.10);
      ctx.fillStyle = darkOf(p.color); // kefe içi
      ctx.beginPath(); ctx.ellipse(px, py - 2, 26, 7, 0, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
