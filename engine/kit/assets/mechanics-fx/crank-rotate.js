// mechanics-fx/crank-rotate — mil üzerindeki krank kolu: tekerlek + döner kol + tutamak.
// crank (zaman): tam tur anı; 0.9 sn içinde hızlı tam tur atar, hız çizgileri çıkar.
// crank verilmezse kol yavaşça döner (canlı idle).
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) mil merkezidir.
export default {
  name: 'crank-rotate', category: 'mechanics-fx',
  desc: 'Döner krank kolu; crank anında hızlı tam tur atar',
  tags: ['krank', 'kol', 'çevirme', 'mekanik', 'mil', 'crank', 'handle', 'rotate', 'machine', 'mechanism'],
  box: [-100, -100, 100, 100],
  bleed: 26,
  anchor: 'mil merkezi (0,0)',
  points: { hub: [0, 0] },
  params: {
    color: { type: 'color', default: 'ink' },
    crank: { type: 'time', default: null, desc: 'tam tur anı (0.9 sn hızlı dönüş)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const d = p.crank == null ? -1 : t - p.crank;
    const burst = d >= 0 && d < 0.9;                 // hızlı tur penceresi
    const turnQ = burst ? k.E.inOutCubic(k.clamp(d / 0.9, 0, 1)) : 0;
    const idleA = t * 0.7;                           // idle yavaş dönüş
    const ang = idleA + turnQ * k.TAU;               // tam tur olayı

    // tekerlek jantı
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 64 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, 0, 64, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.arc(0, 0, 50, 0, k.TAU); ctx.fill();
    // gölge (sağ alt)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.beginPath(); ctx.arc(5, 6, 46, 0.6, 2.2); ctx.fill();

    ctx.save();
    ctx.rotate(ang);

    // iç kollar (dönen)
    ctx.lineWidth = 10; ctx.strokeStyle = k.rgba('dim');
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * k.TAU;
      ctx.beginPath();
      ctx.moveTo(14 * Math.cos(a), 14 * Math.sin(a));
      ctx.lineTo(46 * Math.cos(a), 46 * Math.sin(a));
      ctx.stroke();
    }

    // krank kolu (mil merkezinden dışa)
    const hx = 78 * Math.cos(0), hy = 78 * Math.sin(0);   // tutamak merkezi (kol açısı = dönüş)
    ctx.lineWidth = 18; ctx.strokeStyle = line;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.lineWidth = 12; ctx.strokeStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(hx, hy); ctx.stroke();

    // tutamak (dik silindir)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(hx, hy, 15 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(hx, hy, 15, 0, k.TAU); ctx.fill();
    // tutamak üst parlama
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.ellipse(hx - 5, hy - 6, 6, 4, -0.5, 0, k.TAU); ctx.fill();

    ctx.restore();

    // mil (sabit)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, 0, 13 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('bg', 0.7);
    ctx.beginPath(); ctx.arc(0, 0, 13, 0, k.TAU); ctx.fill();

    // hızlı turda hız yayları
    if (burst) {
      const q = Math.sin(Math.PI * k.clamp(d / 0.9, 0, 1));
      ctx.lineWidth = 4; ctx.strokeStyle = k.rgba('ink', 0.55 * q);
      for (let i = 0; i < 3; i++) {
        const rr = 84 + i * 9;
        ctx.beginPath(); ctx.arc(0, 0, rr, ang - 1.6, ang - 0.5); ctx.stroke();
      }
    }

    // premium parlama (sol üst jant)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-38, -44, 24, 13, -0.5, 0, k.TAU); ctx.fill();
  },
};
