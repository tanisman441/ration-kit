// robot-fx/charge-plug — prize takılan şarj fişi ve dolan pil göstergesi. Contract: engine/kit/ASSETS.md
export default {
  name: 'charge-plug', category: 'robot-fx',
  desc: 'Prize takılan şarj fişi; takılma anında kıvılcım, üstte dolan pil göstergesi',
  tags: ['şarj', 'fiş', 'priz', 'charge', 'plug', 'socket', 'pil', 'battery', 'kıvılcım', 'spark', 'enerji'],
  box: [-175, -115, 175, 115],
  bleed: 40,
  anchor: 'priz merkezi (-75,0)',
  points: { socket: [-75, 0], cable: [150, 90] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'fişin prize takılma anı (kıvılcım + kayma)' },
    charge: { type: 'number', default: 0.6, desc: 'pil doluluk seviyesi (0-1)' },
  },
  draw(ctx, t, p, k) {
    const bw = 350, LW = Math.round(bw * 0.03);
    const line = k.rgba('bg', 0.55), bodyC = k.rgba(p.color), inkC = k.rgba('ink');
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.save();

    // fiş konumu: at null ise hafifçe salınan takılı fiş; d>=0 kayarak takılır
    const d = p.at == null ? -1 : t - p.at;
    let plugX;
    if (d < 0) plugX = p.at == null ? k.noise1(t * 0.9) * 3 : 88;
    else plugX = 88 * (1 - k.E.outCubic(k.clamp(d / 0.35, 0, 1)));
    const plugged = d >= 0.35 || p.at == null;

    // priz: duvar plakası + iki delik
    const sx = -125, sy = -55, sw = 100, sh = 110, sr = 16;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(sx + 6, sy + 6, sw, sh, sr); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(sx - LW / 2, sy - LW / 2, sw + LW, sh + LW, sr + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(sx, sy, sw, sh, sr); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sx + sw * 0.32, sy + 16, sw * 0.28, 9, -0.2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); k.rrect(sx + sw / 2 - 26, -24, 12, 48, 6); ctx.fill();
    ctx.beginPath(); k.rrect(sx + sw / 2 + 14, -24, 12, 48, 6); ctx.fill();

    // pil göstergesi: prizin üstünde dolan bar + şimşek
    const bx = sx, by = sy - 42, bw2 = sw, bh = 26;
    const lvl = k.clamp(p.charge ?? 0.6, 0, 1);
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(bx - LW / 2, by - LW / 2, bw2 + LW, bh + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('panel');
    ctx.beginPath(); k.rrect(bx, by, bw2, bh, 9); ctx.fill();
    const fillW = (bw2 - 12) * lvl;
    if (fillW > 4) {
      const pulse = plugged ? 0.75 + 0.25 * Math.sin(t * k.TAU / 0.9) : 0.7;
      ctx.fillStyle = k.rgba('yellow', pulse);
      ctx.beginPath(); k.rrect(bx + 6, by + 6, fillW, bh - 12, 6); ctx.fill();
    }
    // şimşek simgesi
    const boltA = plugged ? 0.6 + 0.4 * Math.sin(t * k.TAU / 0.9) : 0.5;
    ctx.fillStyle = k.rgba('yellow', boltA);
    ctx.beginPath();
    ctx.moveTo(bx + bw2 / 2 + 6, by - 8); ctx.lineTo(bx + bw2 / 2 - 8, by + bh / 2 + 2);
    ctx.lineTo(bx + bw2 / 2 + 1, by + bh / 2 + 2); ctx.lineTo(bx + bw2 / 2 - 5, by + bh + 10);
    ctx.lineTo(bx + bw2 / 2 + 10, by + bh / 2 - 4); ctx.lineTo(bx + bw2 / 2 + 1, by + bh / 2 - 4);
    ctx.closePath(); ctx.fill();

    // fiş: gövde + iki uç + kablo
    const baseX = -25 + plugX;               // gövde sol kenarı
    ctx.strokeStyle = inkC; ctx.lineWidth = 8;
    const sway = k.noise1(t * 1.1) * 6;
    ctx.beginPath();
    ctx.moveTo(baseX + 46, 40);
    ctx.quadraticCurveTo(baseX + 110 + sway, 52, 150, 90);
    ctx.stroke();
    const fx = baseX, fy = -26, fw = 52, fh = 52, fr = 12;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(fx + 6, fy + 6, fw, fh, fr); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(fx - LW / 2, fy - LW / 2, fw + LW, fh + LW, fr + LW / 2); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(fx, fy, fw, fh, fr); ctx.fill();
    // uçlar (priz deliklerine girer)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(fx - 44 - LW / 2, -22 - LW / 2, 44 + LW, 12 + LW, 5); ctx.fill();
    ctx.beginPath(); k.rrect(fx - 44 - LW / 2, 10 - LW / 2, 44 + LW, 12 + LW, 5); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath(); k.rrect(fx - 44, -22, 44, 12, 4); ctx.fill();
    ctx.beginPath(); k.rrect(fx - 44, 10, 44, 12, 4); ctx.fill();

    // takılma kıvılcımı: d 0.35–0.7 arası zikzak kıvılcımlar
    if (d >= 0.35 && d < 0.75) {
      const dd = (d - 0.35) / 0.4;
      k.glow(-25, -4, 26, 'yellow', 0.5 * (1 - dd));
      for (let i = 0; i < 5; i++) {
        const h1 = k.hash(i * 31 + 7), h2 = k.hash(i * 31 + 8);
        const zx = -30 - dd * (20 + h1 * 46), zy = -16 + (h2 - 0.5) * 64;
        ctx.strokeStyle = k.rgba('yellow', 0.9 * (1 - dd));
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-28, -16 + (h1 - 0.5) * 20);
        ctx.lineTo(zx + (h2 - 0.5) * 14, zy);
        ctx.lineTo(zx - (h2 - 0.5) * 10, zy + (h1 - 0.5) * 16);
        ctx.stroke();
      }
    }
    // takılıyken priz yanında minik bağlantı parıltısı
    if (plugged && (p.at != null ? d > 0.75 : true)) {
      const pa = 0.35 + 0.25 * Math.sin(t * k.TAU / 1.4);
      k.glow(-28, -4, 12, 'yellow', pa * 0.4);
    }

    ctx.restore();
  },
};
