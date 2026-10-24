// shop-display-fx/open-sign-swing — zincirle asılı sallanan OPEN tabelası; döngüsel salınım + sırayla yanan ışıklar.
// NOT: canvas y-aşağıdır. Idle (döngüsel): tabela 2.2 sn periyotla sallanır, kenar ışıkları sırayla yanıp söner.
export default {
  name: 'open-sign-swing', category: 'shop-display-fx',
  desc: 'Zincirle asılı, sallanan OPEN tabelası; kenar ışıkları döngüsel olarak sırayla yanar',
  tags: ['açık', 'tabela', 'sallanan', 'asılı', 'dükkan', 'vitrin', 'open', 'sign', 'swing', 'hanging', 'shop', 'store'],
  box: [-140, -110, 140, 110],
  bleed: 50,
  anchor: 'asma noktasının merkezi (0, -110)',
  points: { pivot: [0, -110], top: [0, -70], centre: [0, 0] },
  params: {
    color: { type: 'color', default: 'green' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round';
    const sway = 0.14 * Math.sin(t * k.TAU / 2.2);
    // tavan askı noktası
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(0, -104, 8, 0, k.TAU); ctx.fill();
    ctx.save();
    ctx.translate(0, -100);
    ctx.rotate(sway);
    // zincirler (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-80, 0); ctx.lineTo(-80, 34); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(80, 34); ctx.stroke();
    // zincir halkaları (küçük daireler)
    for (const cx of [-80, 80]) {
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = k.rgba('ink', 0.6); ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(cx, 8 + i * 10, 5, 0, k.TAU); ctx.stroke();
      }
    }
    // tabela gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-106, 30, 212, 118, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-98, 38, 196, 102, 14); ctx.fill();
    // sağ alt gölge tonu (panelin sağ kenarında ince şerit)
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(68, 38, 30, 102);
    // sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-60, 52, 36, 9, -0.3, 0, k.TAU); ctx.fill();
    // OPEN yazısı
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = k.rgba(p.color);
    ctx.font = '800 52px system-ui, sans-serif';
    ctx.fillText('OPEN', 0, 82);
    // alt şerit: "WELCOME" küçük yazısı
    ctx.fillStyle = k.rgba('ink', 0.7);
    ctx.font = '800 18px system-ui, sans-serif';
    ctx.fillText('WELCOME', 0, 122);
    // kenar ışıkları: sırayla yanıp söner (döngüsel)
    for (let i = 0; i < 5; i++) {
      const lx = -80 + i * 40;
      const ph = ((t * 0.8 + i * 0.2) % 1);
      const lit = ph < 0.5 ? 1 - ph * 2 : (ph - 0.5) * 2;
      ctx.fillStyle = k.rgba(p.color, 0.25 + 0.75 * lit);
      ctx.beginPath(); ctx.arc(lx, 46, 5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
    ctx.restore();
  },
};
