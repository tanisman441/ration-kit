// night-fx/firefly-drift — ateş böcekleri: 5–9 böcek k.noise1 ile süzülür, her birinin
// karnı kendi fazında yanıp söner; kanat çırpması küçük bir titreme olarak görünür.
// Tamamen saf fonksiyon: rastgelelik yok, hepsi k.hash/k.noise1.
// NOT: canvas y-aşağıdır; sürü (0,0) merkezi etrafında dağılır.
export default {
  name: 'firefly-drift', category: 'night-fx',
  desc: 'Süzülen ateş böcekleri sürüsü; karınları faz farklı yanıp söner',
  tags: ['ateş böceği', 'böcek', 'gece', 'sürü', 'ışık', 'yanıp sönme', 'firefly', 'night', 'glow', 'swarm', 'insect'],
  box: [-160, -110, 160, 110],
  bleed: 25,
  anchor: 'sürü merkezi (0,0)',
  points: { swarm: [0, 0], centre: [0, 0] },
  params: {
    glow: { type: 'color', default: 'yellow' },
    count: { type: 'number', default: 7, desc: '5–9: ateş böceği sayısı' },
  },
  draw(ctx, t, p, k) {
    const n = Math.max(5, Math.min(9, Math.round(p.count)));
    const line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round';

    for (let i = 0; i < n; i++) {
      const s = i * 37.7 + 11;
      // süzülme: iki eksende farklı frekanslı noise → doğal uçuş
      const bx = (k.hash(s) - 0.5) * 240;
      const by = (k.hash(s + 5.5) - 0.5) * 160;
      const x = bx + k.noise1(t * 0.55 + s) * 26 + Math.sin(t * 0.9 + s) * 8;
      const y = by + k.noise1(t * 0.42 + s + 90) * 20 + Math.cos(t * 0.7 + s * 1.3) * 7;
      // uçuş yönü: hareket vektöründen baş açısı
      const dx = k.noise1(t * 0.55 + s + 0.4) - k.noise1(t * 0.55 + s - 0.4);
      const dy = k.noise1(t * 0.42 + s + 90.4) - k.noise1(t * 0.42 + s + 89.6);
      const ang = Math.atan2(dy, dx || 0.001);

      // karın yanıp sönmesi: her böceğin kendi fazı (yumuşak geçişli)
      const blink = 0.5 + 0.5 * Math.sin(t * (1.6 + k.hash(s + 1) * 1.4) + s * 3.1);
      const on = k.prog(blink, 0.45, 0.75);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);
      // gövde
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 0, 9.5, 5.5, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); ctx.ellipse(0, 0, 7, 4, 0, 0, k.TAU); ctx.fill();
      // karın (kuyruk ucu): yanınca glow
      if (on > 0.02) {
        k.glow(-9, 0, 16, p.glow, 0.5 * on);
        ctx.fillStyle = k.rgba(p.glow, on);
        ctx.beginPath(); ctx.ellipse(-8.5, 0, 4.2, 2.8, 0, 0, k.TAU); ctx.fill();
      }
      // kanat çırpma titremesi (üstte iki ince çizgi, alfa düşük)
      const flap = Math.sin(t * 26 + s * 2) * 0.5 + 0.5;
      ctx.strokeStyle = k.rgba('ink', 0.45); ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(-1, -3); ctx.lineTo(-6, -8 - 4 * flap); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(1, -3); ctx.lineTo(6, -8 - 4 * (1 - flap)); ctx.stroke();
      ctx.restore();
    }
  },
};
