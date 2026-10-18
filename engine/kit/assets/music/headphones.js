// music/headphones — kafa üstü kulaklık: yay bandı + iki kulak yastığı;
// kulaklıklardan dışa doğru yayılan ses dalgaları (sol/sağ dönüşümlü nabız).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kulaklığın merkezidir.
export default {
  name: 'headphones', category: 'music',
  desc: 'Kafa üstü kulaklık; kulak yastıklarından dönüşümlü ses dalgaları yayılır',
  tags: ['kulaklık', 'headphone', 'müzik', 'ses', 'headphones', 'headset', 'music', 'audio', 'sound'],
  box: [-145, -120, 145, 120],
  bleed: 60,
  anchor: 'kulaklığın merkezi (0,0)',
  points: { left: [-95, 55], right: [95, 55], band: [0, -85] },
  params: {
    color: { type: 'color', default: 'panel2' },
    waves: { type: 'number', default: 1, desc: 'ses dalgası animasyonu (0=kapalı)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), acc = k.rgba('cyan', 0.9);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();

    const wv = k.clamp(p.waves, 0, 1);
    // kulak yastıklarında hafif sıkışma nabzı
    const squeeze = 1 + 0.02 * Math.sin(t * 2.5) * wv;

    // ---- band: üstten geçen yay
    const bandArc = (r, wdt, c) => {
      ctx.strokeStyle = c; ctx.lineWidth = wdt;
      ctx.beginPath(); ctx.arc(0, 10, r, Math.PI * 1.02, Math.PI * 1.98); ctx.stroke();
    };
    bandArc(95, 20, line);
    bandArc(95, 13, body);
    // band iç yastığı (tepe kısmı)
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(0, 10, 88, Math.PI * 1.18, Math.PI * 1.82); ctx.stroke();
    // band parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -58, 20, 9, 0.6, 0, k.TAU); ctx.fill();

    // ---- kulak yastıkları
    const cup = (sx) => {
      const cx = sx * 95, cy = 55;
      // çatal (yoke): band ucundan yastığa kısa kol (serbest çizgi = ink)
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(cx, 2); ctx.lineTo(cx, 20); ctx.stroke();

      ctx.save(); ctx.translate(cx, cy); ctx.scale(squeeze, squeeze);
      // gölge + kontur + gövde
      ctx.fillStyle = k.rgba('ink', 0.12);
      ctx.beginPath(); k.rrect(-30 + 6, -38 + 6, 60, 76, 16); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(-30 - LW / 2, -38 - LW / 2, 60 + LW, 76 + LW, 18); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); k.rrect(-30, -38, 60, 76, 14); ctx.fill();
      // yastık iç kısmı (kulak minderi)
      ctx.fillStyle = k.rgba('ink', 0.45);
      ctx.beginPath(); k.rrect(-21, -28, 42, 56, 11); ctx.fill();
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); k.rrect(-15, -22, 30, 44, 8); ctx.fill();
      // dış kapak parlaması (sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-14, -24, 10, 7, -0.4, 0, k.TAU); ctx.fill();
      // LED nokta (vurgu)
      ctx.fillStyle = acc;
      ctx.beginPath(); ctx.arc(sx * 18, 30, 4.5, 0, k.TAU); ctx.fill();
      ctx.restore();

      // ---- ses dalgaları: yastıktan dışa doğru yaylar (sol/sağ faz farklı)
      if (wv > 0) {
        const phase = sx > 0 ? Math.PI : 0;
        for (let i = 0; i < 4; i++) {
          const cyc = (t * 1.4 + i / 4 + phase / k.TAU) % 1;
          const r = 12 + cyc * 30;
          const a = (1 - cyc) * 0.6 * wv;
          const wx = cx + sx * (34 + cyc * 30);
          ctx.strokeStyle = k.rgba('cyan', a); ctx.lineWidth = 4;
          ctx.beginPath();
          if (sx > 0) ctx.arc(wx, cy, r, -0.8, 0.8);
          else ctx.arc(wx, cy, r, Math.PI - 0.8, Math.PI + 0.8);
          ctx.stroke();
        }
      }
    };
    cup(-1);
    cup(1);

    ctx.restore();
  },
};
