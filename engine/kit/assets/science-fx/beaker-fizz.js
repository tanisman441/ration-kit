// science-fx/beaker-fizz — beherglas; sürekli kabarcıklar, `at` anında köpürme patlaması.
// NOT: canvas y-aşağıdır; (0,0) tabandadır.
export default {
  name: 'beaker-fizz',
  category: 'science-fx',
  desc: 'Beherglas: at anında ağızdan taşan köpürme patlaması ve renk parlaması',
  tags: ['beher', 'beherglas', 'kimya', 'köpük', 'kabarcık', 'deney', 'patlama', 'beaker fizz', 'chemistry', 'foam'],
  box: [-100, -250, 100, 12],
  bleed: 45,
  anchor: 'taban (0,0)',
  points: { mouth: [0, -180] },
  params: {
    at: { type: 'time', default: null, desc: 'köpürme patlaması anı (~1.2 sn)' },
    bubbles: { type: 'number', default: 0.4, desc: 'sürekli kabarcık yoğunluğu 0–1' },
    color: { type: 'color', default: 'cyan', desc: 'sıvı rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const W = 72, topY = -178, botY = -12;
    const fizz = d >= 0 && d < 1.3;
    const g = fizz ? k.prog(d, 0, 1.2) : 0;

    // sıvı seviyesi (sabit doluluk)
    const liqTop = botY - 0.62 * (botY - topY);
    const wob = (x) => Math.sin(x * 0.09 + t * 3) * 3;

    // sıvı
    ctx.fillStyle = k.rgba(acc, 0.72);
    ctx.beginPath();
    ctx.moveTo(-W + 6, liqTop + wob(0));
    for (let x = -W + 6; x <= W - 6; x += 8) ctx.lineTo(x, liqTop + wob(x));
    ctx.lineTo(W - 6, botY); ctx.lineTo(-W + 6, botY);
    ctx.closePath(); ctx.fill();
    // köpürme parlaması — sıvı beyaza döner
    if (fizz) {
      ctx.fillStyle = `rgba(255,255,255,${0.45 * (1 - g)})`;
      ctx.beginPath();
      ctx.moveTo(-W + 6, liqTop + wob(0));
      for (let x = -W + 6; x <= W - 6; x += 8) ctx.lineTo(x, liqTop + wob(x));
      ctx.lineTo(W - 6, botY); ctx.lineTo(-W + 6, botY);
      ctx.closePath(); ctx.fill();
    }
    // sıvı üstü parlama çizgisi
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = -W + 6; x <= W - 6; x += 8) {
      const y = liqTop + wob(x);
      if (x === -W + 6) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // sürekli kabarcıklar
    const n = 4 + Math.round(k.clamp(p.bubbles, 0, 1) * 10) + (fizz ? 10 : 0);
    for (let i = 0; i < n; i++) {
      const seed = i * 17 + 3;
      const speed = 0.45 + k.hash(seed) * 0.8 + (fizz ? 1.4 : 0);
      const cyc = (t * speed + k.hash(seed + 1)) % 1;
      const y = botY - cyc * (botY - liqTop);
      const x = (k.hash(seed + 2) - 0.5) * 2 * (W - 16);
      const r = 2.5 + k.hash(seed + 4) * 3.5 + (fizz ? 2.5 : 0);
      ctx.fillStyle = k.rgba('ink', 0.35 * (1 - cyc * 0.5));
      ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
    }

    // köpürme patlaması — ağızdan yükselen köpük sütunu
    if (fizz) {
      for (let i = 0; i < 14; i++) {
        const seed = i * 23 + 11;
        const rise = ((t * 2.2 + k.hash(seed)) % 1);
        const yy = topY - 6 - rise * (46 + k.hash(seed + 2) * 40) * (1 - g * 0.4);
        const xx = (k.hash(seed + 1) - 0.5) * (50 - rise * 20) + k.noise1(seed + t * 4) * 10;
        const rr = 4 + rise * 9 + k.hash(seed + 3) * 4;
        ctx.fillStyle = k.rgba('dim', 0.55 * (1 - rise * 0.7) * (1 - g * 0.5));
        ctx.beginPath(); ctx.arc(xx, yy, rr, 0, k.TAU); ctx.fill();
      }
      // ağızda köpük kubbesi
      ctx.fillStyle = k.rgba('dim', 0.85 * (1 - g * 0.6));
      ctx.beginPath();
      ctx.ellipse(0, topY - 4, W - 8, 20 * (1 - g * 0.5), 0, Math.PI, k.TAU);
      ctx.fill();
      for (let i = 0; i < 6; i++) {
        const fx = -W + 14 + i * ((2 * W - 28) / 5);
        ctx.beginPath(); ctx.arc(fx, topY - 12 - k.hash(i * 7) * 8, 7 + k.hash(i * 3) * 5, 0, k.TAU); ctx.fill();
      }
      k.glow(0, topY - 20, 60, acc, 0.4 * (1 - g));
    }

    // cam gövde
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-W - 6, topY, (W + 6) * 2, botY - topY + 12, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.08);
    ctx.beginPath(); k.rrect(-W, topY + 4, W * 2, botY - topY, 8); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.6);
    ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-W - 4, topY - 2, (W + 4) * 2, botY - topY + 8, 10); ctx.stroke();
    // taban kalınlığı
    ctx.fillStyle = k.rgba('dim', 0.9);
    ctx.beginPath(); k.rrect(-W - 4, botY - 2, (W + 4) * 2, 12, 6); ctx.fill();
    // ağız bandı
    ctx.fillStyle = k.rgba('dim', 0.9);
    ctx.beginPath(); k.rrect(-W - 10, topY - 8, (W + 10) * 2, 15, 7); ctx.fill();
    // ölçü çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.45);
    ctx.lineWidth = 3;
    for (let i = 1; i <= 4; i++) {
      const gy = botY - i * 32;
      ctx.beginPath(); ctx.moveTo(-W + 8, gy); ctx.lineTo(-W + 8 + (i % 2 === 0 ? 22 : 14), gy); ctx.stroke();
    }
    // cam parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-W + 14, topY + 52, 9, 34, 0.12, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
