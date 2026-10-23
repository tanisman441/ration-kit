// commerce-fx/sale-banner — çubuktan sarkan indirim afişi; `at` anında aşağı açılır (yaylanma) + konfeti patlar.
// NOT: canvas y-aşağıdır. Idle: 2.8 sn periyotlu hafif sallanma; at olayı ~1.4 sn sürer.
export default {
  name: 'sale-banner', category: 'commerce-fx',
  desc: 'Çubuktan sarkan SALE afişi; açılma anında yaylanır ve konfeti saçar',
  tags: ['indirim', 'afiş', 'saten', 'kampanya', 'sale', 'banner', 'discount', 'konfeti', 'confetti', 'shop', 'mağaza'],
  box: [-135, -155, 135, 55],
  bleed: 90,
  anchor: 'asma çubuğunun merkezi (0,-140)',
  points: { rod: [0, -140], cloth: [0, -55], bottom: [0, 20] },
  params: {
    color: { type: 'color', default: 'red' },
    at: { type: 'time', default: null, desc: 'afiş açılma anı: yaylanarak açılır + konfeti (1.4 sn)' },
  },
  draw(ctx, t, p, k) {
    const wobble = (x, f = 19, dp = 7) => (x < 0 ? 0 : Math.exp(-dp * x) * Math.cos(f * x));
    const spring = (x, f = 18, dp = 8) => (x <= 0 ? 0 : 1 - Math.exp(-dp * x) * Math.cos(f * x));
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;

    // açılma: d<0 kapalı (rulo), 0–0.6 sn'de yaylanarak açılır
    const open = d < 0 ? 0 : spring(d, 12, 6);
    const drop = open * 150; // afişin açılma mesafesi
    const sway = 0.03 * Math.sin(t * k.TAU / 2.8) + (d >= 0.6 ? wobble(d - 0.6, 14, 5) * 0.05 : 0);

    // asma çubuğu
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-122, -152, 244, 26, 13); ctx.fill();
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); k.rrect(-114, -148, 228, 18, 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-70, -143, 40, 5, -0.1, 0, k.TAU); ctx.fill();
    // askı ipleri (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-100, -152); ctx.lineTo(-100, -186); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(100, -152); ctx.lineTo(100, -186); ctx.stroke();

    ctx.save(); ctx.translate(0, -132); ctx.rotate(sway);

    // rulo (kapalıyken görünür, açılınca küçülür)
    const rollR = 26 * (1 - open) + 10;
    if (rollR > 11) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, 6, rollR + 5, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color);
      ctx.beginPath(); ctx.arc(0, 6, rollR, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(-rollR * 0.35, -2, rollR * 0.45, rollR * 0.22, -0.4, 0, k.TAU); ctx.fill();
    }

    // açılan kumaş
    if (open > 0.02) {
      const cw = 210, ch = drop;
      const top = 6 + rollR * 0.8;
      // kumaş gövdesi (alt kenar zikzaklı)
      const cloth = (dy, fill) => {
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.moveTo(-cw / 2, top + dy);
        ctx.lineTo(cw / 2, top + dy);
        ctx.lineTo(cw / 2, top + ch + dy);
        for (let i = 6; i >= 0; i--) {
          const zx = -cw / 2 + (i / 6) * cw;
          ctx.lineTo(zx, top + ch + dy + (i % 2 === 0 ? 0 : 16));
        }
        ctx.closePath(); ctx.fill();
      };
      cloth(6, line);
      cloth(0, k.rgba(p.color, 0.95));
      // sağ alt gölge tonu
      ctx.fillStyle = 'rgba(0,0,0,0.10)';
      ctx.fillRect(cw / 2 - 40, top, 40, ch);
      // sol üst parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-cw / 2 + 42, top + 26, 34, 9, -0.3, 0, k.TAU); ctx.fill();
      // SALE yazısı (açılma %60'tan sonra görünür)
      if (open > 0.6) {
        ctx.save();
        ctx.globalAlpha = k.prog(open, 0.6, 0.9);
        ctx.fillStyle = k.rgba('bg', 0.92);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '800 52px system-ui, sans-serif';
        ctx.fillText('SALE', 0, top + ch / 2 - 8);
        ctx.restore();
      }
      // konfeti (açılma sonrası; kontrol karelerinde görünür)
      if (d >= 0.15 && d < 2.2) {
        const cd = d - 0.15;
        const cols = [p.color, 'yellow', 'cyan', 'ink', 'dim'];
        for (let i = 0; i < 16; i++) {
          const a = k.hash(i * 13.7) * k.TAU;
          const sp = 90 + k.hash(i * 7.1) * 160;
          const px = Math.cos(a) * sp * cd;
          const py = top + ch * 0.7 + Math.sin(a) * sp * cd * 0.6 + 260 * cd * cd;
          const rot = a + cd * (4 + k.hash(i * 3.3) * 6);
          const al = 1 - k.prog(cd, 1.4, 2.0);
          ctx.save(); ctx.translate(px, py); ctx.rotate(rot);
          ctx.globalAlpha = al;
          ctx.fillStyle = k.rgba(cols[i % cols.length]);
          if (i % 3 === 0) { ctx.beginPath(); ctx.arc(0, 0, 5, 0, k.TAU); ctx.fill(); }
          else ctx.fillRect(-6, -3, 12, 6);
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
  },
};
