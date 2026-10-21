// cyber-fx/data-shred — belge alttan şerit şerit parçalanıyor.
// ANIMASYON: `at` anında 0.9 sn yoğun parçalanma patlaması (sarsıntı + 16 dönen parça);
// idle'da sürekli 6 şerit döngüsel dökülür (2.2 sn). Tek vurgu: cyan.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'data-shred', category: 'cyber-fx',
  desc: 'Alttan şerit şerit parçalanan belge; at anında yoğun parçalanma patlaması',
  tags: ['veri', 'parçalama', 'belge', 'shred', 'dosya', 'siber', 'yıkım', 'kağıt', 'data', 'shred', 'document', 'destroy', 'cyber', 'particles'],
  box: [-120, -120, 120, 120],
  bleed: 60,
  anchor: 'belge merkezi (0,-25)',
  points: { doc: [0, -25], fall: [0, 80] },
  params: {
    at: { type: 'time', default: null, desc: 'parçalanma anı: 0.9 sn yoğun parça patlaması' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.9;
    const W = 120, H = 130, CX = 0, CY = -25;
    // patlamada belge sarsılır
    const shakeX = burst ? k.noise1(t * 40) * 7 * (1 - k.prog(d, 0, 0.3)) : 0;
    ctx.save();
    ctx.translate(shakeX, 0);
    ctx.lineCap = 'round';

    // --- belge: gölge, gövde, parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-W / 2 + 6, CY - H / 2 + 6, W, H, 12); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-W / 2, CY - H / 2, W, H, 12); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-W / 2 + 30, CY - H / 2 + 16, 34, 11, -0.3, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-W / 2, CY - H / 2, W, H, 12); ctx.stroke();

    // başlık çubuğu (vurgu) + metin satırları
    ctx.fillStyle = k.rgba(p.color, 0.9);
    ctx.beginPath(); k.rrect(-W / 2 + 14, CY - H / 2 + 14, 52, 12, 6); ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = k.rgba('ink', 0.35);
      const lw = 78 - i * 16;
      ctx.beginPath(); k.rrect(-W / 2 + 14, CY - H / 2 + 42 + i * 20, lw, 8, 4); ctx.fill();
    }

    // parçalama ağzı: belgenin alt kenarında dişli şerit
    const slotY = CY + H / 2 - 6;
    ctx.fillStyle = k.rgba(p.color, burst ? 0.95 : 0.55);
    for (let i = 0; i < 10; i++) {
      const bx = -W / 2 + 8 + i * 11;
      ctx.beginPath();
      ctx.moveTo(bx, slotY); ctx.lineTo(bx + 5.5, slotY + 8); ctx.lineTo(bx + 11, slotY);
      ctx.closePath(); ctx.fill();
    }

    // --- idle şeritler: 6 şerit, 2.2 sn döngüyle dökülür ---
    if (!burst) {
      for (let i = 0; i < 6; i++) {
        const ph = ((t / 2.2) + i / 6) % 1;
        const x = -W / 2 + 14 + i * 18 + k.noise1(t * 3 + i * 7) * 4;
        const y = slotY + 8 + ph * ph * 62;
        const alpha = 0.75 * Math.sin(ph * Math.PI);
        if (alpha <= 0.01) continue;
        ctx.fillStyle = k.rgba('dim', alpha);
        ctx.fillRect(x - 5, y, 10, 22 - ph * 8);
        ctx.fillStyle = k.rgba(p.color, alpha * 0.5);
        ctx.fillRect(x - 5, y, 10, 3);
      }
    }

    // --- patlama: 16 parça, dönerek savrulur ---
    if (burst) {
      const fl = 1 - k.prog(d, 0, 0.16);
      if (fl > 0) k.glow(CX, slotY, 70, p.color, 0.5 * fl);
      for (let i = 0; i < 16; i++) {
        const start = k.hash(40 + i * 17) * 0.22;
        const fly = k.E.outCubic(k.prog(d, start, start + 0.55));
        if (fly <= 0) continue;
        const x0 = (k.hash(80 + i * 13) - 0.5) * W * 0.8;
        const x = x0 + (k.hash(120 + i * 7) - 0.5) * 90 * fly;
        const y = k.lerp(slotY + 6, 108, fly * fly);
        const alpha = 1 - k.prog(d, 0.45, 0.9);
        if (alpha <= 0.01) continue;
        const s = 8 + k.hash(i * 3 + 5) * 10;
        const rot = (k.hash(i * 9 + 1) - 0.5) * 4 * fly;
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.fillStyle = k.rgba('dim', 0.9 * alpha);
        ctx.fillRect(-s / 2, -s / 4, s, s / 2);
        if (k.hash(i * 21 + 4) > 0.5) {
          k.glow(0, 0, 10, p.color, 0.4 * alpha);
          ctx.fillStyle = k.rgba(p.color, 0.85 * alpha);
          ctx.fillRect(-s / 2, -s / 4, s / 3, s / 2);
        }
        ctx.restore();
      }
      // patlamada belgenin altı çözülür: alt kenar bulanıklaşır
      const dissolve = k.prog(d, 0, 0.35) * (1 - k.prog(d, 0.6, 0.9));
      if (dissolve > 0) {
        ctx.fillStyle = k.rgba(p.color, 0.25 * dissolve);
        ctx.beginPath(); k.rrect(-W / 2, slotY - 4, W, 22, 6); ctx.fill();
      }
    }
    ctx.restore();
  },
};
