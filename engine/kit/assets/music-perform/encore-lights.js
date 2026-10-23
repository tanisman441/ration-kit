// music-perform/encore-lights — süpüren sahne ışıkları: döngüsel beam taraması + encore flash olayı.
// NOT: canvas y-aşağıdır; zemin (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'encore-lights', category: 'music-perform',
  desc: 'Süpüren sahne spotları; flash anında tüm ışıklar patlar, hüzmeler parlar',
  tags: ['sahne ışıkları', 'spot', 'ışık', 'konser', 'encore', 'flash', 'stage lights', 'spotlight', 'concert', 'encore', 'beam'],
  box: [-280, -330, 280, 16],
  bleed: 40,
  anchor: 'zemin (0,0); ışık köprüsünün ortası',
  points: { rig: [0, -290], stage: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    flash: { type: 'time', default: null, desc: 'encore flaşı: tüm hüzmeler parlar, beyaz patlama (~0.5 sn olay)' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const rigC = k.rgba('panel2');
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    const d = p.flash == null ? -1 : t - p.flash;
    const flOn = d >= 0 && d < 0.5;
    const fg = flOn ? d / 0.5 : 0;
    const cols = ['yellow', 'cyan', 'purple'];

    // zemin
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 240, 10, 0, 0, k.TAU); ctx.fill();

    // mikrofon sehpası (konser bağlamı)
    limb(0, 0, 0, -118, 9, rigC);
    blob(-46, -128, 92, 14, 7, rigC);
    disc(46, -134, 11, 13, k.rgba('panel'));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(42, -138, 4, 6, -0.3, 0, k.TAU); ctx.fill();

    // ---- ışık köprüsü ----
    const rigY = -290;
    blob(-260, rigY - 14, 520, 26, 10, rigC);
    limb(-238, rigY + 12, -238, -6, 10, rigC);
    limb(238, rigY + 12, 238, -6, 10, rigC);
    // LED şeridi: yanıp sönen noktalar
    for (let i = 0; i < 16; i++) {
      const lx = -224 + i * 30;
      const on = k.hash(i * 7 + Math.floor(t * 3)) < 0.6;
      ctx.fillStyle = k.rgba(on ? 'yellow' : 'panel', on ? 0.95 : 0.8);
      ctx.beginPath(); ctx.arc(lx, rigY - 1, 4, 0, k.TAU); ctx.fill();
    }

    // 3 spot: gövde + dönen hüzme
    const heads = [-150, 0, 150];
    for (let i = 0; i < 3; i++) {
      const hx = heads[i], col = cols[i];
      blob(hx - 22, rigY + 12, 44, 30, 10, k.rgba('ink'));
      disc(hx, rigY + 42, 15, 11, k.rgba(col));
      k.glow(hx, rigY + 44, 26, col, 0.4 + (flOn ? 0.3 * (1 - fg) : 0));
      // hüzme: döngüsel tarama (sweep)
      const ang = Math.sin(t * 1.15 + i * 2.1) * 0.55;
      const len = 280;
      const dirX = Math.sin(ang), dirY = Math.cos(ang);
      const w2 = 44;
      const px = -dirY, py = dirX;                       // dikey vektör
      const alpha = 0.16 + (flOn ? 0.34 * (1 - fg) : 0) + 0.03 * Math.sin(t * 7 + i * 3);
      const g = ctx.createLinearGradient(hx, rigY + 44, hx + dirX * len, rigY + 44 + dirY * len);
      const c0 = k.col(col);
      g.addColorStop(0, `rgba(${c0[0]},${c0[1]},${c0[2]},${Math.min(0.6, alpha + 0.25)})`);
      g.addColorStop(1, `rgba(${c0[0]},${c0[1]},${c0[2]},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(hx - px * 12, rigY + 44 - py * 12);
      ctx.lineTo(hx + dirX * len - px * w2, rigY + 44 + dirY * len - py * w2);
      ctx.lineTo(hx + dirX * len + px * w2, rigY + 44 + dirY * len + py * w2);
      ctx.lineTo(hx + px * 12, rigY + 44 + py * 12);
      ctx.closePath(); ctx.fill();
      // zemindeki ışık havuzu
      ctx.fillStyle = `rgba(${c0[0]},${c0[1]},${c0[2]},${0.10 + (flOn ? 0.25 * (1 - fg) : 0)})`;
      ctx.beginPath();
      ctx.ellipse(hx + dirX * 280, -4, 52, 12, 0, 0, k.TAU); ctx.fill();
    }

    // havada süzülen tozlar (canlı his)
    for (let i = 0; i < 10; i++) {
      const h1 = k.hash(i * 11 + 4), h2 = k.hash(i * 17 + 9);
      const px = (h1 - 0.5) * 480;
      const py = -40 - ((t * 14 + h2 * 240) % 240);
      ctx.fillStyle = k.rgba('panel', 0.5);
      ctx.beginPath(); ctx.arc(px, py, 2.2, 0, k.TAU); ctx.fill();
    }

    // encore flaşı: beyaz patlama + ışınlar
    if (flOn) {
      const a = 1 - fg;
      ctx.fillStyle = `rgba(255,255,255,${0.35 * a})`;
      ctx.beginPath(); ctx.ellipse(0, -160, 200 * (0.4 + fg), 140 * (0.4 + fg), 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('yellow', 0.7 * a); ctx.lineWidth = 4;
      for (let i = 0; i < 12; i++) {
        const an = (i / 12) * k.TAU + 0.2;
        const r0 = 60 + fg * 40, r1 = 120 + fg * 160;
        ctx.beginPath();
        ctx.moveTo(Math.cos(an) * r0, -160 + Math.sin(an) * r0);
        ctx.lineTo(Math.cos(an) * r1, -160 + Math.sin(an) * r1);
        ctx.stroke();
      }
    }
  },
};
