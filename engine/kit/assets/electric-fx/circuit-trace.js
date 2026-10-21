// electric-fx/circuit-trace — devre kartında yol boyunca akan ışık nabzı.
// ANIMASYON: canlı idle — 2.6 sn döngüyle izler boyunca akan cyan nabız ışığı;
// `pulse` anında ikinci bir parlak nabız dalgası (0.6 sn). Tek vurgu: cyan.
// Contract: engine/kit/ASSETS.md
export default {
  name: 'circuit-trace',
  category: 'electric-fx',
  desc: 'Devre kartı; izler boyunca akan döngüsel nabız ışığı, pulse anında ekstra dalga',
  tags: ['devre', 'kart', 'elektronik', 'nabız', 'sinyal', 'çip', 'circuit', 'board', 'pcb', 'trace', 'pulse', 'signal', 'electronics'],
  box: [-100, -75, 100, 75],
  bleed: 40,
  anchor: 'kart merkezi (0,0)',
  points: { a: [-88, -30], b: [88, 35], chip: [40, -12], via: [-40, 10] },
  params: {
    pulse: { type: 'time', default: null, desc: 'ekstra nabız dalgası anı (0.6 sn parlak geçiş)' },
    color: { type: 'color', default: 'cyan' },
  },
  draw(ctx, t, p, k) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // --- kart: gölge, gövde, parlama, kontur ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(-94 + 6, -64 + 6, 188, 128, 18); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); k.rrect(-94, -64, 188, 128, 18); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(-64, -44, 24, 14, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 5;
    ctx.beginPath(); k.rrect(-94, -64, 188, 128, 18); ctx.stroke();

    // --- yollar (ink, ince) ---
    const paths = [
      [[-88, -30], [-40, -30], [-40, 10], [20, 10], [20, 35], [88, 35]],
      [[-88, 20], [-10, 20], [-10, -42], [52, -42]],
      [[20, -58], [20, 10]],
    ];
    for (const path of paths) {
      ctx.strokeStyle = k.rgba('ink', 0.32);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(path[0][0], path[0][1]);
      for (let i = 1; i < path.length; i++) ctx.lineTo(path[i][0], path[i][1]);
      ctx.stroke();
      for (let i = 1; i < path.length; i++) {   // köşe pad'leri
        ctx.fillStyle = k.rgba('ink', 0.45);
        ctx.beginPath(); ctx.arc(path[i][0], path[i][1], 3.5, 0, k.TAU); ctx.fill();
      }
    }
    // --- çip ---
    ctx.fillStyle = k.rgba('bg', 0.12);
    ctx.beginPath(); k.rrect(28 + 5, -26 + 5, 34, 28, 8); ctx.fill();
    ctx.fillStyle = k.rgba('dim');
    ctx.beginPath(); k.rrect(28, -26, 34, 28, 8); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.10);
    ctx.beginPath(); ctx.ellipse(38, -19, 8, 5, -0.4, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(28, -26, 34, 28, 8); ctx.stroke();
    // çip pinleri
    ctx.strokeStyle = k.rgba('ink', 0.5); ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); ctx.moveTo(28, -20 + i * 7); ctx.lineTo(20, -20 + i * 7); ctx.stroke();
    }

    // --- yol üzerinde nokta bul ---
    const segLen = [];
    const main = paths[0];
    let total = 0;
    for (let i = 1; i < main.length; i++) {
      const dx = main[i][0] - main[i - 1][0], dy = main[i][1] - main[i - 1][1];
      const L = Math.hypot(dx, dy);
      segLen.push(L); total += L;
    }
    const atLen = s => {
      for (let i = 0; i < segLen.length; i++) {
        if (s <= segLen[i]) {
          const u = s / segLen[i];
          return [k.lerp(main[i][0], main[i + 1][0], u), k.lerp(main[i][1], main[i + 1][1], u)];
        }
        s -= segLen[i];
      }
      return [main[main.length - 1][0], main[main.length - 1][1]];
    };

    // --- döngüsel nabız (idle): 2.6 sn ---
    const loop = (t / 2.6) % 1;
    const [lx, ly] = atLen(loop * total);
    k.glow(lx, ly, 26, p.color, 0.5);
    ctx.fillStyle = k.rgba(p.color, 0.95);
    ctx.beginPath(); ctx.arc(lx, ly, 6.5, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('#ffffff', 0.85);
    ctx.beginPath(); ctx.arc(lx, ly, 2.8, 0, k.TAU); ctx.fill();
    // kuyruk izi
    for (let i = 1; i <= 3; i++) {
      const bs = ((loop - i * 0.03) % 1 + 1) % 1;
      const [bx, by] = atLen(bs * total);
      ctx.fillStyle = k.rgba(p.color, 0.5 - i * 0.13);
      ctx.beginPath(); ctx.arc(bx, by, 5 - i, 0, k.TAU); ctx.fill();
    }

    // --- pulse anı: ekstra parlak dalga (0.6 sn) ---
    const d = p.pulse == null ? -1 : t - p.pulse;
    if (d >= 0 && d < 0.65) {
      const pr = k.prog(d, 0, 0.6);
      const [px, py] = atLen(pr * total);
      const env = Math.sin(pr * Math.PI);
      k.glow(px, py, 40, p.color, 0.5 * env);
      ctx.fillStyle = k.rgba('#ffffff', 0.95 * env);
      ctx.beginPath(); ctx.arc(px, py, 9, 0, k.TAU); ctx.fill();
    }
  },
};
