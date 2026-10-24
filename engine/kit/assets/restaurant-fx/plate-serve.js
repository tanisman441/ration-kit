// restaurant-fx/plate-serve — garson kolu tepsiyle tabak sunar; "at" anında tepsi aşağıdan yükselip sunuş pozuna geçer.
// NOT: canvas y-aşağıdır; tepsi merkezi (0,0), kol soldan girer, sunuş yukarı kaldırıştır.
export default {
  name: 'plate-serve', category: 'restaurant-fx',
  desc: 'Garson kolunun tepsiyle tabak sunuşu; sunuş anında yükselme pozu ve kıvılcım',
  tags: ['tepsi', 'tabak sunuşu', 'garson', 'servis', 'restoran', 'yemek servisi', 'serve', 'serving tray', 'plate serve', 'waiter', 'restaurant service'],
  box: [-200, -160, 200, 90],
  bleed: 48,
  anchor: 'tepsi merkezi (0,0); kol soldan girer',
  points: { tray: [0, 0], plate: [0, -32], food: [24, -58], hand: [-128, -14] },
  params: {
    at: { type: 'time', default: null, desc: 'sunuş anı (tepsi yükselir, tabak takdim edilir, ~0.8 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const serving = d >= 0 && d <= 0.9;

    // sunuş hareketi: aşağıdan yükselme + oturtma (outBack)
    const rise = serving ? k.E.outBack(k.clamp(d / 0.55), 1.6) : 1;
    const yOff = serving ? (1 - rise) * 110 : 0;
    const idleBob = serving ? 0 : Math.sin(t * 2.6) * 3;

    // --- 1) kol (soldan, garson kolu; tepsiyle birebir iner-kalkar)
    const armY = -14 + yOff + idleBob * 0.7;
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = 30;
    ctx.beginPath(); ctx.moveTo(-200, armY - 8); ctx.quadraticCurveTo(-150, armY - 14, -108, armY); ctx.stroke();
    ctx.strokeStyle = line; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-200, armY - 8); ctx.quadraticCurveTo(-150, armY - 14, -108, armY); ctx.stroke();
    // manşet (beyaz gömlek manşeti)
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-128, armY - 26 + 3, 44, 36, 10); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.85);
    k.rrect(-132, armY - 29, 44, 36, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();

    // --- tepsi grubu (yükselme + nefes)
    ctx.save();
    ctx.translate(0, yOff + idleBob);

    // gölge (tepsinin altı, sağa kayık)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(10, 14, 118, 20, 0, 0, k.TAU); ctx.fill();

    // --- 2) el (tepsinin altında, avuç içiyle destekler)
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(-96, -6, 22, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // el üstü parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-104, -14, 9, 5, -0.5, 0, k.TAU); ctx.fill();

    // --- 3) tepsi
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-124, 8, 248, 16, 8); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 120, 22, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.stroke();
    // tepsi iç yüzeyi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(0, -3, 106, 16, 0, 0, k.TAU); ctx.fill();

    // --- 4) tabak
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(6, -26, 76, 24, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); ctx.ellipse(0, -32, 76, 24, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // tabak sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-38, -42, 26, 7, -0.35, 0, k.TAU); ctx.fill();
    // tabak çukuru
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, -32, 48, 14, 0, 0, k.TAU); ctx.stroke();

    // --- 5) yemek (3 parça + yeşillik; green vurgu = taze)
    const foods = [[-30, -48, 26, 20], [8, -54, 30, 24], [42, -46, 24, 18]];
    for (let i = 0; i < foods.length; i++) {
      const [fx, fy, fw, fh] = foods[i];
      const jig = serving && d > 0.3 ? Math.sin((d - 0.3) * 30 + i * 2) * 2 * (1 - k.prog(d - 0.3, 0, 0.5)) : 0;
      ctx.fillStyle = k.rgba('green', 1);
      ctx.beginPath(); ctx.ellipse(fx, fy + jig, fw / 2, fh / 2, 0, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath(); ctx.ellipse(fx - fw / 6, fy + jig - fh / 5, fw / 6, fh / 7, -0.5, 0, k.TAU); ctx.fill();
    }
    // garnitür yaprakları (ince serbest çizgiler = ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 3.5;
    for (let i = 0; i < 3; i++) {
      const gx = -8 + i * 14, gy = -62;
      const sway = k.noise1(t * 2 + i * 9) * 3;
      ctx.beginPath(); ctx.moveTo(gx, gy); ctx.quadraticCurveTo(gx + sway, gy - 10, gx + 6 + sway, gy - 16); ctx.stroke();
    }
    ctx.restore();

    // --- 6) idle: tepsi üstünde gezinen kıvılcım (4 sn döngü)
    const tw = (t % 4) / 4;
    if (tw > 0.7 && tw < 0.9) {
      const a = (tw - 0.7) / 0.2;
      ctx.fillStyle = k.rgba('green', 0.7 * Math.sin(a * Math.PI));
      const sx = -40 + k.hash(3) * 120;
      ctx.beginPath(); ctx.arc(sx, -88 - a * 14, 3.5, 0, k.TAU); ctx.fill();
    }

    // --- 7) "at" olayı: sunuş sonu kıvılcım patlaması (d≈0.55–0.9)
    if (serving && d > 0.45) {
      const g = k.prog(d - 0.45, 0, 0.45);
      k.glow(0, -52, 70 * (1 - g) + 18, 'green', 0.4 * (1 - g));
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * k.TAU + 0.3;
        const dist = (26 + k.hash(i * 5 + 1) * 54) * k.E.outExpo(g);
        ctx.strokeStyle = k.rgba('green', 0.85 * (1 - g));
        ctx.lineWidth = 5 * (1 - g) + 1.5;
        ctx.beginPath();
        ctx.moveTo(0 + Math.cos(ang) * 20, -52 + Math.sin(ang) * 14);
        ctx.lineTo(0 + Math.cos(ang) * (20 + dist), -52 + Math.sin(ang) * (14 + dist));
        ctx.stroke();
      }
    }
    ctx.restore();
  },
};
