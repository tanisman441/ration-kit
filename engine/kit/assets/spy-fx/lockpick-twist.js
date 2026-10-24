// spy-fx/lockpick-twist — asma kilit + maymuncuk: `open` 0→1 maymuncuğu
// anahtar deliği etrafında döndürür; tam açılınca tık parıltısı ve halka atlar.
// Kısmi açılmada kilit gerilimle titrer.
// NOT: canvas y-aşağıdır; (0,0) kilit gövdesinin merkezidir.
export default {
  name: 'lockpick-twist',
  category: 'spy-fx',
  desc: 'Asma kilit ve maymuncuk: maymuncuk dönüyor, tam açılınca tık parıltısı çıkıyor',
  tags: ['kilit', 'maymuncuk', 'açma', 'ajan', 'hırsız', 'gizli', 'lock', 'lockpick', 'pick', 'spy', 'unlock', 'keyhole'],
  box: [-120, -120, 120, 120],
  bleed: 55,
  anchor: 'kilit gövdesi merkezi (0,0)',
  points: { keyhole: [0, 25], pick_handle: [-78, 88], shackle: [0, -78] },
  params: {
    open: { type: 'number', default: 0, desc: '0–1: maymuncuk dönüşü; 1 = kilit açık (tık parıltısı)' },
    color: { type: 'color', default: 'dim', desc: 'kilit gövde rengi' },
  },
  draw(ctx, t, p, k) {
    const open = k.clamp(p.open ?? 0, 0, 1);
    const isOpen = open >= 0.999;
    const tense = open > 0.02 && open < 0.999;
    ctx.save();

    // gerilim titremesi (0<open<1): gövde hafif titrer
    if (tense) ctx.translate(k.noise1(t * 14) * 1.6, k.noise1(t * 17 + 5) * 1.6);

    // kilit halkası (shackle) — açıkken yukarı atlar
    const pop = isOpen ? k.E.outBack(k.clamp(k.prog(open, 0.96, 1), 0, 1)) : 0;
    ctx.save();
    ctx.translate(0, -pop * 16);
    ctx.rotate(pop * 0.06);
    ctx.lineCap = 'round';
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 18;
    ctx.beginPath();
    ctx.moveTo(-42, -26); ctx.lineTo(-42, -68);
    ctx.arc(0, -68, 42, Math.PI, 0);
    ctx.lineTo(42, -26);
    ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(-42, -26); ctx.lineTo(-42, -68);
    ctx.arc(0, -68, 42, Math.PI, 0);
    ctx.lineTo(42, -26);
    ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-30, -96, 16, 8, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // gövde
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(-72, -28, 144, 118, 22); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();
    // premium finish: sol üst parlama + sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-42, -8, 20, 34, 0.3, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.ellipse(44, 56, 22, 26, 0.3, 0, k.TAU); ctx.fill();

    // anahtar deliği
    ctx.fillStyle = k.rgba('bg', 0.8);
    ctx.beginPath(); ctx.arc(0, 22, 14, 0, k.TAU); ctx.fill();
    ctx.beginPath(); k.rrect(-7, 22, 14, 26, 6); ctx.fill();
    // delik kenarı ışık
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 22, 14, 0, k.TAU); ctx.stroke();

    // maymuncuk — anahtar deliği etrafında dönüyor
    const ang = (135 - 25 + open * 50) * Math.PI / 180; // 110° → 160°
    const dx = Math.cos(ang), dy = Math.sin(ang);
    ctx.save();
    ctx.translate(0, 22);
    ctx.lineCap = 'round';
    // çubuk (ince, havada: ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(dx * 8, dy * 8); ctx.lineTo(dx * 108, dy * 108); ctx.stroke();
    // uç kıvrımı
    ctx.strokeStyle = k.rgba('ink', 0.9); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(dx * 108, dy * 108);
    ctx.lineTo(dx * 108 - dy * 12, dy * 108 + dx * 12); ctx.stroke();
    // sap
    ctx.translate(dx * 108, dy * 108);
    ctx.rotate(ang);
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); k.rrect(0, -11, 34, 22, 10); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(12, -5, 10, 5, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // tık parıltısı — open=1'de nabız gibi atan yıldız + halka
    if (isOpen) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 5.2);
      ctx.save(); ctx.translate(0, 22);
      k.glow(0, 0, 44 + pulse * 14, 'yellow', 0.35);
      ctx.fillStyle = k.rgba('yellow', 0.75 + 0.2 * pulse);
      const r = 20 + pulse * 5, rot = t * 1.5;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = rot + i * Math.PI / 4, rr = i % 2 === 0 ? r : r * 0.34;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore();
      // periyodik genişleyen ince halka
      const rp = (t * 46) % 46;
      ctx.strokeStyle = k.rgba('yellow', 0.4 * (1 - rp / 46));
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 22, 18 + rp, 0, k.TAU); ctx.stroke();
    }
    ctx.restore();
  },
};
