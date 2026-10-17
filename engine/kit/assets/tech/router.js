// tech/router — Wi-Fi yönlendirici: 3 anten, trafik arttıkça sinyal dalgaları ve LED'ler canlanır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), her şey negatif y yönünde yukarı uzar.
export default {
  name: 'router', category: 'tech',
  desc: 'Üç antenli Wi-Fi yönlendirici; trafik arttıkça sinyal dalgaları yayılır, LEDler yanar',
  tags: ['router', 'yönlendirici', 'wifi', 'modem', 'ağ', 'internet', 'antenna', 'anten', 'network'],
  box: [-100, -172, 100, 10],
  bleed: 10,
  anchor: 'taban (0,0); antenler yukarı uzar',
  points: { antenna: [0, -160], front: [86, -24] },
  params: {
    color: { type: 'color', default: 'panel2' },
    traffic: { type: 'number', default: 0.5, desc: 'ağ trafiği (0-1): yanan LED ve sinyal yoğunluğu' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const tr = k.clamp(p.traffic, 0, 1);

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    const dot = (x, y, r, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, k.TAU); ctx.fill(); };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -4, 92, 9, 0, 0, k.TAU); ctx.fill();

    // gövde
    blob(-80, -52, 160, 46, 14, body);
    // ön panel çizgisi
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-68, -29); ctx.lineTo(-8, -29); ctx.stroke();

    // LED'ler: güç (sürekli) + 4 trafik LED'i
    dot(-74, -29, 4.5, k.rgba('green', 0.9));
    k.glow(-74, -29, 13, 'green', 0.25);
    const lit = Math.round(tr * 4);
    for (let i = 0; i < 4; i++) {
      const x = 8 + i * 16;
      if (i < lit) {
        const tw = 0.6 + 0.4 * Math.abs(Math.sin(t * (3 + tr * 4) + i * 1.7));
        dot(x, -29, 4.5, k.rgba('cyan', tw));
        if (tw > 0.8) k.glow(x, -29, 13, 'cyan', 0.25);
      } else {
        dot(x, -29, 4.5, k.rgba('dim', 0.45));
      }
    }

    // antenler (3 adet, hafif dışa eğik)
    const ants = [[-52, -8], [0, 0], [52, 8]];
    for (const [ax, tilt] of ants) {
      const bx = ax, by = -50, tx = ax + tilt, ty = -140;
      limb(bx, by, tx, ty, 10, body);
      dot(tx, ty, 7, body);
      // uç halka (vurgu)
      ctx.strokeStyle = k.rgba('cyan', 0.35 + tr * 0.65); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(tx, ty, 11, 0, k.TAU); ctx.stroke();
    }

    // sinyal dalgaları: trafik arttıkça daha çok ve daha parlak
    const waves = 1 + Math.round(tr * 2);
    for (let w = 0; w < waves; w++) {
      const ph = (t * (0.7 + tr) + w / waves) % 1;
      const r = 14 + ph * 26;   // max 40: dalga tepesi kutu+bleed içinde kalır
      const a = (1 - ph) * (0.15 + tr * 0.45);
      ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, -140, r, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
  },
};
