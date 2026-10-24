// restaurant-fx/order-bell — tezgâh üstündeki servis zili; "at" anında zil çalar: titreme + ses dalgaları.
// NOT: canvas y-aşağıdır; zil tezgâh üstünde durur (taban y≈0), ses dalgaları sağ yukarı yayılır.
export default {
  name: 'order-bell', category: 'restaurant-fx',
  desc: 'Tezgâh üstünde pirinç servis zili; çalma anında titreme ve yayılan ses dalgaları',
  tags: ['zil', 'servis zili', 'restoran', 'garson', 'sipariş hazır', 'tezgâh', 'bell', 'service bell', 'order bell', 'restaurant counter'],
  box: [-170, -140, 170, 60],
  bleed: 56,
  anchor: 'tezgâh üstü (0,0); zil tabanı y=0',
  points: { button: [0, -72], dome: [0, -44], base_left: [-72, 0], base_right: [72, 0], counter: [0, 40] },
  params: {
    at: { type: 'time', default: null, desc: 'zil çalma anı (titreme + ses dalgaları, ~0.9 sn)' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const ringing = d >= 0 && d <= 0.9;

    // --- 1) tezgâh (masif tabla)
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-164, 12, 328, 42, 12); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    k.rrect(-170, 6, 340, 42, 12); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 9; ctx.stroke();
    // tabla parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-120, 14, 90, 7, -0.06, 0, k.TAU); ctx.fill();

    // --- zil grubu: çalarken yanal titreme
    ctx.save();
    const shake = ringing ? Math.sin(d * 62) * 4 * (1 - d / 0.9) : 0;
    ctx.translate(shake, 0);

    // gölge (sağ alta %12 koyultma hissi)
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(8, 6, 74, 13, 0, 0, k.TAU); ctx.fill();

    // --- 2) zil tabanı
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(0, 0, 72, 15, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.stroke();

    // --- 3) kubbe (pirinç = yellow vurgu)
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath(); ctx.arc(0, -4, 52, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 8; ctx.stroke();
    // kubbe sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-22, -38, 20, 9, -0.55, 0, k.TAU); ctx.fill();
    // kubbe alt kenar bandı (kubbe tabanına oturan halka)
    ctx.strokeStyle = k.rgba('bg', 0.35); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(0, -6, 52, 11, 0, 0, k.TAU); ctx.stroke();

    // --- 4) buton: basılıyken çökük
    const pressed = ringing && d < 0.16;
    const by = pressed ? -66 : -72;
    ctx.fillStyle = k.rgba('bg', 0.15);
    k.rrect(-10, by + 6, 20, 12, 6); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    k.rrect(-16, by, 32, 14, 7); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();

    // --- 5) idle: kubbede gezinen ışık yansıması (3.2 sn döngü)
    const sweep = ((t % 3.2) / 3.2) * 2 - 1;
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(sweep * 30, -34, 14, 6, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 6) "at" olayı: ses dalgaları (sağ yukarı yayılan 3 halka, 0.9 sn)
    if (ringing) {
      for (let i = 0; i < 3; i++) {
        const g = k.prog(d - i * 0.13, 0, 0.77);
        if (g <= 0) continue;
        const r = 18 + k.E.outExpo(g) * 120;
        const alpha = 0.75 * (1 - g);
        ctx.strokeStyle = k.rgba('yellow', alpha);
        ctx.lineWidth = 7 * (1 - g) + 2;
        ctx.beginPath();
        // zil kubbesinden sağ yukarı açılan yay
        ctx.arc(30, -52, r, -Math.PI * 0.55, Math.PI * 0.12);
        ctx.stroke();
        ctx.strokeStyle = k.rgba('yellow', alpha * 0.5);
        ctx.lineWidth = 4 * (1 - g) + 1.5;
        ctx.beginPath();
        ctx.arc(30, -52, r * 0.82, -Math.PI * 0.5, Math.PI * 0.08);
        ctx.stroke();
      }
      // titreşim çizgileri (zil kenarlarında)
      for (let i = 0; i < 4; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const yy = -24 - (i >> 1) * 22;
        const len = 8 + 10 * Math.abs(Math.sin(d * 55 + i * 2));
        ctx.strokeStyle = k.rgba('ink', 0.6 * (1 - d / 0.9));
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(side * 58, yy); ctx.lineTo(side * (58 + len), yy); ctx.stroke();
      }
    }
    ctx.restore();
  },
};
