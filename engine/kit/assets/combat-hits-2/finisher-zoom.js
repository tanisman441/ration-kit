// combat-hits-2/finisher-zoom — bitirici darbe: merkeze çöken yakınlaşma halkaları + merkez flaşı + yıldız patlama.
// NOT: canvas y-aşağıdır; (0,0) bitirici darbenin vuruş noktası.
export default {
  name: 'finisher-zoom', category: 'combat-hits-2',
  desc: 'Bitirici darbe: merkeze çöken yakınlaşma halkaları, flaş ve yıldız patlama',
  tags: ['bitirici', 'yakınlaşma', 'odak', 'flaş', 'darbe', 'patlama', 'finisher', 'zoom', 'flash', 'focus', 'strike', 'burst'],
  box: [-150, -150, 150, 150],
  bleed: 35,
  anchor: 'bitirici darbenin vuruş noktası (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'bitirici darbe anı (halka çöküşü + flaş, ~0.6 sn)' },
    color: { type: 'color', default: 'yellow' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d <= 1.0;

    ctx.save();
    // idle: merkezde hafifçe nabız atan odak halkası
    const idleR = 26 + 3 * Math.sin(t * k.TAU / 2.4);
    ctx.strokeStyle = k.rgba(p.color, 0.16 + 0.08 * (0.5 + 0.5 * Math.sin(t * k.TAU / 2.4)));
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, idleR, 0, k.TAU); ctx.stroke();

    if (active) {
      // 1) merkez flaşı — anlık ve yoğun (0.16 sn)
      if (d < 0.16) {
        const f = 1 - d / 0.16;
        k.glow(0, 0, 110 * f, p.color, 0.5 * f);
        ctx.fillStyle = k.rgba(p.color, 0.95 * f);
        ctx.beginPath(); ctx.arc(0, 0, 20 * f + 6, 0, k.TAU); ctx.fill();
      }
      // 2) yakınlaşma halkaları — dıştan merkeze çöker (4 halka, kademeli)
      for (let i = 0; i < 4; i++) {
        const start = i * 0.07;
        const dd = d - start;
        if (dd < 0) continue;
        const g = k.prog(dd, 0, 0.42);
        if (g >= 1) continue;
        const rr = 152 - (152 - 30) * k.E.outCubic(g);
        const alpha = 0.6 * (1 - g) * (1 - i * 0.12);
        ctx.strokeStyle = k.rgba(p.color, alpha);
        ctx.lineWidth = 6 * (1 - g * 0.55) + 1.5;
        ctx.beginPath(); ctx.arc(0, 0, rr, 0, k.TAU); ctx.stroke();
      }
      // 3) yıldız patlama — merkezden kısa ışın yıldızı (0.4 sn)
      if (d > 0.03 && d < 0.45) {
        const dg = k.prog(d - 0.03, 0, 0.12);
        const fade = 1 - k.prog(d - 0.03, 0.1, 0.42);
        const R = (30 + 46 * k.E.outCubic(dg)) * fade;
        if (R > 1) {
          ctx.fillStyle = k.rgba(p.color, 0.85 * fade);
          ctx.beginPath();
          const spikes = 8;
          for (let i = 0; i < spikes * 2; i++) {
            const a = i * Math.PI / spikes;
            const rr = i % 2 === 0 ? R : R * 0.42;
            const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.fill();
        }
      }
      // 4) hız tırtıkları — halka çöküşünü güçlendiren radyal çizgiler
      if (d > 0.02 && d < 0.5) {
        const fade = 1 - k.prog(d - 0.02, 0, 0.48);
        ctx.strokeStyle = k.rgba(p.color, 0.4 * fade);
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        for (let i = 0; i < 12; i++) {
          const h1 = k.hash(i * 7 + 601);
          const a = i * k.TAU / 12 + h1 * 0.2;
          const r0 = 152 - (152 - 40) * k.E.outCubic(k.prog(d - 0.02, 0, 0.42));
          const r1 = r0 - (14 + h1 * 18);
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * r0, Math.sin(a) * r0);
          ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
};
