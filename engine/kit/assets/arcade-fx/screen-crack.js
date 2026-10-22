// arcade-fx/screen-crack — arcade monitörü: at anında (0.6 sn) çarpma noktasından
// 5 çatlak büyür, kıvılcım saçar, flaş olur. Boşta ekranda oyun pikselleri ve
// ~3 sn'de bir geçen tarama çizgisi vardır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) ekran merkezidir.
export default {
  name: 'screen-crack', category: 'arcade-fx',
  desc: 'Çarpma anında çatlayan arcade monitörü; çatlaklar büyür, kıvılcım saçar',
  tags: ['çatlak', 'kırık ekran', 'monitör', 'hasar', 'arcade', 'crack', 'broken screen', 'damage', 'monitor', 'shatter'],
  box: [-170, -130, 170, 150],
  bleed: 30,
  anchor: 'ekran merkezi (0,0)',
  points: { screen: [0, 0], impact: [45, -25] },
  params: {
    at: { type: 'time', default: null, desc: 'çatlama anı (0.6 sn büyüme + kıvılcım)' },
    color: { type: 'color', default: 'cyan', desc: 'ekran oyun pikseli rengi' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? 1e9 : t - p.at;
    const IX = 45, IY = -25;                       // çarpma noktası
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // monitör çerçevesi + ekran yüzeyi
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-163, -121, 326, 242, 16); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-160, -118, 320, 236, 14); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(-144, -102, 288, 204, 8); ctx.fill();

    // ekran içeriği: mini oyun pikselleri
    ctx.fillStyle = k.rgba(p.color, 0.5);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 8; c++) {
      const blink = (r === 1 && c === 3) ? (k.hash(Math.floor(t * 2)) > 0.4 ? 0.5 : 0.15) : 0.5;
      ctx.fillStyle = k.rgba(p.color, blink);
      ctx.fillRect(-120 + c * 30, -80 + r * 22, 16, 14);
    }
    ctx.fillStyle = k.rgba(p.color, 0.35);
    ctx.fillRect(-120, 60, 240, 8);                // zemin çizgisi
    const px = -100 + ((t * 40) % 200);            // gezgin piksel
    ctx.fillStyle = k.rgba('yellow', 0.7);
    ctx.fillRect(px, 38, 14, 14);

    // tarama çizgisi (~3 sn'de bir)
    const sy = -102 + ((t % 3) / 3) * 204;
    ctx.fillStyle = k.rgba('ink', 0.08);
    ctx.fillRect(-144, sy, 288, 6);

    // === OLAY: çatlaklar büyür ===
    const cracks = [
      [[0, 0], [30, -40], [55, -55], [90, -62]],
      [[0, 0], [-35, -25], [-70, -20], [-105, -32]],
      [[0, 0], [10, 45], [25, 80], [18, 115]],
      [[0, 0], [-20, 40], [-15, 75], [-32, 105]],
      [[0, 0], [45, 15], [80, 32]],
    ];
    if (d >= 0) {
      // çarpma flaşı
      if (d < 0.35) {
        const q = d / 0.35;
        k.glow(IX, IY, 60 * (1 - q) + 15, 'yellow', (1 - q) * 0.5);
        ctx.strokeStyle = `rgba(255,255,255,${(1 - q) * 0.8})`; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(IX, IY, 8 + q * 40, 0, k.TAU); ctx.stroke();
      }
      // kıvılcımlar (0-0.7 sn)
      if (d < 0.7) {
        const q = k.E.outCubic(d / 0.7);
        for (let i = 0; i < 10; i++) {
          const ang = k.hash(i * 2.3 + 1.1) * k.TAU;
          const dist = (20 + k.hash(i * 5.1) * 70) * q;
          const sz = (1 - d / 0.7) * 8;
          ctx.save();
          ctx.translate(IX + Math.cos(ang) * dist, IY + Math.sin(ang) * dist);
          ctx.rotate(ang);
          ctx.fillStyle = i % 2 ? `rgba(255,255,255,${1 - d / 0.7})` : k.rgba('yellow', 1 - d / 0.7);
          ctx.fillRect(-sz / 2, -sz / 2, sz, sz * 0.6);
          ctx.restore();
        }
      }
      // çatlak çizgileri: her çatlak i*0.06 gecikmeyle, parça parça belirir
      const grow = Math.min(1, d / 0.6);
      cracks.forEach((pts, ci) => {
        for (let j = 0; j < pts.length - 1; j++) {
          const segT = ci * 0.06 + j * 0.09;
          if (grow * 0.6 < segT) continue;
          const x0 = IX + pts[j][0], y0 = IY + pts[j][1];
          const x1 = IX + pts[j + 1][0], y1 = IY + pts[j + 1][1];
          ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = j === 0 ? 5 : 3.5;
          ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(x0 + 2, y0 - 2); ctx.lineTo(x1 + 2, y1 - 2); ctx.stroke();
        }
      });
      // çarpma çukuru
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(IX, IY, 7, 0, k.TAU); ctx.fill();
    }

    // ayak
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-16, 118, 32, 14, 4); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, 140, 70, 12, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-24, 137, 20, 4, -0.2, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
