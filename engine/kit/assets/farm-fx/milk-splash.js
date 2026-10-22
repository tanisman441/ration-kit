// farm-fx/milk-splash — sıçrayan süt, önden görünüm. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) süt birikintisi merkezidir.
export default {
  name: 'milk-splash', category: 'farm-fx',
  desc: 'Sıçrayan süt; at anında damla düşer, taç sıçrama ve damlacıklar saçılır',
  tags: ['süt', 'sıçrama', 'damla', 'sıvı', 'çiftlik', 'inek', 'milk', 'splash', 'drop', 'liquid'],
  box: [-120, -165, 120, 25],
  bleed: 50,
  anchor: 'süt birikintisi merkezi (0,0)',
  points: { top: [0, -60], splash: [0, -40] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'damlanın düşüş anı — taç sıçrama + damlacıklar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const milk = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const df = p.at == null ? -1 : t - p.at;
    const hasDrop = df < 0 && df > -0.5;                      // damla düşüyor
    const splashing = df >= 0 && df < 0.9;                    // taç sıçrama
    const senv = splashing ? Math.sin(df / 0.9 * Math.PI) : 0;
    const after = df >= 0.9 ? Math.exp(-(df - 0.9) * 3) : 0;  // yerleşme sönümü
    const shimmer = 1 + Math.sin(t * k.TAU * 0.8) * 0.012;    // idle parlama
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c, a) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      if (a != null) { ctx.globalAlpha = a; }
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.globalAlpha = 1;
    };

    // düşen damla (at'tan 0.5 sn önce belirir)
    if (hasDrop) {
      const prog = 1 + df / 0.5;
      const dy = -160 + prog * 145;
      const stretch = 1 + prog * 0.6;
      disc(0, dy, 9, 9 * stretch, milk);
      ctx.fillStyle = milk;
      ctx.beginPath(); ctx.moveTo(-7, dy - 7 * stretch); ctx.lineTo(7, dy - 7 * stretch);
      ctx.lineTo(0, dy - 7 * stretch - 16); ctx.closePath(); ctx.fill();
    }

    // taç sıçrama (halka + sivri uçlar)
    if (splashing) {
      const crownH = 28 + senv * 78, crownW = 34 + senv * 58;
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, -14, crownW + 6, crownH * 0.35 + 6, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = milk;
      ctx.beginPath(); ctx.ellipse(0, -14, crownW, crownH * 0.35, 0, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 7; i++) {                            // taç dişleri
        const a = Math.PI + (i / 6) * Math.PI;
        const bx = Math.cos(a) * crownW, tipH = crownH * (0.55 + k.hash(i * 13 + 1) * 0.75);
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.moveTo(bx - 8, -14); ctx.lineTo(bx + 8, -14);
        ctx.lineTo(bx, -14 - tipH - 6); ctx.closePath(); ctx.fill();
        ctx.fillStyle = milk;
        ctx.beginPath(); ctx.moveTo(bx - 6, -14); ctx.lineTo(bx + 6, -14);
        ctx.lineTo(bx, -14 - tipH); ctx.closePath(); ctx.fill();
      }
      // çarpma halkası (genişleyen ince halka)
      const ring = Math.min(df / 0.5, 1);
      if (ring > 0) {
        ctx.strokeStyle = milk; ctx.globalAlpha = 0.55 * (1 - ring);
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.ellipse(0, -4, 20 + ring * 75, 6 + ring * 14, 0, 0, k.TAU); ctx.stroke();
        ctx.globalAlpha = 1;
      }
      // saçılan damlacıklar
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (k.hash(i * 17 + 2) - 0.5) * 2.4;
        const dist = df * 150 * (0.6 + k.hash(i * 17 + 4) * 0.7);
        const dx = Math.cos(a) * dist, dy = -22 + Math.sin(a) * dist + df * df * 190;
        const r = 9 * (1 - df / 0.9) + 3;
        disc(dx, dy, r, r, milk, Math.min(senv * 1.4, 1));
      }
    }

    // birikinti (her zaman; olay sonrası hafif büyür)
    const pw = 94 * shimmer * (1 + after * 0.08 + senv * 0.12);
    disc(0, 0, pw, 20 * shimmer, milk);
    // parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-pw * 0.4, -7, pw * 0.32, 8, -0.15, 0, k.TAU); ctx.fill();
  },
};
