// weather-fx/rainbow — iki bulut arasında açılan gökkuşağı yayı; bulutlar süzülür, yay hafifçe titrer,
// at anında yay bir uçtan diğerine 1 sn'de oluşur.
// NOT: canvas y-aşağıdır; yay yukarıda (−y), bulutlar yayın uçlarında.
export default {
  name: 'rainbow', category: 'weather-fx',
  desc: 'İki bulut arasında açılan gökkuşağı; bulutlar süzülür, yay hafifçe titrer',
  tags: ['gökkuşağı', 'yağmur', 'bulut', 'renk', 'hava', 'rainbow', 'cloud', 'weather', 'sky', 'arc'],
  box: [-290, -190, 290, 100],
  bleed: 20,
  anchor: 'yay merkezi (0,70); bulutlar uçlarda y≈58',
  points: { left: [-220, 58], right: [220, 58] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'oluşma anı: yay 1 sn\'de soldan sağa açılır' },
  },
  draw(ctx, t, p, k) {
    const LW = 6;
    const line = k.rgba('bg', 0.55);
    const darker = c => { const b = k.col(c); return `rgb(${b.map(v => Math.max(0, Math.round(v * 0.88))).join(',')})`; };
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.at == null ? -1 : t - p.at;
    const forming = p.at != null && d >= 0 && d < 1.15;

    // idle: yay grubunun hafif süzülmesi
    const dx = k.noise1(t * 0.4) * 3.5;
    const dy = Math.sin(t * 0.8) * 2;

    const CX = 0, CY = 70, R = 240, BW = 15;
    const bands = ['red', 'yellow', 'green', 'cyan', 'purple'];

    // oluşma ilerlemesi (soldan sağa)
    let grow = 1;
    if (p.at != null) {
      if (d < 0) grow = 0;
      else grow = k.E.inOutCubic(k.clamp(d / 1.0, 0, 1));
    }
    const endA = Math.PI + grow * Math.PI;

    ctx.save();
    ctx.translate(dx, dy);

    // gökkuşağı bantları (oluşurken dıştan içe hafif kademeli)
    if (grow > 0.001) {
      for (let i = 0; i < bands.length; i++) {
        const bandGrow = p.at == null || d < 0 ? 1 : k.clamp(grow * 1.18 - i * 0.035, 0.001, 1);
        const r = R - BW / 2 - i * BW;
        const shimmer = 0.82 + 0.08 * Math.sin(t * 2.2 + i * 1.1);
        ctx.strokeStyle = k.rgba(bands[i], shimmer);
        ctx.lineWidth = BW;
        ctx.beginPath();
        ctx.arc(CX, CY, r, Math.PI, Math.PI + grow * bandGrow * Math.PI);
        ctx.stroke();
      }
      // büyüyen uçta parlama
      if (forming) {
        const tx = CX + (R - BW * 2.5) * Math.cos(endA), ty = CY + (R - BW * 2.5) * Math.sin(endA);
        k.glow(tx, ty, 34, bands[2], 0.45);
      }
    }

    // bulutlar (yayın uçlarında, bağımsız süzülme)
    const disc = (x, y, r, c, sheen) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      if (sheen) {
        ctx.fillStyle = 'rgba(255,255,255,0.10)';
        ctx.beginPath(); ctx.ellipse(x - r * 0.32, y - r * 0.42, r * 0.42, r * 0.26, -0.5, 0, k.TAU); ctx.fill();
      }
    };
    const cloudAt = (cx, cy, phase) => {
      const bobX = k.noise1(t * 1.1 + phase) * 3;
      const bobY = Math.sin(t * 2.1 + phase) * 2.5;
      ctx.save(); ctx.translate(cx + bobX, cy + bobY);
      const bc = k.rgba(p.color), bd = darker(p.color);
      const blobs = [[-42, 4, 24], [-12, -10, 30], [20, -6, 26], [44, 6, 20], [-10, 12, 24], [22, 12, 20]];
      for (const [x, y, r] of blobs) disc(x + 5, y + 6, r, bd, false);
      blobs.forEach(([x, y, r], i) => disc(x, y, r, bc, i === 1 || i === 2));
      ctx.restore();
    };
    cloudAt(-220, 52, 0);
    cloudAt(220, 52, 4.2);

    ctx.restore();
  },
};
