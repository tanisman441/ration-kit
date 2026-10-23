// medical-emergency/oxygen-mask — yüz üzerine takılan oksijen maskesi; takma anı + nefes buharı.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'oxygen-mask', category: 'medical-emergency',
  desc: 'Ön görünüm yüz + burun-ağız bölgesinde oksijen maskesi; at anında maske oturur, ventilden nefes buharı çıkar',
  tags: ['oksijen', 'maske', 'nefes', 'solunum', 'acil', 'hastane', 'oxygen', 'mask', 'breath', 'respiratory', 'emergency', 'medical'],
  box: [-100, -100, 100, 100],
  bleed: 30,
  anchor: 'yüz merkezi',
  points: { maskTop: [0, -30], maskVent: [0, 28], tubeEnd: [-56, 88], forehead: [0, -68] },
  params: {
    color: { type: 'color', default: 'cyan' },
    at: { type: 'time', default: null, desc: 'maske takma anı: 0.4 sn üstten inip oturur, tıklama yıldızı (0.2–1.5 sn arası)' },
  },
  draw(ctx, t, p, k) {
    const line = k.rgba('bg', 0.55), lw = 6;
    ctx.save();
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const d = p.at == null ? -1 : t - p.at;
    // maske takılmadan önce üstte süzülür, at anında oturur
    const e = d < 0 ? 0 : k.E.inOutCubic(k.prog(d, 0, 0.4));
    const maskY = -70 + 70 * e;   // yukarıdan aşağı iner
    const press = d >= 0.4 && d < 1.1 ? 1 + 0.06 * Math.exp(-(d - 0.4) * 6) : 1; // oturunca hafif bastırır

    // yüz (daire) + sağ alt gölge
    const breath = 2 * Math.sin(t * 2.5);
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); ctx.arc(6, 6 + breath * 0.4, 46, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    ctx.beginPath(); ctx.arc(0, breath * 0.4, 46, 0, k.TAU); ctx.fill(); ctx.stroke();
    // premium: sol üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-22, -28 + breath * 0.4, 20, 10, -0.5, 0, k.TAU); ctx.fill();
    // gözler (sakin, kapalıya yakın)
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.arc(-18, -18 + breath * 0.4, 4, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(18, -18 + breath * 0.4, 4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-24, -18 + breath * 0.4); ctx.lineTo(-12, -18 + breath * 0.4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(12, -18 + breath * 0.4); ctx.lineTo(24, -18 + breath * 0.4); ctx.stroke();

    // maske kayışı (yüzün arkasından)
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, breath * 0.4, 46, Math.PI * 0.85, Math.PI * 1.15); ctx.stroke();

    // maske gövdesi (cup): takılınca yüze oturur
    ctx.save();
    ctx.translate(0, maskY + breath * 0.4);
    ctx.scale(press, press);
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-40 + 6, -8 + 6, 80, 56, 20); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.strokeStyle = line; ctx.lineWidth = lw;
    k.rrect(-40, -8, 80, 56, 20); ctx.fill(); ctx.stroke();
    // parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-18, 2, 16, 8, -0.5, 0, k.TAU); ctx.fill();
    // ventil ızgarası
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    for (let vy = 8; vy <= 32; vy += 8) {
      ctx.beginPath(); ctx.moveTo(-24, vy); ctx.lineTo(24, vy); ctx.stroke();
    }
    // takılınca yanıp sönen cyan halka
    if (d >= 0 && d < 1.0) {
      ctx.strokeStyle = k.rgba(p.color, 0.8 * (1 - d / 1.0));
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 20, 52 - 30 * (d / 1.0), 0, k.TAU); ctx.stroke();
    }
    ctx.restore();

    // tıklama yıldızı (maske oturunca)
    if (d >= 0.4 && d < 0.8) {
      const sa = (1 - (d - 0.4) / 0.4);
      ctx.strokeStyle = k.rgba(p.color, 0.9 * sa); ctx.lineWidth = 4;
      for (let s = 0; s < 6; s++) {
        const a = s * k.TAU / 6 + 0.3;
        const r1 = 46 + 10 * (1 - sa), r2 = r1 + 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, 16 + Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, 16 + Math.sin(a) * r2);
        ctx.stroke();
      }
    }

    // hortum (serbest çizgi, ink)
    const tubeX = d < 0 ? -56 : -46;
    ctx.strokeStyle = k.rgba('ink', 0.8); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-20, maskY + 44); ctx.quadraticCurveTo(tubeX, 60, tubeX - 10, 88); ctx.stroke();

    // nefes buharı: maske takıldıktan sonra periyodik (3 sn periyot)
    if (d >= 0.5) {
      const ph = ((t % 3) + 3) % 3;
      for (let i = 0; i < 3; i++) {
        const age = ph - i * 0.9;
        if (age > 0 && age < 2.2) {
          const q = age / 2.2;
          const vx = (k.hash(i + 31) - 0.5) * 30 + q * 20;
          const vy = 48 + q * 34;
          ctx.fillStyle = k.rgba('cyan', 0.28 * (1 - q));
          ctx.beginPath(); ctx.ellipse(vx, vy, 10 * (0.5 + q), 7 * (0.5 + q), 0.4, 0, k.TAU); ctx.fill();
        }
      }
    }

    ctx.restore();
  },
};
