// spell-casting/frost-nova — buz dalgası patlaması: merkezden genişleyen
// halka + 8 uçuşan buz kristali. Idle: kristaller parıldar, halka hafif nefes
// alır. `at` anında: 0.12 sn beyaz flaş, halka 10→125 birime 0.5 sn'de
// genişler, kristaller dışa fırlayıp söner.
// NOT: canvas y-aşağıdır; (0,0) patlama merkezidir.
export default {
  name: 'frost-nova', category: 'spell-casting',
  desc: 'Buz dalgası patlaması; at anında genişleyen halka + uçuşan kristaller, idle\'da buz parıltısı',
  tags: ['buz', 'don', 'kar', 'dalga', 'patlama', 'büyü', 'frost', 'ice', 'nova', 'freeze'],
  box: [-135, -135, 135, 135],
  bleed: 45,
  anchor: 'patlama merkezi (0,0)',
  points: { centre: [0, 0], edge: [120, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'buz dalgası patlama anı (halka genişlemesi 0.5 sn)' },
    color: { type: 'color', default: 'cyan', desc: 'buz rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const d = p.at == null ? -1 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const boom = d >= 0 && d < 0.5;
    const flash = d >= 0 && d < 0.12 ? 1 - d / 0.12 : 0;

    // Halka yarıçapı: patlamada 10→125 (0.5 sn), idle'da 95'te nefes alır
    const ringR = boom ? 10 + (1 - Math.pow(1 - d / 0.5, 3)) * 115 : 95 + Math.sin(t * k.TAU / 2.4) * 4;
    const ringA = boom ? (1 - d / 0.5) * 0.9 + 0.1 : 0.45;

    // Buz zemin halesi: merkezde yumuşak cyan parıltı
    k.glow(0, 0, boom ? 140 : 90, acc, 0.25 + flash * 0.35);

    // Genişleyen halka
    ctx.strokeStyle = k.rgba(acc, ringA);
    ctx.lineWidth = boom ? 10 - d / 0.5 * 6 : 6;
    ctx.beginPath(); ctx.arc(0, 0, ringR, 0, k.TAU); ctx.stroke();
    // İkinci iç halka (patlamada belirir, gecikmeli)
    if (d >= 0.08 && d < 0.55) {
      const pr2 = (d - 0.08) / 0.47;
      const r2 = 8 + (1 - Math.pow(1 - pr2, 3)) * 95;
      ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - pr2) * 0.8).toFixed(3) + ')';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, r2, 0, k.TAU); ctx.stroke();
    }
    if (flash > 0) { // flaş: beyaz dolu daire
      ctx.fillStyle = 'rgba(255,255,255,' + (0.85 * flash).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(0, 0, 60 * (1 - flash * 0.4), 0, k.TAU); ctx.fill();
    }

    // 8 buz kristali: patlamada dışa fırlar, idle'da halka üstünde parıldar
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * k.TAU + (boom ? 0 : k.noise1(i * 13.7 + t * 2) * 0.15);
      const h1 = k.hash(i * 29.3), h2 = k.hash(i * 71.1 + 3);
      let cx, cy, size, alpha;
      if (boom) {
        const dist = 20 + (1 - Math.pow(1 - d / 0.5, 3)) * (60 + h1 * 60);
        cx = Math.cos(a) * dist; cy = Math.sin(a) * dist;
        size = (0.7 + h2 * 0.6) * (1 - d / 0.5 * 0.5);
        alpha = 0.95 * (1 - d / 0.5 * 0.7);
      } else {
        const shimmer = 0.6 + 0.4 * Math.abs(Math.sin(t * 3 + i * 1.3));
        cx = Math.cos(a) * ringR; cy = Math.sin(a) * ringR;
        size = 0.55 + h2 * 0.35; alpha = shimmer;
      }
      // Kristal: uzun altıgen (elmas iğne)
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(a + Math.PI / 2);
      const L = 26 * size, W = 9 * size;
      // gölge: %12 koyultma, sağ alta
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.moveTo(3, -L / 2 + 6); ctx.lineTo(3 + W, 6); ctx.lineTo(3, L / 2 + 6); ctx.lineTo(3 - W, 6);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(acc, alpha);
      ctx.beginPath();
      ctx.moveTo(0, -L / 2); ctx.lineTo(W, 0); ctx.lineTo(0, L / 2); ctx.lineTo(-W, 0);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3; ctx.stroke();
      // premium parlama: sol üst beyaz çizgi
      ctx.strokeStyle = 'rgba(255,255,255,0.10)';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(-W * 0.55, -L * 0.22); ctx.lineTo(-W * 0.1, -L * 0.42); ctx.stroke();
      ctx.restore();
    }

    // Merkez çekirdek: buz tohumu (idle'da nabız atar)
    const coreR = 22 + Math.sin(t * k.TAU / 1.8) * 2.5 + (boom ? flash * 20 : 0);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(6, 6, coreR, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(acc, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath(); ctx.arc(0, 0, coreR * 0.45, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-coreR * 0.3, -coreR * 0.38, coreR * 0.38, coreR * 0.2, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
