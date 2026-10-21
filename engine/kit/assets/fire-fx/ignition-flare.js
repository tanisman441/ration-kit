// fire-fx/ignition-flare — tutuşma flaşı: kıvılcım parıltısı, beyaz-sarı çakma, genişleyen halka, ilk alev.
// NOT: canvas y-aşağıdır; (0,0) tutuşma noktasıdır.
export default {
  name: 'ignition-flare',
  category: 'fire-fx',
  desc: 'Tutuşma flaşı: beyaz çakma, genişleyen halka, fırlayan kıvılcımlar ve tutuşan ilk alev',
  tags: ['tutuşma', 'çakma', 'alev', 'kıvılcım', 'ateş', 'ignition', 'flare', 'flash', 'fire', 'spark'],
  box: [-130, -130, 130, 130],
  bleed: 50,
  anchor: 'tutuşma noktası (0,0)',
  points: { origin: [0, 0], flame: [0, -60] },
  params: {
    at: { type: 'time', default: null, desc: 'tutuşma anı (0.8 sn: çakma + halka + kıvılcım + ilk alev)' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: efekt büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const S = k.clamp(p.size, 0.5, 1.5);
    ctx.save();

    // --- tutuşma öncesi: fitilde hafif kor parıltısı (nabız) ---
    if (d < 0) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 3.2);
      ctx.fillStyle = k.rgba('red', 0.25 + 0.2 * pulse);
      ctx.beginPath(); ctx.arc(0, 0, 9 * S, 0, k.TAU); ctx.fill();
      k.glow(0, 0, 26 * S, k.col('red'), 0.25 + 0.2 * pulse);
      ctx.restore();
      return;
    }

    // --- beyaz çakma (0.15 sn) ---
    const flash = 1 - k.prog(d, 0, 0.15);
    if (flash > 0) {
      k.glow(0, 0, 110 * S * flash + 20, k.col('yellow'), 0.55 * flash);
      ctx.fillStyle = k.rgba('bg', 0.75 * flash);
      ctx.beginPath(); ctx.arc(0, 0, 34 * S * flash + 8, 0, k.TAU); ctx.fill();
    }

    // --- genişleyen halka (0.5 sn) ---
    if (d < 0.55) {
      const rp = k.prog(d, 0, 0.5), rr = 20 + 105 * S * k.E.outCubic(rp);
      ctx.strokeStyle = k.rgba('yellow', 0.7 * (1 - rp));
      ctx.lineWidth = 8 * S * (1 - rp) + 2;
      ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
    }

    // --- kıvılcım fırtınası (0.75 sn) ---
    if (d < 0.8) {
      for (let i = 0; i < 22; i++) {
        const h1 = k.hash(i * 7 + 1), h2 = k.hash(i * 13 + 5), h3 = k.hash(i * 29 + 11);
        const ang = h1 * k.TAU, sp = (60 + 170 * h2) * S;
        const sp2 = k.prog(d, 0, 0.75);
        const r = sp2 * sp;
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r - sp2 * sp2 * 90 * S; // y-aşağı: yükselir
        const fade = 1 - sp2;
        ctx.strokeStyle = k.rgba(h3 > 0.5 ? 'yellow' : 'red', 0.9 * fade);
        ctx.lineWidth = 3 * S;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - Math.cos(ang) * 10 * S * fade, y - Math.sin(ang) * 10 * S * fade);
        ctx.stroke();
      }
    }

    // --- tutuşan ilk alev (kalıcı; hafif titrer) ---
    const ig = k.prog(d, 0.15, 0.55);
    if (ig > 0) {
      const flick = 1 + 0.12 * k.noise1(t * 9);
      const fh = 85 * S * ig * flick;
      // dış alev
      ctx.fillStyle = k.rgba('red', 0.92);
      ctx.beginPath();
      ctx.moveTo(-26 * S * ig, 0);
      ctx.quadraticCurveTo(-34 * S * ig, -fh * 0.55, -10 * S * ig - 6 * k.noise1(t * 7 + 3) * S, -fh);
      ctx.quadraticCurveTo(6 * S * ig + 6 * k.noise1(t * 8 + 9) * S, -fh * 0.6, 26 * S * ig, 0);
      ctx.closePath(); ctx.fill();
      // iç alev
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath();
      ctx.moveTo(-14 * S * ig, 0);
      ctx.quadraticCurveTo(-18 * S * ig, -fh * 0.5, -4 * S * ig - 4 * k.noise1(t * 8 + 1) * S, -fh * 0.62);
      ctx.quadraticCurveTo(4 * S * ig, -fh * 0.35, 14 * S * ig, 0);
      ctx.closePath(); ctx.fill();
      // sol üst parlama (premium finish, alfa 0.10)
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(-9 * S * ig, -fh * 0.32, 7 * S * ig, fh * 0.16, -0.4, 0, k.TAU); ctx.fill();
      // sağ alt gölge
      ctx.fillStyle = k.rgba('red', 0.12);
      ctx.beginPath(); ctx.ellipse(14 * S * ig, -fh * 0.18, 8 * S * ig, fh * 0.2, 0.4, 0, k.TAU); ctx.fill();
      k.glow(0, -fh * 0.4, 70 * S * ig, k.col('yellow'), 0.3 * ig);
    }

    ctx.restore();
  },
};
