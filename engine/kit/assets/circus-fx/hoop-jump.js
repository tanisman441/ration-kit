// circus-fx/hoop-jump — yanan halkadan atlayan akrobat.
// at öncesi çömelme hazırlığı (yaylanan nefes), at anında (0.7 sn) halka
// merkezinden geçen parabolik atlayış + takla, sonrası zafer pozu.
// NOT: canvas y-aşağıdır; (0,0) zemin seviyesidir (halka ayağı).
export default {
  name: 'hoop-jump', category: 'circus-fx',
  desc: 'Halkadan atlayan akrobat: çömelme, parabolik takla, iniş pozu',
  tags: ['halka', 'atlama', 'akrobat', 'sirk', 'hoop', 'jump', 'acrobat', 'circus', 'takla'],
  box: [-225, -270, 235, 45],
  bleed: 35,
  anchor: 'zemin (0,0) — halka standının tabanı',
  points: { hoop: [40, -130], standBase: [40, 0], crouch: [-140, -55], land: [195, -55] },
  params: {
    at: { type: 'time', default: null, desc: 'atlama anı (0.7 sn: çömelmeden halka içinden inişe)' },
    color: { type: 'color', default: 'accent', desc: 'kostüm rengi' },
  },
  draw(ctx, t, p, k) {
    const acc = p.color;
    ctx.save();
    ctx.lineCap = 'round';

    const ad = p.at == null ? -1 : t - p.at;
    const HX = 40, HY = -130, HR = 65;      // halka merkezi + yarıçap
    const JUMP = 0.7;
    const jumping = ad >= 0 && ad < JUMP;
    const landed = ad >= JUMP;

    // zemin gölgesi
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(-140, 6, 55, 10, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(40, 6, 40, 9, 0, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(195, 6, 55, 10, 0, 0, k.TAU); ctx.fill();

    // halka: duran halka + stand (sürekli; alev yok — vurgu sade)
    ctx.fillStyle = k.rgba('dim', 0.95);
    k.rrect(HX - 9, HY + HR - 6, 18, 136, 8); ctx.fill();   // stand direği
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    k.rrect(HX - 9, HY + HR - 6, 18, 136, 8); ctx.stroke();
    // halka çerçevesi: iki katmanlı (dış sarı alev hissi)
    ctx.strokeStyle = k.rgba('yellow', 0.95); ctx.lineWidth = 12;
    ctx.beginPath(); ctx.arc(HX, HY, HR, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(HX, HY, HR - 7, 0, k.TAU); ctx.stroke();
    ctx.beginPath(); ctx.arc(HX, HY, HR + 7, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(HX - HR * 0.36, HY - HR * 0.36, 16, 10, -0.7, 0, k.TAU); ctx.fill();
    // halka idle: hafif sallanma
    // (stand sabit; halka salınımı üstteki yay üzerinden verilemez — görselde sabit)

    const br = Math.sin(t * k.TAU / 2.4) * 2;
    const blink = (t % 4.1) < 0.12;

    // --- akrobat konumu ---
    let px, py, rot, pose;
    if (jumping) {
      const pr = ad / JUMP;
      px = k.lerp(-140, 195, pr);
      py = -55 - Math.sin(pr * Math.PI) * 75;    // tepe halka merkezinden geçer
      rot = pr * Math.PI * 1.6;                   // takla
      pose = 'tuck';
    } else if (landed) {
      px = 195; py = -55; rot = 0; pose = 'victory';
    } else {
      // çömelme: hazırlık yaylanması (crouch bounce)
      const bounce = Math.abs(Math.sin(t * Math.PI / 0.9)) * 8;
      px = -140; py = -55 + bounce * 0.6; rot = 0; pose = 'crouch';
    }

    // atlayışta hız çizgileri
    if (jumping) {
      ctx.strokeStyle = k.rgba('dim', 0.45 * (1 - ad / JUMP)); ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        const off = 30 + i * 22;
        ctx.beginPath(); ctx.moveTo(px - off - 25, py - 40 + i * 26); ctx.lineTo(px - off + 12, py - 40 + i * 26); ctx.stroke();
      }
    }

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);

    if (pose === 'tuck') {
      // takla: toplanmış top formu
      ctx.fillStyle = k.rgba(acc, 0.9);
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, 0, 34, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-12, -12, 11, 7, -0.5, 0, k.TAU); ctx.fill();
      // baş
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath(); ctx.arc(8, -22, 20, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(8, -22, 20, 0, k.TAU); ctx.stroke();
      // kollar bacakları sarar
      ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 11;
      ctx.beginPath(); ctx.arc(0, 4, 26, 0.3, Math.PI - 0.3); ctx.stroke();
    } else if (pose === 'victory') {
      // iniş: ayakta, kollar yukarı
      const vb = Math.sin(t * k.TAU / 2.4) * 2;
      ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 13;
      ctx.beginPath(); ctx.moveTo(-12, -95); ctx.lineTo(-16, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(12, -95); ctx.lineTo(16, 0); ctx.stroke();
      ctx.fillStyle = k.rgba(acc, 0.9);
      k.rrect(-24, -190 + vb * 0.4, 48, 98, 15); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      k.rrect(-24, -190 + vb * 0.4, 48, 98, 15); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-10, -172, 10, 19, -0.35, 0, k.TAU); ctx.fill();
      // kollar yukarı zafer
      ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(-18, -165); ctx.lineTo(-52, -235); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(18, -165); ctx.lineTo(52, -235); ctx.stroke();
      // mutlu yüz
      const hy = -220 + vb * 0.6;
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath(); ctx.arc(0, hy, 29, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.arc(0, hy, 29, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-10, hy - 10, 9, 6.5, -0.5, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 2.8;
      ctx.beginPath(); ctx.arc(-8.5, hy - 8, 3.2, 0.6, Math.PI - 0.6); ctx.stroke();  // ^ göz
      ctx.beginPath(); ctx.arc(8.5, hy - 8, 3.2, 0.6, Math.PI - 0.6); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, hy + 4, 11, 0.3, Math.PI - 0.3); ctx.stroke();
      // iniş konfetisi (kısa)
      if (ad < JUMP + 0.5) {
        for (let i = 0; i < 8; i++) {
          const ca = k.hash(i * 5) * k.TAU, cd = 30 + k.hash(i * 11) * 45;
          ctx.fillStyle = k.rgba(i % 2 ? 'yellow' : acc, 0.8 * (1 - (ad - JUMP) / 0.5));
          ctx.beginPath(); ctx.arc(Math.cos(ca) * cd, -160 + Math.sin(ca) * cd * 0.6, 4, 0, k.TAU); ctx.fill();
        }
      }
    } else {
      // çömelme: dizler bükük, kollar geride (daha derin çömelme)
      ctx.strokeStyle = k.rgba(acc, 0.85); ctx.lineWidth = 13;
      ctx.beginPath(); ctx.moveTo(-10, -55); ctx.lineTo(-38, -4); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10, -55); ctx.lineTo(38, -4); ctx.stroke();
      ctx.fillStyle = k.rgba(acc, 0.9);
      k.rrect(-26, -118, 52, 64, 15); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
      k.rrect(-26, -118, 52, 64, 15); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-11, -100, 10, 13, -0.35, 0, k.TAU); ctx.fill();
      // kollar geride (atlayışa hazırlanır)
      ctx.strokeStyle = k.rgba(acc, 0.9); ctx.lineWidth = 12;
      ctx.beginPath(); ctx.moveTo(-18, -100); ctx.lineTo(-48, -55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(18, -100); ctx.lineTo(48, -55); ctx.stroke();
      // kafa: odaklı
      const hy = -144 + br * 0.5;
      ctx.fillStyle = k.rgba('dim', 0.95);
      ctx.beginPath(); ctx.arc(0, hy, 28, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.arc(0, hy, 28, 0, k.TAU); ctx.stroke();
      ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 2.8;
      if (blink) {
        ctx.beginPath(); ctx.moveTo(-11, hy - 6); ctx.lineTo(-4, hy - 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(4, hy - 6); ctx.lineTo(11, hy - 6); ctx.stroke();
      } else {
        ctx.beginPath(); ctx.arc(-7.5, hy - 6, 3.1, 0, k.TAU); ctx.stroke();
        ctx.beginPath(); ctx.arc(7.5, hy - 6, 3.1, 0, k.TAU); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(-6, hy + 12); ctx.lineTo(6, hy + 12); ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  },
};
