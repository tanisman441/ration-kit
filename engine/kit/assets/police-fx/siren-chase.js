// police-fx/siren-chase — polis aracı kovalamaca: çakarlar dönüşümlü yanar (~1 sn), gövde hafif sarsılır, arkada hız çizgileri.
// NOT: canvas y-aşağıdır; (0,0) gövde merkezi. Orijinal tasarım, düz vektör.
export default {
  name: 'siren-chase',
  category: 'police-fx',
  desc: 'Yandan görünüm polis arabası: kırmızı/mavi çakar yanıp söner, gövde sarsılır, hız çizgileri',
  tags: ['polis', 'araba', 'kovalamaca', 'çakar', 'siren', 'devriye', 'police', 'car', 'chase', 'siren', 'patrol'],
  box: [-155, -85, 155, 45],
  bleed: 55,
  anchor: 'gövde merkezi (0,0); tekerler altta',
  points: { lightbar: [0, -80], front: [150, -20], rear: [-150, -20] },
  params: {
    speed: { type: 'number', default: 1, desc: 'çakar hızı çarpanı (1 = ~1 sn periyot)' },
    chase: { type: 'time', default: null, desc: 'kovalamaca anı: hız çizgileri patlar, araç zıplar' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const O = k.rgba('bg', 0.55);
    const LW = 5;
    const col = k.rgba(p.color, 1);
    const ink = k.rgba('ink', 1);
    const w = k.TAU * k.clamp(p.speed, 0.2, 4);

    // kovalamaca patlaması: hız çizgileri arkada belirir, araç hafif öne zıplar (time olayı ~0.5 sn)
    const d = p.chase == null ? -1 : t - p.chase;
    const ch = d >= 0 && d < 0.8 ? 1 - d / 0.8 : 0;
    const jump = d >= 0 && d < 0.5 ? -10 * Math.sin((d / 0.5) * Math.PI) : 0;
    // idle sarsıntı (canlı): gövde titrer
    const shake = k.noise1(t * 9) * 1.6;
    ctx.translate(0, shake + jump);

    // hız çizgileri (chase anında; bleed içinde kalır)
    if (ch > 0) {
      ctx.strokeStyle = k.rgba('ink', 0.55 * ch);
      ctx.lineWidth = 5;
      for (let i = 0; i < 5; i++) {
        const y = -55 + i * 22 + k.hash(i * 7 + 3) * 8;
        const x0 = Math.max(-205, -205 + k.hash(i * 5 + 1) * 50 - d * 60);
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 55, y); ctx.stroke();
      }
    }

    const blob = (x, y, wd, h, r, c = col) => {
      ctx.fillStyle = O; k.rrect(x - LW / 2, y - LW / 2, wd + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; k.rrect(x, y, wd, h, r); ctx.fill();
    };

    // gövde
    blob(-120, -58, 240, 56, 18);
    // kabin
    blob(-58, -78, 116, 34, 12);
    // camlar
    ctx.fillStyle = k.rgba('bg', 0.85);
    k.rrect(-48, -74, 50, 26, 8); ctx.fill();
    k.rrect(10, -74, 38, 26, 8); ctx.fill();
    // kapı bandı (vurgu şeridi)
    ctx.fillStyle = k.rgba('red', 0.9);
    k.rrect(-120, -40, 240, 12, 6); ctx.fill();

    // tekerler (dönen jantlar)
    const wheel = (x) => {
      ctx.fillStyle = O; ctx.beginPath(); ctx.arc(x, 8, 26, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 1); ctx.beginPath(); ctx.arc(x, 8, 22, 0, k.TAU); ctx.fill();
      const spin = t * 14;
      ctx.strokeStyle = k.rgba('dim', 1); ctx.lineWidth = 5;
      for (let i = 0; i < 3; i++) {
        const a = spin + i * k.TAU / 3;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 12, 8 + Math.sin(a) * 12);
        ctx.lineTo(x - Math.cos(a) * 12, 8 - Math.sin(a) * 12); ctx.stroke();
      }
    };
    wheel(-72); wheel(72);

    // far
    ctx.fillStyle = k.rgba('yellow', 0.9);
    ctx.beginPath(); ctx.arc(122, -44, 8, 0, k.TAU); ctx.fill();
    k.glow(122, -44, 20, 'yellow', 0.3);

    // çakar kubbesi: dönüşümlü kırmızı/cyan (~1 sn periyot, canlı idle)
    const rA = Math.max(0, Math.cos(t * w));
    const bA = Math.max(0, -Math.cos(t * w));
    const R = 16, CY = -82;
    k.glow(-14, CY, 60, 'red', 0.5 * rA);
    k.glow(14, CY, 60, 'cyan', 0.5 * bA);
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.beginPath(); ctx.arc(0, CY, R, Math.PI, k.TAU); ctx.closePath(); ctx.fill();
    const half = (a0, a1, c2, al) => {
      ctx.fillStyle = k.rgba(c2, al);
      ctx.beginPath(); ctx.moveTo(0, CY); ctx.arc(0, CY, R, a0, a1); ctx.closePath(); ctx.fill();
    };
    half(Math.PI, Math.PI * 1.5, 'red', 0.15 + 0.75 * rA);
    half(Math.PI * 1.5, k.TAU, 'cyan', 0.15 + 0.75 * bA);
    ctx.strokeStyle = O; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, CY, R, Math.PI, k.TAU); ctx.closePath(); ctx.stroke();
    // direk
    ctx.fillStyle = ink; k.rrect(-8, CY - 4, 16, 14, 4); ctx.fill();

    // premium parlama: gövde sol üst
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-75, -52, 46, 12, -0.25, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('bg', 0.12);
    k.rrect(-110, -14, 220, 12, 6); ctx.fill();

    ctx.restore();
  },
};
