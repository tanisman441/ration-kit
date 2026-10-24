// art-fx/brush-stroke — fırça darbesi: fırça soldan sağa boya izi çeker.
// at anında (0.9 sn) iz uzar; öncesinde fırça havada bekler, sonrasında iz kalır.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = iz bandının merkezi.
export default {
  name: 'brush-stroke', category: 'art-fx',
  desc: 'Boya fırçası soldan sağa uzayan dalgalı bir boya izi çeker',
  tags: ['fırça', 'boya', 'resim', 'iz', 'sanat', 'brush', 'paint', 'stroke', 'painting', 'art'],
  box: [-175, -150, 175, 115],
  bleed: 15,
  anchor: 'iz bandının merkezi (0,0)',
  points: { stroke_start: [-120, 0], stroke_end: [120, 0] },
  params: {
    color: { type: 'color', default: 'accent', desc: 'boya rengi' },
    at: { type: 'time', default: null, desc: 'fırça darbesi anı (0.9 sn: iz uzar)' },
  },
  draw(ctx, t, p, k) {
    const LW = 9;
    const line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const g = k.prog(d, 0, 0.9);
    const e = 1 - Math.pow(1 - g, 3);
    const X0 = -120, X1 = 120;
    const tipX = X0 + (X1 - X0) * e;
    const cy = x => 8 * Math.sin(x * 0.045) + 4 * Math.sin(x * 0.013 + 1.7);
    const hh = x => 13 + 3 * k.noise1(x * 0.05 + 3);

    ctx.save();
    ctx.beginPath(); ctx.rect(-190, -165, 380, 295); ctx.clip();
    ctx.lineCap = 'round';

    // boya izi: dalgalı bant, darbe ilerledikçe uzar
    if (d >= 0 && g > 0.005) {
      ctx.beginPath();
      const steps = 44;
      for (let i = 0; i <= steps; i++) {
        const x = X0 + (tipX - X0) * (i / steps);
        const y = cy(x) - hh(x);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      for (let i = steps; i >= 0; i--) {
        const x = X0 + (tipX - X0) * (i / steps);
        ctx.lineTo(x, cy(x) + hh(x));
      }
      ctx.closePath();
      ctx.fillStyle = k.rgba(p.color, 0.92); ctx.fill();
      // ıslak parlama: bandın ortasında ince açık şerit
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = X0 + (tipX - X0) * (i / steps);
        const y = cy(x) - hh(x) * 0.35;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 5; ctx.stroke();
      // damlalar: iz geride kalmış noktalarda
      for (let i = 0; i < 3; i++) {
        const dx = -100 + i * 70 + (k.hash(i * 13 + 5) - 0.5) * 30;
        if (dx < tipX - 12) {
          ctx.fillStyle = k.rgba(p.color, 0.9);
          ctx.beginPath(); ctx.arc(dx, cy(dx) + hh(dx) + 7, 5, 0, k.TAU); ctx.fill();
        }
      }
    } else if (d < 0) {
      // darbe öncesi: başlangıç noktasında küçük boya topağı
      ctx.fillStyle = k.rgba(p.color, 0.9);
      ctx.beginPath(); ctx.arc(X0, cy(X0), 8, 0, k.TAU); ctx.fill();
    }

    // fırça: darbe sırasında iz ucunda, öncesinde/sonrasında havada
    const moving = d >= 0 && d < 0.9;
    const bx = moving ? tipX : (d >= 0.9 ? X1 : X0);
    const by = moving ? cy(tipX) - 4 : cy(bx) - 34 + 4 * Math.sin(t * 2.2);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(0.4);
    // sap (dim)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-9 - LW / 2, -124 - LW / 2, 18 + LW, 86 + LW, 9); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1);
    ctx.beginPath(); k.rrect(-9, -124, 18, 86, 9); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-4, -95, 4.5, 26, 0.1, 0, k.TAU); ctx.fill();
    // yüksük (metal)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-13 - LW / 2, -40 - LW / 2, 26 + LW, 26 + LW, 6); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.9);
    ctx.beginPath(); k.rrect(-13, -40, 26, 26, 6); ctx.fill();
    // kıl demeti (boya rengi)
    ctx.fillStyle = line;
    ctx.beginPath();
    ctx.moveTo(-13, -16); ctx.quadraticCurveTo(-7, -6, 0, 3);
    ctx.quadraticCurveTo(7, -6, 13, -16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.moveTo(-10.5, -15); ctx.quadraticCurveTo(-5.5, -6, 0, 1);
    ctx.quadraticCurveTo(5.5, -6, 10.5, -15); ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.restore();
  },
};
