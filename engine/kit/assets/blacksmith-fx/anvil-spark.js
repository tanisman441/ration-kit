// blacksmith-fx/anvil-spark — örs üzerinde kızgın iş parçası; sürekli kıvılcım sıçrar, `at` anında büyük patlama. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) örs tablası / kıvılcım kaynağı.
export default {
  name: 'anvil-spark', category: 'blacksmith-fx',
  desc: 'Örs üzerinde kızgın demir; sürekli küçük kıvılcımlar sıçrar, olay anında büyük kıvılcım patlaması olur',
  tags: ['demirci', 'örs', 'kıvılcım', 'sıçrama', 'dövme', 'blacksmith', 'anvil', 'spark', 'forge', 'metal'],
  box: [-130, -100, 130, 100],
  bleed: 60,
  anchor: 'örs tablası merkezi / kıvılcım kaynağı (0,0)',
  points: { spark: [0, -6], anvil: [0, 55], workpiece: [0, -10] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'büyük kıvılcım patlaması anı (0.8 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const burst = d >= 0 && d < 0.8;
    const env = burst ? Math.sin(Math.min(d / 0.8, 1) * Math.PI) : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // örs
    ctx.fillStyle = k.rgba('bg', 0.32);
    ctx.beginPath(); k.rrect(-96, 0, 192, 26, 10); ctx.fill();
    blob(-96, 2, 192, 26, 10, body);
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-72, 8, 18, 5, 0, 0, k.TAU); ctx.fill();
    // boynuz (sivri uç, solda)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(-96, 4); ctx.lineTo(-128, 12); ctx.lineTo(-96, 24); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(-92, 7); ctx.lineTo(-120, 13); ctx.lineTo(-92, 21); ctx.closePath(); ctx.fill();
    // gövde + taban
    ctx.fillStyle = line; ctx.beginPath(); k.rrect(-40, 28, 80, 40, 8); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); k.rrect(-35, 30, 70, 36, 8); ctx.fill();
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(-18, 62, 70, 10, 5); ctx.fill();
    blob(-60, 66, 120, 22, 8, k.rgba('panel2'));

    // kızgın iş parçası (nabız gibi parlar)
    const pulse = 0.6 + 0.4 * Math.sin(t * k.TAU / 1.4);
    const hot = burst ? 1 : pulse;
    k.glow(0, -10, 40, 'red', 0.3 * hot);
    ctx.fillStyle = k.rgba('yellow', 0.3 + 0.5 * hot);
    ctx.beginPath(); k.rrect(-52, -16, 104, 13, 6); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.9);
    ctx.beginPath(); k.rrect(-52, -16, 104, 5, 6); ctx.fill();

    // sürekli kıvılcım yağmuru (döngüsel, her kıvılcım kendi periyodunda)
    for (let i = 0; i < 9; i++) {
      const dur = 0.9 + k.hash(i + 80) * 0.5;
      const cyc = (t / dur + k.hash(i)) % 1;
      const a = k.hash(i + 40) * 1.9 - 0.95 - Math.PI / 2;
      const dist = 6 + cyc * 44;
      const sx = Math.cos(a) * dist;
      const sy = Math.sin(a) * dist * 0.75 + cyc * cyc * 30;
      ctx.strokeStyle = k.rgba('yellow', 0.9 * (1 - cyc));
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * 8, sy + Math.sin(a) * 8); ctx.stroke();
    }

    // büyük patlama
    if (burst) {
      k.glow(0, -8, 40 + env * 30, 'yellow', 0.6 * env);
      for (let i = 0; i < 16; i++) {
        const prog = k.clamp((d - k.hash(i + 100) * 0.12) / 0.6, 0, 1);
        if (prog <= 0) continue;
        const a = k.hash(i + 130) * k.TAU - Math.PI / 2;
        const dist = 14 + prog * (30 + k.hash(i + 160) * 52);
        const sx = Math.cos(a) * dist;
        const sy = Math.sin(a) * dist * 0.7 + prog * prog * 30;
        ctx.strokeStyle = k.rgba('yellow', 0.95 * (1 - prog));
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + Math.cos(a) * 10, sy + Math.sin(a) * 10); ctx.stroke();
      }
    }
  },
};
