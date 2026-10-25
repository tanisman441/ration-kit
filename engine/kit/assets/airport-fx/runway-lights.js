// airport-fx/runway-lights — pist ışıkları döngüsel yanıp söner; ışık dalgası pist boyunca akar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) pistin merkezidir.
export default {
  name: 'runway-lights', category: 'airport-fx',
  desc: 'Pist kenar ışıkları sırayla yanıp söner; sarı ışık dalgası pistin bir ucundan diğerine akar',
  tags: ['pist', 'ışık', 'uçak pisti', 'iniş', 'kalkış', 'havalimanı', 'runway', 'lights', 'landing', 'takeoff', 'airport', 'airfield'],
  box: [-165, -85, 165, 85],
  bleed: 25,
  anchor: 'pistin merkezi (0,0); ışıklar pistin iki kenarındadır',
  points: { threshold: [-150, 0], centre: [0, 0], end: [150, 0] },
  params: {
    color: { type: 'color', default: 'dim' },
    speed: { type: 'number', default: 1, desc: 'ışık dalgasının akış hızı çarpanı (1 = ~2.4 sn bir geçiş)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const sp = p.speed || 1;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // pist gövdesi
    blob(-165, -26, 330, 52, 10, k.rgba(p.color));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-140, -18, 26, 5, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(96, 14, 56, 8, 4); ctx.fill();

    // orta çizgi (kesik)
    ctx.fillStyle = k.rgba('ink', 0.6);
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); k.rrect(-152 + i * 40, -3, 24, 6, 3); ctx.fill();
    }

    // eşik çizgileri (iki uçta)
    ctx.fillStyle = k.rgba('ink', 0.55);
    for (let j = -1; j <= 1; j++) {
      ctx.beginPath(); k.rrect(-158, j * 14 - 3, 10, 6, 3); ctx.fill();
      ctx.beginPath(); k.rrect(148, j * 14 - 3, 10, 6, 3); ctx.fill();
    }

    // kenar ışıkları: dalga halinde yanıp söner
    const N = 11;
    for (let row = -1; row <= 1; row += 2) {
      for (let i = 0; i < N; i++) {
        const lx = -150 + i * 30;
        const ly = row * 26;
        // dalga fazı: soldan sağa akar, 2.4 sn bir geçiş
        const ph = (((t * sp) / 2.4 - i / N) % 1 + 1) % 1;
        const lit = ph < 0.3 ? 1 - ph / 0.3 * 0.4 : 0.12;
        ctx.fillStyle = line;
        ctx.beginPath(); ctx.arc(lx, ly, 8, 0, k.TAU); ctx.fill();
        ctx.fillStyle = lit > 0.5 ? k.rgba('yellow') : k.rgba('dim');
        ctx.beginPath(); ctx.arc(lx, ly, 5.5, 0, k.TAU); ctx.fill();
        if (lit > 0.5) k.glow(lx, ly, 14, 'yellow', 0.45 * lit);
      }
    }

    // pist başındaki yaklaşma ışıkları (sabit nabız)
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.6 * sp);
    ctx.fillStyle = k.rgba('yellow', 0.5 + 0.4 * pulse);
    ctx.beginPath(); ctx.arc(-150, -44, 5, 0, k.TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(-150, 44, 5, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
