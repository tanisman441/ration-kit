// nature-fx/leaves-fall — daldan salınarak düşen yapraklar; fall anında rüzgâr savurur.
// NOT: canvas y-aşağıdır; yapraklar +y yönünde salınarak düşer.
export default {
  name: 'leaves-fall',
  category: 'nature-fx',
  desc: 'Daldan salınarak düşen yapraklar; fall anında rüzgâr esip yaprak savurur',
  tags: ['yaprak', 'sonbahar', 'düşen', 'rüzgar', 'dal', 'leaves', 'falling', 'autumn', 'wind', 'leaf'],
  box: [-150, -140, 150, 170],
  bleed: 30,
  anchor: 'dal (sol üst, -100,-100); yapraklar y=150 civarına düşer',
  points: { branch: [-100, -100], ground: [0, 160] },
  params: {
    color: { type: 'color', default: 'dim' },
    leaf: { type: 'color', default: 'green' },
    fall: { type: 'time', default: null, desc: 'rüzgâr esme anı: dal sallanır, yapraklar savrulur (1.2 sn)' },
    density: { type: 'number', default: 0.6, desc: 'sürekli düşen yaprak yoğunluğu 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.fall == null ? -1 : t - p.fall;
    const gust = d >= 0 && d < 1.2 ? Math.sin((d / 1.2) * Math.PI) : 0;   // rüzgâr sönümü
    const sway = k.noise1(t * 1.3) * 3 + gust * 14;                        // dal sallantısı

    // yaprak çizici (iki kanatlı elips yaprak)
    const leaf = (x, y, r, rot, col, alpha) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, 0, 11 + LW / 2, 6.5 + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(col, alpha);
      ctx.beginPath(); ctx.ellipse(0, 0, 11, 6.5, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(10, 0); ctx.stroke();
      ctx.restore();
    };

    // dal (gölge + gövde)
    const bx0 = -150, by0 = -120 + sway * 0.4, bx1 = -60 + sway, by1 = -80 + sway;
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(bx0 + 4, by0 + 5); ctx.lineTo(bx1 + 4, by1 + 5); ctx.stroke();
    ctx.strokeStyle = darker(p.color); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(bx0 + 4, by0 + 5); ctx.lineTo(bx1 + 4, by1 + 5); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(bx0, by0); ctx.lineTo(bx1, by1); ctx.stroke();
    // daldaki yapraklar (hafif titreşir)
    for (let i = 0; i < 6; i++) {
      const f = 0.25 + i * 0.13;
      const lx = bx0 + (bx1 - bx0) * f + k.noise1(t * 2 + i * 7) * 2;
      const ly = by0 + (by1 - by0) * f - 12 + k.noise1(t * 2.4 + i * 3) * 2;
      leaf(lx, ly, 1, k.hash(i * 5.1) * k.TAU + t * 0.3, p.leaf, 0.95);
    }

    // sürekli düşen yapraklar (döngüsel): salınım = pendulum
    const NL = 14, topY = -60, fallH = 215;
    for (let i = 0; i < NL; i++) {
      if (k.hash(i * 13.7 + 3) > k.clamp(p.density, 0, 1) && d < 0) continue;
      const speed = 55 + k.hash(i * 7.7 + 3) * 45;
      const ph = ((t * speed + k.hash(i * 9.3 + 3) * fallH) % fallH) / fallH;
      const swing = Math.sin(t * 3.1 + k.hash(i * 4.4 + 3) * k.TAU) * 26 * (0.4 + ph * 0.6);
      const x = -40 + k.hash(i * 3.1 + 3) * 150 + swing + gust * 60 * ph;
      const y = topY + ph * fallH;
      const rot = t * (1.5 + k.hash(i * 2.2 + 3) * 2) + k.hash(i * 5.5 + 3) * k.TAU;
      leaf(x, y, 1, rot, p.leaf, 0.45 + 0.5 * (1 - ph * 0.4));
    }

    // fall anında savrulan yaprak patlaması
    if (gust > 0.01) {
      for (let i = 0; i < 10; i++) {
        const gp = Math.min(1, d / 1.1);                              // ilerleme 0–1
        const ang = k.hash(i * 9.1 + 8) * Math.PI - Math.PI / 2;
        const dist = gp * (90 + k.hash(i * 3.3 + 8) * 90);
        const x = bx1 + Math.cos(ang) * dist + gust * 30;
        const y = by1 + Math.abs(Math.sin(ang)) * dist * 0.7 + gp * 60;
        const rot = gp * 6 + k.hash(i * 5.5 + 8) * k.TAU;
        leaf(x, y, 1, rot, p.leaf, (1 - gp) * 0.95);
      }
    }

    // yere düşmüş yapraklar (hafif esintiyle kıpırdar)
    for (let i = 0; i < 5; i++) {
      const gx = -90 + k.hash(i * 11.1 + 12) * 200;
      const gy = 156 + k.hash(i * 6.7 + 12) * 10;
      leaf(gx + k.noise1(t * 1.1 + i * 4) * 4 + gust * 12, gy, 1,
        k.hash(i * 2.9 + 12) * k.TAU, p.leaf, 0.7);
    }
  },
};
