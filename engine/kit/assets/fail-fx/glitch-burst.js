// fail-fx/glitch-burst — glitch patlaması: at anında 0.15-0.4 sn yatay dilim kaymaları +
// kırmızı hayalet ofset (k.hash tabanlı); idle'da çok hafif titreme. Tek vurgu rengi: red.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'glitch-burst',
  category: 'fail-fx',
  desc: 'Yatay dilim kaymalı, kırmızı hayaletli glitch patlaması',
  tags: ['glitch', 'hata', 'bozulma', 'sinyal', 'dijital', 'arıza', 'fail', 'glitch', 'error', 'corrupt', 'digital'],
  box: [-115, -85, 115, 85],
  bleed: 35,
  anchor: 'kart merkezi (0,0)',
  points: { center: [0, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'glitch anı: 0.15-0.4 sn dilim kayması + kırmızı hayalet' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const firing = d >= 0.15 && d < 0.4;
    const env = firing ? Math.sin(((d - 0.15) / 0.25) * Math.PI) : 0; // 0→1→0
    // idle: çok hafif titreme (noise1, ±1.2)
    const idleX = k.noise1(t * 4.2) * 1.2;
    const idleY = k.noise1(t * 3.3 + 7) * 1.0;

    const W = 180, H = 120, R = 14;

    // kart gövdesini çizen yardımcı (dilim kopyalarında yeniden kullanılır)
    const cardBody = (fillStyle) => {
      ctx.fillStyle = fillStyle;
      ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    };
    const cardDetail = () => {
      // iç detay: başlık çubuğu + içerik çizgileri (bilgi taşımayan soyut bloklar)
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); k.rrect(-W / 2 + 16, -H / 2 + 14, 70, 12, 6); ctx.fill();
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = k.rgba('ink', 0.35);
        const lw = 120 - i * 22;
        ctx.beginPath(); k.rrect(-W / 2 + 16, -H / 2 + 42 + i * 22, lw, 9, 4.5); ctx.fill();
      }
      // köşe butonu (vurgu)
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.beginPath(); ctx.arc(W / 2 - 28, -H / 2 + 20, 10, 0, k.TAU); ctx.fill();
    };

    ctx.save();
    ctx.translate(idleX, idleY);

    // --- kırmızı hayalet (firing anında ofsetli kopya) ---
    if (env > 0) {
      ctx.save();
      ctx.translate(-9 * env, 0);
      cardBody(k.rgba(p.color, 0.5 * env));
      ctx.restore();
    }

    // --- taban kart ---
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(-W / 2 + 6, -H / 2 + 6, W, H, R); ctx.fill();
    cardBody(k.rgba('dim'));
    // sol üst parlama (premium, alfa 0.11)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath();
    ctx.ellipse(-W / 2 + 46, -H / 2 + 18, 50, 15, -0.35, 0, k.TAU);
    ctx.fill();
    cardDetail();
    // dış hat
    ctx.lineWidth = 5;
    ctx.strokeStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.stroke();

    // --- yatay dilim kaymaları: 6 dilim, k.hash tabanlı ofset ---
    if (env > 0) {
      const bands = 6;
      for (let i = 0; i < bands; i++) {
        const y0 = -H / 2 + (i * H) / bands;
        const ox = (k.hash(50 + i * 13) - 0.5) * 2 * env * 34;
        if (Math.abs(ox) < 0.5) continue;
        ctx.save();
        ctx.beginPath(); ctx.rect(-W / 2 - 40, y0, W + 80, H / bands + 1); ctx.clip();
        ctx.translate(ox, 0);
        cardBody(k.rgba('dim'));       // kayan dilim tabanla aynı tonda
        cardDetail();
        ctx.restore();
        // dilim kenarında kısa kırmızı yırtık işareti (ofset ucunda)
        ctx.fillStyle = k.rgba(p.color, 0.7 * env);
        const ex = ox > 0 ? -W / 2 : W / 2;
        ctx.fillRect(ex - (ox > 0 ? 0 : 8), y0, 8, 3);
      }
    }

    ctx.restore();
  },
};
