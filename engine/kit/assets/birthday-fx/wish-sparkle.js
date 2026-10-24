// birthday-fx/wish-sparkle — küçük mumlu kek ve etrafında döngüsel yanıp sönen dilek kıvılcımları.
// NOT: canvas y-aşağıdır; (0,0) kek tabanıdır, kıvılcımlar negatif y yönünde yukarıdadır.
export default {
  name: 'wish-sparkle', category: 'birthday-fx',
  desc: 'Mumlu küçük kek; etrafında döngüsel yanıp sönen dört köşeli dilek kıvılcımları',
  tags: ['dilek', 'kıvılcım', 'parıltı', 'mum', 'doğum günü', 'sihir', 'wish', 'sparkle', 'twinkle', 'candle', 'birthday', 'magic'],
  box: [-150, -160, 150, 60],
  bleed: 45,
  anchor: 'kek tabanı (0,0)',
  points: { flame: [0, -52], sparkle: [84, -96], cake: [0, 0] },
  params: {
    color: { type: 'color', default: 'yellow', desc: 'kıvılcım ve alev rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'dilek anı — 0.8 sn büyük yıldız patlaması ve halka' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.9;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const star4 = (x, y, r, c) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const ang = i * Math.PI / 4 - Math.PI / 2;
        const rr = i % 2 === 0 ? r : r * 0.28;
        const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    };
    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, 52, 70, 9, 0, 0, k.TAU); ctx.fill();

    // küçük kek: kap + krema kubbesi
    ctx.fillStyle = line; ctx.beginPath(); ctx.moveTo(-46, 6); ctx.lineTo(46, 6); ctx.lineTo(36, 48); ctx.lineTo(-36, 48); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); ctx.moveTo(-42, 8); ctx.lineTo(42, 8); ctx.lineTo(33, 46); ctx.lineTo(-33, 46); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    for (const dx of [-24, -8, 8, 24]) {
      ctx.beginPath(); ctx.moveTo(dx, 12); ctx.lineTo(dx - 4, 42); ctx.stroke();
    }
    disc(0, 0, 46, 12, k.rgba(p.color));
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -6, 14, 5, -0.3, 0, k.TAU); ctx.fill();

    // mum + titreyen alev (canlı idle)
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); ctx.rect(-5, -34, 10, 26); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -40); ctx.stroke();
    const flick = 1 + k.noise1(t * 6.5) * 0.14;
    const sway = k.noise1(t * 3.4) * 2.5;
    k.glow(sway, -52, 30 * flick, p.color, 0.4 * flick);
    ctx.save();
    ctx.translate(sway, -52);
    ctx.scale(flick, flick);
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.quadraticCurveTo(8, -3, 5, 4);
    ctx.quadraticCurveTo(2, 9, 0, 9);
    ctx.quadraticCurveTo(-2, 9, -5, 4);
    ctx.quadraticCurveTo(-8, -3, 0, -13);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.ellipse(0, 3, 2.5, 4, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // döngüsel kıvılcımlar: her biri kendi fazında yanıp söner (~2.2 sn periyot)
    const spots = [[-84, -96], [84, -96], [-108, -40], [108, -40], [-58, -128], [58, -128], [0, -118]];
    for (let i = 0; i < spots.length; i++) {
      const [sx, sy] = spots[i];
      const phase = k.hash(i * 17 + 7) * k.TAU;
      const s = 0.5 + 0.5 * Math.sin(t * k.TAU / 2.2 + phase);
      const r = 5 + 11 * s;
      star4(sx, sy, r, k.rgba(p.color, 0.3 + 0.65 * s));
    }
    // yükselen toz zerreleri (döngüsel)
    for (let i = 0; i < 5; i++) {
      const h1 = k.hash(i * 11 + 3), h2 = k.hash(i * 23 + 19);
      const u = (t * 0.25 + h1) % 1;
      const x = (h2 - 0.5) * 160;
      const y = 30 - u * 150;
      ctx.fillStyle = k.rgba(p.color, 0.5 * (1 - u) * (0.4 + 0.6 * (1 - Math.abs(u - 0.5) * 2)));
      ctx.beginPath(); ctx.arc(x, y, 2 + h1 * 2, 0, k.TAU); ctx.fill();
    }

    // dilek anı: büyük yıldız patlaması + genişleyen halka
    if (burst) {
      const f = 1 - d / 0.9;
      k.glow(0, -52, 110 * f, p.color, 0.5 * f);
      star4(0, -52, 10 + 34 * (1 - f), 'rgba(255,255,255,' + (0.95 * f).toFixed(3) + ')');
      if (d < 0.5) {
        const g = d / 0.5;
        ctx.strokeStyle = k.rgba(p.color, 0.6 * (1 - g));
        ctx.lineWidth = 4 * (1 - g) + 1;
        ctx.beginPath(); ctx.arc(0, -52, 12 + 80 * g, 0, k.TAU); ctx.stroke();
      }
    }
  },
};
