// spy-fx/laser-grid-breach — ajan lazer güvenlik ızgarası: `at` anında orta lazer
// kesiliyor (uçlar çekiliyor, kesik noktada kıvılcım), boştayken lazerler titriyor.
// NOT: canvas y-aşağıdır; (0,0) ızgaranın merkezidir.
export default {
  name: 'laser-grid-breach',
  category: 'spy-fx',
  desc: 'Kırmızı lazer ızgara duvarı: bir lazer çizgisi kesiliyor, kesik uçta kıvılcımlar uçuşuyor',
  tags: ['lazer', 'ızgara', 'güvenlik', 'kesik', 'ajan', 'sızma', 'laser', 'grid', 'security', 'breach', 'spy', 'cut'],
  box: [-160, -95, 160, 95],
  bleed: 60,
  anchor: 'ızgara merkezi (0,0)',
  points: { cut: [0, 0], emitter_left: [-120, 0], emitter_right: [120, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'kesilme anı: orta lazer kesilir, kıvılcım (0.6 sn)' },
    color: { type: 'color', default: 'red', desc: 'lazer rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const LINES = [-54, -27, 0, 27, 54];
    const CUT = 2; // kesilen çizgi (y=0)
    ctx.save();

    function post(x) {
      // direk gövdesi
      ctx.fillStyle = k.rgba('panel2');
      ctx.beginPath(); k.rrect(x, -85, 30, 170, 10); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
      // premium finish: sol üst parlama + sağ alt gölge
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(x + 9, -58, 7, 34, 0.25, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.ellipse(x + 22, 62, 6, 26, 0.25, 0, k.TAU); ctx.fill();
      // yayıcı noktalar
      for (let i = 0; i < LINES.length; i++) {
        const cy = LINES[i];
        ctx.fillStyle = k.rgba(p.color);
        ctx.beginPath(); ctx.arc(x + 15, cy, 5.5, 0, k.TAU); ctx.fill();
        k.glow(x + 15, cy, 22, p.color, 0.35);
      }
    }
    post(-150); post(120);

    function beam(x1, x2, y, seed, bright) {
      const a = (0.62 + 0.38 * (0.5 + 0.5 * k.noise1(t * 2.6 + seed))) * bright;
      if (a <= 0.02) return;
      ctx.lineCap = 'round';
      ctx.strokeStyle = k.rgba(p.color, 0.5 * a);
      ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
      ctx.strokeStyle = k.rgba('bg', 0.55 * a);
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
    }

    for (let i = 0; i < LINES.length; i++) {
      const y = LINES[i];
      if (i === CUT && d >= 0) {
        // kesilen çizgi: boşluk merkezden dışa doğru açılıyor, uçlar çekiliyor
        const open = k.clamp(k.prog(d, 0, 0.28), 0, 1);
        const gap = 8 + k.E.outCubic(open) * 62;
        beam(-120, -gap, y, i * 13, 1 - open * 0.25);
        beam(gap, 120, y, i * 13 + 7, 1 - open * 0.25);
        // kesik uçlar kısa süre kıvılcımlı parlama yapar
        if (d < 0.35) {
          const f = 1 - d / 0.35;
          for (const sx of [-gap, gap]) {
            k.glow(sx, y, 26 * f, p.color, 0.5 * f);
            ctx.fillStyle = k.rgba('bg', 0.85 * f);
            ctx.beginPath(); ctx.arc(sx, y, 4 * f + 1, 0, k.TAU); ctx.fill();
          }
        }
      } else {
        beam(-120, 120, y, i * 13, 1);
      }
    }

    // kesilme olayı: merkezde kıvılcım patlaması + çakma + duman
    if (d >= 0 && d < 1.4) {
      // çakma — ilk 0.15 sn
      if (d < 0.15) {
        const f = 1 - d / 0.15;
        k.glow(0, 0, 80 * f, p.color, 0.5 * f);
        ctx.fillStyle = k.rgba('bg', 0.9 * f);
        ctx.beginPath(); ctx.arc(0, 0, (26 - d * 120), 0, k.TAU); ctx.fill();
      }
      // kıvılcımlar — 0.6 sn
      const g = k.prog(d, 0.02, 0.6);
      for (let i = 0; i < 14; i++) {
        const h1 = k.hash(i * 31 + 3), h2 = k.hash(i * 17 + 9);
        const a = (h1 - 0.5) * k.TAU + (h2 - 0.5) * 0.8;
        const e = k.E.outExpo(g);
        const dist = (24 + h2 * 92) * e;
        const x = Math.cos(a) * dist, y = Math.sin(a) * dist * 0.75 - e * e * 34; // yukarı savrulma (y-aşağı: eksi = yukarı)
        ctx.strokeStyle = k.rgba(h2 > 0.4 ? p.color : 'yellow', 0.9 * (1 - g));
        ctx.lineWidth = 2.5 * (1 - g) + 0.8;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - Math.cos(a) * 9, y - Math.sin(a) * 9); ctx.stroke();
        ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - g));
        ctx.beginPath(); ctx.arc(x, y, 3 * (1 - g) + 0.8, 0, k.TAU); ctx.fill();
      }
      // duman — 0.2–1.2 sn
      if (d > 0.2) {
        const s = k.prog(d, 0.2, 1.2);
        for (let i = 0; i < 3; i++) {
          const h = k.hash(i * 41 + 55);
          const x = (h - 0.5) * 50, y = -s * (60 + h * 40) - 8;
          ctx.fillStyle = k.rgba('dim', 0.22 * (1 - s));
          ctx.beginPath(); ctx.arc(x, y, 10 + s * 16, 0, k.TAU); ctx.fill();
        }
      }
    }
    ctx.restore();
  },
};
