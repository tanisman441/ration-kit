// construction-fx/crane-swing — vinç kancası halat üzerinde sarkaç gibi salınır; kasayla yük taşır.
// NOT: canvas y-aşağıdır; (0,-140) halatın üst bağlantı noktasıdır.
export default {
  name: 'crane-swing', category: 'construction-fx',
  desc: 'Crane hook swinging on a cable like a pendulum, carrying a small crate',
  tags: ['vinç', 'kanca', 'halat', 'salınım', 'yük', 'inşaat', 'crane', 'hook', 'swing', 'cable', 'load'],
  box: [-70, -140, 70, 140],
  bleed: 40,
  anchor: 'halat üstü (0,-140)',
  points: { hook: [0, 88], top: [0, -140] },
  params: {
    sway: { type: 'number', default: 1, desc: 'salınım genliği çarpanı (0 = asılı durur)' },
    color: { type: 'color', default: 'ink' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const ol = k.rgba('bg', 0.55), OW = 5;

    // döngülü sarkaç — salınım animasyonu
    const ang = 0.32 * p.sway * Math.sin(t * 1.55);
    ctx.save(); ctx.translate(0, -140); ctx.rotate(ang); ctx.translate(0, 140);

    // 1) halat — havada asılı serbest çizgi (ink rengi)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(0, -140); ctx.lineTo(0, 10); ctx.stroke();
    // 2) kanca bloğu
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-22 + 6, 10 + 6, 44, 40, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-22, 10, 44, 40, 10); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-9, 22, 10, 6, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = OW;
    ctx.beginPath(); k.rrect(-22, 10, 44, 40, 10); ctx.stroke();
    // 3) kanca şaftı
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); k.rrect(-6, 50, 12, 20, 5); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = 3;
    ctx.beginPath(); k.rrect(-6, 50, 12, 20, 5); ctx.stroke();
    // 4) kanca eğrisi
    ctx.strokeStyle = k.rgba(p.color, 1); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.arc(0, 86, 17, Math.PI * 1.45, Math.PI * 0.25); ctx.stroke();
    ctx.strokeStyle = ol; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 86, 21.5, Math.PI * 1.45, Math.PI * 0.25); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 86, 12.5, Math.PI * 1.45, Math.PI * 0.25); ctx.stroke();
    // 5) kanca ucu topu
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.arc(Math.cos(Math.PI * 0.25) * 17, 86 + Math.sin(Math.PI * 0.25) * 17, 5.5, 0, k.TAU); ctx.fill();
    // 6) yük kasası — kancada asılı
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-22 + 6, 102 + 6, 44, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); k.rrect(-22, 102, 44, 30, 8); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.10);
    ctx.beginPath(); ctx.ellipse(-9, 112, 10, 5, -0.4, 0, k.TAU); ctx.fill();
    // 7) kasa şeridi (tek vurgu rengi: sarı)
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); k.rrect(-22, 112, 44, 10, 4); ctx.fill();
    ctx.strokeStyle = ol; ctx.lineWidth = OW;
    ctx.beginPath(); k.rrect(-22, 102, 44, 30, 8); ctx.stroke();

    ctx.restore();
    ctx.restore();
  },
};
