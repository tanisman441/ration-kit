// library-fx/dust-mote-drift — güneş ışını içinde toz zerreleri döngüsel olarak süzülür.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) = sahne merkezi.
export default {
  name: 'dust-mote-drift', category: 'library-fx',
  desc: 'Kütüphane güneş ışını içinde toz zerreleri döngüsel olarak süzülür ve parıldar',
  tags: ['toz', 'güneş', 'ışın', 'kütüphane', 'süzülme', 'hava', 'dust', 'sunbeam', 'library', 'motes', 'drift'],
  box: [-185, -125, 185, 125],
  bleed: 30,
  anchor: 'sahne merkezi (ışın ortası)',
  points: { beamTop: [-60, -110], beamBottom: [80, 110] },
  params: {
    density: { type: 'number', default: 0.7, desc: 'toz zerresi yoğunluğu (0–1)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    const dens = Math.max(0.1, Math.min(1, p.density));
    ctx.save();
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-180, 78, 360, 42, 10); ctx.fill();
    ctx.fillStyle = k.rgba('dim', 1); ctx.beginPath(); k.rrect(-176, 82, 352, 34, 10); ctx.fill();
    for (let i = 0; i < 12; i++) {
      const bx = -168 + i * 29;
      ctx.fillStyle = k.rgba(i % 3 === 0 ? 'panel2' : 'ink', 0.8);
      ctx.beginPath(); k.rrect(bx, 84, 18, 30, 4); ctx.fill();
    }
    ctx.fillStyle = k.rgba('yellow', 0.14);
    ctx.beginPath();
    ctx.moveTo(-120, -120); ctx.lineTo(-20, -120); ctx.lineTo(150, 120); ctx.lineTo(40, 120);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 0.10);
    ctx.beginPath();
    ctx.moveTo(-70, -120); ctx.lineTo(-40, -120); ctx.lineTo(110, 120); ctx.lineTo(70, 120);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-120, -120); ctx.lineTo(-20, -120); ctx.stroke();
    const n = Math.round(6 + 12 * dens);
    for (let i = 0; i < n; i++) {
      const cyc = 7, ph = ((t / cyc) + k.hash(i * 7 + 1)) % 1;
      const ax = k.lerp(-80, 100, ph) + k.noise1(i * 3 + t * 0.5) * 18;
      const ay = k.lerp(-110, 105, ph);
      const tw = 0.5 + 0.5 * Math.sin(t * 2.5 + k.hash(i * 11 + 2) * k.TAU);
      const r = 2 + k.hash(i * 13 + 3) * 3.5;
      ctx.fillStyle = k.rgba('yellow', 0.35 + 0.5 * tw);
      ctx.beginPath(); ctx.arc(ax, ay, r, 0, k.TAU); ctx.fill();
      if (tw > 0.85) {
        ctx.strokeStyle = k.rgba('yellow', 0.7 * tw); ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax - r * 2, ay); ctx.lineTo(ax + r * 2, ay);
        ctx.moveTo(ax, ay - r * 2); ctx.lineTo(ax, ay + r * 2);
        ctx.stroke();
      }
    }
    for (let i = 0; i < 3; i++) {
      const ph = ((t / 11) + k.hash(i * 17 + 9)) % 1;
      ctx.fillStyle = k.rgba('dim', 0.5);
      ctx.beginPath(); ctx.arc(-150 + ph * 300, -80 + k.noise1(i * 5 + t * 0.4) * 20 + ph * 120, 2.5, 0, k.TAU); ctx.fill();
    }
    ctx.restore();
  },
};
