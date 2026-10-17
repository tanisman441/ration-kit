// tech/cloud — bulut sunucu: senkron anında dönen senkron okları belirir.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; anchor gövde merkezidir (0,0).
export default {
  name: 'cloud', category: 'tech',
  desc: 'Bulut sunucu; senkron anında içinde dönen senkron okları belirir',
  tags: ['bulut', 'cloud', 'sunucu', 'senkron', 'veri', 'depolama', 'server', 'sync', 'storage', 'internet'],
  box: [-110, -78, 110, 78],
  bleed: 14,
  anchor: 'gövde merkezi (0,0)',
  points: { center: [0, 0], top: [0, -66] },
  params: {
    color: { type: 'color', default: 'panel2' },
    sync: { type: 'time', default: null, desc: 'senkron anı: oklar 1 tur döner (~1 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // boşta hafif süzülme
    const fy = Math.sin(t * k.TAU / 2.4) * 2.5;

    // bulut birleşimi: önce dış hat renginde geniş, sonra gövde renginde normal
    // (k.rrect içinde beginPath çağırdığı için parçalar ayrı doldurulur)
    const parts = (grow, c) => {
      ctx.fillStyle = c;
      for (const [cx, cy, r] of [[-44, 8, 30], [-8, -12, 38], [32, 2, 32], [58, 16, 22]]) {
        ctx.beginPath(); ctx.arc(cx, cy + fy, r + grow, 0, k.TAU); ctx.fill();
      }
      ctx.beginPath(); k.rrect(-74 - grow, 8 + fy - grow, 154 + grow * 2, 30 + grow * 2, 14 + grow); ctx.fill();
    };
    parts(LW / 2, line);
    parts(0, body);

    // iç veri noktaları (hafif nabız)
    for (let i = 0; i < 3; i++) {
      const a = 0.5 + 0.4 * Math.sin(t * 2.5 + i * 2.1);
      ctx.fillStyle = k.rgba('cyan', a);
      ctx.beginPath(); ctx.arc(-24 + i * 24, 26 + fy, 4, 0, k.TAU); ctx.fill();
    }

    // senkron animasyonu: iki yay oku 1 tur döner
    const d = p.sync == null ? -1 : t - p.sync;
    if (d >= 0 && d < 1.1) {
      const rot = (d / 1.1) * k.TAU;
      const fade = d < 0.15 ? d / 0.15 : (d > 0.9 ? 1 - (d - 0.9) / 0.2 : 1);
      const cx = 0, cy = -6 + fy, r = 30;
      k.glow(cx, cy, 46, 'cyan', 0.3 * fade);
      for (const off of [0, Math.PI]) {
        const a0 = rot + off, a1 = rot + off + Math.PI * 0.75;
        ctx.strokeStyle = k.rgba('cyan', fade); ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke();
        // ok ucu
        const ex = cx + Math.cos(a1) * r, ey = cy + Math.sin(a1) * r;
        const ta = a1 + Math.PI / 2;
        ctx.fillStyle = k.rgba('cyan', fade);
        ctx.beginPath();
        ctx.moveTo(ex + Math.cos(ta) * 10, ey + Math.sin(ta) * 10);
        ctx.lineTo(ex - Math.cos(ta - 0.5) * 10, ey - Math.sin(ta - 0.5) * 10);
        ctx.lineTo(ex - Math.cos(ta + 0.5) * 10, ey - Math.sin(ta + 0.5) * 10);
        ctx.closePath(); ctx.fill();
      }
    }
  },
};
