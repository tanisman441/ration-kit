// environment/tree — ağaç; pine = çam, leafy = yapraklı; sway ile rüzgârda salınır.
// NOT: canvas y-aşağıdır; zemin (0,0), ağaç negatif y yönünde yukarı uzar.
export default {
  name: 'tree',
  category: 'environment',
  desc: 'Ağaç; pine varyantı çam, leafy varyantı yuvarlak tepeli; sway ile rüzgârda salınır',
  tags: ['ağaç', 'çam', 'orman', 'doğa', 'bitki', 'tree', 'pine', 'forest', 'nature', 'leafy'],
  box: [-100, -255, 100, 10],
  bleed: 0,
  anchor: 'zemin (0,0); gövde yukarı uzar, tepe ~-245',
  points: { top: [0, -235] },
  params: {
    color: { type: 'color', default: 'dim' },
    variant: { type: 'enum', values: ['pine', 'leafy'], default: 'pine' },
    sway: { type: 'number', default: 0.4, desc: 'rüzgâr şiddeti 0–1: tepenin salınımı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const base = k.col(p.color);
    const dark = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.72))).join(',')})`;
    const darker = `rgb(${base.map(v => Math.max(0, Math.round(v * 0.55))).join(',')})`;
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const poly = (pts, c) => {
      ctx.fillStyle = line; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath();
      pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.closePath(); ctx.fill();
    };

    const sw = k.clamp(p.sway, 0, 1);
    const swayX = Math.sin(t * 1.6) * sw * 10 + k.noise1(t * 0.9) * sw * 3;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 78, 9, 0, 0, k.TAU); ctx.fill();

    // gövde
    blob(-11, -84, 22, 84, 9, darker);
    // kök çıkıntısı
    blob(-20, -12, 40, 12, 6, darker);

    const pine = p.variant === 'pine';

    ctx.save();
    ctx.translate(swayX, 0);

    if (pine) {
      // üç katmanlı çam
      poly([[-88, -66], [88, -66], [0, -158]], k.rgba(p.color));
      poly([[-72, -118], [72, -118], [0, -202]], dark);
      poly([[-56, -164], [56, -164], [0, -244]], k.rgba(p.color));
      // kar/ışık şeridi (sol üst vurgu yerine ince katman çizgisi)
      ctx.strokeStyle = k.rgba('bg', 0.3); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-60, -120); ctx.lineTo(60, -120); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-46, -166); ctx.lineTo(46, -166); ctx.stroke();
    } else {
      // yapraklı: üç örtüşen küre
      const disc = (x, y, r, c) => {
        ctx.fillStyle = line; ctx.beginPath(); ctx.arc(x, y, r + LW / 2, 0, k.TAU); ctx.fill();
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill();
      };
      disc(-52, -118, 52, dark);
      disc(52, -118, 52, dark);
      disc(0, -158, 68, k.rgba(p.color));
      disc(-30, -140, 40, k.rgba(p.color));
    }

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    if (pine) {
      ctx.beginPath();
      ctx.moveTo(-58, -120); ctx.lineTo(-30, -120); ctx.lineTo(-52, -158); ctx.lineTo(-74, -128);
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.ellipse(-38, -178, 26, 16, -0.5, 0, k.TAU); ctx.fill();
    }

    ctx.restore();
  },
};
