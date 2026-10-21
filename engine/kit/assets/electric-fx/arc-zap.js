// electric-fx/arc-zap — iki elektrot arasında at anında çakan elektrik arkı.
// ANIMASYON: `at` zamanında 0.15 sn flaş + dallanan şimşek (kare kare yeniden şekillenir);
// idle'da elektrot uçlarında hafif parıltı titremesi. Tek vurgu: yellow.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'arc-zap',
  category: 'electric-fx',
  desc: 'İki elektrot arasında at anında flaşla çakan, dallanan elektrik arkı',
  tags: ['elektrik', 'ark', 'çarpma', 'yıldırım', 'voltaj', 'şok', 'electric', 'arc', 'zap', 'lightning', 'shock', 'voltage'],
  box: [-90, -110, 90, 110],
  bleed: 60,
  anchor: 'ark orta noktası (0,0)',
  points: { top: [0, -58], bottom: [0, 58], mid: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'ark çakma anı: 0.15 sn flaş + dallanan şimşek' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const flashing = d >= 0 && d < 0.22;
    const TY = -58, BY = 58;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- elektrotlar: sağ alt gölge, gövde, sol üst parlama, kontur ---
    for (const [ey, dir] of [[TY, -1], [BY, 1]]) {
      const bx = -15, bw = 30, bh = 52;
      const by = dir < 0 ? ey - bh + 8 : ey - 8;   // uç, ark bölgesine bakar
      ctx.fillStyle = k.rgba('bg', 0.12);          // gölge sağ alta
      ctx.beginPath(); k.rrect(bx + 6, by + 6, bw, bh, 10); ctx.fill();
      ctx.fillStyle = k.rgba('panel2');            // gövde
      ctx.beginPath(); k.rrect(bx, by, bw, bh, 10); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);     // sol üst parlama
      ctx.beginPath(); ctx.ellipse(bx + 10, by + 12, 8, 12, 0.5, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55);        // kontur
      ctx.lineWidth = 5;
      ctx.beginPath(); k.rrect(bx, by, bw, bh, 10); ctx.stroke();
      // metal uç
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); ctx.arc(0, ey, 9, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.6); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, ey, 9, 0, k.TAU); ctx.stroke();
    }

    // --- idle: uçlarda hafif parıltı titremesi ---
    if (!flashing) {
      const sh = 0.14 + 0.10 * (0.5 + 0.5 * k.noise1(t * 3.1));
      k.glow(0, TY, 22, p.color, sh);
      k.glow(0, BY, 22, p.color, sh);
    }

    // --- flaş: dallanan şimşek ---
    if (flashing) {
      const env = 1 - k.prog(d, 0.02, 0.22);       // hızlı yükselir, 0.2 sn'de söner
      const fr = Math.floor(d / 0.04);             // her 40 ms'te yeni şekil
      k.glow(0, (TY + BY) / 2, 70, p.color, 0.5 * env);

      // ana hat: uçlar arası kırık çizgi
      const segs = 7, spread = 30;
      const pt = [];
      for (let s = 0; s <= segs; s++) {
        const y = k.lerp(TY, BY, s / segs);
        const x = s === 0 || s === segs ? 0 : (k.hash(fr * 131 + s * 17) - 0.5) * 2 * spread * env;
        pt.push([x, y]);
      }
      ctx.strokeStyle = k.rgba(p.color, 0.95 * env);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(pt[0][0], pt[0][1]);
      for (const [x, y] of pt) ctx.lineTo(x, y);
      ctx.stroke();
      // beyaz çekirdek
      ctx.strokeStyle = k.rgba('#ffffff', 0.9 * env);
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // 2 dal
      for (let b = 0; b < 2; b++) {
        const bi = 2 + b * 2 + Math.floor(k.hash(fr * 77 + b * 31) * 2);
        const [sx, sy] = pt[Math.min(bi, segs - 1)];
        const len = 34 * env * (0.6 + k.hash(fr * 41 + b * 13) * 0.6);
        const ang = (b === 0 ? -1 : 1) * (0.7 + k.hash(fr * 53 + b * 7) * 0.6);
        ctx.strokeStyle = k.rgba(p.color, 0.8 * env);
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.sin(ang) * len, sy + Math.cos(ang) * len * 0.7);
        ctx.stroke();
      }
      // kıvılcım parçacıkları
      for (let i = 0; i < 6; i++) {
        const a = k.hash(i * 3 + fr * 11) * k.TAU;
        const rr = (18 + k.hash(i * 13 + fr * 5) * 46) * env;
        const px = Math.cos(a) * rr, py = Math.sin(a) * rr * 0.8;
        k.glow(px, py, 12, p.color, 0.5 * env);
      }
    }
  },
};
