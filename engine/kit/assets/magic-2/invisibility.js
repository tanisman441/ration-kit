// magic-2/invisibility — görünmezlik: vanish anında 0.8 sn'de titreyerek solan
// pelerinli figür; sonrasında yerinde kalan soluk bir parıltı ve süzülen tozlar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) figürün tabanıdır.
export default {
  name: 'invisibility', category: 'magic-2',
  desc: 'Görünmezlik: vanish anında titreyerek solan pelerinli figür ve kalan soluk parıltı',
  tags: ['görünmezlik', 'invisibility', 'invisible', 'solma', 'fade', 'büyü', 'pelerin', 'gizlenme', 'yok olma'],
  box: [-70, -125, 70, 65],
  bleed: 40,
  anchor: 'figürün tabanı (0,0)',
  points: { head: [0, -96], torso: [0, -52], feet: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink', desc: 'figürün rengi' },
    vanish: { type: 'time', default: null, desc: 'solma anı (0.8 sn titreme + kaybolma)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const d = p.vanish == null ? -1 : t - p.vanish;
    const col = p.color;
    const gone = d >= 0.8;

    // alpha: öncesi 1, 0–0.8 sn arası 1→0, sonrası 0
    let alpha = 1;
    if (d >= 0) alpha = Math.max(0, 1 - d / 0.8);
    // titreme: solmanın ortasında noise ile keskin düşüşler
    if (d > 0.15 && d < 0.65 && k.noise1(t * 45) > 0.35) alpha *= 0.35;

    const sway = 2 * Math.sin(t * 1.8);   // idle hafif salınım
    const fade = Math.max(alpha, 0);

    // ---- taban gölgesi (solmayla birlikte silikleşir) ----
    ctx.fillStyle = k.rgba('ink', 0.15 * Math.max(fade, gone ? 0 : 0.06));
    ctx.beginPath(); ctx.ellipse(0, 2, 30, 8, 0, 0, k.TAU); ctx.fill();

    // ---- figür ----
    if (fade > 0.01) {
      // sağ alt gölge kopya
      ctx.save();
      ctx.translate(6 + sway, 6);
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath(); ctx.arc(0, -96, 20, 0, k.TAU); ctx.fill();
      k.rrect(-24, -80, 48, 66, 14); ctx.fill();
      ctx.restore();
      // baş
      ctx.fillStyle = k.rgba(col, fade);
      ctx.beginPath(); ctx.arc(sway, -96, 20, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55 * fade);
      ctx.lineWidth = 4;
      ctx.stroke();
      // pelerin gövde
      ctx.fillStyle = k.rgba(col, fade);
      k.rrect(sway - 24, -80, 48, 66, 14); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55 * fade);
      ctx.lineWidth = 4;
      k.rrect(sway - 24, -80, 48, 66, 14); ctx.stroke();
      // gözler (bg rengi noktalar)
      ctx.fillStyle = k.rgba('bg', 0.9 * fade);
      ctx.beginPath(); ctx.arc(sway - 7, -98, 3, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(sway + 7, -98, 3, 0, k.TAU); ctx.fill();
      // sol üst parlama (beyaz alfa 0.10)
      ctx.fillStyle = 'rgba(255,255,255,' + (0.10 * fade).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(sway - 8, -104, 8, 10, 0.3, 0, k.TAU); ctx.fill();
    }

    // ---- solma parçacıkları (0–0.8 sn): yukarı süzülür ----
    if (d >= 0 && d < 0.8) {
      const al = 1 - d / 0.8;
      for (let i = 0; i < 16; i++) {
        const h1 = k.hash(i * 3 + 1), h2 = k.hash(i * 11 + 3);
        const py = -40 - (d / 0.8) * (60 + h1 * 50);
        const px = (h2 - 0.5) * 70 + k.noise1(i * 2.3 + t * 4) * 8;
        ctx.fillStyle = k.rgba(col, Math.max(0.7 * al * (1 - h2 * 0.4), 0));
        ctx.beginPath(); ctx.arc(px, py, 2 + h1 * 3, 0, k.TAU); ctx.fill();
      }
    }

    // ---- sonrası: yerinde kalan soluk parıltı + ara ara geçen parıltı ----
    if (gone) {
      const shim = 0.5 + 0.5 * Math.sin(t * 3);
      ctx.strokeStyle = k.rgba(col, 0.14 + 0.10 * shim);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(sway, -96, 20, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba(col, 0.10 + 0.08 * shim);
      k.rrect(sway - 24, -80, 48, 66, 14); ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const h1 = k.hash(i * 5 + 1), h2 = k.hash(i * 9 + 2);
        const py = -110 + ((t * 14 + h1 * 150) % 150);
        ctx.fillStyle = k.rgba(col, 0.3 * (0.4 + 0.6 * shim) * h2);
        ctx.beginPath(); ctx.arc((h1 - 0.5) * 80, py, 2, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
