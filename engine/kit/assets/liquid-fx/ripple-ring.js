// liquid-fx/ripple-ring — yüzeye damla düşünce genişleyen halka dalgalar.
// NOT: canvas y-aşağıdır; yüzey y=0 yatay çizgisidir, halkalar elips olarak genişler.
export default {
  name: 'ripple-ring',
  category: 'liquid-fx',
  desc: 'Su yüzeyine düşen damlanın genişleyip sönen halka dalgaları',
  tags: ['halka', 'dalga', 'su yüzeyi', 'damla sesi', 'yankı', 'ripple', 'ring', 'water surface', 'wave ring', 'plop'],
  box: [-160, -44, 160, 44],
  bleed: 26,
  anchor: 'yüzey merkezi (0,0); damla yukarıdan düşer',
  points: { surface: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'damlanın yüzeye değme anı' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);

    // yüzey çizgisi: hafif dalgalı
    ctx.strokeStyle = line;
    ctx.lineWidth = 7;
    ctx.beginPath();
    for (let x = -150; x <= 150; x += 10) {
      const y = Math.sin(x * 0.06 + t * 2.1) * 3 + k.noise1(t * 1.6 + x * 0.02) * 2.5;
      if (x === -150) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 0.35);
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -150; x <= 150; x += 10) {
      const y = -4 + Math.sin(x * 0.06 + t * 2.1) * 3 + k.noise1(t * 1.6 + x * 0.02) * 2.5;
      if (x === -150) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    const d = p.at == null ? null : t - p.at;

    // düşen damla (at öncesi)
    if (d == null) {
      // sakin: arada bir halka (döngülü)
      const period = 1.8, life = 1.6;
      const lt = t % period;
      if (lt < life) ring(lt / life);
      const lt2 = (t + 0.9) % period;
      if (lt2 < life) ring(lt2 / life);
      return;
    }
    if (d > -0.35 && d < 0.05) {
      // damla yüzeye iniyor
      const g = k.prog(d, -0.35, 0);
      const y = -46 + 46 * g;
      const r = 9 - 2 * g;
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, y, r * 1.15, r * 1.3, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.beginPath(); ctx.ellipse(0, y, r * 0.85, r, 0, 0, k.TAU); ctx.fill();
    }
    if (d < 0) return;

    // halka dalgalar: at anında art arda doğar, genişleyip solar
    const offs = [0, 0.16, 0.34];
    for (let i = 0; i < offs.length; i++) {
      const lt = d - offs[i];
      if (lt < 0 || lt > 1.6) continue;
      ring(lt / 1.6);
    }
    // ilk sıçrama tacı (kısa)
    if (d < 0.4) {
      const f = 1 - d / 0.4;
      ctx.strokeStyle = k.rgba(p.color, 0.55 * f);
      ctx.lineWidth = 5 * f + 1;
      ctx.beginPath(); ctx.ellipse(0, -8 * f, 10 + 26 * f, 12 * f + 2, 0, 0, k.TAU); ctx.stroke();
    }

    function ring(g) {
      ctx.strokeStyle = k.rgba(p.color, 0.62 * (1 - g));
      ctx.lineWidth = 6 * (1 - g) + 1.5;
      ctx.beginPath(); ctx.ellipse(0, 0, 16 + 128 * g, 6 + 22 * g, 0, 0, k.TAU); ctx.stroke();
      if (g < 0.5) {
        ctx.strokeStyle = k.rgba(p.color, 0.35 * (1 - g * 2));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, 0, 10 + 60 * g, 4 + 10 * g, 0, 0, k.TAU); ctx.stroke();
      }
    }
  },
};
