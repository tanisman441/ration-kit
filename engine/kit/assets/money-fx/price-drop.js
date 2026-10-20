// money-fx/price-drop — düşen fiyat etiketi: at anında etiket yukarıdan
// düşer, yere inerken zıplar + şok dalgası çıkarır; kırmızı indirim oku atar.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) düşüş alanı merkezidir.
export default {
  name: 'price-drop', category: 'money-fx',
  desc: 'Düşen fiyat etiketi: at anında etiket düşer, inerken zıplar ve kırmızı indirim oku atar',
  tags: ['etiket', 'fiyat', 'indirim', 'düşüş', 'price', 'drop', 'discount', 'tag', 'sale', 'kampanya'],
  box: [-100, -170, 100, 130],
  bleed: 40,
  anchor: 'düşüş alanı merkezi (0,0) — etiket dinlenme noktası y=+46',
  points: { tag: [0, 46], drop: [0, -130] },
  params: {
    text: { type: 'text', default: '%', desc: 'etiketteki yazı' },
    at: { type: 'time', default: null, desc: 'düşüş anı (0.5 sn düşüş + zıplama)' },
  },
  draw(ctx, t, p, k) {
    const W = 120, H = 76, R = 14;
    const Y0 = -130, Y1 = 46, DUR = 0.5;
    const d = p.at == null ? 1e9 : t - p.at;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const txt = String(p.text ?? '%');

    // konum
    let y, rot;
    if (d < 0) {
      y = Y0; rot = 0.07 * Math.sin(t * 1.8);   // idle: hafif sallantı
    } else if (d < DUR) {
      const e = d / DUR;                         // düşüş (hızlanarak)
      y = Y0 + (Y1 - Y0) * e * e; rot = 0.05 * (1 - e);
    } else {
      const b = d - DUR;                         // iniş zıplaması (sönümlü)
      y = Y1 - 15 * Math.sin(b * 11) * Math.exp(-b * 5.5);
      rot = 0;
    }

    // şok dalgası (iniş anı)
    if (d >= DUR && d < DUR + 0.55) {
      const s = k.prog(d, DUR, DUR + 0.55);
      ctx.strokeStyle = k.rgba('red', 0.6 * (1 - s)); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(0, Y1 + H / 2, 30 + 85 * s, 8 + 14 * s, 0, 0, k.TAU); ctx.stroke();
      // iniş flaşı
      if (d < DUR + 0.14) {
        const f = 1 - (d - DUR) / 0.14;
        k.glow(0, Y1, 95 * f, 'red', 0.45 * f);
      }
    }

    // kırmızı indirim oku (inişten sonra atar, atımlı söner)
    if (d >= DUR) {
      const b = d - DUR;
      const popT = Math.min(b / 0.3, 1);
      const c1 = 1.9, c3 = c1 + 1;
      const s = 1 + c3 * Math.pow(popT - 1, 3) + c1 * Math.pow(popT - 1, 2); // outBack
      const pulse = 0.55 + 0.35 * Math.sin(b * 7);
      const al = popT < 1 ? 1 : Math.max(0, pulse * (1 - k.prog(b, 0.7, 2.2)));
      if (al > 0) {
        ctx.save(); ctx.translate(0, Y1 + H / 2 + 34); ctx.scale(Math.max(s, 0.01), Math.max(s, 0.01));
        ctx.strokeStyle = k.rgba('red', al); ctx.lineWidth = 9;
        ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(0, 16); ctx.stroke();
        ctx.fillStyle = k.rgba('red', al);
        ctx.beginPath(); ctx.moveTo(-17, 2); ctx.lineTo(17, 2); ctx.lineTo(0, 26); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    // etiket
    ctx.save(); ctx.translate(0, y); ctx.rotate(rot);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(6, H / 2 + 10, W / 2 * 0.92, 8, 0, 0, k.TAU); ctx.fill();
    // dış hat
    ctx.fillStyle = k.rgba('bg', 0.55);
    ctx.beginPath(); k.rrect(-W / 2 - 3.5, -H / 2 - 3.5, W + 7, H + 7, R + 4); ctx.fill();
    // gövde (indirim = kırmızı vurgu)
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); k.rrect(-W / 2, -H / 2, W, H, R); ctx.fill();
    // delik
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); ctx.arc(0, -H / 2 + 14, 8, 0, k.TAU); ctx.fill();
    // yazı
    ctx.font = `700 40px 'JetBrains Mono', system-ui, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba('panel', 0.95);
    ctx.fillText(txt, 0, 8);
    // premium parlama (sol üst şerit)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-W / 2 + 8, -H / 2 + 6, W - 16, 9, 4.5); ctx.fill();
    ctx.restore();
  },
};
