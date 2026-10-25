// observatory-fx/planet-transit — `at` anında küçük bir gezegen güneş diskinin önünden geçer. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) güneş diskinin merkezi.
export default {
  name: 'planet-transit', category: 'observatory-fx',
  desc: 'Gezegen geçişi: karanlık gezegen soldan gelip parlak güneşin önünden geçer, kenarında ince ışık halkası belirir',
  tags: ['gezegen', 'geçiş', 'güneş', 'transit', 'astronomi', 'planet', 'transit', 'sun', 'astronomy', 'venus'],
  box: [-140, -95, 140, 95],
  bleed: 30,
  anchor: 'güneş diskinin merkezi (0,0)',
  points: { sun: [0, 0], transit: [0, -10] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'geçiş anı — gezegen güneşin tam ortasından geçer (2.4 sn sürer)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const R = 72;
    const py = -10; // geçiş çizgisi (güneş merkezinin biraz üstü)
    // gezegen x: at-1.2 ile at+1.2 arasında soldan sağa kayar; kutu kenarında söner
    const prog = p.at == null ? -1 : k.prog(t, p.at - 1.2, p.at + 1.2);
    const px = p.at == null ? -170 : k.lerp(-120, 120, prog);
    const planetA = p.at == null ? 0 : k.clamp(1 - (Math.abs(px) - 100) / 20, 0, 1);
    const overSun = Math.abs(px) < R && Math.abs(py) < R;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // güneş halesi: hafif nabız (idle)
    k.glow(0, 0, 115, 'yellow', 0.22 + 0.06 * Math.sin(t * 1.8));

    // güneş ışınları: yavaşça döner (idle)
    ctx.strokeStyle = k.rgba('yellow', 0.7); ctx.lineWidth = 5;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * k.TAU + t * 0.05;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (R + 8), Math.sin(a) * (R + 8));
      ctx.lineTo(Math.cos(a) * (R + 22), Math.sin(a) * (R + 22));
      ctx.stroke();
    }

    // güneş diski
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); ctx.arc(4, 5, R, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, R + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.arc(0, 0, R, 0, k.TAU); ctx.fill();
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-28, -32, 20, 13, -0.5, 0, k.TAU); ctx.fill();
    // güneş yüzü benekleri: hafif nabız
    ctx.fillStyle = k.rgba('red', 0.22);
    for (let i = 0; i < 6; i++) {
      const bx = (k.hash(i + 50) - 0.5) * 84;
      const by = (k.hash(i + 60) - 0.5) * 84;
      if (Math.abs(bx) > 60 || Math.abs(by) > 60) continue;
      ctx.beginPath(); ctx.arc(bx, by, 5 + 2 * Math.sin(t * 2 + i * 1.7), 0, k.TAU); ctx.fill();
    }

    // gezegen: koyu siluet, güneşin üstündeyken kenarında ince ışık halkası
    if (planetA > 0.02) {
      const pr = 17;
      ctx.fillStyle = k.rgba('bg', 0.32 * planetA);
      ctx.beginPath(); ctx.arc(px + 3, py + 4, pr, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('bg', 0.55 * planetA);
      ctx.beginPath(); ctx.arc(px, py, pr + LW / 2, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('dim', planetA);
      ctx.beginPath(); ctx.arc(px, py, pr, 0, k.TAU); ctx.fill();
      // gezegen yüzeyi: hafif detay
      ctx.fillStyle = k.rgba('ink', 0.4 * planetA);
      ctx.beginPath(); ctx.arc(px - 5, py - 4, 4, 0, k.TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 6, py + 5, 3, 0, k.TAU); ctx.fill();
      // ışık halkası (güneşin üstündeyken)
      if (overSun) {
        ctx.strokeStyle = k.rgba('yellow', 0.85 * planetA);
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(px, py, pr + 1.5, 0, k.TAU); ctx.stroke();
      }
      // geçiş çizgisi: gezegenin yörüngesini belli eden ince noktalı hat
      ctx.strokeStyle = k.rgba('panel2', 0.3); ctx.lineWidth = 2;
      ctx.setLineDash([2, 8]);
      ctx.beginPath(); ctx.moveTo(-132, py); ctx.lineTo(132, py); ctx.stroke();
      ctx.setLineDash([]);
    }
  },
};
