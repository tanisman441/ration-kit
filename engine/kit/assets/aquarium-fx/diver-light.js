// aquarium-fx/diver-light — mini dalgıç figürü: fener ışını sağa uzanır,
// idle titrer (noise) ve içinde toz zerreleri süzülür; sweep anında
// (1.0 sn) ışın yukarı-aşağı tarama yapar. Kasktan kabarcıklar çıkar.
// NOT: canvas y-aşağıdır; (0,0) dalgıcın gövde merkezidir, sağa bakar.
export default {
  name: 'diver-light', category: 'aquarium-fx',
  desc: 'El feneriyle etrafı aydınlatan mini dalgıç figürü, sweep anında ışını tarama yapar',
  tags: ['dalgıç', 'fener', 'ışın', 'tarama', 'su altı', 'diver', 'flashlight', 'beam', 'sweep', 'underwater'],
  box: [-80, -85, 165, 85],
  bleed: 45,
  anchor: 'dalgıcın gövde merkezi (0,0), sağa bakar',
  points: { lamp: [34, -6], beam_end: [150, 0], helmet: [-14, -34] },
  params: {
    sweep: { type: 'time', default: null, desc: 'ışın taraması anı (1.0 sn, ışın yukarı-aşağı salınır)' },
    color: { type: 'color', default: 'cyan', desc: 'dalgıç kıyafeti rengi' },
  },
  draw(ctx, t, p, k) {
    const suit = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    // sweep olayı (1.0 sn): ışın yukarı-aşağı tarama yapar
    const sd = p.sweep == null ? -1 : t - p.sweep;
    let beamRot = 0;
    if (sd >= 0 && sd < 1.0) beamRot = Math.sin((sd / 1.0) * Math.PI * 2) * 0.32;

    // idle: hafif süzülme
    ctx.translate(k.noise1(t * 0.4) * 5, Math.sin(t * k.TAU / 2.6) * 5);

    // ışın titremesi (idle canlılık)
    const flick = 0.15 + 0.05 * k.noise1(t * 3.5);

    // ışın konisi: fenerden sağa (sweep ile döner)
    ctx.save();
    ctx.translate(34, -6); ctx.rotate(beamRot);
    ctx.fillStyle = k.rgba('yellow', flick + (sd >= 0 && sd < 1.0 ? 0.08 : 0));
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(118, -34); ctx.lineTo(118, 34); ctx.lineTo(0, 7);
    ctx.closePath(); ctx.fill();
    k.glow(10, 0, 26, 'yellow', 0.4);
    // ışındaki toz zerreleri: yavaşça sürüklenir
    for (let i = 0; i < 6; i++) {
      const h = k.hash(i * 37.9);
      const px = 14 + ((t * 12 * (0.5 + h) + h * 100) % 100);
      const py = (h * 53 % 1 - 0.5) * (px * 0.55);
      ctx.fillStyle = k.rgba('yellow', 0.5 * (1 - px / 120));
      ctx.beginPath(); ctx.arc(px, py, 1.8, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // paletler (arkada)
    ctx.fillStyle = k.rgba(suit, 0.85);
    for (const fy of [-14, 12]) {
      ctx.beginPath();
      ctx.moveTo(-30, fy - 7); ctx.lineTo(-58, fy - 11 + Math.sin(t * 3 + fy) * 4);
      ctx.lineTo(-58, fy + 11 + Math.sin(t * 3 + fy) * 4); ctx.lineTo(-30, fy + 7);
      ctx.closePath(); ctx.fill();
    }

    // gövde
    ctx.fillStyle = k.rgba(suit, 0.92);
    k.rrect(-30, -24, 56, 48, 12); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    k.rrect(-30, -24, 56, 48, 12); ctx.stroke();
    // premium finish: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, -13, 13, 7, -0.4, 0, k.TAU); ctx.fill();
    // hava tüpü
    ctx.fillStyle = k.rgba('dim', 0.9);
    k.rrect(-24, -34, 14, 12, 5); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    k.rrect(-24, -34, 14, 12, 5); ctx.stroke();

    // kol + fener
    ctx.strokeStyle = k.rgba(suit, 0.95); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(20, -8); ctx.lineTo(34, -6); ctx.stroke();
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(28, -14, 16, 16, 4); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    k.rrect(28, -14, 16, 16, 4); ctx.stroke();
    k.glow(46, -6, 12, 'yellow', 0.5);

    // kask: yuvarlak, cam vizör
    ctx.fillStyle = k.rgba(suit, 0.92);
    ctx.beginPath(); ctx.arc(-14, -38, 20, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(-14, -38, 20, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.55);
    ctx.beginPath(); ctx.arc(-6, -38, 10, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(-6, -38, 10, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(-9, -41, 3, 0, k.TAU); ctx.fill();

    // kasktan çıkan kabarcıklar (idle, ~2 sn döngü)
    for (let i = 0; i < 4; i++) {
      const h = k.hash(i * 19.3 + 7);
      const ph = ((t * 0.5 + h) % 1);
      const x = -20 + (h - 0.5) * 16 - ph * 8;
      const y = -56 - ph * 26;
      ctx.strokeStyle = k.rgba('cyan', 0.5 * (1 - ph)); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 2 + h * 2.5, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
