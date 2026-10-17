// science/planet — halkalı gezegen; yüzey detayları rotate ile kayar, yavaşça döner.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezidir.
export default {
  name: 'planet',
  category: 'science',
  desc: 'Halkalı gezegen; yüzey detayları rotate fazıyla kayar ve gezegen yavaşça döner',
  tags: ['gezegen', 'planet', 'halka', 'ring', 'uzay', 'space', 'satürn', 'saturn', 'gök cismi', 'astronomi', 'astronomy'],
  box: [-135, -100, 135, 100],
  bleed: 10,
  anchor: 'gövde merkezi (0,0)',
  points: { center: [0, 0], top: [0, -62] },
  params: {
    color: { type: 'color', default: 'cyan', desc: 'gezegen gövde rengi' },
    rotate: { type: 'number', default: 0.25, desc: 'yüzey fazı 0–1' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round';
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const R = 62;

    const tilt = -0.12;
    // arka halka (gezegenin arkasında kalan tam elips)
    ctx.save(); ctx.rotate(tilt);
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.ellipse(0, 0, 118, 30, 0, 0, k.TAU); ctx.stroke();
    ctx.restore();

    // gezegen diski: dış hat + gövde
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();

    // yüzey detayları — küre projeksiyonu, rotate fazı + yavaş dönüş
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.clip();
    const blobs = [
      { lat: -0.35, th: 0.6, r: 20 }, { lat: 0.25, th: 2.4, r: 26 },
      { lat: 0.05, th: 4.1, r: 15 }, { lat: -0.1, th: 5.3, r: 18 },
    ];
    blobs.forEach((b) => {
      const phi = b.th + p.rotate * k.TAU + t * 0.25;
      const cx = Math.cos(phi);
      if (cx < -0.15) return; // arka yüzde gizle
      const x = R * Math.cos(b.lat) * cx;
      const y = R * Math.sin(b.lat);
      const s = 0.55 + 0.45 * cx;
      ctx.fillStyle = k.rgba('bg', 0.3);
      ctx.beginPath(); ctx.arc(x, y, b.r * s, 0, k.TAU); ctx.fill();
    });
    // alt gölge kuşağı
    ctx.fillStyle = k.rgba('bg', 0.18);
    ctx.beginPath(); ctx.ellipse(0, R * 0.72, R * 0.95, R * 0.3, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-20, -24, 18, 12, -0.4, 0, k.TAU); ctx.fill();

    // ön halka (gezegenin önünden geçen alt yay)
    ctx.save(); ctx.rotate(tilt);
    ctx.strokeStyle = line; ctx.lineWidth = 12 + LW;
    ctx.beginPath(); ctx.ellipse(0, 0, 118, 30, 0, 0, Math.PI); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.ellipse(0, 0, 118, 30, 0, 0, Math.PI); ctx.stroke();
    ctx.restore();

    ctx.restore();
  },
};
