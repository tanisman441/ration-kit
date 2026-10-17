// environment/door — çerçeveli kapı; open 0–1 arasında açılır, arkadan ışık sızar.
// NOT: canvas y-aşağıdır; zemin (0,0), kapı negatif y yönünde yukarı uzar.
export default {
  name: 'door',
  category: 'environment',
  desc: 'Çerçeveli kapı; open parametresiyle açılır, aralıktan ışık sızar',
  tags: ['kapı', 'giriş', 'eşik', 'door', 'entrance', 'doorway', 'gate'],
  box: [-100, -232, 100, 12],
  bleed: 20,
  anchor: 'zemin (0,0); eşik ortası',
  points: { top: [0, -222], threshold: [0, -8] },
  params: {
    color: { type: 'color', default: 'dim' },
    open: { type: 'number', default: 0, desc: 'açılma oranı 0–1' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const doorC = k.rgba(p.color), frameC = k.rgba('panel2'), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const o = k.clamp(p.open, 0, 1);

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -5, 100, 10, 0, 0, k.TAU); ctx.fill();

    // ışık sızıntısı (zeminde)
    if (o > 0.02) {
      ctx.fillStyle = k.rgba('yellow', 0.14 * o);
      ctx.beginPath();
      ctx.moveTo(-58, -4); ctx.lineTo(58, -4); ctx.lineTo(110, 8); ctx.lineTo(-110, 8);
      ctx.closePath(); ctx.fill();
    }

    // karanlık aralık (kapı arkası)
    ctx.fillStyle = k.rgba('bg', 0.92);
    ctx.beginPath(); k.rrect(-60, -202, 120, 200, 4); ctx.fill();
    if (o > 0.02) k.glow(0, -110, 90, 'yellow', 0.35 * o);

    // kapı kanadı (sola menteşeli; açıldıkça daralır)
    const w = 120 * (1 - o * 0.78);
    const dx = -60;
    if (w > 4) {
      blob(dx, -202, w, 200, 6, doorC);
      // kapı panelleri (iç detay)
      ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 3;
      const pw = Math.max(10, w - 28);
      ctx.beginPath(); k.rrect(dx + 14, -188, pw, 76, 6); ctx.stroke();
      ctx.beginPath(); k.rrect(dx + 14, -108, pw, 76, 6); ctx.stroke();
      // tokmak (kanadın sağında)
      const kx = dx + w - 18;
      ctx.fillStyle = k.rgba('ink', 0.85);
      ctx.beginPath(); ctx.arc(kx, -102, 7, 0, k.TAU); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(kx - 2, -104, 2.5, 0, k.TAU); ctx.fill();
      // premium parlama (kanat sol üst)
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); k.rrect(dx + 10, -196, Math.max(8, w * 0.3), 14, 7); ctx.fill();
      // açılınca kanat kenar kalınlığı
      if (o > 0.05) {
        ctx.fillStyle = k.rgba('bg', 0.5);
        ctx.beginPath(); k.rrect(dx + w - 2, -202, 10, 200, 4); ctx.fill();
      }
    }

    // çerçeve: iki dikme + üst lento
    blob(-80, -222, 20, 220, 6, frameC);
    blob(60, -222, 20, 220, 6, frameC);
    blob(-80, -222, 160, 22, 8, frameC);
    // çerçeve parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); k.rrect(-74, -216, 40, 10, 5); ctx.fill();
  },
};
