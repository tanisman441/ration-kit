// office/printer — önden yazıcı: üstte kağıt tepsisi, önde çıkış yuvası;
// print anında kağıt kayarak çıkar ve üstünde baskı çizgileri belirir.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor gövde merkezidir (0,0).
export default {
  name: 'printer', category: 'office',
  desc: 'Önden yazıcı; üstte kağıt tepsisi, baskı anında kağıt önden kayarak çıkar',
  tags: ['yazıcı', 'printer', 'baskı', 'kağıt', 'ofis', 'print', 'printing', 'paper', 'office'],
  box: [-135, -105, 135, 135],
  bleed: 14,
  anchor: 'gövde merkezi (0,0)',
  points: { tray: [0, -90], paperout: [0, 78], top: [0, -100] },
  params: {
    color: { type: 'color', default: 'panel2' },
    print: { type: 'time', default: null, desc: 'baskı anı: kağıt 1.2 sn\'de çıkar, baskı çizgileri belirir' },
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

    // üst kağıt tepsisi (kağıt destesi)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-78 - LW / 2, -100 - LW / 2, 156 + LW, 18 + LW, 6 + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(-78, -100, 156, 18, 6); ctx.fill();
    for (let i = 0; i < 4; i++) { // destedeki kağıtlar
      ctx.fillStyle = k.rgba('bg', 0.95);
      ctx.beginPath(); k.rrect(-66, -96 + i * 3.2, 132, 4.5, 2); ctx.fill();
    }

    // gövde
    shade(-118, -80, 236, 130, 16);
    blob(-118, -80, 236, 130, 16, body);
    shine(-92, -70, 20, 7, -0.12);

    // ön kapak çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-104, -46); ctx.lineTo(104, -46); ctx.stroke();

    // çıkış yuvası (koyu şerit)
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(-88, 8, 176, 16, 8); ctx.fill();

    // çıkan kağıt
    const d = p.print == null ? -1 : t - p.print;
    const pr = d < 0 ? 0 : k.prog(d, 0, 1.2);   // kağıdın çıkış ilerlemesi
    const paperH = pr * 92;                       // yuvadan çıkan uzunluk
    if (pr > 0) {
      const px = -58, py = 22;
      // baskı titremesi (yazıcının boşta sallantısı)
      const jx = k.noise1(t * 18) * 2 * (d < 1.2 ? 1 : 0);
      ctx.fillStyle = SH; ctx.save(); ctx.translate(6, 6);
      ctx.beginPath(); k.rrect(px, py, 116, paperH, 4); ctx.fill(); ctx.restore();
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(px - LW / 2 + jx, py - LW / 2, 116 + LW, paperH + LW, 4 + LW / 2); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.97); ctx.beginPath(); k.rrect(px + jx, py, 116, paperH, 4); ctx.fill();
      // baskı çizgileri (kağıt uzadıkça belirir)
      ctx.fillStyle = k.rgba('dim', 0.75);
      const lines = Math.floor(pr * 5);
      for (let ln = 0; ln < lines; ln++) {
        ctx.beginPath(); k.rrect(px + jx + 14, py + 14 + ln * 15, 88 - (k.hash(ln * 5 + 1) % 20), 6, 3); ctx.fill();
      }
    }

    // güç düğmesi + LED (boşta yanıp söner)
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.beginPath(); ctx.arc(-92, 34, 7, 0, k.TAU); ctx.fill();
    const ledOn = (t % 1.8) < 1.1;
    ctx.fillStyle = k.rgba('cyan', ledOn ? 1 : 0.25);
    ctx.beginPath(); ctx.arc(-70, 34, 3.5, 0, k.TAU); ctx.fill();
    if (ledOn) k.glow(-70, 34, 9, 'cyan', 0.4);

    // baskı sırasında iç mekanizma sesi: gövde hafif nabız yapar
    if (d >= 0 && d < 1.2) {
      const vib = Math.sin(t * 40) * 1.5;
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(96 + vib, -20); ctx.lineTo(108 + vib, -12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(96 - vib, 0); ctx.lineTo(108 - vib, 8); ctx.stroke();
    }
  },
};
