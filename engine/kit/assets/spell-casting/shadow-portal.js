// spell-casting/shadow-portal — mor gölge girdabı: eliptik portal halkası +
// 3 dönen spiral kol + iç karanlık çekirdek. CANLI IDLE: kollar sürekli döner
// (~0.8 rad/sn), halka nabız atar (1.4 sn), çekirdek derinliği dalgalanır.
// `open` (0-1): portal açıklığı — 0'da küçük/hafif, 1'de tam açık ve parlak.
// NOT: canvas y-aşağıdır; (0,0) portal merkezidir.
export default {
  name: 'shadow-portal', category: 'spell-casting',
  desc: 'Mor gölge girdabı; kolları sürekli dönen, nabız atan canlı portal (open ile açıklık ayarlanır)',
  tags: ['portal', 'girdap', 'gölge', 'mor', 'büyü', 'geçit', 'portal', 'vortex', 'shadow', 'swirl'],
  box: [-115, -95, 115, 95],
  bleed: 40,
  anchor: 'portal merkezi (0,0)',
  points: { centre: [0, 0], rim: [95, 0] },
  params: {
    open: { type: 'number', default: 1, desc: 'portal açıklığı 0 (kapalı) – 1 (tam açık)' },
    color: { type: 'color', default: 'purple', desc: 'girdap rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    const open = k.clamp(p.open == null ? 1 : p.open, 0, 1);
    ctx.save();

    // Açıklık: 0.55 → 1 ölçek, nabız üstüne biner
    const heartbeat = 1 + Math.sin(t * k.TAU / 1.4) * 0.035;
    const S = (0.55 + 0.45 * open) * heartbeat;
    const RX = 92 * S, RY = 68 * S;
    const rot = t * 0.8;                                     // spiral dönüş hızı

    // Dış hale
    k.glow(0, 0, RX + 30, acc, 0.15 + 0.35 * open);

    // Gölge: sağ alta %12 koyultma (elips formu)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.ellipse(6, 6, RX, RY, 0, 0, k.TAU); ctx.fill();

    // Dış halka: koyu gövde
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); ctx.ellipse(0, 0, RX, RY, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5; ctx.stroke();

    // Girdap içi: mor derinlik (open ile parlaklaşır)
    ctx.fillStyle = k.rgba(acc, 0.35 + 0.45 * open);
    ctx.beginPath(); ctx.ellipse(0, 0, RX * 0.82, RY * 0.82, 0, 0, k.TAU); ctx.fill();

    // 3 spiral kol: merkezden dışa kıvrılan yaylar, sürekli döner
    ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const a0 = rot + i * k.TAU / 3;
      ctx.strokeStyle = k.rgba(acc, 0.55 + 0.35 * open);
      ctx.lineWidth = 9;
      ctx.beginPath();
      for (let s = 0; s <= 20; s++) {
        const f = s / 20;                                    // 0 = merkez, 1 = halka
        const a = a0 + f * 2.2;                              // spiral kıvrım
        const r = RX * 0.1 + f * RX * 0.68;
        const x = Math.cos(a) * r, y = Math.sin(a) * r * (RY / RX);
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // İç karanlık çekirdek: derinlik dalgalanır (noise, ±6)
    const coreR = (RX * 0.34) * (1 + k.noise1(t * 2.2) * 0.12);
    ctx.fillStyle = k.rgba('bg', 0.55 + 0.2 * open);
    ctx.beginPath(); ctx.ellipse(0, 0, coreR, coreR * (RY / RX), 0, 0, k.TAU); ctx.fill();
    // çekirdek kenarında mor parlama
    ctx.strokeStyle = k.rgba(acc, 0.5 + 0.4 * open); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 0, coreR + 3, (coreR + 3) * (RY / RX), 0, 0, k.TAU); ctx.stroke();

    // Dönen kıvılcım noktaları: 5 nokta spiral yörüngede
    for (let i = 0; i < 5; i++) {
      const h = k.hash(i * 47.7);
      const a = rot * 1.6 + h * k.TAU;
      const r = RX * (0.35 + h * 0.45);
      const sx = Math.cos(a) * r, sy = Math.sin(a) * r * (RY / RX);
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 4 + i * 1.7));
      ctx.fillStyle = k.rgba(acc, tw * (0.4 + 0.6 * open));
      ctx.beginPath(); ctx.arc(sx, sy, 4 + tw * 3, 0, k.TAU); ctx.fill();
    }

    // Premium parlama: halkanın sol üstü, alfa 0.10
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-RX * 0.42, -RY * 0.5, RX * 0.3, RY * 0.2, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();
  },
};
