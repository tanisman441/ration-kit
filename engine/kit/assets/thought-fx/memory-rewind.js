// thought-fx/memory-rewind — anı kartı; at anında sarsılır, iç sahne geri sarar gibi kayar, geri-sar okları + dönen yay belirir.
// NOT: canvas y-aşağıdır; (0,0) kart merkezi.
export default {
  name: 'memory-rewind', category: 'thought-fx',
  desc: 'Memory card whose inner scene scrolls backward with rewind arrows on the at moment',
  tags: ['anı', 'kart', 'geri sarma', 'hafıza', 'memory', 'rewind', 'card', 'nostalji', 'tape', 'flashback'],
  box: [-122, -116, 122, 96],
  bleed: 35,
  anchor: 'kart merkezi (0,0)',
  points: { card: [0, 52], picture: [0, -22], top: [0, -72] },
  params: {
    color: { type: 'color', default: 'panel2', desc: 'kart rengi' },
    at: { type: 'time', default: null, desc: 'geri sarma anı: sarsıntı + sahne kayması + oklar (1.2 sn)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;
    const active = d >= 0 && d < 1.2;
    const e = active ? k.clamp(d / 1.2, 0, 1) : 0;
    const shake = active ? k.noise1(d * 40) * 5 : 0;             // sarsıntı
    const floatY = Math.sin(t * k.TAU / 2.4) * 2;               // canlı idle: hafif süzülme
    ctx.translate(shake, floatY);
    if (active) ctx.rotate(k.noise1(d * 30 + 9) * 0.05);

    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), sh = k.rgba('ink', 0.10);
    const accent = k.rgba('yellow');
    // kart
    ctx.fillStyle = sh; ctx.beginPath(); k.rrect(-88, -62, 190, 140, 14); ctx.fill();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-100, -76, 190, 140, 16); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(-95, -70, 190, 140, 14); ctx.fill();
    // premium parlama (sol üst kartta, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-58, -52, 26, 10, -0.3, 0, k.TAU); ctx.fill();
    // resim alanı (kırpılır)
    ctx.save();
    ctx.beginPath(); k.rrect(-79, -54, 158, 92, 10); ctx.clip();
    const shift = active ? -e * 110 : 0;                        // geri sarma: sahne sola kayar
    const scene = ox => {
      ctx.fillStyle = k.rgba('dim', 0.30);
      ctx.fillRect(-79 + ox, -54, 158, 92);
      ctx.fillStyle = accent;                                    // güneş (tek vurgu)
      ctx.beginPath(); ctx.arc(30 + ox, -26, 16, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.45);                       // tepeler
      ctx.beginPath(); ctx.ellipse(-30 + ox, 52, 52, 26, 0, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(60 + ox, 56, 58, 30, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 4;   // küçük figür
      ctx.beginPath(); ctx.arc(4 + ox, -2, 6, 0, k.TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4 + ox, 4); ctx.lineTo(4 + ox, 20); ctx.stroke();
    };
    scene(shift);
    scene(shift + 158);                                         // kayarken boşluk kalmasın
    if (active) {                                                // hız çizgileri
      ctx.strokeStyle = k.rgba('ink', 0.3 * (1 - e)); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const yy = -40 + i * 26 + k.hash(i + 41) * 10;
        ctx.beginPath(); ctx.moveTo(-79, yy); ctx.lineTo(-79 + 40 * (1 - e) + 10, yy); ctx.stroke();
      }
    }
    ctx.restore();
    // alt yazı çubuğu
    ctx.fillStyle = k.rgba('ink', 0.25);
    ctx.beginPath(); k.rrect(-79, 46, 100, 9, 4); ctx.fill();
    ctx.beginPath(); k.rrect(-79, 60, 62, 7, 3); ctx.fill();
    // geri-sar okları (sol üst) + dönen yay (sağ üst)
    if (active) {
      const al = e < 0.12 ? e / 0.12 : 1 - k.clamp((e - 0.7) / 0.3, 0, 1);
      const chev = (cx, cy) => {
        ctx.strokeStyle = k.rgba('yellow', 0.9 * al); ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(cx + 8, cy - 12); ctx.lineTo(cx - 6, cy); ctx.lineTo(cx + 8, cy + 12);
        ctx.stroke();
      };
      chev(-92, -92); chev(-70, -92);
      const a0 = -d * 11;
      ctx.strokeStyle = k.rgba('yellow', 0.9 * al); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.arc(78, -92, 18, a0, a0 + 4.4); ctx.stroke();
      ctx.fillStyle = k.rgba('yellow', 0.9 * al);                // yay ucu oku
      const tx = 78 + Math.cos(a0 + 4.4) * 18, ty = -92 + Math.sin(a0 + 4.4) * 18;
      const ta = a0 + 4.4 + Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(tx + Math.cos(ta) * 11, ty + Math.sin(ta) * 11);
      ctx.lineTo(tx + Math.cos(ta + 2.6) * 9, ty + Math.sin(ta + 2.6) * 9);
      ctx.lineTo(tx + Math.cos(ta - 2.6) * 9, ty + Math.sin(ta - 2.6) * 9);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  },
};
