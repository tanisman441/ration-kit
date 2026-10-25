// bakery-fx/oven-bake — fırın camından görünen somun, altında döngüsel alevler ve yükselen ısı dalgaları. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) fırın gövdesinin merkezidir.
export default {
  name: 'oven-bake', category: 'bakery-fx',
  desc: 'Fırın ön yüzü; camın arkasında somun pişerken alevler titrer, ısı dalgaları yükselir',
  tags: ['fırın', 'ekmek', 'pişirme', 'alev', 'ısı', 'somun', 'oven', 'bake', 'bread', 'flame', 'heat', 'bakery'],
  box: [-140, -110, 140, 110],
  bleed: 20,
  anchor: 'fırın gövdesinin merkezi (0,0); cam ortada, alevler camın altındadır',
  points: { window: [0, 0], loaf: [0, 25], flame: [0, 52] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'alev ve ısı dalgası hızı çarpanı (1 = ~0.45 sn alev titremesi)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // fırın gövdesi
    blob(-130, -100, 260, 200, 16, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-98, -84, 32, 9, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(66, 76, 56, 12, 6); ctx.fill();

    // kapı kolu
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(-70, -78); ctx.lineTo(70, -78); ctx.stroke();
    ctx.strokeStyle = k.rgba('panel2'); ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(-70, -78); ctx.lineTo(70, -78); ctx.stroke();
    // kontrol düğmeleri
    for (const kx of [-108, 108]) {
      ctx.fillStyle = line; ctx.beginPath(); ctx.arc(kx, -78, 10, 0, k.TAU); ctx.fill();
      ctx.fillStyle = body; ctx.beginPath(); ctx.arc(kx, -78, 7, 0, k.TAU); ctx.fill();
      ctx.strokeStyle = k.rgba('ink', 0.7); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(kx, -78); ctx.lineTo(kx + 5, -82); ctx.stroke();
    }

    // fırın camı (koyu iç)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-100, -62, 200, 127, 12); ctx.fill();
    ctx.fillStyle = k.rgba('ink'); ctx.beginPath(); k.rrect(-95, -57, 190, 117, 10); ctx.fill();
    // iç sıcak parıltı
    k.glow(0, 20, 70, 'yellow', 0.28);

    // alevler (somunun altında, titrek)
    const flame = (x, ph) => {
      const f = 1 + 0.18 * Math.sin(t * k.TAU / 0.45 * sp + ph) + 0.06 * k.noise1(t * 2 + ph);
      ctx.save(); ctx.translate(x, 62); ctx.scale(1, f);
      ctx.fillStyle = k.rgba('yellow', 0.95);
      ctx.beginPath();
      ctx.moveTo(0, -26);
      ctx.quadraticCurveTo(14, -8, 12, 6);
      ctx.quadraticCurveTo(10, 18, 0, 18);
      ctx.quadraticCurveTo(-10, 18, -12, 6);
      ctx.quadraticCurveTo(-14, -8, 0, -26);
      ctx.fill();
      ctx.fillStyle = k.rgba('red', 0.9);
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.quadraticCurveTo(8, -4, 7, 6);
      ctx.quadraticCurveTo(5, 13, 0, 13);
      ctx.quadraticCurveTo(-5, 13, -7, 6);
      ctx.quadraticCurveTo(-8, -4, 0, -14);
      ctx.fill();
      ctx.restore();
    };
    flame(-38, 0); flame(0, 2.1); flame(38, 4.2);

    // somun (ızgara üstünde)
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-60, 2, 120, 46, 18); ctx.fill();
    ctx.fillStyle = k.rgba('yellow'); ctx.beginPath(); k.rrect(-55, 7, 110, 42, 16); ctx.fill();
    // somun üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, 14, 26, 6, 0, 0, k.TAU); ctx.fill();
    // somun kesikleri
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      const sx = -30 + i * 30;
      ctx.beginPath(); ctx.moveTo(sx - 8, 22); ctx.quadraticCurveTo(sx, 30, sx + 8, 24); ctx.stroke();
    }
    // ızgara çizgisi
    ctx.strokeStyle = k.rgba('ink', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-88, 52); ctx.lineTo(88, 52); ctx.stroke();

    // ısı dalgaları (somunun üstünde yükselir, döngüsel)
    for (let i = 0; i < 3; i++) {
      const wx = -48 + i * 48;
      const ph = (t * 0.55 * sp + i * 0.33) % 1;
      const yTop = -8 - ph * 42;
      const alpha = 0.55 * (1 - ph);
      ctx.strokeStyle = k.rgba('ink', alpha); ctx.lineWidth = 3;
      ctx.beginPath();
      for (let s = 0; s <= 8; s++) {
        const yy = -8 + (yTop + 8) * (s / 8);
        const xx = wx + 6 * Math.sin(s * 0.9 + t * 3 * sp + i * 2);
        s === 0 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    }
  },
};
