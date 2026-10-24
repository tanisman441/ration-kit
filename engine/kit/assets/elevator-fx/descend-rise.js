// elevator-fx/descend-rise — asansör kabini kuyuda; `level` (0-1) kabinin katını belirler.
// ANIMASYON: kabin `level` konumunda durur; yan kat işaretleri kabin geçerken yanar,
// kabin hafif nefes alır (±2 units, ~2.4 sn), kablolar kabinle birlikte uzar/kısalır.
// Tek vurgu: aktif kat işareti (cyan). Contract: engine/kit/ASSETS.md
export default {
  name: 'descend-rise',
  category: 'elevator-fx',
  desc: 'Asansör kabini kuyuda; level kabinin katını belirler, kat işareti yanar',
  tags: ['asansör', 'kabin', 'kuyu', 'kat', 'iniş', 'çıkış', 'bina', 'elevator', 'cabin', 'shaft', 'floor', 'descend', 'rise'],
  box: [-120, -150, 120, 150],
  bleed: 24,
  anchor: 'kuyu merkezi (0,0)',
  points: { cabin: [0, 0], top: [0, -150], bottom: [0, 150] },
  params: {
    level: { type: 'number', default: 0.5, desc: 'kabin konumu (0 en alt kat, 1 en üst kat)' },
    floors: { type: 'number', default: 4, desc: 'kat işareti sayısı (2-6)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const lv = k.clamp(p.level ?? 0.5, 0, 1);
    const nF = Math.round(k.clamp(p.floors ?? 4, 2, 6));
    // kabin merkezi: level 0 → alt (y=+92), level 1 → üst (y=-92)
    const cabY = k.lerp(92, -92, lv) + Math.sin(t * 2.6) * 2;
    // aktif kat (kabine en yakın işaret)
    const active = Math.round(lv * (nF - 1));

    const plate = (x, y, w, h, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w, h, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // --- kuyu duvarları ---
    plate(-104, -140, 208, 280, 12, k.rgba('dim'));
    // iç boşluk
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); k.rrect(-84, -128, 168, 256, 6); ctx.fill();

    // --- kat işaretleri (sağ iç duvar) ---
    for (let i = 0; i < nF; i++) {
      const fy = k.lerp(104, -104, i / (nF - 1));
      const on = i === active;
      const pulse = on ? 0.8 + 0.2 * Math.sin(t * 3.2) : 0.25;
      if (on) k.glow(62, fy, 12, 'cyan', 0.4 * pulse);
      ctx.fillStyle = k.rgba('cyan', pulse);
      ctx.beginPath(); ctx.arc(62, fy, 7, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(48, fy); ctx.lineTo(56, fy); ctx.stroke();
    }

    // --- kablolar (kabin üstünden tavana) ---
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-24, -128); ctx.lineTo(-24, cabY - 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(24, -128); ctx.lineTo(24, cabY - 34); ctx.stroke();

    // --- kabin ---
    ctx.save();
    ctx.translate(0, cabY);
    plate(-52, -34, 104, 68, 10, k.rgba('panel2'));
    // parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-32, -24, 14, 7, -0.3, 0, k.TAU); ctx.fill();
    // kapı orta çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.4); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(0, 28); ctx.stroke();
    // kabin penceresi (üstte ince şerit)
    ctx.fillStyle = k.rgba('cyan', 0.35);
    ctx.beginPath(); k.rrect(-40, -26, 80, 8, 4); ctx.fill();
    ctx.restore();

    // --- alt tampon (zemin) ---
    ctx.fillStyle = k.rgba('ink', 0.5);
    ctx.beginPath(); k.rrect(-84, 128, 168, 10, 5); ctx.fill();
    ctx.restore();
  },
};
