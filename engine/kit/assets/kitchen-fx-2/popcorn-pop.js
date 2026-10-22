// kitchen-fx-2/popcorn-pop — mısır kutusu: idle'da hafif sallanır + ısı dalgası; at anında mısırlar havaya patlar.
// NOT: canvas y-aşağıdır; kutu tabanı y≈110, patlayan mısırlar yukarı (+y'nin tersine) fırlar.
export default {
  name: 'popcorn-pop', category: 'kitchen-fx-2',
  desc: 'Mısır kutusu: at anında patlamış mısırlar havaya fırlar; boşta hafif sallantı ve ısı dalgası',
  tags: ['mısır', 'patlamış mısır', 'popcorn', 'sinema', 'atıştırmalık', 'kutu', 'patlama', 'popping corn', 'snack', 'cinema'],
  box: [-135, -205, 135, 130],
  bleed: 55,
  anchor: 'kutu tabanının merkezi (0,110)',
  points: { box: [0, 80], pile: [0, -70], pop_apex: [0, -180] },
  params: {
    at: { type: 'time', default: null, desc: 'patlama anı (1.0 sn): mısırlar havaya fırlar, ısı halkaları yayılır' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const popping = d >= 0 && d <= 1.0;
    const g = popping ? k.prog(d, 0, 1.0) : -1;

    // mısır pufu yardımcısı: 4 dairelik kabarık parça
    const puff = (x, y, r, alpha) => {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = k.rgba('yellow', alpha);
      const off = [[0, 0, 1], [-0.55, 0.25, 0.68], [0.55, 0.2, 0.72], [0.05, -0.55, 0.62]];
      for (let j = 0; j < off.length; j++) {
        ctx.beginPath(); ctx.arc(off[j][0] * r, off[j][1] * r, off[j][2] * r, 0, k.TAU); ctx.fill();
      }
      ctx.strokeStyle = k.rgba('bg', 0.55 * alpha); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, r * 1.02, 0, k.TAU); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${0.14 * alpha})`;
      ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.4, r * 0.38, 0, k.TAU); ctx.fill();
      ctx.restore();
    };

    // --- 1) kutu (hafif sallanır) + gölge
    const shake = popping ? Math.sin(d * 40) * 3 * (1 - g) : k.noise1(t * 3.1) * 1.6;
    ctx.save(); ctx.translate(shake, 0);
    const boxPath = () => {
      ctx.beginPath();
      ctx.moveTo(-108, -44); ctx.lineTo(108, -44);
      ctx.lineTo(88, 110); ctx.lineTo(-88, 110); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); boxPath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba(p.color, 1);
    boxPath(); ctx.fill();
    // dikey şeritler (ink, vurgu rengi değil)
    ctx.fillStyle = k.rgba('ink', 0.5);
    for (let i = -1; i <= 1; i++) {
      const cx = i * 66;
      ctx.beginPath();
      ctx.moveTo(cx - 15, -44); ctx.lineTo(cx + 15, -44);
      ctx.lineTo(cx + 11, 110); ctx.lineTo(cx - 11, 110); ctx.closePath(); ctx.fill();
    }
    // üst bant
    ctx.fillStyle = k.rgba('ink', 0.85);
    k.rrect(-114, -56, 228, 22, 8); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7;
    boxPath(); ctx.stroke();
    // sol üst parlama (premium finish)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-72, 20, 20, 52, 0.12, 0, k.TAU); ctx.fill();
    ctx.restore();

    // --- 2) üstteki mısır yığını (5 puf, hafif zıplar)
    const pileBase = [[-52, -58, 17], [-18, -72, 20], [20, -66, 18], [54, -56, 16], [2, -52, 15]];
    for (let i = 0; i < pileBase.length; i++) {
      const [px, py, pr] = pileBase[i];
      const hop = popping ? 0 : Math.abs(Math.sin(t * 2.4 + i * 1.7)) * 3;
      const popHop = popping ? Math.sin(Math.min(g * 3, 1) * Math.PI) * 14 * (1 - i * 0.12) : 0;
      puff(px, py - hop - popHop, pr, 1);
    }

    // --- 3) idle: ısı dalgaları (3 kıvrım, 3 sn döngüde yükselir)
    if (!popping) {
      for (let i = 0; i < 3; i++) {
        const cyc = 3, ph = ((t + i * 1.05) % cyc) / cyc;
        const sx = -46 + i * 46;
        const wob = k.noise1(t * 2 + i * 9) * 10;
        const y0 = -90 - ph * 70;
        ctx.strokeStyle = k.rgba('ink', 0.5 * Math.sin(ph * Math.PI));
        ctx.lineWidth = 5 * (1 - ph * 0.5);
        ctx.beginPath();
        ctx.moveTo(sx, -90);
        ctx.bezierCurveTo(sx + wob - 12, y0 + 22, sx - wob + 12, y0 - 4, sx + wob * 0.5, y0 - 22);
        ctx.stroke();
      }
    }

    // --- 4) at olayı: mısır yağmuru (10 parça, 1.0 sn parabola)
    if (popping) {
      k.glow(0, -90, 80 * (1 - g) + 24, 'yellow', 0.45 * (1 - g));
      for (let i = 0; i < 10; i++) {
        const ang = -Math.PI / 2 + (k.hash(i * 3 + 5) - 0.5) * 2.2;
        const spd = 130 + k.hash(i * 3 + 7) * 110;
        const up = spd * k.E.outCubic(Math.min(g * 1.6, 1));
        const fall = 260 * Math.pow(Math.max(g - 0.35, 0) / 0.65, 2);
        const px = Math.cos(ang) * up * 0.9 + (k.hash(i * 7 + 1) - 0.5) * 30;
        const py = -60 + Math.sin(ang) * up + fall;
        const fade = 1 - k.prog(g, 0.7, 1.0);
        if (fade > 0) puff(px, py, 10 + k.hash(i * 7 + 3) * 8, fade);
      }
      // patlama halkaları
      for (let i = 0; i < 2; i++) {
        const gi = k.prog(d - i * 0.12, 0, 0.7);
        if (gi > 0) {
          ctx.strokeStyle = k.rgba('yellow', 0.6 * (1 - gi));
          ctx.lineWidth = 6 * (1 - gi) + 2;
          ctx.beginPath(); ctx.arc(0, -80, 20 + gi * 90, 0, k.TAU); ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
};
