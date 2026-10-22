// space-travel/rocket-dock — roketin istasyon portuna kenetlenmesi: p.at anında
// yaklaşma + temas kıvılcımı + kelepçe kapanması + kenetli ışık (time olayı).
// NOT: canvas y-aşağıdır; (0,0) temas noktasıdır (istasyon port ağzı). Roket soldan
// yatay gelir, burun sağa bakar. Vurgu: yeşil (kenetli sinyali); alev standart
// sıcak efekt rengidir (yellow→red).
export default {
  name: 'rocket-dock', category: 'space-travel',
  desc: 'Roketin istasyon portuna kenetlenmesi: yaklaşma, temas kıvılcımı ve kenetli ışık',
  tags: ['roket', 'kenetlenme', 'istasyon', 'uzay', 'uzay yolculuğu', 'yaklaşma', 'temas', 'rocket', 'docking', 'space station', 'rendezvous', 'uzay istasyonu', 'docking port'],
  box: [-400, -130, 200, 130],
  bleed: 60,
  anchor: 'temas noktası (0,0): istasyon port ağzı',
  points: { dock: [10, 0], nose: [0, 0], nozzle: [-198, 0] },
  params: {
    color: { type: 'color', default: 'panel2' },
    at: { type: 'time', default: null, desc: 'kenetlenme anı (yaklaşma + kıvılcım + kelepçe)' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;   // temas anına göre süre
    const dockedSteady = p.at == null;
    const approaching = d >= -1.2 && d < 0;
    const docked = d >= 0 || dockedSteady;
    const LW = 8;
    const line = k.rgba('bg', 0.55);
    const rocketC = k.rgba(p.color);
    ctx.save();

    // hafif süzülme (canlı idle): bütün sahne nefes alır
    ctx.translate(0, Math.sin(t * 1.8) * 2.5);

    // yaklaşma ofseti: at-1.2'de uzakta, at'ta temasta
    const progA = approaching ? k.E.inOutCubic(k.prog(d, -1.2, 0)) : docked ? 1 : 0;
    const ox = -170 * (1 - progA);

    // ── istasyon modülü (sağda, sabit) ──
    // gövde
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(14 - LW / 2, -72 - LW / 2, 160 + LW, 144 + LW, 26); ctx.fill();
    ctx.fillStyle = k.rgba('dim'); ctx.beginPath(); k.rrect(14, -72, 160, 144, 26); ctx.fill();
    // gövde panel çizgileri (iç ayrım: ink, alfa 0.35)
    ctx.strokeStyle = k.rgba('ink', 0.35); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(60, -72); ctx.lineTo(60, 72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(128, -72); ctx.lineTo(128, 72); ctx.stroke();
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(52, -44, 34, 12, -0.3, 0, k.TAU); ctx.fill();
    // kenetlenme halkası (port ağzı)
    ctx.strokeStyle = line; ctx.lineWidth = LW + 6;
    ctx.beginPath(); ctx.ellipse(8, 0, 13, 58, 0, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = LW - 2;
    ctx.beginPath(); ctx.ellipse(8, 0, 13, 58, 0, 0, k.TAU); ctx.stroke();
    // kelepçe kolları: temasta kapanır (time olayı, 0.4 sn)
    const closeK = docked ? k.prog(dockedSteady ? 1 : d, 0, 0.4) : 0;
    for (const s of [-1, 1]) {
      const open = s * 0.9, shut = s * 0.12;
      const ang = k.lerp(open, shut, closeK);
      ctx.save(); ctx.translate(8, s * 58); ctx.rotate(s > 0 ? -ang : ang);
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(-8, s > 0 ? -8 : -56, 16, 64, 8); ctx.fill();
      ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); k.rrect(-8 + LW / 2, s > 0 ? -8 + LW / 2 : -56 + LW / 2, 16 - LW, 64 - LW, 6); ctx.fill();
      ctx.restore();
    }
    // port içi sinyal ışığı: temastan önce sönük, sonra yeşil nabız (canlı idle)
    const sig = docked ? (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 3.4))) : 0.18;
    if (docked) k.glow(26, 0, 34, 'green', 0.5 * sig);
    ctx.fillStyle = k.rgba('green', sig);
    ctx.beginPath(); ctx.arc(26, 0, 9, 0, k.TAU); ctx.fill();

    // ── roket (solda, yaklaşan) ──
    ctx.save(); ctx.translate(ox, 0);
    // burun konisi (uç = temas noktası)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-58, -30); ctx.lineTo(-58, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rocketC;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-58 + LW / 2, -30 + LW / 2); ctx.lineTo(-58 + LW / 2, 30 - LW / 2); ctx.closePath(); ctx.fill();
    // gövde
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-178 - LW / 2, -30 - LW / 2, 124 + LW, 60 + LW, 18); ctx.fill();
    ctx.fillStyle = rocketC; ctx.beginPath(); k.rrect(-178, -30, 124, 60, 18); ctx.fill();
    // pencere
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(-96, 0, 15, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('cyan', 0.85); ctx.beginPath(); ctx.arc(-96, 0, 15 - LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath(); ctx.arc(-101, -5, 5, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst, alfa 0.10)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-120, -16, 30, 9, -0.15, 0, k.TAU); ctx.fill();
    // kanatçıklar
    for (const s of [-1, 1]) {
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(-150, s * 28); ctx.lineTo(-196, s * 66); ctx.lineTo(-196, s * 28); ctx.closePath(); ctx.fill();
      ctx.fillStyle = rocketC;
      ctx.beginPath(); ctx.moveTo(-150, s * (28 - LW / 2)); ctx.lineTo(-196 + 4, s * (66 - 4)); ctx.lineTo(-196 + 4, s * (28 - LW / 2)); ctx.closePath(); ctx.fill();
    }
    // motor ağzı
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-206, -20, 16, 40, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); k.rrect(-206, -20, 16, 40, 8); ctx.fill();
    // itici alev: yaklaşırken yanar (titreyen idle), temasta söner
    const burn = (approaching || d < -1.2) && !dockedSteady ? 1 : 0;
    if (burn > 0) {
      const fl = 0.75 + 0.25 * k.noise1(t * 22);
      const flen = 74 * fl;
      k.glow(-206, 0, 60, 'yellow', 0.45);
      const grd = ctx.createLinearGradient(-206, 0, -206 - flen, 0);
      grd.addColorStop(0, k.rgba('yellow', 0.95)); grd.addColorStop(1, k.rgba('red', 0.05));
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.moveTo(-204, -14);
      ctx.quadraticCurveTo(-206 - flen * 0.6, -20 * fl, -206 - flen, 0);
      ctx.quadraticCurveTo(-206 - flen * 0.6, 20 * fl, -204, 14);
      ctx.closePath(); ctx.fill();
    }
    ctx.restore();

    // temas kıvılcımı: at anında 0.5 sn patlama (time olayı)
    if (d >= 0 && d < 0.6) {
      const kk = k.prog(d, 0, 0.6);
      k.glow(0, 0, 90 * (1 - kk * 0.5), 'yellow', 0.6 * (1 - kk));
      for (let i = 0; i < 10; i++) {
        const a = k.hash(i * 13.7) * k.TAU;
        const dist = kk * (30 + k.hash(i * 7.1) * 70);
        const x = Math.cos(a) * dist, y = Math.sin(a) * dist * 0.8;
        ctx.fillStyle = k.rgba('yellow', 0.95 * (1 - kk));
        ctx.beginPath(); ctx.arc(x, y, 3.5 * (1 - kk) + 1, 0, k.TAU); ctx.fill();
      }
    }
    // halka flaşı: temas anında kısa sarı parlama
    if (d >= 0 && d < 0.3) {
      ctx.strokeStyle = k.rgba('yellow', 0.9 * (1 - d / 0.3));
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.ellipse(8, 0, 13, 58, 0, 0, k.TAU); ctx.stroke();
    }

    ctx.restore();
  },
};
