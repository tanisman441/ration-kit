// cyber-fx/hack-pulse — terminal ekranından yayılan yeşil veri nabzı.
// ANIMASYON: `at` anında 0.95 sn güçlü nabız dalgası (genişleyen halka + veri parçacıkları + ekran flaşı);
// idle'da 2.4 sn döngüyle yumuşak nabız halkaları + kayan veri noktaları. Tek vurgu: green.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'hack-pulse', category: 'cyber-fx',
  desc: 'Terminal ekranından yayılan yeşil veri nabız dalgası; at anında güçlü nabız patlar',
  tags: ['hack', 'hacker', 'nabız', 'dalga', 'veri', 'siber', 'sinyal', 'terminal', 'ekran', 'pulse', 'hack', 'data', 'wave', 'signal', 'cyber'],
  box: [-120, -120, 120, 120],
  bleed: 50,
  anchor: 'ekran merkezi (0,-10)',
  points: { screen: [0, -10], center: [0, -10] },
  params: {
    at: { type: 'time', default: null, desc: 'nabız anı: 0.95 sn yoğun yeşil veri dalgası yayılır' },
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.95;
    const W = 150, H = 104, CX = 0, CY = -10;
    ctx.save();
    ctx.lineCap = 'round';

    // --- terminal gövdesi: gölge, panel, sol üst parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-W / 2 + 6, CY - H / 2 + 6, W, H, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-W / 2, CY - H / 2, W, H, 14); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-W / 2 + 34, CY - H / 2 + 14, 42, 13, -0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-W / 2, CY - H / 2, W, H, 14); ctx.stroke();

    // --- ekran: ink çerçeve + bg zemin ---
    const sx = -W / 2 + 12, sy = CY - H / 2 + 12, sw = W - 24, sh = H - 36;
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(sx - 4, sy - 4, sw + 8, sh + 8, 8); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.92);
    ctx.beginPath(); k.rrect(sx, sy, sw, sh, 6); ctx.fill();

    // ekrandaki veri akışı: 3 satır kod çizgisi (yeşil, kayan)
    for (let i = 0; i < 3; i++) {
      const rowY = sy + 16 + i * 18;
      const wob = (k.noise1(t * 2.5 + i * 9) * 0.5 + 0.5);
      const lw = sw * (0.35 + 0.45 * wob);
      ctx.fillStyle = k.rgba(p.color, 0.75);
      ctx.beginPath(); k.rrect(sx + 10, rowY, lw, 7, 3.5); ctx.fill();
    }
    // prompt: >_ + yanıp sönen imleç
    ctx.strokeStyle = k.rgba(p.color, 0.95); ctx.lineWidth = 5;
    const py = sy + sh - 12;
    ctx.beginPath();
    ctx.moveTo(sx + 10, py - 8); ctx.lineTo(sx + 20, py); ctx.lineTo(sx + 10, py + 8);
    ctx.stroke();
    const blink = (t % 0.9) < 0.55;
    if (blink) {
      ctx.fillStyle = k.rgba(p.color, 0.95);
      ctx.fillRect(sx + 26, py - 8, 8, 16);
    }

    // at anında ekran flaşı (0.15 sn)
    if (burst && d < 0.15) {
      const fl = 1 - k.prog(d, 0, 0.15);
      ctx.fillStyle = k.rgba(p.color, 0.35 * fl);
      ctx.beginPath(); k.rrect(sx, sy, sw, sh, 6); ctx.fill();
      k.glow(CX, CY, 90, p.color, 0.5 * fl);
    }

    // --- nabız halkaları ---
    // idle: 2.4 sn döngü, 2 halka, yumuşak
    const ring = (r, alpha, width, strong) => {
      if (alpha <= 0.01) return;
      if (strong) k.glow(CX, CY, r, p.color, alpha * 0.5);
      ctx.strokeStyle = k.rgba(p.color, alpha);
      ctx.lineWidth = width;
      ctx.beginPath(); ctx.arc(CX, CY, r, 0, k.TAU); ctx.stroke();
    };
    if (!burst) {
      for (let i = 0; i < 2; i++) {
        const ph = ((t / 2.4) + i / 2) % 1;
        const r = 34 + ph * 88;
        const alpha = 0.28 * Math.sin(ph * Math.PI);
        ring(r, alpha, 4, false);
      }
    }
    // at anında güçlü dalga: 0.95 sn genişler, 3 katmanlı
    if (burst) {
      const env = 1 - k.prog(d, 0, 0.95);
      for (let i = 0; i < 3; i++) {
        const dd = k.clamp(d - i * 0.1, 0, 0.95);
        const r = 30 + (dd / 0.95) * 115;
        ring(r, 0.75 * env, 7 - i * 1.5, i === 0);
      }
      // veri parçacıkları: 14 yeşil kare, dışa fırlar
      for (let i = 0; i < 14; i++) {
        const start = k.hash(30 + i * 11) * 0.25;
        const fly = k.E.outCubic(k.prog(d, start, start + 0.55));
        if (fly <= 0) continue;
        const ang = k.hash(70 + i * 13) * k.TAU;
        const rr = 40 + fly * 95;
        const x = CX + Math.cos(ang) * rr, y = CY + Math.sin(ang) * rr;
        const alpha = 1 - k.prog(d, 0.4, 0.95);
        if (alpha <= 0.01) continue;
        const s = 5 + k.hash(i * 5 + 2) * 5;
        ctx.fillStyle = k.rgba(p.color, 0.9 * alpha);
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang + fly * 2);
        ctx.fillRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }
    ctx.restore();
  },
};
