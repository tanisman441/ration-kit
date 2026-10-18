// food/apple — hafif sağa eğik elma; ısırık anında ısırık izi çıkar ve parça uçar
// Contract: engine/kit/ASSETS.md. Canvas y-aşağıdır; (0,0) elmanın merkezidir.
export default {
  name: 'apple', category: 'food',
  desc: 'Hafif sağa eğik kırmızı elma; bite anında ısırık izi açılır ve bir parça uçar',
  tags: ['elma', 'meyve', 'apple', 'fruit', 'ısırık', 'bite', 'yemek'],
  box: [-75, -85, 75, 85],
  bleed: 40,
  anchor: 'elmanın merkezi (0,0)',
  points: { top: [0, -62] },
  params: {
    bite: { type: 'time', default: null, desc: 'ısırık anı (ısırık izi açılır + parça uçar)' },
    color: { type: 'color', default: 'red' },
  },
  draw(ctx, t, p, k) {
    const R = 58, LW = 5;
    const skin = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.bite == null ? -1 : t - p.bite;

    // ısırık ilerleyişi: 0→0.18 sn'de iz tam açılır
    const open = d < 0 ? 0 : Math.min(d / 0.18, 1);
    // uçan parça: 0→1.0 sn'de ısırık noktasından sağ üst yöne uçar, soluklaşır
    const fly = d < 0 ? -1 : d / 1.0;
    const flesh = 'rgba(255,246,220,0.96)'; // elma içi: iki temada da açık renk

    const sway = Math.sin(t * 1.6) * 0.05; // hafif salınım (idle)

    const bx = R * 0.62, by = -2; // ısırık noktası (siluet içinde)

    ctx.save();
    ctx.translate(0, 4);
    ctx.rotate(0.10 + sway);

    // elma gövdesi (hafif kalp formu: iki yan lob)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(7, 6, R, R * 0.94, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 0, R + LW / 2, R * 0.94 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(0, 0, R, R * 0.94, 0, 0, k.TAU); ctx.fill();

    // üst çukur + sap + yaprak
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); ctx.ellipse(0, -R * 0.94 + 6, 12, 7, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -R * 0.94 + 4); ctx.quadraticCurveTo(6, -R * 0.94 - 14, 16, -R * 0.94 - 18); ctx.stroke();
    ctx.fillStyle = k.rgba('green');
    ctx.beginPath(); ctx.ellipse(30, -R * 0.94 - 14, 17, 9, 0.35, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath(); ctx.ellipse(30, -R * 0.94 - 14, 17, 9, 0.35, 0, k.TAU); ctx.stroke();

    // ısırık izi: kenarda açılan iç et + çekirdekler (flesh renkli, siluet içinde)
    if (open > 0) {
      const br = 22 * open;
      ctx.fillStyle = flesh;
      ctx.beginPath(); ctx.arc(bx, by - 10, br * 0.8, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(bx + 10, by + 8, br * 0.85, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(bx - 9, by + 12, br * 0.65, 0, k.TAU); ctx.fill();
      // iz kenarı derinliği (ince koyu yay)
      ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(bx + 2, by + 2, br * 0.95, -0.5, 1.7); ctx.stroke();
      ctx.fillStyle = k.rgba('ink', 0.75);
      ctx.beginPath(); ctx.ellipse(bx - 3, by - 5, 3.5, 5.5, 0.4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(bx + 8, by + 9, 3.5, 5.5, -0.3, 0, k.TAU); ctx.fill();
    }

    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-21, -25, 20, 13, -0.4, 0, k.TAU); ctx.fill();

    ctx.restore();

    // uçan parça (kabuğu kırmızı, içi açık) — ısırık noktasından çıkar
    if (fly >= 0 && fly < 1) {
      const fx = bx + 10 + fly * 105, fy = by - 6 - fly * 85;
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(0.10 + fly * 2.4);
      ctx.globalAlpha = 1 - fly * fly;
      const ps = 1 + 0.3 * Math.sin(fly * Math.PI); // hafif şişme
      ctx.scale(ps, ps);
      ctx.fillStyle = skin;
      k.rrect(-15, -11, 30, 22, 9); ctx.fill();
      ctx.fillStyle = flesh;
      k.rrect(-15, 1, 30, 10, 9); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4;
      k.rrect(-15, -11, 30, 22, 9); ctx.stroke();
      ctx.restore();
    }
  },
};
