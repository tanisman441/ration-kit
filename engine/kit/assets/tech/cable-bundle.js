// tech/cable-bundle — bağlantı bloğundan yukarı yayılan 5 kablolu demet.
// Biri vurgu renkli (veri hattı), diğerleri gri tonlarda. Hafif salınım.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) bağlantı bloğu tabanıdır.
export default {
  name: 'cable-bundle', category: 'tech',
  desc: 'Bağlantı bloğundan yayılan kablo demeti; biri vurgu renkli veri hattı',
  tags: ['kablo', 'cable', 'demet', 'bağlantı', 'tel', 'bundle', 'wire', 'fiş', 'ağ kablosu'],
  box: [-150, -190, 150, 24],
  bleed: 8,
  anchor: 'bağlantı bloğu tabanı (0,0); kablolar yukarı uzar',
  points: { plug: [0, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 60, 9, 0, 0, k.TAU); ctx.fill();

    // kablolar (önce çizilir, blok üstüne biner)
    const cols = ['dim', 'panel2', 'ink', 'cyan', 'panel'];
    for (let i = 0; i < 5; i++) {
      const fx = -2 + i;                       // -2..2
      const sway = Math.sin(t * 1.6 + k.hash(i * 7 + 1) * k.TAU) * 6;
      const sx = fx * 11, sy = -46;
      const cx = fx * 46 + sway * 0.4, cy = -118;
      const ex = fx * 58 + sway, ey = -158 - k.hash(i * 3 + 2) * 22;
      const w = 15 - Math.abs(fx) * 1.5;
      const acc = i === 3;
      // dış hat
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
      // kablo
      ctx.strokeStyle = acc ? k.rgba(cols[i], 0.95) : k.rgba(cols[i]);
      ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
      // vurgu hattında akan ışık
      if (acc) {
        const fl = (t * 0.7 + k.hash(i) ) % 1;
        const qx = (1 - fl) * (1 - fl) * sx + 2 * (1 - fl) * fl * cx + fl * fl * ex;
        const qy = (1 - fl) * (1 - fl) * sy + 2 * (1 - fl) * fl * cy + fl * fl * ey;
        k.glow(qx, qy, 14, 'cyan', 0.5);
      }
      // uç kapak
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(ex, ey, w / 2 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = acc ? k.rgba('cyan', 0.9) : k.rgba('bg', 0.7);
      ctx.beginPath(); ctx.arc(ex, ey, w / 2, 0, k.TAU); ctx.fill();
    }

    // bağlantı bloğu
    blob(-34, -52, 68, 52, 8, body);
    // tutamak çizgileri
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(-26, -36 + i * 11); ctx.lineTo(26, -36 + i * 11); ctx.stroke();
    }
    // premium parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-16, -40, 12, 7, -0.4, 0, k.TAU); ctx.fill();
  },
};
