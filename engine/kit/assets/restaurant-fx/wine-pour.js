// restaurant-fx/wine-pour — şişe eğik, kadehe şarap dökülür; "pour" (0-1) akış miktarı ve kadeh doluluğunu sürer.
// NOT: canvas y-aşağıdır; şişe ağzı (-72,-116), akış aşağı (+y) iner, kadeh x=62'de durur.
export default {
  name: 'wine-pour', category: 'restaurant-fx',
  desc: 'Eğik şişeden kadehe akan şarap; akış miktarı ve kadeh doluluğu animasyonlu',
  tags: ['şarap', 'kadeh', 'şişe', 'dökme', 'restoran', 'içecek', 'sommelier', 'wine', 'pour', 'wine glass', 'bottle pour', 'restaurant'],
  box: [-175, -175, 175, 105],
  bleed: 40,
  anchor: 'kadeh merkezi (62,0); şişe ağzı (-72,-116)',
  points: { lip: [-72, -116], rim: [62, -52], wine_surface: [62, -19], stem: [62, 34], base: [62, 76] },
  params: {
    pour: { type: 'number', default: 0.55, desc: '0-1: sıvı akış miktarı ve kadeh doluluğu' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const q = k.clamp(p.pour ?? 0.55, 0, 1);
    const flowing = q > 0.02;

    // --- 1) şişe (eğik; döndürme ile çizilir)
    ctx.save();
    ctx.translate(-108, -96); ctx.rotate(0.62); // boyun sağa-aşağı bakar
    // gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-30 + 6, -66 + 6, 60, 150, 18); ctx.fill();
    // gövde
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-30, -66, 60, 112, 16); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.stroke();
    // boyun
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-14, -100, 28, 44, 10); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // etiket
    ctx.fillStyle = k.rgba('ink', 0.85);
    k.rrect(-22, -40, 44, 40, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.5); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.moveTo(-14, -26); ctx.lineTo(14, -26); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(14, -14); ctx.stroke();
    // şişe sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-16, -50, 8, 34, 0.1, 0, k.TAU); ctx.fill();
    // mantar ağzı (açık)
    ctx.fillStyle = k.rgba('bg', 0.85);
    ctx.beginPath(); ctx.ellipse(0, -102, 13, 7, 0, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 2) kadeh (x=62): çanak + sap + ayak
    const GX = 62;
    // gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(GX + 6, 82, 44, 9, 0, 0, k.TAU); ctx.fill();
    // ayak
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); ctx.ellipse(GX, 76, 40, 10, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // sap (ink rengi ince serbest çizgi değil — sap kalın çizgi)
    ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(GX, 72); ctx.lineTo(GX, 18); ctx.stroke();
    ctx.strokeStyle = line; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(GX, 72); ctx.lineTo(GX, 18); ctx.stroke();
    // çanak: dış siluet (trapez + yuvarlak dip)
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath();
    ctx.moveTo(GX - 46, -52);
    ctx.quadraticCurveTo(GX - 44, 8, GX - 16, 16);
    ctx.quadraticCurveTo(GX, 20, GX + 16, 16);
    ctx.quadraticCurveTo(GX + 44, 8, GX + 46, -52);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // çanak sol üst parlama (premium finish; cam gibi)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(GX - 28, -30, 9, 22, 0.25, 0, k.TAU); ctx.fill();

    // --- 3) kadehteki şarap (doluluk = q; red vurgu)
    if (q > 0.02) {
      const surfY = k.lerp(12, -44, q); // yüzey yüksekliği
      const ripple = Math.sin(t * 5.2) * 2.2 * (flowing ? 1 : 0.25);
      ctx.save();
      // çanağın içine kırp
      ctx.beginPath();
      ctx.moveTo(GX - 44, -50);
      ctx.quadraticCurveTo(GX - 42, 8, GX - 15, 15);
      ctx.quadraticCurveTo(GX, 19, GX + 15, 15);
      ctx.quadraticCurveTo(GX + 42, 8, GX + 44, -50);
      ctx.closePath(); ctx.clip();
      ctx.fillStyle = k.rgba('red', 1);
      ctx.fillRect(GX - 46, surfY, 92, 80);
      // yüzey çizgisi (dalgalı, canlı)
      ctx.strokeStyle = k.rgba('red', 1); ctx.lineWidth = 6;
      ctx.beginPath();
      for (let x = -44; x <= 44; x += 8) {
        const yy = surfY + Math.sin(x * 0.25 + t * 5.2) * ripple * 0.6;
        if (x === -44) ctx.moveTo(GX + x, yy); else ctx.lineTo(GX + x, yy);
      }
      ctx.stroke();
      // şarap parlama
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(GX - 22, surfY + 14, 10, 16, 0.2, 0, k.TAU); ctx.fill();
      ctx.restore();
    }

    // --- 4) akış: şişe ağzından kadehe (q ile genişlik/alfa; noise ile kıvrımlı, canlı)
    if (flowing) {
      const sx = -72, sy = -110, ex = GX, ey = -52;
      const wob = k.noise1(t * 6.5) * 5;
      ctx.strokeStyle = k.rgba('red', 0.55 + q * 0.4);
      ctx.lineWidth = 4 + q * 9;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo((sx + ex) / 2 + wob, (sy + ey) / 2, ex, ey);
      ctx.stroke();
      // akış parıltısı
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx - 2, sy);
      ctx.quadraticCurveTo((sx + ex) / 2 + wob - 2, (sy + ey) / 2, ex - 2, ey);
      ctx.stroke();
      // düşen damlalar (döngülü, 0.9 sn)
      for (let i = 0; i < 3; i++) {
        const cyc = 0.9, ph = ((t * 1.4 + i * 0.33) % cyc) / cyc;
        const dx = k.lerp(sx, ex, ph) + k.noise1(t * 6 + i * 7) * 3;
        const dy = k.lerp(sy, ey, ph * ph);
        ctx.fillStyle = k.rgba('red', 0.85 * (1 - ph * 0.4));
        ctx.beginPath(); ctx.arc(dx, dy, 3.5 + q * 3, 0, k.TAU); ctx.fill();
      }
      // kadehe çarpma sıçraması
      const spl = Math.abs(Math.sin(t * 8));
      for (let i = 0; i < 3; i++) {
        const ang = -Math.PI / 2 + (k.hash(i * 7 + 2) - 0.5) * 1.6;
        ctx.strokeStyle = k.rgba('red', 0.6 * spl);
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(ang) * (10 + spl * 12), ey + Math.sin(ang) * (8 + spl * 10)); ctx.stroke();
      }
    }

    // --- 5) idle: kadeh üstünde gezinen kıvılcım + aroma çizgisi (q>0 iken)
    const tw = (t % 3.8) / 3.8;
    if (tw > 0.55 && tw < 0.75) {
      const a = (tw - 0.55) / 0.2;
      ctx.fillStyle = k.rgba('ink', 0.6 * Math.sin(a * Math.PI));
      ctx.beginPath(); ctx.arc(GX + 30, -70 - a * 10, 3, 0, k.TAU); ctx.fill();
    }
    if (q > 0.3) {
      const ph = (t % 4) / 4;
      const ax = GX + 8, ay0 = -52 - q * 30;
      ctx.strokeStyle = k.rgba('ink', 0.35 * Math.sin(ph * Math.PI));
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(ax, ay0);
      ctx.bezierCurveTo(ax + k.noise1(t * 2) * 10 - 8, ay0 - 16, ax - k.noise1(t * 2 + 5) * 10 + 8, ay0 - 34, ax + k.noise1(t * 2 + 9) * 8, ay0 - 48);
      ctx.stroke();
    }
    ctx.restore();
  },
};
