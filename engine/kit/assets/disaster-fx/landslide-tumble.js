// disaster-fx/landslide-tumble — heyelan: at anında yamacın tepesinden kopan
// kayalar döner yuvarlanarak aşağı iner (1.2 sn), arkalarında toz bulutu kalır.
// Öncesi: yamaç sakin, küçük taşlar hafif sallanır (idle); sonunda zemin sarsılır.
// NOT: canvas y-aşağıdır; (0,0) yamacın tabanıdır.
export default {
  name: 'landslide-tumble', category: 'disaster-fx',
  desc: 'Heyelan: yamacından kopup dönen kayalar ve ardında kalan toz bulutu',
  tags: ['heyelan', 'kaya', 'toprak kayması', 'çığ', 'toz', 'yamaç', 'afet', 'landslide', 'rocks', 'avalanche', 'dust', 'disaster'],
  box: [-150, -120, 150, 80],
  bleed: 50,
  anchor: 'yamaç tabanı (0,0)',
  points: { slope_top: [-120, -80], base: [40, 40], dust: [60, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'kopma anı (kayalar 1.2 sn boyunca yuvarlanır, toz 1.6 sn sürer)' },
    color: { type: 'color', default: 'dim', desc: 'yamaç rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const g = p.color;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // Yamaç — üçgen kütle
    const shake = d >= 0 && d < 0.3 ? k.noise1(t * 25) * 3 * (1 - d / 0.3) : 0;
    ctx.translate(shake, 0);
    ctx.fillStyle = k.rgba(g);
    ctx.beginPath();
    ctx.moveTo(-150, 60); ctx.lineTo(-150, -60); ctx.lineTo(120, 60);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    // sol üst parlama / sağ alt gölge (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-95, -35, 44, 12, -0.45, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(55, 38, 48, 13, 0.15, 0, k.TAU); ctx.fill();
    // yamaç yüzey çizgileri
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-130 + i * 12, -30 + i * 22);
      ctx.lineTo(-20 + i * 12, -30 + i * 22);
      ctx.stroke();
    }

    // Sabit küçük taşlar — yamaçta hafifçe sallanır (idle)
    const idleWob = 0.8;
    for (let i = 0; i < 5; i++) {
      const seed = i * 29 + 3;
      const sx = -100 + k.hash(seed) * 130, sy = 20 - k.hash(seed + 1) * 60;
      ctx.fillStyle = k.rgba('ink', 0.5);
      ctx.beginPath();
      ctx.arc(sx + Math.sin(t * 2 + seed) * idleWob, sy, 3.5 + k.hash(seed + 2) * 3, 0, k.TAU);
      ctx.fill();
    }

    // Yuvarlanan kayalar — 1.2 sn'de tepeden tabana döner
    const roll = (sx0, sy0, r, seed, dur, delay) => {
      const dd = d - delay;
      let x, y, rot, alpha;
      if (dd < 0) {
        x = sx0; y = sy0; rot = 0; alpha = 0.75;
      } else if (dd < dur) {
        const pr = k.prog(dd, 0, dur);
        const e = k.E.outCubic(pr);
        const xT = 40 + k.hash(seed) * 40 + k.hash(seed + 4) * 30;
        x = sx0 + (xT - sx0) * e;
        y = sy0 + (46 - sy0) * e + Math.abs(Math.sin(pr * 9)) * 10 * (1 - pr);
        rot = pr * (5 + k.hash(seed + 5) * 4);
        alpha = 1;
      } else {
        const stop = 1 - k.prog(dd, dur, dur + 0.6);
        x = 40 + k.hash(seed) * 40 + k.hash(seed + 4) * 30;
        y = 46 - r * 0.5 + k.noise1(t * 20 + seed) * 2 * stop;
        rot = 5 + k.hash(seed + 5) * 4;
        alpha = 1;
      }
      ctx.save();
      ctx.translate(x, y); ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath();
      // çokgen kaya silueti
      const n = 6;
      for (let vi = 0; vi <= n; vi++) {
        const a = (vi / n) * k.TAU;
        const rr = r * (0.8 + 0.25 * k.hash(seed + vi * 17));
        const vx = Math.cos(a) * rr, vy = Math.sin(a) * rr;
        if (vi === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();
      // kaya parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.35, r * 0.4, r * 0.2, -0.4, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    roll(-125, -75, 16, 11, 1.2, 0);
    roll(-110, -85, 11, 47, 1.1, 0.12);
    roll(-130, -65, 9, 83, 1.3, 0.25);
    roll(-105, -72, 7, 119, 1.0, 0.38);

    // Toz bulutu — at anından itibaren 1.6 sn sürüklenir
    if (d >= 0 && d < 1.6) {
      const dg = d / 1.6;
      for (let i = 0; i < 12; i++) {
        const seed = i * 57 + 21;
        const px = -60 + k.hash(seed) * 190 + dg * 40;
        const py = 20 - dg * 40 + (k.hash(seed + 1) - 0.5) * 60;
        ctx.fillStyle = k.rgba('dim', 0.55 * (1 - dg));
        ctx.beginPath(); ctx.arc(px, py, 10 + dg * 30 + k.hash(seed + 2) * 8, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
