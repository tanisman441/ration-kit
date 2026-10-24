// art-fx/gallery-spotlight — spot ışıklı tablo: üstteki lamba konik ışık
// saçar; on 0-1 ışığı açar, ışık sürekli hafifçe salınır, toz zerrecikleri uçar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = çerçeve merkezi.
export default {
  name: 'gallery-spotlight', category: 'art-fx',
  desc: 'Spot ışığıyla aydınlanan çerçeveli tablo; ışık açılır ve hafifçe salınır',
  tags: ['galeri', 'spot', 'tablo', 'sergi', 'ışık', 'müze', 'sanat', 'gallery', 'spotlight', 'painting', 'frame', 'exhibition', 'museum'],
  box: [-170, -196, 170, 130],
  bleed: 10,
  anchor: 'çerçeve merkezi (0,0)',
  points: { frame_top: [0, -82], picture: [0, 0], lamp: [0, -188] },
  params: {
    on: { type: 'number', default: 1, desc: 'ışık seviyesi (0-1: açılış + salınım genliği)' },
  },
  draw(ctx, t, p, k) {
    const LW = 9;
    const line = k.rgba('bg', 0.55);
    const on = Math.max(0, Math.min(1, p.on));
    const sway = Math.sin(t * 1.2) * 0.07 * on; // ışık salınımı (canlı idle)

    ctx.save();
    ctx.beginPath(); ctx.rect(-175, -201, 350, 336); ctx.clip();

    // lamba armatürü
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-24 - LW / 2, -196 - LW / 2, 48 + LW, 30 + LW, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); k.rrect(-24, -196, 48, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.15 + 0.85 * on);
    ctx.beginPath(); k.rrect(-14, -174, 28, 10, 5); ctx.fill();
    if (on > 0.02) k.glow(0, -166, 30, 'yellow', 0.35 * on);

    // ışık konisi (lambadan tabloya)
    if (on > 0.02) {
      ctx.save();
      ctx.translate(0, -166);
      ctx.rotate(sway);
      ctx.fillStyle = k.rgba('yellow', 0.10 * on);
      ctx.beginPath();
      ctx.moveTo(-12, 0); ctx.lineTo(12, 0); ctx.lineTo(108, 252); ctx.lineTo(-108, 252);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = k.rgba('yellow', 0.08 * on);
      ctx.beginPath();
      ctx.moveTo(-6, 0); ctx.lineTo(6, 0); ctx.lineTo(58, 252); ctx.lineTo(-58, 252);
      ctx.closePath(); ctx.fill();
      // toz zerrecikleri: koni içinde süzülür
      for (let i = 0; i < 6; i++) {
        const mx = (k.hash(i * 5 + 1) - 0.5) * 150;
        const my = ((t * 14 + k.hash(i * 7 + 2) * 240) % 240) + 8;
        const spread = 12 + (my / 252) * 90;
        ctx.fillStyle = k.rgba('yellow', 0.28 * on);
        ctx.beginPath(); ctx.arc(mx * (spread / 90) * 0.6, my, 2.2, 0, k.TAU); ctx.fill();
      }
      ctx.restore();
    }

    // çerçeve
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-112 - LW / 2, -82 - LW / 2, 224 + LW, 164 + LW, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 1);
    ctx.beginPath(); k.rrect(-112, -82, 224, 164, 10); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -58, 34, 10, -0.4, 0, k.TAU); ctx.fill();
    // paspartu
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-98, -68, 196, 136, 6); ctx.fill();
    // tablo: manzara
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-98, -68, 196, 80, 6); ctx.fill();
    ctx.fillStyle = k.rgba('accent', 1);
    ctx.beginPath(); ctx.arc(45, -36, 17, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.beginPath();
    ctx.moveTo(-98, 12); ctx.lineTo(-52, -28); ctx.lineTo(-6, 12); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-24, 12); ctx.lineTo(28, -20); ctx.lineTo(98, 12); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-98, 12, 196, 56, 6); ctx.fill();
    // ışık vuruşu: tablonun üstünde sıcak parlama
    if (on > 0.02) k.glow(0, -30, 95, 'yellow', 0.20 * on);

    ctx.restore();
  },
};
