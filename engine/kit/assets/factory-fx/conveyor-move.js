// factory-fx/conveyor-move — hareket eden konveyör bandı.
// ANIMASYON: bant yüzeyi sürekli akar (şevron çizgiler), iki makara döner,
// paket bant üstünde döngüyle taşınır. Tek vurgu: color (varsayılan yellow).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'conveyor-move',
  category: 'factory-fx',
  desc: 'Hareket eden konveyör bandı; şerit sürekli akar, makaralar döner, paket taşınır',
  tags: ['konveyör', 'bant', 'fabrika', 'üretim', 'taşıyıcı', 'makara', 'paket', 'conveyor', 'belt', 'factory', 'roller', 'package'],
  box: [-135, -70, 135, 100],
  bleed: 25,
  anchor: 'bant yüzeyi (0,-24)',
  points: { belt: [0, -24], in_left: [-120, -24], out_right: [120, -24] },
  params: {
    color: { type: 'color', default: 'yellow' },
    speed: { type: 'number', default: 1, desc: 'bant hız çarpanı (0 = durur)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const sp = p.speed;
    const mv = t * sp;

    // --- ayaklar: gölge, gövde, parlama, kontur ---
    for (const lx of [-92, 92]) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(lx - 7 + 6, 38 + 6, 14, 54, 6); ctx.fill();
      ctx.fillStyle = k.rgba('dim');
      ctx.beginPath(); k.rrect(lx - 7, 38, 14, 54, 6); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); k.rrect(lx - 7, 38, 14, 54, 6); ctx.stroke();
    }
    // motor (sol ayakta, vurgu rengi)
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(-92 + 4, 62 + 4, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); ctx.arc(-92, 62, 13, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.12);
    ctx.beginPath(); ctx.ellipse(-97, 57, 4, 6, 0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(-92, 62, 13, 0, k.TAU); ctx.stroke();

    // --- gövde çerçeve ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-122 + 6, -6 + 6, 244, 44, 14); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-122, -6, 244, 44, 14); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-80, 2, 26, 8, -0.1, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-122, -6, 244, 44, 14); ctx.stroke();

    // --- bant yüzeyi: akan şevron çizgiler ---
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-118, -24, 236, 18, 6); ctx.fill();
    ctx.lineCap = 'round';
    const off = (mv * 70) % 44;
    ctx.strokeStyle = k.rgba(p.color, 0.9);
    ctx.lineWidth = 5;
    for (let i = 0; i < 7; i++) {
      const x = -118 + i * 44 - off;
      if (x < -122 || x > 126) continue;
      ctx.beginPath();
      ctx.moveTo(x - 10, -21); ctx.lineTo(x + 4, -15);
      ctx.lineTo(x - 10, -9);
      ctx.stroke();
    }

    // --- makaralar: dönen kollar ---
    for (const rx of [-100, 100]) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); ctx.arc(rx + 3, 16 + 3, 16, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink');
      ctx.beginPath(); ctx.arc(rx, 16, 16, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(rx, 16, 16, 0, k.TAU); ctx.stroke();
      const ra = mv * 3.2;
      ctx.strokeStyle = k.rgba('panel2', 0.9); ctx.lineWidth = 4;
      for (let s = 0; s < 3; s++) {
        const sa = ra + s * k.TAU / 3;
        ctx.beginPath();
        ctx.moveTo(rx + Math.cos(sa) * 4, 16 + Math.sin(sa) * 4);
        ctx.lineTo(rx + Math.cos(sa) * 12, 16 + Math.sin(sa) * 12);
        ctx.stroke();
      }
    }

    // --- taşınan paket (bant üstünde döngü) ---
    const px = -124 + ((mv * 70) % 248);
    if (px > -140 && px < 140) {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(px - 22 + 5, -56 + 5, 44, 32, 6); ctx.fill();
      ctx.fillStyle = k.rgba('panel');
      ctx.beginPath(); k.rrect(px - 22, -56, 44, 32, 6); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(px - 10, -49, 8, 5, 0.3, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba(p.color, 0.85); ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(px, -56); ctx.lineTo(px, -24);
      ctx.moveTo(px - 22, -40); ctx.lineTo(px + 22, -40);
      ctx.stroke();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); k.rrect(px - 22, -56, 44, 32, 6); ctx.stroke();
    }

    ctx.restore();
  },
};
