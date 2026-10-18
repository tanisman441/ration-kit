// music/note — havada süzülen sekizlik nota: oval baş + sap + bayrak.
// Süzülme (idle float) + baş üzerinde nabız gibi atan yumuşak parlama.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) notanın merkezidir.
export default {
  name: 'note', category: 'music',
  desc: 'Havada süzülen sekizlik müzik notası; başı üzerinde nabız gibi atan parlama',
  tags: ['nota', 'müzik notası', 'melodi', 'şarkı', 'note', 'music note', 'melody', 'song'],
  box: [-100, -100, 100, 100],
  bleed: 40,
  anchor: 'notanın merkezi (0,0)',
  points: { head: [-15, 45], top: [21, -70] },
  params: {
    color: { type: 'color', default: 'ink' },
    float: { type: 'number', default: 1, desc: 'süzülme hareketi yoğunluğu (0=kapalı)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    // süzülme: yukarı-aşağı + hafif salınım
    const f = k.clamp(p.float, 0, 1);
    ctx.translate(0, Math.sin(t * 1.9) * 8 * f);
    ctx.rotate(Math.sin(t * 1.4) * 0.04 * f);

    // baş üzerinde nabız gibi atan parlama
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    k.glow(-15, 45, 56, 'yellow', 0.10 + 0.22 * pulse * f);

    // nota başı (eğik oval): önce gölge, sonra kontur, sonra gövde
    const head = (cx, cy, rx, ry, rot, c) => {
      ctx.fillStyle = 'rgba(255,255,255,0.10)';
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, k.TAU); ctx.fill(); ctx.restore();
    };
    const drawHead = (cx, cy, rx, ry, rot) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
      // gölge (sağ alt, %12 koyultma)
      ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.ellipse(6, 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba('ink', 0.12); ctx.beginPath(); ctx.ellipse(6, 6, rx, ry, 0, 0, k.TAU); ctx.fill();
      // kontur + gövde
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(0, 0, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = k.rgba(p.color); ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, k.TAU); ctx.fill();
      ctx.restore();
    };
    drawHead(-15, 45, 34, 26, -0.35);
    head(-26, 34, 13, 9, -0.35, 'white'); // sol üst parlama

    // sap: kalın yuvarlak çizgi
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(23, 50); ctx.lineTo(23, -70); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(23, 50); ctx.lineTo(23, -70); ctx.stroke();

    // bayrak: sapın üstünden sağa kıvrılan kalın eğri
    ctx.strokeStyle = line; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(23, -70); ctx.quadraticCurveTo(78, -62, 64, 4); ctx.stroke();
    ctx.strokeStyle = body; ctx.lineWidth = 11;
    ctx.beginPath(); ctx.moveTo(23, -70); ctx.quadraticCurveTo(78, -62, 64, 4); ctx.stroke();

    ctx.restore();
  },
};
