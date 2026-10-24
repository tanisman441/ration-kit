// elevator-fx/cable-sway — asansör kablosu ve makarası; kablo döngüsel olarak salınır.
// ANIMASYON: kablo sarkaç gibi salınır (~2.8 sn periyot), makara döner, alt kanca hafif
// titrer; salınım genliği kablonun ucuna doğru büyür. Tamamen canlı idle hareketi.
// Tek vurgu: makara göbeği (cyan). Contract: engine/kit/ASSETS.md
export default {
  name: 'cable-sway',
  category: 'elevator-fx',
  desc: 'Asansör kablosu ve makarası; kablo sarkaç gibi salınır, makara döner',
  tags: ['asansör', 'kablo', 'makara', 'salınım', 'halat', 'kuyu', 'elevator', 'cable', 'pulley', 'sway', 'rope', 'shaft'],
  box: [-110, -140, 110, 140],
  bleed: 30,
  anchor: 'makara merkezi (0,-100)',
  points: { pulley: [0, -100], hook: [0, 118], cableMid: [0, 0] },
  params: {
    sway: { type: 'number', default: 1, desc: 'salınım genliği çarpanı (0 durgun, 1 normal)' },
    speed: { type: 'number', default: 1, desc: 'salınım hızı çarpanı' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const amp = k.clamp(p.sway ?? 1, 0, 2) * 0.10;
    const spd = k.clamp(p.speed ?? 1, 0.2, 3);
    const w = 2 * Math.PI / 2.8 * spd;
    // salınım açısı: sarkaç, uçta daha büyük
    const ang = amp * Math.sin(t * w);
    const LW = 5;
    const line = k.rgba('bg', 0.55);

    const plate = (x, y, w2, h2, r, c) => {
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.beginPath(); k.rrect(x + 6, y + 6, w2, h2, r); ctx.fill();
      ctx.fillStyle = line;
      ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w2 + LW, h2 + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c;
      ctx.beginPath(); k.rrect(x, y, w2, h2, r); ctx.fill();
    };

    // --- üst kiriş ---
    plate(-100, -140, 200, 22, 10, k.rgba('dim'));
    // parlama (sol üst)
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-68, -134, 20, 7, -0.2, 0, k.TAU); ctx.fill();

    // --- makara (döner) ---
    ctx.save();
    ctx.translate(0, -100);
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 34, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, 29, 0, k.TAU); ctx.fill();
    // dönen kollar (salınımla aynı yönde)
    ctx.rotate(t * w * 0.9);
    ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * k.TAU;
      ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8);
      ctx.lineTo(Math.cos(a) * 24, Math.sin(a) * 24); ctx.stroke();
    }
    // göbek
    ctx.fillStyle = k.rgba('cyan', 0.85);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- kablo (makaradan kancaya, salınır) ---
    // kablo makara üzerinden geçer: iki dikey ip
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-30, -118); ctx.lineTo(-30, -100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, -118); ctx.lineTo(30, -100); ctx.stroke();
    // salınan kablo: makara merkezinden kancaya, hafif eğri
    const tipX = Math.sin(ang) * 210;
    const tipY = 118;
    const midX = Math.sin(ang * 0.55) * 100;
    const midY = 10;
    ctx.beginPath();
    ctx.moveTo(0, -72);
    ctx.quadraticCurveTo(midX, midY, tipX, tipY);
    ctx.stroke();
    // kablo sargı çizgisi (ince, eğri boyunca)
    ctx.strokeStyle = k.rgba('ink', 0.3); ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, -70);
    ctx.quadraticCurveTo(midX + 6, midY, tipX + 4, tipY - 2);
    ctx.stroke();

    // --- kanca (kablo ucunda, hafif titrer) ---
    const jit = k.noise1(t * 3.1) * 1.5;
    ctx.save();
    ctx.translate(tipX + jit, tipY);
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 6, 12, 0.6, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, -2); ctx.stroke();
    ctx.restore();
    ctx.restore();
  },
};
