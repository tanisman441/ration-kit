// shop-display-fx/neon-open — neon AÇIK tabelası; `on` parlaklığı, boşta neon titremesi + nabız.
// NOT: canvas y-aşağıdır. Idle: neon tüpü hafif titrer ve nabız gibi parlar; `on` 0'a inince tabela söner.
export default {
  name: 'neon-open', category: 'shop-display-fx',
  desc: 'Duvara asılı, neon tüplü AÇIK tabelası; parlaklığı ayarlanır ve boşta hafifçe titrer',
  tags: ['açık', 'tabela', 'neon', 'dükkan', 'vitrin', 'mağaza', 'open', 'neon', 'sign', 'shop', 'store', 'display'],
  box: [-160, -95, 160, 95],
  bleed: 50,
  anchor: 'tabelanın merkezi',
  points: { top: [0, -80], centre: [0, 0], cord: [0, -95] },
  params: {
    color: { type: 'color', default: 'cyan' },
    on: { type: 'number', default: 1, desc: 'neon parlaklığı (0 = sönük, 1 = tam parlak)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round';
    const on = k.clamp(p.on ?? 1, 0, 1);
    // neon titremesi: çoğunlukla parlak, ara sıra kısa düşüş (deterministik, hash tabanlı)
    const seg = Math.floor(t * 7);
    const dip = k.hash(seg * 3.1) > 0.86 ? 0.45 : 1;
    const flick = 0.88 + 0.12 * Math.sin(t * k.TAU / 1.7) + 0.05 * k.noise1(t * 9);
    const glowA = on * flick * dip;
    // asma kabloları (serbest çizgi → ink)
    ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-110, -95); ctx.lineTo(-110, -72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(110, -95); ctx.lineTo(110, -72); ctx.stroke();
    // tabela gövdesi
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-146, -76, 292, 152, 22); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-138, -68, 276, 136, 16); ctx.fill();
    // sağ alt gölge tonu (panelin sağ kenarında ince şerit)
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(108, -60, 30, 120);
    // neon çerçeve tüpü (parlaklık on ile ölçeklenir)
    k.glow(0, 0, 120, p.color, 0.45 * glowA);
    ctx.strokeStyle = k.rgba(p.color, 0.25 + 0.75 * glowA);
    ctx.lineWidth = 6;
    ctx.beginPath(); k.rrect(-124, -54, 248, 108, 14); ctx.stroke();
    ctx.strokeStyle = k.rgba(p.color, 0.15 + 0.5 * glowA);
    ctx.lineWidth = 2;
    ctx.beginPath(); k.rrect(-124, -54, 248, 108, 14); ctx.stroke();
    // AÇIK yazısı — neon tüpü gibi parlak
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 56px system-ui, sans-serif';
    ctx.fillStyle = k.rgba(p.color, 0.30 + 0.70 * glowA);
    ctx.fillText('AÇIK', 0, 2);
    // köşe vidaları yerine alt küçük ışık noktaları (sırayla yanıp söner)
    for (let i = 0; i < 4; i++) {
      const sx = -124 + i * 82;
      const lit = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * k.TAU / 1.2 + i * 1.7));
      ctx.fillStyle = k.rgba(p.color, (0.25 + 0.75 * lit) * glowA + 0.08);
      ctx.beginPath(); ctx.arc(sx, 58, 5, 0, k.TAU); ctx.fill();
    }
    // sol üst parlama (sadece gövdede, yazıda değil)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-92, -52, 42, 9, -0.25, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
