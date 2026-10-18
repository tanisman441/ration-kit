// office/desk — çalışma masası: üstte monitör, kahve fincanı ve lamba;
// çekmece kayarak açılır (slide olayı), monitör LED'i yanıp söner.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor masa tablası merkezidir (0,0).
export default {
  name: 'desk', category: 'office',
  desc: 'Çalışma masası; monitör, kahve fincanı ve masa lambası üstünde, çekmece kayarak açılır',
  tags: ['masa', 'çalışma masası', 'ofis', 'monitör', 'desk', 'office desk', 'table', 'workstation', 'monitor'],
  box: [-170, -160, 170, 110],
  bleed: 14,
  anchor: 'masa tablası merkezi (0,0)',
  points: { top: [0, -150], drawer: [105, 52], screen: [-60, -85] },
  params: {
    color: { type: 'color', default: 'panel2' },
    slide: { type: 'time', default: null, desc: 'çekmece açılma anı: kayar, 0.9 sn açık kalır, kapanır' },
    screen: { type: 'enum', values: ['code', 'chart', 'blank'], default: 'code', desc: 'monitör ekranı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const SH = 'rgba(0,0,0,0.12)', HI = 'rgba(255,255,255,0.10)';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const shade = (x, y, w, h, r) => {
      ctx.fillStyle = SH; ctx.save(); ctx.translate(6, 6);
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill(); ctx.restore();
    };
    const shine = (x, y, rx, ry, rot) => {
      ctx.fillStyle = HI; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, k.TAU); ctx.fill();
    };

    // bacaklar (gövde altında)
    shade(-148, 14, 24, 88, 8); blob(-148, 14, 24, 88, 8, body);
    shade(124, 14, 24, 88, 8); blob(124, 14, 24, 88, 8, body);
    shine(-141, 24, 5, 18, 0.1); shine(131, 24, 5, 18, 0.1);

    // çekmece bloğu (sağ bacak içinde)
    const dx0 = 60, dx1 = 116, dy0 = 24, dy1 = 92;
    shade(dx0, dy0, dx1 - dx0, dy1 - dy0, 8);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(dx0 - LW / 2, dy0 - LW / 2, dx1 - dx0 + LW, dy1 - dy0 + LW, 8 + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(dx0, dy0, dx1 - dx0, dy1 - dy0, 8); ctx.fill();
    shine(dx0 + 12, dy0 + 10, 6, 10, 0.2);

    // çekmece önü (slide olayında sağa kayar)
    const d = p.slide == null ? -1 : t - p.slide;
    let sx = 0;
    if (d >= 0 && d < 1.6) sx = 52 * k.prog(d, 0, 0.22) * (1 - k.prog(d, 1.2, 1.6));
    shade(dx0 + sx, dy0 + 8, dx1 - dx0, 52, 8); blob(dx0 + sx, dy0 + 8, dx1 - dx0, 52, 8, body);
    shine(dx0 + sx + 12, dy0 + 18, 5, 9, 0.2);
    // çekmece kulbu
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); k.rrect(dx0 + sx + (dx1 - dx0) / 2 - 14, dy0 + 30, 28, 7, 3.5); ctx.fill();

    // masa tablası
    shade(-165, -14, 330, 28, 10); blob(-165, -14, 330, 28, 10, body);
    shine(-140, -9, 22, 5, -0.06);

    // monitör (sol üstte)
    const mx = -60, scrW = 96, scrH = 64, sy = -104;
    // stand
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); k.rrect(mx - 5, -18, 10, 18, 4); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(mx - 30, -8, 60, 10, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.8); ctx.beginPath(); k.rrect(mx - 28, -6, 56, 6, 3); ctx.fill();
    // ekran çerçevesi
    shade(mx - scrW / 2, sy, scrW, scrH, 8);
    blob(mx - scrW / 2, sy, scrW, scrH, 8, k.rgba('ink'));
    // ekran
    ctx.fillStyle = k.rgba('bg', 0.92);
    ctx.beginPath(); k.rrect(mx - scrW / 2 + 6, sy + 6, scrW - 12, scrH - 14, 5); ctx.fill();
    const ex = mx - scrW / 2 + 14, ey = sy + 14;
    if (p.screen === 'code') {
      const cols = ['cyan', 'green', 'yellow'];
      for (let r = 0; r < 3; r++) {
        const wlen = 44 + (k.hash(r * 7 + 3) % 22);
        ctx.fillStyle = k.rgba(cols[r % 3], 0.85);
        ctx.beginPath(); k.rrect(ex, ey + r * 13, wlen, 7, 3.5); ctx.fill();
      }
    } else if (p.screen === 'chart') {
      const bars = [18, 30, 12, 36, 24];
      for (let b = 0; b < 5; b++) {
        ctx.fillStyle = k.rgba(b === 3 ? 'yellow' : 'cyan', 0.85);
        ctx.beginPath(); k.rrect(ex + b * 13, ey + 44 - bars[b], 9, bars[b], 3); ctx.fill();
      }
    }
    // LED (boşta yanıp söner)
    const ledOn = (t % 2.2) < 1.3;
    ctx.fillStyle = k.rgba('green', ledOn ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(mx + scrW / 2 - 12, sy + scrH - 4, 3, 0, k.TAU); ctx.fill();
    if (ledOn) k.glow(mx + scrW / 2 - 12, sy + scrH - 4, 8, 'green', 0.4);

    // kahve fincanı (sağda)
    const cx = 40;
    shade(cx - 14, -44, 28, 30, 7); blob(cx - 14, -44, 28, 30, 7, k.rgba('red'));
    shine(cx - 7, -38, 3.5, 6, 0.15);
    // kulp
    ctx.strokeStyle = line; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(cx + 18, -29, 9, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = k.rgba('red'); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(cx + 18, -29, 9, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    // buhar (boşta hafif kıvrılır)
    ctx.strokeStyle = k.rgba('dim', 0.55); ctx.lineWidth = 3;
    for (let s = 0; s < 2; s++) {
      const wob = k.noise1(t * 1.2 + s * 3) * 3;
      ctx.beginPath();
      ctx.moveTo(cx - 6 + s * 12 + wob, -50);
      ctx.quadraticCurveTo(cx - 6 + s * 12 + wob + 5, -58, cx - 6 + s * 12 + wob, -66);
      ctx.stroke();
    }

    // masa lambası (sağ üst, havai tel ink rengiyle)
    const lx = 120;
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(lx, -14); ctx.lineTo(lx, -70); ctx.stroke();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(lx - 12, -18, 24, 8, 4); ctx.fill();
    shade(lx - 30, -96, 60, 26, 10);
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(lx - 30 - LW / 2, -96 - LW / 2, 60 + LW, 26 + LW, 10 + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); k.rrect(lx - 30, -96, 60, 26, 10); ctx.fill();
    shine(lx - 18, -91, 7, 3.5, -0.2);
    // lamba ışığı (boşta hafif nabız)
    const lp = 0.10 + Math.sin(t * 2.4) * 0.02;
    ctx.fillStyle = `rgba(255,235,150,${lp})`;
    ctx.beginPath();
    ctx.moveTo(lx - 24, -70); ctx.lineTo(lx + 24, -70);
    ctx.lineTo(lx + 44, -14); ctx.lineTo(lx - 44, -14); ctx.closePath(); ctx.fill();
  },
};
