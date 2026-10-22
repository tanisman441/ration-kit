// medieval-fx/shield-wall — kalkan duvarı: 3 kalkanlı savaşçı sırası.
// Boşta kalkanlar hafifçe titrer, mızraklar sallanır;
// push anında (0.9 sn) duvar öne eğilip iter, ayak dibinde toz kalkar, geri yaylanır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = ayaklar, gövde negatif y yönünde yukarı uzar.
export default {
  name: 'shield-wall', category: 'medieval-fx',
  desc: 'Kalkan duvarı; push anında öne itiş yapar, boşta kalkanlar titrer',
  tags: ['kalkan', 'duvar', 'savaş', 'lejyon', 'saldırı', 'ortaçağ', 'shield', 'wall', 'phalanx', 'medieval', 'war'],
  box: [-200, -215, 200, 15],
  bleed: 45,
  anchor: 'ayaklar (0,0)',
  points: { front: [170, -60], top: [0, -200], centre: [0, -100] },
  params: {
    push: { type: 'time', default: null, desc: 'ileri itiş (0.9 sn: eğilme + toz + geri yaylanma)' },
    color: { type: 'color', default: 'dim', desc: 'kalkan rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), dark = k.rgba('ink', 0.85);
    const d = p.push == null ? -1 : t - p.push;
    const pushing = d >= 0 && d < 0.9;
    // itiş zarfı: 0→0.35 sn öne eğil, 0.35–0.9 geri yaylan (sönümlü)
    let penv = 0;
    if (pushing) {
      penv = d < 0.35 ? Math.sin((d / 0.35) * Math.PI / 2)
        : Math.cos(((d - 0.35) / 0.55) * Math.PI) * Math.exp(-(d - 0.35) * 3.2);
    }
    const lean = penv * 0.13, fwd = penv * 22;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    ctx.beginPath(); ctx.rect(-245, -260, 490, 310); ctx.clip();

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.3);
    ctx.beginPath(); ctx.ellipse(fwd * 0.5, -2, 150, 9, 0, 0, k.TAU); ctx.fill();

    // mızraklar (arka sıra): idle'da hafif sallanır, push'ta öne yatar
    for (let i = 0; i < 5; i++) {
      const sx = -150 + i * 75;
      const sw = k.noise1(t * 1.6 + i * 2.3) * 5;
      const pang = -0.35 + penv * 0.28 + sw * 0.004;
      const bx = sx + fwd * 0.6, by = -30;
      const tx = bx + Math.sin(pang) * 200, ty = by - Math.cos(pang) * 200;
      ctx.strokeStyle = line; ctx.lineWidth = 7 + LW;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(tx, ty); ctx.stroke();
      // mızrak ucu
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(tx + Math.sin(pang) * 18, ty - Math.cos(pang) * 18);
      ctx.lineTo(tx + Math.cos(pang) * 8, ty + Math.sin(pang) * 8);
      ctx.lineTo(tx - Math.cos(pang) * 8, ty - Math.sin(pang) * 8);
      ctx.closePath(); ctx.fill();
    }

    // 3 savaşçı: miğfer + kalkan
    for (let i = 0; i < 3; i++) {
      const cx = -105 + i * 105;
      const trem = k.noise1(t * 2.6 + i * 4.1) * 2; // idle titreme
      const ox = cx + fwd + trem * 0.4, oy = trem * 0.3;
      ctx.save();
      ctx.translate(ox, oy); ctx.rotate(lean);

      // miğfer (kalkanın üstünde): baş = basık daire ailesi
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.ellipse(0, -186 - LW / 4, 24 + LW / 2, 21 + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(0, -186, 24, 21, 0, 0, k.TAU); ctx.fill();
      // burun koruyucu + göz yarığı
      ctx.fillStyle = k.rgba('bg', 0.85);
      ctx.beginPath(); k.rrect(-14, -190, 28, 6, 3); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); k.rrect(-3, -190, 6, 22, 3); ctx.fill();
      // miğfer tepesi
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.moveTo(-18, -196); ctx.lineTo(0, -214); ctx.lineTo(18, -196); ctx.closePath(); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.moveTo(-14, -196); ctx.lineTo(0, -210); ctx.lineTo(14, -196); ctx.closePath(); ctx.fill();

      // kalkan: yuvarlak, kırmızı haç arma, merkez göbek
      const SR = 62;
      ctx.fillStyle = line;
      ctx.beginPath(); ctx.arc(0, -104, SR + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.arc(0, -104, SR, 0, k.TAU); ctx.fill();
      // arma: kırmızı haç
      ctx.fillStyle = k.rgba('red', 0.95);
      ctx.beginPath(); k.rrect(-9, -104 - 46, 18, 92, 9); ctx.fill();
      ctx.beginPath(); k.rrect(-46, -104 - 9, 92, 18, 9); ctx.fill();
      // göbek
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, -104, 14 + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(0, -104, 14, 0, k.TAU); ctx.fill();
      // premium parlama (sol üst) + sağ alt gölge
      ctx.save();
      ctx.beginPath(); ctx.arc(0, -104, SR, 0, k.TAU); ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.beginPath(); ctx.ellipse(-22, -126, 24, 13, -0.5, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.12);
      ctx.fillRect(16, -104, 46, 62);
      ctx.restore();

      // ayaklar (kalkanın altında görünür)
      ctx.fillStyle = dark;
      ctx.beginPath(); k.rrect(-26, -14, 22, 14, 6); ctx.fill();
      ctx.beginPath(); k.rrect(6, -14, 22, 14, 6); ctx.fill();
      ctx.restore();
    }

    // itiş tozu: ayak dibinde 0–0.6 sn
    if (pushing && d < 0.6) {
      const g = k.prog(d, 0, 0.6), al = 1 - g;
      for (let i = 0; i < 8; i++) {
        const px = -160 + k.hash(i * 7 + 5) * 320 + g * (20 + k.hash(i * 11 + 6) * 60);
        ctx.fillStyle = k.rgba('dim', 0.5 * al);
        ctx.beginPath(); ctx.arc(px, -6 - g * 18, 5 + g * 9, 0, k.TAU); ctx.fill();
      }
    }

    ctx.restore();
  },
};
