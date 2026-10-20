// social-fx/view-count-up — izlenme sayacı: göz ikonu + yedi parçalı sayaç.
// at anında sayaç tıkır tıkır artar, üstte "+n" yükselir. Boşta göz kırpar.
export default {
  name: 'view-count-up', category: 'social-fx',
  desc: 'Eye icon above a 7-segment counter that ticks upward on the count moment',
  tags: ['izlenme', 'views', 'görüntülenme', 'sayaç', 'counter', 'göz', 'eye', 'izleyici', 'viewer'],
  box: [-130, -110, 130, 110],
  bleed: 50,
  anchor: 'göz ile sayaç arası merkez',
  points: { eye: [0, -55], counter: [0, 45] },
  params: {
    at: { type: 'time', default: null, desc: 'sayım anı: sayaç artar + artı işareti yükselir (0.8 sn)' },
    color: { type: 'color', default: 'accent' },
    start: { type: 'number', default: 1280, desc: 'başlangıç sayısı (0-9999)' },
    step: { type: 'number', default: 137, desc: 'at anında eklenen izlenme (1-999)' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    const d = p.at == null ? -1 : t - p.at;
    const col = p.color;
    const base = Math.max(0, Math.min(9999, Math.round(p.start)));
    const add = Math.max(1, Math.min(999, Math.round(p.step)));

    // sayaç değeri — at sırasında tıkırdar
    let val = base;
    if (d >= 0 && d <= 0.8) {
      const g = k.prog(d, 0, 0.8);
      val = base + Math.round(add * k.E.outExpo(g));
    }

    // 1) göz — 3.6 sn'de bir kırpar (0.12 sn)
    const bt = (t % 3.6);
    const blink = bt < 0.12 ? Math.sin(Math.PI * bt / 0.12) : 0;
    const eyeH = 46 * (1 - blink);
    ctx.save(); ctx.translate(0, -55);
    // gölge
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath();
    ctx.moveTo(-64 + 6, 6); ctx.quadraticCurveTo(6, -52 + 6, 76 + 6, 6);
    ctx.quadraticCurveTo(6, 52 + 6, -64 + 6, 6); ctx.fill();
    // beyaz göz
    ctx.fillStyle = k.rgba('panel2', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(-64, 0); ctx.quadraticCurveTo(0, -eyeH, 64, 0);
    ctx.quadraticCurveTo(0, eyeH, -64, 0);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // bebek — boşta hafif gezinir
    const px = 12 * k.noise1(t * 0.4), py = 6 * k.noise1(t * 0.53 + 5);
    if (blink < 0.9) {
      ctx.fillStyle = k.rgba(col, 1);
      ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(px, py, 16 * (1 - blink * 0.5), 0, k.TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.arc(px - 5, py - 6, 5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();

    // 2) sayaç paneli — 7 parçalı basamaklar
    const SEGS = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
    const dw = 34, dh = 56, gap = 12, th2 = 8;
    const digits = String(val).padStart(4, '0').split('');
    const pw = digits.length * (dw + gap) - gap + 40;
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); k.rrect(-pw / 2 + 6, 45 - 44 + 6, pw, 88, 16); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 7;
    ctx.beginPath(); k.rrect(-pw / 2, 1, pw, 88, 16); ctx.fill(); ctx.stroke();

    const segRect = (x0, y0, w, h) => { ctx.beginPath(); k.rrect(x0, y0, w, h, th2 / 2); ctx.fill(); };
    digits.forEach((ch, di) => {
      const dx = -((digits.length - 1) * (dw + gap)) / 2 + di * (dw + gap);
      const lit = SEGS[ch] || '';
      const on = 'abcdefg'.split('');
      for (const sg of on) {
        const isLit = lit.indexOf(sg) >= 0;
        ctx.fillStyle = isLit ? k.rgba(col, 1) : k.rgba('bg', 0.22);
        switch (sg) {
          case 'a': segRect(dx, 14, dw, th2); break;
          case 'b': segRect(dx + dw - th2, 14, th2, dh / 2 - 4); break;
          case 'c': segRect(dx + dw - th2, 14 + dh / 2, th2, dh / 2 - 4); break;
          case 'd': segRect(dx, 14 + dh - th2, dw, th2); break;
          case 'e': segRect(dx, 14 + dh / 2, th2, dh / 2 - 4); break;
          case 'f': segRect(dx, 14, th2, dh / 2 - 4); break;
          case 'g': segRect(dx, 14 + dh / 2 - th2 / 2, dw, th2); break;
        }
      }
    });

    // 3) "+n" yükselişi (0.8 sn)
    if (d >= 0 && d <= 0.8) {
      const g = k.prog(d, 0, 0.8);
      const yy = 30 - 55 * k.E.outExpo(g);
      ctx.fillStyle = k.rgba(col, 1 - g);
      ctx.strokeStyle = k.rgba('bg', 0.5 * (1 - g)); ctx.lineWidth = 4;
      // artı işareti
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(88, yy - 8); ctx.lineTo(88, yy + 8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(80, yy); ctx.lineTo(96, yy); ctx.stroke();
    }
    ctx.restore();
  },
};
