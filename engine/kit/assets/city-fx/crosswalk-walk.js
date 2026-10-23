// city-fx/crosswalk-walk — yaya geçidinden karşıya geçen figür.
// ANIMASYON: `at` anında figür zebra çizgiler üzerinden 2.2 sn'de yürür (bacak/kol
// salınımı + gövde zıplaması + ayak tozu); öncesinde kaldırımda bekler (nefes).
// `mood` yüz ifadesini değiştirir (STYLE.md karakter ailesi). Tek vurgu yok (nötr).
// Contract: engine/kit/ASSETS.md
export default {
  name: 'crosswalk-walk',
  category: 'city-fx',
  desc: 'Yaya geçidi; at anında figür zebra çizgilerinden karşıya yürür',
  tags: ['yaya', 'yaya geçidi', 'zebra', 'karşıdan karşıya', 'yürümek', 'trafik', 'şehir', 'crosswalk', 'pedestrian', 'zebra crossing', 'walking', 'city'],
  box: [-165, -95, 165, 95],
  bleed: 30,
  anchor: 'yürüme ekseni (0,0); zemin y=86',
  points: { head: [0, -52] },
  params: {
    at: { type: 'time', default: null, desc: 'yürüyüşün başlama anı (2.2 sn geçiş)' },
    mood: { type: 'enum', values: ['happy', 'neutral', 'sad', 'surprised'], default: 'happy' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const walking = d >= 0;
    const LW = 5;
    const bodyC = k.rgba('dim'), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const limb = (x1, y1, x2, y2, w, c) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + LW;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.strokeStyle = c; ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    // --- zebra çizgileri ---
    for (let i = 0; i < 6; i++) {
      const sx = -152 + i * 55;
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(sx + 4, 34, 36, 54, 6); ctx.fill();
      ctx.fillStyle = k.rgba('panel2', 0.92);
      ctx.beginPath(); k.rrect(sx, 30, 36, 54, 6); ctx.fill();
      ctx.fillStyle = k.rgba('#ffffff', 0.10);
      ctx.beginPath(); ctx.ellipse(sx + 12, 38, 10, 4, -0.1, 0, k.TAU); ctx.fill();
    }
    // kaldırım kenarı
    ctx.fillStyle = k.rgba('ink', 0.4);
    ctx.beginPath(); k.rrect(-165, 88, 330, 6, 3); ctx.fill();

    // --- figür konumu ---
    const WALK = 2.2;
    const wp = walking ? k.prog(d, 0, WALK) : 0;
    const fx2 = walking ? k.lerp(-138, 138, k.E.inOutCubic(k.clamp(wp, 0, 1))) : -138;
    const stepPh = walking ? d * (2 * Math.PI) / 0.62 : 0; // adım fazı
    const swing = walking ? 0.62 : 0;
    const bob = walking ? -5 * Math.abs(Math.sin(stepPh)) : Math.sin(t * 2.4) * 1.6; // nefes

    const hipY = 26 + bob, headY = -52 + bob;
    const hx = fx2;

    // gölge
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(hx, 84, 26 - bob * 0.4, 7, 0, 0, k.TAU); ctx.fill();

    // bacaklar
    const L1 = 34, L2 = 30;
    for (const s of [-1, 1]) {
      const lw = stepPh + (s < 0 ? 0 : Math.PI);
      const a = swing * Math.sin(lw);
      const kneeX = hx + s * 5 + L1 * Math.sin(a), kneeY = hipY + L1 * Math.cos(a);
      const bend = walking ? 0.5 * Math.max(0, -Math.sin(lw + 0.8)) + 0.08 : 0.05;
      const ftX = kneeX + L2 * Math.sin(a - bend), ftY = kneeY + L2 * Math.cos(a - bend);
      limb(hx + s * 5, hipY, kneeX, kneeY, 13, bodyC);
      limb(kneeX, kneeY, ftX, ftY - 3, 11, bodyC);
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(ftX - 11, ftY - 12, 24, 12, 6); ctx.fill();
      ctx.fillStyle = bodyC;
      ctx.beginPath(); k.rrect(ftX - 9, ftY - 10, 20, 10, 5); ctx.fill();
    }
    // gövde
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(hx - 13 - LW / 2, headY + 16 - LW / 2, 26 + LW, 44 + LW, 12 + LW / 2); ctx.fill();
    ctx.fillStyle = bodyC;
    ctx.beginPath(); k.rrect(hx - 13, headY + 16, 26, 44, 12); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(hx - 7, headY + 26, 6, 12, 0.15, 0, k.TAU); ctx.fill();
    // kollar (ters salınım)
    const shY = headY + 24;
    for (const s of [-1, 1]) {
      const aw = stepPh + (s < 0 ? Math.PI : 0) + Math.PI; // bacağın tersi
      const a2 = swing * 0.8 * Math.sin(aw);
      limb(hx + s * 13, shY, hx + s * 13 + 26 * Math.sin(a2), shY + 26 * Math.cos(a2), 11, bodyC);
    }
    // kafa
    const hrx = 15, hry = 16.5;
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(hx, headY, hrx + LW / 2, hry + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = inkC;
    ctx.beginPath(); ctx.ellipse(hx, headY, hrx, hry, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(hx - 5, headY - 7, 6, 4, -0.4, 0, k.TAU); ctx.fill();
    // yüz (STYLE.md)
    const ey = headY - 2, ex = 7;
    const blink = (t % 4.1) < 0.12 ? 0.2 : 1;
    ctx.fillStyle = k.rgba('bg', 0.9); ctx.strokeStyle = k.rgba('bg', 0.9); ctx.lineWidth = 3;
    for (const s of [-1, 1]) {
      if (p.mood === 'happy') {
        ctx.beginPath(); ctx.arc(s * ex + hx, ey + 3, 4.5, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else {
        const r = p.mood === 'surprised' ? 4 : 3.2;
        ctx.beginPath(); ctx.ellipse(s * ex + hx, ey, r, r * blink, 0, 0, k.TAU); ctx.fill();
      }
    }
    if (p.mood === 'happy') { ctx.beginPath(); ctx.arc(hx, headY + 9, 7, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    else if (p.mood === 'sad') { ctx.beginPath(); ctx.arc(hx, headY + 13, 7, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (p.mood === 'surprised') { ctx.beginPath(); ctx.ellipse(hx, headY + 8, 4.5, 6, 0, 0, k.TAU); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(hx - 6, headY + 8); ctx.lineTo(hx + 6, headY + 8); ctx.stroke(); }

    // adım tozu (yürürken)
    if (walking && d < WALK) {
      const dustPh = (d / 0.62) % 1;
      if (dustPh < 0.3) {
        const g = dustPh / 0.3;
        ctx.fillStyle = k.rgba('dim', 0.4 * (1 - g));
        ctx.beginPath(); ctx.arc(hx - 14 - g * 20, 76 - g * 10, 4 + g * 6, 0, k.TAU); ctx.fill();
      }
    }
    ctx.restore();
  },
};
