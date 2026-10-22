// camping-fx/tent-pitch — çadır kurma sahnesi: at anında dürülü çadır açılır, direkler kalkar, gergi ipleri kazıklara bağlanır.
// NOT: canvas y-aşağıdır; (0,0) çadır tabanı merkezidir.
export default {
  name: 'tent-pitch',
  category: 'camping-fx',
  desc: 'Çadır kurma sahnesi: at anında dürülü çadır 1.15 sn’de açılıp gerilir, bayrağı dalgalanır',
  tags: ['çadır', 'kamp', 'kurma', 'kamp alanı', 'doğa', 'tent', 'camping', 'pitch', 'outdoors', 'setup'],
  box: [-130, -125, 130, 45],
  bleed: 25,
  anchor: 'çadır tabanı merkezi (0,0)',
  points: { apex: [0, -95], pegL: [-115, 0], pegR: [115, 0] },
  params: {
    at: { type: 'time', default: null, desc: 'kurma anı (1.15 sn: direkler kalkar, kumaş açılır, ipler gerilir)' },
    color: { type: 'color', default: 'green', desc: 'çadır kumaş tonu' },
    size: { type: 'number', default: 1, desc: '0.5–1.5: sahne büyüklüğü' },
  },
  draw(ctx, t, p, k) {
    const S = k.clamp(p.size, 0.5, 1.5);
    const d = p.at == null ? -1 : t - p.at;
    const pitched = d < 0 ? p.at == null : d > 1.15;
    const fc = p.color;
    ctx.save();

    if (pitched) {
      // ===== KURULU ÇADIR =====
      // gergi ipleri + kazıklar (serbest çizgiler: ink)
      for (let i = 0; i < 2; i++) {
        const sgn = i === 0 ? -1 : 1;
        const px = sgn * 115 * S;
        ctx.strokeStyle = k.rgba('ink', 0.65); ctx.lineWidth = 3.5 * S; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sgn * 10 * S, -78 * S); ctx.lineTo(px, -4 * S); ctx.stroke();
        ctx.fillStyle = k.rgba('dim', 1);
        ctx.beginPath();
        ctx.moveTo(px - 6 * S, 0); ctx.lineTo(px + 6 * S, 0); ctx.lineTo(px, -14 * S);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3 * S;
        ctx.beginPath();
        ctx.moveTo(px - 6 * S, 0); ctx.lineTo(px + 6 * S, 0); ctx.lineTo(px, -14 * S);
        ctx.closePath(); ctx.stroke();
      }

      const breathe = 1.5 * S * Math.sin(t * 2.0);
      const ay = -95 * S + breathe;
      // ana üçgen
      ctx.fillStyle = k.rgba('dim', 0.12);
      ctx.beginPath();
      ctx.moveTo(-85 * S + 5 * S, 0 + 6 * S); ctx.lineTo(85 * S + 5 * S, 0 + 6 * S); ctx.lineTo(0 + 5 * S, ay + 6 * S);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba(fc, 1);
      ctx.beginPath();
      ctx.moveTo(-85 * S, 0); ctx.lineTo(85 * S, 0); ctx.lineTo(0, ay);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5 * S; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(-85 * S, 0); ctx.lineTo(85 * S, 0); ctx.lineTo(0, ay);
      ctx.closePath(); ctx.stroke();
      // sağ panel gölge tonu + sol üst parlama
      ctx.fillStyle = k.rgba(fc, 0.22);
      ctx.beginPath();
      ctx.moveTo(0, ay); ctx.lineTo(85 * S, 0); ctx.lineTo(0, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(-30 * S, ay * 0.72, 20 * S, 10 * S, -0.5, 0, k.TAU); ctx.fill();
      // kapı: karanlık açıklık + dürülmüş kanat
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath();
      ctx.moveTo(-20 * S, 0); ctx.lineTo(20 * S, 0); ctx.lineTo(0, -46 * S);
      ctx.closePath(); ctx.fill();
      const flapSway = 2.5 * S * Math.sin(t * 2.6);
      ctx.fillStyle = k.rgba(fc, 1);
      ctx.beginPath(); ctx.arc(26 * S + flapSway, -8 * S, 8 * S, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3 * S;
      ctx.beginPath(); ctx.arc(26 * S + flapSway, -8 * S, 8 * S, 0, k.TAU); ctx.stroke();
      // tepe bayrağı: dalgalanır
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 3 * S; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(0, ay - 20 * S); ctx.stroke();
      const flut = 0.22 * Math.sin(t * 6);
      ctx.save();
      ctx.translate(0, ay - 14 * S); ctx.rotate(flut);
      ctx.fillStyle = k.rgba('red', 1);
      ctx.beginPath();
      ctx.moveTo(0, -6 * S); ctx.lineTo(28 * S, 0); ctx.lineTo(0, 6 * S);
      ctx.closePath(); ctx.fill();
      ctx.restore();
    } else if (d < 0) {
      // ===== DÜRÜLÜ ÇADIR (kurmadan önce) =====
      ctx.fillStyle = k.rgba('dim', 0.12);
      ctx.beginPath(); k.rrect(-46 * S + 5 * S, 8 * S + 6 * S, 92 * S, 24 * S, 12 * S); ctx.fill();
      ctx.fillStyle = k.rgba(fc, 1);
      ctx.beginPath(); k.rrect(-46 * S, 8 * S, 92 * S, 24 * S, 12 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5 * S;
      ctx.beginPath(); k.rrect(-46 * S, 8 * S, 92 * S, 24 * S, 12 * S); ctx.stroke();
      ctx.fillStyle = k.rgba('bg', 0.10);
      ctx.beginPath(); ctx.ellipse(-28 * S, 14 * S, 16 * S, 5 * S, -0.3, 0, k.TAU); ctx.fill();
      // kayışlar
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3.5 * S;
      for (const bx of [-22 * S, 22 * S]) {
        ctx.beginPath(); ctx.moveTo(bx, 8 * S); ctx.lineTo(bx, 32 * S); ctx.stroke();
      }
      // yerde direkler
      ctx.fillStyle = k.rgba('dim', 1);
      ctx.beginPath(); k.rrect(-52 * S, 38 * S, 104 * S, 7 * S, 3.5 * S); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3 * S;
      ctx.beginPath(); k.rrect(-52 * S, 38 * S, 104 * S, 7 * S, 3.5 * S); ctx.stroke();
    } else {
      // ===== KURMA ANİMASYONU (1.15 sn) =====
      // dürülü çadır solar
      const rollA = 1 - k.prog(d, 0, 0.25);
      if (rollA > 0.01) {
        ctx.fillStyle = k.rgba(fc, rollA);
        ctx.beginPath(); k.rrect(-46 * S, 8 * S, 92 * S, 24 * S, 12 * S); ctx.fill();
      }
      // direkler kalkar (0–0.30 sn)
      const qP = k.E.outCubic(k.prog(d, 0, 0.30));
      ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5 * S; ctx.lineCap = 'round';
      for (let i = 0; i < 2; i++) {
        const sgn = i === 0 ? -1 : 1;
        const tipX = k.lerp(sgn * 85 * S, 0, qP);
        const tipY = k.lerp(0, -95 * S, qP);
        ctx.beginPath(); ctx.moveTo(sgn * 85 * S, 0); ctx.lineTo(tipX, tipY); ctx.stroke();
      }
      // kumaş açılır (0.22–0.80 sn)
      const qF = k.prog(d, 0.22, 0.80);
      if (qF > 0.01) {
        const ay = k.lerp(0, -95 * S, k.E.outBack(qF, 1.5));
        ctx.fillStyle = k.rgba(fc, qF);
        ctx.beginPath();
        ctx.moveTo(-85 * S, 0); ctx.lineTo(85 * S, 0); ctx.lineTo(0, ay);
        ctx.closePath(); ctx.fill();
        if (qF > 0.7) {
          ctx.fillStyle = k.rgba('dim', 0.95 * k.prog(qF, 0.7, 1));
          ctx.beginPath();
          ctx.moveTo(-20 * S, 0); ctx.lineTo(20 * S, 0); ctx.lineTo(0, -46 * S);
          ctx.closePath(); ctx.fill();
        }
      }
      // gergi ipleri gerilir (0.62–1.05 sn)
      const qG = k.prog(d, 0.62, 1.05);
      if (qG > 0.01) {
        for (let i = 0; i < 2; i++) {
          const sgn = i === 0 ? -1 : 1;
          const ex = k.lerp(sgn * 10 * S, sgn * 115 * S, k.E.outCubic(qG));
          const ey2 = k.lerp(-78 * S, -4 * S, k.E.outCubic(qG));
          ctx.strokeStyle = k.rgba('ink', 0.65 * qG); ctx.lineWidth = 3.5 * S; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(sgn * 10 * S, -78 * S); ctx.lineTo(ex, ey2); ctx.stroke();
          const pegS = k.E.outBack(qG, 1.6);
          if (pegS > 0.05) {
            const px = sgn * 115 * S;
            ctx.save(); ctx.translate(px, 0); ctx.scale(pegS, pegS);
            ctx.fillStyle = k.rgba('dim', 1);
            ctx.beginPath();
            ctx.moveTo(-6 * S, 0); ctx.lineTo(6 * S, 0); ctx.lineTo(0, -14 * S);
            ctx.closePath(); ctx.fill();
            ctx.restore();
          }
        }
      }
      // bayrak belirir (0.90–1.15 sn)
      const qFl = k.prog(d, 0.90, 1.15);
      if (qFl > 0.01) {
        ctx.strokeStyle = k.rgba('ink', 0.8 * qFl); ctx.lineWidth = 3 * S;
        ctx.beginPath(); ctx.moveTo(0, -95 * S); ctx.lineTo(0, -95 * S - 20 * S * qFl); ctx.stroke();
        ctx.fillStyle = k.rgba('red', qFl);
        ctx.beginPath();
        ctx.moveTo(0, -95 * S - 20 * S * qFl + 6 * S); ctx.lineTo(28 * S * qFl, -95 * S - 14 * S * qFl); ctx.lineTo(0, -95 * S - 8 * S * qFl);
        ctx.closePath(); ctx.fill();
      }
    }

    ctx.restore();
  },
};
