// disaster-fx/lightning-strike — yıldırım: kara bulut, at anında gökyüzünden
// yere inen dallanmış zigzag çakım, çarpma noktasında flaş ve genleşen halka.
// Öncesi: bulut sürüklenir, arada uzaktan hafif çakar (idle). 0.45 sn'de söner.
// NOT: canvas y-aşağıdır; (0,0) çarpma noktasıdır.
export default {
  name: 'lightning-strike', category: 'disaster-fx',
  desc: 'Yıldırım: kara buluttan yere inen zigzag çakım, flaş ve dalga halkası',
  tags: ['yıldırım', 'şimşek', 'çakım', 'bulut', 'fırtına', 'afet', 'lightning', 'strike', 'bolt', 'thunderstorm', 'flash'],
  box: [-130, -130, 130, 70],
  bleed: 45,
  anchor: 'çarpma noktası (0,0)',
  points: { strike: [0, 0], cloud: [0, -96], bolt_mid: [-6, -48] },
  params: {
    at: { type: 'time', default: null, desc: 'çarpma anı (çakım 0.45 sn boyunca görünür, sonra söner)' },
    color: { type: 'color', default: 'yellow', desc: 'çakım rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Kara bulut — sürekli sürüklenir, içinden yağmur çizgileri
    const drift = k.noise1(t * 0.9) * 14;
    const cloudTop = -96;
    ctx.fillStyle = k.rgba('dim');
    const blob = (bx, by, r) => { ctx.beginPath(); ctx.arc(drift + bx, cloudTop + by, r, 0, k.TAU); ctx.fill(); };
    blob(0, 0, 42); blob(-42, 8, 30); blob(42, 8, 32); blob(-78, 14, 22); blob(78, 14, 24); blob(0, -18, 34);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(drift - 78, cloudTop + 14, 22, Math.PI * 0.7, Math.PI * 1.55);
    ctx.arc(drift + 78, cloudTop + 14, 24, Math.PI * 1.45, Math.PI * 0.3);
    ctx.stroke();
    // bulut parlama / gölge (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(drift - 30, cloudTop - 16, 26, 11, -0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.14);
    ctx.beginPath(); ctx.ellipse(drift + 40, cloudTop + 12, 30, 10, 0.15, 0, k.TAU); ctx.fill();
    // yağmur çizgileri (idle)
    ctx.strokeStyle = k.rgba('cyan', 0.4); ctx.lineWidth = 2.5;
    for (let i = 0; i < 7; i++) {
      const seed = i * 37 + 11;
      const rx = drift - 90 + k.hash(seed) * 180;
      const ry = cloudTop + 28 + ((t * 60 + k.hash(seed + 1) * 40) % 36);
      ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 3, ry + 12); ctx.stroke();
    }
    // uzaktan ara çakmalar (idle — çarpma öncesi atmosfer)
    if (d < 0) {
      const flick = k.hash(Math.floor(t * 0.5)) > 0.72 ? 0.25 : 0;
      if (flick) {
        ctx.fillStyle = k.rgba(acc, flick);
        ctx.beginPath(); ctx.ellipse(drift, cloudTop, 70, 24, 0, 0, k.TAU); ctx.fill();
      }
    }

    // Zemin şeridi
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-130, 0, 260, 14, 7); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5; ctx.stroke();

    // Çarpma: dallanmış zigzag çakım (0.45 sn görünür)
    if (d >= 0 && d < 0.45) {
      const fade = 1 - d / 0.45;
      const pts = [[0, -62]];
      let bx = 0, by = -62;
      for (let s2 = 0; s2 < 6; s2++) {
        bx += (k.hash(s2 * 91 + 3) - 0.5) * 44;
        by += 10.5;
        pts.push([bx, by]);
      }
      // parlama halesi
      k.glow(pts[6][0], pts[6][1], 70 * fade + 10, acc, 0.45 * fade);
      // ana çakım — titreşimli kalınlık
      const wob = 1 + k.noise1(t * 60) * 1.5;
      ctx.strokeStyle = k.rgba(acc, 0.95 * fade);
      ctx.lineWidth = 7 * wob;
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let s2 = 1; s2 < pts.length; s2++) ctx.lineTo(pts[s2][0], pts[s2][1]);
      ctx.stroke();
      // iç beyaz çekirdek
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.9 * fade).toFixed(3) + ')';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // yan dal
      ctx.strokeStyle = k.rgba(acc, 0.7 * fade);
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(pts[2][0], pts[2][1]);
      ctx.lineTo(pts[2][0] - 34, pts[2][1] + 16);
      ctx.lineTo(pts[2][0] - 44, pts[2][1] + 38);
      ctx.stroke();
      // çarpma flaşı — zeminde kıvılcımlar
      for (let i = 0; i < 8; i++) {
        const seed = i * 53 + 7;
        const a = -Math.PI / 2 + (k.hash(seed) - 0.5) * 2.6;
        const rr = (d / 0.45) * (30 + k.hash(seed + 1) * 40);
        ctx.fillStyle = k.rgba(acc, 0.9 * fade);
        ctx.beginPath();
        ctx.arc(pts[6][0] + Math.cos(a) * rr, Math.sin(a) * rr * 0.4, 3 * fade + 0.5, 0, k.TAU);
        ctx.fill();
      }
      // genleşen şok halkası
      ctx.strokeStyle = k.rgba(acc, 0.55 * fade);
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.ellipse(pts[6][0], 2, 12 + (d / 0.45) * 95, 4 + (d / 0.45) * 22, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
