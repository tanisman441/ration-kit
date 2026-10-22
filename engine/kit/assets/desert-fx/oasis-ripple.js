// desert-fx/oasis-ripple — vaha suyunda halka dalgaları ve palmiye.
// at anında (0.9 sn) bir damla düşer: sıçrama + 3 genişleyen halka;
// boşta her ~2.4 sn'de bir hafif halka nabzı, palmiye yaprakları sallanır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) su yüzeyi merkezidir.
export default {
  name: 'oasis-ripple', category: 'desert-fx',
  desc: 'Vaha suyu: damla düşüp halka dalgaları yayar, palmiye yaprakları sallanır',
  tags: ['vaha', 'oasis', 'su', 'dalga', 'halka', 'palmiye', 'çöl', 'water', 'ripple', 'palm', 'desert'],
  box: [-155, -200, 155, 25],
  bleed: 30,
  anchor: 'su yüzeyi merkezi (0,0)',
  points: { surface: [0, 0], palm: [108, -148], drop: [0, -80] },
  params: {
    at: { type: 'time', default: null, desc: 'damla düşme anı (0.9 sn, sıçrama + 3 halka)' },
    color: { type: 'color', default: 'cyan', desc: 'su rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 4;
    const acc = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const ad = p.at == null ? -1 : t - p.at;
    const dropping = ad >= 0 && ad < 0.9;
    ctx.lineCap = 'round';

    // Palmiye: gövde + yapraklar (nötr tonlar, vurgu suda)
    const topX = 108, topY = -148;
    // gövde: eğri kalın çizgi
    ctx.strokeStyle = line; ctx.lineWidth = 24 + LW;
    ctx.beginPath(); ctx.moveTo(85, 4); ctx.quadraticCurveTo(92, -80, topX, topY); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = 24;
    ctx.beginPath(); ctx.moveTo(85, 4); ctx.quadraticCurveTo(92, -80, topX, topY); ctx.stroke();
    // gövde halkaları (iç detay: ink, ince)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
    for (let i = 0; i < 5; i++) {
      const f = 0.2 + i * 0.16;
      const qx = 85 * (1 - f) + topX * f - 8, qy = 4 * (1 - f) + topY * f + 6 * Math.sin(f * 3);
      ctx.beginPath(); ctx.moveTo(qx - 10, qy); ctx.quadraticCurveTo(qx, qy + 5, qx + 10, qy); ctx.stroke();
    }
    // yapraklar: 5 sarkık yay, rüzgârda sallanır
    for (let i = 0; i < 5; i++) {
      const a = -2.75 + i * 0.62;
      const sw = Math.sin(t * 1.6 + i * 1.3) * 6;
      const ex = topX + Math.cos(a) * 58 + sw, ey = topY + Math.sin(a) * 34 + 26 + sw * 0.5;
      const cx = topX + Math.cos(a) * 30, cy = topY - 6;
      ctx.strokeStyle = line; ctx.lineWidth = 12 + LW;
      ctx.beginPath(); ctx.moveTo(topX, topY); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
      ctx.strokeStyle = k.rgba('dim', 0.95); ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(topX, topY); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(topX, topY); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
    }
    // hindistancevizleri
    for (let i = 0; i < 2; i++) {
      const cx = topX - 12 + i * 22, cy = topY + 10 + (i % 2) * 6;
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(cx, cy, 11 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', 0.95); ctx.beginPath(); ctx.arc(cx, cy, 11, 0, k.TAU); ctx.fill();
    }

    // Kaya (sol)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-128 - LW / 2, -22 - LW / 2, 56 + LW, 30 + LW, 14); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 0.9); ctx.beginPath(); k.rrect(-128, -22, 56, 30, 14); ctx.fill();

    // Kum kıyısı: suyun altında ince halka
    ctx.fillStyle = k.rgba('dim', 0.45);
    ctx.beginPath(); ctx.ellipse(0, 10, 144, 30, 0, 0, k.TAU); ctx.fill();
    // Su: elips (vurgu: cyan)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 8, 130 + LW / 2, 24 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.45);
    ctx.beginPath(); ctx.ellipse(0, 8, 130, 24, 0, 0, k.TAU); ctx.fill();
    // su parlaması: sol üst beyaz alfa 0.12
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-52, 0, 44, 8, -0.06, 0, k.TAU); ctx.fill();

    // Halkalar: yatay elipsler
    const ring = (rx, a, w) => {
      if (a <= 0.01 || rx <= 1) return;
      ctx.strokeStyle = k.rgba(p.color, a); ctx.lineWidth = w;
      ctx.beginPath(); ctx.ellipse(0, 6, rx, Math.max(rx * 0.24, 2), 0, 0, k.TAU); ctx.stroke();
    };
    if (dropping && ad >= 0.35) {
      // olay: 3 ardışık halka
      for (let i = 0; i < 3; i++) {
        const rt = ad - 0.35 - i * 0.1;
        if (rt < 0) continue;
        const prog = rt / 0.55;
        if (prog > 1) continue;
        ring(16 + prog * 105, (1 - prog) * 0.85, 6 - prog * 3);
      }
    } else if (!dropping) {
      // boşta: ~2.4 sn periyotta tek hafif halka
      const cyc = 2.4, ph = (t % cyc) / cyc;
      ring(16 + ph * 100, (1 - ph) * 0.4, 4);
    }

    // Damla + sıçrama (at olayı)
    if (dropping) {
      if (ad < 0.35) {
        // damla düşüyor
        const f = ad / 0.35, dy = -150 + f * 156;
        ctx.fillStyle = k.rgba(p.color, 0.9);
        ctx.beginPath(); ctx.arc(0, dy, 7, 0, k.TAU); ctx.fill();
        ctx.fillStyle = k.rgba(p.color, 0.4);
        ctx.beginPath(); ctx.arc(0, dy - 14, 4, 0, k.TAU); ctx.fill();
      } else if (ad < 0.5) {
        // sıçrama: 5 damlacık
        const f = (ad - 0.35) / 0.15;
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + (i - 2) * 0.5;
          const px = Math.cos(a) * f * 42, py = 6 + Math.sin(a) * f * 42 - f * 10;
          ctx.fillStyle = k.rgba(p.color, 0.85 * (1 - f));
          ctx.beginPath(); ctx.arc(px, py, 4.5 * (1 - f * 0.4), 0, k.TAU); ctx.fill();
        }
      }
    }
  },
};
