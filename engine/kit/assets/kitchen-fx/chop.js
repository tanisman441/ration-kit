// kitchen-fx/chop — doğrama tahtası + bıçak; chop anında bıçak vurur, sebze dilimleri sıçrar.
// NOT: canvas y-aşağıdır; bıçak üstten aşağı iner, tahta y≈20'de yatay durur.
export default {
  name: 'chop', category: 'kitchen-fx',
  desc: 'Doğrama tahtası üzerindeki bıçak; chop anında hızla vurup sebze dilimlerini sıçratır',
  tags: ['doğrama', 'bıçak', 'kesme', 'tahta', 'sebze', 'doğra', 'chop', 'knife', 'cutting board', 'chopping', 'vegetable'],
  box: [-160, -150, 160, 90],
  bleed: 40,
  anchor: 'tahtanın merkezi (0,20)',
  points: { blade_tip: [0, -30], board: [0, 40], slice: [70, -40], handle_top: [0, -130] },
  params: {
    chop: { type: 'time', default: null, desc: 'vuruş anı: bıçak tahtaya iner, dilimler sıçrar (0.3 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.chop == null ? -1 : t - p.chop;
    const striking = d >= 0 && d <= 0.55;

    // --- bıçak yüksekliği: idle'da havada hafif salınır; vuruşta 0.1 sn'de iner
    let knifeY;
    if (striking) {
      const g = k.prog(d, 0, 0.1);
      knifeY = -64 + 78 * k.E.outCubic(g);   // -64 (havada) -> +14 (tahtada)
      if (d > 0.1) knifeY = 14 - (14 + 64) * k.E.outCubic(k.prog(d - 0.1, 0, 0.45)); // yavaşça geri kalkar
    } else {
      knifeY = -64 + Math.sin(t * 2.2) * 6;
    }

    // --- 1) tahta + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-134, 26, 280, 42, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-140, 20, 280, 42, 12); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // tahta oluğu (iç detay)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    k.rrect(-124, 28, 248, 26, 8); ctx.stroke();
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-100, 32, 52, 8, -0.15, 0, k.TAU); ctx.fill();

    // --- 2) sebze parçaları (vuruşta ezilen + sıçrayanlar ayrı)
    const veg = [[-56, 12, 1.2], [0, 10, 2.4], [56, 12, 0.5]];
    for (let i = 0; i < veg.length; i++) {
      const [vx, vy, ph] = veg[i];
      const squash = striking && d < 0.2 ? 1 - 0.4 * Math.sin((d / 0.2) * Math.PI) : 1;
      const wob = Math.sin(t * 2.8 + ph) * 1.5;
      ctx.fillStyle = k.rgba('bg', 0.15);
      ctx.beginPath(); ctx.ellipse(vx + 5, vy + 5 + 8, 20, 13 * squash, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('green', 1);
      ctx.beginPath(); ctx.ellipse(vx + wob, vy, 20, 13 * squash, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4.5; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(vx - 7 + wob, vy - 5, 8, 4.5, -0.5, 0, k.TAU); ctx.fill();
    }

    // --- 3) bıçak (sap + ağız), knifeY ile yukarı-aşağı
    const ky = knifeY;
    // sap
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-8, ky - 118 + 6, 28, 48, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    k.rrect(-14, ky - 118, 28, 48, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // perçinler
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); ctx.arc(-2, ky - 104, 3.5, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(-2, ky - 86, 3.5, 0, k.TAU); ctx.fill();
    // ağız (aşağı bakan üçgen, yuvarlak uç)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath();
    ctx.moveTo(-8, ky - 64); ctx.lineTo(12, ky - 64); ctx.lineTo(2, ky + 6);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath();
    ctx.moveTo(-14, ky - 70); ctx.lineTo(6, ky - 70); ctx.lineTo(-4, ky);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // ağız parlama
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-9, ky - 48, 4, 14, 0.1, 0, k.TAU); ctx.fill();

    // --- 4) vuruş anı: dilim parçacıkları sıçrar (0.4 sn)
    if (striking && d <= 0.45) {
      const g = k.prog(d, 0, 0.45);
      for (let i = 0; i < 9; i++) {
        const ang = -Math.PI / 2 + (k.hash(i * 11 + 3) - 0.5) * 2.4;
        const sp = (60 + k.hash(i * 11 + 7) * 90) * k.E.outCubic(g);
        const sx = -40 + k.hash(i * 11 + 9) * 80;
        const px = sx + Math.cos(ang) * sp;
        const py = 6 + Math.sin(ang) * sp + 120 * g * g;
        const sz = 5 + k.hash(i * 13 + 2) * 6;
        ctx.fillStyle = k.rgba('green', 0.95 * (1 - g));
        ctx.save(); ctx.translate(px, py); ctx.rotate(ang + g * 4);
        k.rrect(-sz / 2, -sz / 3, sz, sz / 1.5, 4); ctx.fill();
        ctx.restore();
      }
      // vuruş flaşı
      if (d < 0.18) {
        k.glow(0, 8, 60, 'yellow', 0.4 * (1 - d / 0.18));
      }
    }
    ctx.restore();
  },
};
