// celebration-fx/champagne-pop — şampanya patlaması: at anında mantar fırlama
// + köpük/sıvı fışkırması (0.2–0.6 sn), boşta hafif parlama salınımı.
// NOT: canvas y-aşağıdır; (0,0) şişe gövde merkezidir, ağız (0,-95)'tedir.
export default {
  name: 'champagne-pop', category: 'celebration-fx',
  desc: 'Şampanya patlaması: at anında fırlayan mantar ve fışkıran köpük; şişe her zaman görünür',
  tags: ['şampanya', 'patlama', 'mantar', 'köpük', 'kutlama', 'şişe', 'champagne', 'pop', 'cork', 'celebration', 'bottle'],
  box: [-95, -175, 95, 175],
  bleed: 45,
  anchor: 'şişe gövde merkezi (0,0)',
  points: { mouth: [0, -95], base: [0, 130] },
  params: {
    color: { type: 'color', default: 'green', desc: 'şişe rengi (tek vurgu rengi)' },
    at: { type: 'time', default: null, desc: 'patlama anı: mantar fırlar, köpük 0.2-0.6 sn fışkırır' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const d = p.at == null ? -1 : t - p.at;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // şişe gövdesi (rrect)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-42 - LW / 2, -20 - LW / 2 + 6, 84 + LW, 150 + LW, 20); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-42, -14, 84, 150, 20); ctx.fill();
    // sağ alt gölge: %12 koyultma
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(8, 60, 34, 76, 18); ctx.fill();
    // premium parlama: sol üst, alfa 0.10 (idle'da hafif salınır)
    const shimmer = 0.09 + 0.03 * Math.sin(t * 2.1);
    ctx.fillStyle = 'rgba(255,255,255,' + shimmer.toFixed(3) + ')';
    ctx.beginPath(); k.rrect(-34, -6, 14, 118, 7); ctx.fill();
    // etiket
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line;
    ctx.lineWidth = 3;
    ctx.beginPath(); k.rrect(-42, 34, 84, 44, 10); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.4);
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-30, 52); ctx.lineTo(30, 52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-30, 62); ctx.lineTo(12, 62); ctx.stroke();
    // boyun + ağız
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-17, -96, 34, 84, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = LW;
    ctx.beginPath();
    ctx.moveTo(-17, -14); ctx.lineTo(-17, -86);
    ctx.moveTo(17, -14); ctx.lineTo(17, -86);
    ctx.stroke();
    // ağız kenarı
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-22 - LW / 2, -106 - LW / 2, 44 + LW, 18 + LW, 9); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(-22, -106, 44, 18, 9); ctx.fill();

    if (d >= 0 && d < 0.7) {
      // mantar: ağızdan fırlar, dönerek yükselir (ilk 0.55 sn)
      if (d < 0.55) {
        const e = 1 - Math.pow(1 - Math.min(d / 0.4, 1), 2);
        const cy = -115 - 92 * e;
        const cx = 26 * e;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(d * 9);
        ctx.fillStyle = k.rgba('panel2');
        ctx.strokeStyle = line;
        ctx.lineWidth = 3.5;
        ctx.beginPath(); k.rrect(-11, -14, 22, 28, 7); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      // köpük fışkırması: 0.2–0.6 sn ağızdan yukarı püsküren beyaz köpük
      const jet = 1 - k.prog(d, 0.35, 0.65);
      if (jet > 0) {
        const spread = 1 + d * 1.4;
        const jetTop = -156 * Math.min(d * 4, 1) - 44;
        ctx.fillStyle = k.rgba('panel2', 0.9 * jet);
        ctx.beginPath();
        ctx.moveTo(-14, -104);
        ctx.quadraticCurveTo(-22 * spread, -160, -10 * spread, jetTop);
        ctx.lineTo(10 * spread, jetTop);
        ctx.quadraticCurveTo(22 * spread, -160, 14, -104);
        ctx.closePath(); ctx.fill();
        // köpük damlaları: hash dağılımlı, yerçekimiyle
        for (let i = 0; i < 26; i++) {
          const h1 = k.hash(i * 7 + 401), h2 = k.hash(i * 13 + 419), h3 = k.hash(i * 29 + 433);
          const dd = Math.max(d - h3 * 0.12, 0);
          const x = (h1 - 0.5) * 130 * (0.4 + dd * 2.2);
          const y = -110 - (30 + h2 * 150) * dd * 1.8 + 320 * dd * dd;
          const fadeI = 1 - k.prog(dd, 0.15, 0.5);
          if (fadeI <= 0 || y > 140) continue;
          ctx.fillStyle = k.rgba('panel2', 0.95 * fadeI);
          ctx.beginPath(); ctx.arc(x, y, 3 + h2 * 6 * (1 - fadeI * 0.4), 0, k.TAU); ctx.fill();
        }
      }
      // ağız parlaması: ilk 0.18 sn
      if (d < 0.18) {
        const f = 1 - d / 0.18;
        k.glow(0, -110, 60 * f, 'panel2', 0.5 * f);
      }
    }
    ctx.restore();
  },
};
